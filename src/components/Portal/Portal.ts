/**
 * Portal Component
 *
 * A utility component that renders content outside the normal DOM hierarchy
 * while preserving event bubbling. Useful for modals, tooltips, dropdowns,
 * and other overlay components that need to escape container constraints.
 */

import type { PortalProps, PortalInstance, PortalContainer } from './Portal.types';
import './Portal.css';

/** Counter for generating unique IDs */
let portalIdCounter = 0;

/** Map to track all active portals for cleanup */
const activePortals = new Map<string, PortalInstance>();

/**
 * Resolves a portal target to an HTMLElement.
 * @param target - Target container (element, selector, or null)
 * @returns Resolved HTMLElement or document.body as fallback
 */
function resolveTarget(target: PortalContainer): HTMLElement {
  if (target === null || target === undefined) {
    return document.body;
  }

  if (typeof target === 'string') {
    const element = document.querySelector(target);
    if (element instanceof HTMLElement) {
      return element;
    }
    console.warn(`Portal: Target selector "${target}" not found, using document.body`);
    return document.body;
  }

  return target;
}

/**
 * Creates content element from string or HTMLElement.
 * @param content - Content to convert
 * @returns HTMLElement containing the content
 */
function createContentElement(content: HTMLElement | string): HTMLElement {
  if (typeof content === 'string') {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = content;
    // If content is a single element, return that element directly
    if (wrapper.children.length === 1 && wrapper.firstElementChild instanceof HTMLElement) {
      return wrapper.firstElementChild;
    }
    return wrapper;
  }
  return content;
}

/**
 * Creates a portal to render content outside the DOM hierarchy.
 *
 * Portals are essential for components like modals, tooltips, and dropdowns
 * that need to break out of parent containers with overflow:hidden or
 * z-index stacking contexts.
 *
 * @param props - Portal configuration options
 * @returns PortalInstance with methods for control
 *
 * @example
 * ```typescript
 * import { createPortal } from 'dosage';
 *
 * // Basic portal to document.body
 * const portal = createPortal({
 *   content: '<div>Portal Content</div>',
 *   onMount: () => console.log('Mounted!'),
 * });
 *
 * // Portal to specific target
 * const modalPortal = createPortal({
 *   content: modalElement,
 *   target: '#modal-root',
 * });
 *
 * // Later: cleanup
 * portal.destroy();
 * ```
 */
