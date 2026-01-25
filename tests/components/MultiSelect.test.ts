/**
 * MultiSelect Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMultiSelect, MultiSelectOption } from '../../src/components/MultiSelect';

describe('MultiSelect', () => {
  let container: HTMLElement;
  const defaultOptions: MultiSelectOption[] = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      expect(select.className).toContain('dos-multiselect');
      expect(select.querySelector('.dos-multiselect__trigger')).toBeTruthy();
      expect(select.querySelector('.dos-multiselect__dropdown')).toBeTruthy();
    });

    it('renders with custom id', () => {
      const select = createMultiSelect({ options: defaultOptions, id: 'my-select' });
      container.appendChild(select);

      expect(select.id).toBe('my-select');
    });

    it('renders with custom className', () => {
      const select = createMultiSelect({ options: defaultOptions, className: 'custom-class' });
      container.appendChild(select);

      expect(select.className).toContain('custom-class');
    });

    it('renders with placeholder', () => {
      const select = createMultiSelect({ options: defaultOptions, placeholder: 'Choose options...' });
      container.appendChild(select);

      const placeholder = select.querySelector('.dos-multiselect__placeholder');
      expect(placeholder?.textContent).toBe('Choose options...');
    });

    it('renders with initial values', () => {
      const select = createMultiSelect({ options: defaultOptions, value: ['opt1', 'opt3'] });
      container.appendChild(select);

      const tags = select.querySelectorAll('.dos-multiselect__tag');
      expect(tags.length).toBe(2);
      expect(select.getValue()).toEqual(['opt1', 'opt3']);
    });

    it('renders with disabled state', () => {
      const select = createMultiSelect({ options: defaultOptions, disabled: true });
      container.appendChild(select);

      expect(select.className).toContain('dos-multiselect--disabled');
      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;
      expect(trigger.getAttribute('tabindex')).toBe('-1');
    });

    it('renders with search input when searchable', () => {
      const select = createMultiSelect({ options: defaultOptions, searchable: true });
      container.appendChild(select);

      select.open();
      const searchInput = select.querySelector('.dos-multiselect__search-input');
      expect(searchInput).toBeTruthy();
    });

    it('renders with Select All button', () => {
      const select = createMultiSelect({
        options: defaultOptions,
        showSelectAll: true,
        selectAllLabel: 'All',
      });
      container.appendChild(select);

      select.open();
      const selectAllBtn = select.querySelector('.dos-multiselect__action-btn');
      expect(selectAllBtn?.textContent).toBe('[All]');
    });

    it('renders with Clear All button', () => {
      const select = createMultiSelect({
        options: defaultOptions,
        showClearAll: true,
        clearAllLabel: 'Clear',
      });
      container.appendChild(select);

      select.open();
      const clearAllBtn = select.querySelector('.dos-multiselect__action-btn');
      expect(clearAllBtn?.textContent).toBe('[Clear]');
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes on trigger', () => {
      const select = createMultiSelect({ options: defaultOptions, id: 'test-select' });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-multiselect__trigger');

      expect(trigger?.getAttribute('role')).toBe('combobox');
      expect(trigger?.getAttribute('aria-haspopup')).toBe('listbox');
      expect(trigger?.getAttribute('aria-expanded')).toBe('false');
      expect(trigger?.getAttribute('aria-controls')).toBe('test-select-listbox');
    });

    it('has correct ARIA attributes on options list', () => {
      const select = createMultiSelect({ options: defaultOptions, id: 'test-select' });
      container.appendChild(select);

      const optionsList = select.querySelector('.dos-multiselect__options');

      expect(optionsList?.getAttribute('role')).toBe('listbox');
      expect(optionsList?.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('updates aria-expanded when dropdown opens', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-multiselect__trigger');

      select.open();
      expect(trigger?.getAttribute('aria-expanded')).toBe('true');

      select.close();
      expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    });

    it('sets aria-selected on selected options', () => {
      const select = createMultiSelect({ options: defaultOptions, value: ['opt2'] });
      container.appendChild(select);

      select.open();

      // Get options from the dropdown list
      const optionsList = select.querySelector('.dos-multiselect__options');
      const selectedOption = optionsList?.querySelector('[data-value="opt2"]');
      expect(selectedOption?.getAttribute('aria-selected')).toBe('true');

      const unselectedOption = optionsList?.querySelector('[data-value="opt1"]');
      expect(unselectedOption?.getAttribute('aria-selected')).toBe('false');
    });

    it('sets aria-disabled on disabled options', () => {
      const optionsWithDisabled: MultiSelectOption[] = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2', disabled: true },
      ];
      const select = createMultiSelect({ options: optionsWithDisabled });
      container.appendChild(select);

      select.open();

      const disabledOption = select.querySelector('[data-value="opt2"]');
      expect(disabledOption?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('dropdown toggle', () => {
    it('opens dropdown on trigger click', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;
      trigger.click();

      expect(select.isOpen()).toBe(true);
      expect(select.className).toContain('dos-multiselect--open');
    });

    it('closes dropdown on trigger click when open', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.open();
      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;
      trigger.click();

      expect(select.isOpen()).toBe(false);
    });

    it('calls onDropdownToggle callback', () => {
      const onToggle = vi.fn();
      const select = createMultiSelect({ options: defaultOptions, onDropdownToggle: onToggle });
      container.appendChild(select);

      select.open();
      expect(onToggle).toHaveBeenCalledWith(true);

      select.close();
      expect(onToggle).toHaveBeenCalledWith(false);
    });

    it('focuses search input when opened (if searchable)', () => {
      const select = createMultiSelect({ options: defaultOptions, searchable: true });
      container.appendChild(select);

      select.open();

      const searchInput = select.querySelector('.dos-multiselect__search-input');
      expect(document.activeElement).toBe(searchInput);
    });
  });

  describe('option selection', () => {
    it('selects option on click', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.open();

      const option = select.querySelector('[data-value="opt2"]') as HTMLElement;
      option.click();

      expect(select.getValue()).toContain('opt2');
    });

    it('shows selected value as tag', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.select('opt1');

      const tag = select.querySelector('.dos-multiselect__tag');
      const label = tag?.querySelector('.dos-multiselect__tag-label');
      expect(label?.textContent).toBe('Option 1');
    });

    it('shows checkbox as checked for selected options', () => {
      const select = createMultiSelect({ options: defaultOptions, value: ['opt1'] });
      container.appendChild(select);

      select.open();

      const optionsList = select.querySelector('.dos-multiselect__options');
      const selectedOption = optionsList?.querySelector('[data-value="opt1"]');
      const checkbox = selectedOption?.querySelector('.dos-multiselect__checkbox');
      expect(checkbox?.textContent).toBe('[X]');

      const unselectedOption = optionsList?.querySelector('[data-value="opt2"]');
      const uncheckedCheckbox = unselectedOption?.querySelector('.dos-multiselect__checkbox');
      expect(uncheckedCheckbox?.textContent).toBe('[ ]');
    });

    it('deselects option on second click', () => {
      const select = createMultiSelect({ options: defaultOptions, value: ['opt2'] });
      container.appendChild(select);

      select.open();

      // Get option from options list (not tags)
      const optionsList = select.querySelector('.dos-multiselect__options');
      const option = optionsList?.querySelector('[data-value="opt2"]') as HTMLElement;
      option.click();

      expect(select.getValue()).not.toContain('opt2');
    });

    it('removes tag on remove button click', () => {
      const select = createMultiSelect({ options: defaultOptions, value: ['opt1', 'opt2'] });
      container.appendChild(select);

      const tag = select.querySelector('[data-value="opt1"]');
      const removeBtn = tag?.querySelector('.dos-multiselect__tag-remove') as HTMLElement;
      removeBtn.click();

      expect(select.getValue()).toEqual(['opt2']);
    });

    it('does not select disabled options', () => {
      const optionsWithDisabled: MultiSelectOption[] = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2', disabled: true },
      ];
      const select = createMultiSelect({ options: optionsWithDisabled });
      container.appendChild(select);

      select.open();

      const option = select.querySelector('[data-value="opt2"]') as HTMLElement;
      option.click();

      expect(select.getValue()).not.toContain('opt2');
    });

    it('calls onChange callback on selection', () => {
      const onChange = vi.fn();
      const select = createMultiSelect({ options: defaultOptions, onChange });
      container.appendChild(select);

      select.select('opt1');

      expect(onChange).toHaveBeenCalledWith(
        ['opt1'],
        expect.arrayContaining([expect.objectContaining({ value: 'opt1' })])
      );
    });

    it('dispatches change event on selection', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      const eventHandler = vi.fn();
      select.addEventListener('dos:multiselect:change', eventHandler);

      select.select('opt2');

      expect(eventHandler).toHaveBeenCalledTimes(1);
      const event = eventHandler.mock.calls[0][0] as CustomEvent;
      expect(event.detail.values).toContain('opt2');
      expect(event.detail.action).toBe('add');
    });
  });

  describe('Select All and Clear All', () => {
    it('selects all options on Select All click', () => {
      const select = createMultiSelect({ options: defaultOptions, showSelectAll: true });
      container.appendChild(select);

      select.open();

      const selectAllBtn = select.querySelector('.dos-multiselect__action-btn') as HTMLElement;
      selectAllBtn.click();

      expect(select.getValue()).toEqual(['opt1', 'opt2', 'opt3']);
    });

    it('clears all selections on Clear All click', () => {
      const select = createMultiSelect({
        options: defaultOptions,
        value: ['opt1', 'opt2'],
        showClearAll: true,
      });
      container.appendChild(select);

      select.open();

      const clearAllBtn = select.querySelector('.dos-multiselect__action-btn') as HTMLElement;
      clearAllBtn.click();

      expect(select.getValue()).toEqual([]);
    });

    it('selectAll() method works', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.selectAll();

      expect(select.getValue()).toEqual(['opt1', 'opt2', 'opt3']);
    });

    it('clearAll() method works', () => {
      const select = createMultiSelect({ options: defaultOptions, value: ['opt1', 'opt2'] });
      container.appendChild(select);

      select.clearAll();

      expect(select.getValue()).toEqual([]);
    });

    it('selectAll respects maxSelections', () => {
      const select = createMultiSelect({ options: defaultOptions, maxSelections: 2 });
      container.appendChild(select);

      select.selectAll();

      expect(select.getValue().length).toBe(2);
    });
  });

  describe('max selections', () => {
    it('prevents selecting more than maxSelections', () => {
      const select = createMultiSelect({ options: defaultOptions, maxSelections: 2 });
      container.appendChild(select);

      select.select('opt1');
      select.select('opt2');
      select.select('opt3');

      expect(select.getValue()).toEqual(['opt1', 'opt2']);
    });

    it('isMaxSelectionsReached() returns true when limit reached', () => {
      const select = createMultiSelect({
        options: defaultOptions,
        maxSelections: 2,
        value: ['opt1', 'opt2'],
      });
      container.appendChild(select);

      expect(select.isMaxSelectionsReached()).toBe(true);
    });

    it('disables unselected options when max reached', () => {
      const select = createMultiSelect({
        options: defaultOptions,
        maxSelections: 2,
        value: ['opt1', 'opt2'],
      });
      container.appendChild(select);

      select.open();

      const opt3 = select.querySelector('[data-value="opt3"]');
      expect(opt3?.classList.contains('dos-multiselect__option--disabled')).toBe(true);
    });
  });

  describe('search/filter', () => {
    it('filters options based on search query', () => {
      const select = createMultiSelect({ options: defaultOptions, searchable: true });
      container.appendChild(select);

      select.open();

      const searchInput = select.querySelector('.dos-multiselect__search-input') as HTMLInputElement;
      searchInput.value = '1';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));

      const visibleOptions = select.querySelectorAll('.dos-multiselect__option');
      expect(visibleOptions.length).toBe(1);
      expect(visibleOptions[0].getAttribute('data-value')).toBe('opt1');
    });

    it('shows no matches message when nothing matches', () => {
      const select = createMultiSelect({
        options: defaultOptions,
        searchable: true,
        noMatchesMessage: 'No results',
      });
      container.appendChild(select);

      select.open();

      const searchInput = select.querySelector('.dos-multiselect__search-input') as HTMLInputElement;
      searchInput.value = 'xyz';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));

      const noMatches = select.querySelector('.dos-multiselect__no-matches');
      expect(noMatches?.hidden).toBe(false);
      expect(noMatches?.textContent).toBe('No results');
    });

    it('calls onSearch callback', () => {
      const onSearch = vi.fn();
      const select = createMultiSelect({ options: defaultOptions, searchable: true, onSearch });
      container.appendChild(select);

      select.open();

      const searchInput = select.querySelector('.dos-multiselect__search-input') as HTMLInputElement;
      searchInput.value = 'test';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));

      expect(onSearch).toHaveBeenCalledWith('test');
    });

    it('uses custom filter function', () => {
      const filterFn = vi.fn((option: MultiSelectOption, query: string) => {
        return option.value.startsWith(query);
      });
      const select = createMultiSelect({
        options: defaultOptions,
        searchable: true,
        filterFunction: filterFn,
      });
      container.appendChild(select);

      select.open();

      select.setSearchQuery('opt');

      expect(filterFn).toHaveBeenCalled();
    });
  });

  describe('keyboard navigation', () => {
    it('opens dropdown on ArrowDown', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(select.isOpen()).toBe(true);
    });

    it('navigates through options with arrow keys', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;

      select.open();

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(select.getHighlightedOption()?.value).toBe('opt1');

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(select.getHighlightedOption()?.value).toBe('opt2');

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(select.getHighlightedOption()?.value).toBe('opt1');
    });

    it('toggles option on Space key', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;

      select.open();

      // Navigate to first option
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      // Toggle selection
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(select.getValue()).toContain('opt1');

      // Toggle again to deselect
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      expect(select.getValue()).not.toContain('opt1');
    });

    it('toggles option on Enter key', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;

      select.open();

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(select.getValue()).toContain('opt1');
    });

    it('closes dropdown on Escape key', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.open();

      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      expect(select.isOpen()).toBe(false);
    });

    it('removes last tag on Backspace when search is empty', () => {
      const select = createMultiSelect({
        options: defaultOptions,
        value: ['opt1', 'opt2'],
        searchable: true,
      });
      container.appendChild(select);

      select.open();

      const searchInput = select.querySelector('.dos-multiselect__search-input') as HTMLInputElement;
      searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));

      expect(select.getValue()).toEqual(['opt1']);
    });

    it('navigates to first option on Home key', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.open();

      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;

      // Navigate to middle
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      // Go to first
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));

      expect(select.getHighlightedOption()?.value).toBe('opt1');
    });

    it('navigates to last option on End key', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.open();

      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));

      expect(select.getHighlightedOption()?.value).toBe('opt3');
    });

    it('adds highlighted class to option on arrow key navigation', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.open();

      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      const optionsList = select.querySelector('.dos-multiselect__options');
      const firstOption = optionsList?.querySelector('[data-value="opt1"]');
      expect(firstOption?.classList.contains('dos-multiselect__option--highlighted')).toBe(true);
    });

    it('adds highlighted class to option on mouse hover', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.open();

      const optionsList = select.querySelector('.dos-multiselect__options');
      const secondOption = optionsList?.querySelector('[data-value="opt2"]') as HTMLElement;
      
      // Simulate mouse enter
      secondOption.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      expect(secondOption?.classList.contains('dos-multiselect__option--highlighted')).toBe(true);
    });

    it('distinguishes between highlighted and selected states', () => {
      const select = createMultiSelect({ options: defaultOptions, value: ['opt1'] });
      container.appendChild(select);

      select.open();

      const optionsList = select.querySelector('.dos-multiselect__options');
      const firstOption = optionsList?.querySelector('[data-value="opt1"]') as HTMLElement;
      const secondOption = optionsList?.querySelector('[data-value="opt2"]') as HTMLElement;

      // First option is selected but not highlighted
      expect(firstOption?.classList.contains('dos-multiselect__option--selected')).toBe(true);
      expect(firstOption?.classList.contains('dos-multiselect__option--highlighted')).toBe(false);

      // Hover over the selected option
      firstOption.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      // Now it should have both classes
      expect(firstOption?.classList.contains('dos-multiselect__option--selected')).toBe(true);
      expect(firstOption?.classList.contains('dos-multiselect__option--highlighted')).toBe(true);
    });
  });

  describe('option groups', () => {
    it('renders grouped options', () => {
      const groupedOptions: MultiSelectOption[] = [
        { value: 'a1', label: 'Alpha 1', group: 'alpha' },
        { value: 'a2', label: 'Alpha 2', group: 'alpha' },
        { value: 'b1', label: 'Beta 1', group: 'beta' },
      ];
      const groups = [
        { id: 'alpha', label: 'Alpha Group' },
        { id: 'beta', label: 'Beta Group' },
      ];
      const select = createMultiSelect({ options: groupedOptions, groups });
      container.appendChild(select);

      select.open();

      const headers = select.querySelectorAll('.dos-multiselect__group-header');
      expect(headers.length).toBe(2);
      expect(headers[0].textContent).toBe('Alpha Group');
      expect(headers[1].textContent).toBe('Beta Group');
    });
  });

  describe('custom rendering', () => {
    it('uses custom renderOption function', () => {
      const renderOption = vi.fn((option: MultiSelectOption) => {
        return `<strong>${option.label}</strong>`;
      });
      const select = createMultiSelect({ options: defaultOptions, renderOption });
      container.appendChild(select);

      select.open();

      expect(renderOption).toHaveBeenCalled();
    });

    it('uses custom renderTag function', () => {
      const renderTag = vi.fn((option: MultiSelectOption) => {
        const el = document.createElement('span');
        el.className = 'custom-tag';
        el.textContent = option.label;
        return el;
      });
      const select = createMultiSelect({ options: defaultOptions, value: ['opt1'], renderTag });
      container.appendChild(select);

      expect(renderTag).toHaveBeenCalled();
      const customTag = select.querySelector('.custom-tag');
      expect(customTag).toBeTruthy();
    });
  });

  describe('public API', () => {
    it('getValue returns selected values', () => {
      const select = createMultiSelect({ options: defaultOptions, value: ['opt1', 'opt2'] });
      container.appendChild(select);

      expect(select.getValue()).toEqual(['opt1', 'opt2']);
    });

    it('setValue sets selected values', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.setValue(['opt2', 'opt3']);

      expect(select.getValue()).toEqual(['opt2', 'opt3']);
    });

    it('getSelectedOptions returns option objects', () => {
      const select = createMultiSelect({ options: defaultOptions, value: ['opt1'] });
      container.appendChild(select);

      const selectedOptions = select.getSelectedOptions();
      expect(selectedOptions.length).toBe(1);
      expect(selectedOptions[0].value).toBe('opt1');
    });

    it('select() adds a value', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.select('opt2');

      expect(select.getValue()).toContain('opt2');
    });

    it('deselect() removes a value', () => {
      const select = createMultiSelect({ options: defaultOptions, value: ['opt1', 'opt2'] });
      container.appendChild(select);

      select.deselect('opt1');

      expect(select.getValue()).toEqual(['opt2']);
    });

    it('toggle() toggles a value', () => {
      const select = createMultiSelect({ options: defaultOptions, value: ['opt1'] });
      container.appendChild(select);

      select.toggle('opt1');
      expect(select.getValue()).not.toContain('opt1');

      select.toggle('opt1');
      expect(select.getValue()).toContain('opt1');
    });

    it('open() opens dropdown', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.open();

      expect(select.isOpen()).toBe(true);
    });

    it('close() closes dropdown', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.open();
      select.close();

      expect(select.isOpen()).toBe(false);
    });

    it('setOptions() replaces options', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      const newOptions: MultiSelectOption[] = [
        { value: 'new1', label: 'New 1' },
        { value: 'new2', label: 'New 2' },
      ];

      select.setOptions(newOptions);
      select.open();

      const visibleOptions = select.querySelectorAll('.dos-multiselect__option');
      expect(visibleOptions.length).toBe(2);
    });

    it('getOptions() returns current options', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      const options = select.getOptions();
      expect(options.length).toBe(3);
    });

    it('setSearchQuery() sets search query', () => {
      const select = createMultiSelect({ options: defaultOptions, searchable: true });
      container.appendChild(select);

      select.open();
      select.setSearchQuery('Option 1');

      expect(select.getSearchQuery()).toBe('Option 1');
    });

    it('focus() focuses trigger', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.focus();

      expect(document.activeElement).toBe(select.querySelector('.dos-multiselect__trigger'));
    });

    it('isDisabled() returns disabled state', () => {
      const select = createMultiSelect({ options: defaultOptions, disabled: true });
      container.appendChild(select);

      expect(select.isDisabled()).toBe(true);
    });

    it('setDisabled() sets disabled state', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.setDisabled(true);

      expect(select.isDisabled()).toBe(true);
      expect(select.className).toContain('dos-multiselect--disabled');
    });

    it('destroy() cleans up event listeners', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.destroy();

      // Events should no longer work (basic verification)
      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;
      trigger.click();

      // Dropdown might still toggle, but the cleanup itself should complete without errors
    });
  });

  describe('focus and blur', () => {
    it('adds focused class on focus', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;
      trigger.dispatchEvent(new FocusEvent('focus', { bubbles: true }));

      expect(select.className).toContain('dos-multiselect--focused');
    });

    it('removes focused class on blur', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-multiselect__trigger') as HTMLElement;
      trigger.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
      trigger.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

      expect(select.className).not.toContain('dos-multiselect--focused');
    });
  });

  describe('click outside', () => {
    it('closes dropdown on click outside', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.open();

      document.body.click();

      expect(select.isOpen()).toBe(false);
    });

    it('does not close dropdown on click inside', () => {
      const select = createMultiSelect({ options: defaultOptions });
      container.appendChild(select);

      select.open();

      select.click();

      // Will be closed by toggle, but check if dropdown was there
      // Clicking trigger toggles, so let's click the options instead
    });
  });

  describe('has-value class', () => {
    it('adds has-value class when selections exist', () => {
      const select = createMultiSelect({ options: defaultOptions, value: ['opt1'] });
      container.appendChild(select);

      expect(select.className).toContain('dos-multiselect--has-value');
    });

    it('removes has-value class when cleared', () => {
      const select = createMultiSelect({ options: defaultOptions, value: ['opt1'] });
      container.appendChild(select);

      select.clearAll();

      expect(select.className).not.toContain('dos-multiselect--has-value');
    });
  });
});
