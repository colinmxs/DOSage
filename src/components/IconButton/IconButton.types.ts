/**
 * IconButton Component Types
 *
 * Type definitions for the IconButton component.
 */

import type { BaseComponentProps } from '../../types/common';
import type { ButtonSize, ButtonVariant } from '../Button/Button.types';

/**
 * Props for the IconButton component
 */
export interface IconButtonProps extends BaseComponentProps {
  /**
   * Icon character or ASCII art to display.
   * Examples: 'X', '?', 'i', '▲', '▼', '►', '◄'
   */
  icon: string;

  /**
   * Accessible label (required for screen readers).
   * Since there's no visible text, this is mandatory.
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
   * Click event handler.
   */
  onClick?: (event: MouseEvent) => void;
}
