/**
 * ContextMenu Component
 *
 * A DOS-style context menu that appears on right-click.
 * Reuses DropdownMenu patterns and styling for consistency.
 * 
 * Features:
 * - Right-click triggered
 * - Position at cursor location
 * - Viewport boundary handling
 * - Shift+F10 keyboard trigger
 * - Submenu support
 * - Full keyboard navigation
 */

import type {
  ContextMenuProps,
  ContextMenuElement,
  ContextMenuPosition,
  DropdownMenuItem,
} from './ContextMenu.types';
import './ContextMenu.css';

// Unique ID counter for context menus
let contextMenuIdCounter = 0;

/**
 * Generates a unique ID for context menu elements
 */
function generateContextMenuId(): string {
  return `dos-context-menu-${++contextMenuIdCounter}`;
}

/**
 * Deep clones menu items to prevent mutation of original data
 */
function deepCloneItems(items: DropdownMenuItem[]): DropdownMenuItem[] {
  return items.map((item): DropdownMenuItem => {
    const cloned: DropdownMenuItem = { ...item };
    if (item.items) {
      cloned.items = deepCloneItems(item.items);
    }
    return cloned;
  });
}

/**
 * Builds CSS classes for the context menu
 */
function buildContextMenuClasses(isOpen: boolean, className?: string): string {
  const classes = ['dos-context-menu'];
  
  if (isOpen) {
    classes.push('dos-context-menu--open');
  }
  
  if (className) {
    classes.push(className);
  }
  
  return classes.join(' ');
}

/**
 * Creates a DOS-style context menu element.
 *
 * @param props - ContextMenu configuration options
 * @returns The context menu element with methods
 *
 * @example
 * ```typescript
 * import { createContextMenu } from 'dosage';
 *
 * const contextMenu = createContextMenu({
 *   items: [
 *     { label: 'Cut', shortcut: 'Ctrl+X', action: () => console.log('Cut') },
 *     { label: 'Copy', shortcut: 'Ctrl+C', action: () => console.log('Copy') },
 *     { label: 'Paste', shortcut: 'Ctrl+V', action: () => console.log('Paste') },
 *     { divider: true },
 *     { label: 'Delete', action: () => console.log('Delete') }
 *   ],
 *   target: document.getElementById('editable-area'),
 *   onSelect: (item, path) => console.log('Selected:', item.label)
 * });
 *
 * document.body.appendChild(contextMenu);
 * ```
 */
