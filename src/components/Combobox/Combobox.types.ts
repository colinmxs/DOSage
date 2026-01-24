/**
 * Combobox Component Types
 *
 * Type definitions for the DOS-style combobox component.
 */

/**
 * Combobox option definition
 */
export interface ComboboxOption {
  /** Unique value for the option */
  value: string;
  /** Display label for the option */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Optional description shown below the label */
  description?: string;
  /** Optional icon to display */
  icon?: string;
  /** Optional group/category for grouping options */
  group?: string;
  /** Custom data associated with the option */
  data?: unknown;
}

/**
 * Option group definition
 */
export interface ComboboxGroup {
  /** Group identifier */
  id: string;
  /** Group label */
  label: string;
  /** Optional icon */
  icon?: string;
}

/**
 * Custom option renderer function type
 */
export type ComboboxRenderOption = (option: ComboboxOption, isHighlighted: boolean, isSelected: boolean) => HTMLElement | string;

/**
 * Combobox component configuration options
 */
export interface ComboboxProps {
  /** Array of options to display */
  options: ComboboxOption[];

  /** Optional option groups for organizing options */
  groups?: ComboboxGroup[];

  /** Currently selected value */
  value?: string;

  /** Placeholder text when no value selected */
  placeholder?: string;

  /** Whether to allow free-form input (values not in list) */
  allowFreeform?: boolean;

  /** Whether value must match an option (strict mode) */
  strict?: boolean;

  /** Whether to filter options as user types (default: true) */
  filterOnType?: boolean;

  /** Custom filter function */
  filterFunction?: (option: ComboboxOption, query: string) => boolean;

  /** Custom option renderer */
  renderOption?: ComboboxRenderOption;

  /** Whether the combobox is disabled */
  disabled?: boolean;

  /** Whether the combobox is required */
  required?: boolean;

  /** Optional name attribute for form submission */
  name?: string;

  /** Message shown when no options match filter (default: "No matches found") */
  noMatchesMessage?: string;

  /** Maximum height of dropdown in pixels */
  maxDropdownHeight?: number;

  /** Custom className for the container */
  className?: string;

  /** Custom id for the container */
  id?: string;

  /** Callback fired when value changes */
  onChange?: (value: string, option: ComboboxOption | null) => void;

  /** Callback fired when dropdown opens/closes */
  onDropdownToggle?: (open: boolean) => void;

  /** Callback fired on input change */
  onInput?: (query: string) => void;
}

/**
 * Internal state for Combobox
 */
export interface ComboboxState {
  /** Current input value (may differ from selected value during typing) */
  inputValue: string;
  /** Currently selected value */
  selectedValue: string;
  /** Whether dropdown is open */
  isOpen: boolean;
  /** Index of highlighted option (-1 for none) */
  highlightedIndex: number;
  /** Filtered options based on current input */
  filteredOptions: ComboboxOption[];
}

/**
 * Custom event detail for combobox change
 */
export interface ComboboxChangeEventDetail {
  value: string;
  option: ComboboxOption | null;
  previousValue: string;
}

/**
 * Extended HTMLElement with Combobox public API
 */
export interface ComboboxElement extends HTMLElement {
  /** Get the current selected value */
  getValue: () => string;

  /** Set the selected value */
  setValue: (value: string) => void;

  /** Get the selected option (null if freeform value) */
  getSelectedOption: () => ComboboxOption | null;

  /** Open the dropdown */
  open: () => void;

  /** Close the dropdown */
  close: () => void;

  /** Toggle the dropdown */
  toggle: () => void;

  /** Whether the dropdown is currently open */
  isOpen: () => boolean;

  /** Get the highlighted option */
  getHighlightedOption: () => ComboboxOption | null;

  /** Update options programmatically */
  setOptions: (options: ComboboxOption[]) => void;

  /** Get current options */
  getOptions: () => ComboboxOption[];

  /** Focus the input */
  focus: () => void;

  /** Blur the input */
  blur: () => void;

  /** Whether the combobox is disabled */
  isDisabled: () => boolean;

  /** Set disabled state */
  setDisabled: (disabled: boolean) => void;

  /** Clean up event listeners */
  destroy: () => void;
}
