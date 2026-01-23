/**
 * Grid Component
 *
 * A CSS Grid layout component for creating grid-based layouts.
 * Includes Grid container and GridItem for positioning.
 */

import type { GridProps, GridItemProps, GridGap } from './Grid.types';
import type { SpacingValue } from '../../types/common';
import './Grid.css';

/**
 * Valid spacing preset names
 */
const SPACING_PRESETS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * Check if a value is a spacing preset string
 */
function isSpacingPreset(value: SpacingValue): value is (typeof SPACING_PRESETS)[number] {
  return typeof value === 'string' && SPACING_PRESETS.includes(value as (typeof SPACING_PRESETS)[number]);
}

/**
 * Check if gap is an object with row/column values
 */
function isGapObject(gap: SpacingValue | GridGap): gap is GridGap {
  return typeof gap === 'object' && gap !== null && ('row' in gap || 'column' in gap);
}

/**
 * Convert spacing value to CSS value
 */
function spacingToCss(value: SpacingValue): string {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return value;
}

/**
 * Convert columns/rows value to grid-template value
 */
function templateToCss(value: number | string): string {
  if (typeof value === 'number') {
    return `repeat(${value}, 1fr)`;
  }
  return value;
}

/**
 * Creates a DOS-style grid container.
 *
 * @param props - Grid configuration options
 * @returns The grid DOM element
 *
 * @example
 * ```typescript
 * import { createGrid, createGridItem } from 'dosage';
 *
 * const grid = createGrid({
 *   columns: 3,
 *   gap: 'md',
 * });
 *
 * for (let i = 0; i < 6; i++) {
 *   const item = createGridItem();
 *   item.textContent = `Item ${i + 1}`;
 *   grid.appendChild(item);
 * }
 *
 * document.body.appendChild(grid);
 * ```
 */
export function createGrid(props: GridProps = {}): HTMLElement {
  const {
    columns = 1,
    rows,
    gap = 'md',
    alignItems = 'stretch',
    justifyItems = 'stretch',
    className,
    id,
  } = props;

  // Create element
  const element = document.createElement('div');

  // Build class list
  const classes = ['dos-grid'];

  // Add alignment classes
  classes.push(`dos-grid--align-${alignItems}`);
  classes.push(`dos-grid--justify-${justifyItems}`);

  // Handle gap
  if (isGapObject(gap)) {
    if (gap.row !== undefined) {
      if (isSpacingPreset(gap.row)) {
        classes.push(`dos-grid--row-gap-${gap.row}`);
      } else {
        element.style.rowGap = spacingToCss(gap.row);
      }
    }
    if (gap.column !== undefined) {
      if (isSpacingPreset(gap.column)) {
        classes.push(`dos-grid--column-gap-${gap.column}`);
      } else {
        element.style.columnGap = spacingToCss(gap.column);
      }
    }
  } else {
    if (isSpacingPreset(gap)) {
      classes.push(`dos-grid--gap-${gap}`);
    } else {
      element.style.gap = spacingToCss(gap);
    }
  }

  if (className) {
    classes.push(className);
  }

  element.className = classes.join(' ');

  // Apply ID if provided
  if (id) {
    element.id = id;
  }

  // Apply grid template
  element.style.gridTemplateColumns = templateToCss(columns);

  if (rows !== undefined) {
    element.style.gridTemplateRows = templateToCss(rows);
  }

  return element;
}

/**
 * Creates a grid item for positioning within a Grid.
 *
 * @param props - GridItem configuration options
 * @returns The grid item DOM element
 *
 * @example
 * ```typescript
 * import { createGridItem } from 'dosage';
 *
 * const item = createGridItem({
 *   colSpan: 2,
 *   rowSpan: 1,
 * });
 *
 * item.textContent = 'Spanning two columns';
 * ```
 */
export function createGridItem(props: GridItemProps = {}): HTMLElement {
  const {
    column,
    row,
    colSpan,
    rowSpan,
    className,
    id,
  } = props;

  // Create element
  const element = document.createElement('div');

  // Build class list
  const classes = ['dos-grid__item'];

  if (className) {
    classes.push(className);
  }

  element.className = classes.join(' ');

  // Apply ID if provided
  if (id) {
    element.id = id;
  }

  // Apply grid positioning
  if (column !== undefined) {
    element.style.gridColumn = typeof column === 'number' ? String(column) : column;
  } else if (colSpan !== undefined) {
    element.style.gridColumn = `span ${colSpan}`;
  }

  if (row !== undefined) {
    element.style.gridRow = typeof row === 'number' ? String(row) : row;
  } else if (rowSpan !== undefined) {
    element.style.gridRow = `span ${rowSpan}`;
  }

  return element;
}
