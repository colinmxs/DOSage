/**
 * Text Component Types
 *
 * Type definitions for the DOS-style Text component.
 */

import type { TextAlign } from '../../types/common';

/**
 * Text size options
 */
export type TextSize = 'sm' | 'base' | 'lg';

/**
 * Text weight options (simulated for DOS)
 */
export type TextWeight = 'normal' | 'bold';

// Re-export TextAlign for convenience
export type { TextAlign };

/**
 * HTML element options for rendering
 */
export type TextElement = 'p' | 'span' | 'div';

/**
 * Props for the Text component
 */
export interface TextProps {
  /**
   * Text content
   */
  children: string | HTMLElement;

  /**
   * Font size
   * @default 'base'
   */
  size?: TextSize;

  /**
   * Font weight (simulated with brighter color for DOS)
   * @default 'normal'
   */
  weight?: TextWeight;

  /**
   * Text color override
   */
  color?: string;

  /**
   * Text alignment
   * @default 'left'
   */
  align?: TextAlign;

  /**
   * Truncate text with ellipsis
   * @default false
   */
  truncate?: boolean;

  /**
   * HTML element to render
   * @default 'p'
   */
  as?: TextElement;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Element ID
   */
  id?: string;
}
