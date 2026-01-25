/**
 * Box Component
 *
 * A generic container with flexible styling options for borders,
 * padding, margin, and display modes.
 */

import type { BoxProps } from './Box.types';
import type { SpacingValue, BorderConfig } from '../../types/common';
import './Box.css';

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
 * Convert spacing value to CSS value
 */
function spacingToCss(value: SpacingValue): string {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return value;
}

/**
 * Convert dimension value to CSS
 */
function dimensionToCss(value: string | number): string {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return value;
}

/**
 * Apply border config to element
 */
function applyBorder(element: HTMLElement, border: boolean | BorderConfig): void {
  if (border === true) {
    element.classList.add('dos-box--bordered');
  } else if (typeof border === 'object') {
    const { width = 1, style = 'solid', color, sides = 'all' } = border;
    const borderValue = `${width}px ${style} ${color ?? 'var(--dos-color-border)'}`;

    if (sides === 'all') {
      element.style.border = borderValue;
    } else if (Array.isArray(sides)) {
      sides.forEach((side) => {
        element.style[`border${capitalize(side)}` as 'borderTop'] = borderValue;
      });
    } else {
      element.style[`border${capitalize(sides)}` as 'borderTop'] = borderValue;
    }
  }
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Creates a DOS-style box element.
 *
 * @param props - Box configuration options
 * @returns The box DOM element
 *
 * @example
 * ```typescript
 * import { createBox } from 'dosage';
 *
 * const box = createBox({
 *   border: true,
 *   padding: 'md',
 *   display: 'flex',
 * });
 *
 * document.body.appendChild(box);
 * ```
 */
export function createBox(props: BoxProps = {}): HTMLElement {
  const {
    border = false,
    padding,
    margin,
    display = 'block',
    width,
    height,
    backgroundColor,
    className,
    id,
  } = props;

  // Create element
  const element = document.createElement('div');

  // Build class list
  const classes = ['dos-box', `dos-box--${display}`];

  // Add padding class or style
  if (padding !== undefined) {
    if (isSpacingPreset(padding)) {
      classes.push(`dos-box--padding-${padding}`);
    } else {
      element.style.padding = spacingToCss(padding);
    }
  }

  // Add margin class or style
  if (margin !== undefined) {
    if (isSpacingPreset(margin)) {
      classes.push(`dos-box--margin-${margin}`);
    } else {
      element.style.margin = spacingToCss(margin);
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

  // Apply border
  if (border) {
    applyBorder(element, border);
  }

  // Apply dimensions
  if (width !== undefined) {
    element.style.width = dimensionToCss(width);
  }

  if (height !== undefined) {
    element.style.height = dimensionToCss(height);
  }

  // Apply background color
  if (backgroundColor) {
    element.style.backgroundColor = backgroundColor;
  }

  return element;
}
