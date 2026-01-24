/**
 * Toggle/Switch Component Types
 *
 * DOS-style toggle switch with ON/OFF states.
 */

/**
 * Visual style for the toggle component.
 */
export type ToggleStyle = 'text' | 'slider';

/**
 * Size variants for the toggle component.
 */
export type ToggleSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Toggle component.
 */
export interface ToggleProps {
  /**
   * Whether the toggle is checked/on.
   * @default false
   */
  checked?: boolean;

  /**
   * Label text for the toggle.
   */
  label?: string;

  /**
   * Position of the label relative to the toggle.
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';

  /**
   * Text to display when toggle is on.
   * @default 'ON'
   */
  onLabel?: string;

  /**
   * Text to display when toggle is off.
   * @default 'OFF'
   */
  offLabel?: string;

  /**
   * Visual style of the toggle.
   * - 'text': Shows [ON ] / [OFF] style
   * - 'slider': Shows [■──] / [──■] style
   * @default 'text'
   */
  style?: ToggleStyle;

  /**
   * Size variant for the toggle.
   * @default 'md'
   */
  size?: ToggleSize;

  /**
   * Name attribute for form submission.
   */
  name?: string;

  /**
   * Whether the toggle is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback fired when toggle state changes.
   */
  onChange?: (checked: boolean) => void;

  /**
   * Callback fired when toggle receives focus.
   */
  onFocus?: () => void;

  /**
   * Callback fired when toggle loses focus.
   */
  onBlur?: () => void;

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
 * Extended HTMLElement with Toggle-specific methods.
 */
export interface ToggleElement extends HTMLElement {
  /**
   * Gets the current checked state.
   */
  getChecked: () => boolean;

  /**
   * Sets the checked state.
   */
  setChecked: (checked: boolean) => void;

  /**
   * Toggles the checked state.
   */
  toggle: () => void;

  /**
   * Sets the disabled state.
   */
  setDisabled: (disabled: boolean) => void;

  /**
   * Cleans up event listeners and DOM.
   */
  destroy: () => void;
}
