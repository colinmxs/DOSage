/**
 * @file VisuallyHidden.ts
 * @description VisuallyHidden component implementation
 * Creates an element that is hidden visually but remains accessible to screen readers
 */

import type { VisuallyHiddenProps, VisuallyHiddenInstance } from './VisuallyHidden.types';
import './VisuallyHidden.css';

/**
 * Creates a visually hidden element
 * Content is hidden from sighted users but accessible to screen readers
 * 
 * @param props - VisuallyHidden configuration options
 * @returns VisuallyHiddenInstance with element and control methods
 * 
 * @example
 * // Screen reader only text
 * const hidden = createVisuallyHidden({
 *   content: 'Opens in a new window'
 * });
 * linkElement.appendChild(hidden.element);
 * 
 * @example
 * // Skip link that becomes visible on focus
 * const skipLink = createVisuallyHidden({
 *   as: 'div',
 *   focusable: true,
 *   content: createSkipLinkContent()
 * });
 * document.body.prepend(skipLink.element);
 */
export function createVisuallyHidden(props: VisuallyHiddenProps = {}): VisuallyHiddenInstance {
  const {
    content,
    as = 'span',
    id,
    className,
    focusable = false,
    isFocusable = false,
    htmlFor,
  } = props;

  // State
  let isCurrentlyHidden = true;

  // Create the element
  const element = document.createElement(as);

  // Build class name
  const classes = ['dos-visually-hidden'];
  if (focusable) {
    classes.push('dos-visually-hidden--focusable');
  }
  if (className) {
    classes.push(className);
  }
  element.className = classes.join(' ');

  // Set ID if provided
  if (id) {
    element.id = id;
  }

  // Set htmlFor for label elements
  if (as === 'label' && htmlFor) {
    (element as HTMLLabelElement).htmlFor = htmlFor;
  }

  // Handle tabindex for focusable content
  if (focusable || isFocusable) {
    // Allow focus on the element or its children
    if (!content || typeof content === 'string') {
      element.setAttribute('tabindex', '0');
    }
  }

  // Set initial content
  if (content) {
    if (typeof content === 'string') {
      element.textContent = content;
    } else {
      element.appendChild(content);
    }
  }

  /**
   * Update the content
   */
  function setContent(newContent: string | HTMLElement): void {
    element.innerHTML = '';
    if (typeof newContent === 'string') {
      element.textContent = newContent;
    } else {
      element.appendChild(newContent);
    }
  }

  /**
   * Show the element visually
   */
  function show(): void {
    element.classList.add('dos-visually-hidden--visible');
    isCurrentlyHidden = false;
  }

  /**
   * Hide the element visually
   */
  function hide(): void {
    element.classList.remove('dos-visually-hidden--visible');
    isCurrentlyHidden = true;
  }

  /**
   * Check if currently hidden
   */
  function isHidden(): boolean {
    return isCurrentlyHidden && !element.classList.contains('dos-visually-hidden--visible');
  }

  /**
   * Clean up
   */
  function destroy(): void {
    element.remove();
  }

  return {
    get element() {
      return element;
    },
    setContent,
    show,
    hide,
    isHidden,
    destroy,
  };
}
