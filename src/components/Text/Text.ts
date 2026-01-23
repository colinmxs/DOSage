/**
 * Text Component
 *
 * DOS-style text component with size, weight, and alignment options.
 */

import type { TextProps } from './Text.types';
import './Text.css';

/**
 * Creates a DOS-style text element.
 *
 * @param props - Text configuration options
 * @returns The text DOM element (p, span, or div)
 *
 * @example
 * ```typescript
 * const text = createText({
 *   children: 'This is some DOS-style text.',
 *   size: 'base',
 *   weight: 'normal',
 *   align: 'left'
 * });
 * document.body.appendChild(text);
 * ```
 */
export function createText(props: TextProps): HTMLElement {
  const {
    children,
    size = 'base',
    weight = 'normal',
    color,
    align = 'left',
    truncate = false,
    as = 'p',
    className = '',
    id,
  } = props;

  // Create the appropriate text element
  const element = document.createElement(as);

  // Build class list
  const classes = ['dos-text', `dos-text--${size}`, `dos-text--${align}`];

  if (weight === 'bold') {
    classes.push('dos-text--bold');
  }

  if (truncate) {
    classes.push('dos-text--truncate');
  }

  if (className) {
    classes.push(className);
  }

  element.className = classes.join(' ');

  // Set content
  if (typeof children === 'string') {
    element.textContent = children;
  } else {
    element.appendChild(children);
  }

  // Apply custom color if provided
  if (color) {
    element.style.color = color;
  }

  // Set ID if provided
  if (id) {
    element.id = id;
  }

  return element;
}
