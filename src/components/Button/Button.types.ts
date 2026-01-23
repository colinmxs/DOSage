/**
 * Button Component Types
 *
 * Type definitions for the DOS-style Button component.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Button variant styles
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/**
 * Button size options
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button HTML type attribute
 */
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Icon position within the button
 */
export type IconPosition = 'left' | 'right';

/**
 * Props for the Button component
 */
export interface ButtonProps extends BaseComponentProps {
  /**
   * Button text content.
   */
  label: string;

  /**
   * Button visual variant.
   * @default 'secondary'
   */
  variant?: ButtonVariant;

  /**
   * Button size.
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the button is in loading state.
   * Shows ASCII spinner animation when true.
   * @default false
   */
  loading?: boolean;

  /**
   * HTML button type attribute.
   * @default 'button'
   */
  type?: ButtonType;

  /**
   * Optional icon/character to display.
   * Can be a single character or short ASCII art.
   */
  icon?: string;

  /**
   * Position of the icon relative to the label.
   * @default 'left'
   */
  iconPosition?: IconPosition;

  /**
   * Whether the button should expand to full container width.
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Click event handler.
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Accessible label for screen readers.
   * Use when the button label is not descriptive enough.
   */
  ariaLabel?: string;
}
