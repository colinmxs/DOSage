/**
 * TextInput Component Types
 *
 * Type definitions for the DOS-style TextInput component.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * HTML input types supported by TextInput
 */
export type TextInputType = 'text' | 'email' | 'tel' | 'url' | 'search' | 'number';

/**
 * Props for the TextInput component
 */
export interface TextInputProps extends BaseComponentProps {
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
   * Label is rendered above the input.
   */
  label?: string;

  /**
   * Form field name.
   */
  name?: string;

  /**
   * HTML input type.
   * @default 'text'
   */
  type?: TextInputType;

  /**
   * Whether the input is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the input is read-only.
   * @default false
   */
  readonly?: boolean;

  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;

  /**
   * Error state or message.
   * When a string is provided, it's displayed as an error message.
   * When true, the input shows error styling without a message.
   */
  error?: string | boolean;

  /**
   * Maximum character length.
   */
  maxLength?: number;

  /**
   * Minimum character length.
   */
  minLength?: number;

  /**
   * Input pattern for validation.
   */
  pattern?: string;

  /**
   * Autocomplete attribute value.
   */
  autocomplete?: string;

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
}

/**
 * Interface for TextInput element with methods
 */
export interface TextInputElement extends HTMLDivElement {
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
}
