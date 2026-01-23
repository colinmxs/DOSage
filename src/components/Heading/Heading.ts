/**
 * Heading Component
 *
 * DOS-style heading component with semantic HTML levels and optional decorations.
 */

import type { HeadingProps } from './Heading.types';
import './Heading.css';

/**
 * Creates a DOS-style heading element.
 *
 * @param props - Heading configuration options
 * @returns The heading DOM element (h1-h6)
 *
 * @example
 * ```typescript
 * const heading = createHeading({
 *   level: 1,
 *   children: 'Welcome to DOSage',
 *   decorated: true,
 *   uppercase: true
 * });
 * document.body.appendChild(heading);
 * ```
 */
export function createHeading(props: HeadingProps): HTMLHeadingElement {
  const {
    level,
    children,
    align = 'left',
    uppercase = false,
    decorated = false,
    className = '',
    id,
  } = props;

  // Create the appropriate heading element
  const heading = document.createElement(`h${level}`) as HTMLHeadingElement;

  // Build class list
  const classes = [
    'dos-heading',
    `dos-heading--h${level}`,
    `dos-heading--${align}`,
  ];

  if (uppercase) {
    classes.push('dos-heading--uppercase');
  }

  if (decorated) {
    classes.push('dos-heading--decorated');
  }

  if (className) {
    classes.push(className);
  }

  heading.className = classes.join(' ');

  // Set content
  if (typeof children === 'string') {
    heading.textContent = children;
  } else {
    heading.appendChild(children);
  }

  // Set ID if provided
  if (id) {
    heading.id = id;
  }

  // Add decoration if requested
  if (decorated) {
    addDecoration(heading, children);
  }

  return heading;
}

/**
 * Adds DOS-style decoration (underline) to a heading
 *
 * @param heading - The heading element
 * @param content - The heading content
 */
function addDecoration(heading: HTMLHeadingElement, content: string | HTMLElement): void {
  // Create a wrapper to contain both heading text and decoration
  const textContent = typeof content === 'string' ? content : content.textContent || '';
  
  // Calculate decoration length based on text content length
  const decorationLength = textContent.length;
  const decorationChar = '═';
  const decoration = decorationChar.repeat(decorationLength);

  // Create decoration element
  const decorationElement = document.createElement('div');
  decorationElement.className = 'dos-heading___decoration';
  decorationElement.textContent = decoration;
  decorationElement.setAttribute('aria-hidden', 'true');

  // Append decoration after the heading content
  heading.appendChild(decorationElement);
}
