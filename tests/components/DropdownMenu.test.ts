/**
 * DropdownMenu Component Tests
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createDropdownMenu } from '../../src/components/DropdownMenu';
import type { DropdownMenuItem } from '../../src/components/DropdownMenu';

describe('DropdownMenu', () => {
  let container: HTMLElement;
  let triggerButton: HTMLButtonElement;

  const sampleItems: DropdownMenuItem[] = [
    { label: 'New', shortcut: 'Ctrl+N', action: vi.fn() },
    { label: 'Open', shortcut: 'Ctrl+O', action: vi.fn() },
    { divider: true, label: '' },
    { label: 'Save', shortcut: 'Ctrl+S', action: vi.fn() },
    { label: 'Save As...', action: vi.fn() },
    { divider: true, label: '' },
    { label: 'Exit', shortcut: 'Alt+F4', action: vi.fn() },
  ];

  const itemsWithSubmenu: DropdownMenuItem[] = [
    { label: 'File', items: [
      { label: 'New', action: vi.fn() },
      { label: 'Open', action: vi.fn() },
    ]},
    { label: 'Export', items: [
      { label: 'As PDF', action: vi.fn() },
      { label: 'As HTML', action: vi.fn() },
    ]},
    { divider: true, label: '' },
    { label: 'Close', action: vi.fn() },
  ];

  const itemsWithIcons: DropdownMenuItem[] = [
    { label: 'Cut', icon: '✂', shortcut: 'Ctrl+X', action: vi.fn() },
    { label: 'Copy', icon: '📋', shortcut: 'Ctrl+C', action: vi.fn() },
    { label: 'Paste', icon: '📄', shortcut: 'Ctrl+V', action: vi.fn() },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    triggerButton = document.createElement('button');
    triggerButton.textContent = 'Menu';
    container.appendChild(triggerButton);
  });

  afterEach(() => {
    container.remove();
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders menu items correctly', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      const menuItems = dropdown.querySelectorAll('.dos-dropdown-menu__item');
      // 5 items + 2 dividers = 7 total, but dividers have different roles
      expect(menuItems.length).toBe(5); // Non-divider items
      
      const dividers = dropdown.querySelectorAll('.dos-dropdown-menu__divider');
      expect(dividers.length).toBe(2);
    });

    it('renders with correct ARIA attributes', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      expect(dropdown.getAttribute('role')).toBe('menu');
      expect(triggerButton.getAttribute('aria-haspopup')).toBe('menu');
      expect(triggerButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('renders items with icons', () => {
      const dropdown = createDropdownMenu({
        items: itemsWithIcons,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      const icons = dropdown.querySelectorAll('.dos-dropdown-menu__icon:not(.dos-dropdown-menu__icon--spacer)');
      expect(icons.length).toBe(3);
      expect(icons[0].textContent).toBe('✂');
      expect(icons[1].textContent).toBe('📋');
      expect(icons[2].textContent).toBe('📄');
    });

    it('renders items with shortcuts', () => {
      const dropdown = createDropdownMenu({
        items: itemsWithIcons,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      const shortcuts = dropdown.querySelectorAll('.dos-dropdown-menu__shortcut');
      expect(shortcuts.length).toBe(3);
      expect(shortcuts[0].textContent).toBe('Ctrl+X');
      expect(shortcuts[1].textContent).toBe('Ctrl+C');
      expect(shortcuts[2].textContent).toBe('Ctrl+V');
    });

    it('renders dividers correctly', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      const dividers = dropdown.querySelectorAll('.dos-dropdown-menu__divider');
      expect(dividers.length).toBe(2);
      dividers.forEach((divider) => {
        expect(divider.getAttribute('role')).toBe('separator');
      });
    });

    it('renders items with submenus correctly', () => {
      const dropdown = createDropdownMenu({
        items: itemsWithSubmenu,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      const submenuTriggers = dropdown.querySelectorAll('[aria-haspopup="menu"]');
      expect(submenuTriggers.length).toBe(2); // File and Export
      
      const arrows = dropdown.querySelectorAll('.dos-dropdown-menu__submenu-arrow');
      expect(arrows.length).toBe(2);
    });

    it('renders disabled items correctly', () => {
      const items: DropdownMenuItem[] = [
        { label: 'Enabled', action: vi.fn() },
        { label: 'Disabled', disabled: true, action: vi.fn() },
      ];

      const dropdown = createDropdownMenu({
        items,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      const triggers = dropdown.querySelectorAll('.dos-dropdown-menu__trigger');
      expect(triggers[0].getAttribute('aria-disabled')).toBeNull();
      expect(triggers[1].getAttribute('aria-disabled')).toBe('true');
      expect(triggers[1].classList.contains('dos-dropdown-menu__trigger--disabled')).toBe(true);
    });

    it('applies custom className', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
        className: 'custom-dropdown',
      });

      expect(dropdown.classList.contains('custom-dropdown')).toBe(true);
    });

    it('applies custom id', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
        id: 'my-dropdown',
      });

      expect(dropdown.id).toBe('my-dropdown');
    });
  });

  describe('opening and closing', () => {
    it('opens dropdown on trigger click', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      expect(dropdown.isOpen()).toBe(false);
      
      triggerButton.click();
      
      expect(dropdown.isOpen()).toBe(true);
      expect(dropdown.classList.contains('dos-dropdown-menu--open')).toBe(true);
      expect(triggerButton.getAttribute('aria-expanded')).toBe('true');
    });

    it('closes dropdown on second trigger click', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      triggerButton.click(); // Open
      expect(dropdown.isOpen()).toBe(true);
      
      triggerButton.click(); // Close
      expect(dropdown.isOpen()).toBe(false);
    });

    it('closes dropdown on outside click', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      triggerButton.click();
      expect(dropdown.isOpen()).toBe(true);
      
      // Click outside
      document.body.click();
      
      expect(dropdown.isOpen()).toBe(false);
    });

    it('closes dropdown on Escape key', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      triggerButton.click();
      expect(dropdown.isOpen()).toBe(true);
      
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      
      expect(dropdown.isOpen()).toBe(false);
    });

    it('opens with programmatic open() method', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      expect(dropdown.isOpen()).toBe(false);
      
      dropdown.open();
      
      expect(dropdown.isOpen()).toBe(true);
    });

    it('closes with programmatic close() method', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      expect(dropdown.isOpen()).toBe(true);
      
      dropdown.close();
      
      expect(dropdown.isOpen()).toBe(false);
    });

    it('toggles with programmatic toggle() method', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      expect(dropdown.isOpen()).toBe(false);
      
      dropdown.toggle();
      expect(dropdown.isOpen()).toBe(true);
      
      dropdown.toggle();
      expect(dropdown.isOpen()).toBe(false);
    });

    it('calls onOpen callback when opening', () => {
      const onOpen = vi.fn();
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
        onOpen,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('calls onClose callback when closing', () => {
      const onClose = vi.fn();
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
        onClose,
      });
      container.appendChild(dropdown);

      dropdown.open();
      dropdown.close();
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('item selection', () => {
    it('calls item action on click', () => {
      const actionFn = vi.fn();
      const items: DropdownMenuItem[] = [
        { label: 'Test Item', action: actionFn },
      ];

      const dropdown = createDropdownMenu({
        items,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const itemTrigger = dropdown.querySelector('.dos-dropdown-menu__trigger') as HTMLElement;
      itemTrigger.click();
      
      expect(actionFn).toHaveBeenCalledTimes(1);
    });

    it('calls onSelect callback on item click', () => {
      const onSelect = vi.fn();
      const items: DropdownMenuItem[] = [
        { label: 'Test Item', action: vi.fn() },
      ];

      const dropdown = createDropdownMenu({
        items,
        trigger: triggerButton,
        onSelect,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const itemTrigger = dropdown.querySelector('.dos-dropdown-menu__trigger') as HTMLElement;
      itemTrigger.click();
      
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Test Item' }),
        ['Test Item']
      );
    });

    it('does not call action on disabled item click', () => {
      const actionFn = vi.fn();
      const items: DropdownMenuItem[] = [
        { label: 'Disabled', disabled: true, action: actionFn },
      ];

      const dropdown = createDropdownMenu({
        items,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const itemTrigger = dropdown.querySelector('.dos-dropdown-menu__trigger') as HTMLElement;
      itemTrigger.click();
      
      expect(actionFn).not.toHaveBeenCalled();
    });

    it('closes dropdown after item selection', () => {
      const items: DropdownMenuItem[] = [
        { label: 'Test Item', action: vi.fn() },
      ];

      const dropdown = createDropdownMenu({
        items,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      expect(dropdown.isOpen()).toBe(true);
      
      const itemTrigger = dropdown.querySelector('.dos-dropdown-menu__trigger') as HTMLElement;
      itemTrigger.click();
      
      expect(dropdown.isOpen()).toBe(false);
    });
  });

  describe('keyboard navigation', () => {
    it('opens on Enter key on trigger', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      triggerButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      
      expect(dropdown.isOpen()).toBe(true);
    });

    it('opens on Space key on trigger', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      triggerButton.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      
      expect(dropdown.isOpen()).toBe(true);
    });

    it('opens on ArrowDown key on trigger', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      triggerButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      
      expect(dropdown.isOpen()).toBe(true);
    });

    it('navigates items with ArrowDown', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const items = dropdown.querySelectorAll('.dos-dropdown-menu__trigger:not(.dos-dropdown-menu__trigger--disabled)');
      (items[0] as HTMLElement).focus();
      
      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      
      expect(document.activeElement).toBe(items[1]);
    });

    it('navigates items with ArrowUp', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const items = dropdown.querySelectorAll('.dos-dropdown-menu__trigger:not(.dos-dropdown-menu__trigger--disabled)');
      (items[1] as HTMLElement).focus();
      
      items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      
      expect(document.activeElement).toBe(items[0]);
    });

    it('wraps navigation at the end', () => {
      const items: DropdownMenuItem[] = [
        { label: 'First', action: vi.fn() },
        { label: 'Last', action: vi.fn() },
      ];

      const dropdown = createDropdownMenu({
        items,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const triggers = dropdown.querySelectorAll('.dos-dropdown-menu__trigger');
      (triggers[1] as HTMLElement).focus();
      
      triggers[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      
      expect(document.activeElement).toBe(triggers[0]);
    });

    it('wraps navigation at the beginning', () => {
      const items: DropdownMenuItem[] = [
        { label: 'First', action: vi.fn() },
        { label: 'Last', action: vi.fn() },
      ];

      const dropdown = createDropdownMenu({
        items,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const triggers = dropdown.querySelectorAll('.dos-dropdown-menu__trigger');
      (triggers[0] as HTMLElement).focus();
      
      triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      
      expect(document.activeElement).toBe(triggers[1]);
    });

    it('goes to first item on Home', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const items = dropdown.querySelectorAll('.dos-dropdown-menu__trigger');
      (items[2] as HTMLElement).focus();
      
      items[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      
      expect(document.activeElement).toBe(items[0]);
    });

    it('goes to last item on End', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const items = dropdown.querySelectorAll('.dos-dropdown-menu__trigger');
      (items[0] as HTMLElement).focus();
      
      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      
      const lastItem = items[items.length - 1];
      expect(document.activeElement).toBe(lastItem);
    });

    it('activates item on Enter', () => {
      const actionFn = vi.fn();
      const items: DropdownMenuItem[] = [
        { label: 'Test', action: actionFn },
      ];

      const dropdown = createDropdownMenu({
        items,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const itemTrigger = dropdown.querySelector('.dos-dropdown-menu__trigger') as HTMLElement;
      itemTrigger.focus();
      itemTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      
      expect(actionFn).toHaveBeenCalledTimes(1);
    });

    it('activates item on Space', () => {
      const actionFn = vi.fn();
      const items: DropdownMenuItem[] = [
        { label: 'Test', action: actionFn },
      ];

      const dropdown = createDropdownMenu({
        items,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const itemTrigger = dropdown.querySelector('.dos-dropdown-menu__trigger') as HTMLElement;
      itemTrigger.focus();
      itemTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      
      expect(actionFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('submenus', () => {
    it('opens submenu on hover', async () => {
      const dropdown = createDropdownMenu({
        items: itemsWithSubmenu,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const submenuTrigger = dropdown.querySelector('[aria-haspopup="menu"]') as HTMLElement;
      submenuTrigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      
      const submenu = dropdown.querySelector('.dos-dropdown-menu__submenu');
      expect(submenu).toBeTruthy();
    });

    it('opens submenu on ArrowRight', () => {
      const dropdown = createDropdownMenu({
        items: itemsWithSubmenu,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const submenuTrigger = dropdown.querySelector('[aria-haspopup="menu"]') as HTMLElement;
      submenuTrigger.focus();
      submenuTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      
      const submenu = dropdown.querySelector('.dos-dropdown-menu__submenu');
      expect(submenu).toBeTruthy();
    });

    it('closes submenu on ArrowLeft', () => {
      const dropdown = createDropdownMenu({
        items: itemsWithSubmenu,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      // Open submenu
      const submenuTrigger = dropdown.querySelector('[aria-haspopup="menu"]') as HTMLElement;
      submenuTrigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      
      let submenu = dropdown.querySelector('.dos-dropdown-menu__submenu');
      expect(submenu).toBeTruthy();
      
      // Focus submenu item
      const submenuItem = submenu!.querySelector('.dos-dropdown-menu__trigger') as HTMLElement;
      submenuItem.focus();
      
      // Close submenu with ArrowLeft
      submenuItem.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      
      submenu = dropdown.querySelector('.dos-dropdown-menu__submenu');
      expect(submenu).toBeNull();
    });

    it('renders submenu items correctly', () => {
      const dropdown = createDropdownMenu({
        items: itemsWithSubmenu,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      // Open submenu
      const submenuTrigger = dropdown.querySelector('[aria-haspopup="menu"]') as HTMLElement;
      submenuTrigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      
      const submenu = dropdown.querySelector('.dos-dropdown-menu__submenu');
      const submenuItems = submenu!.querySelectorAll('.dos-dropdown-menu__item');
      
      expect(submenuItems.length).toBe(2); // New and Open
    });

    it('calls action for submenu item', () => {
      const dropdown = createDropdownMenu({
        items: itemsWithSubmenu,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      // Open submenu
      const submenuTrigger = dropdown.querySelector('[aria-haspopup="menu"]') as HTMLElement;
      submenuTrigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      
      const submenu = dropdown.querySelector('.dos-dropdown-menu__submenu');
      const submenuItem = submenu!.querySelector('.dos-dropdown-menu__trigger') as HTMLElement;
      submenuItem.click();
      
      // The item's action should have been called
      expect(itemsWithSubmenu[0].items![0].action).toHaveBeenCalled();
    });

    it('passes correct path for submenu items', () => {
      const onSelect = vi.fn();
      const dropdown = createDropdownMenu({
        items: itemsWithSubmenu,
        trigger: triggerButton,
        onSelect,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      // Open submenu
      const submenuTrigger = dropdown.querySelector('[aria-haspopup="menu"]') as HTMLElement;
      submenuTrigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      
      const submenu = dropdown.querySelector('.dos-dropdown-menu__submenu');
      const submenuItem = submenu!.querySelector('.dos-dropdown-menu__trigger') as HTMLElement;
      submenuItem.click();
      
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'New' }),
        ['File', 'New']
      );
    });
  });

  describe('public API methods', () => {
    it('setItems updates menu items', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      const newItems: DropdownMenuItem[] = [
        { label: 'Item A', action: vi.fn() },
        { label: 'Item B', action: vi.fn() },
      ];

      dropdown.setItems(newItems);
      
      const menuItems = dropdown.querySelectorAll('.dos-dropdown-menu__item');
      expect(menuItems.length).toBe(2);
      expect(menuItems[0].querySelector('.dos-dropdown-menu__label')?.textContent).toBe('Item A');
    });

    it('setPosition updates dropdown position', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
        position: 'bottom-start',
      });
      container.appendChild(dropdown);

      expect(dropdown.classList.contains('dos-dropdown-menu--bottom-start')).toBe(true);
      
      dropdown.setPosition('bottom-end');
      
      expect(dropdown.classList.contains('dos-dropdown-menu--bottom-start')).toBe(false);
      expect(dropdown.classList.contains('dos-dropdown-menu--bottom-end')).toBe(true);
    });

    it('setItemDisabled disables an item', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      const firstItem = dropdown.querySelector('.dos-dropdown-menu__trigger');
      expect(firstItem?.getAttribute('aria-disabled')).toBeNull();
      
      dropdown.setItemDisabled(['New'], true);
      
      const updatedFirstItem = dropdown.querySelector('.dos-dropdown-menu__trigger');
      expect(updatedFirstItem?.getAttribute('aria-disabled')).toBe('true');
    });

    it('destroy removes event listeners and element', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.destroy();
      
      expect(dropdown.parentElement).toBeNull();
      expect(triggerButton.getAttribute('aria-haspopup')).toBeNull();
      expect(triggerButton.getAttribute('aria-expanded')).toBeNull();
    });
  });

  describe('position variants', () => {
    it('applies bottom-start position class by default', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });

      expect(dropdown.classList.contains('dos-dropdown-menu--bottom-start')).toBe(true);
    });

    it('applies bottom position class', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
        position: 'bottom',
      });

      expect(dropdown.classList.contains('dos-dropdown-menu--bottom')).toBe(true);
    });

    it('applies bottom-end position class', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
        position: 'bottom-end',
      });

      expect(dropdown.classList.contains('dos-dropdown-menu--bottom-end')).toBe(true);
    });

    it('applies right position class', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
        position: 'right',
      });

      expect(dropdown.classList.contains('dos-dropdown-menu--right')).toBe(true);
    });

    it('applies right-start position class', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
        position: 'right-start',
      });

      expect(dropdown.classList.contains('dos-dropdown-menu--right-start')).toBe(true);
    });

    it('applies right-end position class', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
        position: 'right-end',
      });

      expect(dropdown.classList.contains('dos-dropdown-menu--right-end')).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA roles', () => {
      const dropdown = createDropdownMenu({
        items: sampleItems,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      expect(dropdown.getAttribute('role')).toBe('menu');
      
      const menuItems = dropdown.querySelectorAll('.dos-dropdown-menu__trigger');
      menuItems.forEach((item) => {
        expect(item.getAttribute('role')).toBe('menuitem');
      });
      
      const dividers = dropdown.querySelectorAll('.dos-dropdown-menu__divider');
      dividers.forEach((divider) => {
        expect(divider.getAttribute('role')).toBe('separator');
      });
    });

    it('has aria-haspopup on items with submenus', () => {
      const dropdown = createDropdownMenu({
        items: itemsWithSubmenu,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      const submenuTriggers = dropdown.querySelectorAll('[aria-haspopup="menu"]');
      expect(submenuTriggers.length).toBe(2);
    });

    it('has aria-expanded on submenu triggers', () => {
      const dropdown = createDropdownMenu({
        items: itemsWithSubmenu,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const submenuTrigger = dropdown.querySelector('[aria-haspopup="menu"]') as HTMLElement;
      expect(submenuTrigger.getAttribute('aria-expanded')).toBe('false');
      
      // Open submenu
      submenuTrigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      expect(submenuTrigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('has aria-disabled on disabled items', () => {
      const items: DropdownMenuItem[] = [
        { label: 'Disabled', disabled: true, action: vi.fn() },
      ];

      const dropdown = createDropdownMenu({
        items,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      const item = dropdown.querySelector('.dos-dropdown-menu__trigger');
      expect(item?.getAttribute('aria-disabled')).toBe('true');
    });

    it('icons and shortcuts are hidden from screen readers', () => {
      const dropdown = createDropdownMenu({
        items: itemsWithIcons,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      const icons = dropdown.querySelectorAll('.dos-dropdown-menu__icon');
      icons.forEach((icon) => {
        expect(icon.getAttribute('aria-hidden')).toBe('true');
      });
      
      const shortcuts = dropdown.querySelectorAll('.dos-dropdown-menu__shortcut');
      shortcuts.forEach((shortcut) => {
        expect(shortcut.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });

  describe('type-ahead', () => {
    it('focuses item starting with typed character', () => {
      const items: DropdownMenuItem[] = [
        { label: 'Apple', action: vi.fn() },
        { label: 'Banana', action: vi.fn() },
        { label: 'Cherry', action: vi.fn() },
      ];

      const dropdown = createDropdownMenu({
        items,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const triggers = dropdown.querySelectorAll('.dos-dropdown-menu__trigger');
      (triggers[0] as HTMLElement).focus();
      
      // Type 'c' to jump to Cherry
      triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'c', bubbles: true }));
      
      expect(document.activeElement).toBe(triggers[2]);
    });

    it('cycles through items starting with same character', () => {
      const items: DropdownMenuItem[] = [
        { label: 'Apple', action: vi.fn() },
        { label: 'Apricot', action: vi.fn() },
        { label: 'Banana', action: vi.fn() },
      ];

      const dropdown = createDropdownMenu({
        items,
        trigger: triggerButton,
      });
      container.appendChild(dropdown);

      dropdown.open();
      
      const triggers = dropdown.querySelectorAll('.dos-dropdown-menu__trigger');
      (triggers[0] as HTMLElement).focus();
      
      // Type 'a' to jump to Apricot (next 'A' item)
      triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      
      expect(document.activeElement).toBe(triggers[1]);
    });
  });
});
