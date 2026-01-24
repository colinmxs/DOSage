/**
 * @fileoverview Type definitions for the Pagination component.
 * @description DOS-style page navigation with ellipsis support.
 */

import type { BaseComponentProps } from '../../types';

/**
 * Configuration options for the Pagination component.
 */
export interface PaginationProps extends BaseComponentProps {
  /**
   * Current active page (1-indexed).
   */
  currentPage: number;

  /**
   * Total number of pages.
   */
  totalPages: number;

  /**
   * Number of pages to show on each side of the current page.
   * @default 1
   */
  siblingCount?: number;

  /**
   * Number of pages to show at the start and end.
   * @default 1
   */
  boundaryCount?: number;

  /**
   * Whether to show first/last page buttons ([<<] [>>]).
   * @default true
   */
  showFirstLast?: boolean;

  /**
   * Whether to show previous/next buttons ([<] [>]).
   * @default true
   */
  showPrevNext?: boolean;

  /**
   * Callback when page changes.
   */
  onChange?: (page: number) => void;

  /**
   * Whether the pagination is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Labels for navigation buttons.
   */
  labels?: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
    page?: (page: number) => string;
  };
}

/**
 * Extended HTMLElement with Pagination-specific properties.
 */
export interface PaginationElement extends HTMLElement {
  /**
   * Sets the current page.
   */
  setPage: (page: number) => void;

  /**
   * Gets the current page.
   */
  getPage: () => number;

  /**
   * Sets the total number of pages.
   */
  setTotalPages: (totalPages: number) => void;

  /**
   * Gets the total number of pages.
   */
  getTotalPages: () => number;

  /**
   * Go to the next page.
   */
  nextPage: () => void;

  /**
   * Go to the previous page.
   */
  previousPage: () => void;

  /**
   * Go to the first page.
   */
  firstPage: () => void;

  /**
   * Go to the last page.
   */
  lastPage: () => void;

  /**
   * Sets the disabled state.
   */
  setDisabled: (disabled: boolean) => void;

  /**
   * Checks if pagination is disabled.
   */
  isDisabled: () => boolean;

  /**
   * Cleans up event listeners and resources.
   */
  destroy: () => void;
}
