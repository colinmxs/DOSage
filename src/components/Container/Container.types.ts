/**
 * Container Component Types
 *
 * Type definitions for the Container layout component.
 */

import type { BaseComponentProps, SpacingValue } from '../../types/common';

/**
 * Padding configuration for Container
 */
export interface ContainerPadding {
  /** Horizontal padding (left and right) */
  x?: SpacingValue;
  /** Vertical padding (top and bottom) */
  y?: SpacingValue;
}

/**
 * Props for the Container component
 */
export interface ContainerProps extends BaseComponentProps {
  /**
   * Padding around content.
   * Can be a single value or an object with x/y values.
   * @default 'md'
   */
  padding?: SpacingValue | ContainerPadding;

  /**
   * Maximum width constraint.
   * Can be a number (pixels) or CSS string value.
   */
  maxWidth?: string | number;

  /**
   * Center the container horizontally.
   * @default false
   */
  centered?: boolean;

  /**
   * HTML element to render as.
   * @default 'div'
   */
  as?: keyof HTMLElementTagNameMap;
}
