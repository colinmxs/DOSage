/**
 * PasswordInput Component
 *
 * A DOS-style password input with show/hide toggle functionality.
 * Provides authentic DOS aesthetic with secure password handling.
 */

import type { PasswordInputProps, PasswordInputElement } from './PasswordInput.types';
import { createDOSCursor, type DOSCursorInstance } from '../../utils/DOSCursor';
import './PasswordInput.css';

// Unique ID counter for input-label association
let passwordIdCounter = 0;

/**
 * Generates a unique ID for password input elements
 */
function generatePasswordId(): string {
  return `dos-password-input-${++passwordIdCounter}`;
}

/**
 * Creates a DOS-style password input element.
 *
 * @param props - PasswordInput configuration options
 * @returns The password input wrapper element with methods
 *
 * @example
 * ```typescript
 * import { createPasswordInput } from 'dosage';
 *
 * const passwordInput = createPasswordInput({
 *   label: 'Password',
 *   placeholder: 'Enter password...',
 *   showToggle: true,
 *   onChange: (value) => console.log('Value:', value)
 * });
 *
 * document.body.appendChild(passwordInput);
 * ```
 */
export function createPasswordInput(props: PasswordInputProps): PasswordInputElement {
  const {
    value = '',
    placeholder = '',
    label,
    name,
    maskChar = '*',
    showToggle = true,
    disabled = false,
    required = false,
    error,
    maxLength,
    autocomplete = 'current-password',
    width,
    onChange,
    onBlur,
    onFocus,
    onEnter,
    onToggleVisibility,
    className,
    id,
  } = props;

  // Track visibility state
  let isPasswordVisible = false;

  // Generate unique IDs
  const inputId = id || generatePasswordId();
  const errorId = `${inputId}-error`;

  // Create wrapper element
  const wrapper = document.createElement('div') as PasswordInputElement;
  wrapper.className = buildWrapperClasses(disabled, error, showToggle, className);

  // Apply custom width if provided
  if (width) {
    wrapper.style.width = typeof width === 'number' ? `${width}px` : width;
  }

  // Create label if provided
  let labelElement: HTMLLabelElement | null = null;
  if (label) {
    labelElement = createLabelElement(label, inputId, required, disabled);
    wrapper.appendChild(labelElement);
  }

  // Create input wrapper
  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'dos-password-input__wrapper';

  // Create input element
  const input = document.createElement('input');
  input.type = 'password';
  input.id = inputId;
  input.className = 'dos-password-input__field';
  input.value = value;
  input.autocomplete = autocomplete;

  // Store mask character as data attribute for potential CSS usage
  input.dataset.maskChar = maskChar;

  if (placeholder) {
    input.placeholder = placeholder;
  }

  if (name) {
    input.name = name;
  }

  if (disabled) {
    input.disabled = true;
  }

  if (required) {
    input.required = true;
    input.setAttribute('aria-required', 'true');
  }

  if (maxLength !== undefined) {
    input.maxLength = maxLength;
  }

  // Set ARIA attributes for error state
  if (error) {
    input.setAttribute('aria-invalid', 'true');
    if (typeof error === 'string') {
      input.setAttribute('aria-describedby', errorId);
    }
  }

  // Event handlers
  input.addEventListener('input', (event) => {
    onChange?.(input.value, event);
  });

  input.addEventListener('blur', (event) => {
    wrapper.classList.remove('dos-password-input--focused');
    onBlur?.(input.value, event as FocusEvent);
  });

  input.addEventListener('focus', (event) => {
    wrapper.classList.add('dos-password-input--focused');
    onFocus?.(event as FocusEvent);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && onEnter) {
      onEnter(input.value, event);
    }
  });

  inputWrapper.appendChild(input);

  // Create toggle button if enabled
  let toggleButton: HTMLButtonElement | null = null;
  if (showToggle) {
    toggleButton = createToggleButton(disabled);

    toggleButton.addEventListener('click', () => {
      isPasswordVisible = !isPasswordVisible;
      updateVisibilityState(wrapper, input, toggleButton!, isPasswordVisible);
      onToggleVisibility?.(isPasswordVisible);
    });

    // Keyboard support for toggle
    toggleButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        isPasswordVisible = !isPasswordVisible;
        updateVisibilityState(wrapper, input, toggleButton!, isPasswordVisible);
        onToggleVisibility?.(isPasswordVisible);
      }
    });

    inputWrapper.appendChild(toggleButton);
  }

  wrapper.appendChild(inputWrapper);

  // Initialize DOS block cursor overlay
  let cursor: DOSCursorInstance | null = null;
  if (!disabled) {
    cursor = createDOSCursor({
      input,
      wrapper: inputWrapper,
      readonly: false,
      disabled,
    });
  }

  // Create error message if provided as string
  let errorElement: HTMLDivElement | null = null;
  if (typeof error === 'string' && error) {
    errorElement = createErrorElement(error, errorId);
    wrapper.appendChild(errorElement);
  }

  // Attach methods to the wrapper element
  wrapper.getValue = () => input.value;

  wrapper.setValue = (newValue: string) => {
    input.value = newValue;
    // Update cursor position when value changes programmatically
    cursor?.updatePosition();
  };

  wrapper.setError = (newError: string | boolean | undefined) => {
    // Remove existing error element
    const existingError = wrapper.querySelector('.dos-password-input__error');
    if (existingError) {
      existingError.remove();
    }

    // Update wrapper classes
    wrapper.classList.toggle('dos-password-input--error', !!newError);

    // Update ARIA attributes
    if (newError) {
      input.setAttribute('aria-invalid', 'true');
      if (typeof newError === 'string') {
        const newErrorElement = createErrorElement(newError, errorId);
        wrapper.appendChild(newErrorElement);
        input.setAttribute('aria-describedby', errorId);
      } else {
        input.removeAttribute('aria-describedby');
      }
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  };

  wrapper.focusInput = () => {
    input.focus();
  };

  wrapper.setDisabled = (newDisabled: boolean) => {
    input.disabled = newDisabled;
    wrapper.classList.toggle('dos-password-input--disabled', newDisabled);
    if (labelElement) {
      labelElement.classList.toggle('dos-password-input__label--disabled', newDisabled);
    }
    if (toggleButton) {
      toggleButton.disabled = newDisabled;
    }
    // Update cursor disabled state
    cursor?.setDisabled(newDisabled);
  };

  wrapper.getInput = () => input;

  wrapper.toggleVisibility = () => {
    if (toggleButton) {
      isPasswordVisible = !isPasswordVisible;
      updateVisibilityState(wrapper, input, toggleButton, isPasswordVisible);
      onToggleVisibility?.(isPasswordVisible);
    }
  };

  wrapper.isVisible = () => isPasswordVisible;

  // Add destroy method for cleanup
  (wrapper as PasswordInputElement & { destroy: () => void }).destroy = () => {
    cursor?.destroy();
    cursor = null;
  };

  return wrapper;
}

