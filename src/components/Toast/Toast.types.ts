/**
 * Toast Component Types
 *
 * Types for the DOS-style toast notification system.
 */

/**
 * Toast type variants
 */
export type ToastType = 'info' | 'success' | 'warning' | 'error';

/**
 * Toast position options
 */
export type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center';

/**
 * Props for creating a Toast notification
 */
export interface ToastProps {
  /**
   * Toast message content
   */
  message: string;

  /**
   * Type of toast determining icon and colors
   * @default 'info'
   */
  type?: ToastType;

  /**
   * Auto-dismiss duration in milliseconds
   * Set to 0 or null to disable auto-dismiss
   * @default 5000
   */
  duration?: number | null;

  /**
   * Position on screen (when using toast() function)
   * @default 'top-right'
   */
  position?: ToastPosition;

  /**
   * Whether the toast can be manually dismissed
   * @default true
   */
  dismissible?: boolean;

  /**
   * Callback when the toast is dismissed
   */
  onDismiss?: () => void;

  /**
   * Whether to pause auto-dismiss on hover
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Custom element ID
   */
  id?: string;
}

/**
 * Props for the ToastContainer
 */
export interface ToastContainerProps {
  /**
   * Default position for toasts
   * @default 'top-right'
   */
  position?: ToastPosition;

  /**
   * Maximum number of visible toasts
   * Older toasts will be removed when limit is reached
   * @default 5
   */
  maxToasts?: number;

  /**
   * Additional CSS class name for the container
   */
  className?: string;

  /**
   * Custom element ID for the container
   */
  id?: string;
}

/**
 * Instance methods for a single Toast
 */
export interface ToastInstance {
  /**
   * The toast DOM element
   */
  element: HTMLElement;

  /**
   * Unique ID for this toast
   */
  id: string;

  /**
   * Dismiss the toast
   */
  dismiss: () => void;

  /**
   * Pause the auto-dismiss timer
   */
  pause: () => void;

  /**
   * Resume the auto-dismiss timer
   */
  resume: () => void;

  /**
   * Remove the toast from DOM and clean up
   */
  destroy: () => void;
}

/**
 * Instance methods for ToastContainer
 */
export interface ToastContainerInstance {
  /**
   * The container DOM element
   */
  element: HTMLElement;

  /**
   * Add a new toast to the container
   */
  add: (props: Omit<ToastProps, 'position'>) => ToastInstance;

  /**
   * Remove a specific toast by ID
   */
  remove: (id: string) => void;

  /**
   * Remove all toasts
   */
  clear: () => void;

  /**
   * Get all active toasts
   */
  getToasts: () => ToastInstance[];

  /**
   * Clean up the container
   */
  destroy: () => void;
}

/**
 * Default icons for each toast type
 */
export const TOAST_ICONS: Record<ToastType, string> = {
  info: 'i',
  success: '✓',
  warning: '!',
  error: '✗',
};
