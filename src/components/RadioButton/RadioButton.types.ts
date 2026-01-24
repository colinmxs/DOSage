/**
 * RadioButton Component Types
 *
 * Type definitions for the DOS-style RadioButton and RadioGroup components.
 */

import type { BaseComponentProps, Orientation } from '../../types/common';

/**
 * Radio option definition for RadioGroup
 */
export interface RadioOption {
  /**
   * Option value.
   */
  value: string;

  /**
   * Option label text.
   */
  label: string;

  /**
   * Whether this option is disabled.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Props for the RadioButton component
 */
export interface RadioButtonProps extends BaseComponentProps {
  /**
   * Whether the radio button is checked/selected.
   * @default false
   */
  checked?: boolean;

  /**
   * Radio button label text.
   */
  label?: string;

  /**
   * Form group name (required for proper radio behavior).
   */
  name: string;

  /**
   * Form value when selected.
   */
  value: string;

  /**
   * Whether the radio button is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Called when the radio button is selected.
   */
  onChange?: (value: string, event: Event) => void;

  /**
   * Called when the radio button receives focus.
   */
  onFocus?: (event: FocusEvent) => void;

  /**
   * Called when the radio button loses focus.
   */
  onBlur?: (event: FocusEvent) => void;
}

/**
 * Props for the RadioGroup component
 */
export interface RadioGroupProps extends BaseComponentProps {
  /**
   * Form group name (applied to all radio buttons).
   */
  name: string;

  /**
   * Currently selected value.
   */
  value?: string;

  /**
   * Available options.
   */
  options: RadioOption[];

  /**
   * Layout orientation.
   * @default 'vertical'
   */
  orientation?: Orientation;

  /**
   * Whether all radio buttons are disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Group label/legend.
   */
  label?: string;

  /**
   * Whether the group is required.
   * @default false
   */
  required?: boolean;

  /**
   * Error state or message.
   */
  error?: string | boolean;

  /**
   * Called when the selected value changes.
   */
  onChange?: (value: string, event: Event) => void;
}

/**
 * Interface for RadioButton element with methods
 */
export interface RadioButtonElement extends HTMLDivElement {
  /** Get the current checked state */
  isChecked: () => boolean;
  /** Set the checked state */
  setChecked: (checked: boolean) => void;
  /** Get the value */
  getValue: () => string;
  /** Disable/enable the radio button */
  setDisabled: (disabled: boolean) => void;
  /** Focus the radio button */
  focus: () => void;
  /** Get the underlying input element */
  getInput: () => HTMLInputElement;
}

/**
 * Interface for RadioGroup element with methods
 */
export interface RadioGroupElement extends HTMLFieldSetElement {
  /** Get the currently selected value */
  getValue: () => string | undefined;
  /** Set the selected value */
  setValue: (value: string) => void;
  /** Set the error state */
  setError: (error: string | boolean | undefined) => void;
  /** Disable/enable the entire group */
  setDisabled: (disabled: boolean) => void;
  /** Focus the first radio button (or currently selected) */
  focus: () => void;
  /** Get all radio button elements */
  getRadioButtons: () => RadioButtonElement[];
}
