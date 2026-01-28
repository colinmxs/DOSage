/**
 * MenuBar Component
 *
 * A DOS-style horizontal menu bar with dropdown menus and keyboard navigation.
 * Classic DOS interface: File  Edit  View  Options  Help
 */

import type {
  MenuBarProps,
  MenuBarElement,
  MenuBarItem,
  MenuItem,
} from './MenuBar.types';
import './MenuBar.css';

// Unique ID counter for menu-label association
let menuBarIdCounter = 0;

/**
 * Generates a unique ID for menu bar elements
 */
function generateMenuBarId(): string {
  return `dos-menubar-${++menuBarIdCounter}`;
}

/**
 * Deep clones menu items to prevent mutation of original data
 */
function deepCloneItems(items: MenuBarItem[]): MenuBarItem[] {
  return items.map((item) => ({
    ...item,
    items: item.items.map((subItem) => {
      const cloned: MenuItem = {
        ...subItem,
      };
      if (subItem.items) {
        cloned.items = deepCloneMenuItems(subItem.items);
      }
      return cloned;
    }),
  }));
}

/**
 * Deep clones menu item children recursively
 */
function deepCloneMenuItems(items: MenuItem[]): MenuItem[] {
  return items.map((item) => {
    const cloned: MenuItem = {
      ...item,
    };
    if (item.items) {
      cloned.items = deepCloneMenuItems(item.items);
    }
    return cloned;
  });
}

/**
 * Creates a DOS-style menu bar element.
 *
 * @param props - MenuBar configuration options
 * @returns The menu bar element with methods
 *
 * @example
 * ```typescript
 * import { createMenuBar } from 'dosage';
 *
 * const menuBar = createMenuBar({
 *   items: [
 *     {
 *       label: 'File',
 *       accessKey: 'F',
 *       items: [
 *         { label: 'New', shortcut: 'Ctrl+N', action: () => console.log('New') },
 *         { label: 'Open', shortcut: 'Ctrl+O', action: () => console.log('Open') },
 *         { divider: true },
 *         { label: 'Exit', shortcut: 'Alt+F4', action: () => console.log('Exit') }
 *       ]
 *     },
 *     {
 *       label: 'Edit',
 *       accessKey: 'E',
 *       items: [
 *         { label: 'Cut', shortcut: 'Ctrl+X' },
 *         { label: 'Copy', shortcut: 'Ctrl+C' },
 *         { label: 'Paste', shortcut: 'Ctrl+V' }
 *       ]
 *     }
 *   ],
 *   onSelect: (item, path) => console.log('Selected:', path.join(' > '))
 * });
 *
 * document.body.appendChild(menuBar);
 * ```
 */
