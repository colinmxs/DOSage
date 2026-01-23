/**
 * Container Component
 *
 * A layout container for wrapping content with consistent spacing and max-width.
 * Provides padding, centering, and max-width constraints.
 */

import type { ContainerProps, ContainerPadding } from './Container.types';
import type { SpacingValue } from '../../types/common';
import './Container.css';

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
 * Check if padding is an object with x/y values
 */
function isPaddingObject(padding: SpacingValue | ContainerPadding): padding is ContainerPadding {
  return typeof padding === 'object' && padding !== null && ('x' in padding || 'y' in padding);
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
 * Apply padding classes or inline styles to an element
 */
function applyPadding(element: HTMLElement, padding: SpacingValue | ContainerPadding): void {
  if (isPaddingObject(padding)) {
    // Object with x/y values
    if (padding.x !== undefined) {
      if (isSpacingPreset(padding.x)) {
        element.classList.add(`dos-container--padding-x-${padding.x}`);
      } else {
        const value = spacingToCss(padding.x);
        element.style.paddingLeft = value;
        element.style.paddingRight = value;
      }
    }
    if (padding.y !== undefined) {
      if (isSpacingPreset(padding.y)) {
        element.classList.add(`dos-container--padding-y-${padding.y}`);
      } else {
        const value = spacingToCss(padding.y);
        element.style.paddingTop = value;
        element.style.paddingBottom = value;
      }
    }
  } else {
    // Single value
    if (isSpacingPreset(padding)) {
      element.classList.add(`dos-container--padding-${padding}`);
    } else {
      element.style.padding = spacingToCss(padding);
    }
  }
}

/**
 * Creates a DOS-style container element.
 *
 * @param props - Container configuration options
 * @returns The container DOM element
 *
 * @example
 * ```typescript
 * import { createContainer } from 'dosage';
 *
 * const container = createContainer({
 *   padding: 'md',
 *   maxWidth: 800,
 *   centered: true,
 * });
 *
 * container.innerHTML = '<p>Content goes here</p>';
 * document.body.appendChild(container);
 * ```
 */
export function createContainer(props: ContainerProps = {}): HTMLElement {
  const {
    padding = 'md',
    maxWidth,
    centered = false,
    as = 'div',
    className,
    id,
  } = props;

  // Create element with specified tag
  const element = document.createElement(as);

  // Build class list
  const classes = ['dos-container'];

  if (centered) {
    classes.push('dos-container--centered');
  }

  if (className) {
    classes.push(className);
  }

  element.className = classes.join(' ');

  // Apply ID if provided
  if (id) {
    element.id = id;
  }

  // Apply padding
  applyPadding(element, padding);

  // Apply max-width
  if (maxWidth !== undefined) {
    element.style.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
  }

  return element;
}
