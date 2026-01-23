/**
 * Box Component Types
 *
 * Type definitions for the Box layout component.
 */

import type { BaseComponentProps, SpacingValue, BorderConfig, DisplayMode } from '../../types/common';

/**
 * Props for the Box component
 */
export interface BoxProps extends BaseComponentProps {
  /**
   * Border configuration.
   * Can be a boolean (show/hide default border) or full config.
   * @default false
   */
  border?: boolean | BorderConfig;

  /**
   * Internal padding.
   */
  padding?: SpacingValue;

  /**
   * External margin.
   */
  margin?: SpacingValue;

  /**
   * Display mode.
   * @default 'block'
   */
  display?: DisplayMode;

  /**
   * Width (number for pixels, string for CSS value).
   */
  width?: string | number;

  /**
   * Height (number for pixels, string for CSS value).
   */
  height?: string | number;

  /**
   * Background color override.
   */
  backgroundColor?: string;
}
