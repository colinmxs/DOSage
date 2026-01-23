/**
 * Divider Component
 *
 * A DOS-style divider using box-drawing characters.
 * Can be horizontal or vertical with different line styles.
 */

import type { DividerProps, DividerVariant } from './Divider.types';
import { DIVIDER_CHARACTERS } from './Divider.types';
import type { SpacingValue, Orientation } from '../../types/common';
import './Divider.css';

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
 * Get the divider character based on orientation and variant
 */
function getDividerCharacter(
  orientation: Orientation,
  variant: DividerVariant,
  customChar?: string
): string {
  if (customChar) {
    return customChar;
  }
  return DIVIDER_CHARACTERS[orientation][variant];
}

/**
 * Generate a repeated character string for the divider
 * Note: For CSS-based stretching, we use a single character with overflow hidden
 */
function generateDividerLine(char: string, length: string | number | 'full'): string {
  if (length === 'full') {
    // Return many characters - CSS will clip to fit
    return char.repeat(200);
  }

  if (typeof length === 'number') {
    return char.repeat(length);
  }

  // For CSS length values, return many and let CSS handle it
  return char.repeat(200);
}

/**
 * Creates a DOS-style divider element.
 *
 * @param props - Divider configuration options
 * @returns The divider DOM element
 *
 * @example
 * ```typescript
 * import { createDivider } from 'dosage';
 *
 * // Horizontal single line
 * const divider1 = createDivider();
 *
 * // Vertical double line
 * const divider2 = createDivider({
 *   orientation: 'vertical',
 *   variant: 'double',
 * });
 *
 * // Custom character
 * const divider3 = createDivider({
 *   character: '═',
 *   margin: 'md',
 * });
 *
 * document.body.appendChild(divider1);
 * ```
 */
export function createDivider(props: DividerProps = {}): HTMLElement {
  const {
    orientation = 'horizontal',
    variant = 'single',
    character,
    length = 'full',
    margin,
    className,
    id,
  } = props;

  // Create element
  const element = document.createElement('div');

  // Build class list
  const classes = [
    'dos-divider',
    `dos-divider--${orientation}`,
    `dos-divider--${variant}`,
  ];

  // Add margin class or style
  if (margin !== undefined) {
    if (isSpacingPreset(margin)) {
      classes.push(`dos-divider--margin-${margin}`);
    } else {
      const marginValue = spacingToCss(margin);
      if (orientation === 'horizontal') {
        element.style.marginTop = marginValue;
        element.style.marginBottom = marginValue;
      } else {
        element.style.marginLeft = marginValue;
        element.style.marginRight = marginValue;
      }
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

  // Add ARIA attributes
  element.setAttribute('role', 'separator');
  element.setAttribute('aria-orientation', orientation);

  // Create the line element
  const lineElement = document.createElement('span');
  lineElement.className = 'dos-divider__line';

  // Get the character to use
  const char = getDividerCharacter(orientation, variant, character);

  // Set the divider content
  lineElement.textContent = generateDividerLine(char, length);

  // Handle specific length
  if (typeof length === 'string' && length !== 'full') {
    if (orientation === 'horizontal') {
      element.style.width = length;
    } else {
      element.style.height = length;
    }
  } else if (typeof length === 'number') {
    // Character count - use ch unit
    if (orientation === 'horizontal') {
      element.style.width = `${length}ch`;
    } else {
      element.style.height = `${length}em`;
    }
    lineElement.textContent = char.repeat(length);
  }

  element.appendChild(lineElement);

  return element;
}
