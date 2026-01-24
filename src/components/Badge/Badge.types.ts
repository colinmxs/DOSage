/**
 * Badge Component Types
 *
 * DOS-style badge/tag for status indicators and labels.
 */

/**
 * Badge variant types for styling
 */
export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/**
 * Badge size options
 */
export type BadgeSize = 'small' | 'medium';

/**
 * Badge component props
 */
export interface BadgeProps {
  /**
   * Badge text content
   */
  label: string;

  /**
   * Color variant
   * @default 'default'
   */
  variant?: BadgeVariant;

  /**
   * Badge size
   * @default 'medium'
   */
  size?: BadgeSize;

  /**
   * Show remove button (×)
   * @default false
   */
  removable?: boolean;

  /**
   * Leading icon (character or emoji)
   */
  icon?: string;

  /**
   * Called when remove button is clicked
   */
  onRemove?: () => void;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Custom HTML id attribute
   */
  id?: string;

  /**
   * ARIA label for the badge
   */
  'aria-label'?: string;
}

/**
 * Badge instance methods and properties
 */
export interface BadgeInstance {
  /**
   * The badge DOM element
   */
  element: HTMLSpanElement;

  /**
   * Update the badge label
   */
  setLabel: (label: string) => void;

  /**
   * Get the current label
   */
  getLabel: () => string;

  /**
   * Update the variant
   */
  setVariant: (variant: BadgeVariant) => void;

  /**
   * Get the current variant
   */
  getVariant: () => BadgeVariant;

  /**
   * Update the icon
   */
  setIcon: (icon: string | undefined) => void;

  /**
   * Show or hide the remove button
   */
  setRemovable: (removable: boolean) => void;

  /**
   * Remove the badge from the DOM
   */
  destroy: () => void;
}
