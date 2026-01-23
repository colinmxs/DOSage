/**
 * IconButton Component
 *
 * A square DOS-style button with a centered icon.
 * Requires an accessible label since there's no visible text.
 */

import type { IconButtonProps } from './IconButton.types';
import './IconButton.css';

/**
 * Creates a DOS-style icon button element.
 *
 * @param props - IconButton configuration options
 * @returns The button DOM element
 *
 * @example
 * ```typescript
 * import { createIconButton } from 'dosage';
 *
 * const closeBtn = createIconButton({
 *   icon: 'X',
 *   label: 'Close window',
 *   onClick: () => console.log('Close clicked')
 * });
 *
 * document.body.appendChild(closeBtn);
 * ```
 */
export function createIconButton(props: IconButtonProps): HTMLButtonElement {
  const {
    icon,
    label,
    variant = 'secondary',
    size = 'medium',
    disabled = false,
    onClick,
    className,
    id,
  } = props;

  // Create button element
  const button = document.createElement('button');
  button.type = 'button';

  // Build class list
  const classes = ['dos-icon-button', `dos-icon-button--${variant}`, `dos-icon-button--${size}`];

  if (disabled) {
    classes.push('dos-icon-button--disabled');
  }

  if (className) {
    classes.push(className);
  }

  button.className = classes.join(' ');

  // Apply ID if provided
  if (id) {
    button.id = id;
  }

  // Set ARIA attributes - label is required for accessibility
  button.setAttribute('aria-label', label);

  if (disabled) {
    button.setAttribute('aria-disabled', 'true');
    button.disabled = true;
  }

  // Create icon element
  const iconElement = document.createElement('span');
  iconElement.className = 'dos-icon-button__icon';
  iconElement.textContent = icon;
  iconElement.setAttribute('aria-hidden', 'true');
  button.appendChild(iconElement);

  // Event handlers
  if (!disabled && onClick) {
    button.addEventListener('click', onClick);
  }

  // Keyboard handler for consistency
  button.addEventListener('keydown', (event: KeyboardEvent) => {
    if (disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      button.click();
    }
  });

  return button;
}

/**
 * Updates an icon button's icon.
 *
 * @param button - The icon button element
 * @param icon - The new icon character
 */
export function setIconButtonIcon(button: HTMLButtonElement, icon: string): void {
  const iconElement = button.querySelector('.dos-icon-button__icon');
  if (iconElement) {
    iconElement.textContent = icon;
  }
}

/**
 * Updates an icon button's disabled state.
 *
 * @param button - The icon button element
 * @param disabled - Whether the button should be disabled
 */
export function setIconButtonDisabled(button: HTMLButtonElement, disabled: boolean): void {
  if (disabled) {
    button.classList.add('dos-icon-button--disabled');
    button.setAttribute('aria-disabled', 'true');
    button.disabled = true;
  } else {
    button.classList.remove('dos-icon-button--disabled');
    button.removeAttribute('aria-disabled');
    button.disabled = false;
  }
}
