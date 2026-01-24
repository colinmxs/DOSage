/**
 * ScrollArea Component Types
 *
 * Type definitions for the DOS-style custom scrollbar component.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Scroll orientation options
 */
export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

/**
 * ScrollArea props
 */
export interface ScrollAreaProps extends BaseComponentProps {
  /**
   * Which scrollbars to show
   * @default 'vertical'
   */
  orientation?: ScrollAreaOrientation;

  /**
   * Whether to auto-hide scrollbars when not scrolling
   * @default false
   */
  autoHide?: boolean;

  /**
   * Delay before hiding scrollbars (ms)
   * @default 1000
   */
  autoHideDelay?: number;

  /**
   * Amount to scroll on arrow button click (px)
   * @default 40
   */
  scrollAmount?: number;

  /**
   * Amount to scroll on track click (px or 'page')
   * @default 'page'
   */
  trackScrollAmount?: number | 'page';

  /**
   * Whether to enable smooth scrolling
   * @default false
   */
  smoothScroll?: boolean;

  /**
   * Whether scrollbars should always be visible
   * @default false
   */
  alwaysShowScrollbars?: boolean;

  /**
   * Width/height of the scrollbar track (px)
   * @default 16
   */
  scrollbarSize?: number;

  /**
   * Minimum size of the scroll thumb (px)
   * @default 20
   */
  minThumbSize?: number;

  /**
   * Content to place inside the scroll area
   */
  content?: HTMLElement | string;

  /**
   * Callback fired when scroll position changes
   */
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
}

/**
 * Scroll position state
 */
export interface ScrollPosition {
  /** Vertical scroll offset */
  top: number;
  /** Horizontal scroll offset */
  left: number;
  /** Maximum vertical scroll */
  maxTop: number;
  /** Maximum horizontal scroll */
  maxLeft: number;
}

/**
 * ScrollArea instance
 */
export interface ScrollAreaInstance {
  /**
   * The root scroll area element
   */
  element: HTMLElement;

  /**
   * The scrollable content container
   */
  viewport: HTMLElement;

  /**
   * Current scroll position
   */
  getScrollPosition(): ScrollPosition;

  /**
   * Scroll to a specific position
   */
  scrollTo(options: { top?: number; left?: number; behavior?: 'smooth' | 'instant' }): void;

  /**
   * Scroll by a relative amount
   */
  scrollBy(options: { top?: number; left?: number; behavior?: 'smooth' | 'instant' }): void;

  /**
   * Scroll to top
   */
  scrollToTop(smooth?: boolean): void;

  /**
   * Scroll to bottom
   */
  scrollToBottom(smooth?: boolean): void;

  /**
   * Scroll to make an element visible
   */
  scrollIntoView(element: HTMLElement, smooth?: boolean): void;

  /**
   * Updates scrollbar dimensions (call after content changes)
   */
  refresh(): void;

  /**
   * Sets new content
   */
  setContent(content: HTMLElement | string): void;

  /**
   * Shows scrollbars (when autoHide is enabled)
   */
  showScrollbars(): void;

  /**
   * Hides scrollbars (when autoHide is enabled)
   */
  hideScrollbars(): void;

  /**
   * Destroys the component and cleans up
   */
  destroy(): void;
}
