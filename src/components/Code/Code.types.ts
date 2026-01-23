/**
 * Code Component Types
 *
 * Type definitions for the DOS-style inline Code component.
 */

/**
 * Props for the Code component
 */
export interface CodeProps {
  /**
   * Code content
   */
  children: string;

  /**
   * Apply highlight background
   * @default false
   */
  highlighted?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Element ID
   */
  id?: string;
}
