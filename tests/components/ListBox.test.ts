/**
 * ListBox Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createListBox } from '../../src/components/ListBox';
import type { ListBoxItem, ListBoxProps } from '../../src/components/ListBox';

// Helper to create test items
function createTestItems(count: number = 5): ListBoxItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    primary: `Item ${i + 1}`,
    secondary: `Description for item ${i + 1}`,
  }));
}

// Helper to simulate keyboard events
function pressKey(element: HTMLElement, key: string, options: Partial<KeyboardEventInit> = {}): void {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  element.dispatchEvent(event);
}

// Helper to simulate click events
function click(element: HTMLElement): void {
  element.click();
}

describe('ListBox', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      const listbox = createListBox({});
      expect(listbox.element).toBeDefined();
      expect(listbox.element.classList.contains('dos-listbox')).toBe(true);
      expect(listbox.element.getAttribute('role')).toBe('listbox');
    });

    it('renders items', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items });

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      expect(itemEls).toHaveLength(3);
    });

    it('renders primary text', () => {
      const items: ListBoxItem[] = [{ id: '1', primary: 'Test Item' }];
      const listbox = createListBox({ items });

      const primary = listbox.element.querySelector('.dos-listbox___primary');
      expect(primary?.textContent).toBe('Test Item');
    });

    it('renders secondary text', () => {
      const items: ListBoxItem[] = [{ id: '1', primary: 'Test', secondary: 'Description' }];
      const listbox = createListBox({ items });

      const secondary = listbox.element.querySelector('.dos-listbox___secondary');
      expect(secondary?.textContent).toBe('Description');
    });

    it('renders icon', () => {
      const items: ListBoxItem[] = [{ id: '1', primary: 'Test', icon: '📁' }];
      const listbox = createListBox({ items });

      const icon = listbox.element.querySelector('.dos-listbox___icon');
      expect(icon?.textContent).toBe('📁');
    });

    it('renders trailing content', () => {
      const items: ListBoxItem[] = [{ id: '1', primary: 'Test', trailing: 'Ctrl+S' }];
      const listbox = createListBox({ items });

      const trailing = listbox.element.querySelector('.dos-listbox___trailing');
      expect(trailing?.textContent).toBe('Ctrl+S');
    });

    it('renders empty message when no items', () => {
      const listbox = createListBox({ items: [], emptyMessage: 'No data' });

      const empty = listbox.element.querySelector('.dos-listbox___empty');
      expect(empty?.textContent).toBe('No data');
    });

    it('renders with custom class name', () => {
      const listbox = createListBox({ className: 'custom-class' });
      expect(listbox.element.classList.contains('custom-class')).toBe(true);
    });

    it('renders with custom id', () => {
      const listbox = createListBox({ id: 'my-listbox' });
      expect(listbox.element.id).toBe('my-listbox');
    });

    it('applies bordered style', () => {
      const listbox = createListBox({ bordered: true });
      expect(listbox.element.classList.contains('dos-listbox--bordered')).toBe(true);
    });

    it('applies dividers style', () => {
      const listbox = createListBox({ dividers: true });
      expect(listbox.element.classList.contains('dos-listbox--dividers')).toBe(true);
    });

    it('applies dense style', () => {
      const listbox = createListBox({ dense: true });
      expect(listbox.element.classList.contains('dos-listbox--dense')).toBe(true);
    });

    it('applies max height', () => {
      const listbox = createListBox({ maxHeight: 200 });
      expect(listbox.element.style.maxHeight).toBe('200px');
      expect(listbox.element.classList.contains('dos-listbox--scrollable')).toBe(true);
    });

    it('applies max height as string', () => {
      const listbox = createListBox({ maxHeight: '50vh' });
      expect(listbox.element.style.maxHeight).toBe('50vh');
    });
  });

  describe('disabled items', () => {
    it('renders disabled items with aria-disabled', () => {
      const items: ListBoxItem[] = [{ id: '1', primary: 'Disabled', disabled: true }];
      const listbox = createListBox({ items });

      const itemEl = listbox.element.querySelector('.dos-listbox___item');
      expect(itemEl?.classList.contains('dos-listbox___item--disabled')).toBe(true);
      expect(itemEl?.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not select disabled items on click', () => {
      const items: ListBoxItem[] = [
        { id: '1', primary: 'Enabled' },
        { id: '2', primary: 'Disabled', disabled: true },
      ];
      const onSelect = vi.fn();
      const listbox = createListBox({ items, selectable: true, onSelect });

      const disabledItem = listbox.element.querySelectorAll('.dos-listbox___item')[1] as HTMLElement;
      click(disabledItem);

      expect(onSelect).not.toHaveBeenCalled();
      expect(listbox.isSelected('2')).toBe(false);
    });
  });

  describe('selection - single select', () => {
    it('applies selectable class', () => {
      const listbox = createListBox({ selectable: true });
      expect(listbox.element.classList.contains('dos-listbox--selectable')).toBe(true);
    });

    it('selects item on click', () => {
      const items = createTestItems(3);
      const onSelect = vi.fn();
      const listbox = createListBox({ items, selectable: true, onSelect });

      const firstItem = listbox.element.querySelector('.dos-listbox___item') as HTMLElement;
      click(firstItem);

      expect(onSelect).toHaveBeenCalledWith([items[0]]);
      expect(listbox.isSelected('item-1')).toBe(true);
    });

    it('replaces selection on subsequent click', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true });

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      click(itemEls[0] as HTMLElement);
      click(itemEls[1] as HTMLElement);

      expect(listbox.isSelected('item-1')).toBe(false);
      expect(listbox.isSelected('item-2')).toBe(true);
    });

    it('renders selection indicator', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true, showSelectionIndicator: true });

      const indicators = listbox.element.querySelectorAll('.dos-listbox___indicator');
      expect(indicators).toHaveLength(3);
    });

    it('hides selection indicator when showSelectionIndicator is false', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true, showSelectionIndicator: false });

      const indicators = listbox.element.querySelectorAll('.dos-listbox___indicator');
      expect(indicators).toHaveLength(0);
    });

    it('initializes with selected items', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true, selectedItems: ['item-2'] });

      expect(listbox.isSelected('item-2')).toBe(true);
    });
  });

  describe('selection - multi select', () => {
    it('applies multiselect class', () => {
      const listbox = createListBox({ selectable: true, multiSelect: true });
      expect(listbox.element.classList.contains('dos-listbox--multiselect')).toBe(true);
    });

    it('sets aria-multiselectable', () => {
      const listbox = createListBox({ selectable: true, multiSelect: true });
      expect(listbox.element.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('toggles selection on click', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true, multiSelect: true });

      const firstItem = listbox.element.querySelector('.dos-listbox___item') as HTMLElement;
      click(firstItem);
      expect(listbox.isSelected('item-1')).toBe(true);

      click(firstItem);
      expect(listbox.isSelected('item-1')).toBe(false);
    });

    it('allows multiple selections', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true, multiSelect: true });

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      click(itemEls[0] as HTMLElement);
      click(itemEls[1] as HTMLElement);

      expect(listbox.isSelected('item-1')).toBe(true);
      expect(listbox.isSelected('item-2')).toBe(true);
    });

    it('selects all with selectAll method', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true, multiSelect: true });

      listbox.selectAll();

      expect(listbox.getSelectedIds()).toEqual(['item-1', 'item-2', 'item-3']);
    });

    it('selectAll excludes disabled items', () => {
      const items: ListBoxItem[] = [
        { id: '1', primary: 'Enabled 1' },
        { id: '2', primary: 'Disabled', disabled: true },
        { id: '3', primary: 'Enabled 2' },
      ];
      const listbox = createListBox({ items, selectable: true, multiSelect: true });

      listbox.selectAll();

      expect(listbox.getSelectedIds()).toEqual(['1', '3']);
    });

    it('selects all with Ctrl+A', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true, multiSelect: true });

      pressKey(listbox.element, 'a', { ctrlKey: true });

      expect(listbox.getSelectedIds()).toHaveLength(3);
    });
  });

  describe('keyboard navigation', () => {
    it('focuses first item on focus', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items });

      listbox.element.dispatchEvent(new FocusEvent('focus'));

      const firstItem = listbox.element.querySelector('.dos-listbox___item');
      expect(firstItem?.classList.contains('dos-listbox___item--focused')).toBe(true);
    });

    it('navigates down with ArrowDown', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items });

      listbox.element.dispatchEvent(new FocusEvent('focus'));
      pressKey(listbox.element, 'ArrowDown');

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      expect(itemEls[1].classList.contains('dos-listbox___item--focused')).toBe(true);
    });

    it('navigates up with ArrowUp', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items });

      listbox.focusItem('item-3');
      pressKey(listbox.element, 'ArrowUp');

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      expect(itemEls[1].classList.contains('dos-listbox___item--focused')).toBe(true);
    });

    it('navigates to first item with Home', () => {
      const items = createTestItems(5);
      const listbox = createListBox({ items });

      listbox.focusItem('item-5');
      pressKey(listbox.element, 'Home');

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      expect(itemEls[0].classList.contains('dos-listbox___item--focused')).toBe(true);
    });

    it('navigates to last item with End', () => {
      const items = createTestItems(5);
      const listbox = createListBox({ items });

      listbox.element.dispatchEvent(new FocusEvent('focus'));
      pressKey(listbox.element, 'End');

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      expect(itemEls[4].classList.contains('dos-listbox___item--focused')).toBe(true);
    });

    it('skips disabled items when navigating', () => {
      const items: ListBoxItem[] = [
        { id: '1', primary: 'Item 1' },
        { id: '2', primary: 'Item 2', disabled: true },
        { id: '3', primary: 'Item 3' },
      ];
      const listbox = createListBox({ items });

      listbox.element.dispatchEvent(new FocusEvent('focus'));
      pressKey(listbox.element, 'ArrowDown');

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      expect(itemEls[2].classList.contains('dos-listbox___item--focused')).toBe(true);
    });

    it('selects item with Enter', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true });

      listbox.element.dispatchEvent(new FocusEvent('focus'));
      pressKey(listbox.element, 'Enter');

      expect(listbox.isSelected('item-1')).toBe(true);
    });

    it('selects item with Space', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true });

      listbox.element.dispatchEvent(new FocusEvent('focus'));
      pressKey(listbox.element, ' ');

      expect(listbox.isSelected('item-1')).toBe(true);
    });

    it('supports type-ahead navigation', () => {
      const items: ListBoxItem[] = [
        { id: '1', primary: 'Apple' },
        { id: '2', primary: 'Banana' },
        { id: '3', primary: 'Cherry' },
      ];
      const listbox = createListBox({ items });

      listbox.element.dispatchEvent(new FocusEvent('focus'));
      pressKey(listbox.element, 'c');

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      expect(itemEls[2].classList.contains('dos-listbox___item--focused')).toBe(true);
    });

    it('wraps around in type-ahead search', () => {
      const items: ListBoxItem[] = [
        { id: '1', primary: 'Apple' },
        { id: '2', primary: 'Apricot' },
        { id: '3', primary: 'Avocado' },
      ];
      const listbox = createListBox({ items });

      listbox.focusItem('3');
      pressKey(listbox.element, 'a');

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      expect(itemEls[0].classList.contains('dos-listbox___item--focused')).toBe(true);
    });
  });

  describe('item click callback', () => {
    it('calls onItemClick when item is clicked', () => {
      const items = createTestItems(3);
      const onItemClick = vi.fn();
      const listbox = createListBox({ items, onItemClick });

      const firstItem = listbox.element.querySelector('.dos-listbox___item') as HTMLElement;
      click(firstItem);

      expect(onItemClick).toHaveBeenCalledWith(items[0]);
    });

    it('applies interactive class when onItemClick is provided', () => {
      const listbox = createListBox({ onItemClick: () => {} });
      expect(listbox.element.classList.contains('dos-listbox--interactive')).toBe(true);
    });

    it('does not call onItemClick for disabled items', () => {
      const items: ListBoxItem[] = [{ id: '1', primary: 'Disabled', disabled: true }];
      const onItemClick = vi.fn();
      const listbox = createListBox({ items, onItemClick });

      const item = listbox.element.querySelector('.dos-listbox___item') as HTMLElement;
      click(item);

      expect(onItemClick).not.toHaveBeenCalled();
    });
  });

  describe('instance methods', () => {
    it('setItems replaces items', () => {
      const listbox = createListBox({ items: createTestItems(2) });
      const newItems = createTestItems(5);

      listbox.setItems(newItems);

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      expect(itemEls).toHaveLength(5);
    });

    it('setItems clears invalid selections', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true, selectedItems: ['item-2'] });

      listbox.setItems([{ id: 'new-1', primary: 'New Item' }]);

      expect(listbox.getSelectedIds()).toEqual([]);
    });

    it('getItems returns items', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items });

      expect(listbox.getItems()).toEqual(items);
    });

    it('selectItems selects specified items', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true, multiSelect: true });

      listbox.selectItems(['item-1', 'item-3']);

      expect(listbox.getSelectedIds()).toEqual(['item-1', 'item-3']);
    });

    it('selectItems in single select mode only selects first', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true });

      listbox.selectItems(['item-1', 'item-3']);

      expect(listbox.getSelectedIds()).toEqual(['item-1']);
    });

    it('clearSelection clears all selections', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true, selectedItems: ['item-1', 'item-2'] });

      listbox.clearSelection();

      expect(listbox.getSelectedIds()).toEqual([]);
    });

    it('toggleSelection toggles item selection', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true });

      listbox.toggleSelection('item-1');
      expect(listbox.isSelected('item-1')).toBe(true);

      listbox.toggleSelection('item-1');
      expect(listbox.isSelected('item-1')).toBe(false);
    });

    it('getSelectedItems returns selected item objects', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true, multiSelect: true });

      listbox.selectItems(['item-1', 'item-3']);

      expect(listbox.getSelectedItems()).toEqual([items[0], items[2]]);
    });

    it('focus focuses the container', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items });
      document.body.appendChild(listbox.element);

      listbox.focus();

      expect(document.activeElement).toBe(listbox.element);

      listbox.destroy();
    });

    it('focusItem focuses specific item', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items });

      listbox.focusItem('item-2');

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      expect(itemEls[1].classList.contains('dos-listbox___item--focused')).toBe(true);
    });

    it('getItemById returns item', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items });

      const item = listbox.getItemById('item-2');
      expect(item).toEqual(items[1]);
    });

    it('getItemById returns undefined for non-existent item', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items });

      const item = listbox.getItemById('non-existent');
      expect(item).toBeUndefined();
    });

    it('addItem adds item to end', () => {
      const items = createTestItems(2);
      const listbox = createListBox({ items });

      listbox.addItem({ id: 'new', primary: 'New Item' });

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      expect(itemEls).toHaveLength(3);
      expect(listbox.getItemById('new')?.primary).toBe('New Item');
    });

    it('addItem adds item at specific index', () => {
      const items = createTestItems(2);
      const listbox = createListBox({ items });

      listbox.addItem({ id: 'new', primary: 'New Item' }, 0);

      expect(listbox.getItems()[0].id).toBe('new');
    });

    it('removeItem removes item', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items });

      listbox.removeItem('item-2');

      expect(listbox.getItems()).toHaveLength(2);
      expect(listbox.getItemById('item-2')).toBeUndefined();
    });

    it('removeItem clears selection for removed item', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true, selectedItems: ['item-2'] });

      listbox.removeItem('item-2');

      expect(listbox.getSelectedIds()).toEqual([]);
    });

    it('updateItem updates item properties', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items });

      listbox.updateItem('item-2', { primary: 'Updated Item' });

      expect(listbox.getItemById('item-2')?.primary).toBe('Updated Item');
    });

    it('destroy removes element and cleans up', () => {
      const listbox = createListBox({});
      document.body.appendChild(listbox.element);

      listbox.destroy();

      expect(document.body.contains(listbox.element)).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has role listbox', () => {
      const listbox = createListBox({});
      expect(listbox.element.getAttribute('role')).toBe('listbox');
    });

    it('has tabindex 0', () => {
      const listbox = createListBox({});
      expect(listbox.element.getAttribute('tabindex')).toBe('0');
    });

    it('has aria-label', () => {
      const listbox = createListBox({ 'aria-label': 'My List' });
      expect(listbox.element.getAttribute('aria-label')).toBe('My List');
    });

    it('items have role option', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items });

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      itemEls.forEach((el) => {
        expect(el.getAttribute('role')).toBe('option');
      });
    });

    it('items have aria-selected', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true, selectedItems: ['item-2'] });

      const itemEls = listbox.element.querySelectorAll('.dos-listbox___item');
      expect(itemEls[0].getAttribute('aria-selected')).toBe('false');
      expect(itemEls[1].getAttribute('aria-selected')).toBe('true');
      expect(itemEls[2].getAttribute('aria-selected')).toBe('false');
    });

    it('icons are hidden from screen readers', () => {
      const items: ListBoxItem[] = [{ id: '1', primary: 'Test', icon: '📁' }];
      const listbox = createListBox({ items });

      const icon = listbox.element.querySelector('.dos-listbox___icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('selection indicator is hidden from screen readers', () => {
      const items = createTestItems(3);
      const listbox = createListBox({ items, selectable: true });

      const indicator = listbox.element.querySelector('.dos-listbox___indicator');
      expect(indicator?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('custom data', () => {
    it('preserves custom data on items', () => {
      const items: ListBoxItem[] = [
        { id: '1', primary: 'Item 1', data: { customField: 'value1' } },
        { id: '2', primary: 'Item 2', data: { customField: 'value2' } },
      ];
      const listbox = createListBox({ items });

      const retrievedItem = listbox.getItemById('1');
      expect(retrievedItem?.data).toEqual({ customField: 'value1' });
    });

    it('returns items with custom data in selection', () => {
      const items: ListBoxItem[] = [
        { id: '1', primary: 'Item 1', data: { customField: 'value1' } },
      ];
      const onSelect = vi.fn();
      const listbox = createListBox({ items, selectable: true, onSelect });

      const firstItem = listbox.element.querySelector('.dos-listbox___item') as HTMLElement;
      click(firstItem);

      expect(onSelect).toHaveBeenCalledWith([
        expect.objectContaining({ data: { customField: 'value1' } }),
      ]);
    });
  });
});
