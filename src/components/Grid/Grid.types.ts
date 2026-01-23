/**
 * Grid Component Types
 *
 * Type definitions for the Grid and GridItem layout components.
 */

import type { BaseComponentProps, SpacingValue } from '../../types/common';

/**
 * Gap configuration for Grid
 */
export interface GridGap {
  /** Row gap */
  row?: SpacingValue;
  /** Column gap */
  column?: SpacingValue;
}

/**
 * Alignment options
 */
export type GridAlignment = 'start' | 'center' | 'end' | 'stretch';

/**
 * Props for the Grid component
 */
export interface GridProps extends BaseComponentProps {
  /**
   * Number of columns or grid-template-columns value.
   * @default 1
   */
  columns?: number | string;

  /**
   * Number of rows or grid-template-rows value.
   */
  rows?: number | string;

  /**
   * Grid gap (spacing between items).
   * Can be a single value or object with row/column values.
   * @default 'md'
   */
  gap?: SpacingValue | GridGap;

  /**
   * Vertical alignment of grid items.
   * @default 'stretch'
   */
  alignItems?: GridAlignment;

  /**
   * Horizontal alignment of grid items.
   * @default 'stretch'
   */
  justifyItems?: GridAlignment;
}

/**
 * Props for the GridItem component
 */
export interface GridItemProps extends BaseComponentProps {
  /**
   * Grid column position or span (e.g., "1", "1 / 3", "span 2").
   */
  column?: number | string;

  /**
   * Grid row position or span.
   */
  row?: number | string;

  /**
   * Number of columns to span.
   */
  colSpan?: number;

  /**
   * Number of rows to span.
   */
  rowSpan?: number;
}
