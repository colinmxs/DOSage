/**
 * FocusTrap Component Types
 *
 * Type definitions for the FocusTrap utility component.
 * FocusTrap contains focus within an element, essential for modals and dialogs.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Configuration options for FocusTrap behavior
 */
export interface FocusTrapOptions {
  /**
   * Element to receive initial focus when trap is activated.
   * Can be an HTMLElement, a CSS selector, or 'first' for first focusable.
   * @default 'first'
   */
  initialFocus?: HTMLElement | string | 'first' | 'container';

  /**
   * Element to return focus to when trap is deactivated.
   * If not specified, focus returns to the element that had focus before activation.
   * @default undefined (auto-detected)
   */
  returnFocus?: HTMLElement | string | boolean;

  /**
   * Whether pressing Escape deactivates the trap.
   * @default true
   */
  escapeDeactivates?: boolean;

  /**
   * Whether clicking outside the trap deactivates it.
   * @default false
   */
  clickOutsideDeactivates?: boolean;

  /**
   * Whether to allow focus to leave the trap using Tab on the last element
   * (wraps to first) or Shift+Tab on the first (wraps to last).
   * When false, focus stops at boundaries without wrapping.
   * @default true
   */
  wrapFocus?: boolean;

  /**
   * Custom function to determine if an element should be considered focusable.
   */
  isFocusable?: (element: HTMLElement) => boolean;

  /**
   * Callback fired when the trap is activated.
   */
  onActivate?: () => void;

  /**
   * Callback fired when the trap is deactivated.
   */
  onDeactivate?: () => void;

  /**
   * Callback fired when Escape is pressed (if escapeDeactivates is true).
   * Return false to prevent deactivation.
   */
  onEscape?: () => boolean | undefined;

  /**
   * Whether to prevent scrolling to the focused element.
   * @default false
   */
  preventScroll?: boolean;
}

/**
 * Props for the FocusTrap component
 */
export interface FocusTrapProps extends BaseComponentProps, FocusTrapOptions {
  /**
   * The container element to trap focus within.
   * Can be an HTMLElement or a CSS selector string.
   */
  container: HTMLElement | string;

  /**
   * Whether the trap starts active immediately.
   * @default true
   */
  active?: boolean;
}

/**
 * FocusTrap instance with control methods
 */
export interface FocusTrapInstance {
  /**
   * The container element being trapped.
   */
  container: HTMLElement;

  /**
   * Whether the trap is currently active.
   */
  isActive: boolean;

  /**
   * Whether the trap is currently paused.
   */
  isPaused: boolean;

  /**
   * Activates the focus trap.
   */
  activate(): void;

  /**
   * Deactivates the focus trap.
   */
  deactivate(): void;

  /**
   * Pauses the focus trap without fully deactivating.
   * Useful for nested traps or temporary focus escape.
   */
  pause(): void;

  /**
   * Resumes a paused focus trap.
   */
  resume(): void;

  /**
   * Updates the options for the focus trap.
   */
  updateOptions(options: Partial<FocusTrapOptions>): void;

  /**
   * Gets all focusable elements within the container.
   */
  getFocusableElements(): HTMLElement[];

  /**
   * Destroys the focus trap and cleans up event listeners.
   */
  destroy(): void;
}
