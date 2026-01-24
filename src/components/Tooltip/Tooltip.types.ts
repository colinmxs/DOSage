/**
 * Tooltip Component Types
 *
 * Type definitions for the DOS-style tooltip component.
 */

/**
 * Tooltip position relative to the target element
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * How the tooltip is triggered to show
 */
export type TooltipTrigger = 'hover' | 'focus' | 'both';

/**
 * Props for creating a tooltip
 */
export interface TooltipProps {
  /**
   * Text content to display in the tooltip
   */
  content: string;

  /**
   * Target element to attach the tooltip to
   */
  target: HTMLElement;

  /**
   * Preferred position relative to target
   * @default 'top'
   */
  position?: TooltipPosition;

  /**
   * How the tooltip is triggered
   * @default 'both'
   */
  trigger?: TooltipTrigger;

  /**
   * Delay before showing tooltip (ms)
   * @default 200
   */
  delay?: number;

  /**
   * Whether to show an arrow pointing to target
   * @default true
   */
  arrow?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Custom ID for the tooltip element
   */
  id?: string;

  /**
   * Offset from target element (px)
   * @default 8
   */
  offset?: number;
}

/**
 * Instance returned by createTooltip
 */
export interface TooltipInstance {
  /**
   * The tooltip DOM element
   */
  element: HTMLElement;

  /**
   * Show the tooltip
   */
  show: () => void;

  /**
   * Hide the tooltip
   */
  hide: () => void;

  /**
   * Update the tooltip content
   */
  setContent: (content: string) => void;

  /**
   * Update the tooltip position
   */
  setPosition: (position: TooltipPosition) => void;

  /**
   * Check if tooltip is currently visible
   */
  isVisible: () => boolean;

  /**
   * Remove tooltip and clean up event listeners
   */
  destroy: () => void;
}
