/**
 * Blockquote Component
 *
 * DOS-style blockquote component with left indicator and optional citation.
 */

import type { BlockquoteProps } from './Blockquote.types';
import './Blockquote.css';

/**
 * Creates a DOS-style blockquote element.
 *
 * @param props - Blockquote configuration options
 * @returns The blockquote DOM element
 *
 * @example
 * ```typescript
 * const quote = createBlockquote({
 *   children: 'The only way to do great work is to love what you do.',
 *   cite: 'Steve Jobs'
 * });
 * document.body.appendChild(quote);
 * ```
 */
export function createBlockquote(props: BlockquoteProps): HTMLQuoteElement {
  const {
    children,
    cite,
    indicator = '│',
    className = '',
    id,
  } = props;

  // Create blockquote element
  const blockquote = document.createElement('blockquote');

  // Build class list
  const classes = ['dos-blockquote'];

  if (className) {
    classes.push(className);
  }

  blockquote.className = classes.join(' ');

  if (id) {
    blockquote.id = id;
  }

  // Create indicator
  const indicatorElement = document.createElement('div');
  indicatorElement.className = 'dos-blockquote___indicator';
  indicatorElement.textContent = indicator;
  indicatorElement.setAttribute('aria-hidden', 'true');
  blockquote.appendChild(indicatorElement);

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'dos-blockquote___content-container';

  // Create content
  const content = document.createElement('div');
  content.className = 'dos-blockquote___content';

  if (typeof children === 'string') {
    content.textContent = children;
  } else {
    content.appendChild(children);
  }

  contentContainer.appendChild(content);

  // Add citation if provided
  if (cite) {
    const citation = document.createElement('cite');
    citation.className = 'dos-blockquote___cite';
    citation.textContent = `— ${cite}`;
    contentContainer.appendChild(citation);
  }

  blockquote.appendChild(contentContainer);

  return blockquote;
}
