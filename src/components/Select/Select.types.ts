/**
 * Select Component Types
 *
 * Type definitions for the DOS-style Select/Dropdown component.
 */

import type { BaseComponentProps, SizeVariant } from '../../types/common';

/**
 * Individual select option configuration
 */
export interface SelectOption {
  /**
   * Option value (what's submitted/returned)
   */
  value: string;

  /**
   * Display text for the option
   */
  label: string;

  /**
   * Whether the option is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional group name for grouping options
   */
  group?: string;
}

/**
 * Option group configuration
 */
export interface SelectOptionGroup {
  /**
   * Group label
   */
  label: string;

  /**
   * Options in this group
   */
  options: SelectOption[];

  /**
   * Whether the entire group is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Props for the Select component
 */
export interface SelectProps extends BaseComponentProps {
  /**
   * Currently selected value(s).
   * String for single select, string array for multiple select.
   */
  value?: string | string[];

  /**
   * Available options to select from.
   */
  options: SelectOption[];

  /**
   * Placeholder text when nothing is selected.
   * @default 'Select...'
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
   * Allow multiple selection.
   * @default false
   */
  multiple?: boolean;

  /**
   * Enable filtering/searching options.
   * @default false
   */
  searchable?: boolean;

  /**
   * Size variant.
   * @default 'medium'
   */
  size?: SizeVariant;

  /**
   * Whether the select is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the field is required.
   * @default false
   */
  required?: boolean;

  /**
   * Error state or error message.
   * Boolean true shows error styling, string shows message.
   */
  error?: string | boolean;

  /**
   * Maximum height for dropdown (in rows or pixels).
   * @default 6
   */
  maxVisibleOptions?: number;

  /**
   * Called when selection changes.
   */
  onChange?: (value: string | string[], event?: Event) => void;

  /**
   * Called when dropdown opens.
   */
  onOpen?: () => void;

  /**
   * Called when dropdown closes.
   */
  onClose?: () => void;

  /**
   * Called when the select receives focus.
   */
  onFocus?: (event: FocusEvent) => void;

  /**
   * Called when the select loses focus.
   */
  onBlur?: (event: FocusEvent) => void;
}

/**
 * Extended HTMLElement with Select-specific methods
 */
export interface SelectElement extends HTMLDivElement {
  /**
   * Gets the current selected value(s).
   */
  getValue(): string | string[];

  /**
   * Sets the selected value(s).
   */
  setValue(value: string | string[]): void;

  /**
   * Opens the dropdown.
   */
  open(): void;

  /**
   * Closes the dropdown.
   */
  close(): void;

  /**
   * Toggles the dropdown state.
   */
  toggle(): void;

  /**
   * Whether the dropdown is currently open.
   */
  isOpen(): boolean;

  /**
   * Sets the disabled state.
   */
  setDisabled(disabled: boolean): void;

  /**
   * Sets the error state.
   */
  setError(error: string | boolean): void;

  /**
   * Updates the available options.
   */
  setOptions(options: SelectOption[]): void;

  /**
   * Clears the selection.
   */
  clear(): void;

  /**
   * Destroys the component and cleans up event listeners.
   */
  destroy(): void;
}
