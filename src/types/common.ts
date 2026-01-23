/**
 * Common type definitions used across DOSage components
 */

/**
 * Spacing value that can be a preset name, number (pixels), or CSS string
 */
export type SpacingValue = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;

/**
 * Base props shared by all components
 */
export interface BaseComponentProps {
  /** Additional CSS class names */
  className?: string;
  /** Element ID */
  id?: string;
}

/**
 * Border configuration options
 */
export interface BorderConfig {
  /** Border width in pixels */
  width?: number;
  /** Border style */
  style?: 'solid' | 'dashed' | 'dotted';
  /** Border color (CSS color value) */
  color?: string;
  /** Which sides to apply border to */
  sides?: 'all' | 'top' | 'bottom' | 'left' | 'right' | ('top' | 'bottom' | 'left' | 'right')[];
}

/**
 * Box-drawing border style variants
 */
export type BoxBorderStyle = 'single' | 'double' | 'thick' | 'none';

/**
 * Common size variants
 */
export type SizeVariant = 'small' | 'medium' | 'large';

/**
 * Text alignment options
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Display mode options
 */
export type DisplayMode = 'block' | 'inline-block' | 'flex' | 'inline-flex';

/**
 * Orientation options
 */
export type Orientation = 'horizontal' | 'vertical';
