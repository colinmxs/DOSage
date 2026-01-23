/**
 * CodeBlock Component Types
 *
 * Type definitions for the DOS-style CodeBlock component.
 */

/**
 * Props for the CodeBlock component
 */
export interface CodeBlockProps {
  /**
   * Code content
   */
  code: string;

  /**
   * Language hint (for future syntax highlighting)
   */
  language?: string;

  /**
   * Show line numbers
   * @default false
   */
  lineNumbers?: boolean;

  /**
   * Starting line number
   * @default 1
   */
  startLine?: number;

  /**
   * Lines to highlight (1-based)
   */
  highlightLines?: number[];

  /**
   * Max height with scroll
   */
  maxHeight?: string | number;

  /**
   * Show copy to clipboard button
   * @default false
   */
  copyButton?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Element ID
   */
  id?: string;
}
