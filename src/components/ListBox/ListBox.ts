/**
 * ListBox Component
 *
 * DOS-style selectable list with keyboard navigation, single/multi-select support,
 * and customizable item rendering.
 */

import type { ListBoxItem, ListBoxProps, ListBoxInstance } from './ListBox.types';
import './ListBox.css';

/**
 * Creates a DOS-style ListBox component.
 *
 * @param props - ListBox configuration options
 * @returns ListBox instance with element and control methods
 *
 * @example
 * ```typescript
 * const listbox = createListBox({
 *   items: [
 *     { id: '1', primary: 'Option 1' },
 *     { id: '2', primary: 'Option 2' },
 *     { id: '3', primary: 'Option 3', disabled: true },
 *   ],
 *   selectable: true,
 *   multiSelect: false,
 *   onSelect: (items) => console.log('Selected:', items),
 * });
 *
 * document.body.appendChild(listbox.element);
 * ```
 */
export function createListBox(props: ListBoxProps): ListBoxInstance {
  const {
    items: initialItems = [],
    selectable = false,
    multiSelect = false,
    selectedItems: initialSelectedItems = [],
    bordered = false,
    dividers = false,
    dense = false,
    showSelectionIndicator = true,
    onSelect,
    onItemClick,
    maxHeight,
    emptyMessage = 'No items',
    className = '',
    id,
  } = props;

  // State
  let items = [...initialItems];
  let selectedIds = new Set<string>(initialSelectedItems);
  let focusedIndex = -1;

  // Create container element
  const container = document.createElement('div');
  container.className = buildContainerClassName();
  if (id) container.id = id;
  if (className) container.classList.add(...className.split(' ').filter(Boolean));

  // Set ARIA attributes
  container.setAttribute('role', 'listbox');
  container.setAttribute('tabindex', '0');
  container.setAttribute('aria-label', props.ariaLabel || props['aria-label'] || 'List');
  if (multiSelect) {
    container.setAttribute('aria-multiselectable', 'true');
  }

  // Apply max height if specified
  if (maxHeight) {
    container.style.maxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
    container.classList.add('dos-listbox--scrollable');
  }

  // Create list element
  const list = document.createElement('ul');
  list.className = 'dos-listbox___list';
  container.appendChild(list);

  // Build class names based on props
  function buildContainerClassName(): string {
    const classes = ['dos-listbox'];

    if (bordered) classes.push('dos-listbox--bordered');
    if (dividers) classes.push('dos-listbox--dividers');
    if (dense) classes.push('dos-listbox--dense');
    if (selectable) classes.push('dos-listbox--selectable');
    if (multiSelect) classes.push('dos-listbox--multiselect');
    if (onItemClick) classes.push('dos-listbox--interactive');

    return classes.join(' ');
  }

  // Render items
  function renderItems(): void {
    list.innerHTML = '';

    if (items.length === 0) {
      const emptyEl = document.createElement('li');
      emptyEl.className = 'dos-listbox___empty';
      emptyEl.textContent = emptyMessage;
      emptyEl.setAttribute('role', 'presentation');
      list.appendChild(emptyEl);
      return;
    }

    items.forEach((item, index) => {
      const li = createItemElement(item, index);
      list.appendChild(li);
    });

    // Update focus after render if needed
    if (focusedIndex >= 0 && focusedIndex < items.length) {
      const focusedItem = list.children[focusedIndex] as HTMLElement;
      if (focusedItem && !focusedItem.classList.contains('dos-listbox___empty')) {
        focusedItem.classList.add('dos-listbox___item--focused');
      }
    }
  }

  // Create individual item element
  function createItemElement(item: ListBoxItem, index: number): HTMLElement {
    const li = document.createElement('li');
    li.className = 'dos-listbox___item';
    li.setAttribute('role', 'option');
    li.setAttribute('data-id', item.id);
    li.setAttribute('data-index', String(index));
    li.setAttribute('tabindex', '-1');

    // Selected state
    const isSelected = selectedIds.has(item.id);
    if (isSelected) {
      li.classList.add('dos-listbox___item--selected');
      li.setAttribute('aria-selected', 'true');
    } else {
      li.setAttribute('aria-selected', 'false');
    }

    // Disabled state
    if (item.disabled) {
      li.classList.add('dos-listbox___item--disabled');
      li.setAttribute('aria-disabled', 'true');
    }

    // Selection indicator
    if (selectable && showSelectionIndicator) {
      const indicator = document.createElement('span');
      indicator.className = 'dos-listbox___indicator';
      indicator.setAttribute('aria-hidden', 'true');
      li.appendChild(indicator);
    }

    // Icon
    if (item.icon) {
      const icon = document.createElement('span');
      icon.className = 'dos-listbox___icon';
      icon.textContent = item.icon;
      icon.setAttribute('aria-hidden', 'true');
      li.appendChild(icon);
    }

    // Content wrapper
    const content = document.createElement('div');
    content.className = 'dos-listbox___content';

    // Primary text
    const primary = document.createElement('div');
    primary.className = 'dos-listbox___primary';
    primary.textContent = item.primary;
    content.appendChild(primary);

    // Secondary text
    if (item.secondary) {
      const secondary = document.createElement('div');
      secondary.className = 'dos-listbox___secondary';
      secondary.textContent = item.secondary;
      content.appendChild(secondary);
    }

    li.appendChild(content);

    // Trailing content
    if (item.trailing) {
      const trailing = document.createElement('span');
      trailing.className = 'dos-listbox___trailing';
      if (typeof item.trailing === 'string') {
        trailing.textContent = item.trailing;
      } else {
        trailing.appendChild(item.trailing);
      }
      li.appendChild(trailing);
    }

    // Event listeners
    li.addEventListener('click', () => handleItemClick(item, index));

    return li;
  }

  // Handle item click
  function handleItemClick(item: ListBoxItem, index: number): void {
    if (item.disabled) return;

    // Call click callback
    if (onItemClick) {
      onItemClick(item);
    }

    // Handle selection
    if (selectable) {
      if (multiSelect) {
        // Toggle selection in multi-select mode
        if (selectedIds.has(item.id)) {
          selectedIds.delete(item.id);
        } else {
          selectedIds.add(item.id);
        }
      } else {
        // Replace selection in single-select mode
        selectedIds.clear();
        selectedIds.add(item.id);
      }

      updateSelectionUI();

      if (onSelect) {
        onSelect(getSelectedItems());
      }
    }

    // Update focus
    setFocusedIndex(index);
  }

  // Update selection UI without full re-render
  function updateSelectionUI(): void {
    const itemElements = list.querySelectorAll('.dos-listbox___item');
    itemElements.forEach((el) => {
      const id = el.getAttribute('data-id');
      if (id) {
        const isSelected = selectedIds.has(id);
        el.classList.toggle('dos-listbox___item--selected', isSelected);
        el.setAttribute('aria-selected', String(isSelected));
      }
    });
  }

  // Set focused index
  function setFocusedIndex(index: number): void {
    // Remove previous focus indicator
    if (focusedIndex >= 0) {
      const prevFocused = list.children[focusedIndex] as HTMLElement;
      if (prevFocused) {
        prevFocused.classList.remove('dos-listbox___item--focused');
      }
    }

    focusedIndex = index;

    // Add new focus indicator
    if (focusedIndex >= 0 && focusedIndex < items.length) {
      const newFocused = list.children[focusedIndex] as HTMLElement;
      if (newFocused && !newFocused.classList.contains('dos-listbox___empty')) {
        newFocused.classList.add('dos-listbox___item--focused');
        // Scroll into view if needed (check for existence for jsdom compatibility)
        if (typeof newFocused.scrollIntoView === 'function') {
          newFocused.scrollIntoView({ block: 'nearest' });
        }
      }
    }

    // Update aria-activedescendant
    if (focusedIndex >= 0) {
      const focusedItem = items[focusedIndex];
      if (focusedItem) {
        container.setAttribute('aria-activedescendant', `listbox-item-${focusedItem.id}`);
      }
    } else {
      container.removeAttribute('aria-activedescendant');
    }
  }

  // Find next non-disabled index
  function findNextIndex(startIndex: number, direction: 1 | -1): number {
    let index = startIndex + direction;
    while (index >= 0 && index < items.length) {
      const item = items[index];
      if (item && !item.disabled) {
        return index;
      }
      index += direction;
    }
    return startIndex; // Stay at current if no valid option found
  }

  // Keyboard navigation
  function handleKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    // Skip if no items
    if (items.length === 0) return;

    switch (key) {
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = focusedIndex < 0 ? findFirstNonDisabledIndex() : findNextIndex(focusedIndex, 1);
        setFocusedIndex(nextIndex);
        break;
      }

      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = focusedIndex < 0 ? findLastNonDisabledIndex() : findNextIndex(focusedIndex, -1);
        setFocusedIndex(prevIndex);
        break;
      }

      case 'Home': {
        event.preventDefault();
        setFocusedIndex(findFirstNonDisabledIndex());
        break;
      }

      case 'End': {
        event.preventDefault();
        setFocusedIndex(findLastNonDisabledIndex());
        break;
      }

      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < items.length) {
          const item = items[focusedIndex];
          if (item) {
            handleItemClick(item, focusedIndex);
          }
        }
        break;
      }

      default:
        // Ctrl+A to select all in multi-select mode
        if (key === 'a' && event.ctrlKey && multiSelect && selectable) {
          event.preventDefault();
          selectAll();
          break;
        }

        // Type-ahead: find item starting with pressed key
        if (key.length === 1 && /[a-zA-Z0-9]/.test(key)) {
          const startIndex = focusedIndex < 0 ? 0 : focusedIndex + 1;
          const foundIndex = findItemByFirstChar(key, startIndex);
          if (foundIndex >= 0) {
            setFocusedIndex(foundIndex);
          }
        }
        break;
    }
  }

  // Find first non-disabled index
  function findFirstNonDisabledIndex(): number {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item && !item.disabled) return i;
    }
    return 0;
  }

  // Find last non-disabled index
  function findLastNonDisabledIndex(): number {
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (item && !item.disabled) return i;
    }
    return items.length - 1;
  }

  // Find item by first character (type-ahead)
  function findItemByFirstChar(char: string, startIndex: number): number {
    const lowerChar = char.toLowerCase();

    // Search from startIndex to end
    for (let i = startIndex; i < items.length; i++) {
      const item = items[i];
      if (item && !item.disabled && item.primary.toLowerCase().startsWith(lowerChar)) {
        return i;
      }
    }

    // Wrap around and search from beginning
    for (let i = 0; i < startIndex; i++) {
      const item = items[i];
      if (item && !item.disabled && item.primary.toLowerCase().startsWith(lowerChar)) {
        return i;
      }
    }

    return -1;
  }

  // Get selected items
  function getSelectedItems(): ListBoxItem[] {
    return items.filter(item => selectedIds.has(item.id));
  }

  // Focus handler
  function handleFocus(): void {
    if (focusedIndex < 0 && items.length > 0) {
      // Focus first selected item or first non-disabled item
      const firstSelectedIndex = items.findIndex(item => selectedIds.has(item.id));
      if (firstSelectedIndex >= 0) {
        setFocusedIndex(firstSelectedIndex);
      } else {
        setFocusedIndex(findFirstNonDisabledIndex());
      }
    }
  }

  // Blur handler
  function handleBlur(): void {
    // Keep focus index but remove visual indicator
    if (focusedIndex >= 0) {
      const focused = list.children[focusedIndex] as HTMLElement;
      if (focused) {
        focused.classList.remove('dos-listbox___item--focused');
      }
    }
  }

  // Attach event listeners
  container.addEventListener('keydown', handleKeyDown);
  container.addEventListener('focus', handleFocus);
  container.addEventListener('blur', handleBlur);

  // Initial render
  renderItems();

  // Return instance
  const instance: ListBoxInstance = {
    element: container,

    setItems(newItems: ListBoxItem[]): void {
      items = [...newItems];
      // Filter out selected IDs that no longer exist
      const validIds = new Set(items.map(item => item.id));
      selectedIds = new Set([...selectedIds].filter(id => validIds.has(id)));
      focusedIndex = -1;
      renderItems();
    },

    getItems(): ListBoxItem[] {
      return [...items];
    },

    selectItems(ids: string[]): void {
      if (!selectable) return;

      if (multiSelect) {
        ids.forEach(id => {
          const item = items.find(i => i.id === id);
          if (item && !item.disabled) {
            selectedIds.add(id);
          }
        });
      } else {
        // Single select - only select the first valid ID
        selectedIds.clear();
        for (const id of ids) {
          const item = items.find(i => i.id === id);
          if (item && !item.disabled) {
            selectedIds.add(id);
            break;
          }
        }
      }

      updateSelectionUI();

      if (onSelect) {
        onSelect(getSelectedItems());
      }
    },

    clearSelection(): void {
      selectedIds.clear();
      updateSelectionUI();

      if (onSelect) {
        onSelect([]);
      }
    },

    selectAll(): void {
      if (!selectable || !multiSelect) return;

      items.forEach(item => {
        if (!item.disabled) {
          selectedIds.add(item.id);
        }
      });

      updateSelectionUI();

      if (onSelect) {
        onSelect(getSelectedItems());
      }
    },

    toggleSelection(id: string): void {
      if (!selectable) return;

      const item = items.find(i => i.id === id);
      if (!item || item.disabled) return;

      if (selectedIds.has(id)) {
        selectedIds.delete(id);
      } else {
        if (!multiSelect) {
          selectedIds.clear();
        }
        selectedIds.add(id);
      }

      updateSelectionUI();

      if (onSelect) {
        onSelect(getSelectedItems());
      }
    },

    getSelectedItems,

    getSelectedIds(): string[] {
      return [...selectedIds];
    },

    getSelectedData(): ListBoxItem[] {
      return getSelectedItems();
    },

    focus(): void {
      container.focus();
    },

    focusItem(id: string): void {
      const index = items.findIndex(item => item.id === id);
      if (index >= 0) {
        setFocusedIndex(index);
        container.focus();
      }
    },

    scrollToItem(id: string): void {
      const index = items.findIndex(item => item.id === id);
      if (index >= 0) {
        const itemEl = list.children[index] as HTMLElement;
        if (itemEl && typeof itemEl.scrollIntoView === 'function') {
          itemEl.scrollIntoView({ block: 'nearest' });
        }
      }
    },

    setItemDisabled(id: string, disabled: boolean): void {
      const item = items.find(i => i.id === id);
      if (item) {
        item.disabled = disabled;
        if (disabled) {
          selectedIds.delete(id);
        }
        renderItems();
      }
    },

    isSelected(id: string): boolean {
      return selectedIds.has(id);
    },

    getItemById(id: string): ListBoxItem | undefined {
      return items.find(item => item.id === id);
    },

    addItem(item: ListBoxItem, index?: number): void {
      if (index === undefined || index >= items.length) {
        items.push(item);
      } else {
        items.splice(Math.max(0, index), 0, item);
      }
      renderItems();
    },

    removeItem(id: string): void {
      const index = items.findIndex(item => item.id === id);
      if (index >= 0) {
        items.splice(index, 1);
        selectedIds.delete(id);

        // Adjust focus index
        if (focusedIndex >= items.length) {
          focusedIndex = items.length - 1;
        }

        renderItems();
      }
    },

    updateItem(id: string, updates: Partial<ListBoxItem>): void {
      const item = items.find(i => i.id === id);
      if (item) {
        Object.assign(item, updates);
        renderItems();
      }
    },

    destroy(): void {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('focus', handleFocus);
      container.removeEventListener('blur', handleBlur);
      container.remove();
    },
  };

  // Helper method for select all (used internally and via instance)
  function selectAll(): void {
    instance.selectAll();
  }

  return instance;
}