/**
 * Builds the wrapper class string
 */
function buildWrapperClasses(
  disabled: boolean,
  error: string | boolean | undefined,
  showToggle: boolean,
  className?: string
): string {
  const classes = ['dos-password-input'];

  if (disabled) {
    classes.push('dos-password-input--disabled');
  }

  if (error) {
    classes.push('dos-password-input--error');
  }

  if (!showToggle) {
    classes.push('dos-password-input--no-toggle');
  }

  if (className) {
    classes.push(className);
  }

  return classes.join(' ');
}

/**
 * Creates the label element
 */
function createLabelElement(
  label: string,
  inputId: string,
  required: boolean,
  disabled: boolean
): HTMLLabelElement {
  const labelElement = document.createElement('label');
  labelElement.htmlFor = inputId;
  labelElement.className = 'dos-password-input__label';

  if (disabled) {
    labelElement.classList.add('dos-password-input__label--disabled');
  }

  // Add label text
  const labelText = document.createElement('span');
  labelText.textContent = label;
  labelElement.appendChild(labelText);

  // Add required indicator
  if (required) {
    const requiredIndicator = document.createElement('span');
    requiredIndicator.className = 'dos-password-input__required';
    requiredIndicator.textContent = '*';
    requiredIndicator.setAttribute('aria-hidden', 'true');
    labelElement.appendChild(requiredIndicator);
  }

  return labelElement;
}

