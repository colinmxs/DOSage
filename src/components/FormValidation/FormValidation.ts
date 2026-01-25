/**
 * FormValidation Component
 *
 * DOS-style validation message display component.
 * Supports error, warning, success, and info message types.
 */

import type {
  FormValidationProps,
  FormValidationElement,
  ValidationType,
} from './FormValidation.types';
import { DEFAULT_ICONS as defaultIcons } from './FormValidation.types';
import './FormValidation.css';

// Unique ID counter for validation elements
let validationIdCounter = 0;

/**
 * Generates a unique ID for validation elements
 */
function generateValidationId(): string {
  return `dos-form-validation-${++validationIdCounter}`;
}

/**
 * Creates a DOS-style form validation message element.
 *
 * @param props - FormValidation configuration options
 * @returns The validation message element with methods
 *
 * @example
 * ```typescript
 * import { createFormValidation } from 'dosage';
 *
 * const error = createFormValidation({
 *   message: 'This field is required',
 *   type: 'error'
 * });
 *
 * document.body.appendChild(error);
 * ```
 */
export function createFormValidation(props: FormValidationProps): FormValidationElement {
  const {
    message,
    type = 'error',
    icon = true,
    visible = true,
    id,
    className,
  } = props;

  // Generate unique ID
  const validationId = id ?? generateValidationId();

  // Track internal state
  let currentMessage = message;
  let currentType = type;
  let currentVisible = visible;
  let currentIcon = icon;

  // Create wrapper element
  const wrapper = document.createElement('div') as FormValidationElement;
  wrapper.id = validationId;
  wrapper.className = buildValidationClasses(currentType, currentVisible, className);

  // Set ARIA attributes based on type
  setAriaAttributes(wrapper, currentType);

  // Create icon element
  const iconElement = document.createElement('span');
  iconElement.className = 'dos-form-validation__icon';
  iconElement.setAttribute('aria-hidden', 'true');
  updateIcon(iconElement, currentIcon, currentType);

  // Create message element
  const messageElement = document.createElement('span');
  messageElement.className = 'dos-form-validation__message';
  messageElement.textContent = currentMessage;

  // Assemble elements
  wrapper.appendChild(iconElement);
  wrapper.appendChild(messageElement);

  // Attach methods to the wrapper element
  wrapper.setMessage = (newMessage: string): void => {
    currentMessage = newMessage;
    messageElement.textContent = newMessage;
  };

  wrapper.getMessage = (): string => currentMessage;

  wrapper.setType = (newType: ValidationType): void => {
    // Remove old type class
    wrapper.classList.remove(`dos-form-validation--${currentType}`);

    currentType = newType;

    // Add new type class
    wrapper.classList.add(`dos-form-validation--${currentType}`);

    // Update ARIA attributes
    setAriaAttributes(wrapper, currentType);

    // Update icon if using default
    if (currentIcon === true) {
      updateIcon(iconElement, true, currentType);
    }
  };

  wrapper.getType = (): ValidationType => currentType;

  wrapper.setVisible = (newVisible: boolean): void => {
    currentVisible = newVisible;
    wrapper.classList.toggle('dos-form-validation--hidden', !newVisible);
  };

  wrapper.isVisible = (): boolean => currentVisible;

  wrapper.setIcon = (newIcon: boolean | string): void => {
    currentIcon = newIcon;
    updateIcon(iconElement, newIcon, currentType);
  };

  return wrapper;
}

/**
 * Builds the validation message class string
 */
function buildValidationClasses(
  type: ValidationType,
  visible: boolean,
  className?: string
): string {
  const classes = ['dos-form-validation', `dos-form-validation--${type}`];

  if (!visible) {
    classes.push('dos-form-validation--hidden');
  }

  if (className) {
    classes.push(className);
  }

  return classes.join(' ');
}

/**
 * Sets ARIA attributes based on message type
 */
function setAriaAttributes(element: HTMLElement, type: ValidationType): void {
  // Error messages use role="alert" for immediate announcement
  if (type === 'error') {
    element.setAttribute('role', 'alert');
    element.removeAttribute('aria-live');
  } else {
    // Other types use aria-live="polite"
    element.removeAttribute('role');
    element.setAttribute('aria-live', 'polite');
  }
}

/**
 * Updates the icon element
 */
function updateIcon(
  iconElement: HTMLElement,
  icon: boolean | string,
  type: ValidationType
): void {
  if (icon === false) {
    iconElement.textContent = '';
    iconElement.style.display = 'none';
  } else if (typeof icon === 'string') {
    iconElement.textContent = icon;
    iconElement.style.display = '';
  } else {
    // Use default icon for the type
    iconElement.textContent = defaultIcons[type];
    iconElement.style.display = '';
  }
}

/**
 * Sets the message of a FormValidation element.
 *
 * @param element - The FormValidation element
 * @param message - The new message
 */
export function setFormValidationMessage(
  element: FormValidationElement,
  message: string
): void {
  element.setMessage(message);
}

/**
 * Gets the message of a FormValidation element.
 *
 * @param element - The FormValidation element
 * @returns The current message
 */
export function getFormValidationMessage(element: FormValidationElement): string {
  return element.getMessage();
}

/**
 * Sets the type of a FormValidation element.
 *
 * @param element - The FormValidation element
 * @param type - The new type
 */
export function setFormValidationType(
  element: FormValidationElement,
  type: ValidationType
): void {
  element.setType(type);
}

/**
 * Gets the type of a FormValidation element.
 *
 * @param element - The FormValidation element
 * @returns The current type
 */
export function getFormValidationType(element: FormValidationElement): ValidationType {
  return element.getType();
}

/**
 * Sets the visibility of a FormValidation element.
 *
 * @param element - The FormValidation element
 * @param visible - Whether to show the message
 */
export function setFormValidationVisible(
  element: FormValidationElement,
  visible: boolean
): void {
  element.setVisible(visible);
}

/**
 * Gets the visibility of a FormValidation element.
 *
 * @param element - The FormValidation element
 * @returns Whether the message is visible
 */
export function isFormValidationVisible(element: FormValidationElement): boolean {
  return element.isVisible();
}
