/**
 * @fileoverview Type definitions for the Sidebar component.
 * @description DOS-style navigation sidebar with collapsible sections.
 */

import type { BaseComponentProps } from '../../types';

/**
 * Represents an item in the sidebar navigation.
 */
export interface SidebarItem {
  /**
   * Unique identifier for the item.
   */
  id: string;

  /**
   * Display text for the item.
   */
  label: string;

  /**
   * Optional icon (as ASCII/text character).
   */
  icon?: string;

  /**
   * Nested items (creates a collapsible section).
   */
  items?: SidebarItem[];

  /**
   * Whether the section is expanded (only applies to items with children).
   * @default true
   */
  expanded?: boolean;

  /**
   * Whether the item is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional href for link items.
   */
  href?: string;
}

/**
 * Configuration options for the Sidebar component.
 */
export interface SidebarProps extends BaseComponentProps {
  /**
   * Navigation items to display.
   */
  items: SidebarItem[];

  /**
   * Currently active item ID.
   */
  activeItem?: string;

  /**
   * Whether sections can be collapsed/expanded.
   * @default true
   */
  collapsible?: boolean;

  /**
   * Whether the entire sidebar is collapsed (shows only icons).
   * @default false
   */
  collapsed?: boolean;

  /**
   * Width of the sidebar.
   * @default '200px'
   */
  width?: string | number;

  /**
   * Position of the sidebar.
   * @default 'left'
   */
  position?: 'left' | 'right';

  /**
   * Callback when an item is selected.
   */
  onSelect?: (item: SidebarItem) => void;

  /**
   * Callback when a section is expanded/collapsed.
   */
  onToggle?: (item: SidebarItem, expanded: boolean) => void;

  /**
   * Callback when the sidebar collapse state changes.
   */
  onCollapseChange?: (collapsed: boolean) => void;
}

/**
 * Extended HTMLElement with Sidebar-specific properties.
 */
export interface SidebarElement extends HTMLElement {
  /**
   * Sets the active item by ID.
   */
  setActiveItem: (id: string | null) => void;

  /**
   * Gets the currently active item ID.
   */
  getActiveItem: () => string | null;

  /**
   * Expands a section by ID.
   */
  expandSection: (id: string) => void;

  /**
   * Collapses a section by ID.
   */
  collapseSection: (id: string) => void;

  /**
   * Toggles a section's expanded state.
   */
  toggleSection: (id: string) => void;

  /**
   * Collapses or expands the entire sidebar.
   */
  setCollapsed: (collapsed: boolean) => void;

  /**
   * Gets whether the sidebar is collapsed.
   */
  isCollapsed: () => boolean;

  /**
   * Updates the sidebar items.
   */
  setItems: (items: SidebarItem[]) => void;

  /**
   * Cleans up event listeners and resources.
   */
  destroy: () => void;
}
