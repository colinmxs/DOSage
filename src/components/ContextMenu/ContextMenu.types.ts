/**
 * ContextMenu Types
 *
 * Type definitions for the DOS-style context menu component.
 * Reuses DropdownMenuItem for menu items structure.
 */

import type { DropdownMenuItem } from '../DropdownMenu/DropdownMenu.types';

/**
 * Position where the context menu should appear
 */
export interface ContextMenuPosition {
  /** X coordinate (pixels from left) */
  x: number;
  /** Y coordinate (pixels from top) */
  y: number;
}

/**
 * Props for the ContextMenu component
 */
export interface ContextMenuProps {
  /**
   * Array of menu items to display.
   * Reuses the same structure as DropdownMenu for consistency.
   */
  items: DropdownMenuItem[];

  /**
   * Target element(s) to attach the context menu to.
   * Can be a CSS selector string or an HTMLElement reference.
   * Context menu will open on right-click of these elements.
   */
  target?: string | HTMLElement;

  /**
   * Optional custom className to add to the context menu element.
   */
  className?: string;

  /**
   * Optional id attribute for the context menu element.
   */
  id?: string;

  /**
   * Callback fired when a menu item is selected.
   * @param item - The selected menu item
   * @param path - Array of item IDs representing the path to the selected item
   */
  onSelect?: (item: DropdownMenuItem, path: string[]) => void;

  /**
   * Callback fired when the context menu opens.
   * @param position - The position where the menu opened
   */
  onOpen?: (position: ContextMenuPosition) => void;

  /**
   * Callback fired when the context menu closes.
   */
  onClose?: () => void;
}

/**
 * Extended HTMLElement interface for the ContextMenu component.
 * Includes programmatic API methods.
 */
export interface ContextMenuElement extends HTMLUListElement {
  /**
   * Opens the context menu at the specified position.
   * @param position - The position to open the menu at
   */
  open: (position: ContextMenuPosition) => void;

  /**
   * Closes the context menu.
   */
  close: () => void;

  /**
   * Checks if the context menu is currently open.
   * @returns true if open, false otherwise
   */
  isOpen: () => boolean;

  /**
   * Updates the menu items.
   * @param items - New array of menu items
   */
  setItems: (items: DropdownMenuItem[]) => void;

  /**
   * Attaches the context menu to new target element(s).
   * @param target - CSS selector or HTMLElement to attach to
   */
  attach: (target: string | HTMLElement) => void;

  /**
   * Detaches the context menu from the current target(s).
   */
  detach: () => void;

  /**
   * Enables or disables a menu item by its ID.
   * @param itemId - The ID of the item to update
   * @param disabled - Whether the item should be disabled
   */
  setItemDisabled: (itemId: string, disabled: boolean) => void;

  /**
   * Cleans up event listeners and removes the element.
   */
  destroy: () => void;
}

// Re-export DropdownMenuItem for convenience
export type { DropdownMenuItem } from '../DropdownMenu/DropdownMenu.types';