export function createPortal(props: PortalProps): PortalInstance {
  const {
    content,
    target = null,
    createContainer = true,
    containerClass,
    preserveEventBubbling = true,
    onMount,
    onUnmount,
    id,
    className,
  } = props;

  // Generate unique ID
  const portalId = id || `dos-portal-${++portalIdCounter}`;

  // State
  let isMounted = false;
  let currentTarget = resolveTarget(target);
  let contentElement = createContentElement(content);
  let originalParent: HTMLElement | null = null;

  // Create portal container
  const container = document.createElement('div');
  container.id = portalId;
  container.className = 'dos-portal';
  
  if (createContainer) {
    container.classList.add('dos-portal--container');
  }
  if (className) {
    container.classList.add(className);
  }
  if (containerClass) {
    container.classList.add(containerClass);
  }

  // Set up ARIA attributes
  container.setAttribute('data-dos-portal', 'true');

  // Store original parent for event bubbling preservation
  if (preserveEventBubbling && contentElement.parentElement) {
    originalParent = contentElement.parentElement;
  }

  /**
   * Handles events for bubbling preservation.
   * Re-dispatches events to the original parent context.
   */
  function handleEventBubbling(event: Event): void {
    if (!preserveEventBubbling || !originalParent || event.bubbles === false) {
      return;
    }

    // Clone and dispatch to original parent for semantic bubbling
    // This is a best-effort approach - not all events can be perfectly cloned
    const clonedEvent = new (event.constructor as typeof Event)(event.type, {
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      composed: event.composed,
    });

    // Copy custom event detail if present
    if (event instanceof CustomEvent && clonedEvent instanceof CustomEvent) {
      Object.defineProperty(clonedEvent, 'detail', {
        value: event.detail,
        writable: false,
      });
    }

    // Mark as portal-originated to prevent infinite loops
    (clonedEvent as Event & { _portalOriginated?: boolean })._portalOriginated = true;

    // Dispatch to original parent
    originalParent.dispatchEvent(clonedEvent);
  }

  /**
   * Sets up event bubbling preservation.
   */
  function setupEventBubbling(): void {
    if (!preserveEventBubbling || !originalParent) return;

    // Common events that might need bubbling
    const events = ['click', 'focus', 'blur', 'keydown', 'keyup', 'change', 'input'];
    
    events.forEach(eventType => {
      container.addEventListener(eventType, (e) => {
        // Avoid re-dispatching events that originated from portal
        if ((e as Event & { _portalOriginated?: boolean })._portalOriginated) return;
        handleEventBubbling(e);
      }, true);
    });
  }

  /**
   * Mounts the portal to the DOM.
   */
  function mount(): void {
    if (isMounted) return;

    // Append content to container
    container.appendChild(contentElement);

    // Append container to target
    currentTarget.appendChild(container);

    // Set up event bubbling if needed
    setupEventBubbling();

    isMounted = true;

    // Track active portal
    activePortals.set(portalId, instance);

    // Fire mount callback
    onMount?.();

    // Dispatch custom event
    container.dispatchEvent(new CustomEvent('dos:portal:mount', {
      bubbles: true,
      detail: { portalId },
    }));
  }

  /**
   * Unmounts the portal from the DOM.
   */
  function unmount(): void {
    if (!isMounted) return;

    // Remove from DOM
    if (container.parentElement) {
      container.parentElement.removeChild(container);
    }

    isMounted = false;

    // Fire unmount callback
    onUnmount?.();

    // Dispatch custom event
    container.dispatchEvent(new CustomEvent('dos:portal:unmount', {
      bubbles: false,
      detail: { portalId },
    }));
  }

  /**
   * Updates the portal content.
   */
  function setContent(newContent: HTMLElement | string): void {
    const newContentElement = createContentElement(newContent);

    // Replace content
    if (contentElement.parentElement === container) {
      container.replaceChild(newContentElement, contentElement);
    }

    contentElement = newContentElement;
  }

  /**
   * Moves the portal to a new target container.
   */
  function moveTo(newTarget: PortalContainer): void {
    const resolvedTarget = resolveTarget(newTarget);

    if (resolvedTarget === currentTarget) return;

    const wasMounted = isMounted;

    // Unmount from current target
    if (wasMounted) {
      unmount();
    }

    // Update target
    currentTarget = resolvedTarget;

    // Remount if was mounted
    if (wasMounted) {
      mount();
    }
  }

  /**
   * Destroys the portal and cleans up all resources.
   */
  function destroy(): void {
    unmount();

    // Remove from active portals
    activePortals.delete(portalId);

    // Clear references
    contentElement = null as unknown as HTMLElement;
    originalParent = null;
  }

  // Create instance object
  const instance: PortalInstance = {
    get element() {
      return container;
    },
    get content() {
      return contentElement;
    },
    get isMounted() {
      return isMounted;
    },
    setContent,
    moveTo,
    mount,
    unmount,
    destroy,
  };

  // Auto-mount by default
  mount();

  return instance;
}

/**
 * Gets all currently active portals.
 * @returns Array of active portal instances
 */
export function getActivePortals(): PortalInstance[] {
  return Array.from(activePortals.values());
}

/**
 * Gets a specific portal by ID.
 * @param portalId - ID of the portal to find
 * @returns Portal instance or undefined
 */
export function getPortalById(portalId: string): PortalInstance | undefined {
  return activePortals.get(portalId);
}

/**
 * Destroys all active portals.
 * Useful for cleanup during page transitions or testing.
 */
export function destroyAllPortals(): void {
  activePortals.forEach((portal) => {
    portal.destroy();
  });
  activePortals.clear();
}
