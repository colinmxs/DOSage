/**
 * @fileoverview Tests for the Breadcrumbs component.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createBreadcrumbs } from '../../src/components/Breadcrumbs';
import type { BreadcrumbItem } from '../../src/components/Breadcrumbs';

describe('Breadcrumbs', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const basicItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Documents', href: '/documents' },
    { label: 'Current Page' },
  ];

  const longPath: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Level 1', href: '/l1' },
    { label: 'Level 2', href: '/l2' },
    { label: 'Level 3', href: '/l3' },
    { label: 'Level 4', href: '/l4' },
    { label: 'Current Page' },
  ];

  describe('rendering', () => {
    it('renders with basic items', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });
      container.appendChild(breadcrumbs);

      expect(breadcrumbs.classList.contains('dos-breadcrumbs')).toBe(true);
      const items = breadcrumbs.querySelectorAll('.dos-breadcrumbs__item');
      expect(items.length).toBe(3);
    });

    it('renders item labels correctly', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });
      container.appendChild(breadcrumbs);

      const labels = breadcrumbs.querySelectorAll('.dos-breadcrumbs__item-label');
      expect(labels[0].textContent).toBe('Home');
      expect(labels[1].textContent).toBe('Documents');
      expect(labels[2].textContent).toBe('Current Page');
    });

    it('renders items with icons', () => {
      const itemsWithIcons: BreadcrumbItem[] = [
        { label: 'Home', href: '/', icon: '■' },
        { label: 'Settings', href: '/settings', icon: '◆' },
        { label: 'Profile' },
      ];

      const breadcrumbs = createBreadcrumbs({ items: itemsWithIcons });
      container.appendChild(breadcrumbs);

      const icons = breadcrumbs.querySelectorAll('.dos-breadcrumbs__item-icon');
      expect(icons.length).toBe(2); // Last item has no icon
      expect(icons[0].textContent).toBe('■');
      expect(icons[1].textContent).toBe('◆');
    });

    it('renders links for items with href', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });
      container.appendChild(breadcrumbs);

      const links = breadcrumbs.querySelectorAll('a.dos-breadcrumbs__item');
      expect(links.length).toBe(2); // First two items have href
      expect((links[0] as HTMLAnchorElement).href).toContain('/');
      expect((links[1] as HTMLAnchorElement).href).toContain('/documents');
    });

    it('renders last item as span (not link)', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });
      container.appendChild(breadcrumbs);

      const items = breadcrumbs.querySelectorAll('.dos-breadcrumbs__item');
      const lastItem = items[items.length - 1];
      expect(lastItem.tagName).toBe('SPAN');
      expect(lastItem.classList.contains('dos-breadcrumbs__item--current')).toBe(true);
    });

    it('applies custom className', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems, className: 'my-custom-class' });
      expect(breadcrumbs.classList.contains('my-custom-class')).toBe(true);
    });

    it('applies custom id', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems, id: 'my-breadcrumbs' });
      expect(breadcrumbs.id).toBe('my-breadcrumbs');
    });
  });

  describe('separators', () => {
    it('renders default separator (>)', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });
      container.appendChild(breadcrumbs);

      const separators = breadcrumbs.querySelectorAll('.dos-breadcrumbs__separator');
      expect(separators.length).toBe(2); // Between 3 items
      expect(separators[0].textContent).toContain('>');
    });

    it('renders custom separator', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems, separator: '»' });
      container.appendChild(breadcrumbs);

      const separators = breadcrumbs.querySelectorAll('.dos-breadcrumbs__separator');
      expect(separators[0].textContent).toContain('»');
    });

    it('supports / separator', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems, separator: '/' });
      container.appendChild(breadcrumbs);

      const separators = breadcrumbs.querySelectorAll('.dos-breadcrumbs__separator');
      expect(separators[0].textContent).toContain('/');
    });

    it('supports \\ separator', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems, separator: '\\' });
      container.appendChild(breadcrumbs);

      const separators = breadcrumbs.querySelectorAll('.dos-breadcrumbs__separator');
      expect(separators[0].textContent).toContain('\\');
    });

    it('supports │ separator', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems, separator: '│' });
      container.appendChild(breadcrumbs);

      const separators = breadcrumbs.querySelectorAll('.dos-breadcrumbs__separator');
      expect(separators[0].textContent).toContain('│');
    });

    it('supports → separator', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems, separator: '→' });
      container.appendChild(breadcrumbs);

      const separators = breadcrumbs.querySelectorAll('.dos-breadcrumbs__separator');
      expect(separators[0].textContent).toContain('→');
    });

    it('updates separator via setSeparator method', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems, separator: '>' });
      container.appendChild(breadcrumbs);

      breadcrumbs.setSeparator('/');

      const separators = breadcrumbs.querySelectorAll('.dos-breadcrumbs__separator');
      expect(separators[0].textContent).toContain('/');
    });
  });

  describe('overflow handling', () => {
    it('shows all items when maxItems is not set', () => {
      const breadcrumbs = createBreadcrumbs({ items: longPath });
      container.appendChild(breadcrumbs);

      const items = breadcrumbs.querySelectorAll('.dos-breadcrumbs__item');
      expect(items.length).toBe(6);
    });

    it('collapses items when maxItems is set', () => {
      const breadcrumbs = createBreadcrumbs({ items: longPath, maxItems: 3 });
      container.appendChild(breadcrumbs);

      const items = breadcrumbs.querySelectorAll('.dos-breadcrumbs__item');
      expect(items.length).toBe(2); // First + last

      const ellipsis = breadcrumbs.querySelector('.dos-breadcrumbs__ellipsis');
      expect(ellipsis).not.toBeNull();
    });

    it('shows ellipsis with correct hidden count', () => {
      const breadcrumbs = createBreadcrumbs({ items: longPath, maxItems: 3 });
      container.appendChild(breadcrumbs);

      const ellipsis = breadcrumbs.querySelector('.dos-breadcrumbs__ellipsis');
      expect(ellipsis?.getAttribute('aria-label')).toContain('4'); // 4 hidden items
    });

    it('expands items when ellipsis is clicked', () => {
      const breadcrumbs = createBreadcrumbs({ items: longPath, maxItems: 3 });
      container.appendChild(breadcrumbs);

      const ellipsis = breadcrumbs.querySelector('.dos-breadcrumbs__ellipsis') as HTMLElement;
      ellipsis.click();

      const items = breadcrumbs.querySelectorAll('.dos-breadcrumbs__item');
      expect(items.length).toBe(6); // All items visible
    });

    it('does not show ellipsis when items fit within maxItems', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems, maxItems: 5 });
      container.appendChild(breadcrumbs);

      const ellipsis = breadcrumbs.querySelector('.dos-breadcrumbs__ellipsis');
      expect(ellipsis).toBeNull();
    });

    it('updates maxItems via setMaxItems method', () => {
      const breadcrumbs = createBreadcrumbs({ items: longPath, maxItems: 3 });
      container.appendChild(breadcrumbs);

      breadcrumbs.setMaxItems(undefined);

      const items = breadcrumbs.querySelectorAll('.dos-breadcrumbs__item');
      expect(items.length).toBe(6);
    });
  });

  describe('interaction', () => {
    it('calls onSelect when item is clicked', () => {
      const onSelect = vi.fn();
      const breadcrumbs = createBreadcrumbs({ items: basicItems, onSelect });
      container.appendChild(breadcrumbs);

      const link = breadcrumbs.querySelector('a.dos-breadcrumbs__item') as HTMLElement;
      link.click();

      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ label: 'Home' }), 0);
    });

    it('passes correct index to onSelect', () => {
      const onSelect = vi.fn();
      const breadcrumbs = createBreadcrumbs({ items: basicItems, onSelect });
      container.appendChild(breadcrumbs);

      const links = breadcrumbs.querySelectorAll('a.dos-breadcrumbs__item');
      (links[1] as HTMLElement).click();

      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ label: 'Documents' }), 1);
    });

    it('does not call onSelect for current page', () => {
      const onSelect = vi.fn();
      const breadcrumbs = createBreadcrumbs({ items: basicItems, onSelect });
      container.appendChild(breadcrumbs);

      const currentItem = breadcrumbs.querySelector('.dos-breadcrumbs__item--current') as HTMLElement;
      currentItem.click();

      expect(onSelect).not.toHaveBeenCalled();
    });

    it('prevents default navigation when onSelect is provided', () => {
      const onSelect = vi.fn();
      const breadcrumbs = createBreadcrumbs({ items: basicItems, onSelect });
      container.appendChild(breadcrumbs);

      const link = breadcrumbs.querySelector('a.dos-breadcrumbs__item') as HTMLAnchorElement;
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      link.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('public API', () => {
    it('setItems updates the breadcrumb items', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });
      container.appendChild(breadcrumbs);

      const newItems: BreadcrumbItem[] = [
        { label: 'New Home', href: '/new' },
        { label: 'New Page' },
      ];

      breadcrumbs.setItems(newItems);

      const items = breadcrumbs.querySelectorAll('.dos-breadcrumbs__item');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toContain('New Home');
    });

    it('getItems returns current items', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });

      const items = breadcrumbs.getItems();
      expect(items).toEqual(basicItems);
    });

    it('getItems returns a copy (not reference)', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });

      const items = breadcrumbs.getItems();
      items.push({ label: 'New' });

      expect(breadcrumbs.getItems().length).toBe(basicItems.length);
    });

    it('destroy cleans up the breadcrumbs', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });
      container.appendChild(breadcrumbs);

      breadcrumbs.destroy();

      expect(breadcrumbs.innerHTML).toBe('');
    });
  });

  describe('accessibility', () => {
    it('has navigation role via nav element', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });
      expect(breadcrumbs.tagName).toBe('NAV');
    });

    it('has default aria-label', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });
      expect(breadcrumbs.getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('supports custom aria-label', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems, ariaLabel: 'Navigation trail' });
      expect(breadcrumbs.getAttribute('aria-label')).toBe('Navigation trail');
    });

    it('sets aria-current on current page', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });
      container.appendChild(breadcrumbs);

      const currentItem = breadcrumbs.querySelector('.dos-breadcrumbs__item--current');
      expect(currentItem?.getAttribute('aria-current')).toBe('page');
    });

    it('hides separators from screen readers', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });
      container.appendChild(breadcrumbs);

      const separators = breadcrumbs.querySelectorAll('.dos-breadcrumbs__separator');
      separators.forEach((sep) => {
        expect(sep.getAttribute('aria-hidden')).toBe('true');
      });
    });

    it('hides icons from screen readers', () => {
      const itemsWithIcons: BreadcrumbItem[] = [
        { label: 'Home', href: '/', icon: '■' },
        { label: 'Current' },
      ];

      const breadcrumbs = createBreadcrumbs({ items: itemsWithIcons });
      container.appendChild(breadcrumbs);

      const icons = breadcrumbs.querySelectorAll('.dos-breadcrumbs__item-icon');
      icons.forEach((icon) => {
        expect(icon.getAttribute('aria-hidden')).toBe('true');
      });
    });

    it('uses ordered list for semantic structure', () => {
      const breadcrumbs = createBreadcrumbs({ items: basicItems });
      container.appendChild(breadcrumbs);

      const ol = breadcrumbs.querySelector('ol');
      expect(ol).not.toBeNull();
    });

    it('ellipsis button has accessible label', () => {
      const breadcrumbs = createBreadcrumbs({ items: longPath, maxItems: 3 });
      container.appendChild(breadcrumbs);

      const ellipsis = breadcrumbs.querySelector('.dos-breadcrumbs__ellipsis');
      expect(ellipsis?.getAttribute('aria-label')).toContain('Show');
      expect(ellipsis?.getAttribute('aria-label')).toContain('more items');
    });
  });

  describe('edge cases', () => {
    it('renders single item', () => {
      const breadcrumbs = createBreadcrumbs({ items: [{ label: 'Home' }] });
      container.appendChild(breadcrumbs);

      const items = breadcrumbs.querySelectorAll('.dos-breadcrumbs__item');
      expect(items.length).toBe(1);
      expect(items[0].classList.contains('dos-breadcrumbs__item--current')).toBe(true);
    });

    it('renders empty items array', () => {
      const breadcrumbs = createBreadcrumbs({ items: [] });
      container.appendChild(breadcrumbs);

      const items = breadcrumbs.querySelectorAll('.dos-breadcrumbs__item');
      expect(items.length).toBe(0);
    });

    it('handles items with no href (all items as spans)', () => {
      const itemsNoHref: BreadcrumbItem[] = [
        { label: 'Step 1' },
        { label: 'Step 2' },
        { label: 'Step 3' },
      ];

      const breadcrumbs = createBreadcrumbs({ items: itemsNoHref });
      container.appendChild(breadcrumbs);

      const links = breadcrumbs.querySelectorAll('a.dos-breadcrumbs__item');
      expect(links.length).toBe(0);
    });

    it('handles very long labels', () => {
      const longLabelItems: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'This is a very long breadcrumb label that might overflow' },
      ];

      const breadcrumbs = createBreadcrumbs({ items: longLabelItems });
      container.appendChild(breadcrumbs);

      const labels = breadcrumbs.querySelectorAll('.dos-breadcrumbs__item-label');
      expect(labels[1].textContent).toBe('This is a very long breadcrumb label that might overflow');
    });
  });
});
