/**
 * TextInput Component
 *
 * A DOS-style text input field with label, validation, and states.
 * Provides authentic DOS aesthetic with bordered input and blinking cursor.
 */

import type { TextInputProps, TextInputElement } from './TextInput.types';
import './TextInput.css';

// Unique ID counter for input-label association
let inputIdCounter = 0;

/**
 * Generates a unique ID for input elements
 */
function generateInputId(): string {
  return `dos-text-input-${++inputIdCounter}`;
}

/**
 * Creates a DOS-style text input element.
 *
 * @param props - TextInput configuration options
 * @returns The text input wrapper element with methods
 *
 * @example
 * ```typescript
 * import { createTextInput } from 'dosage';
 *
 * const input = createTextInput({
 *   label: 'Username',
 *   placeholder: 'Enter username...',
 *   required: true,
 *   onChange: (value) => console.log('Value:', value)
 * });
 *
 * document.body.appendChild(input);
 * ```
 */
export function createTextInput(props: TextInputProps): TextInputElement {
  const {
    value = '',
    placeholder = '',
    label,
    name,
    type = 'text',
    disabled = false,
    readonly = false,
    required = false,
    error,
    maxLength,
    minLength,
    pattern,
    autocomplete,
    width,
    onChange,
    onBlur,
    onFocus,
    onEnter,
    className,
    id,
  } = props;

  // Generate unique IDs
  const inputId = id || generateInputId();
  const errorId = `${inputId}-error`;

  // Create wrapper element
  const wrapper = document.createElement('div') as TextInputElement;
  wrapper.className = buildWrapperClasses(disabled, readonly, error, className);

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

  // Create input wrapper for potential future additions (icons, etc.)
  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'dos-text-input__wrapper';

  // Create input element
  const input = document.createElement('input');
  input.type = type;
  input.id = inputId;
  input.className = 'dos-text-input__field';
  input.value = value;

  if (placeholder) {
    input.placeholder = placeholder;
  }

  if (name) {
    input.name = name;
  }

  if (disabled) {
    input.disabled = true;
  }

  if (readonly) {
    input.readOnly = true;
  }

  if (required) {
    input.required = true;
    input.setAttribute('aria-required', 'true');
  }

  if (maxLength !== undefined) {
    input.maxLength = maxLength;
  }

  if (minLength !== undefined) {
    input.minLength = minLength;
  }

  if (pattern) {
    input.pattern = pattern;
  }

  if (autocomplete) {
    input.autocomplete = autocomplete as AutoFill;
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
    wrapper.classList.remove('dos-text-input--focused');
    onBlur?.(input.value, event as FocusEvent);
  });

  input.addEventListener('focus', (event) => {
    wrapper.classList.add('dos-text-input--focused');
    onFocus?.(event as FocusEvent);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && onEnter) {
      onEnter(input.value, event);
    }
  });

  inputWrapper.appendChild(input);
  wrapper.appendChild(inputWrapper);

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
  };

  wrapper.setError = (newError: string | boolean | undefined) => {
    // Remove existing error element
    const existingError = wrapper.querySelector('.dos-text-input__error');
    if (existingError) {
      existingError.remove();
    }

    // Update wrapper classes
    wrapper.classList.toggle('dos-text-input--error', !!newError);

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
    wrapper.classList.toggle('dos-text-input--disabled', newDisabled);
    if (labelElement) {
      labelElement.classList.toggle('dos-text-input__label--disabled', newDisabled);
    }
  };

  wrapper.getInput = () => input;

  return wrapper;
}

/**
 * Builds the wrapper class string
 */
function buildWrapperClasses(
  disabled: boolean,
  readonly: boolean,
  error: string | boolean | undefined,
  className?: string
): string {
  const classes = ['dos-text-input'];

  if (disabled) {
    classes.push('dos-text-input--disabled');
  }

  if (readonly) {
    classes.push('dos-text-input--readonly');
  }

  if (error) {
    classes.push('dos-text-input--error');
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
  labelElement.className = 'dos-text-input__label';

  if (disabled) {
    labelElement.classList.add('dos-text-input__label--disabled');
  }

  // Add label text
  const labelText = document.createElement('span');
  labelText.textContent = label;
  labelElement.appendChild(labelText);

  // Add required indicator
  if (required) {
    const requiredIndicator = document.createElement('span');
    requiredIndicator.className = 'dos-text-input__required';
    requiredIndicator.textContent = '*';
    requiredIndicator.setAttribute('aria-hidden', 'true');
    labelElement.appendChild(requiredIndicator);
  }

  return labelElement;
}

/**
 * Creates the error message element
 */
function createErrorElement(message: string, errorId: string): HTMLDivElement {
  const errorElement = document.createElement('div');
  errorElement.id = errorId;
  errorElement.className = 'dos-text-input__error';
  errorElement.setAttribute('role', 'alert');
  errorElement.setAttribute('aria-live', 'polite');

  // Add error icon
  const iconSpan = document.createElement('span');
  iconSpan.className = 'dos-text-input__error-icon';
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
 * Sets the value of a TextInput element.
 *
 * @param element - The TextInput element
 * @param value - The new value
 */
export function setTextInputValue(element: TextInputElement, value: string): void {
  element.setValue(value);
}

/**
 * Gets the value of a TextInput element.
 *
 * @param element - The TextInput element
 * @returns The current value
 */
export function getTextInputValue(element: TextInputElement): string {
  return element.getValue();
}

/**
 * Sets the error state of a TextInput element.
 *
 * @param element - The TextInput element
 * @param error - Error message or boolean
 */
export function setTextInputError(
  element: TextInputElement,
  error: string | boolean | undefined
): void {
  element.setError(error);
}

/**
 * Sets the disabled state of a TextInput element.
 *
 * @param element - The TextInput element
 * @param disabled - Whether to disable
 */
export function setTextInputDisabled(element: TextInputElement, disabled: boolean): void {
  element.setDisabled(disabled);
}
