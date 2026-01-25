/**
 * Select Component
 *
 * A DOS-style dropdown/select component with keyboard navigation,
 * multiple selection support, and searchable filtering.
 */

import type { SelectProps, SelectElement, SelectOption } from './Select.types';
import './Select.css';

// Unique ID counter for select-label association
let selectIdCounter = 0;

/**
 * Generates a unique ID for select elements
 */
function generateSelectId(): string {
  return `dos-select-${++selectIdCounter}`;
}

/**
 * Creates a DOS-style select/dropdown element.
 *
 * @param props - Select configuration options
 * @returns The select wrapper element with methods
 *
 * @example
 * ```typescript
 * import { createSelect } from 'dosage';
 *
 * const select = createSelect({
 *   label: 'Choose a color',
 *   options: [
 *     { value: 'red', label: 'Red' },
 *     { value: 'green', label: 'Green' },
 *     { value: 'blue', label: 'Blue' }
 *   ],
 *   onChange: (value) => console.log('Selected:', value)
 * });
 *
 * document.body.appendChild(select);
 * ```
 */
export function createSelect(props: SelectProps): SelectElement {
  const {
    value: initialValue,
    options: initialOptions,
    placeholder = 'Select...',
    label,
    name,
    multiple = false,
    searchable = false,
    size = 'medium',
    disabled = false,
    required = false,
    error,
    maxVisibleOptions: _maxVisibleOptions = 6,
    onChange,
    onOpen,
    onClose,
    onFocus,
    onBlur,
    className,
    id,
  } = props;

  // Unused for now but preserved for future use
  void _maxVisibleOptions;

  // Generate unique ID
  const selectId = id || generateSelectId();
  const labelId = `${selectId}-label`;
  const listboxId = `${selectId}-listbox`;
  const errorId = `${selectId}-error`;

  // Internal state
  let options = [...initialOptions];
  let selectedValues: string[] = initializeValue(initialValue, multiple);
  let isOpenState = false;
  let isDisabledState = disabled;
  let errorState: string | boolean = error ?? false;
  let highlightedIndex = -1;
  let searchQuery = '';
  let filteredOptions = options;

  // Create wrapper element
  const wrapper = document.createElement('div') as SelectElement;
  wrapper.className = buildWrapperClasses(size, isDisabledState, errorState, isOpenState, className);
  wrapper.id = selectId;

  // Create label if provided
  let labelElement: HTMLLabelElement | null = null;
  if (label) {
    labelElement = document.createElement('label');
    labelElement.id = labelId;
    labelElement.className = 'dos-select__label';
    if (required) {
      labelElement.classList.add('dos-select__label--required');
    }
    labelElement.textContent = label;
    wrapper.appendChild(labelElement);
  }

  // Create trigger button
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'dos-select__trigger';
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', listboxId);
  if (label) {
    trigger.setAttribute('aria-labelledby', labelId);
  }
  if (isDisabledState) {
    trigger.disabled = true;
    trigger.setAttribute('aria-disabled', 'true');
  }

  // Create value display
  const valueDisplay = document.createElement('span');
  valueDisplay.className = 'dos-select__value';
  updateValueDisplay();

  // Create arrow indicator
  const arrow = document.createElement('span');
  arrow.className = 'dos-select__arrow';
  arrow.textContent = '▼';
  arrow.setAttribute('aria-hidden', 'true');

  trigger.appendChild(valueDisplay);
  trigger.appendChild(arrow);
  wrapper.appendChild(trigger);

  // Create dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'dos-select__dropdown';
  dropdown.id = listboxId;
  dropdown.setAttribute('role', 'listbox');
  dropdown.setAttribute('aria-multiselectable', String(multiple));
  if (label) {
    dropdown.setAttribute('aria-labelledby', labelId);
  }

  // Create search input if searchable
  let searchInput: HTMLInputElement | null = null;
  if (searchable) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'dos-select__search';

    searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'dos-select__search-input';
    searchInput.placeholder = 'Type to search...';
    searchInput.setAttribute('aria-label', 'Search options');
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleSearchKeydown);

    searchContainer.appendChild(searchInput);
    dropdown.appendChild(searchContainer);
  }

  // Create options list
  const optionsList = document.createElement('ul');
  optionsList.className = 'dos-select__options';
  optionsList.setAttribute('role', 'presentation');
  renderOptions();
  dropdown.appendChild(optionsList);

  wrapper.appendChild(dropdown);

  // Create error message element
  let errorElement: HTMLDivElement | null = null;
  if (errorState && typeof errorState === 'string') {
    errorElement = createErrorElement(errorState);
    wrapper.appendChild(errorElement);
    trigger.setAttribute('aria-describedby', errorId);
    trigger.setAttribute('aria-invalid', 'true');
  }

  // Create hidden inputs for form submission
  const hiddenInputs: HTMLInputElement[] = [];
  updateHiddenInputs();

  // Event listeners
  trigger.addEventListener('click', handleTriggerClick);
  trigger.addEventListener('keydown', handleTriggerKeydown);
  trigger.addEventListener('focus', handleFocus);
  trigger.addEventListener('blur', handleBlur);
  document.addEventListener('click', handleOutsideClick);

  // Helper functions

  function initializeValue(val: string | string[] | undefined, isMultiple: boolean): string[] {
    if (val === undefined) return [];
    if (isMultiple) {
      return Array.isArray(val) ? val : [val];
    }
    if (Array.isArray(val)) {
      return val.length > 0 && val[0] !== undefined ? [val[0]] : [];
    }
    return [val];
  }

  function buildWrapperClasses(
    sizeVal: string,
    isDisabled: boolean,
    hasError: string | boolean,
    isOpen: boolean,
    extraClass?: string
  ): string {
    const classes = ['dos-select'];
    classes.push(`dos-select--${sizeVal}`);
    if (isDisabled) classes.push('dos-select--disabled');
    if (hasError) classes.push('dos-select--error');
    if (isOpen) classes.push('dos-select--open');
    if (extraClass) classes.push(extraClass);
    return classes.join(' ');
  }

  function updateWrapperClasses(): void {
    wrapper.className = buildWrapperClasses(size, isDisabledState, errorState, isOpenState, className);
  }

  function updateValueDisplay(): void {
    if (multiple && selectedValues.length > 0) {
      // For multiple selection, show tags
      valueDisplay.className = 'dos-select__tags';
      valueDisplay.innerHTML = '';
      selectedValues.forEach((val) => {
        const option = options.find((o) => o.value === val);
        if (option) {
          const tag = document.createElement('span');
          tag.className = 'dos-select__tag';
          tag.textContent = option.label;

          if (!isDisabledState) {
            const removeBtn = document.createElement('span');
            removeBtn.className = 'dos-select__tag-remove';
            removeBtn.textContent = '×';
            removeBtn.setAttribute('role', 'button');
            removeBtn.setAttribute('aria-label', `Remove ${option.label}`);
            removeBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              removeValue(val);
            });
            tag.appendChild(removeBtn);
          }

          valueDisplay.appendChild(tag);
        }
      });
    } else if (selectedValues.length > 0) {
      // For single selection, show text
      const selectedOption = options.find((o) => o.value === selectedValues[0]);
      valueDisplay.className = 'dos-select__value';
      valueDisplay.textContent = selectedOption ? selectedOption.label : '';
      valueDisplay.classList.remove('dos-select__placeholder');
    } else {
      // Show placeholder
      valueDisplay.className = 'dos-select__value dos-select__placeholder';
      valueDisplay.textContent = placeholder;
    }
  }

  function renderOptions(): void {
    optionsList.innerHTML = '';

    const groupedOptions = groupOptions(filteredOptions);

    if (filteredOptions.length === 0) {
      const noOptions = document.createElement('li');
      noOptions.className = 'dos-select__no-options';
      noOptions.textContent = searchQuery ? 'No matching options' : 'No options available';
      optionsList.appendChild(noOptions);
      return;
    }

    // Render grouped or ungrouped options
    if (groupedOptions.hasGroups) {
      Object.entries(groupedOptions.groups).forEach(([groupName, groupOpts]) => {
        const group = document.createElement('li');
        group.className = 'dos-select__group';

        const groupLabel = document.createElement('div');
        groupLabel.className = 'dos-select__group-label';
        groupLabel.textContent = groupName;
        group.appendChild(groupLabel);

        const groupList = document.createElement('ul');
        groupList.className = 'dos-select__options';
        groupOpts.forEach((option, index) => {
          const optionEl = createOptionElement(option, index);
          groupList.appendChild(optionEl);
        });
        group.appendChild(groupList);

        optionsList.appendChild(group);
      });
    } else {
      filteredOptions.forEach((option, index) => {
        const optionEl = createOptionElement(option, index);
        optionsList.appendChild(optionEl);
      });
    }
  }

  function groupOptions(opts: SelectOption[]): { hasGroups: boolean; groups: Record<string, SelectOption[]> } {
    const groups: Record<string, SelectOption[]> = {};
    let hasGroups = false;

    opts.forEach((option) => {
      const groupName = option.group || '__ungrouped__';
      if (option.group) hasGroups = true;
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(option);
    });

    return { hasGroups, groups };
  }

  function createOptionElement(option: SelectOption, index: number): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'dos-select__option';
    li.setAttribute('role', 'option');
    li.setAttribute('data-value', option.value);
    li.setAttribute('data-index', String(index));

    const isSelected = selectedValues.includes(option.value);
    const isHighlighted = index === highlightedIndex;

    if (isSelected) {
      li.classList.add('dos-select__option--selected');
      li.setAttribute('aria-selected', 'true');
    } else {
      li.setAttribute('aria-selected', 'false');
    }

    if (isHighlighted) {
      li.classList.add('dos-select__option--highlighted');
      li.id = `${selectId}-option-${index}`;
      trigger.setAttribute('aria-activedescendant', li.id);
    }

    if (option.disabled) {
      li.classList.add('dos-select__option--disabled');
      li.setAttribute('aria-disabled', 'true');
    }

    // Add check indicator for multiple select
    if (multiple) {
      const check = document.createElement('span');
      check.className = 'dos-select__option-check';
      check.textContent = isSelected ? '[X]' : '[ ]';
      li.appendChild(check);
    }

    const labelSpan = document.createElement('span');
    labelSpan.textContent = option.label;
    li.appendChild(labelSpan);

    li.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent outside click handler from closing dropdown
      handleOptionClick(option);
    });
    li.addEventListener('mouseenter', () => {
      highlightedIndex = index;
      updateHighlight();
    });

    return li;
  }

  function createErrorElement(message: string): HTMLDivElement {
    const el = document.createElement('div');
    el.id = errorId;
    el.className = 'dos-select__error';
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'polite');
    el.textContent = message;
    return el;
  }

  function updateHiddenInputs(): void {
    // Remove existing hidden inputs
    hiddenInputs.forEach((input) => input.remove());
    hiddenInputs.length = 0;

    if (name) {
      if (selectedValues.length === 0) {
        // Create empty input for form submission
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = '';
        wrapper.appendChild(input);
        hiddenInputs.push(input);
      } else {
        selectedValues.forEach((val) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = multiple ? `${name}[]` : name;
          input.value = val;
          wrapper.appendChild(input);
          hiddenInputs.push(input);
        });
      }
    }
  }

  function openDropdown(): void {
    if (isDisabledState || isOpenState) return;

    isOpenState = true;
    updateWrapperClasses();
    trigger.setAttribute('aria-expanded', 'true');

    // Reset search and filter
    searchQuery = '';
    filteredOptions = options;
    if (searchInput) {
      searchInput.value = '';
    }
    renderOptions();

    // Set initial highlight to first selected or first option
    if (selectedValues.length > 0) {
      const selectedIndex = filteredOptions.findIndex((o) => o.value === selectedValues[0]);
      highlightedIndex = selectedIndex >= 0 ? selectedIndex : 0;
    } else {
      highlightedIndex = 0;
    }
    updateHighlight();

    // Focus search input if searchable
    if (searchInput) {
      searchInput.focus();
    }

    // Scroll to highlighted option
    scrollToHighlighted();

    onOpen?.();
  }

  function closeDropdown(): void {
    if (!isOpenState) return;

    isOpenState = false;
    updateWrapperClasses();
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
    highlightedIndex = -1;

    onClose?.();
  }

  function toggleDropdown(): void {
    if (isOpenState) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  function updateHighlight(): void {
    const optionElements = optionsList.querySelectorAll('.dos-select__option');
    optionElements.forEach((el, index) => {
      const li = el as HTMLLIElement;
      if (index === highlightedIndex) {
        li.classList.add('dos-select__option--highlighted');
        li.id = `${selectId}-option-${index}`;
        trigger.setAttribute('aria-activedescendant', li.id);
      } else {
        li.classList.remove('dos-select__option--highlighted');
        li.removeAttribute('id');
      }
    });
  }

  function scrollToHighlighted(): void {
    const highlighted = optionsList.querySelector('.dos-select__option--highlighted') as HTMLElement;
    if (highlighted && typeof highlighted.scrollIntoView === 'function') {
      highlighted.scrollIntoView({ block: 'nearest' });
    }
  }

  function selectOption(option: SelectOption): void {
    if (option.disabled) return;

    if (multiple) {
      const index = selectedValues.indexOf(option.value);
      if (index >= 0) {
        selectedValues.splice(index, 1);
      } else {
        selectedValues.push(option.value);
      }
    } else {
      selectedValues = [option.value];
      closeDropdown();
    }

    updateValueDisplay();
    updateHiddenInputs();
    renderOptions();

    const returnValue = multiple ? [...selectedValues] : selectedValues[0] || '';
    onChange?.(returnValue);
  }

  function removeValue(value: string): void {
    const index = selectedValues.indexOf(value);
    if (index >= 0) {
      selectedValues.splice(index, 1);
      updateValueDisplay();
      updateHiddenInputs();
      renderOptions();

      const returnValue = multiple ? [...selectedValues] : selectedValues[0] || '';
      onChange?.(returnValue);
    }
  }

  // Event handlers

  function handleTriggerClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown();
  }

  function handleTriggerKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpenState && highlightedIndex >= 0) {
          const option = filteredOptions[highlightedIndex];
          if (option && !option.disabled) {
            selectOption(option);
          }
        } else {
          toggleDropdown();
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpenState) {
          openDropdown();
        } else {
          highlightedIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1);
          // Skip disabled options
          while (highlightedIndex < filteredOptions.length && filteredOptions[highlightedIndex]?.disabled) {
            highlightedIndex++;
          }
          if (highlightedIndex >= filteredOptions.length) {
            highlightedIndex = filteredOptions.length - 1;
          }
          updateHighlight();
          scrollToHighlighted();
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpenState) {
          openDropdown();
        } else {
          highlightedIndex = Math.max(highlightedIndex - 1, 0);
          // Skip disabled options
          while (highlightedIndex >= 0 && filteredOptions[highlightedIndex]?.disabled) {
            highlightedIndex--;
          }
          if (highlightedIndex < 0) {
            highlightedIndex = 0;
          }
          updateHighlight();
          scrollToHighlighted();
        }
        break;

      case 'Home':
        e.preventDefault();
        if (isOpenState) {
          highlightedIndex = 0;
          while (highlightedIndex < filteredOptions.length && filteredOptions[highlightedIndex]?.disabled) {
            highlightedIndex++;
          }
          updateHighlight();
          scrollToHighlighted();
        }
        break;

      case 'End':
        e.preventDefault();
        if (isOpenState) {
          highlightedIndex = filteredOptions.length - 1;
          while (highlightedIndex >= 0 && filteredOptions[highlightedIndex]?.disabled) {
            highlightedIndex--;
          }
          updateHighlight();
          scrollToHighlighted();
        }
        break;

      case 'Escape':
        if (isOpenState) {
          e.preventDefault();
          closeDropdown();
          trigger.focus();
        }
        break;

      case 'Tab':
        if (isOpenState) {
          closeDropdown();
        }
        break;

      default:
        // Type-ahead: find option starting with typed character
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !searchable) {
          e.preventDefault();
          const char = e.key.toLowerCase();
          const startIndex = highlightedIndex + 1;
          let foundIndex = -1;

          // Search from current position to end
          for (let i = startIndex; i < filteredOptions.length; i++) {
            const opt = filteredOptions[i];
            if (opt && opt.label.toLowerCase().startsWith(char) && !opt.disabled) {
              foundIndex = i;
              break;
            }
          }

          // If not found, search from beginning
          if (foundIndex === -1) {
            for (let i = 0; i < startIndex; i++) {
              const opt = filteredOptions[i];
              if (opt && opt.label.toLowerCase().startsWith(char) && !opt.disabled) {
                foundIndex = i;
                break;
              }
            }
          }

          if (foundIndex >= 0) {
            if (!isOpenState) openDropdown();
            highlightedIndex = foundIndex;
            updateHighlight();
            scrollToHighlighted();
          }
        }
        break;
    }
  }

  function handleSearchInput(): void {
    if (!searchInput) return;

    searchQuery = searchInput.value.toLowerCase();
    filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery) ||
      option.value.toLowerCase().includes(searchQuery)
    );

    highlightedIndex = filteredOptions.length > 0 ? 0 : -1;
    renderOptions();
    updateHighlight();
  }

  function handleSearchKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1);
        updateHighlight();
        scrollToHighlighted();
        break;

      case 'ArrowUp':
        e.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, 0);
        updateHighlight();
        scrollToHighlighted();
        break;

      case 'Enter': {
        e.preventDefault();
        const selectedOption = filteredOptions[highlightedIndex];
        if (highlightedIndex >= 0 && selectedOption) {
          selectOption(selectedOption);
          if (!multiple) {
            trigger.focus();
          }
        }
        break;
      }

      case 'Escape':
        e.preventDefault();
        closeDropdown();
        trigger.focus();
        break;
    }
  }

  function handleOptionClick(option: SelectOption): void {
    selectOption(option);
    if (!multiple) {
      trigger.focus();
    }
  }

  function handleOutsideClick(e: MouseEvent): void {
    if (isOpenState && !wrapper.contains(e.target as Node)) {
      closeDropdown();
    }
  }

  function handleFocus(e: FocusEvent): void {
    onFocus?.(e);
  }

  function handleBlur(e: FocusEvent): void {
    // Only blur if focus moved outside the component
    const relatedTarget = e.relatedTarget as Node;
    if (!wrapper.contains(relatedTarget)) {
      onBlur?.(e);
    }
  }

  // Public methods

  wrapper.getValue = function (): string | string[] {
    return multiple ? [...selectedValues] : selectedValues[0] || '';
  };

  wrapper.setValue = function (value: string | string[]): void {
    selectedValues = initializeValue(value, multiple);
    updateValueDisplay();
    updateHiddenInputs();
    renderOptions();
  };

  wrapper.open = function (): void {
    openDropdown();
  };

  wrapper.close = function (): void {
    closeDropdown();
  };

  wrapper.toggle = function (): void {
    toggleDropdown();
  };

  wrapper.isOpen = function (): boolean {
    return isOpenState;
  };

  wrapper.setDisabled = function (disabled: boolean): void {
    isDisabledState = disabled;
    trigger.disabled = disabled;
    trigger.setAttribute('aria-disabled', String(disabled));
    updateWrapperClasses();
    updateValueDisplay();

    if (disabled && isOpenState) {
      closeDropdown();
    }
  };

  wrapper.setError = function (err: string | boolean): void {
    errorState = err;
    updateWrapperClasses();

    // Update or remove error element
    if (errorElement) {
      errorElement.remove();
      errorElement = null;
    }

    if (err && typeof err === 'string') {
      errorElement = createErrorElement(err);
      wrapper.appendChild(errorElement);
      trigger.setAttribute('aria-describedby', errorId);
      trigger.setAttribute('aria-invalid', 'true');
    } else if (err) {
      trigger.setAttribute('aria-invalid', 'true');
      trigger.removeAttribute('aria-describedby');
    } else {
      trigger.removeAttribute('aria-invalid');
      trigger.removeAttribute('aria-describedby');
    }
  };

  wrapper.setOptions = function (newOptions: SelectOption[]): void {
    options = [...newOptions];
    filteredOptions = options;
    searchQuery = '';
    if (searchInput) {
      searchInput.value = '';
    }

    // Remove selected values that are no longer valid
    selectedValues = selectedValues.filter((val) =>
      options.some((o) => o.value === val)
    );

    updateValueDisplay();
    updateHiddenInputs();
    renderOptions();
  };

  wrapper.clear = function (): void {
    selectedValues = [];
    updateValueDisplay();
    updateHiddenInputs();
    renderOptions();
    onChange?.(multiple ? [] : '');
  };

  wrapper.destroy = function (): void {
    document.removeEventListener('click', handleOutsideClick);
    trigger.removeEventListener('click', handleTriggerClick);
    trigger.removeEventListener('keydown', handleTriggerKeydown);
    trigger.removeEventListener('focus', handleFocus);
    trigger.removeEventListener('blur', handleBlur);
    if (searchInput) {
      searchInput.removeEventListener('input', handleSearchInput);
      searchInput.removeEventListener('keydown', handleSearchKeydown);
    }
    wrapper.remove();
  };

  return wrapper;
}
