/**
 * FormGroup Component Types
 *
 * DOS-style fieldset/legend grouping for form controls.
 */

/**
 * Configuration options for the FormGroup component.
 */
export interface FormGroupProps {
  /**
   * Fieldset legend/title displayed in the border.
   */
  legend?: string;

  /**
   * Optional description/helper text below the legend.
   */
  description?: string;

  /**
   * Group-level error message.
   */
  error?: string;

  /**
   * Whether the group contains required fields.
   * Shows a required indicator next to the legend.
   * @default false
   */
  required?: boolean;

  /**
   * Whether all form controls within are disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Form controls to render inside the group.
   */
  children?: HTMLElement[];

  /**
   * Additional CSS class names to apply.
   */
  className?: string;

  /**
   * Unique identifier for the fieldset element.
   */
  id?: string;
}

/**
 * Extended HTMLFieldSetElement with additional methods.
 */
export interface FormGroupElement extends HTMLFieldSetElement {
  /**
   * Sets the error message for the group.
   * @param error - Error message or undefined to clear
   */
  setError: (error: string | undefined) => void;

  /**
   * Sets the disabled state for all form controls.
   * @param disabled - Whether to disable the group
   */
  setDisabled: (disabled: boolean) => void;

  /**
   * Gets the current disabled state.
   * @returns Whether the group is disabled
   */
  isDisabled: () => boolean;

  /**
   * Appends a child element to the content area.
   * @param element - The element to append
   */
  appendContent: (element: HTMLElement) => void;

  /**
   * Clears all content from the content area.
   */
  clearContent: () => void;

  /**
   * Gets the content container element.
   * @returns The content container
   */
  getContent: () => HTMLDivElement;
}
