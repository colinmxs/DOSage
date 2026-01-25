/**
 * Textarea Component
 *
 * A DOS-style multi-line text input with label, validation, and character count.
 * Provides authentic DOS aesthetic with bordered textarea.
 */

import type { TextareaProps, TextareaElement, TextareaResize } from './Textarea.types';
import { createDOSCursor, type DOSCursorInstance } from '../../utils/DOSCursor';
import './Textarea.css';

// Unique ID counter for textarea-label association
let textareaIdCounter = 0;

/**
 * Generates a unique ID for textarea elements
 */
function generateTextareaId(): string {
  return `dos-textarea-${++textareaIdCounter}`;
}

/**
 * Creates a DOS-style textarea element.
 *
 * @param props - Textarea configuration options
 * @returns The textarea wrapper element with methods
 *
 * @example
 * ```typescript
 * import { createTextarea } from 'dosage';
 *
 * const textarea = createTextarea({
 *   label: 'Message',
 *   placeholder: 'Enter your message...',
 *   rows: 6,
 *   showCount: true,
 *   maxLength: 500,
 *   onChange: (value) => console.log('Value:', value)
 * });
 *
 * document.body.appendChild(textarea);
 * ```
 */
export function createTextarea(props: TextareaProps): TextareaElement {
  const {
    value = '',
    placeholder = '',
    label,
    name,
    rows = 4,
    cols,
    resizable = 'vertical',
    showCount = false,
    maxLength,
    minLength,
    disabled = false,
    readonly = false,
    required = false,
    error,
    width,
    onChange,
    onBlur,
    onFocus,
    className,
    id,
  } = props;

  // Generate unique IDs
  const textareaId = id ?? generateTextareaId();
  const errorId = `${textareaId}-error`;
  const countId = `${textareaId}-count`;

  // Create wrapper element
  const wrapper = document.createElement('div') as TextareaElement;
  wrapper.className = buildWrapperClasses(disabled, readonly, error, resizable, className);

  // Apply custom width if provided
  if (width) {
    wrapper.style.width = typeof width === 'number' ? `${width}px` : width;
  }

  // Create label if provided
  let labelElement: HTMLLabelElement | null = null;
  if (label) {
    labelElement = createLabelElement(label, textareaId, required, disabled);
    wrapper.appendChild(labelElement);
  }

  // Create textarea wrapper
  const textareaWrapper = document.createElement('div');
  textareaWrapper.className = 'dos-textarea__wrapper';

  // Create textarea element
  const textarea = document.createElement('textarea');
  textarea.id = textareaId;
  textarea.className = 'dos-textarea__field';
  textarea.value = value;
  textarea.rows = rows;

  if (cols !== undefined) {
    textarea.cols = cols;
  }

  if (placeholder) {
    textarea.placeholder = placeholder;
  }

  if (name) {
    textarea.name = name;
  }

  if (disabled) {
    textarea.disabled = true;
  }

  if (readonly) {
    textarea.readOnly = true;
  }

  if (required) {
    textarea.required = true;
    textarea.setAttribute('aria-required', 'true');
  }

  if (maxLength !== undefined) {
    textarea.maxLength = maxLength;
  }

  if (minLength !== undefined) {
    textarea.minLength = minLength;
  }

  // Build aria-describedby
  const describedBy: string[] = [];
  if (error && typeof error === 'string') {
    describedBy.push(errorId);
  }
  if (showCount) {
    describedBy.push(countId);
  }
  if (describedBy.length > 0) {
    textarea.setAttribute('aria-describedby', describedBy.join(' '));
  }

  // Set ARIA attributes for error state
  if (error) {
    textarea.setAttribute('aria-invalid', 'true');
  }

  // Create count element if needed
  let countElement: HTMLDivElement | null = null;
  if (showCount) {
    countElement = createCountElement(value.length, maxLength, countId);
  }

  // Event handlers
  textarea.addEventListener('input', (event) => {
    if (showCount && countElement) {
      updateCountElement(countElement, textarea.value.length, maxLength);
    }
    onChange?.(textarea.value, event);
  });

  textarea.addEventListener('blur', (event) => {
    wrapper.classList.remove('dos-textarea--focused');
    onBlur?.(textarea.value, event as FocusEvent);
  });

  textarea.addEventListener('focus', (event) => {
    wrapper.classList.add('dos-textarea--focused');
    onFocus?.(event as FocusEvent);
  });

  textareaWrapper.appendChild(textarea);
  wrapper.appendChild(textareaWrapper);

  // Initialize DOS block cursor overlay
  let cursor: DOSCursorInstance | null = null;
  if (!disabled) {
    cursor = createDOSCursor({
      input: textarea,
      wrapper: textareaWrapper,
      readonly,
      disabled,
    });
  }

  // Add count element if showing
  if (countElement) {
    wrapper.appendChild(countElement);
  }

  // Create error message if provided as string
  if (typeof error === 'string' && error) {
    const errorElement = createErrorElement(error, errorId);
    wrapper.appendChild(errorElement);
  }

  // Attach methods to the wrapper element
  wrapper.getValue = (): string => textarea.value;

  wrapper.setValue = (newValue: string): void => {
    textarea.value = newValue;
    if (showCount && countElement) {
      updateCountElement(countElement, newValue.length, maxLength);
    }
    // Update cursor position when value changes programmatically
    cursor?.updatePosition();
  };

  wrapper.setError = (newError: string | boolean | undefined): void => {
    // Remove existing error element
    const existingError = wrapper.querySelector('.dos-textarea__error');
    if (existingError) {
      existingError.remove();
    }

    // Update wrapper classes
    wrapper.classList.toggle('dos-textarea--error', !!newError);

    // Update ARIA attributes
    if (newError) {
      textarea.setAttribute('aria-invalid', 'true');
      if (typeof newError === 'string') {
        const newErrorElement = createErrorElement(newError, errorId);
        wrapper.appendChild(newErrorElement);
        updateAriaDescribedBy(textarea, errorId, countId, showCount, true);
      }
    } else {
      textarea.removeAttribute('aria-invalid');
      updateAriaDescribedBy(textarea, errorId, countId, showCount, false);
    }
  };

  wrapper.focusTextarea = (): void => {
    textarea.focus();
  };

  wrapper.setDisabled = (newDisabled: boolean): void => {
    textarea.disabled = newDisabled;
    wrapper.classList.toggle('dos-textarea--disabled', newDisabled);
    if (labelElement) {
      labelElement.classList.toggle('dos-textarea__label--disabled', newDisabled);
    }
    // Update cursor disabled state
    cursor?.setDisabled(newDisabled);
  };

  wrapper.getTextarea = (): HTMLTextAreaElement => textarea;

  // Add destroy method for cleanup
  (wrapper as TextareaElement & { destroy: () => void }).destroy = (): void => {
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
  readonly: boolean,
  error: string | boolean | undefined,
  resizable: TextareaResize,
  className?: string
): string {
  const classes = ['dos-textarea'];

  if (disabled) {
    classes.push('dos-textarea--disabled');
  }

  if (readonly) {
    classes.push('dos-textarea--readonly');
  }

  if (error) {
    classes.push('dos-textarea--error');
  }

  // Handle resize class
  if (resizable === false || resizable === 'none') {
    classes.push('dos-textarea--resize-none');
  } else if (resizable === true || resizable === 'both') {
    classes.push('dos-textarea--resize-both');
  } else if (resizable === 'horizontal') {
    classes.push('dos-textarea--resize-horizontal');
  } else if (resizable === 'vertical') {
    classes.push('dos-textarea--resize-vertical');
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
  textareaId: string,
  required: boolean,
  disabled: boolean
): HTMLLabelElement {
  const labelElement = document.createElement('label');
  labelElement.htmlFor = textareaId;
  labelElement.className = 'dos-textarea__label';

  if (disabled) {
    labelElement.classList.add('dos-textarea__label--disabled');
  }

  // Add label text
  const labelText = document.createElement('span');
  labelText.textContent = label;
  labelElement.appendChild(labelText);

  // Add required indicator
  if (required) {
    const requiredIndicator = document.createElement('span');
    requiredIndicator.className = 'dos-textarea__required';
    requiredIndicator.textContent = '*';
    requiredIndicator.setAttribute('aria-hidden', 'true');
    labelElement.appendChild(requiredIndicator);
  }

  return labelElement;
}

/**
 * Creates the character count element
 */
function createCountElement(
  currentLength: number,
  maxLength: number | undefined,
  countId: string
): HTMLDivElement {
  const countElement = document.createElement('div');
  countElement.id = countId;
  countElement.className = 'dos-textarea__count';
  countElement.setAttribute('aria-live', 'polite');
  countElement.setAttribute('aria-atomic', 'true');

  updateCountElement(countElement, currentLength, maxLength);

  return countElement;
}

/**
 * Updates the character count display
 */
function updateCountElement(
  countElement: HTMLDivElement,
  currentLength: number,
  maxLength: number | undefined
): void {
  if (maxLength !== undefined) {
    countElement.textContent = `${currentLength}/${maxLength}`;

    // Update classes based on limit
    countElement.classList.remove('dos-textarea__count--limit', 'dos-textarea__count--exceeded');

    if (currentLength > maxLength) {
      countElement.classList.add('dos-textarea__count--exceeded');
    } else if (currentLength >= maxLength * 0.9) {
      countElement.classList.add('dos-textarea__count--limit');
    }
  } else {
    countElement.textContent = `${currentLength} characters`;
  }
}

/**
 * Creates the error message element
 */
function createErrorElement(message: string, errorId: string): HTMLDivElement {
  const errorElement = document.createElement('div');
  errorElement.id = errorId;
  errorElement.className = 'dos-textarea__error';
  errorElement.setAttribute('role', 'alert');
  errorElement.setAttribute('aria-live', 'polite');

  // Add error icon
  const iconSpan = document.createElement('span');
  iconSpan.className = 'dos-textarea__error-icon';
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
 * Updates the aria-describedby attribute
 */
function updateAriaDescribedBy(
  textarea: HTMLTextAreaElement,
  errorId: string,
  countId: string,
  showCount: boolean,
  hasError: boolean
): void {
  const describedBy: string[] = [];

  if (hasError) {
    describedBy.push(errorId);
  }
  if (showCount) {
    describedBy.push(countId);
  }

  if (describedBy.length > 0) {
    textarea.setAttribute('aria-describedby', describedBy.join(' '));
  } else {
    textarea.removeAttribute('aria-describedby');
  }
}

/**
 * Sets the value of a Textarea element.
 *
 * @param element - The Textarea element
 * @param value - The new value
 */
export function setTextareaValue(element: TextareaElement, value: string): void {
  element.setValue(value);
}

/**
 * Gets the value of a Textarea element.
 *
 * @param element - The Textarea element
 * @returns The current value
 */
export function getTextareaValue(element: TextareaElement): string {
  return element.getValue();
}

/**
 * Sets the error state of a Textarea element.
 *
 * @param element - The Textarea element
 * @param error - Error message or boolean
 */
export function setTextareaError(
  element: TextareaElement,
  error: string | boolean | undefined
): void {
  element.setError(error);
}

/**
 * Sets the disabled state of a Textarea element.
 *
 * @param element - The Textarea element
 * @param disabled - Whether to disable
 */
export function setTextareaDisabled(element: TextareaElement, disabled: boolean): void {
  element.setDisabled(disabled);
}
