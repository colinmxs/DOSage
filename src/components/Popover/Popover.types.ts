/**
 * Popover Component Types
 *
 * Type definitions for the DOS-style popover component.
 */

/**
 * Popover position relative to the target element
 */
export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * How the popover is triggered to open
 */
export type PopoverTrigger = 'click' | 'hover' | 'focus';

/**
 * Props for creating a popover
 */
export interface PopoverProps {
  /**
   * Content to display in the popover (can be HTML element)
   */
  content: HTMLElement | string;

  /**
   * Target element to attach the popover to
   */
  target: HTMLElement;

  /**
   * Optional title/header for the popover
   */
  title?: string;

  /**
   * Preferred position relative to target
   * @default 'bottom'
   */
  position?: PopoverPosition;

  /**
   * How the popover is triggered
   * @default 'click'
   */
  trigger?: PopoverTrigger;

  /**
   * Whether to show an arrow pointing to target
   * @default true
   */
  arrow?: boolean;

  /**
   * Close popover when clicking outside
   * @default true
   */
  closeOnClickOutside?: boolean;

  /**
   * Close popover when pressing Escape
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Custom ID for the popover element
   */
  id?: string;

  /**
   * Offset from target element (px)
   * @default 8
   */
  offset?: number;

  /**
   * Background color for the popover
   * @default 'var(--dos-color-bg-secondary)'
   */
  backgroundColor?: string;

  /**
   * Callback when popover opens
   */
  onOpen?: () => void;

  /**
   * Callback when popover closes
   */
  onClose?: () => void;
}

/**
 * Instance returned by createPopover
 */
export interface PopoverInstance {
  /**
   * The popover DOM element
   */
  element: HTMLElement;

  /**
   * Open the popover
   */
  open: () => void;

  /**
   * Close the popover
   */
  close: () => void;

  /**
   * Toggle the popover
   */
  toggle: () => void;

  /**
   * Update the popover content
   */
  setContent: (content: HTMLElement | string) => void;

  /**
   * Update the popover title
   */
  setTitle: (title: string | null) => void;

  /**
   * Update the popover position
   */
  setPosition: (position: PopoverPosition) => void;

  /**
   * Check if popover is currently open
   */
  isOpen: () => boolean;

  /**
   * Remove popover and clean up event listeners
   */
  destroy: () => void;
}
