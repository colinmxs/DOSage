/**
 * Combobox Component
 *
 * A DOS-style combobox with text input, dropdown toggle, and type-ahead filtering.
 * Supports free-form input or strict mode (must match an option).
 */

import type {
  ComboboxProps,
  ComboboxOption,
  ComboboxGroup,
  ComboboxState,
  ComboboxElement,
  ComboboxChangeEventDetail,
} from './Combobox.types';
import { createDOSCursor, type DOSCursorInstance } from '../../utils/DOSCursor';
import './Combobox.css';

/**
 * Creates a DOS-style combobox component.
 *
 * @param props - Combobox configuration options
 * @returns The combobox element with attached methods
 *
 * @example
 * ```typescript
 * import { createCombobox } from 'dosage';
 *
 * const combo = createCombobox({
 *   options: [
 *     { value: 'a', label: 'Option A' },
 *     { value: 'b', label: 'Option B' },
 *   ],
 *   placeholder: 'Select an option...',
 *   onChange: (value, option) => console.log(`Selected: ${value}`)
 * });
 *
 * document.body.appendChild(combo);
 * ```
 */
export function createCombobox(props: ComboboxProps): ComboboxElement {
  const {
    options: initialOptions,
    groups = [],
    value: initialValue = '',
    placeholder = 'Select...',
    allowFreeform = false,
    strict = false,
    filterOnType = true,
    filterFunction,
    renderOption,
    disabled: initialDisabled = false,
    required = false,
    name,
    noMatchesMessage = 'No matches found',
    maxDropdownHeight,
    className,
    id,
    onChange,
    onDropdownToggle,
    onInput,
  } = props;

  // Options (mutable)
  let options = [...initialOptions];

  // State
  const state: ComboboxState = {
    inputValue: '',
    selectedValue: initialValue,
    isOpen: false,
    highlightedIndex: -1,
    filteredOptions: [],
  };

  // Disabled state
  let isDisabled = initialDisabled;

  // Create container
  const container = document.createElement('div') as unknown as ComboboxElement;
  container.className = buildContainerClasses();
  if (id) {
    container.id = id;
  }

  // Create input wrapper
  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'dos-combobox__wrapper';

  // Create input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'dos-combobox__input';
  input.placeholder = placeholder;
  input.disabled = isDisabled;
  input.required = required;
  if (name) {
    input.name = name;
  }

  // Set initial input value from selected option
  const initialOption = options.find((o) => o.value === initialValue);
  if (initialOption) {
    input.value = initialOption.label;
    state.inputValue = initialOption.label;
  }

  // Combobox ARIA
  const listboxId = `${id ?? 'combobox'}-listbox`;
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', filterOnType ? 'list' : 'none');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', listboxId);
  input.setAttribute('aria-haspopup', 'listbox');

  // Create dropdown toggle button
  const toggleButton = document.createElement('button');
  toggleButton.type = 'button';
  toggleButton.className = 'dos-combobox__toggle';
  toggleButton.innerHTML = '<span class="dos-combobox__arrow">▼</span>';
  toggleButton.setAttribute('aria-label', 'Toggle dropdown');
  toggleButton.setAttribute('tabindex', '-1');
  toggleButton.disabled = isDisabled;

  inputWrapper.appendChild(input);
  inputWrapper.appendChild(toggleButton);

  // Create dropdown
  const dropdown = document.createElement('div');
  dropdown.id = listboxId;
  dropdown.className = 'dos-combobox__dropdown';
  dropdown.setAttribute('role', 'listbox');
  dropdown.hidden = true;

  if (maxDropdownHeight) {
    dropdown.style.maxHeight = `${maxDropdownHeight}px`;
  }

  // Create no matches message
  const noMatchesEl = document.createElement('div');
  noMatchesEl.className = 'dos-combobox__no-matches';
  noMatchesEl.textContent = noMatchesMessage;
  noMatchesEl.hidden = true;

  // Assemble container
  container.appendChild(inputWrapper);
  container.appendChild(dropdown);

  // Initialize DOS block cursor overlay
  let cursor: DOSCursorInstance | null = null;
  if (!initialDisabled) {
    cursor = createDOSCursor({
      input,
      wrapper: inputWrapper,
      readonly: false,
      disabled: initialDisabled,
    });
  }

  /**
   * Build container class string
   */
  function buildContainerClasses(): string {
    const classes = ['dos-combobox'];
    if (isDisabled) {
      classes.push('dos-combobox--disabled');
    }
    if (state.isOpen) {
      classes.push('dos-combobox--open');
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
  function defaultFilter(option: ComboboxOption, query: string): boolean {
    if (!query) return true;
    const normalizedQuery = query.toLowerCase();
    const searchText = [option.label, option.description, option.value]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return searchText.includes(normalizedQuery);
  }

  /**
   * Filter options based on query
   */
  function filterOptions(query: string): ComboboxOption[] {
    if (!filterOnType || !query) {
      // Return all options (including disabled ones) when not filtering
      return [...options];
    }

    const filter = filterFunction ?? defaultFilter;
    return options.filter((option) => {
      return filter(option, query);
    });
  }

  /**
   * Find next non-disabled option index
   */
  function findNextEnabledIndex(startIndex: number, direction: 1 | -1): number {
    if (state.filteredOptions.length === 0) return -1;
    
    const length = state.filteredOptions.length;
    let index = startIndex;
    let attempts = 0;
    
    // Try to find a non-disabled option, max one full loop
    while (attempts < length) {
      index = direction === 1
        ? (index + 1) % length
        : (index - 1 + length) % length;
      
      const option = state.filteredOptions[index];
      if (option && !option.disabled) {
        return index;
      }
      attempts++;
    }
    
    // All options are disabled, return -1
    return -1;
  }

  /**
   * Find first non-disabled option index
   */
  function findFirstEnabledIndex(): number {
    return state.filteredOptions.findIndex(opt => !opt.disabled);
  }

  /**
   * Find last non-disabled option index
   */
  function findLastEnabledIndex(): number {
    for (let i = state.filteredOptions.length - 1; i >= 0; i--) {
      if (!state.filteredOptions[i]?.disabled) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Open dropdown
   */
  function openDropdown(): void {
    if (state.isOpen || isDisabled) return;

    state.isOpen = true;
    state.filteredOptions = filterOptions(state.inputValue);
    
    // Set initial highlight to selected option or -1 (no highlight)
    // This allows arrow keys to move to first option on initial press
    const selectedIndex = findSelectedIndex();
    if (selectedIndex >= 0 && !state.filteredOptions[selectedIndex]?.disabled) {
      state.highlightedIndex = selectedIndex;
    } else {
      state.highlightedIndex = -1;
    }

    dropdown.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    updateContainerClasses();

    renderOptions();

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
    dropdown.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-activedescendant', '');
    updateContainerClasses();

    if (onDropdownToggle) {
      onDropdownToggle(false);
    }
  }

  /**
   * Find index of selected option in filtered options
   */
  function findSelectedIndex(): number {
    if (!state.selectedValue) return -1;
    const index = state.filteredOptions.findIndex((o) => o.value === state.selectedValue);
    return index;
  }

  /**
   * Render options in dropdown
   */
  function renderOptions(): void {
    dropdown.innerHTML = '';

    if (state.filteredOptions.length === 0) {
      noMatchesEl.hidden = false;
      dropdown.appendChild(noMatchesEl);
      return;
    }

    noMatchesEl.hidden = true;

    // Group options if groups are defined
    if (groups.length > 0) {
      renderGroupedOptions();
    } else {
      renderFlatOptions();
    }

    // Update aria-activedescendant
    if (state.highlightedIndex >= 0) {
      const activeId = `${id ?? 'combobox'}-option-${state.highlightedIndex}`;
      input.setAttribute('aria-activedescendant', activeId);
    }
  }

  /**
   * Render options grouped by category
   */
  function renderGroupedOptions(): void {
    const groupedOptions = new Map<string, ComboboxOption[]>();
    const groupMap = new Map<string, ComboboxGroup>();

    groups.forEach((g) => groupMap.set(g.id, g));

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
      header.className = 'dos-combobox__group-header';
      header.textContent = group.icon ? `${group.icon} ${group.label}` : group.label;
      header.setAttribute('role', 'presentation');
      dropdown.appendChild(header);

      // Group options
      groupOptions.forEach((option) => {
        const item = createOptionElement(option, globalIndex);
        dropdown.appendChild(item);
        globalIndex++;
      });
    });

    // Render ungrouped options at the end
    const ungrouped = groupedOptions.get('ungrouped');
    if (ungrouped && ungrouped.length > 0) {
      ungrouped.forEach((option) => {
        const item = createOptionElement(option, globalIndex);
        dropdown.appendChild(item);
        globalIndex++;
      });
    }
  }

  /**
   * Render flat options list
   */
  function renderFlatOptions(): void {
    state.filteredOptions.forEach((option, index) => {
      const item = createOptionElement(option, index);
      dropdown.appendChild(item);
    });
  }

  /**
   * Create option element
   */
  function createOptionElement(option: ComboboxOption, index: number): HTMLElement {
    const item = document.createElement('div');
    item.id = `${id ?? 'combobox'}-option-${index}`;
    item.className = 'dos-combobox__option';
    item.setAttribute('role', 'option');
    item.setAttribute('data-value', option.value);
    item.setAttribute('data-index', String(index));

    const isSelected = option.value === state.selectedValue;
    const isHighlighted = index === state.highlightedIndex;

    if (option.disabled) {
      item.classList.add('dos-combobox__option--disabled');
      item.setAttribute('aria-disabled', 'true');
    }

    if (isSelected) {
      item.classList.add('dos-combobox__option--selected');
      item.setAttribute('aria-selected', 'true');
    } else {
      item.setAttribute('aria-selected', 'false');
    }

    if (isHighlighted) {
      item.classList.add('dos-combobox__option--highlighted');
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
      // Default rendering
      if (option.icon) {
        const icon = document.createElement('span');
        icon.className = 'dos-combobox__option-icon';
        icon.textContent = option.icon;
        icon.setAttribute('aria-hidden', 'true');
        item.appendChild(icon);
      }

      const content = document.createElement('div');
      content.className = 'dos-combobox__option-content';

      const label = document.createElement('span');
      label.className = 'dos-combobox__option-label';
      label.textContent = option.label;
      content.appendChild(label);

      if (option.description) {
        const desc = document.createElement('span');
        desc.className = 'dos-combobox__option-description';
        desc.textContent = option.description;
        content.appendChild(desc);
      }

      item.appendChild(content);

      // Selection indicator
      if (isSelected) {
        const check = document.createElement('span');
        check.className = 'dos-combobox__option-check';
        check.textContent = '✓';
        check.setAttribute('aria-hidden', 'true');
        item.appendChild(check);
      }
    }

    // Click handler
    item.addEventListener('click', () => {
      if (!option.disabled) {
        selectOption(option);
      }
    });

    // Hover handler
    item.addEventListener('mouseenter', () => {
      if (!option.disabled) {
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
    const items = dropdown.querySelectorAll('.dos-combobox__option');
    items.forEach((item, index) => {
      if (index === state.highlightedIndex) {
        item.classList.add('dos-combobox__option--highlighted');
        if (typeof item.scrollIntoView === 'function') {
          item.scrollIntoView({ block: 'nearest' });
        }
      } else {
        item.classList.remove('dos-combobox__option--highlighted');
      }
    });

    // Update aria-activedescendant
    if (state.highlightedIndex >= 0) {
      const activeId = `${id ?? 'combobox'}-option-${state.highlightedIndex}`;
      input.setAttribute('aria-activedescendant', activeId);
    } else {
      input.setAttribute('aria-activedescendant', '');
    }
  }

  /**
   * Select an option
   */
  function selectOption(option: ComboboxOption): void {
    const previousValue = state.selectedValue;
    state.selectedValue = option.value;
    state.inputValue = option.label;
    input.value = option.label;

    closeDropdown();

    // Dispatch event
    const event = new CustomEvent<ComboboxChangeEventDetail>('dos:combobox:change', {
      bubbles: true,
      detail: {
        value: option.value,
        option,
        previousValue,
      },
    });
    container.dispatchEvent(event);

    if (onChange) {
      onChange(option.value, option);
    }
  }

  /**
   * Handle freeform value (not in options list)
   */
  function setFreeformValue(value: string): void {
    if (strict) {
      // In strict mode, revert to selected option or clear
      const selectedOption = options.find((o) => o.value === state.selectedValue);
      if (selectedOption) {
        input.value = selectedOption.label;
        state.inputValue = selectedOption.label;
      } else {
        input.value = '';
        state.inputValue = '';
        state.selectedValue = '';
      }
      return;
    }

    if (!allowFreeform) {
      // Try to find a matching option
      const match = options.find(
        (o) => o.label.toLowerCase() === value.toLowerCase() || o.value.toLowerCase() === value.toLowerCase()
      );
      if (match) {
        selectOption(match);
        return;
      }

      // Revert to previous
      const selectedOption = options.find((o) => o.value === state.selectedValue);
      if (selectedOption) {
        input.value = selectedOption.label;
        state.inputValue = selectedOption.label;
      } else {
        input.value = '';
        state.inputValue = '';
      }
      return;
    }

    // Freeform allowed
    const previousValue = state.selectedValue;
    state.selectedValue = value;
    state.inputValue = value;

    // Dispatch event
    const event = new CustomEvent<ComboboxChangeEventDetail>('dos:combobox:change', {
      bubbles: true,
      detail: {
        value,
        option: null,
        previousValue,
      },
    });
    container.dispatchEvent(event);

    if (onChange) {
      onChange(value, null);
    }
  }

  /**
   * Handle input changes
   */
  function handleInput(): void {
    const newValue = input.value;
    state.inputValue = newValue;

    if (onInput) {
      onInput(newValue);
    }

    // Update filtered options
    state.filteredOptions = filterOptions(newValue);
    
    // Set highlight to first enabled option
    const firstEnabled = findFirstEnabledIndex();
    state.highlightedIndex = firstEnabled;

    if (!state.isOpen && newValue.length > 0) {
      openDropdown();
    } else if (state.isOpen) {
      renderOptions();
    }
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
          // Find next enabled option
          if (state.highlightedIndex === -1) {
            // Start from beginning
            state.highlightedIndex = findFirstEnabledIndex();
          } else {
            const nextIndex = findNextEnabledIndex(state.highlightedIndex, 1);
            if (nextIndex >= 0) {
              state.highlightedIndex = nextIndex;
            }
          }
          updateHighlight();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!state.isOpen) {
          openDropdown();
        } else if (state.filteredOptions.length > 0) {
          // Find previous enabled option
          if (state.highlightedIndex === -1) {
            // Start from end
            state.highlightedIndex = findLastEnabledIndex();
          } else {
            const prevIndex = findNextEnabledIndex(state.highlightedIndex, -1);
            if (prevIndex >= 0) {
              state.highlightedIndex = prevIndex;
            }
          }
          updateHighlight();
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (state.isOpen && state.highlightedIndex >= 0) {
          const option = state.filteredOptions[state.highlightedIndex];
          if (option && !option.disabled) {
            selectOption(option);
          }
        } else if (!state.isOpen) {
          openDropdown();
        }
        break;

      case 'Escape':
        event.preventDefault();
        if (state.isOpen) {
          closeDropdown();
          // Revert input to selected value
          const selectedOption = options.find((o) => o.value === state.selectedValue);
          if (selectedOption) {
            input.value = selectedOption.label;
            state.inputValue = selectedOption.label;
          }
        }
        break;

      case 'Tab':
        // Close and commit value on Tab
        if (state.isOpen) {
          event.preventDefault(); // Prevent default Tab behavior when dropdown is open
          if (state.highlightedIndex >= 0) {
            const option = state.filteredOptions[state.highlightedIndex];
            if (option && !option.disabled) {
              selectOption(option);
            }
          } else {
            setFreeformValue(input.value);
          }
          closeDropdown();
          // Manually move focus to next/previous element after selection is complete
          setTimeout(() => {
            // Create a TreeWalker to find next focusable element
            const walker = document.createTreeWalker(
              document.body,
              NodeFilter.SHOW_ELEMENT,
              {
                acceptNode: (node) => {
                  const element = node as HTMLElement;
                  // Check if element is focusable
                  if (
                    element.tabIndex >= 0 &&
                    !element.hasAttribute('disabled') &&
                    element.offsetParent !== null // Check if visible
                  ) {
                    return NodeFilter.FILTER_ACCEPT;
                  }
                  return NodeFilter.FILTER_SKIP;
                }
              }
            );
            
            // Find current input in tree
            walker.currentNode = input;
            
            // Move to next or previous focusable element
            const nextElement = event.shiftKey 
              ? walker.previousNode() as HTMLElement | null
              : walker.nextNode() as HTMLElement | null;
            
            if (nextElement) {
              nextElement.focus();
            }
          }, 0);
        }
        break;

      case 'Home':
        if (state.isOpen && state.filteredOptions.length > 0) {
          event.preventDefault();
          state.highlightedIndex = findFirstEnabledIndex();
          updateHighlight();
        }
        break;

      case 'End':
        if (state.isOpen && state.filteredOptions.length > 0) {
          event.preventDefault();
          state.highlightedIndex = findLastEnabledIndex();
          updateHighlight();
        }
        break;
    }
  }

  /**
   * Handle focus
   */
  function handleFocus(): void {
    container.classList.add('dos-combobox--focused');
  }

  /**
   * Handle blur
   */
  function handleBlur(event: FocusEvent): void {
    container.classList.remove('dos-combobox--focused');

    const relatedTarget = event.relatedTarget as Node | null;
    if (!container.contains(relatedTarget)) {
      // Commit freeform value or revert
      if (state.isOpen) {
        setFreeformValue(input.value);
        closeDropdown();
      }
    }
  }

  /**
   * Handle toggle button click
   */
  function handleToggleClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (state.isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }

    input.focus();
  }

  /**
   * Handle clicks outside
   */
  function handleDocumentClick(event: MouseEvent): void {
    if (!container.contains(event.target as Node)) {
      if (state.isOpen) {
        setFreeformValue(input.value);
        closeDropdown();
      }
    }
  }

  // Set up event listeners
  input.addEventListener('input', handleInput);
  input.addEventListener('keydown', handleKeyDown);
  input.addEventListener('focus', handleFocus);
  input.addEventListener('blur', handleBlur);
  toggleButton.addEventListener('click', handleToggleClick);
  document.addEventListener('click', handleDocumentClick);

  // Public API
  container.getValue = (): string => state.selectedValue;

  container.setValue = (value: string): void => {
    const option = options.find((o) => o.value === value);
    if (option) {
      state.selectedValue = value;
      state.inputValue = option.label;
      input.value = option.label;
    } else if (allowFreeform) {
      state.selectedValue = value;
      state.inputValue = value;
      input.value = value;
    }
    // Update cursor position when value changes programmatically
    cursor?.updatePosition();
  };

  container.getSelectedOption = (): ComboboxOption | null => {
    return options.find((o) => o.value === state.selectedValue) ?? null;
  };

  container.open = (): void => openDropdown();
  container.close = (): void => closeDropdown();
  container.toggle = (): void => (state.isOpen ? closeDropdown() : openDropdown());
  container.isOpen = (): boolean => state.isOpen;

  container.getHighlightedOption = (): ComboboxOption | null => {
    if (state.highlightedIndex >= 0 && state.highlightedIndex < state.filteredOptions.length) {
      return state.filteredOptions[state.highlightedIndex] ?? null;
    }
    return null;
  };

  container.setOptions = (newOptions: ComboboxOption[]): void => {
    options = [...newOptions];
    if (state.isOpen) {
      state.filteredOptions = filterOptions(state.inputValue);
      renderOptions();
    }
  };

  container.getOptions = (): ComboboxOption[] => [...options];

  container.focus = (): void => input.focus();
  container.blur = (): void => input.blur();

  container.isDisabled = (): boolean => isDisabled;

  container.setDisabled = (disabled: boolean): void => {
    isDisabled = disabled;
    input.disabled = disabled;
    toggleButton.disabled = disabled;
    updateContainerClasses();
    // Update cursor disabled state
    cursor?.setDisabled(disabled);
    if (disabled) {
      closeDropdown();
    }
  };

  container.destroy = (): void => {
    input.removeEventListener('input', handleInput);
    input.removeEventListener('keydown', handleKeyDown);
    input.removeEventListener('focus', handleFocus);
    input.removeEventListener('blur', handleBlur);
    toggleButton.removeEventListener('click', handleToggleClick);
    document.removeEventListener('click', handleDocumentClick);
    // Clean up cursor
    cursor?.destroy();
    cursor = null;
  };

  return container;
}
