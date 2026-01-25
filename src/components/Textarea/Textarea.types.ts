/**
 * Textarea Component Types
 *
 * Type definitions for the DOS-style Textarea component.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Resize behavior options for textarea
 */
export type TextareaResize = boolean | 'horizontal' | 'vertical' | 'both' | 'none';

/**
 * Props for the Textarea component
 */
export interface TextareaProps extends BaseComponentProps {
  /**
   * Current textarea value.
   */
  value?: string;

  /**
   * Placeholder text shown when textarea is empty.
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
   * Visible row count.
   * @default 4
   */
  rows?: number;

  /**
   * Visible column count.
   */
  cols?: number;

  /**
   * Resize behavior.
   * @default 'vertical'
   */
  resizable?: TextareaResize;

  /**
   * Show character/line count.
   * @default false
   */
  showCount?: boolean;

  /**
   * Maximum character length.
   */
  maxLength?: number;

  /**
   * Minimum character length.
   */
  minLength?: number;

  /**
   * Whether the textarea is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the textarea is read-only.
   * @default false
   */
  readonly?: boolean;

  /**
   * Whether the textarea is required.
   * @default false
   */
  required?: boolean;

  /**
   * Error state or message.
   */
  error?: string | boolean;

  /**
   * Custom width for the textarea.
   */
  width?: string | number;

  /**
   * Called when the textarea value changes.
   */
  onChange?: (value: string, event: Event) => void;

  /**
   * Called when the textarea loses focus.
   */
  onBlur?: (value: string, event: FocusEvent) => void;

  /**
   * Called when the textarea gains focus.
   */
  onFocus?: (event: FocusEvent) => void;
}

/**
 * Interface for Textarea element with methods
 */
export interface TextareaElement extends HTMLDivElement {
  /** Get the current textarea value */
  getValue: () => string;
  /** Set the textarea value */
  setValue: (value: string) => void;
  /** Set the error state */
  setError: (error: string | boolean | undefined) => void;
  /** Focus the textarea */
  focusTextarea: () => void;
  /** Disable/enable the textarea */
  setDisabled: (disabled: boolean) => void;
  /** Get the underlying textarea element */
  getTextarea: () => HTMLTextAreaElement;
  /** Destroy the component and clean up resources */
  destroy?: () => void;
}
