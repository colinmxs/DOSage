/**
 * @file EmptyState component types
 * @description TypeScript interfaces for the DOS-style EmptyState component
 */

/**
 * EmptyState size variants
 */
export type EmptyStateSize = 'small' | 'medium' | 'large';

/**
 * Preset icon types for empty states
 */
export type EmptyStateIconPreset =
  | 'folder'
  | 'search'
  | 'error'
  | 'data'
  | 'file'
  | 'inbox'
  | 'network';

/**
 * EmptyState component properties
 */
export interface EmptyStateProps {
  /**
   * Main message title
   */
  title: string;

  /**
   * Secondary description text
   */
  description?: string;

  /**
   * Icon to display
   * Can be a preset name, custom ASCII art string, or HTML element
   */
  icon?: EmptyStateIconPreset | string | HTMLElement;

  /**
   * Action element (typically a button)
   * Rendered below the description
   */
  action?: HTMLElement;

  /**
   * Component size
   * @default 'medium'
   */
  size?: EmptyStateSize;

  /**
   * Whether the empty state was dynamically shown
   * Adds role="status" for screen reader announcement
   * @default false
   */
  dynamic?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * HTML id attribute
   */
  id?: string;

  /**
   * Custom ARIA label
   */
  'aria-label'?: string;
}

/**
 * EmptyState instance returned by createEmptyState
 */
export interface EmptyStateInstance {
  /**
   * The empty state DOM element
   */
  element: HTMLElement;

  /**
   * Set the title text
   */
  setTitle: (title: string) => void;

  /**
   * Get the current title
   */
  getTitle: () => string;

  /**
   * Set the description text
   */
  setDescription: (description: string | undefined) => void;

  /**
   * Get the current description
   */
  getDescription: () => string | undefined;

  /**
   * Set the icon
   */
  setIcon: (icon: EmptyStateIconPreset | string | HTMLElement | undefined) => void;

  /**
   * Set the action element
   */
  setAction: (action: HTMLElement | undefined) => void;

  /**
   * Get the action element
   */
  getAction: () => HTMLElement | null;

  /**
   * Set the size
   */
  setSize: (size: EmptyStateSize) => void;

  /**
   * Get the current size
   */
  getSize: () => EmptyStateSize;

  /**
   * Focus the action button (if present)
   */
  focusAction: () => void;

  /**
   * Clean up event listeners and resources
   */
  destroy: () => void;
}
