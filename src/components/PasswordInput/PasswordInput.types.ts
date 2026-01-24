/**
 * PasswordInput Component Types
 *
 * Type definitions for the DOS-style PasswordInput component.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Mask character options
 */
export type PasswordMaskChar = '*' | '●' | '•' | '█';

/**
 * Props for the PasswordInput component
 */
export interface PasswordInputProps extends BaseComponentProps {
  /**
   * Current input value.
   */
  value?: string;

  /**
   * Placeholder text shown when input is empty.
   */
  placeholder?: string;

  /**
   * Associated label text.
   */
  label?: string;

  /**
   * Form field name.
   */
  name?: string;

  /**
   * Character for masking password display.
   * Note: This affects visual representation only, actual masking is done by the browser.
   * @default '*'
   */
  maskChar?: PasswordMaskChar;

  /**
   * Show/hide password toggle button.
   * @default true
   */
  showToggle?: boolean;

  /**
   * Whether the input is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;

  /**
   * Error state or message.
   */
  error?: string | boolean;

  /**
   * Maximum character length.
   */
  maxLength?: number;

  /**
   * Autocomplete attribute value.
   * @default 'current-password'
   */
  autocomplete?: 'current-password' | 'new-password' | 'off';

  /**
   * Custom width for the input.
   */
  width?: string | number;

  /**
   * Called when the input value changes.
   */
  onChange?: (value: string, event: Event) => void;

  /**
   * Called when the input loses focus.
   */
  onBlur?: (value: string, event: FocusEvent) => void;

  /**
   * Called when the input gains focus.
   */
  onFocus?: (event: FocusEvent) => void;

  /**
   * Called when Enter key is pressed.
   */
  onEnter?: (value: string, event: KeyboardEvent) => void;

  /**
   * Called when visibility is toggled.
   */
  onToggleVisibility?: (visible: boolean) => void;
}

/**
 * Interface for PasswordInput element with methods
 */
export interface PasswordInputElement extends HTMLDivElement {
  /** Get the current input value */
  getValue: () => string;
  /** Set the input value */
  setValue: (value: string) => void;
  /** Set the error state */
  setError: (error: string | boolean | undefined) => void;
  /** Focus the input */
  focusInput: () => void;
  /** Disable/enable the input */
  setDisabled: (disabled: boolean) => void;
  /** Get the underlying input element */
  getInput: () => HTMLInputElement;
  /** Toggle password visibility */
  toggleVisibility: () => void;
  /** Get current visibility state */
  isVisible: () => boolean;
}
