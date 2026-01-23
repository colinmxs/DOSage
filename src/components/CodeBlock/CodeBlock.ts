/**
 * CodeBlock Component
 *
 * DOS-style code block component with line numbers, highlighting, and copy functionality.
 */

import type { CodeBlockProps } from './CodeBlock.types';
import './CodeBlock.css';

/**
 * Creates a DOS-style code block element.
 *
 * @param props - CodeBlock configuration options
 * @returns The code block DOM element
 *
 * @example
 * ```typescript
 * const codeBlock = createCodeBlock({
 *   code: 'function hello() {\n  console.log("Hello!");\n}',
 *   language: 'javascript',
 *   lineNumbers: true,
 *   copyButton: true
 * });
 * document.body.appendChild(codeBlock);
 * ```
 */
export function createCodeBlock(props: CodeBlockProps): HTMLElement {
  const {
    code,
    language,
    lineNumbers = false,
    startLine = 1,
    highlightLines = [],
    maxHeight,
    copyButton = false,
    className = '',
    id,
  } = props;

  // Create container
  const container = document.createElement('div');
  const classes = ['dos-codeblock'];

  if (className) {
    classes.push(className);
  }

  container.className = classes.join(' ');

  if (id) {
    container.id = id;
  }

  // Set ARIA attributes
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Code block');

  // Create pre element
  const pre = document.createElement('pre');
  pre.className = 'dos-codeblock___pre';

  if (maxHeight) {
    const heightValue =
      typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
    pre.style.maxHeight = heightValue;
    pre.style.overflowY = 'auto';
  }

  // Split code into lines
  const lines = code.split('\n');

  // Create code element
  const codeElement = document.createElement('code');
  codeElement.className = 'dos-codeblock___code';

  if (language) {
    codeElement.setAttribute('data-language', language);
  }

  // Render lines
  lines.forEach((line, index) => {
    const lineNumber = startLine + index;
    const isHighlighted = highlightLines.includes(lineNumber);

    const lineElement = document.createElement('div');
    lineElement.className = 'dos-codeblock___line';

    if (isHighlighted) {
      lineElement.classList.add('dos-codeblock___line--highlighted');
    }

    // Add line number if enabled
    if (lineNumbers) {
      const lineNumElement = document.createElement('span');
      lineNumElement.className = 'dos-codeblock___line-number';
      lineNumElement.textContent = lineNumber.toString().padStart(3, ' ');
      lineNumElement.setAttribute('aria-hidden', 'true');
      lineElement.appendChild(lineNumElement);
    }

    // Add line content
    const lineContent = document.createElement('span');
    lineContent.className = 'dos-codeblock___line-content';
    lineContent.textContent = line || ' '; // Use space for empty lines
    lineElement.appendChild(lineContent);

    codeElement.appendChild(lineElement);
  });

  pre.appendChild(codeElement);
  container.appendChild(pre);

  // Add copy button if enabled
  if (copyButton) {
    const copyBtn = createCopyButton(code);
    container.appendChild(copyBtn);
  }

  return container;
}

/**
 * Creates a copy button for the code block
 *
 * @param code - The code to copy
 * @returns The copy button element
 */
function createCopyButton(code: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'dos-codeblock___copy-btn';
  button.textContent = 'Copy';
  button.setAttribute('aria-label', 'Copy code to clipboard');

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      button.textContent = 'Failed';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    }
  });

  return button;
}
