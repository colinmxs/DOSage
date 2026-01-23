/**
 * Blockquote Component Types
 *
 * Type definitions for the DOS-style Blockquote component.
 */

/**
 * Props for the Blockquote component
 */
export interface BlockquoteProps {
  /**
   * Quote content
   */
  children: string | HTMLElement;

  /**
   * Citation/attribution
   */
  cite?: string;

  /**
   * Character for left indicator
   * @default '│'
   */
  indicator?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Element ID
   */
  id?: string;
}
