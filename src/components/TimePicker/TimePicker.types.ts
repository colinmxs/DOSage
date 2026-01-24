/**
 * TimePicker component types
 * DOS-style time picker with spinbox inputs
 */

/**
 * Time format type
 */
export type TimeFormat = '12h' | '24h';

/**
 * Time period for 12-hour format
 */
export type TimePeriod = 'AM' | 'PM';

/**
 * Parsed time representation
 */
export interface ParsedTime {
  hours: number;
  minutes: number;
  period?: TimePeriod;
}

/**
 * Props for the TimePicker component
 */
export interface TimePickerProps {
  /**
   * Selected time value
   * Can be a time string (HH:MM or HH:MM AM/PM) or Date object
   */
  value?: string | Date;

  /**
   * Label text displayed above the input
   */
  label?: string;

  /**
   * Time format
   * @default '12h'
   */
  format?: TimeFormat;

  /**
   * Minute increment step
   * @default 1
   */
  step?: number;

  /**
   * Minimum selectable time (HH:MM format)
   */
  min?: string;

  /**
   * Maximum selectable time (HH:MM format)
   */
  max?: string;

  /**
   * Whether the time picker is disabled
   * @default false
   */
  disabled?: boolean;

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
   * Placeholder text for empty state
   * @default '--:-- --'
   */
  placeholder?: string;

  /**
   * Callback fired when the time changes
   */
  onChange?: (time: string, parsed: ParsedTime | null) => void;
}

/**
 * TimePicker element with extended methods
 */
export interface TimePickerElement extends HTMLDivElement {
  /**
   * Get the current time value as a formatted string
   */
  getValue: () => string;

  /**
   * Get the parsed time object
   */
  getParsedValue: () => ParsedTime | null;

  /**
   * Set the time value
   */
  setValue: (value: string | Date | null) => void;

  /**
   * Set the hours value (0-23 for 24h, 1-12 for 12h)
   */
  setHours: (hours: number) => void;

  /**
   * Set the minutes value (0-59)
   */
  setMinutes: (minutes: number) => void;

  /**
   * Set the period (AM/PM) for 12h format
   */
  setPeriod: (period: TimePeriod) => void;

  /**
   * Toggle the period (AM/PM) for 12h format
   */
  togglePeriod: () => void;

  /**
   * Set the disabled state
   */
  setDisabled: (disabled: boolean) => void;

  /**
   * Set the error state
   */
  setError: (error: boolean | string) => void;

  /**
   * Clear the time value
   */
  clear: () => void;

  /**
   * Focus the hours input
   */
  focus: () => void;

  /**
   * Clean up event listeners
   */
  destroy: () => void;
}
