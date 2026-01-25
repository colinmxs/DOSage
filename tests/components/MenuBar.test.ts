/**
 * MenuBar Component Tests
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createMenuBar } from '../../src/components/MenuBar';
import type { MenuBarItem, MenuBarElement } from '../../src/components/MenuBar';

describe('MenuBar', () => {
  let container: HTMLDivElement;

  const basicItems: MenuBarItem[] = [
    {
      label: 'File',
      accessKey: 'F',
      items: [
        { label: 'New', shortcut: 'Ctrl+N', action: vi.fn() },
        { label: 'Open', shortcut: 'Ctrl+O', action: vi.fn() },
        { label: '', divider: true },
        { label: 'Exit', shortcut: 'Alt+F4', action: vi.fn() },
      ],
    },
    {
      label: 'Edit',
      accessKey: 'E',
      items: [
        { label: 'Cut', shortcut: 'Ctrl+X', action: vi.fn() },
        { label: 'Copy', shortcut: 'Ctrl+C', action: vi.fn() },
        { label: 'Paste', shortcut: 'Ctrl+V', action: vi.fn() },
      ],
    },
    {
      label: 'View',
      items: [{ label: 'Zoom In', action: vi.fn() }, { label: 'Zoom Out', action: vi.fn() }],
    },
  ];

  const nestedItems: MenuBarItem[] = [
    {
      label: 'File',
      items: [
        { label: 'New', action: vi.fn() },
        {
          label: 'Recent',
          items: [
            { label: 'Document 1', action: vi.fn() },
            { label: 'Document 2', action: vi.fn() },
          ],
        },
      ],
    },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up all menu bars to remove their document event listeners
    // Query from document.body to catch any stragglers not in our container
    const menuBars = document.body.querySelectorAll('.dos-menu-bar');
    menuBars.forEach((mb) => {
      // Cast to MenuBarElement and call destroy if it exists
      const menuBarEl = mb as MenuBarElement;
      if (typeof menuBarEl.destroy === 'function') {
        menuBarEl.destroy();
      }
    });
    container.remove();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      expect(menuBar.classList.contains('dos-menu-bar')).toBe(true);
      expect(menuBar.getAttribute('role')).toBe('menubar');
      expect(menuBar.getAttribute('aria-label')).toBe('Main menu');
    });

    it('renders all menu items', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const triggers = menuBar.querySelectorAll('.dos-menu-bar__trigger');
      expect(triggers.length).toBe(3);
      expect(triggers[0].textContent).toContain('File');
      expect(triggers[1].textContent).toContain('Edit');
      expect(triggers[2].textContent).toContain('View');
    });

    it('renders access key underlined', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const fileAccess = menuBar.querySelector('.dos-menu-bar__accesskey');
      expect(fileAccess).toBeTruthy();
      expect(fileAccess?.textContent).toBe('F');
    });

    it('renders with custom class name', () => {
      const menuBar = createMenuBar({ items: basicItems, className: 'custom-menu' });
      container.appendChild(menuBar);

      expect(menuBar.classList.contains('dos-menu-bar')).toBe(true);
      expect(menuBar.classList.contains('custom-menu')).toBe(true);
    });

    it('renders with custom ID', () => {
      const menuBar = createMenuBar({ items: basicItems, id: 'main-menu' });
      container.appendChild(menuBar);

      expect(menuBar.id).toBe('main-menu');
    });

    it('renders disabled menu items', () => {
      const items: MenuBarItem[] = [
        { label: 'File', items: [{ label: 'New' }], disabled: true },
      ];
      const menuBar = createMenuBar({ items });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger');
      expect(trigger?.classList.contains('dos-menu-bar__trigger--disabled')).toBe(true);
      expect(trigger?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('dropdown behavior', () => {
    it('opens dropdown on click', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const item = menuBar.querySelector('.dos-menu-bar__item');
      expect(item?.classList.contains('dos-menu-bar__item--active')).toBe(true);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      const dropdown = menuBar.querySelector('.dos-menu-bar__dropdown');
      expect(dropdown?.classList.contains('dos-menu-bar__dropdown--open')).toBe(true);
    });

    it('closes dropdown on second click', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click(); // Open
      trigger.click(); // Close

      const item = menuBar.querySelector('.dos-menu-bar__item');
      expect(item?.classList.contains('dos-menu-bar__item--active')).toBe(false);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('switches to new menu on hover when one is open', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const triggers = menuBar.querySelectorAll('.dos-menu-bar__trigger');

      // Open first menu
      (triggers[0] as HTMLElement).click();
      expect(menuBar.getOpenMenu()).toBe('File');

      // Hover over second menu
      (triggers[1] as HTMLElement).dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      expect(menuBar.getOpenMenu()).toBe('Edit');
    });

    it('closes dropdown on outside click', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      // Click outside
      document.body.click();

      expect(menuBar.getOpenMenu()).toBe(null);
    });

    it('closes dropdown on Escape key', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      expect(menuBar.getOpenMenu()).toBe(null);
    });

    it('does not open dropdown for disabled menu', () => {
      const items: MenuBarItem[] = [
        { label: 'File', items: [{ label: 'New' }], disabled: true },
      ];
      const menuBar = createMenuBar({ items });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      expect(menuBar.getOpenMenu()).toBe(null);
    });
  });

  describe('dropdown items', () => {
    it('renders dropdown items with label', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const dropdownItems = menuBar.querySelectorAll('.dos-menu-bar__dropdown-label');
      expect(dropdownItems[0].textContent).toBe('New');
      expect(dropdownItems[1].textContent).toBe('Open');
    });

    it('renders dropdown items with shortcuts', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const shortcuts = menuBar.querySelectorAll('.dos-menu-bar__dropdown-shortcut');
      expect(shortcuts[0].textContent).toBe('Ctrl+N');
      expect(shortcuts[1].textContent).toBe('Ctrl+O');
    });

    it('renders dropdown items with icons', () => {
      const items: MenuBarItem[] = [
        {
          label: 'File',
          items: [{ label: 'New', icon: '📄', action: vi.fn() }],
        },
      ];
      const menuBar = createMenuBar({ items });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const icon = menuBar.querySelector(
        '.dos-menu-bar__dropdown-icon:not(.dos-menu-bar__dropdown-icon--spacer)'
      );
      expect(icon?.textContent).toBe('📄');
    });

    it('renders dividers', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const dividers = menuBar.querySelectorAll('.dos-menu-bar__divider');
      expect(dividers.length).toBe(1);
      expect(dividers[0].getAttribute('role')).toBe('separator');
    });

    it('renders disabled dropdown items', () => {
      const items: MenuBarItem[] = [
        {
          label: 'File',
          items: [{ label: 'New', disabled: true }],
        },
      ];
      const menuBar = createMenuBar({ items });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const dropdownTrigger = menuBar.querySelector('.dos-menu-bar__dropdown-trigger');
      expect(dropdownTrigger?.classList.contains('dos-menu-bar__dropdown-trigger--disabled')).toBe(
        true
      );
      expect(dropdownTrigger?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('selection', () => {
    it('calls action when item is clicked', () => {
      const action = vi.fn();
      const items: MenuBarItem[] = [
        {
          label: 'File',
          items: [{ label: 'New', action }],
        },
      ];
      const menuBar = createMenuBar({ items });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const dropdownItem = menuBar.querySelector(
        '.dos-menu-bar__dropdown-trigger'
      ) as HTMLButtonElement;
      dropdownItem.click();

      expect(action).toHaveBeenCalled();
    });

    it('calls onSelect when item is selected', () => {
      const onSelect = vi.fn();
      const menuBar = createMenuBar({ items: basicItems, onSelect });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const dropdownItem = menuBar.querySelector(
        '.dos-menu-bar__dropdown-trigger'
      ) as HTMLButtonElement;
      dropdownItem.click();

      expect(onSelect).toHaveBeenCalled();
      const [item, path] = onSelect.mock.calls[0];
      expect(item.label).toBe('New');
      expect(path).toEqual(['File', 'New']);
    });

    it('closes dropdown after selection', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const dropdownItem = menuBar.querySelector(
        '.dos-menu-bar__dropdown-trigger'
      ) as HTMLButtonElement;
      dropdownItem.click();

      expect(menuBar.getOpenMenu()).toBe(null);
    });

    it('does not call action for disabled items', () => {
      const action = vi.fn();
      const items: MenuBarItem[] = [
        {
          label: 'File',
          items: [{ label: 'New', action, disabled: true }],
        },
      ];
      const menuBar = createMenuBar({ items });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const dropdownItem = menuBar.querySelector(
        '.dos-menu-bar__dropdown-trigger'
      ) as HTMLButtonElement;
      dropdownItem.click();

      expect(action).not.toHaveBeenCalled();
    });
  });

  describe('submenus', () => {
    it('renders submenu arrow for items with children', () => {
      const menuBar = createMenuBar({ items: nestedItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const arrows = menuBar.querySelectorAll('.dos-menu-bar__dropdown-arrow');
      expect(arrows.length).toBe(1);
      expect(arrows[0].textContent).toBe('▶');
    });

    it('opens submenu on hover', () => {
      const menuBar = createMenuBar({ items: nestedItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      // Find the "Recent" item
      const dropdownItems = menuBar.querySelectorAll('.dos-menu-bar__dropdown-item');
      const recentItem = Array.from(dropdownItems).find((item) =>
        item.querySelector('.dos-menu-bar__dropdown-label')?.textContent?.includes('Recent')
      );

      // Hover to open submenu
      const recentTrigger = recentItem?.querySelector(
        '.dos-menu-bar__dropdown-trigger'
      ) as HTMLElement;
      recentTrigger?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      const submenu = menuBar.querySelector('.dos-menu-bar__submenu');
      expect(submenu).toBeTruthy();
    });

    it('renders submenu items', () => {
      const menuBar = createMenuBar({ items: nestedItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      // Find and hover the "Recent" item
      const dropdownItems = menuBar.querySelectorAll('.dos-menu-bar__dropdown-item');
      const recentItem = Array.from(dropdownItems).find((item) =>
        item.querySelector('.dos-menu-bar__dropdown-label')?.textContent?.includes('Recent')
      );

      const recentTrigger = recentItem?.querySelector(
        '.dos-menu-bar__dropdown-trigger'
      ) as HTMLElement;
      recentTrigger?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      const submenu = menuBar.querySelector('.dos-menu-bar__submenu');
      const submenuLabels = submenu?.querySelectorAll('.dos-menu-bar__dropdown-label');
      expect(submenuLabels?.length).toBe(2);
      expect(submenuLabels?.[0].textContent).toBe('Document 1');
      expect(submenuLabels?.[1].textContent).toBe('Document 2');
    });
  });

  describe('keyboard navigation', () => {
    it('opens dropdown with Enter key', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.focus();
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(menuBar.getOpenMenu()).toBe('File');
    });

    it('opens dropdown with Space key', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.focus();
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(menuBar.getOpenMenu()).toBe('File');
    });

    it('opens dropdown with ArrowDown key', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.focus();
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(menuBar.getOpenMenu()).toBe('File');
    });

    it('navigates menu bar with ArrowLeft/Right', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const triggers = menuBar.querySelectorAll('.dos-menu-bar__trigger');

      // Focus first menu
      (triggers[0] as HTMLElement).focus();

      // Press ArrowRight
      (triggers[0] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );

      expect(document.activeElement).toBe(triggers[1]);

      // Press ArrowLeft
      (triggers[1] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
      );

      expect(document.activeElement).toBe(triggers[0]);
    });

    it('navigates dropdown with ArrowUp/Down', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const dropdownItems = menuBar.querySelectorAll(
        '.dos-menu-bar__dropdown-trigger:not([aria-disabled="true"])'
      );

      // Press ArrowDown
      (dropdownItems[0] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
      );

      expect(document.activeElement).toBe(dropdownItems[1]);

      // Press ArrowUp
      (dropdownItems[1] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
      );

      expect(document.activeElement).toBe(dropdownItems[0]);
    });

    it('selects item with Enter in dropdown', () => {
      const action = vi.fn();
      const items: MenuBarItem[] = [
        {
          label: 'File',
          items: [{ label: 'New', action }],
        },
      ];
      const menuBar = createMenuBar({ items });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const dropdownItem = menuBar.querySelector(
        '.dos-menu-bar__dropdown-trigger'
      ) as HTMLButtonElement;
      dropdownItem.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(action).toHaveBeenCalled();
    });

    it('closes dropdown with Escape from dropdown item', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const dropdownItem = menuBar.querySelector(
        '.dos-menu-bar__dropdown-trigger'
      ) as HTMLButtonElement;
      dropdownItem.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      expect(menuBar.getOpenMenu()).toBe(null);
    });

    it('navigates to first/last with Home/End', () => {
      // Use View menu which has only 2 simple items
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      // Open the View menu (index 2)
      menuBar.openMenu('View');

      const dropdown = menuBar.querySelectorAll('.dos-menu-bar__item')[2].querySelector('.dos-menu-bar__dropdown');
      const dropdownItems = dropdown?.querySelectorAll(
        '.dos-menu-bar__dropdown-trigger:not([aria-disabled="true"])'
      ) as NodeListOf<HTMLElement>;

      // Focus first item and press End
      dropdownItems[0].focus();
      dropdownItems[0].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'End', bubbles: true })
      );

      expect(document.activeElement).toBe(dropdownItems[dropdownItems.length - 1]);

      // Press Home
      dropdownItems[dropdownItems.length - 1].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Home', bubbles: true })
      );

      expect(document.activeElement).toBe(dropdownItems[0]);
    });

    it('type-ahead in menu bar jumps to matching menu', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const triggers = menuBar.querySelectorAll('.dos-menu-bar__trigger');
      (triggers[0] as HTMLElement).focus();

      // Type 'e' to jump to Edit
      (triggers[0] as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'e', bubbles: true })
      );

      expect(document.activeElement).toBe(triggers[1]);
    });
  });

  describe('alt+key shortcuts', () => {
    it('opens menu with Alt+accessKey', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'f', altKey: true, bubbles: true })
      );

      expect(menuBar.getOpenMenu()).toBe('File');
    });

    it('opens menu with Alt+first letter when no accessKey', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'v', altKey: true, bubbles: true })
      );

      expect(menuBar.getOpenMenu()).toBe('View');
    });
  });

  describe('callbacks', () => {
    it('calls onMenuOpen when menu opens', () => {
      const onMenuOpen = vi.fn();
      const menuBar = createMenuBar({ items: basicItems, onMenuOpen });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      expect(onMenuOpen).toHaveBeenCalledWith('File');
    });

    it('calls onMenuClose when menu closes', () => {
      const onMenuClose = vi.fn();
      const menuBar = createMenuBar({ items: basicItems, onMenuClose });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click(); // Open
      trigger.click(); // Close

      expect(onMenuClose).toHaveBeenCalledWith('File');
    });
  });

  describe('public API', () => {
    it('openMenu opens specific menu', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      menuBar.openMenu('Edit');

      expect(menuBar.getOpenMenu()).toBe('Edit');
    });

    it('closeMenu closes open menu', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      menuBar.openMenu('File');
      menuBar.closeMenu();

      expect(menuBar.getOpenMenu()).toBe(null);
    });

    it('getOpenMenu returns current menu', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      expect(menuBar.getOpenMenu()).toBe(null);

      menuBar.openMenu('File');
      expect(menuBar.getOpenMenu()).toBe('File');
    });

    it('setItems updates menu items', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const newItems: MenuBarItem[] = [
        { label: 'New Menu', items: [{ label: 'Item 1' }] },
      ];

      menuBar.setItems(newItems);

      const triggers = menuBar.querySelectorAll('.dos-menu-bar__trigger');
      expect(triggers.length).toBe(1);
      expect(triggers[0].textContent).toContain('New Menu');
    });

    it('setMenuDisabled disables a menu', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      menuBar.setMenuDisabled('File', true);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger');
      expect(trigger?.classList.contains('dos-menu-bar__trigger--disabled')).toBe(true);
    });

    it('setItemDisabled disables a menu item', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      menuBar.setItemDisabled(['File', 'New'], true);

      menuBar.openMenu('File');
      const dropdownItems = menuBar.querySelectorAll('.dos-menu-bar__dropdown-trigger');
      expect(dropdownItems[0].getAttribute('aria-disabled')).toBe('true');
    });

    it('destroy cleans up event listeners', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      menuBar.destroy();

      // Menu bar should be removed
      expect(container.contains(menuBar)).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes on menu bar', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      expect(menuBar.getAttribute('role')).toBe('menubar');
      expect(menuBar.getAttribute('aria-label')).toBe('Main menu');
    });

    it('has correct ARIA attributes on menu triggers', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger');
      expect(trigger?.getAttribute('role')).toBe('menuitem');
      expect(trigger?.getAttribute('aria-haspopup')).toBe('menu');
      expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    });

    it('has correct ARIA attributes on dropdown', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const dropdown = menuBar.querySelector('.dos-menu-bar__dropdown');
      expect(dropdown?.getAttribute('role')).toBe('menu');
      expect(dropdown?.getAttribute('aria-label')).toBe('File menu');
    });

    it('has correct ARIA attributes on dropdown items', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const dropdownTrigger = menuBar.querySelector('.dos-menu-bar__dropdown-trigger');
      expect(dropdownTrigger?.getAttribute('role')).toBe('menuitem');
    });

    it('first menu trigger has tabindex 0', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const triggers = menuBar.querySelectorAll('.dos-menu-bar__trigger');
      expect(triggers[0].getAttribute('tabindex')).toBe('0');
      expect(triggers[1].getAttribute('tabindex')).toBe('-1');
      expect(triggers[2].getAttribute('tabindex')).toBe('-1');
    });

    it('updates aria-expanded when menu opens/closes', () => {
      // Create a fresh menuBar
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      // Verify initial state
      expect(menuBar.getOpenMenu()).toBe(null);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      // Verify the menu item has the correct class before opening
      const menuItem = menuBar.querySelector('.dos-menu-bar__item');
      expect(menuItem?.classList.contains('dos-menu-bar__item--active')).toBe(false);

      // Open using the API
      menuBar.openMenu('File');

      // Check the state after opening
      expect(menuBar.getOpenMenu()).toBe('File');
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(menuItem?.classList.contains('dos-menu-bar__item--active')).toBe(true);

      // Close using the API
      menuBar.closeMenu();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(menuBar.getOpenMenu()).toBe(null);
    });
  });

  describe('highlight state management', () => {
    it('does not highlight first dropdown item when menu opens via click', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      // Click to open menu
      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      // No dropdown items should be highlighted (focused)
      const highlightedItems = menuBar.querySelectorAll('.dos-menu-bar__dropdown-trigger--highlighted');
      expect(highlightedItems.length).toBe(0);

      // The first dropdown item should NOT have focus since we clicked (mouse interaction)
      // Focus should remain on the trigger or be neutral
      const dropdown = menuBar.querySelector('.dos-menu-bar__dropdown--open');
      expect(dropdown).toBeTruthy();
    });

    it('focuses first dropdown item when menu opens via keyboard', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.focus();

      // Open via keyboard (ArrowDown)
      trigger.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
      );

      // Menu should be open
      expect(menuBar.getOpenMenu()).toBe('File');

      // First item should be focused for keyboard accessibility
      const firstDropdownItem = menuBar.querySelector(
        '.dos-menu-bar__dropdown-trigger:not([aria-disabled="true"])'
      ) as HTMLElement;
      expect(document.activeElement).toBe(firstDropdownItem);
    });

    it('only highlights one dropdown item at a time on hover', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      // Open menu
      const trigger = menuBar.querySelector('.dos-menu-bar__trigger') as HTMLButtonElement;
      trigger.click();

      const dropdownItems = menuBar.querySelectorAll('.dos-menu-bar__dropdown-trigger');

      // Hover over first item
      dropdownItems[0].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      expect(dropdownItems[0].classList.contains('dos-menu-bar__dropdown-trigger--highlighted')).toBe(true);

      // Hover over second item
      dropdownItems[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      expect(dropdownItems[0].classList.contains('dos-menu-bar__dropdown-trigger--highlighted')).toBe(false);
      expect(dropdownItems[1].classList.contains('dos-menu-bar__dropdown-trigger--highlighted')).toBe(true);

      // Hover over third item
      dropdownItems[2].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      expect(dropdownItems[1].classList.contains('dos-menu-bar__dropdown-trigger--highlighted')).toBe(false);
      expect(dropdownItems[2].classList.contains('dos-menu-bar__dropdown-trigger--highlighted')).toBe(true);

      // Only one item highlighted at a time
      const allHighlighted = menuBar.querySelectorAll('.dos-menu-bar__dropdown-trigger--highlighted');
      expect(allHighlighted.length).toBe(1);
    });

    it('clears highlight when menu switches to different menu bar item', () => {
      const menuBar = createMenuBar({ items: basicItems });
      container.appendChild(menuBar);

      // Open File menu
      const triggers = menuBar.querySelectorAll('.dos-menu-bar__trigger');
      (triggers[0] as HTMLElement).click();

      // Hover over first dropdown item to highlight it
      const fileDropdownItems = menuBar.querySelectorAll('.dos-menu-bar__dropdown-trigger');
      fileDropdownItems[0].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      // Switch to Edit menu
      (triggers[1] as HTMLElement).dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      // The new dropdown should have no highlighted items
      const editDropdown = menuBar.querySelectorAll('.dos-menu-bar__item')[1].querySelector('.dos-menu-bar__dropdown');
      const highlightedInEdit = editDropdown?.querySelectorAll('.dos-menu-bar__dropdown-trigger--highlighted');
      expect(highlightedInEdit?.length).toBe(0);
    });
  });
});
