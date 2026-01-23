/**
 * Test Render Utilities
 *
 * Helper functions for rendering and cleaning up components in tests.
 */

/** Container element for rendered components */
let container: HTMLElement | null = null;

/**
 * Get or create the test container
 */
function getContainer(): HTMLElement {
  if (!container) {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Render an element into the test container
 *
 * @param element - Element to render
 * @returns The rendered element
 */
export function render<T extends HTMLElement>(element: T): T {
  const container = getContainer();
  container.appendChild(element);
  return element;
}

/**
 * Clean up the test container
 */
export function cleanup(): void {
  if (container) {
    container.innerHTML = '';
  }
}

/**
 * Get all elements in the test container matching a selector
 *
 * @param selector - CSS selector
 * @returns Array of matching elements
 */
export function queryAll<T extends HTMLElement>(selector: string): T[] {
  const container = getContainer();
  return Array.from(container.querySelectorAll<T>(selector));
}

/**
 * Get the first element in the test container matching a selector
 *
 * @param selector - CSS selector
 * @returns The first matching element or null
 */
export function query<T extends HTMLElement>(selector: string): T | null {
  const container = getContainer();
  return container.querySelector<T>(selector);
}

/**
 * Simulate a click event on an element
 *
 * @param element - Element to click
 */
export function click(element: HTMLElement): void {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

/**
 * Simulate a keyboard event on an element
 *
 * @param element - Element to trigger event on
 * @param key - Key to simulate
 * @param type - Event type (keydown, keyup, keypress)
 */
export function keyboard(
  element: HTMLElement,
  key: string,
  type: 'keydown' | 'keyup' | 'keypress' = 'keydown'
): void {
  element.dispatchEvent(
    new KeyboardEvent(type, {
      key,
      bubbles: true,
      cancelable: true,
    })
  );
}

/**
 * Wait for the next animation frame
 */
export function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * Wait for a specified amount of time
 *
 * @param ms - Milliseconds to wait
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
