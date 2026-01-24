/**
 * MenuBar Component Types
 *
 * Type definitions for the DOS-style MenuBar component.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Menu item action (for leaf menu items)
 */
export interface MenuItemAction {
  /**
   * Menu item label
   */
  label: string;

  /**
   * Optional icon/character prefix
   */
  icon?: string;

  /**
   * Keyboard shortcut display (e.g., 'Ctrl+N')
   */
  shortcut?: string;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to render as a divider instead of an item
   * @default false
   */
  divider?: boolean;

  /**
   * Action handler when item is selected
   */
  action?: () => void;

  /**
   * Nested submenu items
   */
  items?: MenuItem[];
}

/**
 * Menu item that can be an action or a divider
 */
export type MenuItem = MenuItemAction;

/**
 * Top-level menu bar item configuration
 */
export interface MenuBarItem {
  /**
   * Menu label (e.g., 'File')
   */
  label: string;

  /**
   * Alt+key shortcut character (e.g., 'F' for Alt+F)
   * If not provided, first character of label is used
   */
  accessKey?: string;

  /**
   * Dropdown menu items
   */
  items: MenuItem[];

  /**
   * Whether the menu is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Props for the MenuBar component
 */
export interface MenuBarProps extends BaseComponentProps {
  /**
   * Menu bar items
   */
  items: MenuBarItem[];

  /**
   * Called when a menu item is selected
   */
  onSelect?: (item: MenuItem, path: string[]) => void;

  /**
   * Called when a menu opens
   */
  onMenuOpen?: (menuLabel: string) => void;

  /**
   * Called when a menu closes
   */
  onMenuClose?: (menuLabel: string) => void;
}

/**
 * Extended HTMLElement with MenuBar-specific methods
 */
export interface MenuBarElement extends HTMLElement {
  /**
   * Opens a specific menu by label
   */
  openMenu(label: string): void;

  /**
   * Closes the currently open menu
   */
  closeMenu(): void;

  /**
   * Gets the currently open menu label, or null if none
   */
  getOpenMenu(): string | null;

  /**
   * Updates the menu items
   */
  setItems(items: MenuBarItem[]): void;

  /**
   * Enables or disables a menu by label
   */
  setMenuDisabled(label: string, disabled: boolean): void;

  /**
   * Enables or disables a menu item by path
   * @param path - Array of labels leading to the item (e.g., ['File', 'New'])
   */
  setItemDisabled(path: string[], disabled: boolean): void;

  /**
   * Destroys the component and cleans up event listeners
   */
  destroy(): void;
}
