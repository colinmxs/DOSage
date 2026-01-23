/**
 * Heading Component Types
 *
 * Type definitions for the DOS-style Heading component.
 */

/**
 * Heading level (h1-h6)
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Text alignment options
 */
export type HeadingAlign = 'left' | 'center' | 'right';

/**
 * Props for the Heading component
 */
export interface HeadingProps {
  /**
   * Heading level (h1-h6)
   */
  level: HeadingLevel;

  /**
   * Heading content (text or HTML element)
   */
  children: string | HTMLElement;

  /**
   * Text alignment
   * @default 'left'
   */
  align?: HeadingAlign;

  /**
   * Transform text to uppercase
   * @default false
   */
  uppercase?: boolean;

  /**
   * Add DOS-style decoration (underline with box-drawing characters)
   * @default false
   */
  decorated?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Element ID
   */
  id?: string;
}
