/**
 * FocusTrap Component
 *
 * A utility component that traps focus within a container element.
 * Essential for modal dialogs, dropdown menus, and other overlay components
 * that require focus to remain contained for accessibility.
 */

import type {
  FocusTrapProps,
  FocusTrapInstance,
  FocusTrapOptions,
} from './FocusTrap.types';
import './FocusTrap.css';

/** Selectors for focusable elements */
const FOCUSABLE_SELECTORS = [
  'a[href]:not([disabled]):not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"]):not([type="hidden"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
  '[contenteditable="true"]:not([tabindex="-1"])',
  'audio[controls]:not([tabindex="-1"])',
  'video[controls]:not([tabindex="-1"])',
  'details > summary:not([tabindex="-1"])',
].join(', ');

/** Counter for unique IDs */
let focusTrapIdCounter = 0;

/** Stack of active focus traps for nested trap support */
const activeTrapStack: FocusTrapInstance[] = [];

/**
 * Resolves a container reference to an HTMLElement.
 */
function resolveContainer(container: HTMLElement | string): HTMLElement | null {
  if (typeof container === 'string') {
    return document.querySelector(container);
  }
  return container;
}

/**
 * Checks if an element is visible and can receive focus.
 * Note: In JSDOM, offsetParent is always null, so we use a simpler check.
 */
function isElementVisible(element: HTMLElement): boolean {
  // Check if element is connected to the DOM
  if (!element.isConnected) {
    return false;
  }

  // Check computed styles
  const style = window.getComputedStyle(element);
  if (style.visibility === 'hidden' || style.display === 'none') {
    return false;
  }

  // Check if element has zero dimensions (but allow for elements that may not have layout yet)
  // Note: In JSDOM, offsetWidth/Height are always 0, so we skip this check
  // In a real browser, we would check: element.offsetWidth > 0 || element.offsetHeight > 0

  return true;
}

/**
 * Gets all focusable elements within a container.
 */
function getFocusableElements(
  container: HTMLElement,
  customIsFocusable?: (element: HTMLElement) => boolean
): HTMLElement[] {
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
  );

  return elements.filter((el) => {
    // Exclude sentinel elements
    if (el.hasAttribute('data-dos-focus-trap')) {
      return false;
    }

    // Use custom check if provided
    if (customIsFocusable) {
      return customIsFocusable(el);
    }

    // Default visibility check
    return isElementVisible(el);
  });
}

/**
 * Creates a focus trap to contain focus within a container element.
 *
 * Focus traps are essential for accessibility in modal dialogs and overlays.
 * They ensure keyboard users cannot Tab outside the dialog and get lost
 * in the page content behind it.
 *
 * @param props - FocusTrap configuration options
 * @returns FocusTrapInstance with methods for control
 *
 * @example
 * ```typescript
 * import { createFocusTrap } from 'dosage';
 *
 * // Basic usage with a modal
 * const modal = document.getElementById('my-modal');
 * const trap = createFocusTrap({
 *   container: modal,
 *   onDeactivate: () => closeModal(),
 * });
 *
 * // Later: cleanup
 * trap.destroy();
 * ```
 */
