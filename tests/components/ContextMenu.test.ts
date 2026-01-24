/**
 * ContextMenu Component Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createContextMenu } from '../../src/components/ContextMenu';
import type { DropdownMenuItem } from '../../src/components/ContextMenu';

describe('ContextMenu', () => {
  let container: HTMLElement;

  const basicItems: DropdownMenuItem[] = [
    { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X', action: vi.fn() },
    { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', action: vi.fn() },
    { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', action: vi.fn() },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('rendering', () => {
    it('renders menu items correctly', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const items = menu.querySelectorAll('.dos-context-menu__item');
      expect(items).toHaveLength(3);
      expect(items[0].textContent).toContain('Cut');
      expect(items[1].textContent).toContain('Copy');
      expect(items[2].textContent).toContain('Paste');
    });

    it('renders with correct ARIA attributes', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);

      expect(menu.getAttribute('role')).toBe('menu');
      expect(menu.getAttribute('aria-label')).toBe('Context menu');
    });

    it('renders items with shortcuts', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const shortcuts = menu.querySelectorAll('.dos-context-menu__shortcut');
      expect(shortcuts).toHaveLength(3);
      expect(shortcuts[0].textContent).toBe('Ctrl+X');
    });

    it('renders items with icons', () => {
      const items: DropdownMenuItem[] = [
        { id: 'cut', label: 'Cut', icon: '✂' },
        { id: 'copy', label: 'Copy', icon: '📋' },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const icons = menu.querySelectorAll('.dos-context-menu__icon');
      expect(icons).toHaveLength(2);
      expect(icons[0].textContent).toBe('✂');
      expect(icons[0].getAttribute('aria-hidden')).toBe('true');
    });

    it('renders dividers correctly', () => {
      const items: DropdownMenuItem[] = [
        { id: 'cut', label: 'Cut' },
        { divider: true },
        { id: 'paste', label: 'Paste' },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const dividers = menu.querySelectorAll('.dos-context-menu__divider');
      expect(dividers).toHaveLength(1);
      expect(dividers[0].getAttribute('role')).toBe('separator');
    });

    it('renders disabled items correctly', () => {
      const items: DropdownMenuItem[] = [
        { id: 'cut', label: 'Cut', disabled: true },
        { id: 'copy', label: 'Copy' },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const cutItem = menu.querySelector('[data-item-id*="cut"]');
      expect(cutItem?.classList.contains('dos-context-menu__item--disabled')).toBe(true);
      expect(cutItem?.getAttribute('aria-disabled')).toBe('true');
    });

    it('applies custom className', () => {
      const menu = createContextMenu({
        items: basicItems,
        className: 'custom-menu',
      });
      container.appendChild(menu);

      expect(menu.classList.contains('custom-menu')).toBe(true);
    });

    it('applies custom id', () => {
      const menu = createContextMenu({
        items: basicItems,
        id: 'my-context-menu',
      });
      container.appendChild(menu);

      expect(menu.id).toBe('my-context-menu');
    });
  });

  describe('opening and closing', () => {
    it('is hidden by default', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);

      expect(menu.classList.contains('dos-context-menu--open')).toBe(false);
      expect(menu.isOpen()).toBe(false);
    });

    it('opens with programmatic open() method', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);

      menu.open({ x: 100, y: 200 });

      expect(menu.classList.contains('dos-context-menu--open')).toBe(true);
      expect(menu.isOpen()).toBe(true);
    });

    it('positions at specified coordinates', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);

      menu.open({ x: 150, y: 250 });

      expect(menu.style.left).toBe('150px');
      expect(menu.style.top).toBe('250px');
    });

    it('closes with programmatic close() method', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      menu.close();

      expect(menu.classList.contains('dos-context-menu--open')).toBe(false);
      expect(menu.isOpen()).toBe(false);
    });

    it('opens on right-click of target element', () => {
      const target = document.createElement('div');
      target.id = 'target';
      container.appendChild(target);

      const menu = createContextMenu({
        items: basicItems,
        target: target,
      });
      container.appendChild(menu);

      const contextMenuEvent = new MouseEvent('contextmenu', {
        clientX: 200,
        clientY: 300,
        bubbles: true,
      });
      target.dispatchEvent(contextMenuEvent);

      expect(menu.isOpen()).toBe(true);
    });

    it('opens on right-click with selector target', () => {
      const target = document.createElement('div');
      target.id = 'clickable';
      container.appendChild(target);

      const menu = createContextMenu({
        items: basicItems,
        target: '#clickable',
      });
      container.appendChild(menu);

      const contextMenuEvent = new MouseEvent('contextmenu', {
        clientX: 200,
        clientY: 300,
        bubbles: true,
      });
      target.dispatchEvent(contextMenuEvent);

      expect(menu.isOpen()).toBe(true);
    });

    it('closes on outside click', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const outsideElement = document.createElement('div');
      container.appendChild(outsideElement);
      outsideElement.click();

      expect(menu.isOpen()).toBe(false);
    });

    it('closes on Escape key', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });
      document.dispatchEvent(escapeEvent);

      expect(menu.isOpen()).toBe(false);
    });

    it('calls onOpen callback when opening', () => {
      const onOpen = vi.fn();
      const menu = createContextMenu({
        items: basicItems,
        onOpen,
      });
      container.appendChild(menu);

      menu.open({ x: 100, y: 200 });

      expect(onOpen).toHaveBeenCalledWith({ x: 100, y: 200 });
    });

    it('calls onClose callback when closing', () => {
      const onClose = vi.fn();
      const menu = createContextMenu({
        items: basicItems,
        onClose,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      menu.close();

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('item selection', () => {
    it('calls item action on click', () => {
      const action = vi.fn();
      const items: DropdownMenuItem[] = [
        { id: 'test', label: 'Test', action },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const item = menu.querySelector('.dos-context-menu__item') as HTMLElement;
      item.click();

      expect(action).toHaveBeenCalled();
    });

    it('calls onSelect callback on item click', () => {
      const onSelect = vi.fn();
      const items: DropdownMenuItem[] = [
        { id: 'test', label: 'Test Item' },
      ];

      const menu = createContextMenu({ items, onSelect });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const item = menu.querySelector('.dos-context-menu__item') as HTMLElement;
      item.click();

      expect(onSelect).toHaveBeenCalled();
      expect(onSelect.mock.calls[0][0].label).toBe('Test Item');
    });

    it('does not call action on disabled item click', () => {
      const action = vi.fn();
      const items: DropdownMenuItem[] = [
        { id: 'test', label: 'Test', disabled: true, action },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const item = menu.querySelector('.dos-context-menu__item') as HTMLElement;
      item.click();

      expect(action).not.toHaveBeenCalled();
    });

    it('closes menu after item selection', () => {
      const items: DropdownMenuItem[] = [
        { id: 'test', label: 'Test', action: vi.fn() },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const item = menu.querySelector('.dos-context-menu__item') as HTMLElement;
      item.click();

      expect(menu.isOpen()).toBe(false);
    });
  });

  describe('keyboard navigation', () => {
    it('opens on Shift+F10 on target element', () => {
      const target = document.createElement('div');
      container.appendChild(target);

      const menu = createContextMenu({
        items: basicItems,
        target: target,
      });
      container.appendChild(menu);

      const keyEvent = new KeyboardEvent('keydown', {
        key: 'F10',
        shiftKey: true,
        bubbles: true,
      });
      target.dispatchEvent(keyEvent);

      expect(menu.isOpen()).toBe(true);
    });

    it('navigates items with ArrowDown', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const items = menu.querySelectorAll('.dos-context-menu__item');
      (items[0] as HTMLElement).focus();

      const downEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      });
      items[0].dispatchEvent(downEvent);

      expect(document.activeElement).toBe(items[1]);
    });

    it('navigates items with ArrowUp', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const items = menu.querySelectorAll('.dos-context-menu__item');
      (items[1] as HTMLElement).focus();

      const upEvent = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
      });
      items[1].dispatchEvent(upEvent);

      expect(document.activeElement).toBe(items[0]);
    });

    it('wraps navigation at the end', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const items = menu.querySelectorAll('.dos-context-menu__item');
      (items[2] as HTMLElement).focus();

      const downEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      });
      items[2].dispatchEvent(downEvent);

      expect(document.activeElement).toBe(items[0]);
    });

    it('goes to first item on Home', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const items = menu.querySelectorAll('.dos-context-menu__item');
      (items[2] as HTMLElement).focus();

      const homeEvent = new KeyboardEvent('keydown', {
        key: 'Home',
        bubbles: true,
      });
      items[2].dispatchEvent(homeEvent);

      expect(document.activeElement).toBe(items[0]);
    });

    it('goes to last item on End', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const items = menu.querySelectorAll('.dos-context-menu__item');
      (items[0] as HTMLElement).focus();

      const endEvent = new KeyboardEvent('keydown', {
        key: 'End',
        bubbles: true,
      });
      items[0].dispatchEvent(endEvent);

      expect(document.activeElement).toBe(items[2]);
    });

    it('activates item on Enter', () => {
      const action = vi.fn();
      const items: DropdownMenuItem[] = [
        { id: 'test', label: 'Test', action },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const item = menu.querySelector('.dos-context-menu__item') as HTMLElement;
      item.focus();

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      item.dispatchEvent(enterEvent);

      expect(action).toHaveBeenCalled();
    });

    it('activates item on Space', () => {
      const action = vi.fn();
      const items: DropdownMenuItem[] = [
        { id: 'test', label: 'Test', action },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const item = menu.querySelector('.dos-context-menu__item') as HTMLElement;
      item.focus();

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
      });
      item.dispatchEvent(spaceEvent);

      expect(action).toHaveBeenCalled();
    });
  });

  describe('submenus', () => {
    it('renders submenu items correctly', () => {
      const items: DropdownMenuItem[] = [
        {
          id: 'format',
          label: 'Format',
          items: [
            { id: 'bold', label: 'Bold' },
            { id: 'italic', label: 'Italic' },
          ],
        },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const parentItem = menu.querySelector('.dos-context-menu__item');
      expect(parentItem?.querySelector('.dos-context-menu__submenu-arrow')).toBeTruthy();
      expect(parentItem?.getAttribute('aria-haspopup')).toBe('true');
    });

    it('opens submenu on hover', async () => {
      const items: DropdownMenuItem[] = [
        {
          id: 'format',
          label: 'Format',
          items: [
            { id: 'bold', label: 'Bold' },
          ],
        },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const parentItem = menu.querySelector('.dos-context-menu__item') as HTMLElement;
      const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
      parentItem.dispatchEvent(mouseEnterEvent);

      const submenu = parentItem.querySelector('.dos-context-menu__submenu');
      expect(submenu?.classList.contains('dos-context-menu__submenu--open')).toBe(true);
    });

    it('opens submenu on ArrowRight', () => {
      const items: DropdownMenuItem[] = [
        {
          id: 'format',
          label: 'Format',
          items: [
            { id: 'bold', label: 'Bold' },
          ],
        },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const parentItem = menu.querySelector('.dos-context-menu__item') as HTMLElement;
      parentItem.focus();

      const rightEvent = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
      });
      parentItem.dispatchEvent(rightEvent);

      const submenu = parentItem.querySelector('.dos-context-menu__submenu');
      expect(submenu?.classList.contains('dos-context-menu__submenu--open')).toBe(true);
    });

    it('closes submenu on ArrowLeft', () => {
      const items: DropdownMenuItem[] = [
        {
          id: 'format',
          label: 'Format',
          items: [
            { id: 'bold', label: 'Bold' },
          ],
        },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      // Open submenu first
      const parentItem = menu.querySelector('.dos-context-menu__item') as HTMLElement;
      parentItem.focus();
      const rightEvent = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
      });
      parentItem.dispatchEvent(rightEvent);

      // Now close with ArrowLeft
      const submenu = parentItem.querySelector('.dos-context-menu__submenu') as HTMLElement;
      const submenuItem = submenu.querySelector('.dos-context-menu__item') as HTMLElement;
      submenuItem.focus();

      const leftEvent = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
      });
      submenuItem.dispatchEvent(leftEvent);

      expect(submenu.classList.contains('dos-context-menu__submenu--open')).toBe(false);
    });
  });

  describe('public API methods', () => {
    it('setItems updates menu items', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      menu.setItems([
        { id: 'new1', label: 'New Item 1' },
        { id: 'new2', label: 'New Item 2' },
      ]);

      const items = menu.querySelectorAll('.dos-context-menu__item');
      expect(items).toHaveLength(2);
      expect(items[0].textContent).toContain('New Item 1');
    });

    it('setItemDisabled disables an item', () => {
      const items: DropdownMenuItem[] = [
        { id: 'test', label: 'Test' },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      menu.setItemDisabled('test', true);

      const item = menu.querySelector('[data-item-id*="test"]');
      expect(item?.classList.contains('dos-context-menu__item--disabled')).toBe(true);
    });

    it('attach attaches to new target', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);

      const newTarget = document.createElement('div');
      container.appendChild(newTarget);

      menu.attach(newTarget);

      const contextMenuEvent = new MouseEvent('contextmenu', {
        clientX: 200,
        clientY: 300,
        bubbles: true,
      });
      newTarget.dispatchEvent(contextMenuEvent);

      expect(menu.isOpen()).toBe(true);
    });

    it('detach removes target listeners', () => {
      const target = document.createElement('div');
      container.appendChild(target);

      const menu = createContextMenu({
        items: basicItems,
        target: target,
      });
      container.appendChild(menu);

      menu.detach();

      const contextMenuEvent = new MouseEvent('contextmenu', {
        clientX: 200,
        clientY: 300,
        bubbles: true,
      });
      target.dispatchEvent(contextMenuEvent);

      expect(menu.isOpen()).toBe(false);
    });

    it('destroy removes element and listeners', () => {
      const target = document.createElement('div');
      container.appendChild(target);

      const menu = createContextMenu({
        items: basicItems,
        target: target,
      });
      container.appendChild(menu);

      menu.destroy();

      expect(document.querySelector('.dos-context-menu')).toBeNull();
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA roles', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      expect(menu.getAttribute('role')).toBe('menu');
      
      const items = menu.querySelectorAll('.dos-context-menu__item');
      items.forEach((item) => {
        expect(item.getAttribute('role')).toBe('menuitem');
      });
    });

    it('has aria-haspopup on items with submenus', () => {
      const items: DropdownMenuItem[] = [
        {
          id: 'sub',
          label: 'Submenu',
          items: [{ id: 'child', label: 'Child' }],
        },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const parentItem = menu.querySelector('.dos-context-menu__item');
      expect(parentItem?.getAttribute('aria-haspopup')).toBe('true');
    });

    it('has aria-disabled on disabled items', () => {
      const items: DropdownMenuItem[] = [
        { id: 'disabled', label: 'Disabled', disabled: true },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const item = menu.querySelector('.dos-context-menu__item');
      expect(item?.getAttribute('aria-disabled')).toBe('true');
    });

    it('icons are hidden from screen readers', () => {
      const items: DropdownMenuItem[] = [
        { id: 'item', label: 'Item', icon: '★' },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const icon = menu.querySelector('.dos-context-menu__icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('shortcuts are hidden from screen readers', () => {
      const menu = createContextMenu({
        items: basicItems,
      });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const shortcut = menu.querySelector('.dos-context-menu__shortcut');
      expect(shortcut?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('type-ahead', () => {
    it('focuses item starting with typed character', () => {
      const items: DropdownMenuItem[] = [
        { id: 'apple', label: 'Apple' },
        { id: 'banana', label: 'Banana' },
        { id: 'cherry', label: 'Cherry' },
      ];

      const menu = createContextMenu({ items });
      container.appendChild(menu);
      menu.open({ x: 100, y: 100 });

      const menuItems = menu.querySelectorAll('.dos-context-menu__item');
      (menuItems[0] as HTMLElement).focus();

      const keyEvent = new KeyboardEvent('keydown', {
        key: 'b',
        bubbles: true,
      });
      menuItems[0].dispatchEvent(keyEvent);

      expect(document.activeElement).toBe(menuItems[1]);
    });
  });
});
