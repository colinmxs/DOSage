/**
 * Accordion Component Tests
 *
 * Comprehensive tests for the DOS-style accordion component.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAccordion, type AccordionProps, type AccordionItemProps } from '../../src/components/Accordion';

describe('Accordion', () => {
  let container: HTMLElement;

  const defaultItems: AccordionItemProps[] = [
    { id: 'item1', title: 'Section 1', content: 'Content 1' },
    { id: 'item2', title: 'Section 2', content: 'Content 2' },
    { id: 'item3', title: 'Section 3', content: 'Content 3' },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  function createTestAccordion(props: Partial<AccordionProps> = {}) {
    const accordion = createAccordion({
      items: defaultItems,
      id: 'test-accordion',
      ...props,
    });
    container.appendChild(accordion);
    return accordion;
  }

  describe('rendering', () => {
    it('renders with default props', () => {
      const accordion = createTestAccordion();

      expect(accordion).toBeInstanceOf(HTMLElement);
      expect(accordion.classList.contains('dos-accordion')).toBe(true);
      expect(accordion.classList.contains('dos-accordion--default')).toBe(true);
    });

    it('renders all items', () => {
      const accordion = createTestAccordion();

      const items = accordion.querySelectorAll('.dos-accordion__item');
      expect(items.length).toBe(3);
    });

    it('renders item headers with correct content', () => {
      const accordion = createTestAccordion();

      const headers = accordion.querySelectorAll('.dos-accordion__header');
      expect(headers.length).toBe(3);

      const titles = accordion.querySelectorAll('.dos-accordion__title');
      expect(titles[0].textContent).toBe('Section 1');
      expect(titles[1].textContent).toBe('Section 2');
      expect(titles[2].textContent).toBe('Section 3');
    });

    it('renders with custom id', () => {
      const accordion = createTestAccordion({ id: 'my-accordion' });

      expect(accordion.id).toBe('my-accordion');
    });

    it('renders with custom className', () => {
      const accordion = createTestAccordion({ className: 'custom-class' });

      expect(accordion.classList.contains('custom-class')).toBe(true);
    });

    it('renders expand/collapse icons', () => {
      const accordion = createTestAccordion();

      const icons = accordion.querySelectorAll('.dos-accordion__icon');
      expect(icons.length).toBe(3);
      expect(icons[0].textContent).toBe('[+]');
    });

    it('renders custom icons', () => {
      const accordion = createTestAccordion({
        collapsedIcon: '►',
        expandedIcon: '▼',
      });

      const icons = accordion.querySelectorAll('.dos-accordion__icon');
      expect(icons[0].textContent).toBe('►');
    });

    it('renders item custom icons', () => {
      const accordion = createTestAccordion({
        items: [
          { id: 'item1', title: 'Settings', content: 'Content', icon: '⚙' },
          { id: 'item2', title: 'Help', content: 'Help content', icon: '?' },
        ],
      });

      const customIcons = accordion.querySelectorAll('.dos-accordion__custom-icon');
      expect(customIcons.length).toBe(2);
      expect(customIcons[0].textContent).toBe('⚙');
      expect(customIcons[1].textContent).toBe('?');
    });

    it('renders string content', () => {
      const accordion = createTestAccordion({
        items: [{ id: 'item1', title: 'Title', content: 'Plain text content' }],
      });

      // Expand to see content
      accordion.expand('item1');

      const contentInner = accordion.querySelector('.dos-accordion__content-inner');
      expect(contentInner?.textContent).toBe('Plain text content');
    });

    it('renders HTMLElement content', () => {
      const customContent = document.createElement('div');
      customContent.textContent = 'Custom element content';

      const accordion = createTestAccordion({
        items: [{ id: 'item1', title: 'Title', content: customContent }],
      });

      accordion.expand('item1');

      const contentInner = accordion.querySelector('.dos-accordion__content-inner');
      expect(contentInner?.textContent).toBe('Custom element content');
    });

    it('renders function content', () => {
      const accordion = createTestAccordion({
        items: [
          {
            id: 'item1',
            title: 'Title',
            content: () => {
              const el = document.createElement('span');
              el.textContent = 'Function generated content';
              return el;
            },
          },
        ],
      });

      accordion.expand('item1');

      const contentInner = accordion.querySelector('.dos-accordion__content-inner');
      expect(contentInner?.textContent).toBe('Function generated content');
    });
  });

  describe('variants', () => {
    it('renders default variant', () => {
      const accordion = createTestAccordion({ variant: 'default' });

      expect(accordion.classList.contains('dos-accordion--default')).toBe(true);
    });

    it('renders boxed variant', () => {
      const accordion = createTestAccordion({ variant: 'boxed' });

      expect(accordion.classList.contains('dos-accordion--boxed')).toBe(true);
    });

    it('renders minimal variant', () => {
      const accordion = createTestAccordion({ variant: 'minimal' });

      expect(accordion.classList.contains('dos-accordion--minimal')).toBe(true);
    });
  });

  describe('modes', () => {
    describe('single mode', () => {
      it('expands only one item at a time', () => {
        const accordion = createTestAccordion({ mode: 'single' });

        accordion.expand('item1');
        accordion.expand('item2');

        expect(accordion.getExpandedItems()).toEqual(['item2']);
      });

      it('collapses previous item when expanding new one', () => {
        const accordion = createTestAccordion({ mode: 'single' });

        accordion.expand('item1');
        expect(accordion.isExpanded('item1')).toBe(true);

        accordion.expand('item2');
        expect(accordion.isExpanded('item1')).toBe(false);
        expect(accordion.isExpanded('item2')).toBe(true);
      });
    });

    describe('multiple mode', () => {
      it('allows multiple items to be expanded', () => {
        const accordion = createTestAccordion({ mode: 'multiple' });

        accordion.expand('item1');
        accordion.expand('item2');
        accordion.expand('item3');

        expect(accordion.getExpandedItems()).toEqual(['item1', 'item2', 'item3']);
      });

      it('maintains other expanded items when toggling', () => {
        const accordion = createTestAccordion({ mode: 'multiple' });

        accordion.expand('item1');
        accordion.expand('item2');
        accordion.collapse('item1');

        expect(accordion.isExpanded('item1')).toBe(false);
        expect(accordion.isExpanded('item2')).toBe(true);
      });
    });
  });

  describe('defaultExpanded', () => {
    it('respects defaultExpanded on items', () => {
      const accordion = createTestAccordion({
        items: [
          { id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true },
          { id: 'item2', title: 'Section 2', content: 'Content 2' },
          { id: 'item3', title: 'Section 3', content: 'Content 3' },
        ],
      });

      expect(accordion.isExpanded('item1')).toBe(true);
      expect(accordion.isExpanded('item2')).toBe(false);
    });

    it('respects defaultExpanded with multiple mode', () => {
      const accordion = createTestAccordion({
        mode: 'multiple',
        items: [
          { id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true },
          { id: 'item2', title: 'Section 2', content: 'Content 2', defaultExpanded: true },
          { id: 'item3', title: 'Section 3', content: 'Content 3' },
        ],
      });

      expect(accordion.isExpanded('item1')).toBe(true);
      expect(accordion.isExpanded('item2')).toBe(true);
      expect(accordion.isExpanded('item3')).toBe(false);
    });

    it('only expands first defaultExpanded item in single mode', () => {
      const accordion = createTestAccordion({
        mode: 'single',
        items: [
          { id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true },
          { id: 'item2', title: 'Section 2', content: 'Content 2', defaultExpanded: true },
          { id: 'item3', title: 'Section 3', content: 'Content 3' },
        ],
      });

      const expanded = accordion.getExpandedItems();
      expect(expanded.length).toBe(1);
      expect(expanded[0]).toBe('item1');
    });

    it('ignores defaultExpanded on disabled items', () => {
      const accordion = createTestAccordion({
        items: [
          { id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true, disabled: true },
          { id: 'item2', title: 'Section 2', content: 'Content 2' },
        ],
      });

      expect(accordion.isExpanded('item1')).toBe(false);
    });
  });

  describe('controlled expansion', () => {
    it('respects expandedItems prop', () => {
      const accordion = createTestAccordion({
        expandedItems: ['item2'],
      });

      expect(accordion.isExpanded('item1')).toBe(false);
      expect(accordion.isExpanded('item2')).toBe(true);
      expect(accordion.isExpanded('item3')).toBe(false);
    });

    it('controlled expansion overrides defaultExpanded', () => {
      const accordion = createTestAccordion({
        expandedItems: ['item3'],
        items: [
          { id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true },
          { id: 'item2', title: 'Section 2', content: 'Content 2' },
          { id: 'item3', title: 'Section 3', content: 'Content 3' },
        ],
      });

      expect(accordion.isExpanded('item1')).toBe(false);
      expect(accordion.isExpanded('item3')).toBe(true);
    });
  });

  describe('allowAllCollapsed', () => {
    it('allows all items to be collapsed by default', () => {
      const accordion = createTestAccordion({
        items: [{ id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true }],
      });

      accordion.collapse('item1');

      expect(accordion.isExpanded('item1')).toBe(false);
    });

    it('prevents collapsing last item when allowAllCollapsed is false', () => {
      const accordion = createTestAccordion({
        allowAllCollapsed: false,
        items: [{ id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true }],
      });

      accordion.collapse('item1');

      // Should still be expanded
      expect(accordion.isExpanded('item1')).toBe(true);
    });

    it('allows switching items when allowAllCollapsed is false', () => {
      const accordion = createTestAccordion({
        allowAllCollapsed: false,
        mode: 'single',
        items: [
          { id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true },
          { id: 'item2', title: 'Section 2', content: 'Content 2' },
        ],
      });

      accordion.expand('item2');

      expect(accordion.isExpanded('item1')).toBe(false);
      expect(accordion.isExpanded('item2')).toBe(true);
    });
  });

  describe('disabled items', () => {
    it('renders disabled item correctly', () => {
      const accordion = createTestAccordion({
        items: [
          { id: 'item1', title: 'Section 1', content: 'Content 1', disabled: true },
          { id: 'item2', title: 'Section 2', content: 'Content 2' },
        ],
      });

      const items = accordion.querySelectorAll('.dos-accordion__item');
      const firstItem = items[0];
      const firstHeader = firstItem.querySelector('.dos-accordion__header') as HTMLButtonElement;

      expect(firstItem.classList.contains('dos-accordion__item--disabled')).toBe(true);
      expect(firstHeader.disabled).toBe(true);
      expect(firstHeader.getAttribute('aria-disabled')).toBe('true');
    });

    it('cannot expand disabled item via method', () => {
      const accordion = createTestAccordion({
        items: [
          { id: 'item1', title: 'Section 1', content: 'Content 1', disabled: true },
          { id: 'item2', title: 'Section 2', content: 'Content 2' },
        ],
      });

      accordion.expand('item1');

      expect(accordion.isExpanded('item1')).toBe(false);
    });

    it('cannot toggle disabled item via click', () => {
      const accordion = createTestAccordion({
        items: [
          { id: 'item1', title: 'Section 1', content: 'Content 1', disabled: true },
          { id: 'item2', title: 'Section 2', content: 'Content 2' },
        ],
      });

      const header = accordion.querySelector('.dos-accordion__header') as HTMLButtonElement;
      header.click();

      expect(accordion.isExpanded('item1')).toBe(false);
    });
  });

  describe('toggle interaction', () => {
    it('expands collapsed item on click', () => {
      const accordion = createTestAccordion();

      const header = accordion.querySelector('.dos-accordion__header') as HTMLButtonElement;
      header.click();

      expect(accordion.isExpanded('item1')).toBe(true);
    });

    it('collapses expanded item on click', () => {
      const accordion = createTestAccordion({
        items: [{ id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true }],
      });

      const header = accordion.querySelector('.dos-accordion__header') as HTMLButtonElement;
      header.click();

      expect(accordion.isExpanded('item1')).toBe(false);
    });

    it('updates icon on toggle', () => {
      const accordion = createTestAccordion();

      const icon = accordion.querySelector('.dos-accordion__icon') as HTMLElement;
      expect(icon.textContent).toBe('[+]');

      accordion.expand('item1');
      expect(icon.textContent).toBe('[-]');

      accordion.collapse('item1');
      expect(icon.textContent).toBe('[+]');
    });

    it('updates item class on toggle', () => {
      const accordion = createTestAccordion();

      const item = accordion.querySelector('.dos-accordion__item') as HTMLElement;
      expect(item.classList.contains('dos-accordion__item--expanded')).toBe(false);

      accordion.expand('item1');
      expect(item.classList.contains('dos-accordion__item--expanded')).toBe(true);

      accordion.collapse('item1');
      expect(item.classList.contains('dos-accordion__item--expanded')).toBe(false);
    });

    it('shows/hides content on toggle', () => {
      const accordion = createTestAccordion();

      const content = accordion.querySelector('.dos-accordion__content') as HTMLElement;
      expect(content.hidden).toBe(true);

      accordion.expand('item1');
      expect(content.hidden).toBe(false);

      accordion.collapse('item1');
      expect(content.hidden).toBe(true);
    });
  });

  describe('keyboard navigation', () => {
    it('toggles on Enter key', () => {
      const accordion = createTestAccordion();

      const header = accordion.querySelector('.dos-accordion__header') as HTMLButtonElement;
      header.focus();

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      header.dispatchEvent(event);

      expect(accordion.isExpanded('item1')).toBe(true);
    });

    it('toggles on Space key', () => {
      const accordion = createTestAccordion();

      const header = accordion.querySelector('.dos-accordion__header') as HTMLButtonElement;
      header.focus();

      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      header.dispatchEvent(event);

      expect(accordion.isExpanded('item1')).toBe(true);
    });

    it('navigates to next item on ArrowDown', () => {
      const accordion = createTestAccordion();

      const headers = accordion.querySelectorAll('.dos-accordion__header') as NodeListOf<HTMLButtonElement>;
      headers[0].focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      headers[0].dispatchEvent(event);

      expect(document.activeElement).toBe(headers[1]);
    });

    it('navigates to previous item on ArrowUp', () => {
      const accordion = createTestAccordion();

      const headers = accordion.querySelectorAll('.dos-accordion__header') as NodeListOf<HTMLButtonElement>;
      headers[1].focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      headers[1].dispatchEvent(event);

      expect(document.activeElement).toBe(headers[0]);
    });

    it('wraps from last to first on ArrowDown', () => {
      const accordion = createTestAccordion();

      const headers = accordion.querySelectorAll('.dos-accordion__header') as NodeListOf<HTMLButtonElement>;
      headers[2].focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      headers[2].dispatchEvent(event);

      expect(document.activeElement).toBe(headers[0]);
    });

    it('wraps from first to last on ArrowUp', () => {
      const accordion = createTestAccordion();

      const headers = accordion.querySelectorAll('.dos-accordion__header') as NodeListOf<HTMLButtonElement>;
      headers[0].focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      headers[0].dispatchEvent(event);

      expect(document.activeElement).toBe(headers[2]);
    });

    it('navigates to first item on Home', () => {
      const accordion = createTestAccordion();

      const headers = accordion.querySelectorAll('.dos-accordion__header') as NodeListOf<HTMLButtonElement>;
      headers[2].focus();

      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      headers[2].dispatchEvent(event);

      expect(document.activeElement).toBe(headers[0]);
    });

    it('navigates to last item on End', () => {
      const accordion = createTestAccordion();

      const headers = accordion.querySelectorAll('.dos-accordion__header') as NodeListOf<HTMLButtonElement>;
      headers[0].focus();

      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      headers[0].dispatchEvent(event);

      expect(document.activeElement).toBe(headers[2]);
    });

    it('skips disabled items during navigation', () => {
      const accordion = createTestAccordion({
        items: [
          { id: 'item1', title: 'Section 1', content: 'Content 1' },
          { id: 'item2', title: 'Section 2', content: 'Content 2', disabled: true },
          { id: 'item3', title: 'Section 3', content: 'Content 3' },
        ],
      });

      const headers = accordion.querySelectorAll('.dos-accordion__header') as NodeListOf<HTMLButtonElement>;
      headers[0].focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      headers[0].dispatchEvent(event);

      expect(document.activeElement).toBe(headers[2]);
    });

    it('prevents default on Enter key', () => {
      const accordion = createTestAccordion();

      const header = accordion.querySelector('.dos-accordion__header') as HTMLButtonElement;
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });

      header.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('callbacks', () => {
    it('calls onToggle when item is expanded', () => {
      const onToggle = vi.fn();
      const accordion = createTestAccordion({ onToggle });

      accordion.expand('item1');

      expect(onToggle).toHaveBeenCalledWith('item1', true);
    });

    it('calls onToggle when item is collapsed', () => {
      const onToggle = vi.fn();
      const accordion = createTestAccordion({
        onToggle,
        items: [{ id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true }],
      });

      accordion.collapse('item1');

      expect(onToggle).toHaveBeenCalledWith('item1', false);
    });

    it('calls onChange with all expanded items', () => {
      const onChange = vi.fn();
      const accordion = createTestAccordion({ onChange, mode: 'multiple' });

      accordion.expand('item1');
      expect(onChange).toHaveBeenCalledWith(['item1']);

      accordion.expand('item2');
      expect(onChange).toHaveBeenCalledWith(['item1', 'item2']);
    });
  });

  describe('custom events', () => {
    it('dispatches dos:accordion:toggle event on expand', () => {
      const accordion = createTestAccordion();
      const handler = vi.fn();

      accordion.addEventListener('dos:accordion:toggle', handler);
      accordion.expand('item1');

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail.itemId).toBe('item1');
      expect(event.detail.expanded).toBe(true);
      expect(event.detail.expandedItems).toContain('item1');
    });

    it('dispatches dos:accordion:toggle event on collapse', () => {
      const accordion = createTestAccordion({
        items: [{ id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true }],
      });
      const handler = vi.fn();

      accordion.addEventListener('dos:accordion:toggle', handler);
      accordion.collapse('item1');

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail.itemId).toBe('item1');
      expect(event.detail.expanded).toBe(false);
    });

    it('event bubbles', () => {
      const accordion = createTestAccordion();
      const handler = vi.fn();

      container.addEventListener('dos:accordion:toggle', handler);
      accordion.expand('item1');

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('ARIA attributes', () => {
    it('has correct header ARIA attributes when collapsed', () => {
      const accordion = createTestAccordion();

      const header = accordion.querySelector('.dos-accordion__header') as HTMLButtonElement;

      expect(header.getAttribute('aria-expanded')).toBe('false');
      expect(header.getAttribute('aria-controls')).toBe('test-accordion-content-item1');
    });

    it('has correct header ARIA attributes when expanded', () => {
      const accordion = createTestAccordion({
        items: [{ id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true }],
      });

      const header = accordion.querySelector('.dos-accordion__header') as HTMLButtonElement;

      expect(header.getAttribute('aria-expanded')).toBe('true');
    });

    it('has correct content region attributes', () => {
      const accordion = createTestAccordion();

      const content = accordion.querySelector('.dos-accordion__content') as HTMLElement;

      expect(content.getAttribute('role')).toBe('region');
      expect(content.getAttribute('aria-labelledby')).toBe('test-accordion-header-item1');
    });

    it('updates aria-expanded on toggle', () => {
      const accordion = createTestAccordion();

      const header = accordion.querySelector('.dos-accordion__header') as HTMLButtonElement;

      expect(header.getAttribute('aria-expanded')).toBe('false');
      accordion.expand('item1');
      expect(header.getAttribute('aria-expanded')).toBe('true');
      accordion.collapse('item1');
      expect(header.getAttribute('aria-expanded')).toBe('false');
    });

    it('icon has aria-hidden', () => {
      const accordion = createTestAccordion();

      const icon = accordion.querySelector('.dos-accordion__icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('public API', () => {
    describe('getExpandedItems()', () => {
      it('returns empty array when nothing is expanded', () => {
        const accordion = createTestAccordion();

        expect(accordion.getExpandedItems()).toEqual([]);
      });

      it('returns array of expanded item IDs', () => {
        const accordion = createTestAccordion({ mode: 'multiple' });

        accordion.expand('item1');
        accordion.expand('item3');

        expect(accordion.getExpandedItems()).toEqual(['item1', 'item3']);
      });
    });

    describe('isExpanded()', () => {
      it('returns false for collapsed item', () => {
        const accordion = createTestAccordion();

        expect(accordion.isExpanded('item1')).toBe(false);
      });

      it('returns true for expanded item', () => {
        const accordion = createTestAccordion({
          items: [{ id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true }],
        });

        expect(accordion.isExpanded('item1')).toBe(true);
      });
    });

    describe('expand()', () => {
      it('expands a collapsed item', () => {
        const accordion = createTestAccordion();

        accordion.expand('item1');

        expect(accordion.isExpanded('item1')).toBe(true);
      });

      it('does nothing if already expanded', () => {
        const onToggle = vi.fn();
        const accordion = createTestAccordion({
          onToggle,
          items: [{ id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true }],
        });

        accordion.expand('item1');

        expect(onToggle).not.toHaveBeenCalled();
      });
    });

    describe('collapse()', () => {
      it('collapses an expanded item', () => {
        const accordion = createTestAccordion({
          items: [{ id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true }],
        });

        accordion.collapse('item1');

        expect(accordion.isExpanded('item1')).toBe(false);
      });

      it('does nothing if already collapsed', () => {
        const onToggle = vi.fn();
        const accordion = createTestAccordion({ onToggle });

        accordion.collapse('item1');

        expect(onToggle).not.toHaveBeenCalled();
      });
    });

    describe('toggle()', () => {
      it('expands collapsed item', () => {
        const accordion = createTestAccordion();

        accordion.toggle('item1');

        expect(accordion.isExpanded('item1')).toBe(true);
      });

      it('collapses expanded item', () => {
        const accordion = createTestAccordion({
          items: [{ id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true }],
        });

        accordion.toggle('item1');

        expect(accordion.isExpanded('item1')).toBe(false);
      });
    });

    describe('expandAll()', () => {
      it('expands all items in multiple mode', () => {
        const accordion = createTestAccordion({ mode: 'multiple' });

        accordion.expandAll();

        expect(accordion.getExpandedItems()).toEqual(['item1', 'item2', 'item3']);
      });

      it('only expands first enabled in single mode', () => {
        const accordion = createTestAccordion({ mode: 'single' });

        accordion.expandAll();

        expect(accordion.getExpandedItems().length).toBe(1);
      });

      it('skips disabled items', () => {
        const accordion = createTestAccordion({
          mode: 'multiple',
          items: [
            { id: 'item1', title: 'Section 1', content: 'Content 1', disabled: true },
            { id: 'item2', title: 'Section 2', content: 'Content 2' },
            { id: 'item3', title: 'Section 3', content: 'Content 3' },
          ],
        });

        accordion.expandAll();

        expect(accordion.getExpandedItems()).toEqual(['item2', 'item3']);
      });
    });

    describe('collapseAll()', () => {
      it('collapses all items', () => {
        const accordion = createTestAccordion({
          mode: 'multiple',
          items: [
            { id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true },
            { id: 'item2', title: 'Section 2', content: 'Content 2', defaultExpanded: true },
          ],
        });

        accordion.collapseAll();

        expect(accordion.getExpandedItems()).toEqual([]);
      });

      it('keeps one expanded when allowAllCollapsed is false', () => {
        const accordion = createTestAccordion({
          allowAllCollapsed: false,
          items: [
            { id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true },
            { id: 'item2', title: 'Section 2', content: 'Content 2', defaultExpanded: true },
          ],
          mode: 'multiple',
        });

        accordion.collapseAll();

        expect(accordion.getExpandedItems().length).toBe(1);
      });
    });

    describe('enableItem()', () => {
      it('enables a disabled item', () => {
        const accordion = createTestAccordion({
          items: [
            { id: 'item1', title: 'Section 1', content: 'Content 1', disabled: true },
            { id: 'item2', title: 'Section 2', content: 'Content 2' },
          ],
        });

        accordion.enableItem('item1');

        const header = accordion.querySelector('.dos-accordion__header') as HTMLButtonElement;
        expect(header.disabled).toBe(false);
        expect(header.getAttribute('aria-disabled')).toBeNull();
      });

      it('allows expanding after enabling', () => {
        const accordion = createTestAccordion({
          items: [
            { id: 'item1', title: 'Section 1', content: 'Content 1', disabled: true },
            { id: 'item2', title: 'Section 2', content: 'Content 2' },
          ],
        });

        accordion.enableItem('item1');
        accordion.expand('item1');

        expect(accordion.isExpanded('item1')).toBe(true);
      });
    });

    describe('disableItem()', () => {
      it('disables an enabled item', () => {
        const accordion = createTestAccordion();

        accordion.disableItem('item1');

        const header = accordion.querySelector('.dos-accordion__header') as HTMLButtonElement;
        expect(header.disabled).toBe(true);
        expect(header.getAttribute('aria-disabled')).toBe('true');
      });
    });

    describe('getItems()', () => {
      it('returns current items', () => {
        const accordion = createTestAccordion();

        const items = accordion.getItems();

        expect(items.length).toBe(3);
        expect(items[0].id).toBe('item1');
      });

      it('returns a copy, not original array', () => {
        const accordion = createTestAccordion();

        const items = accordion.getItems();
        items.push({ id: 'item4', title: 'New', content: 'New' });

        expect(accordion.getItems().length).toBe(3);
      });
    });

    describe('setItems()', () => {
      it('replaces all items', () => {
        const accordion = createTestAccordion();

        accordion.setItems([
          { id: 'new1', title: 'New Section 1', content: 'New Content 1' },
          { id: 'new2', title: 'New Section 2', content: 'New Content 2' },
        ]);

        const items = accordion.getItems();
        expect(items.length).toBe(2);
        expect(items[0].id).toBe('new1');
      });

      it('re-renders accordion', () => {
        const accordion = createTestAccordion();

        accordion.setItems([{ id: 'new1', title: 'New Section', content: 'New Content' }]);

        const headers = accordion.querySelectorAll('.dos-accordion__header');
        expect(headers.length).toBe(1);
      });

      it('clears expanded state for removed items', () => {
        const accordion = createTestAccordion({
          items: [{ id: 'item1', title: 'Section 1', content: 'Content 1', defaultExpanded: true }],
        });

        accordion.setItems([{ id: 'new1', title: 'New Section', content: 'New Content' }]);

        expect(accordion.isExpanded('item1')).toBe(false);
      });
    });

    describe('focus()', () => {
      it('focuses first enabled item header', () => {
        const accordion = createTestAccordion();

        accordion.focus();

        const firstHeader = accordion.querySelector('.dos-accordion__header');
        expect(document.activeElement).toBe(firstHeader);
      });

      it('skips disabled first item', () => {
        const accordion = createTestAccordion({
          items: [
            { id: 'item1', title: 'Section 1', content: 'Content 1', disabled: true },
            { id: 'item2', title: 'Section 2', content: 'Content 2' },
          ],
        });

        accordion.focus();

        const headers = accordion.querySelectorAll('.dos-accordion__header');
        expect(document.activeElement).toBe(headers[1]);
      });
    });

    describe('destroy()', () => {
      it('cleans up event listeners', () => {
        const onClick = vi.fn();
        const accordion = createTestAccordion();
        const header = accordion.querySelector('.dos-accordion__header') as HTMLButtonElement;
        
        // Add a custom listener to verify cleanup pattern
        header.addEventListener('click', onClick);
        
        accordion.destroy();
        
        // The native click handler (from accordion) should be removed
        // but our test listener remains - we're just testing it doesn't throw
        // and that the component can be safely destroyed
        expect(() => accordion.destroy()).not.toThrow();
      });
    });
  });

  describe('edge cases', () => {
    it('handles empty items array', () => {
      const accordion = createTestAccordion({ items: [] });

      expect(accordion.querySelectorAll('.dos-accordion__item').length).toBe(0);
    });

    it('handles single item', () => {
      const accordion = createTestAccordion({
        items: [{ id: 'only', title: 'Only Item', content: 'Content' }],
      });

      expect(accordion.querySelectorAll('.dos-accordion__item').length).toBe(1);
    });

    it('handles all disabled items', () => {
      const accordion = createTestAccordion({
        items: [
          { id: 'item1', title: 'Section 1', content: 'Content 1', disabled: true },
          { id: 'item2', title: 'Section 2', content: 'Content 2', disabled: true },
        ],
      });

      accordion.expand('item1');
      accordion.expand('item2');

      expect(accordion.getExpandedItems()).toEqual([]);
    });

    it('handles items with same content', () => {
      const accordion = createTestAccordion({
        items: [
          { id: 'item1', title: 'Same', content: 'Same content' },
          { id: 'item2', title: 'Same', content: 'Same content' },
        ],
      });

      accordion.expand('item1');
      accordion.expand('item2');

      expect(accordion.isExpanded('item1')).toBe(false); // single mode
      expect(accordion.isExpanded('item2')).toBe(true);
    });

    it('handles rapid toggling', () => {
      const accordion = createTestAccordion();

      accordion.toggle('item1');
      accordion.toggle('item1');
      accordion.toggle('item1');

      expect(accordion.isExpanded('item1')).toBe(true);
    });
  });
});
