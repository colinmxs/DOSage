/**
 * DropdownMenu Component Types
 *
 * Type definitions for the DOS-style DropdownMenu component.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Menu item definition for dropdown menus
 */
export interface DropdownMenuItem {
  /**
   * Optional unique identifier for the item
   * Used for item lookup and path tracking
   */
  id?: string;

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
   * Nested submenu items
   */
  items?: DropdownMenuItem[];

  /**
   * Action handler when item is selected
   */
  action?: () => void;
}

/**
 * Position options for dropdown placement
 */
export type DropdownPosition = 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end';

/**
 * Props for the DropdownMenu component
 */
export interface DropdownMenuProps extends BaseComponentProps {
  /**
   * Menu items to display
   */
  items: DropdownMenuItem[];

  /**
   * Controlled open state
   */
  open?: boolean;

  /**
   * Trigger element to attach the dropdown to
   * Can be an Element or a CSS selector string
   */
  trigger?: HTMLElement | string;

  /**
   * Dropdown position relative to trigger
   * @default 'bottom-start'
   */
  position?: DropdownPosition;

  /**
   * Called when a menu item is selected
   */
  onSelect?: (item: DropdownMenuItem, path: string[]) => void;

  /**
   * Called when the dropdown opens
   */
  onOpen?: () => void;

  /**
   * Called when the dropdown closes
   */
  onClose?: () => void;
}

/**
 * Extended HTMLElement with DropdownMenu-specific methods
 */
export interface DropdownMenuElement extends HTMLElement {
  /**
   * Opens the dropdown menu
   */
  open(): void;

  /**
   * Closes the dropdown menu
   */
  close(): void;

  /**
   * Toggles the dropdown menu
   */
  toggle(): void;

  /**
   * Gets whether the menu is open
   */
  isOpen(): boolean;

  /**
   * Updates the menu items
   */
  setItems(items: DropdownMenuItem[]): void;

  /**
   * Updates the position
   */
  setPosition(position: DropdownPosition): void;

  /**
   * Sets an item's disabled state
   * @param path - Path to the item (array of labels)
   * @param disabled - Whether to disable the item
   */
  setItemDisabled(path: string[], disabled: boolean): void;

  /**
   * Cleans up event listeners and removes the element
   */
  destroy(): void;
}