export function createMenuBar(props: MenuBarProps): MenuBarElement {
  const { items: initialItems, onSelect, onMenuOpen, onMenuClose, className, id } = props;

  // Generate unique ID
  const menuBarId = id ?? generateMenuBarId();

  // Internal state - deep clone items to prevent mutation of original data
  let items = deepCloneItems(initialItems);
  let openMenuIndex = -1;
  let activeSubmenuStack: HTMLElement[] = [];
  let isProgrammaticOpen = false;

  // Create menu bar element
  const menuBar = document.createElement('nav') as MenuBarElement;
  menuBar.className = buildMenuBarClasses(className);
  menuBar.id = menuBarId;
  menuBar.setAttribute('role', 'menubar');
  menuBar.setAttribute('aria-label', 'Main menu');

  // Create menu items container
  const menuList = document.createElement('ul');
  menuList.className = 'dos-menu-bar__list';
  menuList.setAttribute('role', 'none');
  menuBar.appendChild(menuList);

  // Render menu items
  function render(): void {
    menuList.innerHTML = '';
    items.forEach((item, index) => {
      const menuItem = createMenuBarItem(item, index);
      menuList.appendChild(menuItem);
    });
  }

  // Create a top-level menu bar item
  function createMenuBarItem(item: MenuBarItem, index: number): HTMLElement {
    const li = document.createElement('li');
    li.className = 'dos-menu-bar__item';
    li.setAttribute('role', 'none');

    const button = document.createElement('button');
    button.className = 'dos-menu-bar__trigger';
    button.setAttribute('role', 'menuitem');
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('tabindex', index === 0 ? '0' : '-1');
    button.setAttribute('data-menu-index', String(index));

    if (item.disabled) {
      button.setAttribute('aria-disabled', 'true');
      button.classList.add('dos-menu-bar__trigger--disabled');
    }

    // Create label with access key underlined
    const accessKey = item.accessKey ?? item.label.charAt(0);
    const accessKeyIndex = item.label.toLowerCase().indexOf(accessKey.toLowerCase());

    if (accessKeyIndex !== -1) {
      const before = item.label.substring(0, accessKeyIndex);
      const key = item.label.charAt(accessKeyIndex);
      const after = item.label.substring(accessKeyIndex + 1);

      if (before) {
        button.appendChild(document.createTextNode(before));
      }

      const underlined = document.createElement('span');
      underlined.className = 'dos-menu-bar__accesskey';
      underlined.textContent = key;
      button.appendChild(underlined);

      if (after) {
        button.appendChild(document.createTextNode(after));
      }
    } else {
      button.textContent = item.label;
    }

    // Store access key for keyboard shortcuts
    button.setAttribute('data-access-key', accessKey.toLowerCase());

    // Event handlers
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!item.disabled) {
        toggleMenu(index);
      }
    });

    button.addEventListener('mouseenter', () => {
      if (openMenuIndex !== -1 && openMenuIndex !== index && !item.disabled) {
        openMenu(index);
      }
    });

    button.addEventListener('keydown', (e) => handleMenuItemKeydown(e, index));
    button.addEventListener('focus', () => {
      // Focus event handled
    });

    li.appendChild(button);

    // Create dropdown menu
    const dropdown = createDropdownMenu(item.items, [item.label]);
    dropdown.setAttribute('aria-label', `${item.label} menu`);
    li.appendChild(dropdown);

    return li;
  }

  // Create a dropdown menu
  function createDropdownMenu(menuItems: MenuItem[], path: string[]): HTMLElement {
    const dropdown = document.createElement('ul');
    dropdown.className = 'dos-menu-bar__dropdown';
    dropdown.setAttribute('role', 'menu');

    menuItems.forEach((menuItem, index) => {
      if (menuItem.divider) {
        const divider = document.createElement('li');
        divider.className = 'dos-menu-bar__divider';
        divider.setAttribute('role', 'separator');
        dropdown.appendChild(divider);
      } else {
        const item = createDropdownItem(menuItem, index, path);
        dropdown.appendChild(item);
      }
    });

    return dropdown;
  }

  // Create a dropdown menu item
  function createDropdownItem(
    menuItem: MenuItem,
    _index: number,
    path: string[]
  ): HTMLElement {
    const li = document.createElement('li');
    li.className = 'dos-menu-bar__dropdown-item';
    li.setAttribute('role', 'none');

    const button = document.createElement('button');
    button.className = 'dos-menu-bar__dropdown-trigger';
    button.setAttribute('role', 'menuitem');
    button.setAttribute('tabindex', '-1');

    if (menuItem.disabled) {
      button.setAttribute('aria-disabled', 'true');
      button.classList.add('dos-menu-bar__dropdown-trigger--disabled');
    }

    const hasSubmenu = menuItem.items && menuItem.items.length > 0;
    if (hasSubmenu) {
      button.setAttribute('aria-haspopup', 'menu');
      button.setAttribute('aria-expanded', 'false');
    }

    // Icon
    if (menuItem.icon) {
      const icon = document.createElement('span');
      icon.className = 'dos-menu-bar__dropdown-icon';
      icon.textContent = menuItem.icon;
      button.appendChild(icon);
    } else {
      // Add spacer for alignment
      const spacer = document.createElement('span');
      spacer.className = 'dos-menu-bar__dropdown-icon dos-menu-bar__dropdown-icon--spacer';
      button.appendChild(spacer);
    }

    // Label
    const label = document.createElement('span');
    label.className = 'dos-menu-bar__dropdown-label';
    label.textContent = menuItem.label;
    button.appendChild(label);

    // Shortcut
    if (menuItem.shortcut) {
      const shortcut = document.createElement('span');
      shortcut.className = 'dos-menu-bar__dropdown-shortcut';
      shortcut.textContent = menuItem.shortcut;
      button.appendChild(shortcut);
    }

    // Submenu arrow
    if (hasSubmenu) {
      const arrow = document.createElement('span');
      arrow.className = 'dos-menu-bar__dropdown-arrow';
      arrow.textContent = '▶';
      button.appendChild(arrow);
    }

    // Event handlers
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menuItem.disabled) return;

      if (hasSubmenu && menuItem.items) {
        toggleSubmenu(li, menuItem.items, [...path, menuItem.label]);
      } else {
        selectItem(menuItem, [...path, menuItem.label]);
      }
    });

    button.addEventListener('mouseenter', () => {
      // Highlight this item
      const siblings = li.parentElement?.querySelectorAll('.dos-menu-bar__dropdown-trigger');
      siblings?.forEach((s) => s.classList.remove('dos-menu-bar__dropdown-trigger--highlighted'));
      button.classList.add('dos-menu-bar__dropdown-trigger--highlighted');

      // Auto-open submenu on hover
      if (hasSubmenu && !menuItem.disabled && menuItem.items) {
        openSubmenu(li, menuItem.items, [...path, menuItem.label]);
      } else {
        // Close any open submenus at this level
        closeSubmenusAt(li);
      }
    });

    button.addEventListener('keydown', (e) => {
      handleDropdownItemKeydown(e, li, menuItem, path);
    });

    li.appendChild(button);

    return li;
  }

  // Toggle menu open/close
  function toggleMenu(index: number): void {
    if (openMenuIndex === index) {
      closeMenu();
    } else {
      openMenu(index);
    }
  }

  // Open a menu by index
  function openMenu(index: number, focusFirstItem = false): void {
    // Close any currently open menu
    if (openMenuIndex !== -1) {
      closeMenuAt(openMenuIndex);
    }

    const item = items[index];
    if (!item || item.disabled) return;

    openMenuIndex = index;
    activeSubmenuStack = [];

    const menuItems = menuList.querySelectorAll('.dos-menu-bar__item');
    const menuItem = menuItems[index];
    if (!menuItem) return;
    const trigger = menuItem.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
    const dropdown = menuItem.querySelector('.dos-menu-bar__dropdown');
    if (!trigger) return;

    menuItem.classList.add('dos-menu-bar__item--active');
    trigger.setAttribute('aria-expanded', 'true');
    dropdown?.classList.add('dos-menu-bar__dropdown--open');

    // Clear any existing highlights on dropdown items
    dropdown
      ?.querySelectorAll('.dos-menu-bar__dropdown-trigger--highlighted')
      .forEach((el) => el.classList.remove('dos-menu-bar__dropdown-trigger--highlighted'));

    // Only focus first item when explicitly requested (keyboard navigation)
    // This matches native DOS behavior where items aren't highlighted until interacted with
    if (focusFirstItem) {
      const firstItem = dropdown?.querySelector(
        '.dos-menu-bar__dropdown-trigger:not([aria-disabled="true"])'
      ) as HTMLElement;
      firstItem?.focus();
    }

    onMenuOpen?.(item.label);
  }

  // Close the currently open menu
  function closeMenu(): void {
    if (openMenuIndex === -1) return;

    closeMenuAt(openMenuIndex);
    const item = items[openMenuIndex];
    if (item) {
      onMenuClose?.(item.label);
    }
    openMenuIndex = -1;
    activeSubmenuStack = [];
  }

  // Close menu at specific index
  function closeMenuAt(index: number): void {
    const menuItems = menuList.querySelectorAll('.dos-menu-bar__item');
    const menuItem = menuItems[index];
    if (!menuItem) return;
    const trigger = menuItem.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
    const dropdown = menuItem.querySelector('.dos-menu-bar__dropdown');
    if (!trigger) return;

    menuItem.classList.remove('dos-menu-bar__item--active');
    trigger.setAttribute('aria-expanded', 'false');
    dropdown?.classList.remove('dos-menu-bar__dropdown--open');

    // Close all submenus
    dropdown?.querySelectorAll('.dos-menu-bar__submenu').forEach((sub) => sub.remove());

    // Return focus to trigger
    trigger.focus();
  }

  // Open a submenu
  function openSubmenu(parentItem: HTMLElement, subItems: MenuItem[], path: string[]): void {
    // Close any existing submenu at this level
    closeSubmenusAt(parentItem);

    const button = parentItem.querySelector('.dos-menu-bar__dropdown-trigger');
    button?.setAttribute('aria-expanded', 'true');

    const submenu = createDropdownMenu(subItems, path);
    submenu.classList.add('dos-menu-bar__submenu');
    parentItem.appendChild(submenu);
    activeSubmenuStack.push(submenu);

    // Position submenu
    submenu.style.left = `${parentItem.offsetWidth}px`;
    submenu.style.top = '0';

    // Check if submenu goes off screen
    const submenuRect = submenu.getBoundingClientRect();
    if (submenuRect.right > window.innerWidth) {
      submenu.style.left = 'auto';
      submenu.style.right = '100%';
    }
  }

  // Toggle submenu
  function toggleSubmenu(parentItem: HTMLElement, subItems: MenuItem[], path: string[]): void {
    const existingSubmenu = parentItem.querySelector('.dos-menu-bar__submenu');
    if (existingSubmenu) {
      closeSubmenu(parentItem);
    } else {
      openSubmenu(parentItem, subItems, path);
    }
  }

  // Close submenu
  function closeSubmenu(parentItem: HTMLElement): void {
    const button = parentItem.querySelector('.dos-menu-bar__dropdown-trigger');
    button?.setAttribute('aria-expanded', 'false');
    const submenu = parentItem.querySelector('.dos-menu-bar__submenu');
    if (submenu) {
      activeSubmenuStack = activeSubmenuStack.filter((s) => s !== submenu);
      submenu.remove();
    }
  }

  // Close submenus at a given level (siblings)
  function closeSubmenusAt(item: HTMLElement): void {
    const parent = item.parentElement;
    if (!parent) return;

    parent.querySelectorAll('.dos-menu-bar__dropdown-item').forEach((sibling) => {
      if (sibling !== item) {
        const submenu = sibling.querySelector('.dos-menu-bar__submenu');
        if (submenu) {
          const button = sibling.querySelector('.dos-menu-bar__dropdown-trigger');
          button?.setAttribute('aria-expanded', 'false');
          submenu.remove();
        }
      }
    });
  }

  // Select an item
  function selectItem(menuItem: MenuItem, path: string[]): void {
    if (menuItem.disabled) return;

    menuItem.action?.();
    onSelect?.(menuItem, path);
    closeMenu();
  }

  // Handle keyboard navigation on menu bar items
  function handleMenuItemKeydown(e: KeyboardEvent, index: number): void {

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        focusMenuBarItem((index - 1 + items.length) % items.length);
        break;

      case 'ArrowRight':
        e.preventDefault();
        focusMenuBarItem((index + 1) % items.length);
        break;

      case 'ArrowDown':
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (items[index] && !items[index].disabled) {
          // Focus first item when opening via keyboard for accessibility
          openMenu(index, true);
        }
        break;

      case 'Escape':
        e.preventDefault();
        if (openMenuIndex !== -1) {
          closeMenu();
        }
        break;

      default:
        // Type-ahead
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          const key = e.key.toLowerCase();
          const found = items.findIndex(
            (item, i) =>
              i !== index &&
              !item.disabled &&
              (item.accessKey?.toLowerCase() === key || item.label.toLowerCase().startsWith(key))
          );
          if (found !== -1) {
            focusMenuBarItem(found);
          }
        }
    }
  }

  // Handle keyboard navigation on dropdown items
  function handleDropdownItemKeydown(
    e: KeyboardEvent,
    li: HTMLElement,
    menuItem: MenuItem,
    path: string[]
  ): void {
    const parent = li.parentElement;
    if (!parent) return;

    const allItems = Array.from(
      parent.querySelectorAll('.dos-menu-bar__dropdown-trigger:not([aria-disabled="true"])')
    ) as HTMLElement[];
    const currentButton = li.querySelector('.dos-menu-bar__dropdown-trigger');
    const currentIndex = currentButton ? allItems.indexOf(currentButton as HTMLElement) : -1;
    const hasSubmenu = menuItem.items && menuItem.items.length > 0;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          allItems[currentIndex - 1]?.focus();
        } else {
          allItems[allItems.length - 1]?.focus();
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < allItems.length - 1) {
          allItems[currentIndex + 1]?.focus();
        } else {
          allItems[0]?.focus();
        }
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (hasSubmenu && !menuItem.disabled && menuItem.items) {
          openSubmenu(li, menuItem.items, [...path, menuItem.label]);
          const firstSubItem = li.querySelector(
            '.dos-menu-bar__submenu .dos-menu-bar__dropdown-trigger:not([aria-disabled="true"])'
          ) as HTMLElement;
          firstSubItem?.focus();
        } else if (openMenuIndex !== -1) {
          // Move to next menu and focus first item in dropdown
          const nextIndex = (openMenuIndex + 1) % items.length;
          openMenu(nextIndex, true);
          // Update tabindex on triggers to match
          const triggers = menuList.querySelectorAll('.dos-menu-bar__trigger');
          triggers.forEach((t, i) => {
            t.setAttribute('tabindex', i === nextIndex ? '0' : '-1');
          });
        }
        break;

      case 'ArrowLeft': {
        e.preventDefault();
        // If in submenu, close it
        const isInSubmenu = li.closest('.dos-menu-bar__submenu');
        if (isInSubmenu) {
          const parentItem = isInSubmenu.parentElement;
          if (parentItem) {
            closeSubmenu(parentItem);
            const parentTrigger = parentItem.querySelector(
              '.dos-menu-bar__dropdown-trigger'
            ) as HTMLElement;
            parentTrigger?.focus();
          }
        } else if (openMenuIndex !== -1) {
          // Move to previous menu and focus first item in dropdown
          const prevIndex = (openMenuIndex - 1 + items.length) % items.length;
          openMenu(prevIndex, true);
          // Update tabindex on triggers to match
          const triggers = menuList.querySelectorAll('.dos-menu-bar__trigger');
          triggers.forEach((t, i) => {
            t.setAttribute('tabindex', i === prevIndex ? '0' : '-1');
          });
        }
        break;
      }

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (menuItem.disabled) return;

        if (hasSubmenu && menuItem.items) {
          openSubmenu(li, menuItem.items, [...path, menuItem.label]);
          const firstSubItem = li.querySelector(
            '.dos-menu-bar__submenu .dos-menu-bar__dropdown-trigger:not([aria-disabled="true"])'
          ) as HTMLElement;
          firstSubItem?.focus();
        } else {
          selectItem(menuItem, [...path, menuItem.label]);
        }
        break;

      case 'Escape': {
        e.preventDefault();
        closeMenu();
        // Focus the menu bar trigger
        const triggers = menuList.querySelectorAll('.dos-menu-bar__trigger');
        if (openMenuIndex !== -1 && triggers[openMenuIndex]) {
          (triggers[openMenuIndex] as HTMLElement).focus();
        }
        break;
      }

      case 'Home':
        e.preventDefault();
        allItems[0]?.focus();
        break;

      case 'End':
        e.preventDefault();
        allItems[allItems.length - 1]?.focus();
        break;

      default:
        // Type-ahead in dropdown
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          const key = e.key.toLowerCase();
          const dropdownItems = parent.querySelectorAll('.dos-menu-bar__dropdown-item');
          for (let i = 0; i < dropdownItems.length; i++) {
            const dropdownItem = dropdownItems[i];
            if (!dropdownItem) continue;
            const label = dropdownItem.querySelector('.dos-menu-bar__dropdown-label');
            if (label?.textContent?.toLowerCase().startsWith(key)) {
              const trigger = dropdownItem.querySelector('.dos-menu-bar__dropdown-trigger') as HTMLElement;
              if (trigger && !trigger.hasAttribute('aria-disabled')) {
                trigger.focus();
                break;
              }
            }
          }
        }
    }
  }

  // Focus a menu bar item
  function focusMenuBarItem(index: number): void {
    const triggers = menuList.querySelectorAll('.dos-menu-bar__trigger');
    
    // If a menu is open, switch to the new menu first
    if (openMenuIndex !== -1) {
      openMenu(index);
    }
    
    // Update tabindex for all triggers
    triggers.forEach((t, i) => {
      t.setAttribute('tabindex', i === index ? '0' : '-1');
    });
    
    // Focus the trigger
    (triggers[index] as HTMLElement)?.focus();
  }

  // Handle Alt+key shortcuts
  function handleGlobalKeydown(e: KeyboardEvent): void {
    // Track Alt key state
    if (e.key === 'Alt') {
      return;
    }

    // Alt+letter to open menu
    if (e.altKey && e.key.length === 1) {
      const key = e.key.toLowerCase();
      const index = items.findIndex(
        (item) =>
          !item.disabled &&
          (item.accessKey?.toLowerCase() === key ||
            item.label.charAt(0).toLowerCase() === key)
      );

      if (index !== -1) {
        e.preventDefault();
        openMenu(index);
      }
    }
  }

  function handleGlobalKeyup(e: KeyboardEvent): void {
    // Alt key released (no action needed currently)
    void e;
  }

  // Close menu when clicking outside
  function handleDocumentClick(e: MouseEvent): void {
    // Don't close if this is a programmatic open in the same event cycle
    if (isProgrammaticOpen) {
      return;
    }
    
    if (!menuBar.contains(e.target as Node)) {
      closeMenu();
    }
  }

  // Set up global event listeners
  document.addEventListener('keydown', handleGlobalKeydown);
  document.addEventListener('keyup', handleGlobalKeyup);
  document.addEventListener('click', handleDocumentClick);

  // Initial render
  render();

  // Build wrapper classes
  function buildMenuBarClasses(customClass?: string): string {
    const classes = ['dos-menu-bar'];
    if (customClass) {
      classes.push(customClass);
    }
    return classes.join(' ');
  }

  // Public API
  menuBar.openMenu = (label: string): void => {
    const index = items.findIndex((item) => item.label === label);
    if (index !== -1) {
      // Set flag to prevent document click from immediately closing the menu
      isProgrammaticOpen = true;
      openMenu(index);
      // Clear flag after current event cycle completes
      setTimeout(() => {
        isProgrammaticOpen = false;
      }, 0);
    }
  };

  menuBar.closeMenu = (): void => {
    closeMenu();
  };

  menuBar.getOpenMenu = (): string | null => {
    if (openMenuIndex === -1) return null;
    const item = items[openMenuIndex];
    return item ? item.label : null;
  };

  menuBar.setItems = (newItems: MenuBarItem[]): void => {
    items = [...newItems];
    closeMenu();
    render();
  };

  menuBar.setMenuDisabled = (label: string, disabled: boolean): void => {
    const item = items.find((i) => i.label === label);
    if (item) {
      item.disabled = disabled;
      render();
    }
  };

  menuBar.setItemDisabled = (path: string[], disabled: boolean): void => {
    if (path.length < 2) return;

    const menuLabel = path[0];
    const menu = items.find((i) => i.label === menuLabel);
    if (!menu) return;

    let currentItems: MenuItem[] = menu.items;
    for (let i = 1; i < path.length; i++) {
      const itemLabel = path[i];
      const item = currentItems.find((it) => it.label === itemLabel);
      if (!item) return;

      if (i === path.length - 1) {
        item.disabled = disabled;
        render();
        return;
      }

      if (item.items) {
        currentItems = item.items;
      } else {
        return;
      }
    }
  };

  menuBar.destroy = (): void => {
    document.removeEventListener('keydown', handleGlobalKeydown);
    document.removeEventListener('keyup', handleGlobalKeyup);
    document.removeEventListener('click', handleDocumentClick);
    menuBar.remove();
  };

  return menuBar;
}