export function createContextMenu(props: ContextMenuProps): ContextMenuElement {
  const {
    items: initialItems,
    target: initialTarget,
    className,
    id,
    onSelect,
    onOpen,
    onClose,
  } = props;

  // Generate unique ID
  const contextMenuId = id || generateContextMenuId();

  // Internal state
  let items = deepCloneItems(initialItems);
  let isOpen = false;
  let currentPosition: ContextMenuPosition = { x: 0, y: 0 };
  // Track highlighted index for potential future use
  // @ts-expect-error - Variable is maintained for state tracking but not read yet
  let highlightedIndex = -1;
  let activeSubmenuStack: HTMLElement[] = [];
  let targetElements: HTMLElement[] = [];

  // Create context menu element
  const contextMenu = document.createElement('ul') as unknown as ContextMenuElement;
  contextMenu.className = buildContextMenuClasses(isOpen, className);
  contextMenu.id = contextMenuId;
  contextMenu.setAttribute('role', 'menu');
  contextMenu.setAttribute('tabindex', '-1');
  contextMenu.setAttribute('aria-label', 'Context menu');

  // ============================================
  // Rendering Functions
  // ============================================

  /**
   * Renders all menu items
   */
  function render(): void {
    contextMenu.innerHTML = '';
    highlightedIndex = -1;

    items.forEach((item, index) => {
      if (item.divider) {
        contextMenu.appendChild(createDivider());
      } else {
        contextMenu.appendChild(createMenuItem(item, index, []));
      }
    });
  }

  /**
   * Creates a divider element
   */
  function createDivider(): HTMLElement {
    const divider = document.createElement('li');
    divider.className = 'dos-context-menu__divider';
    divider.setAttribute('role', 'separator');
    return divider;
  }

  /**
   * Creates a menu item element
   */
  function createMenuItem(
    item: DropdownMenuItem,
    index: number,
    parentPath: string[]
  ): HTMLElement {
    const menuItem = document.createElement('li');
    menuItem.className = 'dos-context-menu__item';
    menuItem.setAttribute('role', 'menuitem');
    menuItem.setAttribute('tabindex', '-1');

    const itemId = item.id || `${contextMenuId}-item-${parentPath.join('-')}-${index}`;
    menuItem.dataset.itemId = itemId;
    menuItem.dataset.index = String(index);

    if (item.disabled) {
      menuItem.classList.add('dos-context-menu__item--disabled');
      menuItem.setAttribute('aria-disabled', 'true');
    }

    // Icon
    if (item.icon) {
      const icon = document.createElement('span');
      icon.className = 'dos-context-menu__icon';
      icon.textContent = item.icon;
      icon.setAttribute('aria-hidden', 'true');
      menuItem.appendChild(icon);
    }

    // Label
    const label = document.createElement('span');
    label.className = 'dos-context-menu__label';
    label.textContent = item.label || '';
    menuItem.appendChild(label);

    // Shortcut
    if (item.shortcut) {
      const shortcut = document.createElement('span');
      shortcut.className = 'dos-context-menu__shortcut';
      shortcut.textContent = item.shortcut;
      shortcut.setAttribute('aria-hidden', 'true');
      menuItem.appendChild(shortcut);
    }

    // Submenu arrow
    if (item.items && item.items.length > 0) {
      const arrow = document.createElement('span');
      arrow.className = 'dos-context-menu__submenu-arrow';
      arrow.textContent = '▶';
      arrow.setAttribute('aria-hidden', 'true');
      menuItem.appendChild(arrow);

      menuItem.setAttribute('aria-haspopup', 'true');
      menuItem.setAttribute('aria-expanded', 'false');

      // Create submenu
      const submenu = createSubmenu(item.items, [...parentPath, itemId]);
      menuItem.appendChild(submenu);

      // Hover event for submenu
      menuItem.addEventListener('mouseenter', () => {
        if (!item.disabled) {
          openSubmenu(menuItem, submenu);
        }
      });

      menuItem.addEventListener('mouseleave', (e) => {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!submenu.contains(relatedTarget) && !menuItem.contains(relatedTarget)) {
          closeSubmenu(submenu);
        }
      });
    }

    // Click event
    menuItem.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!item.disabled) {
        if (item.items && item.items.length > 0) {
          const submenu = menuItem.querySelector('.dos-context-menu__submenu') as HTMLElement;
          if (submenu) {
            const isSubmenuOpen = submenu.classList.contains('dos-context-menu__submenu--open');
            if (isSubmenuOpen) {
              closeSubmenu(submenu);
            } else {
              openSubmenu(menuItem, submenu);
            }
          }
        } else {
          selectItem(item, [...parentPath, itemId]);
        }
      }
    });

    // Keyboard events
    menuItem.addEventListener('keydown', (e) => {
      handleItemKeydown(e, item, menuItem, [...parentPath, itemId]);
    });

    return menuItem;
  }

  /**
   * Creates a submenu element
   */
  function createSubmenu(subItems: DropdownMenuItem[], parentPath: string[]): HTMLElement {
    const submenu = document.createElement('ul');
    submenu.className = 'dos-context-menu__submenu';
    submenu.setAttribute('role', 'menu');

    subItems.forEach((item, index) => {
      if (item.divider) {
        submenu.appendChild(createDivider());
      } else {
        submenu.appendChild(createMenuItem(item, index, parentPath));
      }
    });

    return submenu;
  }

  /**
   * Opens a submenu
   */
  function openSubmenu(parentItem: HTMLElement, submenu: HTMLElement): void {
    // Close other submenus at same level
    const parent = parentItem.parentElement;
    if (parent) {
      const otherSubmenus = parent.querySelectorAll('.dos-context-menu__submenu--open');
      otherSubmenus.forEach((sm) => {
        if (sm !== submenu) {
          closeSubmenu(sm as HTMLElement);
        }
      });
    }

    // Check viewport bounds and flip if needed
    const parentRect = parentItem.getBoundingClientRect();
    const submenuWidth = 160; // min-width
    
    if (parentRect.right + submenuWidth > window.innerWidth) {
      submenu.classList.add('dos-context-menu__submenu--flip-left');
    } else {
      submenu.classList.remove('dos-context-menu__submenu--flip-left');
    }

    submenu.classList.add('dos-context-menu__submenu--open');
    parentItem.setAttribute('aria-expanded', 'true');
    activeSubmenuStack.push(submenu);
  }

  /**
   * Closes a submenu
   */
  function closeSubmenu(submenu: HTMLElement): void {
    submenu.classList.remove('dos-context-menu__submenu--open');
    
    const parentItem = submenu.parentElement;
    if (parentItem) {
      parentItem.setAttribute('aria-expanded', 'false');
    }

    // Close nested submenus
    const nestedSubmenus = submenu.querySelectorAll('.dos-context-menu__submenu--open');
    nestedSubmenus.forEach((nested) => {
      nested.classList.remove('dos-context-menu__submenu--open');
      const nestedParent = nested.parentElement;
      if (nestedParent) {
        nestedParent.setAttribute('aria-expanded', 'false');
      }
    });

    // Remove from stack
    const stackIndex = activeSubmenuStack.indexOf(submenu);
    if (stackIndex !== -1) {
      activeSubmenuStack.splice(stackIndex);
    }
  }

  /**
   * Closes all submenus
   */
  function closeAllSubmenus(): void {
    const openSubmenus = contextMenu.querySelectorAll('.dos-context-menu__submenu--open');
    openSubmenus.forEach((submenu) => {
      closeSubmenu(submenu as HTMLElement);
    });
    activeSubmenuStack = [];
  }

  /**
   * Selects a menu item
   */
  function selectItem(item: DropdownMenuItem, path: string[]): void {
    if (item.action) {
      item.action();
    }
    if (onSelect) {
      onSelect(item, path);
    }
    close();
  }

  // ============================================
  // Keyboard Navigation
  // ============================================

  /**
   * Handles keydown on menu items
   */
  function handleItemKeydown(
    e: KeyboardEvent,
    item: DropdownMenuItem,
    menuItem: HTMLElement,
    path: string[]
  ): void {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusNextItem(menuItem);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusPreviousItem(menuItem);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (item.items && item.items.length > 0 && !item.disabled) {
          const submenu = menuItem.querySelector('.dos-context-menu__submenu') as HTMLElement;
          if (submenu) {
            openSubmenu(menuItem, submenu);
            const firstItem = submenu.querySelector('.dos-context-menu__item:not(.dos-context-menu__item--disabled)') as HTMLElement;
            if (firstItem) {
              firstItem.focus();
            }
          }
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        // If in submenu, close and focus parent
        const parentSubmenu = menuItem.closest('.dos-context-menu__submenu');
        if (parentSubmenu) {
          closeSubmenu(parentSubmenu as HTMLElement);
          const parentItem = parentSubmenu.parentElement;
          if (parentItem) {
            parentItem.focus();
          }
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!item.disabled) {
          if (item.items && item.items.length > 0) {
            const submenu = menuItem.querySelector('.dos-context-menu__submenu') as HTMLElement;
            if (submenu) {
              openSubmenu(menuItem, submenu);
              const firstItem = submenu.querySelector('.dos-context-menu__item:not(.dos-context-menu__item--disabled)') as HTMLElement;
              if (firstItem) {
                firstItem.focus();
              }
            }
          } else {
            selectItem(item, path);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Home':
        e.preventDefault();
        focusFirstItem(menuItem);
        break;
      case 'End':
        e.preventDefault();
        focusLastItem(menuItem);
        break;
      default:
        // Type-ahead search
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
          focusItemStartingWith(menuItem, e.key);
        }
    }
  }

  /**
   * Gets focusable items in the same menu level
   */
  function getFocusableItems(currentItem: HTMLElement): HTMLElement[] {
    const parent = currentItem.parentElement;
    if (!parent) return [];
    return Array.from(parent.querySelectorAll(':scope > .dos-context-menu__item:not(.dos-context-menu__item--disabled)'));
  }

  /**
   * Focuses the next menu item
   */
  function focusNextItem(currentItem: HTMLElement): void {
    const items = getFocusableItems(currentItem);
    const currentIndex = items.indexOf(currentItem);
    const nextIndex = (currentIndex + 1) % items.length;
    const nextItem = items[nextIndex];
    if (nextItem) {
      nextItem.focus();
    }
  }

  /**
   * Focuses the previous menu item
   */
  function focusPreviousItem(currentItem: HTMLElement): void {
    const items = getFocusableItems(currentItem);
    const currentIndex = items.indexOf(currentItem);
    const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
    const prevItem = items[prevIndex];
    if (prevItem) {
      prevItem.focus();
    }
  }

  /**
   * Focuses the first item
   */
  function focusFirstItem(currentItem: HTMLElement): void {
    const items = getFocusableItems(currentItem);
    const firstItem = items[0];
    if (firstItem) {
      firstItem.focus();
    }
  }

  /**
   * Focuses the last item
   */
  function focusLastItem(currentItem: HTMLElement): void {
    const items = getFocusableItems(currentItem);
    const lastItem = items[items.length - 1];
    if (lastItem) {
      lastItem.focus();
    }
  }

  /**
   * Focuses item starting with character (type-ahead)
   */
  function focusItemStartingWith(currentItem: HTMLElement, char: string): void {
    const items = getFocusableItems(currentItem);
    const currentIndex = items.indexOf(currentItem);
    const lowerChar = char.toLowerCase();
    
    // Start from next item and wrap around
    for (let i = 1; i <= items.length; i++) {
      const index = (currentIndex + i) % items.length;
      const item = items[index];
      if (item) {
        const label = item.querySelector('.dos-context-menu__label');
        if (label && label.textContent?.toLowerCase().startsWith(lowerChar)) {
          item.focus();
          return;
        }
      }
    }
  }

  // ============================================
  // Menu Keyboard Handler
  // ============================================

  /**
   * Handles keydown on the context menu container
   */
  function handleMenuKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  }

  // ============================================
  // Position Handling
  // ============================================

  /**
   * Positions the context menu at the given coordinates
   */
  function positionMenu(x: number, y: number): void {
    // Get menu dimensions (need to show temporarily to measure)
    contextMenu.style.visibility = 'hidden';
    contextMenu.style.display = 'block';
    const menuRect = contextMenu.getBoundingClientRect();
    contextMenu.style.display = '';
    contextMenu.style.visibility = '';

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let finalX = x;
    let finalY = y;

    // Flip horizontal if would overflow right
    if (x + menuRect.width > viewportWidth) {
      finalX = Math.max(0, x - menuRect.width);
      contextMenu.classList.add('dos-context-menu--flip-horizontal');
    } else {
      contextMenu.classList.remove('dos-context-menu--flip-horizontal');
    }

    // Flip vertical if would overflow bottom
    if (y + menuRect.height > viewportHeight) {
      finalY = Math.max(0, y - menuRect.height);
      contextMenu.classList.add('dos-context-menu--flip-vertical');
    } else {
      contextMenu.classList.remove('dos-context-menu--flip-vertical');
    }

    contextMenu.style.left = `${finalX}px`;
    contextMenu.style.top = `${finalY}px`;
    currentPosition = { x: finalX, y: finalY };
  }

  // ============================================
  // Open/Close Functions
  // ============================================

  /**
   * Opens the context menu at the specified position
   */
  function open(position: ContextMenuPosition): void {
    if (isOpen) return;

    isOpen = true;
    positionMenu(position.x, position.y);
    contextMenu.className = buildContextMenuClasses(isOpen, className);

    // Focus first item
    requestAnimationFrame(() => {
      const firstItem = contextMenu.querySelector('.dos-context-menu__item:not(.dos-context-menu__item--disabled)') as HTMLElement;
      if (firstItem) {
        firstItem.focus();
      }
    });

    if (onOpen) {
      onOpen(currentPosition);
    }
  }

  /**
   * Closes the context menu
   */
  function close(): void {
    if (!isOpen) return;

    isOpen = false;
    contextMenu.className = buildContextMenuClasses(isOpen, className);
    closeAllSubmenus();

    if (onClose) {
      onClose();
    }
  }

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * Handles right-click on target elements
   */
  function handleContextMenu(e: MouseEvent): void {
    e.preventDefault();
    open({ x: e.clientX, y: e.clientY });
  }

  /**
   * Handles Shift+F10 keyboard shortcut on target elements
   */
  function handleTargetKeydown(e: KeyboardEvent): void {
    if (e.key === 'F10' && e.shiftKey) {
      e.preventDefault();
      // Position near the element
      const target = e.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      open({ x: rect.left, y: rect.bottom });
    }
  }

  /**
   * Handles clicks outside the context menu
   */
  function handleOutsideClick(e: MouseEvent): void {
    if (isOpen && !contextMenu.contains(e.target as Node)) {
      close();
    }
  }

  /**
   * Handles global Escape key
   */
  function handleGlobalKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      close();
    }
  }

  // ============================================
  // Target Attachment
  // ============================================

  /**
   * Attaches context menu to target element(s)
   */
  function attach(target: string | HTMLElement): void {
    // Detach from existing targets first
    detach();

    if (typeof target === 'string') {
      targetElements = Array.from(document.querySelectorAll(target));
    } else {
      targetElements = [target];
    }

    targetElements.forEach((el) => {
      el.addEventListener('contextmenu', handleContextMenu);
      el.addEventListener('keydown', handleTargetKeydown);
    });
  }

  /**
   * Detaches context menu from current target(s)
   */
  function detach(): void {
    targetElements.forEach((el) => {
      el.removeEventListener('contextmenu', handleContextMenu);
      el.removeEventListener('keydown', handleTargetKeydown);
    });
    targetElements = [];
  }

  // ============================================
  // Public API
  // ============================================

  /**
   * Updates the menu items
   */
  function setItems(newItems: DropdownMenuItem[]): void {
    items = deepCloneItems(newItems);
    render();
  }

  /**
   * Enables or disables a menu item
   */
  function setItemDisabled(itemId: string, disabled: boolean): void {
    function updateItem(itemList: DropdownMenuItem[]): boolean {
      for (const item of itemList) {
        if (item.id === itemId) {
          item.disabled = disabled;
          return true;
        }
        if (item.items) {
          if (updateItem(item.items)) return true;
        }
      }
      return false;
    }

    updateItem(items);
    render();
  }

  /**
   * Cleans up event listeners and removes the element
   */
  function destroy(): void {
    detach();
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('keydown', handleGlobalKeydown);
    contextMenu.removeEventListener('keydown', handleMenuKeydown);
    contextMenu.remove();
  }

  // ============================================
  // Setup
  // ============================================

  // Attach to initial target if provided
  if (initialTarget) {
    attach(initialTarget);
  }

  // Global listeners
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleGlobalKeydown);
  contextMenu.addEventListener('keydown', handleMenuKeydown);

  // Initial render
  render();

  // Attach API methods
  contextMenu.open = open;
  contextMenu.close = close;
  contextMenu.isOpen = () => isOpen;
  contextMenu.setItems = setItems;
  contextMenu.attach = attach;
  contextMenu.detach = detach;
  contextMenu.setItemDisabled = setItemDisabled;
  contextMenu.destroy = destroy;

  return contextMenu;
}
