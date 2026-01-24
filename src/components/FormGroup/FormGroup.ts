/**
 * FormGroup Component
 *
 * DOS-style fieldset/legend grouping for form controls.
 * Provides visual and semantic grouping with box-drawing character borders.
 */

import type { FormGroupProps, FormGroupElement } from './FormGroup.types';
import './FormGroup.css';

// Unique ID counter for form groups
let formGroupIdCounter = 0;

/**
 * Generates a unique ID for form group elements
 */
function generateFormGroupId(): string {
  return `dos-form-group-${++formGroupIdCounter}`;
}

/**
 * Creates a DOS-style form group element.
 *
 * @param props - FormGroup configuration options
 * @returns The fieldset element with methods
 *
 * @example
 * ```typescript
 * import { createFormGroup, createTextInput, createCheckbox } from 'dosage';
 *
 * const group = createFormGroup({
 *   legend: 'User Information',
 *   description: 'Enter your details below.',
 *   required: true,
 *   children: [
 *     createTextInput({ label: 'Name', name: 'name' }),
 *     createTextInput({ label: 'Email', name: 'email' }),
 *     createCheckbox({ label: 'Subscribe to newsletter', name: 'subscribe' }),
 *   ],
 * });
 *
 * document.body.appendChild(group);
 * ```
 */
export function createFormGroup(props: FormGroupProps): FormGroupElement {
  const {
    legend,
    description,
    error,
    required = false,
    disabled = false,
    children = [],
    className,
    id,
  } = props;

  // Generate unique IDs
  const groupId = id || generateFormGroupId();
  const descriptionId = `${groupId}-description`;
  const errorId = `${groupId}-error`;

  // Track internal state
  let isDisabledState = disabled;

  // Create fieldset element
  const fieldset = document.createElement('fieldset') as FormGroupElement;
  fieldset.className = buildFormGroupClasses(legend, error, disabled, className);

  if (id) {
    fieldset.id = id;
  }

  // Build aria-describedby
  const describedBy: string[] = [];
  if (description) describedBy.push(descriptionId);
  if (error) describedBy.push(errorId);
  if (describedBy.length > 0) {
    fieldset.setAttribute('aria-describedby', describedBy.join(' '));
  }

  // Create legend if provided
  if (legend) {
    const legendElement = createLegendElement(legend, required);
    fieldset.appendChild(legendElement);
  }

  // Create content container
  const content = document.createElement('div');
  content.className = 'dos-form-group__content';

  // Add description if provided
  if (description) {
    const descriptionElement = document.createElement('p');
    descriptionElement.id = descriptionId;
    descriptionElement.className = 'dos-form-group__description';
    descriptionElement.textContent = description;
    content.appendChild(descriptionElement);
  }

  // Add children
  children.forEach((child) => {
    content.appendChild(child);
  });

  fieldset.appendChild(content);

  // Add error message if provided
  if (error) {
    const errorElement = createErrorElement(error, errorId);
    content.appendChild(errorElement);
  }

  // Set disabled state
  if (disabled) {
    fieldset.disabled = true;
  }

  // Attach methods to the fieldset element
  fieldset.setError = (newError: string | undefined) => {
    // Remove existing error element
    const existingError = content.querySelector('.dos-form-group__error');
    if (existingError) {
      existingError.remove();
    }

    // Update fieldset classes
    fieldset.classList.toggle('dos-form-group--error', !!newError);

    // Update ARIA attributes
    if (newError) {
      const newErrorElement = createErrorElement(newError, errorId);
      content.appendChild(newErrorElement);

      // Update aria-describedby
      const currentDescribedBy = fieldset.getAttribute('aria-describedby') || '';
      if (!currentDescribedBy.includes(errorId)) {
        fieldset.setAttribute(
          'aria-describedby',
          currentDescribedBy ? `${currentDescribedBy} ${errorId}` : errorId
        );
      }
    } else {
      // Remove error from aria-describedby
      const currentDescribedBy = fieldset.getAttribute('aria-describedby') || '';
      const newDescribedBy = currentDescribedBy
        .split(' ')
        .filter((id) => id !== errorId)
        .join(' ');

      if (newDescribedBy) {
        fieldset.setAttribute('aria-describedby', newDescribedBy);
      } else {
        fieldset.removeAttribute('aria-describedby');
      }
    }
  };

  fieldset.setDisabled = (newDisabled: boolean) => {
    isDisabledState = newDisabled;
    fieldset.disabled = newDisabled;
    fieldset.classList.toggle('dos-form-group--disabled', newDisabled);
  };

  fieldset.isDisabled = () => isDisabledState;

  fieldset.appendContent = (element: HTMLElement) => {
    // Insert before error element if it exists
    const errorElement = content.querySelector('.dos-form-group__error');
    if (errorElement) {
      content.insertBefore(element, errorElement);
    } else {
      content.appendChild(element);
    }
  };

  fieldset.clearContent = () => {
    // Keep description and error, remove everything else
    const description = content.querySelector('.dos-form-group__description');
    const error = content.querySelector('.dos-form-group__error');

    content.innerHTML = '';

    if (description) {
      content.appendChild(description);
    }
    if (error) {
      content.appendChild(error);
    }
  };

  fieldset.getContent = () => content;

  return fieldset;
}

