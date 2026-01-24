/**
 * @file ProgressBar type definitions
 * @description TypeScript interfaces for the DOS-style progress bar component
 */

/**
 * Progress bar size options
 */
export type ProgressBarSize = 'small' | 'medium' | 'large';

/**
 * Progress bar style variants
 */
export type ProgressBarStyle = 'blocks' | 'boxed';

/**
 * Custom value formatter function
 */
export type ProgressBarValueFormatter = (value: number, max: number) => string;

/**
 * Progress bar component props
 */
export interface ProgressBarProps {
  /**
   * Current progress value (0 to max)
   * @default 0
   */
  value?: number;

  /**
   * Maximum value
   * @default 100
   */
  max?: number;

  /**
   * Whether to display the value/percentage
   * @default false
   */
  showValue?: boolean;

  /**
   * Custom value formatter function
   * If not provided, displays as percentage
   */
  valueFormat?: ProgressBarValueFormatter;

  /**
   * Whether progress is indeterminate (unknown)
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Size of the progress bar
   * @default 'medium'
   */
  size?: ProgressBarSize;

  /**
   * Visual style of the progress bar
   * - 'blocks': ████████░░░░░░░░ (solid block fill)
   * - 'boxed': [████████        ] (bracketed)
   * @default 'blocks'
   */
  style?: ProgressBarStyle;

  /**
   * Custom fill color (CSS color value)
   */
  color?: string;

  /**
   * Accessible label for the progress bar
   */
  label?: string;

  /**
   * Optional unique identifier
   */
  id?: string;

  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * Progress bar instance methods
 */
export interface ProgressBarInstance {
  /**
   * The progress bar DOM element
   */
  readonly element: HTMLElement;

  /**
   * Set the current value
   */
  setValue(value: number): void;

  /**
   * Get the current value
   */
  getValue(): number;

  /**
   * Set the maximum value
   */
  setMax(max: number): void;

  /**
   * Get the maximum value
   */
  getMax(): number;

  /**
   * Get the progress percentage (0-100)
   */
  getPercentage(): number;

  /**
   * Set indeterminate mode
   */
  setIndeterminate(indeterminate: boolean): void;

  /**
   * Check if in indeterminate mode
   */
  isIndeterminate(): boolean;

  /**
   * Clean up resources
   */
  destroy(): void;
}