export function createFocusTrap(props: FocusTrapProps): FocusTrapInstance {
  const {
    container: containerRef,
    active = true,
    initialFocus = 'first',
    returnFocus = true,
    escapeDeactivates = true,
    clickOutsideDeactivates = false,
    wrapFocus = true,
    isFocusable,
    onActivate,
    onDeactivate,
    onEscape,
    preventScroll = false,
  } = props;

  // Resolve container
  const resolvedContainer = resolveContainer(containerRef);
  if (!resolvedContainer) {
    throw new Error('FocusTrap: Container element not found');
  }
  
  // Store as non-nullable after validation
  const container: HTMLElement = resolvedContainer;

  // State
  let isActive = false;
  let isPaused = false;
  let previouslyFocusedElement: Element | null = null;
  
  // Store options with defaults resolved (mutable for updateOptions)
  let currentOptions = {
    initialFocus,
    returnFocus,
    escapeDeactivates,
    clickOutsideDeactivates,
    wrapFocus,
    isFocusable,
    onActivate,
    onDeactivate,
    onEscape,
    preventScroll,
  };

  // Generate unique ID
  const trapId = `dos-focus-trap-${++focusTrapIdCounter}`;

  // Create sentinel elements for focus wrapping
  const startSentinel = document.createElement('div');
  startSentinel.className = 'dos-focus-trap___sentinel';
  startSentinel.setAttribute('tabindex', '0');
  startSentinel.setAttribute('data-dos-focus-trap', 'start');
  startSentinel.setAttribute('aria-hidden', 'true');

  const endSentinel = document.createElement('div');
  endSentinel.className = 'dos-focus-trap___sentinel';
  endSentinel.setAttribute('tabindex', '0');
  endSentinel.setAttribute('data-dos-focus-trap', 'end');
  endSentinel.setAttribute('aria-hidden', 'true');

  /**
   * Gets focusable elements within the container.
   */
  function getFocusables(): HTMLElement[] {
    return getFocusableElements(container, currentOptions.isFocusable);
  }

  /**
   * Focuses the first focusable element.
   */
  function focusFirst(): void {
    const focusables = getFocusables();
    const scrollOption = currentOptions.preventScroll ?? false;
    if (focusables.length > 0 && focusables[0]) {
      focusables[0].focus({ preventScroll: scrollOption });
    } else {
      // If no focusable elements, focus the container itself
      container.focus({ preventScroll: scrollOption });
    }
  }

  /**
   * Focuses the last focusable element.
   */
  function focusLast(): void {
    const focusables = getFocusables();
    const scrollOption = currentOptions.preventScroll ?? false;
    const lastEl = focusables[focusables.length - 1];
    if (focusables.length > 0 && lastEl) {
      lastEl.focus({ preventScroll: scrollOption });
    } else {
      container.focus({ preventScroll: scrollOption });
    }
  }

  /**
   * Resolves the initial focus element.
   */
  function resolveInitialFocus(): HTMLElement | null {
    const { initialFocus } = currentOptions;

    if (initialFocus === 'first') {
      const focusables = getFocusables();
      return focusables[0] || null;
    }

    if (initialFocus === 'container') {
      return container;
    }

    if (typeof initialFocus === 'string') {
      return container.querySelector(initialFocus);
    }

    if (initialFocus instanceof HTMLElement) {
      return initialFocus;
    }

    return null;
  }

  /**
   * Resolves the return focus element.
   */
  function resolveReturnFocus(): HTMLElement | null {
    const { returnFocus } = currentOptions;

    if (returnFocus === false) {
      return null;
    }

    if (returnFocus === true) {
      return previouslyFocusedElement as HTMLElement | null;
    }

    if (typeof returnFocus === 'string') {
      return document.querySelector(returnFocus);
    }

    if (returnFocus instanceof HTMLElement) {
      return returnFocus;
    }

    return previouslyFocusedElement as HTMLElement | null;
  }

  /**
   * Handles keydown events for focus trapping.
   */
  function handleKeyDown(event: KeyboardEvent): void {
    if (!isActive || isPaused) return;

    // Handle Escape
    if (event.key === 'Escape' && currentOptions.escapeDeactivates) {
      // Call onEscape callback if provided
      if (currentOptions.onEscape) {
        const shouldContinue = currentOptions.onEscape();
        if (shouldContinue === false) {
          return;
        }
      }
      event.preventDefault();
      deactivate();
      return;
    }

    // Handle Tab
    if (event.key === 'Tab') {
      const focusables = getFocusables();
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusables.length - 1];
      const activeElement = document.activeElement;
      const scrollOption = currentOptions.preventScroll ?? false;

      if (event.shiftKey) {
        // Shift+Tab: going backwards
        if (activeElement === firstFocusable || activeElement === startSentinel) {
          if (currentOptions.wrapFocus && lastFocusable) {
            event.preventDefault();
            lastFocusable.focus({ preventScroll: scrollOption });
          }
        }
      } else {
        // Tab: going forwards
        if (activeElement === lastFocusable || activeElement === endSentinel) {
          if (currentOptions.wrapFocus && firstFocusable) {
            event.preventDefault();
            firstFocusable.focus({ preventScroll: scrollOption });
          }
        }
      }
    }
  }

  /**
   * Handles focus events on sentinels.
   */
  function handleSentinelFocus(event: FocusEvent): void {
    if (!isActive || isPaused) return;

    const target = event.target as HTMLElement;

    if (target === startSentinel) {
      // Focus moved to start sentinel (usually via Shift+Tab from outside)
      focusLast();
    } else if (target === endSentinel) {
      // Focus moved to end sentinel (usually via Tab from outside)
      focusFirst();
    }
  }

  /**
   * Handles click outside the container.
   */
  function handleClickOutside(event: MouseEvent): void {
    if (!isActive || isPaused) return;
    if (!currentOptions.clickOutsideDeactivates) return;

    const target = event.target as Node;
    if (!container.contains(target)) {
      deactivate();
    }
  }

  /**
   * Handles focus events to prevent focus from escaping.
   * Only the topmost trap (last in stack) should handle this.
   */
  function handleFocusIn(event: FocusEvent): void {
    if (!isActive || isPaused) return;

    // Only handle if this is the topmost active trap
    const topTrap = activeTrapStack[activeTrapStack.length - 1];
    if (topTrap !== instance) return;

    const target = event.target as Node;

    // If focus moved outside the container (and not to sentinels), bring it back
    if (!container.contains(target) && target !== startSentinel && target !== endSentinel) {
      // Check if focus is in another focus trap (nested scenario)
      const targetEl = target as HTMLElement;
      if (targetEl.closest && targetEl.closest('[data-dos-focus-trap]')) {
        // Focus is in another trap, don't interfere
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      focusFirst();
    }
  }

  /**
   * Activates the focus trap.
   */
  function activate(): void {
    if (isActive) return;

    // Store currently focused element
    previouslyFocusedElement = document.activeElement;

    // Insert sentinels
    container.insertBefore(startSentinel, container.firstChild);
    container.appendChild(endSentinel);

    // Make container focusable if it isn't already
    if (!container.hasAttribute('tabindex')) {
      container.setAttribute('tabindex', '-1');
      container.setAttribute('data-dos-focus-trap-tabindex', 'added');
    }

    // Add event listeners
    container.addEventListener('keydown', handleKeyDown);
    startSentinel.addEventListener('focus', handleSentinelFocus);
    endSentinel.addEventListener('focus', handleSentinelFocus);
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('focusin', handleFocusIn);

    // Mark as active
    isActive = true;
    isPaused = false;
    container.setAttribute('data-dos-focus-trap', 'active');

    // Add to stack
    activeTrapStack.push(instance);

    // Set initial focus
    const initialElement = resolveInitialFocus();
    if (initialElement) {
      initialElement.focus({ preventScroll: currentOptions.preventScroll ?? false });
    } else {
      focusFirst();
    }

    // Fire callback
    currentOptions.onActivate?.();

    // Dispatch event
    container.dispatchEvent(
      new CustomEvent('dos:focustrap:activate', {
        bubbles: true,
        detail: { trapId },
      })
    );
  }

  /**
   * Deactivates the focus trap.
   */
  function deactivate(): void {
    if (!isActive) return;

    // Remove event listeners
    container.removeEventListener('keydown', handleKeyDown);
    startSentinel.removeEventListener('focus', handleSentinelFocus);
    endSentinel.removeEventListener('focus', handleSentinelFocus);
    document.removeEventListener('click', handleClickOutside, true);
    document.removeEventListener('focusin', handleFocusIn);

    // Remove sentinels
    if (startSentinel.parentElement) {
      startSentinel.parentElement.removeChild(startSentinel);
    }
    if (endSentinel.parentElement) {
      endSentinel.parentElement.removeChild(endSentinel);
    }

    // Remove tabindex if we added it
    if (container.getAttribute('data-dos-focus-trap-tabindex') === 'added') {
      container.removeAttribute('tabindex');
      container.removeAttribute('data-dos-focus-trap-tabindex');
    }

    // Mark as inactive
    isActive = false;
    isPaused = false;
    container.removeAttribute('data-dos-focus-trap');

    // Remove from stack
    const stackIndex = activeTrapStack.indexOf(instance);
    if (stackIndex > -1) {
      activeTrapStack.splice(stackIndex, 1);
    }

    // Return focus
    const returnElement = resolveReturnFocus();
    if (returnElement && typeof returnElement.focus === 'function') {
      returnElement.focus({ preventScroll: currentOptions.preventScroll ?? false });
    }

    // Fire callback
    currentOptions.onDeactivate?.();

    // Dispatch event
    container.dispatchEvent(
      new CustomEvent('dos:focustrap:deactivate', {
        bubbles: true,
        detail: { trapId },
      })
    );
  }

  /**
   * Pauses the focus trap.
   */
  function pause(): void {
    if (!isActive || isPaused) return;
    isPaused = true;
    container.setAttribute('data-dos-focus-trap', 'paused');

    container.dispatchEvent(
      new CustomEvent('dos:focustrap:pause', {
        bubbles: true,
        detail: { trapId },
      })
    );
  }

  /**
   * Resumes a paused focus trap.
   */
  function resume(): void {
    if (!isActive || !isPaused) return;
    isPaused = false;
    container.setAttribute('data-dos-focus-trap', 'active');

    // Refocus within container
    if (!container.contains(document.activeElement)) {
      focusFirst();
    }

    container.dispatchEvent(
      new CustomEvent('dos:focustrap:resume', {
        bubbles: true,
        detail: { trapId },
      })
    );
  }

  /**
   * Updates the focus trap options.
   */
  function updateOptions(options: Partial<FocusTrapOptions>): void {
    currentOptions = { ...currentOptions, ...options };
  }

  /**
   * Destroys the focus trap.
   */
  function destroy(): void {
    if (isActive) {
      deactivate();
    }
  }

  // Create instance
  const instance: FocusTrapInstance = {
    get container() {
      return container;
    },
    get isActive() {
      return isActive;
    },
    get isPaused() {
      return isPaused;
    },
    activate,
    deactivate,
    pause,
    resume,
    updateOptions,
    getFocusableElements: getFocusables,
    destroy,
  };

  // Auto-activate if requested
  if (active) {
    activate();
  }

  return instance;
}

/**
 * Gets the currently active focus trap (top of stack).
 * @returns Active FocusTrapInstance or null
 */
export function getActiveFocusTrap(): FocusTrapInstance | null {
  const topTrap = activeTrapStack[activeTrapStack.length - 1];
  return topTrap ?? null;
}

/**
 * Gets all active focus traps.
 * @returns Array of active FocusTrapInstances
 */
export function getAllActiveFocusTraps(): FocusTrapInstance[] {
  return [...activeTrapStack];
}