/**
 * Creates the legend element with optional required indicator
 */
function createLegendElement(legend: string, required: boolean): HTMLLegendElement {
  const legendElement = document.createElement('legend');
  legendElement.className = 'dos-form-group__legend';

  // Create wrapper for background
  const wrapper = document.createElement('span');
  wrapper.className = 'dos-form-group__legend-wrapper';

  // Add box-drawing start character
  const startChar = document.createElement('span');
  startChar.className = 'dos-form-group__legend-start';
  startChar.textContent = '┤';
  startChar.setAttribute('aria-hidden', 'true');
  wrapper.appendChild(startChar);

  // Add legend text
  const textSpan = document.createElement('span');
  textSpan.textContent = legend;
  wrapper.appendChild(textSpan);

  // Add required indicator if needed
  if (required) {
    const requiredIndicator = document.createElement('span');
    requiredIndicator.className = 'dos-form-group__required';
    requiredIndicator.textContent = '*';
    requiredIndicator.setAttribute('aria-hidden', 'true');
    wrapper.appendChild(requiredIndicator);
  }

  // Add box-drawing end character
  const endChar = document.createElement('span');
  endChar.className = 'dos-form-group__legend-end';
  endChar.textContent = '├';
  endChar.setAttribute('aria-hidden', 'true');
  wrapper.appendChild(endChar);

  legendElement.appendChild(wrapper);

  return legendElement;
}

/**
 * Creates the error message element
 */
function createErrorElement(message: string, errorId: string): HTMLDivElement {
  const errorElement = document.createElement('div');
  errorElement.id = errorId;
  errorElement.className = 'dos-form-group__error';
  errorElement.setAttribute('role', 'alert');
  errorElement.setAttribute('aria-live', 'polite');

  // Add error icon
  const iconSpan = document.createElement('span');
  iconSpan.className = 'dos-form-group__error-icon';
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
 * Builds the form group class string
 */
function buildFormGroupClasses(
  legend: string | undefined,
  error: string | undefined,
  disabled: boolean,
  className?: string
): string {
  const classes = ['dos-form-group'];

  if (!legend) {
    classes.push('dos-form-group--no-legend');
  }

  if (error) {
    classes.push('dos-form-group--error');
  }

  if (disabled) {
    classes.push('dos-form-group--disabled');
  }

  if (className) {
    classes.push(className);
  }

  return classes.join(' ');
}

/**
 * Sets the error state of a FormGroup element.
 *
 * @param element - The FormGroup element
 * @param error - Error message or undefined to clear
 */
export function setFormGroupError(element: FormGroupElement, error: string | undefined): void {
  element.setError(error);
}

/**
 * Sets the disabled state of a FormGroup element.
 *
 * @param element - The FormGroup element
 * @param disabled - Whether to disable
 */
export function setFormGroupDisabled(element: FormGroupElement, disabled: boolean): void {
  element.setDisabled(disabled);
}
