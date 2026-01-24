/**
 * Badge Component
 *
 * DOS-style badge/tag for status indicators and labels.
 * Displays text in bracket notation: [LABEL], [NEW], [v1.0]
 */

import type { BadgeProps, BadgeInstance, BadgeVariant } from './Badge.types';
import './Badge.css';

/**
 * Creates a DOS-style badge component
 *
 * @param props - Badge configuration options
 * @returns Badge instance with element and control methods
 *
 * @example
 * ```typescript
 * const badge = createBadge({
 *   label: 'NEW',
 *   variant: 'success',
 * });
 * document.body.appendChild(badge.element);
 * ```
 */
export function createBadge(props: BadgeProps): BadgeInstance {
  const {
    label: initialLabel,
    variant: initialVariant = 'default',
    size = 'medium',
    removable: initialRemovable = false,
    icon: initialIcon,
    onRemove,
    className,
    id,
    'aria-label': ariaLabel,
  } = props;

  // State
  let label = initialLabel;
  let variant = initialVariant;
  let icon = initialIcon;
  let removable = initialRemovable;

  // Create main badge element
  const badge = document.createElement('span');
  badge.className = buildClassName();

  if (id) {
    badge.id = id;
  }

  // Set ARIA attributes
  badge.setAttribute('role', 'status');
  if (ariaLabel) {
    badge.setAttribute('aria-label', ariaLabel);
  }

  // Create content wrapper
  const content = document.createElement('span');
  content.className = 'dos-badge___content';

  // Create icon element (optional)
  let iconEl: HTMLSpanElement | null = null;
  if (icon) {
    iconEl = document.createElement('span');
    iconEl.className = 'dos-badge___icon';
    iconEl.textContent = icon;
    iconEl.setAttribute('aria-hidden', 'true');
    content.appendChild(iconEl);
  }

  // Create label element with brackets
  const labelEl = document.createElement('span');
  labelEl.className = 'dos-badge___label';
  labelEl.textContent = `[${label}]`;
  content.appendChild(labelEl);

  badge.appendChild(content);

  // Create remove button (optional)
  let removeBtn: HTMLButtonElement | null = null;
  if (removable) {
    removeBtn = createRemoveButton();
    badge.appendChild(removeBtn);
  }

  /**
   * Build the CSS class name string
   */
  function buildClassName(): string {
    const classes = ['dos-badge'];
    classes.push(`dos-badge--${variant}`);
    classes.push(`dos-badge--${size}`);
    if (removable) {
      classes.push('dos-badge--removable');
    }
    if (className) {
      classes.push(className);
    }
    return classes.join(' ');
  }

  /**
   * Create the remove button element
   */
  function createRemoveButton(): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = 'dos-badge___remove';
    btn.type = 'button';
    btn.textContent = '×';
    btn.setAttribute('aria-label', `Remove ${label}`);
    btn.setAttribute('tabindex', '0');

    btn.addEventListener('click', handleRemoveClick);
    btn.addEventListener('keydown', handleRemoveKeydown);

    return btn;
  }

  /**
   * Handle remove button click
   */
  function handleRemoveClick(event: MouseEvent): void {
    event.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  }

  /**
   * Handle remove button keydown
   */
  function handleRemoveKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      if (onRemove) {
        onRemove();
      }
    }
  }

  /**
   * Update the badge class name
   */
  function updateClassName(): void {
    badge.className = buildClassName();
  }

  /**
   * Update the remove button aria-label
   */
  function updateRemoveButtonLabel(): void {
    if (removeBtn) {
      removeBtn.setAttribute('aria-label', `Remove ${label}`);
    }
  }

  // Return the badge instance
  return {
    element: badge,

    setLabel(newLabel: string): void {
      label = newLabel;
      labelEl.textContent = `[${label}]`;
      updateRemoveButtonLabel();
    },

    getLabel(): string {
      return label;
    },

    setVariant(newVariant: BadgeVariant): void {
      variant = newVariant;
      updateClassName();
    },

    getVariant(): BadgeVariant {
      return variant;
    },

    setIcon(newIcon: string | undefined): void {
      icon = newIcon;

      if (newIcon) {
        if (!iconEl) {
          // Create icon element
          iconEl = document.createElement('span');
          iconEl.className = 'dos-badge___icon';
          iconEl.setAttribute('aria-hidden', 'true');
          content.insertBefore(iconEl, labelEl);
        }
        iconEl.textContent = newIcon;
      } else if (iconEl) {
        // Remove icon element
        iconEl.remove();
        iconEl = null;
      }
    },

    setRemovable(newRemovable: boolean): void {
      if (newRemovable === removable) return;

      removable = newRemovable;
      updateClassName();

      if (removable && !removeBtn) {
        // Add remove button
        removeBtn = createRemoveButton();
        badge.appendChild(removeBtn);
      } else if (!removable && removeBtn) {
        // Remove button
        removeBtn.removeEventListener('click', handleRemoveClick);
        removeBtn.removeEventListener('keydown', handleRemoveKeydown);
        removeBtn.remove();
        removeBtn = null;
      }
    },

    destroy(): void {
      if (removeBtn) {
        removeBtn.removeEventListener('click', handleRemoveClick);
        removeBtn.removeEventListener('keydown', handleRemoveKeydown);
      }
      badge.remove();
    },
  };
}
