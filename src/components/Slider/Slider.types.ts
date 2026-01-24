/**
 * Slider/Range Component Types
 *
 * DOS-style slider with value selection.
 */

/**
 * Size variants for the slider component.
 */
export type SliderSize = 'sm' | 'md' | 'lg';

/**
 * Orientation for the slider component.
 */
export type SliderOrientation = 'horizontal' | 'vertical';

/**
 * Props for the Slider component.
 */
export interface SliderProps {
  /**
   * Current value of the slider.
   * Use an array [min, max] for range mode.
   * @default 0
   */
  value?: number | [number, number];

  /**
   * Minimum value.
   * @default 0
   */
  min?: number;

  /**
   * Maximum value.
   * @default 100
   */
  max?: number;

  /**
   * Step increment.
   * @default 1
   */
  step?: number;

  /**
   * Label for the slider.
   */
  label?: string;

  /**
   * Whether to display the current value.
   * @default false
   */
  showValue?: boolean;

  /**
   * Whether to show tick marks.
   * @default false
   */
  showTicks?: boolean;

  /**
   * Number of tick marks to display.
   * @default 5
   */
  tickCount?: number;

  /**
   * Enable range selection (two thumbs).
   * @default false
   */
  range?: boolean;

  /**
   * Size variant.
   * @default 'md'
   */
  size?: SliderSize;

  /**
   * Name attribute for form submission.
   */
  name?: string;

  /**
   * Whether the slider is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback fired when value changes.
   */
  onChange?: (value: number | [number, number]) => void;

  /**
   * Callback fired when drag ends.
   */
  onChangeEnd?: (value: number | [number, number]) => void;

  /**
   * Callback fired when slider receives focus.
   */
  onFocus?: () => void;

  /**
   * Callback fired when slider loses focus.
   */
  onBlur?: () => void;

  /**
   * Custom format function for value display.
   */
  formatValue?: (value: number) => string;

  /**
   * Additional CSS class names.
   */
  className?: string;

  /**
   * HTML id attribute.
   */
  id?: string;
}

/**
 * Extended HTMLElement with Slider-specific methods.
 */
export interface SliderElement extends HTMLElement {
  /**
   * Gets the current value.
   */
  getValue: () => number | [number, number];

  /**
   * Sets the value.
   */
  setValue: (value: number | [number, number]) => void;

  /**
   * Sets the disabled state.
   */
  setDisabled: (disabled: boolean) => void;

  /**
   * Sets the minimum value.
   */
  setMin: (min: number) => void;

  /**
   * Sets the maximum value.
   */
  setMax: (max: number) => void;

  /**
   * Cleans up event listeners and DOM.
   */
  destroy: () => void;
}
