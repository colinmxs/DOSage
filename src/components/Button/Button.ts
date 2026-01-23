/**
 * Button Component
 *
 * A DOS-style button with variants, sizes, and states.
 * Provides authentic DOS aesthetic with thick borders and instant response.
 */

import type { ButtonProps } from './Button.types';
import './Button.css';

/**
 * ASCII spinner frames for loading state
 */
const SPINNER_FRAMES = ['|', '/', '—', '\\'];
let spinnerInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Creates a DOS-style button element.
 *
 * @param props - Button configuration options
 * @returns The button DOM element
 *
 * @example
 * ```typescript
 * import { createButton } from 'dosage';
 *
 * const button = createButton({
 *   label: 'OK',
 *   variant: 'primary',
 *   onClick: () => console.log('Clicked!')
 * });
 *
 * document.body.appendChild(button);
 * ```
 */
export function createButton(props: ButtonProps): HTMLButtonElement {
  const {
    label,
    variant = 'secondary',
    size = 'medium',
    disabled = false,
    loading = false,
    type = 'button',
    icon,
    iconPosition = 'left',
    fullWidth = false,
    onClick,
    ariaLabel,
    className,
    id,
  } = props;

  // Create button element
  const button = document.createElement('button');
  button.type = type;

  // Build class list
  const classes = ['dos-button', `dos-button--${variant}`, `dos-button--${size}`];

  if (disabled) {
    classes.push('dos-button--disabled');
  }

  if (loading) {
    classes.push('dos-button--loading');
  }

  if (fullWidth) {
    classes.push('dos-button--full-width');
  }

  if (className) {
    classes.push(className);
  }

  button.className = classes.join(' ');

  // Apply ID if provided
  if (id) {
    button.id = id;
  }

  // Set ARIA attributes
  if (disabled) {
    button.setAttribute('aria-disabled', 'true');
    button.disabled = true;
  }

  if (loading) {
    button.setAttribute('aria-busy', 'true');
  }

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  // Create content structure
  if (icon && !loading) {
    const iconElement = document.createElement('span');
    iconElement.className = `dos-button__icon dos-button__icon--${iconPosition}`;
    iconElement.textContent = icon;
    iconElement.setAttribute('aria-hidden', 'true');
    button.appendChild(iconElement);
  }

  // Label element
  const labelElement = document.createElement('span');
  labelElement.className = 'dos-button__label';
  labelElement.textContent = label;
  button.appendChild(labelElement);

  // Loading spinner
  if (loading) {
    const spinner = document.createElement('span');
    spinner.className = 'dos-button__spinner';
    spinner.setAttribute('aria-hidden', 'true');
    button.appendChild(spinner);

    // Set up spinner animation manually (CSS animation fallback)
    let frameIndex = 0;
    spinnerInterval = setInterval(() => {
      frameIndex = (frameIndex + 1) % SPINNER_FRAMES.length;
      spinner.textContent = SPINNER_FRAMES[frameIndex];
    }, 125);
  }

  // Event handlers
  if (!disabled && !loading && onClick) {
    button.addEventListener('click', onClick);
  }

  // Keyboard handler for consistency
  button.addEventListener('keydown', (event: KeyboardEvent) => {
    if (disabled || loading) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      button.click();
    }
  });

  return button;
}

/**
 * Updates a button's loading state.
 *
 * @param button - The button element to update
 * @param loading - Whether the button should be in loading state
 */
export function setButtonLoading(button: HTMLButtonElement, loading: boolean): void {
  const existingSpinner = button.querySelector('.dos-button__spinner');

  if (loading && !existingSpinner) {
    button.classList.add('dos-button--loading');
    button.setAttribute('aria-busy', 'true');

    const spinner = document.createElement('span');
    spinner.className = 'dos-button__spinner';
    spinner.setAttribute('aria-hidden', 'true');
    button.appendChild(spinner);

    // Set up spinner animation
    let frameIndex = 0;
    spinnerInterval = setInterval(() => {
      frameIndex = (frameIndex + 1) % SPINNER_FRAMES.length;
      spinner.textContent = SPINNER_FRAMES[frameIndex];
    }, 125);
  } else if (!loading && existingSpinner) {
    button.classList.remove('dos-button--loading');
    button.removeAttribute('aria-busy');
    existingSpinner.remove();

    if (spinnerInterval) {
      clearInterval(spinnerInterval);
      spinnerInterval = null;
    }
  }
}

/**
 * Updates a button's disabled state.
 *
 * @param button - The button element to update
 * @param disabled - Whether the button should be disabled
 */
export function setButtonDisabled(button: HTMLButtonElement, disabled: boolean): void {
  if (disabled) {
    button.classList.add('dos-button--disabled');
    button.setAttribute('aria-disabled', 'true');
    button.disabled = true;
  } else {
    button.classList.remove('dos-button--disabled');
    button.removeAttribute('aria-disabled');
    button.disabled = false;
  }
}

/**
 * Updates a button's label.
 *
 * @param button - The button element to update
 * @param label - The new label text
 */
export function setButtonLabel(button: HTMLButtonElement, label: string): void {
  const labelElement = button.querySelector('.dos-button__label');
  if (labelElement) {
    labelElement.textContent = label;
  }
}