/**
 * Creates the toggle visibility button
 */
function createToggleButton(disabled: boolean): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'dos-password-input__toggle';
  button.disabled = disabled;
  button.setAttribute('aria-label', 'Show password');
  button.setAttribute('aria-pressed', 'false');

  const icon = document.createElement('span');
  icon.className = 'dos-password-input__toggle-icon';
  icon.textContent = '[*]';
  icon.setAttribute('aria-hidden', 'true');
  button.appendChild(icon);

  return button;
}

/**
 * Updates the visibility state of the password input
 */
function updateVisibilityState(
  wrapper: HTMLElement,
  input: HTMLInputElement,
  toggleButton: HTMLButtonElement,
  isVisible: boolean
): void {
  input.type = isVisible ? 'text' : 'password';
  wrapper.classList.toggle('dos-password-input--visible', isVisible);

  toggleButton.setAttribute('aria-pressed', String(isVisible));
  toggleButton.setAttribute('aria-label', isVisible ? 'Hide password' : 'Show password');

  const icon = toggleButton.querySelector('.dos-password-input__toggle-icon');
  if (icon) {
    icon.textContent = isVisible ? '[○]' : '[*]';
  }
}

/**
 * Creates the error message element
 */
function createErrorElement(message: string, errorId: string): HTMLDivElement {
  const errorElement = document.createElement('div');
  errorElement.id = errorId;
  errorElement.className = 'dos-password-input__error';
  errorElement.setAttribute('role', 'alert');
  errorElement.setAttribute('aria-live', 'polite');

  // Add error icon
  const iconSpan = document.createElement('span');
  iconSpan.className = 'dos-password-input__error-icon';
  iconSpan.textContent = '[!]';
  iconSpan.setAttribute('aria-hidden', 'true');
  errorElement.appendChild(iconSpan);

  // Add error message
  const messageSpan = document.createElement('span');
  messageSpan.textContent = message;
  errorElement.appendChild(messageSpan);

  return errorElement;
}

/**
 * Sets the value of a PasswordInput element.
 *
 * @param element - The PasswordInput element
 * @param value - The new value
 */
export function setPasswordInputValue(element: PasswordInputElement, value: string): void {
  element.setValue(value);
}

/**
 * Gets the value of a PasswordInput element.
 *
 * @param element - The PasswordInput element
 * @returns The current value
 */
export function getPasswordInputValue(element: PasswordInputElement): string {
  return element.getValue();
}

/**
 * Sets the error state of a PasswordInput element.
 *
 * @param element - The PasswordInput element
 * @param error - Error message or boolean
 */
export function setPasswordInputError(
  element: PasswordInputElement,
  error: string | boolean | undefined
): void {
  element.setError(error);
}

/**
 * Sets the disabled state of a PasswordInput element.
 *
 * @param element - The PasswordInput element
 * @param disabled - Whether to disable
 */
export function setPasswordInputDisabled(element: PasswordInputElement, disabled: boolean): void {
  element.setDisabled(disabled);
}

/**
 * Toggles the visibility of a PasswordInput element.
 *
 * @param element - The PasswordInput element
 */
export function togglePasswordVisibility(element: PasswordInputElement): void {
  element.toggleVisibility();
}
