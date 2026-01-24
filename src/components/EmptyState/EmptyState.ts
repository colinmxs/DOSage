/**
 * @file EmptyState component
 * @description DOS-style empty state placeholder with ASCII art icons
 */

import type {
  EmptyStateProps,
  EmptyStateInstance,
  EmptyStateSize,
  EmptyStateIconPreset
} from './EmptyState.types';
import './EmptyState.css';

/**
 * Preset ASCII art icons for common empty states
 */
const PRESET_ICONS: Record<EmptyStateIconPreset, string> = {
  folder: `   _______
  /       /|
 /       / |
/_______/  |
|       |  /
|       | /
|_______|/`,

  search: `    ___
   /   \\
  |     |
   \\___/
      \\
       \\`,

  error: `   _____
  /     \\
 |   X   |
 |   X   |
  \\_____/`,

  data: `  ┌───────┐
  │ ═════ │
  │ ───── │
  │ ═════ │
  │       │
  └───────┘`,

  file: `   _____
  |     |
  |  ?  |
  |_____|`,

  inbox: `   _______
  |       |
  |   📭  |
  |_______|
  \\_______/`,

  network: `    [X]
   / | \\
  O  O  O
     |
    [!]`
};

/**
 * Creates a DOS-style empty state placeholder
 * 
 * @param props - EmptyState configuration options
 * @returns EmptyState instance with element and methods
 * 
 * @example
 * ```typescript
 * const emptyState = createEmptyState({
 *   title: 'No files found',
 *   description: 'Try adjusting your search or check a different folder.',
 *   icon: 'folder',
 *   action: createButton({ label: '[ Browse Files ]' }).element
 * });
 * document.body.appendChild(emptyState.element);
 * ```
 */
