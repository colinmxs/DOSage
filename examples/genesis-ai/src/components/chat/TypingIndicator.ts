/**
 * Genesis AI - Typing Indicator Component
 * Shows when AI is "thinking"
 */

import { createBox, createLoadingSpinner, createText } from 'dosage';

export interface TypingIndicatorInstance {
  element: HTMLElement;
  show: () => void;
  hide: () => void;
  destroy: () => void;
}

export function createTypingIndicator(): TypingIndicatorInstance {
  const container = createBox({
    display: 'flex',
    padding: 'sm',
  });

  container.style.cssText = `
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  `;

  const spinner = createLoadingSpinner({
    size: 'small',
    style: 'ascii',
    label: 'AI is thinking',
  });

  const text = createText({
    children: 'Genesis AI is thinking...',
    size: 'sm',
  });
  text.style.fontStyle = 'italic';

  container.appendChild(spinner.element);
  container.appendChild(text);

  return {
    element: container,

    show() {
      container.style.opacity = '1';
      spinner.start();
    },

    hide() {
      container.style.opacity = '0';
      spinner.stop();
    },

    destroy() {
      spinner.destroy();
    },
  };
}
