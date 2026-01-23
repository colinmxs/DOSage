/**
 * Divider Component Types
 *
 * Type definitions for the Divider layout component.
 */

import type { BaseComponentProps, SpacingValue, Orientation } from '../../types/common';

/**
 * Divider line style variants using box-drawing characters
 */
export type DividerVariant = 'single' | 'double' | 'thick' | 'dashed';

/**
 * Props for the Divider component
 */
export interface DividerProps extends BaseComponentProps {
  /**
   * Divider orientation.
   * @default 'horizontal'
   */
  orientation?: Orientation;

  /**
   * Line style variant.
   * @default 'single'
   */
  variant?: DividerVariant;

  /**
   * Custom character to use (overrides variant).
   */
  character?: string;

  /**
   * Divider length.
   * Can be a number (characters), string (CSS value), or 'full'.
   * @default 'full'
   */
  length?: string | number | 'full';

  /**
   * Margin around divider.
   */
  margin?: SpacingValue;
}

/**
 * Box-drawing characters for dividers
 */
export const DIVIDER_CHARACTERS = {
  horizontal: {
    single: '─',    // U+2500
    double: '═',    // U+2550
    thick: '█',     // U+2588
    dashed: '┄',    // U+2504
  },
  vertical: {
    single: '│',    // U+2502
    double: '║',    // U+2551
    thick: '█',     // U+2588
    dashed: '┆',    // U+2506
  },
} as const;
