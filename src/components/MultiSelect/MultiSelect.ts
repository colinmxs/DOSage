/**
 * MultiSelect Component
 *
 * A DOS-style multi-select component with tag/chip display for selected items
 * and a searchable dropdown for option selection.
 */

import type {
  MultiSelectProps,
  MultiSelectOption,
  MultiSelectState,
  MultiSelectElement,
  MultiSelectChangeEventDetail,
} from './MultiSelect.types';
import { createDOSCursor, type DOSCursorInstance } from '../../utils/DOSCursor';
import './MultiSelect.css';

/**
 * Creates a DOS-style multi-select component.
 *
 * @param props - MultiSelect configuration options
 * @returns The multi-select element with attached methods
 *
 * @example
 * ```typescript
 * import { createMultiSelect } from 'dosage';
 *
 * const select = createMultiSelect({
 *   options: [
 *     { value: 'a', label: 'Option A' },
 *     { value: 'b', label: 'Option B' },
 *     { value: 'c', label: 'Option C' },
 *   ],
 *   placeholder: 'Select options...',
 *   searchable: true,
 *   onChange: (values) => console.log('Selected:', values)
 * });
 *
 * document.body.appendChild(select);
 * ```
 */
export function createMultiSelect(props: MultiSelectProps): MultiSelectElement {
  const {
    options: initialOptions,
    groups = [],
    value: initialValue = [],
    placeholder = 'Select...',
    disabled: initialDisabled = false,
    required: _required = false,
    name: _name = '',
    searchable = false,
    searchPlaceholder = 'Search...',
    maxSelections,
    showSelectAll = false,
    selectAllLabel = 'Select All',
    showClearAll = false,
    clearAllLabel = 'Clear All',
    filterFunction,
    renderOption,
    renderTag,
    noMatchesMessage = 'No matches found',
    maxSelectionsMessage = 'Maximum selections reached',
    maxDropdownHeight,
    className,
    id,
    onChange,
    onDropdownToggle,
    onSearch,
  } = props;

  // Options (mutable)
  let options = [...initialOptions];

  // State
  const state: MultiSelectState = {
    selectedValues: [...initialValue],
    isOpen: false,
    searchQuery: '',
    highlightedIndex: -1,
    filteredOptions: [],
  };

  // Disabled state
  let isDisabled = initialDisabled;

  // Create container
  const container = document.createElement('div') as MultiSelectElement;
  container.className = buildContainerClasses();
  if (id) {
    container.id = id;
  }

  // Create trigger area (shows tags and opens dropdown)
  const trigger = document.createElement('div');
  trigger.className = 'dos-multiselect__trigger';
  trigger.setAttribute('tabindex', isDisabled ? '-1' : '0');
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  const listboxId = `${id ?? 'multiselect'}-listbox`;
  trigger.setAttribute('aria-controls', listboxId);

  // Create tags container
  const tagsContainer = document.createElement('div');
  tagsContainer.className = 'dos-multiselect__tags';

  // Create placeholder
  const placeholderEl = document.createElement('span');
  placeholderEl.className = 'dos-multiselect__placeholder';
  placeholderEl.textContent = placeholder;

  // Create dropdown toggle arrow
  const arrow = document.createElement('span');
  arrow.className = 'dos-multiselect__arrow';
  arrow.innerHTML = '▼';
  arrow.setAttribute('aria-hidden', 'true');

  trigger.appendChild(tagsContainer);
  trigger.appendChild(arrow);

  // Create dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'dos-multiselect__dropdown';
  dropdown.hidden = true;

  if (maxDropdownHeight) {
    dropdown.style.maxHeight = `${maxDropdownHeight}px`;
  }

  // Create search input (if searchable)
  let searchInput: HTMLInputElement | null = null;
  let searchWrapper: HTMLDivElement | null = null;
  let cursor: DOSCursorInstance | null = null;
  if (searchable) {
    searchWrapper = document.createElement('div');
    searchWrapper.className = 'dos-multiselect__search';

    searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'dos-multiselect__search-input';
    searchInput.placeholder = searchPlaceholder;
    searchInput.setAttribute('aria-label', 'Search options');

    searchWrapper.appendChild(searchInput);
    dropdown.appendChild(searchWrapper);
    
    // Initialize DOS block cursor overlay for search input
    if (!initialDisabled) {
      cursor = createDOSCursor({
        input: searchInput,
        wrapper: searchWrapper,
        readonly: false,
        disabled: initialDisabled,
      });
    }
  }

  // Create actions (Select All / Clear All)
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'dos-multiselect__actions';

  if (showSelectAll) {
    const selectAllBtn = document.createElement('button');
    selectAllBtn.type = 'button';
    selectAllBtn.className = 'dos-multiselect__action-btn';
    selectAllBtn.textContent = `[${selectAllLabel}]`;
    selectAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleSelectAll();
    });
    actionsContainer.appendChild(selectAllBtn);
  }

  if (showClearAll) {
    const clearAllBtn = document.createElement('button');
    clearAllBtn.type = 'button';
    clearAllBtn.className = 'dos-multiselect__action-btn';
    clearAllBtn.textContent = `[${clearAllLabel}]`;
    clearAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleClearAll();
    });
    actionsContainer.appendChild(clearAllBtn);
  }

  if (showSelectAll || showClearAll) {
    dropdown.appendChild(actionsContainer);
  }

  // Create options list
  const optionsList = document.createElement('div');
  optionsList.id = listboxId;
  optionsList.className = 'dos-multiselect__options';
  optionsList.setAttribute('role', 'listbox');
  optionsList.setAttribute('aria-multiselectable', 'true');

  dropdown.appendChild(optionsList);

  // Create no matches message
  const noMatchesEl = document.createElement('div');
  noMatchesEl.className = 'dos-multiselect__no-matches';
  noMatchesEl.textContent = noMatchesMessage;
  noMatchesEl.hidden = true;

  // Create max selections message
  const maxSelectionsEl = document.createElement('div');
  maxSelectionsEl.className = 'dos-multiselect__max-message';
  maxSelectionsEl.textContent = maxSelectionsMessage;
  maxSelectionsEl.hidden = true;

  // Assemble container
  container.appendChild(trigger);
  container.appendChild(dropdown);

  // Initialize
  renderTags();

  /**
   * Build container class string
   */
  function buildContainerClasses(): string {
    const classes = ['dos-multiselect'];
    if (isDisabled) {
      classes.push('dos-multiselect--disabled');
    }
    if (state.isOpen) {
      classes.push('dos-multiselect--open');
    }
    if (state.selectedValues.length > 0) {
      classes.push('dos-multiselect--has-value');
    }
    if (className) {
      classes.push(className);
    }
    return classes.join(' ');
  }

  /**
   * Update container classes
   */
  function updateContainerClasses(): void {
    container.className = buildContainerClasses();
  }

  /**
   * Default filter function
   */
  function defaultFilter(option: MultiSelectOption, query: string): boolean {
    if (!query) return true;
    const normalizedQuery = query.toLowerCase();
    const searchText = [option.label, option.description, option.value]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return searchText.includes(normalizedQuery);
  }

  /**
   * Filter options based on search query
   */
  function filterOptions(query: string): MultiSelectOption[] {
    if (!query) {
      return [...options];
    }

    const filter = filterFunction ?? defaultFilter;
    return options.filter((option) => filter(option, query));
  }

  /**
   * Render selected tags
   */
  function renderTags(): void {
    tagsContainer.innerHTML = '';

    if (state.selectedValues.length === 0) {
      tagsContainer.appendChild(placeholderEl);
      return;
    }

    state.selectedValues.forEach((value) => {
      const option = options.find((o) => o.value === value);
      if (!option) return;

      const tag = document.createElement('span');
      tag.className = 'dos-multiselect__tag';
      tag.setAttribute('data-value', value);

      if (renderTag) {
        const content = renderTag(option);
        if (typeof content === 'string') {
          tag.innerHTML = content;
        } else {
          tag.appendChild(content);
        }
      } else {
        const label = document.createElement('span');
        label.className = 'dos-multiselect__tag-label';
        label.textContent = option.label;
        tag.appendChild(label);

        if (!isDisabled) {
          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'dos-multiselect__tag-remove';
          removeBtn.textContent = '×';
          removeBtn.setAttribute('aria-label', `Remove ${option.label}`);
          removeBtn.setAttribute('tabindex', '-1');
          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deselectOption(value);
          });
          tag.appendChild(removeBtn);
        }
      }

      tagsContainer.appendChild(tag);
    });
  }

  /**
   * Open dropdown
   */
  function openDropdown(): void {
    if (state.isOpen || isDisabled) return;

    state.isOpen = true;
    state.filteredOptions = filterOptions(state.searchQuery);
    state.highlightedIndex = -1;

    dropdown.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    updateContainerClasses();

    renderOptions();

    if (searchInput) {
      searchInput.focus();
    }

    if (onDropdownToggle) {
      onDropdownToggle(true);
    }
  }

  /**
   * Close dropdown
   */
  function closeDropdown(): void {
    if (!state.isOpen) return;

    state.isOpen = false;
    state.highlightedIndex = -1;
    state.searchQuery = '';
    dropdown.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');

    if (searchInput) {
      searchInput.value = '';
    }

    updateContainerClasses();

    if (onDropdownToggle) {
      onDropdownToggle(false);
    }
  }

  /**
   * Toggle dropdown
   */
  function toggleDropdown(): void {
    if (state.isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  /**
   * Render options in dropdown
   */
  function renderOptions(): void {
    optionsList.innerHTML = '';

    // Check if max reached
    const maxReached = maxSelections !== undefined && state.selectedValues.length >= maxSelections;

    if (state.filteredOptions.length === 0) {
      noMatchesEl.hidden = false;
      optionsList.appendChild(noMatchesEl);
      return;
    }

    noMatchesEl.hidden = true;

    // Group options if groups are defined
    if (groups.length > 0) {
      renderGroupedOptions(maxReached);
    } else {
      renderFlatOptions(maxReached);
    }
  }

  /**
   * Render grouped options
   */
  function renderGroupedOptions(maxReached: boolean): void {
    const groupedOptions = new Map<string, MultiSelectOption[]>();

    state.filteredOptions.forEach((option) => {
      const groupId = option.group ?? 'ungrouped';
      if (!groupedOptions.has(groupId)) {
        groupedOptions.set(groupId, []);
      }
      const groupOptions = groupedOptions.get(groupId);
      if (groupOptions) {
        groupOptions.push(option);
      }
    });

    let globalIndex = 0;

    // Render groups in order
    groups.forEach((group) => {
      const groupOptions = groupedOptions.get(group.id);
      if (!groupOptions || groupOptions.length === 0) return;

      // Group header
      const header = document.createElement('div');
      header.className = 'dos-multiselect__group-header';
      header.textContent = group.icon ? `${group.icon} ${group.label}` : group.label;
      header.setAttribute('role', 'presentation');
      optionsList.appendChild(header);

      // Group options
      groupOptions.forEach((option) => {
        const item = createOptionElement(option, globalIndex, maxReached);
        optionsList.appendChild(item);
        globalIndex++;
      });
    });

    // Render ungrouped options at the end
    const ungrouped = groupedOptions.get('ungrouped');
    if (ungrouped && ungrouped.length > 0) {
      ungrouped.forEach((option) => {
        const item = createOptionElement(option, globalIndex, maxReached);
        optionsList.appendChild(item);
        globalIndex++;
      });
    }
  }

  /**
   * Render flat options list
   */
  function renderFlatOptions(maxReached: boolean): void {
    state.filteredOptions.forEach((option, index) => {
      const item = createOptionElement(option, index, maxReached);
      optionsList.appendChild(item);
    });
  }

  /**
   * Create option element
   */
  function createOptionElement(option: MultiSelectOption, index: number, maxReached: boolean): HTMLElement {
    const item = document.createElement('div');
    item.id = `${id ?? 'multiselect'}-option-${index}`;
    item.className = 'dos-multiselect__option';
    item.setAttribute('role', 'option');
    item.setAttribute('data-value', option.value);
    item.setAttribute('data-index', String(index));

    const isSelected = state.selectedValues.includes(option.value);
    const isHighlighted = index === state.highlightedIndex;
    const isOptionDisabled = option.disabled ?? (maxReached && !isSelected);

    if (isOptionDisabled) {
      item.classList.add('dos-multiselect__option--disabled');
      item.setAttribute('aria-disabled', 'true');
    }

    if (isSelected) {
      item.classList.add('dos-multiselect__option--selected');
      item.setAttribute('aria-selected', 'true');
    } else {
      item.setAttribute('aria-selected', 'false');
    }

    if (isHighlighted) {
      item.classList.add('dos-multiselect__option--highlighted');
    }

    // Custom render function
    if (renderOption) {
      const content = renderOption(option, isHighlighted, isSelected);
      if (typeof content === 'string') {
        item.innerHTML = content;
      } else {
        item.appendChild(content);
      }
    } else {
      // Default rendering with checkbox
      const checkbox = document.createElement('span');
      checkbox.className = 'dos-multiselect__checkbox';
      checkbox.textContent = isSelected ? '[X]' : '[ ]';
      checkbox.setAttribute('aria-hidden', 'true');
      item.appendChild(checkbox);

      const content = document.createElement('div');
      content.className = 'dos-multiselect__option-content';

      if (option.icon) {
        const icon = document.createElement('span');
        icon.className = 'dos-multiselect__option-icon';
        icon.textContent = option.icon;
        icon.setAttribute('aria-hidden', 'true');
        content.appendChild(icon);
      }

      const label = document.createElement('span');
      label.className = 'dos-multiselect__option-label';
      label.textContent = option.label;
      content.appendChild(label);

      if (option.description) {
        const desc = document.createElement('span');
        desc.className = 'dos-multiselect__option-description';
        desc.textContent = option.description;
        content.appendChild(desc);
      }

      item.appendChild(content);
    }

    // Click handler
    item.addEventListener('click', () => {
      if (!isOptionDisabled) {
        toggleOption(option.value);
      }
    });

    // Hover handler
    item.addEventListener('mouseenter', () => {
      if (!isOptionDisabled) {
        state.highlightedIndex = index;
        updateHighlight();
      }
    });

    return item;
  }

  /**
   * Update highlight state
   */
  function updateHighlight(): void {
    const items = optionsList.querySelectorAll('.dos-multiselect__option');
    items.forEach((item, index) => {
      if (index === state.highlightedIndex) {
        item.classList.add('dos-multiselect__option--highlighted');
        if (typeof item.scrollIntoView === 'function') {
          (item as HTMLElement).scrollIntoView({ block: 'nearest' });
        }
      } else {
        item.classList.remove('dos-multiselect__option--highlighted');
      }
    });

    // Update aria-activedescendant
    if (state.highlightedIndex >= 0) {
      const activeId = `${id ?? 'multiselect'}-option-${state.highlightedIndex}`;
      trigger.setAttribute('aria-activedescendant', activeId);
    } else {
      trigger.setAttribute('aria-activedescendant', '');
    }
  }

  /**
   * Select an option
   */
  function selectOption(value: string): void {
    if (state.selectedValues.includes(value)) return;
    if (maxSelections !== undefined && state.selectedValues.length >= maxSelections) return;

    const option = options.find((o) => o.value === value);
    if (!option || option.disabled) return;

    state.selectedValues.push(value);

    renderTags();
    updateContainerClasses();
    if (state.isOpen) {
      renderOptions();
    }

    dispatchChangeEvent(option, 'add');
  }

  /**
   * Deselect an option
   */
  function deselectOption(value: string): void {
    const index = state.selectedValues.indexOf(value);
    if (index === -1) return;

    const option = options.find((o) => o.value === value);
    state.selectedValues.splice(index, 1);

    renderTags();
    updateContainerClasses();
    if (state.isOpen) {
      renderOptions();
    }

    dispatchChangeEvent(option ?? null, 'remove');
  }

  /**
   * Toggle an option
   */
  function toggleOption(value: string): void {
    if (state.selectedValues.includes(value)) {
      deselectOption(value);
    } else {
      selectOption(value);
    }
  }

  /**
   * Select all options
   */
  function handleSelectAll(): void {
    const enabledOptions = options.filter((o) => !o.disabled);
    let newSelections: string[];

    if (maxSelections !== undefined) {
      newSelections = enabledOptions.slice(0, maxSelections).map((o) => o.value);
    } else {
      newSelections = enabledOptions.map((o) => o.value);
    }

    state.selectedValues = newSelections;

    renderTags();
    updateContainerClasses();
    renderOptions();

    dispatchChangeEvent(null, 'selectAll');
  }

  /**
   * Clear all selections
   */
  function handleClearAll(): void {
    state.selectedValues = [];

    renderTags();
    updateContainerClasses();
    renderOptions();

    dispatchChangeEvent(null, 'clear');
  }

  /**
   * Dispatch change event
   */
  function dispatchChangeEvent(
    changedOption: MultiSelectOption | null,
    action: 'add' | 'remove' | 'clear' | 'selectAll'
  ): void {
    const selectedOptions = options.filter((o) => state.selectedValues.includes(o.value));

    const event = new CustomEvent<MultiSelectChangeEventDetail>('dos:multiselect:change', {
      bubbles: true,
      detail: {
        values: [...state.selectedValues],
        options: selectedOptions,
        changedOption: changedOption ?? null,
        action,
      },
    });
    container.dispatchEvent(event);

    if (onChange) {
      onChange([...state.selectedValues], selectedOptions);
    }
  }

  /**
   * Handle search input
   */
  function handleSearchInput(): void {
    if (!searchInput) return;

    const query = searchInput.value;
    state.searchQuery = query;
    state.filteredOptions = filterOptions(query);
    state.highlightedIndex = state.filteredOptions.length > 0 ? 0 : -1;

    renderOptions();

    if (onSearch) {
      onSearch(query);
    }
  }

  /**
   * Find next non-disabled option index
   */
  function findNextEnabledIndex(startIndex: number, direction: 1 | -1): number {
    const maxReached = maxSelections !== undefined && state.selectedValues.length >= maxSelections;
    const len = state.filteredOptions.length;

    for (let i = 0; i < len; i++) {
      const index = (startIndex + direction * (i + 1) + len) % len;
      const option = state.filteredOptions[index];
      if (!option) continue;
      const isSelected = state.selectedValues.includes(option.value);
      if (!option.disabled && (!maxReached || isSelected)) {
        return index;
      }
    }

    return -1;
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!state.isOpen) {
          openDropdown();
        } else if (state.filteredOptions.length > 0) {
          const nextIndex = findNextEnabledIndex(state.highlightedIndex, 1);
          if (nextIndex !== -1) {
            state.highlightedIndex = nextIndex;
            updateHighlight();
          }
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!state.isOpen) {
          openDropdown();
        } else if (state.filteredOptions.length > 0) {
          const prevIndex = findNextEnabledIndex(state.highlightedIndex, -1);
          if (prevIndex !== -1) {
            state.highlightedIndex = prevIndex;
            updateHighlight();
          }
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (state.isOpen && state.highlightedIndex >= 0) {
          const option = state.filteredOptions[state.highlightedIndex];
          if (option && !option.disabled) {
            toggleOption(option.value);
          }
        } else if (!state.isOpen) {
          openDropdown();
        }
        break;

      case ' ':
        if (state.isOpen && state.highlightedIndex >= 0) {
          event.preventDefault();
          const option = state.filteredOptions[state.highlightedIndex];
          if (option && !option.disabled) {
            toggleOption(option.value);
          }
        } else if (!state.isOpen && event.target === trigger) {
          event.preventDefault();
          openDropdown();
        }
        break;

      case 'Escape':
        event.preventDefault();
        closeDropdown();
        trigger.focus();
        break;

      case 'Backspace':
        if (searchInput?.value === '' && state.selectedValues.length > 0) {
          // Remove last tag
          const lastValue = state.selectedValues[state.selectedValues.length - 1];
          if (lastValue !== undefined) {
            deselectOption(lastValue);
          }
        }
        break;

      case 'Home':
        if (state.isOpen && state.filteredOptions.length > 0) {
          event.preventDefault();
          const firstIndex = findNextEnabledIndex(-1, 1);
          if (firstIndex !== -1) {
            state.highlightedIndex = firstIndex;
            updateHighlight();
          }
        }
        break;

      case 'End':
        if (state.isOpen && state.filteredOptions.length > 0) {
          event.preventDefault();
          const lastIndex = findNextEnabledIndex(state.filteredOptions.length, -1);
          if (lastIndex !== -1) {
            state.highlightedIndex = lastIndex;
            updateHighlight();
          }
        }
        break;
    }
  }

  /**
   * Handle trigger focus
   */
  function handleFocus(): void {
    container.classList.add('dos-multiselect--focused');
  }

  /**
   * Handle trigger blur
   */
  function handleBlur(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as Node | null;
    if (!container.contains(relatedTarget)) {
      container.classList.remove('dos-multiselect--focused');
      closeDropdown();
    }
  }

  /**
   * Handle clicks outside
   */
  function handleDocumentClick(event: MouseEvent): void {
    if (!container.contains(event.target as Node)) {
      closeDropdown();
    }
  }

  // Set up event listeners
  trigger.addEventListener('click', toggleDropdown);
  trigger.addEventListener('keydown', handleKeyDown);
  trigger.addEventListener('focus', handleFocus);
  trigger.addEventListener('blur', handleBlur);

  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleKeyDown);
  }

  document.addEventListener('click', handleDocumentClick);

  // Public API
  container.getValue = (): string[] => [...state.selectedValues];

  container.setValue = (values: string[]): void => {
    state.selectedValues = values.filter((v) => options.some((o) => o.value === v));
    if (maxSelections !== undefined && state.selectedValues.length > maxSelections) {
      state.selectedValues = state.selectedValues.slice(0, maxSelections);
    }
    renderTags();
    updateContainerClasses();
    if (state.isOpen) {
      renderOptions();
    }
  };

  container.getSelectedOptions = (): MultiSelectOption[] => {
    return options.filter((o) => state.selectedValues.includes(o.value));
  };

  container.select = (value: string): void => selectOption(value);
  container.deselect = (value: string): void => deselectOption(value);
  container.toggle = (value: string): void => toggleOption(value);
  container.selectAll = (): void => handleSelectAll();
  container.clearAll = (): void => handleClearAll();

  container.open = (): void => openDropdown();
  container.close = (): void => closeDropdown();
  container.isOpen = (): boolean => state.isOpen;

  container.getHighlightedOption = (): MultiSelectOption | null => {
    if (state.highlightedIndex >= 0 && state.highlightedIndex < state.filteredOptions.length) {
      return state.filteredOptions[state.highlightedIndex] ?? null;
    }
    return null;
  };

  container.setOptions = (newOptions: MultiSelectOption[]): void => {
    options = [...newOptions];
    // Remove any selected values that are no longer in options
    state.selectedValues = state.selectedValues.filter((v) => options.some((o) => o.value === v));
    renderTags();
    if (state.isOpen) {
      state.filteredOptions = filterOptions(state.searchQuery);
      renderOptions();
    }
  };

  container.getOptions = (): MultiSelectOption[] => [...options];

  container.setSearchQuery = (query: string): void => {
    state.searchQuery = query;
    if (searchInput) {
      searchInput.value = query;
    }
    state.filteredOptions = filterOptions(query);
    if (state.isOpen) {
      renderOptions();
    }
  };

  container.getSearchQuery = (): string => state.searchQuery;

  container.focus = (): void => trigger.focus();
  container.blur = (): void => trigger.blur();

  container.isDisabled = (): boolean => isDisabled;

  container.setDisabled = (disabled: boolean): void => {
    isDisabled = disabled;
    trigger.setAttribute('tabindex', disabled ? '-1' : '0');
    updateContainerClasses();
    renderTags();
    // Update cursor disabled state
    cursor?.setDisabled(disabled);
    if (disabled) {
      closeDropdown();
    }
  };

  container.isMaxSelectionsReached = (): boolean => {
    return maxSelections !== undefined && state.selectedValues.length >= maxSelections;
  };

  container.destroy = (): void => {
    trigger.removeEventListener('click', toggleDropdown);
    trigger.removeEventListener('keydown', handleKeyDown);
    trigger.removeEventListener('focus', handleFocus);
    trigger.removeEventListener('blur', handleBlur);
    if (searchInput) {
      searchInput.removeEventListener('input', handleSearchInput);
      searchInput.removeEventListener('keydown', handleKeyDown);
    }
    document.removeEventListener('click', handleDocumentClick);
    // Clean up cursor
    cursor?.destroy();
    cursor = null;
  };

  return container;
}
