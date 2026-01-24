/**
 * DatePicker component types
 * DOS-style date picker with calendar popup
 */

/**
 * Function type for determining if a date should be disabled
 */
export type DisabledDateFn = (date: Date) => boolean;

/**
 * Props for the DatePicker component
 */
export interface DatePickerProps {
  /**
   * Selected date value
   * Can be a Date object, ISO string, or undefined for no selection
   */
  value?: Date | string;

  /**
   * Label text displayed above the input
   */
  label?: string;

  /**
   * Placeholder text when no date is selected
   * @default 'Select date...'
   */
  placeholder?: string;

  /**
   * Date format for display
   * Supported tokens: YYYY, MM, DD
   * @default 'YYYY-MM-DD'
   */
  format?: string;

  /**
   * Minimum selectable date
   */
  min?: Date | string;

  /**
   * Maximum selectable date
   */
  max?: Date | string;

  /**
   * Whether the date picker is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Specific dates to disable
   * Can be an array of dates or a function that returns true for disabled dates
   */
  disabledDates?: Date[] | DisabledDateFn;

  /**
   * Error state or error message
   * Boolean true shows error styling, string shows error message
   */
  error?: boolean | string;

  /**
   * Name attribute for the hidden input
   */
  name?: string;

  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;

  /**
   * Callback fired when the selected date changes
   */
  onChange?: (date: Date | null, formatted: string) => void;

  /**
   * Callback fired when the calendar opens
   */
  onOpen?: () => void;

  /**
   * Callback fired when the calendar closes
   */
  onClose?: () => void;
}

/**
 * Internal state for the DatePicker
 */
export interface DatePickerState {
  /** Currently displayed month (1-12) */
  viewMonth: number;
  /** Currently displayed year */
  viewYear: number;
  /** Whether the calendar popup is open */
  isOpen: boolean;
  /** Currently focused date in the calendar grid */
  focusedDate: Date | null;
  /** Whether the component is focused */
  isFocused: boolean;
}

/**
 * DatePicker element with extended methods
 */
export interface DatePickerElement extends HTMLDivElement {
  /**
   * Get the currently selected date
   */
  getValue: () => Date | null;

  /**
   * Set the selected date
   */
  setValue: (date: Date | string | null) => void;

  /**
   * Get the formatted date string
   */
  getFormattedValue: () => string;

  /**
   * Open the calendar popup
   */
  open: () => void;

  /**
   * Close the calendar popup
   */
  close: () => void;

  /**
   * Toggle the calendar popup
   */
  toggle: () => void;

  /**
   * Check if the calendar is open
   */
  isOpen: () => boolean;

  /**
   * Set the disabled state
   */
  setDisabled: (disabled: boolean) => void;

  /**
   * Set the error state
   */
  setError: (error: boolean | string) => void;

  /**
   * Clear the selected date
   */
  clear: () => void;

  /**
   * Navigate to a specific month/year
   */
  navigateTo: (month: number, year: number) => void;

  /**
   * Focus the input element
   */
  focus: () => void;

  /**
   * Clean up event listeners
   */
  destroy: () => void;
}