export function createEmptyState(props: EmptyStateProps): EmptyStateInstance {
  const {
    title,
    description,
    icon,
    action,
    size = 'medium',
    dynamic = false,
    className,
    id,
    'aria-label': ariaLabel,
  } = props;

  // Internal state
  let currentTitle = title;
  let currentDescription = description;
  let currentSize = size;
  let actionElement: HTMLElement | null = null;
  let iconElement: HTMLElement | null = null;
  let titleElement: HTMLElement;
  let descriptionElement: HTMLElement | null = null;
  let actionContainer: HTMLElement | null = null;

  // Create main container
  const element = document.createElement('div');
  element.className = buildClassName();
  
  if (id) {
    element.id = id;
  }

  // Set ARIA attributes
  if (dynamic) {
    element.setAttribute('role', 'status');
    element.setAttribute('aria-live', 'polite');
  }

  if (ariaLabel) {
    element.setAttribute('aria-label', ariaLabel);
  }

  // Build class name
  function buildClassName(): string {
    const classes = ['dos-empty-state', `dos-empty-state--${currentSize}`];
    
    if (dynamic) {
      classes.push('dos-empty-state--dynamic');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }

  // Create icon element
  function createIconElement(iconValue: EmptyStateIconPreset | string | HTMLElement | undefined): HTMLElement | null {
    if (!iconValue) return null;

    const iconEl = document.createElement('div');
    iconEl.className = 'dos-empty-state__icon';
    iconEl.setAttribute('aria-hidden', 'true');

    if (iconValue instanceof HTMLElement) {
      iconEl.appendChild(iconValue);
    } else if (iconValue in PRESET_ICONS) {
      iconEl.textContent = PRESET_ICONS[iconValue as EmptyStateIconPreset];
    } else {
      // Custom ASCII art string
      iconEl.textContent = iconValue;
    }

    return iconEl;
  }

  // Create title element
  function createTitleElement(titleText: string): HTMLElement {
    const titleEl = document.createElement('div');
    titleEl.className = 'dos-empty-state__title';
    titleEl.textContent = titleText;
    return titleEl;
  }

  // Create description element
  function createDescriptionElement(descText: string | undefined): HTMLElement | null {
    if (!descText) return null;

    const descEl = document.createElement('p');
    descEl.className = 'dos-empty-state__description';
    descEl.textContent = descText;
    return descEl;
  }

  // Create action container
  function createActionContainer(actionEl: HTMLElement | undefined): HTMLElement | null {
    if (!actionEl) return null;

    const container = document.createElement('div');
    container.className = 'dos-empty-state__action';
    container.appendChild(actionEl);
    return container;
  }

  // Render the component
  function render(): void {
    element.innerHTML = '';
    element.className = buildClassName();

    // Add icon
    iconElement = createIconElement(icon);
    if (iconElement) {
      element.appendChild(iconElement);
    }

    // Add title
    titleElement = createTitleElement(currentTitle);
    element.appendChild(titleElement);

    // Add description
    descriptionElement = createDescriptionElement(currentDescription);
    if (descriptionElement) {
      element.appendChild(descriptionElement);
    }

    // Add action
    if (action) {
      actionElement = action;
      actionContainer = createActionContainer(action);
      if (actionContainer) {
        element.appendChild(actionContainer);
      }
    }
  }

  // Instance methods
  function setTitle(newTitle: string): void {
    currentTitle = newTitle;
    if (titleElement) {
      titleElement.textContent = newTitle;
    }
  }

  function getTitle(): string {
    return currentTitle;
  }

  function setDescription(newDescription: string | undefined): void {
    currentDescription = newDescription;
    
    // Remove existing description
    if (descriptionElement) {
      descriptionElement.remove();
      descriptionElement = null;
    }

    // Add new description if provided
    if (newDescription) {
      descriptionElement = createDescriptionElement(newDescription);
      if (descriptionElement) {
        // Insert after title, before action
        if (actionContainer) {
          actionContainer.insertAdjacentElement('beforebegin', descriptionElement);
        } else {
          element.appendChild(descriptionElement);
        }
      }
    }
  }

  function getDescription(): string | undefined {
    return currentDescription;
  }

  function setIcon(newIcon: EmptyStateIconPreset | string | HTMLElement | undefined): void {
    // Remove existing icon
    if (iconElement) {
      iconElement.remove();
      iconElement = null;
    }

    // Add new icon if provided
    if (newIcon) {
      iconElement = createIconElement(newIcon);
      if (iconElement) {
        element.insertBefore(iconElement, element.firstChild);
      }
    }
  }

  function setAction(newAction: HTMLElement | undefined): void {
    // Remove existing action
    if (actionContainer) {
      actionContainer.remove();
      actionContainer = null;
      actionElement = null;
    }

    // Add new action if provided
    if (newAction) {
      actionElement = newAction;
      actionContainer = createActionContainer(newAction);
      if (actionContainer) {
        element.appendChild(actionContainer);
      }
    }
  }

  function getAction(): HTMLElement | null {
    return actionElement;
  }

  function setSize(newSize: EmptyStateSize): void {
    currentSize = newSize;
    element.className = buildClassName();
  }

  function getSize(): EmptyStateSize {
    return currentSize;
  }

  function focusAction(): void {
    if (actionElement) {
      // First check if the action element itself is natively focusable
      const isFocusable = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(actionElement.tagName) ||
                          actionElement.getAttribute('tabindex') !== null;
      
      if (isFocusable) {
        actionElement.focus();
      } else {
        // Find first focusable child
        const focusable = actionElement.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable) {
          focusable.focus();
        }
      }
    }
  }

  function destroy(): void {
    element.innerHTML = '';
  }

  // Initial render
  render();

  return {
    element,
    setTitle,
    getTitle,
    setDescription,
    getDescription,
    setIcon,
    setAction,
    getAction,
    setSize,
    getSize,
    focusAction,
    destroy,
  };
}

/**
 * Gets a preset icon ASCII art by name
 * @param preset - The preset icon name
 * @returns The ASCII art string, or undefined if not found
 */
export function getPresetIcon(preset: EmptyStateIconPreset): string | undefined {
  return PRESET_ICONS[preset];
}

/**
 * Gets all available preset icon names
 */
export function getPresetIconNames(): EmptyStateIconPreset[] {
  return Object.keys(PRESET_ICONS) as EmptyStateIconPreset[];
}
