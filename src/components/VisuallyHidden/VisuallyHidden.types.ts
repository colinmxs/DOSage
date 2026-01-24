/**
 * @file VisuallyHidden.types.ts
 * @description Type definitions for the VisuallyHidden component
 */

/**
 * Props for creating a visually hidden element
 */
export interface VisuallyHiddenProps {
  /**
   * Content to visually hide (still accessible to screen readers)
   */
  content?: string | HTMLElement;

  /**
   * HTML tag to use for the element
   * @default 'span'
   */
  as?: 'span' | 'div' | 'p' | 'label';

  /**
   * Custom ID for the element
   */
  id?: string;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Whether the content should become visible when focused
   * Useful for skip links and similar patterns
   * @default false
   */
  focusable?: boolean;

  /**
   * If true, the hidden content can receive focus but remains visually hidden
   * @default false
   */
  isFocusable?: boolean;

  /**
   * For use as an accessible label target
   * Sets the for attribute when as='label'
   */
  htmlFor?: string;
}

/**
 * Instance methods for VisuallyHidden
 */
export interface VisuallyHiddenInstance {
  /**
   * The DOM element
   */
  readonly element: HTMLElement;

  /**
   * Update the content
   */
  setContent(content: string | HTMLElement): void;

  /**
   * Show the element visually (removes visually hidden styles)
   */
  show(): void;

  /**
   * Hide the element visually (applies visually hidden styles)
   */
  hide(): void;

  /**
   * Check if element is currently visually hidden
   */
  isHidden(): boolean;

  /**
   * Clean up the component
   */
  destroy(): void;
}
