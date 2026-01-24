/**
 * @fileoverview Tests for the Sidebar component.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSidebar } from '../../src/components/Sidebar';
import type { SidebarProps, SidebarItem } from '../../src/components/Sidebar';

describe('Sidebar', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const basicItems: SidebarItem[] = [
    { id: 'home', label: 'Home', icon: '■' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact', disabled: true },
  ];

  const sectionItems: SidebarItem[] = [
    { id: 'home', label: 'Home', icon: '■' },
    {
      id: 'settings',
      label: 'Settings',
      icon: '◆',
      items: [
        { id: 'general', label: 'General' },
        { id: 'display', label: 'Display' },
        { id: 'audio', label: 'Audio', disabled: true },
      ],
    },
    {
      id: 'tools',
      label: 'Tools',
      expanded: false,
      items: [
        { id: 'calculator', label: 'Calculator' },
        { id: 'notepad', label: 'Notepad' },
      ],
    },
  ];

  describe('rendering', () => {
    it('renders with basic items', () => {
      const sidebar = createSidebar({ items: basicItems });
      container.appendChild(sidebar);

      expect(sidebar.classList.contains('dos-sidebar')).toBe(true);
      expect(sidebar.querySelectorAll('.dos-sidebar__item').length).toBe(3);
    });

    it('renders items with labels', () => {
      const sidebar = createSidebar({ items: basicItems });
      container.appendChild(sidebar);

      const labels = sidebar.querySelectorAll('.dos-sidebar__item-label');
      expect(labels[0].textContent).toBe('Home');
      expect(labels[1].textContent).toBe('About');
      expect(labels[2].textContent).toBe('Contact');
    });

    it('renders items with icons', () => {
      const sidebar = createSidebar({ items: basicItems });
      container.appendChild(sidebar);

      const icons = sidebar.querySelectorAll('.dos-sidebar__item-icon');
      expect(icons.length).toBe(1); // Only first item has an icon
      expect(icons[0].textContent).toBe('■');
    });

    it('renders disabled items correctly', () => {
      const sidebar = createSidebar({ items: basicItems });
      container.appendChild(sidebar);

      const disabledItem = sidebar.querySelector('[data-id="contact"]');
      expect(disabledItem?.classList.contains('dos-sidebar__item--disabled')).toBe(true);
      expect(disabledItem?.getAttribute('aria-disabled')).toBe('true');
    });

    it('renders collapsible sections', () => {
      const sidebar = createSidebar({ items: sectionItems });
      container.appendChild(sidebar);

      const sections = sidebar.querySelectorAll('.dos-sidebar__section');
      expect(sections.length).toBe(2);

      const headers = sidebar.querySelectorAll('.dos-sidebar__section-header');
      expect(headers.length).toBe(2);
    });

    it('renders section toggle indicators', () => {
      const sidebar = createSidebar({ items: sectionItems });
      container.appendChild(sidebar);

      const toggles = sidebar.querySelectorAll('.dos-sidebar__section-toggle');
      expect(toggles[0].textContent).toBe('▼'); // expanded
      expect(toggles[1].textContent).toBe('▶'); // collapsed
    });

    it('respects initial expanded state', () => {
      const sidebar = createSidebar({ items: sectionItems });
      container.appendChild(sidebar);

      const toolsSection = sidebar.querySelector('[data-section-id="tools"].dos-sidebar__section');
      expect(toolsSection?.classList.contains('dos-sidebar__section--collapsed')).toBe(true);
    });

    it('applies custom className', () => {
      const sidebar = createSidebar({ items: basicItems, className: 'my-custom-class' });
      expect(sidebar.classList.contains('my-custom-class')).toBe(true);
    });

    it('applies custom id', () => {
      const sidebar = createSidebar({ items: basicItems, id: 'my-sidebar' });
      expect(sidebar.id).toBe('my-sidebar');
    });

    it('applies custom width', () => {
      const sidebar = createSidebar({ items: basicItems, width: '300px' });
      expect(sidebar.style.width).toBe('300px');
    });

    it('applies numeric width as pixels', () => {
      const sidebar = createSidebar({ items: basicItems, width: 250 });
      expect(sidebar.style.width).toBe('250px');
    });

    it('applies right position class', () => {
      const sidebar = createSidebar({ items: basicItems, position: 'right' });
      expect(sidebar.classList.contains('dos-sidebar--right')).toBe(true);
    });
  });

  describe('active item', () => {
    it('highlights the active item', () => {
      const sidebar = createSidebar({ items: basicItems, activeItem: 'about' });
      container.appendChild(sidebar);

      const activeItem = sidebar.querySelector('[data-id="about"]');
      expect(activeItem?.classList.contains('dos-sidebar__item--active')).toBe(true);
      expect(activeItem?.getAttribute('aria-current')).toBe('page');
    });

    it('updates active item on click', () => {
      const onSelect = vi.fn();
      const sidebar = createSidebar({ items: basicItems, onSelect });
      container.appendChild(sidebar);

      const homeItem = sidebar.querySelector('[data-id="home"]') as HTMLElement;
      homeItem.click();

      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'home' }));
      expect(homeItem.classList.contains('dos-sidebar__item--active')).toBe(true);
    });

    it('does not call onSelect for disabled items', () => {
      const onSelect = vi.fn();
      const sidebar = createSidebar({ items: basicItems, onSelect });
      container.appendChild(sidebar);

      const disabledItem = sidebar.querySelector('[data-id="contact"]') as HTMLElement;
      disabledItem.click();

      expect(onSelect).not.toHaveBeenCalled();
    });

    it('updates active item via setActiveItem method', () => {
      const sidebar = createSidebar({ items: basicItems, activeItem: 'home' });
      container.appendChild(sidebar);

      sidebar.setActiveItem('about');

      const aboutItem = sidebar.querySelector('[data-id="about"]');
      expect(aboutItem?.classList.contains('dos-sidebar__item--active')).toBe(true);
      expect(sidebar.getActiveItem()).toBe('about');
    });

    it('clears active item when setActiveItem is called with null', () => {
      const sidebar = createSidebar({ items: basicItems, activeItem: 'home' });
      container.appendChild(sidebar);

      sidebar.setActiveItem(null);

      const activeItems = sidebar.querySelectorAll('.dos-sidebar__item--active');
      expect(activeItems.length).toBe(0);
      expect(sidebar.getActiveItem()).toBe(null);
    });
  });

  describe('section collapsing', () => {
    it('toggles section on click', () => {
      const onToggle = vi.fn();
      const sidebar = createSidebar({ items: sectionItems, onToggle });
      container.appendChild(sidebar);

      const settingsHeader = sidebar.querySelector('.dos-sidebar__section-header[data-section-id="settings"]') as HTMLElement;
      settingsHeader.click();

      expect(onToggle).toHaveBeenCalledWith(expect.objectContaining({ id: 'settings' }), false);

      const section = sidebar.querySelector('[data-section-id="settings"].dos-sidebar__section');
      expect(section?.classList.contains('dos-sidebar__section--collapsed')).toBe(true);
    });

    it('updates toggle indicator when section collapses', () => {
      const sidebar = createSidebar({ items: sectionItems });
      container.appendChild(sidebar);

      const settingsHeader = sidebar.querySelector('.dos-sidebar__section-header[data-section-id="settings"]') as HTMLElement;
      settingsHeader.click();

      const toggle = settingsHeader.querySelector('.dos-sidebar__section-toggle');
      expect(toggle?.textContent).toBe('▶');
    });

    it('expands section via expandSection method', () => {
      const sidebar = createSidebar({ items: sectionItems });
      container.appendChild(sidebar);

      sidebar.expandSection('tools');

      const toolsSection = sidebar.querySelector('[data-section-id="tools"].dos-sidebar__section');
      expect(toolsSection?.classList.contains('dos-sidebar__section--collapsed')).toBe(false);
    });

    it('collapses section via collapseSection method', () => {
      const sidebar = createSidebar({ items: sectionItems });
      container.appendChild(sidebar);

      sidebar.collapseSection('settings');

      const settingsSection = sidebar.querySelector('[data-section-id="settings"].dos-sidebar__section');
      expect(settingsSection?.classList.contains('dos-sidebar__section--collapsed')).toBe(true);
    });

    it('toggles section via toggleSection method', () => {
      const sidebar = createSidebar({ items: sectionItems });
      container.appendChild(sidebar);

      sidebar.toggleSection('settings');
      let settingsSection = sidebar.querySelector('[data-section-id="settings"].dos-sidebar__section');
      expect(settingsSection?.classList.contains('dos-sidebar__section--collapsed')).toBe(true);

      sidebar.toggleSection('settings');
      settingsSection = sidebar.querySelector('[data-section-id="settings"].dos-sidebar__section');
      expect(settingsSection?.classList.contains('dos-sidebar__section--collapsed')).toBe(false);
    });

    it('does not toggle sections when collapsible is false', () => {
      const onToggle = vi.fn();
      const sidebar = createSidebar({ items: sectionItems, collapsible: false, onToggle });
      container.appendChild(sidebar);

      const settingsHeader = sidebar.querySelector('.dos-sidebar__section-header[data-section-id="settings"]') as HTMLElement;
      settingsHeader.click();

      expect(onToggle).not.toHaveBeenCalled();
    });
  });

  describe('collapsed sidebar', () => {
    it('renders in collapsed state', () => {
      const sidebar = createSidebar({ items: basicItems, collapsed: true });
      expect(sidebar.classList.contains('dos-sidebar--collapsed')).toBe(true);
    });

    it('toggles collapsed state via setCollapsed', () => {
      const onCollapseChange = vi.fn();
      const sidebar = createSidebar({ items: basicItems, onCollapseChange });
      container.appendChild(sidebar);

      sidebar.setCollapsed(true);
      expect(sidebar.classList.contains('dos-sidebar--collapsed')).toBe(true);
      expect(sidebar.isCollapsed()).toBe(true);
      expect(onCollapseChange).toHaveBeenCalledWith(true);

      sidebar.setCollapsed(false);
      expect(sidebar.classList.contains('dos-sidebar--collapsed')).toBe(false);
      expect(sidebar.isCollapsed()).toBe(false);
      expect(onCollapseChange).toHaveBeenCalledWith(false);
    });
  });

  describe('keyboard navigation', () => {
    it('navigates down with ArrowDown', () => {
      const sidebar = createSidebar({ items: basicItems });
      container.appendChild(sidebar);

      const items = sidebar.querySelectorAll<HTMLElement>('.dos-sidebar__item:not(.dos-sidebar__item--disabled)');
      items[0].focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      items[0].dispatchEvent(event);

      expect(document.activeElement).toBe(items[1]);
    });

    it('navigates up with ArrowUp', () => {
      const sidebar = createSidebar({ items: basicItems });
      container.appendChild(sidebar);

      const items = sidebar.querySelectorAll<HTMLElement>('.dos-sidebar__item:not(.dos-sidebar__item--disabled)');
      items[1].focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      items[1].dispatchEvent(event);

      expect(document.activeElement).toBe(items[0]);
    });

    it('expands section with ArrowRight', () => {
      const sidebar = createSidebar({ items: sectionItems });
      container.appendChild(sidebar);

      const toolsHeader = sidebar.querySelector('.dos-sidebar__section-header[data-section-id="tools"]') as HTMLElement;
      toolsHeader.focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      toolsHeader.dispatchEvent(event);

      const toolsSection = sidebar.querySelector('[data-section-id="tools"].dos-sidebar__section');
      expect(toolsSection?.classList.contains('dos-sidebar__section--collapsed')).toBe(false);
    });

    it('collapses section with ArrowLeft', () => {
      const sidebar = createSidebar({ items: sectionItems });
      container.appendChild(sidebar);

      const settingsHeader = sidebar.querySelector('.dos-sidebar__section-header[data-section-id="settings"]') as HTMLElement;
      settingsHeader.focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
      settingsHeader.dispatchEvent(event);

      const settingsSection = sidebar.querySelector('[data-section-id="settings"].dos-sidebar__section');
      expect(settingsSection?.classList.contains('dos-sidebar__section--collapsed')).toBe(true);
    });

    it('selects item with Enter', () => {
      const onSelect = vi.fn();
      const sidebar = createSidebar({ items: basicItems, onSelect });
      container.appendChild(sidebar);

      const homeItem = sidebar.querySelector('[data-id="home"]') as HTMLElement;
      homeItem.focus();

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      homeItem.dispatchEvent(event);

      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'home' }));
    });

    it('selects item with Space', () => {
      const onSelect = vi.fn();
      const sidebar = createSidebar({ items: basicItems, onSelect });
      container.appendChild(sidebar);

      const homeItem = sidebar.querySelector('[data-id="home"]') as HTMLElement;
      homeItem.focus();

      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      homeItem.dispatchEvent(event);

      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'home' }));
    });

    it('toggles section with Enter on header', () => {
      const sidebar = createSidebar({ items: sectionItems });
      container.appendChild(sidebar);

      const settingsHeader = sidebar.querySelector('.dos-sidebar__section-header[data-section-id="settings"]') as HTMLElement;
      settingsHeader.focus();

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      settingsHeader.dispatchEvent(event);

      const settingsSection = sidebar.querySelector('[data-section-id="settings"].dos-sidebar__section');
      expect(settingsSection?.classList.contains('dos-sidebar__section--collapsed')).toBe(true);
    });

    it('navigates to first item with Home', () => {
      const sidebar = createSidebar({ items: basicItems });
      container.appendChild(sidebar);

      const items = sidebar.querySelectorAll<HTMLElement>('.dos-sidebar__item');
      items[1].focus();

      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      items[1].dispatchEvent(event);

      expect(document.activeElement).toBe(items[0]);
    });

    it('navigates to last item with End', () => {
      const sidebar = createSidebar({ items: basicItems });
      container.appendChild(sidebar);

      const items = sidebar.querySelectorAll<HTMLElement>('.dos-sidebar__item');
      items[0].focus();

      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      items[0].dispatchEvent(event);

      // Last non-disabled item
      expect(document.activeElement).toBe(items[1]);
    });
  });

  describe('public API', () => {
    it('setItems updates the sidebar items', () => {
      const sidebar = createSidebar({ items: basicItems });
      container.appendChild(sidebar);

      const newItems: SidebarItem[] = [
        { id: 'new1', label: 'New Item 1' },
        { id: 'new2', label: 'New Item 2' },
      ];

      sidebar.setItems(newItems);

      const items = sidebar.querySelectorAll('.dos-sidebar__item');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toContain('New Item 1');
    });

    it('destroy cleans up the sidebar', () => {
      const sidebar = createSidebar({ items: basicItems });
      container.appendChild(sidebar);

      sidebar.destroy();

      expect(sidebar.innerHTML).toBe('');
    });
  });

  describe('accessibility', () => {
    it('has navigation role', () => {
      const sidebar = createSidebar({ items: basicItems });
      expect(sidebar.getAttribute('role')).toBe('navigation');
    });

    it('has aria-label', () => {
      const sidebar = createSidebar({ items: basicItems });
      expect(sidebar.getAttribute('aria-label')).toBe('Sidebar navigation');
    });

    it('sets aria-current on active item', () => {
      const sidebar = createSidebar({ items: basicItems, activeItem: 'home' });
      container.appendChild(sidebar);

      const homeItem = sidebar.querySelector('[data-id="home"]');
      expect(homeItem?.getAttribute('aria-current')).toBe('page');
    });

    it('sets aria-expanded on section headers', () => {
      const sidebar = createSidebar({ items: sectionItems });
      container.appendChild(sidebar);

      const settingsHeader = sidebar.querySelector('.dos-sidebar__section-header[data-section-id="settings"]');
      const toolsHeader = sidebar.querySelector('.dos-sidebar__section-header[data-section-id="tools"]');

      expect(settingsHeader?.getAttribute('aria-expanded')).toBe('true');
      expect(toolsHeader?.getAttribute('aria-expanded')).toBe('false');
    });

    it('updates aria-expanded when section toggles', () => {
      const sidebar = createSidebar({ items: sectionItems });
      container.appendChild(sidebar);

      const settingsHeader = sidebar.querySelector('.dos-sidebar__section-header[data-section-id="settings"]') as HTMLElement;
      settingsHeader.click();

      expect(settingsHeader.getAttribute('aria-expanded')).toBe('false');
    });

    it('items are focusable via tabindex', () => {
      const sidebar = createSidebar({ items: basicItems });
      container.appendChild(sidebar);

      const items = sidebar.querySelectorAll('.dos-sidebar__item');
      expect(items[0].getAttribute('tabindex')).toBe('0');
      expect(items[1].getAttribute('tabindex')).toBe('0');
      expect(items[2].getAttribute('tabindex')).toBe('-1'); // disabled
    });

    it('section content has group role with aria-labelledby', () => {
      const sidebar = createSidebar({ items: sectionItems });
      container.appendChild(sidebar);

      const content = sidebar.querySelector('.dos-sidebar__section-content');
      expect(content?.getAttribute('role')).toBe('group');
      expect(content?.getAttribute('aria-labelledby')).toBe('sidebar-section-settings');
    });
  });
});
