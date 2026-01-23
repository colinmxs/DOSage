/**
 * Code Component
 *
 * DOS-style inline code component for displaying code snippets within text.
 */

import type { CodeProps } from './Code.types';
import './Code.css';

/**
 * Creates a DOS-style inline code element.
 *
 * @param props - Code configuration options
 * @returns The code DOM element
 *
 * @example
 * ```typescript
 * const code = createCode({
 *   children: 'const x = 42;',
 *   highlighted: false
 * });
 * document.body.appendChild(code);
 * ```
 */
export function createCode(props: CodeProps): HTMLElement {
  const { children, highlighted = false, className = '', id } = props;

  // Create code element
  const code = document.createElement('code');

  // Build class list
  const classes = ['dos-code'];

  if (highlighted) {
    classes.push('dos-code--highlighted');
  }

  if (className) {
    classes.push(className);
  }

  code.className = classes.join(' ');

  // Set content - preserve whitespace
  code.textContent = children;

  // Set ID if provided
  if (id) {
    code.id = id;
  }

  return code;
}
