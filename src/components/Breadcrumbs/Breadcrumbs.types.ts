/**
 * @fileoverview Type definitions for the Breadcrumbs component.
 * @description DOS-style breadcrumb navigation trail.
 */

import type { BaseComponentProps } from '../../types';

/**
 * Represents a single item in the breadcrumb trail.
 */
export interface BreadcrumbItem {
  /**
   * Display text for the item.
   */
  label: string;

  /**
   * Optional link URL for the item.
   * If not provided, item will not be clickable.
   */
  href?: string;

  /**
   * Optional icon (as ASCII/text character).
   */
  icon?: string;

  /**
   * Unique identifier for the item.
   */
  id?: string;
}

/**
 * Available separator styles for breadcrumbs.
 */
export type BreadcrumbSeparator = '>' | '»' | '/' | '\\' | '│' | '→' | '►' | string;

/**
 * Configuration options for the Breadcrumbs component.
 */
export interface BreadcrumbsProps extends BaseComponentProps {
  /**
   * Items in the breadcrumb trail.
   * The last item is considered the current page.
   */
  items: BreadcrumbItem[];

  /**
   * Separator character between items.
   * @default '>'
   */
  separator?: BreadcrumbSeparator;

  /**
   * Maximum number of items to display before collapsing.
   * When set, middle items are replaced with ellipsis.
   * @default undefined (no limit)
   */
  maxItems?: number;

  /**
   * Callback when an item is clicked.
   * Note: The last item (current page) is not clickable.
   */
  onSelect?: (item: BreadcrumbItem, index: number) => void;

  /**
   * Custom label for the navigation landmark.
   * @default 'Breadcrumb'
   */
  ariaLabel?: string;
}

/**
 * Extended HTMLElement with Breadcrumbs-specific properties.
 */
export interface BreadcrumbsElement extends HTMLElement {
  /**
   * Updates the breadcrumb items.
   */
  setItems: (items: BreadcrumbItem[]) => void;

  /**
   * Gets the current breadcrumb items.
   */
  getItems: () => BreadcrumbItem[];

  /**
   * Sets the separator character.
   */
  setSeparator: (separator: BreadcrumbSeparator) => void;

  /**
   * Sets the maximum visible items.
   */
  setMaxItems: (maxItems: number | undefined) => void;

  /**
   * Cleans up event listeners and resources.
   */
  destroy: () => void;
}
