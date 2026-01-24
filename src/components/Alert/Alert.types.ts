/**
 * Alert Component Types
 *
 * Types for the DOS-style alert/notification banner component.
 */

/**
 * Alert type variants
 */
export type AlertType = 'info' | 'success' | 'warning' | 'error';

/**
 * Props for creating an Alert component
 */
export interface AlertProps {
  /**
   * Alert message content (string or HTML element)
   */
  message: string | HTMLElement;

  /**
   * Type of alert determining icon and colors
   * @default 'info'
   */
  type?: AlertType;

  /**
   * Optional title displayed before the message
   */
  title?: string;

  /**
   * Whether to show the type icon
   * If a string is provided, it will be used as a custom icon
   * @default true
   */
  icon?: boolean | string;

  /**
   * Whether the alert can be dismissed via close button
   * @default false
   */
  dismissible?: boolean;

  /**
   * Callback when the alert is dismissed
   */
  onDismiss?: () => void;

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
 * Instance methods for Alert
 */
export interface AlertInstance {
  /**
   * The alert DOM element
   */
  element: HTMLElement;

  /**
   * Dismiss the alert programmatically
   */
  dismiss: () => void;

  /**
   * Update the alert message
   */
  setMessage: (message: string | HTMLElement) => void;

  /**
   * Update the alert type
   */
  setType: (type: AlertType) => void;

  /**
   * Remove the alert from DOM and clean up
   */
  destroy: () => void;
}

/**
 * Default icons for each alert type
 */
export const ALERT_ICONS: Record<AlertType, string> = {
  info: 'i',
  success: '✓',
  warning: '!',
  error: '✗',
};
