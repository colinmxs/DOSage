/**
 * @file SkeletonLoader type definitions
 * @description TypeScript interfaces for the DOS-style skeleton loader component
 */

/**
 * Skeleton shape variants
 */
export type SkeletonVariant = 'text' | 'rectangle' | 'circle';

/**
 * Skeleton loader component props
 */
export interface SkeletonLoaderProps {
  /**
   * Shape variant
   * - 'text': Single or multiple text lines
   * - 'rectangle': Block placeholder (images, cards, etc.)
   * - 'circle': Circular placeholder (avatars, icons)
   * @default 'text'
   */
  variant?: SkeletonVariant;

  /**
   * Width of the skeleton element
   * Number values are treated as characters (monospace width)
   * String values are used as CSS values
   * @default '100%' for text/rectangle, '3em' for circle
   */
  width?: string | number;

  /**
   * Height of the skeleton element
   * Number values are treated as lines
   * String values are used as CSS values
   * @default '1em' for text, '100px' for rectangle, same as width for circle
   */
  height?: string | number;

  /**
   * Number of text lines (only for 'text' variant)
   * Creates multiple skeleton lines with varying widths
   * @default 1
   */
  lines?: number;

  /**
   * Enable shimmer/pulse animation
   * @default true
   */
  animate?: boolean;

  /**
   * Accessible label for screen readers
   * @default 'Loading content'
   */
  label?: string;

  /**
   * Optional unique identifier
   */
  id?: string;

  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * Skeleton loader instance methods
 */
export interface SkeletonLoaderInstance {
  /**
   * The skeleton DOM element
   */
  readonly element: HTMLElement;

  /**
   * Show the skeleton (make visible)
   */
  show(): void;

  /**
   * Hide the skeleton
   */
  hide(): void;

  /**
   * Check if skeleton is visible
   */
  isVisible(): boolean;

  /**
   * Clean up resources
   */
  destroy(): void;
}
