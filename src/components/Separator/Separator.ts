/**
 * Separator Component
 *
 * A simple separator for adding vertical spacing between content.
 * Can show a subtle visible line or just provide spacing.
 */

import type { SeparatorProps } from './Separator.types';
import type { SpacingValue } from '../../types/common';
import './Separator.css';

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
 * Creates a DOS-style separator element.
 *
 * @param props - Separator configuration options
 * @returns The separator DOM element
 *
 * @example
 * ```typescript
 * import { createSeparator } from 'dosage';
 *
 * // Invisible spacer
 * const spacer = createSeparator({
 *   spacing: 'lg',
 * });
 *
 * // Visible separator line
 * const divider = createSeparator({
 *   spacing: 'md',
 *   visible: true,
 * });
 *
 * document.body.appendChild(spacer);
 * ```
 */
export function createSeparator(props: SeparatorProps = {}): HTMLElement {
  const {
    spacing = 'md',
    visible = false,
    className,
    id,
  } = props;

  // Create element
  const element = document.createElement('div');

  // Build class list
  const classes = ['dos-separator'];

  // Add visibility class
  classes.push(visible ? 'dos-separator--visible' : 'dos-separator--hidden');

  // Add spacing class or style
  if (isSpacingPreset(spacing)) {
    classes.push(`dos-separator--spacing-${spacing}`);
  } else {
    const spacingValue = spacingToCss(spacing);
    element.style.height = spacingValue;
    element.style.marginTop = spacingValue;
    element.style.marginBottom = spacingValue;
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
  if (visible) {
    element.setAttribute('role', 'separator');
  } else {
    element.setAttribute('aria-hidden', 'true');
  }

  return element;
}
