/**
 * FormValidation Component Types
 *
 * DOS-style validation message display component.
 */

/**
 * Type of validation message.
 */
export type ValidationType = 'error' | 'warning' | 'success' | 'info';

/**
 * Configuration options for the FormValidation component.
 */
export interface FormValidationProps {
  /**
   * The validation message to display.
   */
  message: string;

  /**
   * The type of validation message.
   * Determines styling and default icon.
   * @default 'error'
   */
  type?: ValidationType;

  /**
   * Whether to show an icon.
   * Can be a boolean or a custom icon string.
   * @default true
   */
  icon?: boolean | string;

  /**
   * Controls visibility of the message.
   * @default true
   */
  visible?: boolean;

  /**
   * Unique identifier for the element.
   * Used for aria-describedby linking.
   */
  id?: string;

  /**
   * Additional CSS class names to apply.
   */
  className?: string;
}

/**
 * Extended HTMLDivElement with additional methods.
 */
export interface FormValidationElement extends HTMLDivElement {
  /**
   * Sets the validation message.
   * @param message - The new message
   */
  setMessage: (message: string) => void;

  /**
   * Gets the current validation message.
   * @returns The current message
   */
  getMessage: () => string;

  /**
   * Sets the validation type.
   * @param type - The new type
   */
  setType: (type: ValidationType) => void;

  /**
   * Gets the current validation type.
   * @returns The current type
   */
  getType: () => ValidationType;

  /**
   * Sets the visibility of the message.
   * @param visible - Whether to show the message
   */
  setVisible: (visible: boolean) => void;

  /**
   * Gets the current visibility state.
   * @returns Whether the message is visible
   */
  isVisible: () => boolean;

  /**
   * Sets a custom icon or toggles default icon.
   * @param icon - Boolean to toggle, or string for custom icon
   */
  setIcon: (icon: boolean | string) => void;
}

/**
 * Default icons for each validation type.
 */
export const DEFAULT_ICONS: Record<ValidationType, string> = {
  error: '[!]',
  warning: '[?]',
  success: '[√]',
  info: '[i]',
};
