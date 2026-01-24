/**
 * Checkbox Component Types
 *
 * Type definitions for the DOS-style Checkbox component.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Checkbox check mark character options
 */
export type CheckmarkChar = 'X' | '✓' | '✗' | '█' | '■';

/**
 * Label position options
 */
export type LabelPosition = 'left' | 'right';

/**
 * Props for the Checkbox component
 */
export interface CheckboxProps extends BaseComponentProps {
  /**
   * Whether the checkbox is checked.
   * @default false
   */
  checked?: boolean;

  /**
   * Whether the checkbox is in indeterminate state.
   * Visually displays [-] instead of [X] or [ ]
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Checkbox label text.
   */
  label?: string;

  /**
   * Position of the label relative to checkbox.
   * @default 'right'
   */
  labelPosition?: LabelPosition;

  /**
   * Form field name.
   */
  name?: string;

  /**
   * Form value when checked.
   */
  value?: string;

  /**
   * Whether the checkbox is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the checkbox is required.
   * @default false
   */
  required?: boolean;

  /**
   * Character to display when checked.
   * @default 'X'
   */
  checkChar?: CheckmarkChar;

  /**
   * Called when the checkbox state changes.
   */
  onChange?: (checked: boolean, event: Event) => void;

  /**
   * Called when the checkbox receives focus.
   */
  onFocus?: (event: FocusEvent) => void;

  /**
   * Called when the checkbox loses focus.
   */
  onBlur?: (event: FocusEvent) => void;
}

/**
 * Interface for Checkbox element with methods
 */
export interface CheckboxElement extends HTMLDivElement {
  /** Get the current checked state */
  isChecked: () => boolean;
  /** Set the checked state */
  setChecked: (checked: boolean) => void;
  /** Toggle the checked state */
  toggle: () => void;
  /** Get the indeterminate state */
  isIndeterminate: () => boolean;
  /** Set the indeterminate state */
  setIndeterminate: (indeterminate: boolean) => void;
  /** Disable/enable the checkbox */
  setDisabled: (disabled: boolean) => void;
  /** Focus the checkbox */
  focus: () => void;
  /** Get the underlying input element */
  getInput: () => HTMLInputElement;
}
