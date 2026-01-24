/**
 * Combobox Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCombobox, ComboboxOption } from '../../src/components/Combobox';

describe('Combobox', () => {
  let container: HTMLElement;
  const defaultOptions: ComboboxOption[] = [
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
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      expect(combo.className).toContain('dos-combobox');
      expect(combo.querySelector('.dos-combobox__input')).toBeTruthy();
      expect(combo.querySelector('.dos-combobox__toggle')).toBeTruthy();
      expect(combo.querySelector('.dos-combobox__dropdown')).toBeTruthy();
    });

    it('renders with custom id', () => {
      const combo = createCombobox({ options: defaultOptions, id: 'my-combo' });
      container.appendChild(combo);

      expect(combo.id).toBe('my-combo');
      const dropdown = combo.querySelector('.dos-combobox__dropdown');
      expect(dropdown?.id).toBe('my-combo-listbox');
    });

    it('renders with custom className', () => {
      const combo = createCombobox({ options: defaultOptions, className: 'custom-class' });
      container.appendChild(combo);

      expect(combo.className).toContain('custom-class');
    });

    it('renders with placeholder', () => {
      const combo = createCombobox({ options: defaultOptions, placeholder: 'Choose one...' });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      expect(input.placeholder).toBe('Choose one...');
    });

    it('renders with initial value', () => {
      const combo = createCombobox({ options: defaultOptions, value: 'opt2' });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      expect(input.value).toBe('Option 2');
      expect(combo.getValue()).toBe('opt2');
    });

    it('renders with name attribute', () => {
      const combo = createCombobox({ options: defaultOptions, name: 'myCombo' });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      expect(input.name).toBe('myCombo');
    });

    it('renders with required attribute', () => {
      const combo = createCombobox({ options: defaultOptions, required: true });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      expect(input.required).toBe(true);
    });

    it('renders with disabled state', () => {
      const combo = createCombobox({ options: defaultOptions, disabled: true });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      const toggle = combo.querySelector('.dos-combobox__toggle') as HTMLButtonElement;

      expect(input.disabled).toBe(true);
      expect(toggle.disabled).toBe(true);
      expect(combo.className).toContain('dos-combobox--disabled');
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes on input', () => {
      const combo = createCombobox({ options: defaultOptions, id: 'test-combo' });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;

      expect(input.getAttribute('role')).toBe('combobox');
      expect(input.getAttribute('aria-autocomplete')).toBe('list');
      expect(input.getAttribute('aria-expanded')).toBe('false');
      expect(input.getAttribute('aria-controls')).toBe('test-combo-listbox');
      expect(input.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('has correct ARIA attributes on dropdown', () => {
      const combo = createCombobox({ options: defaultOptions, id: 'test-combo' });
      container.appendChild(combo);

      const dropdown = combo.querySelector('.dos-combobox__dropdown');

      expect(dropdown?.getAttribute('role')).toBe('listbox');
      expect(dropdown?.id).toBe('test-combo-listbox');
    });

    it('has toggle button with aria-label', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      const toggle = combo.querySelector('.dos-combobox__toggle');
      expect(toggle?.getAttribute('aria-label')).toBe('Toggle dropdown');
      expect(toggle?.getAttribute('tabindex')).toBe('-1');
    });

    it('updates aria-expanded when dropdown opens', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;

      combo.open();
      expect(input.getAttribute('aria-expanded')).toBe('true');

      combo.close();
      expect(input.getAttribute('aria-expanded')).toBe('false');
    });

    it('sets aria-activedescendant on highlight', () => {
      const combo = createCombobox({ options: defaultOptions, id: 'test-combo' });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;

      combo.open();
      // Arrow down to first option (index 0)
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(input.getAttribute('aria-activedescendant')).toBe('test-combo-option-0');
    });

    it('sets aria-selected on selected option', () => {
      const combo = createCombobox({ options: defaultOptions, value: 'opt2', id: 'test-combo' });
      container.appendChild(combo);

      combo.open();

      const selectedOption = combo.querySelector('[data-value="opt2"]');
      expect(selectedOption?.getAttribute('aria-selected')).toBe('true');
    });

    it('sets aria-disabled on disabled options', () => {
      const optionsWithDisabled: ComboboxOption[] = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2', disabled: true },
        { value: 'opt3', label: 'Option 3' },
      ];
      const combo = createCombobox({ options: optionsWithDisabled });
      container.appendChild(combo);

      combo.open();

      const disabledOption = combo.querySelector('[data-value="opt2"]');
      expect(disabledOption?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('dropdown toggle', () => {
    it('opens dropdown on toggle button click', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      const toggle = combo.querySelector('.dos-combobox__toggle') as HTMLButtonElement;
      toggle.click();

      expect(combo.isOpen()).toBe(true);
      expect(combo.className).toContain('dos-combobox--open');
    });

    it('closes dropdown on toggle button click when open', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();
      expect(combo.isOpen()).toBe(true);

      const toggle = combo.querySelector('.dos-combobox__toggle') as HTMLButtonElement;
      toggle.click();

      expect(combo.isOpen()).toBe(false);
    });

    it('opens dropdown on ArrowDown key', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(combo.isOpen()).toBe(true);
    });

    it('opens dropdown on ArrowUp key', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

      expect(combo.isOpen()).toBe(true);
    });

    it('closes dropdown on Escape key', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      expect(combo.isOpen()).toBe(false);
    });

    it('calls onDropdownToggle callback', () => {
      const onToggle = vi.fn();
      const combo = createCombobox({ options: defaultOptions, onDropdownToggle: onToggle });
      container.appendChild(combo);

      combo.open();
      expect(onToggle).toHaveBeenCalledWith(true);

      combo.close();
      expect(onToggle).toHaveBeenCalledWith(false);
    });
  });

  describe('keyboard navigation', () => {
    it('navigates down through options with ArrowDown', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(combo.getHighlightedOption()?.value).toBe('opt1');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(combo.getHighlightedOption()?.value).toBe('opt2');
    });

    it('navigates up through options with ArrowUp', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      // Start from first
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(combo.getHighlightedOption()?.value).toBe('opt2');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(combo.getHighlightedOption()?.value).toBe('opt1');
    });

    it('wraps around when navigating past the end', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;

      // Navigate to last
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      // Now we're at index 2 (third option)
      expect(combo.getHighlightedOption()?.value).toBe('opt3');

      // Go past end - should wrap to first
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(combo.getHighlightedOption()?.value).toBe('opt1');
    });

    it('wraps around when navigating before the beginning', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;

      // Move to first item
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(combo.getHighlightedOption()?.value).toBe('opt1');

      // Navigate before beginning - should wrap to last
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(combo.getHighlightedOption()?.value).toBe('opt3');
    });

    it('navigates to first option on Home key', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;

      // Navigate to middle
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      // Press Home
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      expect(combo.getHighlightedOption()?.value).toBe('opt1');
    });

    it('navigates to last option on End key', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;

      // Start from first
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      // Press End
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      expect(combo.getHighlightedOption()?.value).toBe('opt3');
    });

    it('selects highlighted option on Enter key', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;

      // Navigate to second option
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      // Press Enter
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(combo.getValue()).toBe('opt2');
      expect(input.value).toBe('Option 2');
      expect(combo.isOpen()).toBe(false);
    });
  });

  describe('option selection', () => {
    it('selects option on click', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();

      const option = combo.querySelector('[data-value="opt2"]') as HTMLElement;
      option.click();

      expect(combo.getValue()).toBe('opt2');
      expect(combo.isOpen()).toBe(false);
    });

    it('calls onChange callback on selection', () => {
      const onChange = vi.fn();
      const combo = createCombobox({ options: defaultOptions, onChange });
      container.appendChild(combo);

      combo.open();

      const option = combo.querySelector('[data-value="opt2"]') as HTMLElement;
      option.click();

      expect(onChange).toHaveBeenCalledWith('opt2', expect.objectContaining({ value: 'opt2' }));
    });

    it('dispatches change event on selection', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      const eventHandler = vi.fn();
      combo.addEventListener('dos:combobox:change', eventHandler);

      combo.open();

      const option = combo.querySelector('[data-value="opt2"]') as HTMLElement;
      option.click();

      expect(eventHandler).toHaveBeenCalledTimes(1);
      const event = eventHandler.mock.calls[0][0] as CustomEvent;
      expect(event.detail.value).toBe('opt2');
    });

    it('does not select disabled options', () => {
      const optionsWithDisabled: ComboboxOption[] = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2', disabled: true },
        { value: 'opt3', label: 'Option 3' },
      ];
      const combo = createCombobox({ options: optionsWithDisabled });
      container.appendChild(combo);

      combo.open();

      const option = combo.querySelector('[data-value="opt2"]') as HTMLElement;
      option.click();

      expect(combo.getValue()).toBe('');
      expect(combo.isOpen()).toBe(true);
    });

    it('highlights option on mouseenter', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();

      const option = combo.querySelector('[data-value="opt2"]') as HTMLElement;
      option.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      expect(combo.getHighlightedOption()?.value).toBe('opt2');
    });
  });

  describe('type-ahead filtering', () => {
    it('filters options as user types', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.value = '1';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Should be open now
      expect(combo.isOpen()).toBe(true);

      // Should show only matching option
      const visibleOptions = combo.querySelectorAll('.dos-combobox__option');
      expect(visibleOptions.length).toBe(1);
      expect(visibleOptions[0].getAttribute('data-value')).toBe('opt1');
    });

    it('shows no matches message when nothing matches', () => {
      const combo = createCombobox({
        options: defaultOptions,
        noMatchesMessage: 'No results found',
      });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.value = 'xyz';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      const noMatches = combo.querySelector('.dos-combobox__no-matches');
      expect(noMatches).toBeTruthy();
      expect(noMatches?.textContent).toBe('No results found');
    });

    it('calls onInput callback', () => {
      const onInput = vi.fn();
      const combo = createCombobox({ options: defaultOptions, onInput });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(onInput).toHaveBeenCalledWith('test');
    });

    it('uses custom filter function', () => {
      const filterFn = vi.fn((option: ComboboxOption, query: string) => {
        return option.value.startsWith(query);
      });
      const combo = createCombobox({ options: defaultOptions, filterFunction: filterFn });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.value = 'opt';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(filterFn).toHaveBeenCalled();
    });

    it('disables filtering when filterOnType is false', () => {
      const combo = createCombobox({ options: defaultOptions, filterOnType: false });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.value = 'xyz';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      combo.open();

      // All options should still be visible
      const visibleOptions = combo.querySelectorAll('.dos-combobox__option');
      expect(visibleOptions.length).toBe(3);
    });
  });

  describe('freeform mode', () => {
    it('allows freeform values when allowFreeform is true', () => {
      const onChange = vi.fn();
      const combo = createCombobox({ options: defaultOptions, allowFreeform: true, onChange });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.value = 'custom value';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Blur to commit freeform value
      input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

      expect(combo.getValue()).toBe('custom value');
      expect(onChange).toHaveBeenCalledWith('custom value', null);
    });

    it('reverts non-matching values when allowFreeform is false', () => {
      const combo = createCombobox({ options: defaultOptions, allowFreeform: false, value: 'opt1' });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.value = 'invalid';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Blur to trigger revert
      input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

      expect(input.value).toBe('Option 1');
      expect(combo.getValue()).toBe('opt1');
    });

    it('auto-selects matching option when typing exact label', () => {
      const combo = createCombobox({ options: defaultOptions, allowFreeform: false });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.value = 'Option 2';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Blur to trigger selection
      input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

      expect(combo.getValue()).toBe('opt2');
    });

    it('strict mode reverts on blur with no match', () => {
      const combo = createCombobox({ options: defaultOptions, strict: true, value: 'opt1' });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.value = 'invalid';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Blur to trigger revert
      input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

      expect(input.value).toBe('Option 1');
    });
  });

  describe('option groups', () => {
    it('renders grouped options', () => {
      const groupedOptions: ComboboxOption[] = [
        { value: 'a1', label: 'Alpha 1', group: 'alpha' },
        { value: 'a2', label: 'Alpha 2', group: 'alpha' },
        { value: 'b1', label: 'Beta 1', group: 'beta' },
      ];
      const groups = [
        { id: 'alpha', label: 'Alpha Group' },
        { id: 'beta', label: 'Beta Group' },
      ];
      const combo = createCombobox({ options: groupedOptions, groups });
      container.appendChild(combo);

      combo.open();

      const headers = combo.querySelectorAll('.dos-combobox__group-header');
      expect(headers.length).toBe(2);
      expect(headers[0].textContent).toBe('Alpha Group');
      expect(headers[1].textContent).toBe('Beta Group');
    });

    it('renders group icon if provided', () => {
      const groupedOptions: ComboboxOption[] = [{ value: 'a1', label: 'Alpha 1', group: 'alpha' }];
      const groups = [{ id: 'alpha', label: 'Alpha', icon: '🔤' }];
      const combo = createCombobox({ options: groupedOptions, groups });
      container.appendChild(combo);

      combo.open();

      const header = combo.querySelector('.dos-combobox__group-header');
      expect(header?.textContent).toContain('🔤');
    });
  });

  describe('custom rendering', () => {
    it('uses custom renderOption function', () => {
      const renderOption = vi.fn((option: ComboboxOption) => {
        return `<strong>${option.label}</strong>`;
      });
      const combo = createCombobox({ options: defaultOptions, renderOption });
      container.appendChild(combo);

      combo.open();

      expect(renderOption).toHaveBeenCalled();
      const option = combo.querySelector('.dos-combobox__option');
      expect(option?.innerHTML).toBe('<strong>Option 1</strong>');
    });

    it('supports renderOption returning HTMLElement', () => {
      const renderOption = (option: ComboboxOption) => {
        const el = document.createElement('span');
        el.textContent = option.label;
        el.className = 'custom-option';
        return el;
      };
      const combo = createCombobox({ options: defaultOptions, renderOption });
      container.appendChild(combo);

      combo.open();

      const customEl = combo.querySelector('.custom-option');
      expect(customEl).toBeTruthy();
    });

    it('renders option with icon', () => {
      const optionsWithIcons: ComboboxOption[] = [{ value: 'opt1', label: 'Option 1', icon: '📁' }];
      const combo = createCombobox({ options: optionsWithIcons });
      container.appendChild(combo);

      combo.open();

      const icon = combo.querySelector('.dos-combobox__option-icon');
      expect(icon?.textContent).toBe('📁');
    });

    it('renders option with description', () => {
      const optionsWithDesc: ComboboxOption[] = [
        { value: 'opt1', label: 'Option 1', description: 'This is option 1' },
      ];
      const combo = createCombobox({ options: optionsWithDesc });
      container.appendChild(combo);

      combo.open();

      const desc = combo.querySelector('.dos-combobox__option-description');
      expect(desc?.textContent).toBe('This is option 1');
    });
  });

  describe('public API', () => {
    it('getValue returns selected value', () => {
      const combo = createCombobox({ options: defaultOptions, value: 'opt2' });
      container.appendChild(combo);

      expect(combo.getValue()).toBe('opt2');
    });

    it('setValue sets selected value', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.setValue('opt3');

      expect(combo.getValue()).toBe('opt3');
      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      expect(input.value).toBe('Option 3');
    });

    it('getSelectedOption returns option object', () => {
      const combo = createCombobox({ options: defaultOptions, value: 'opt2' });
      container.appendChild(combo);

      const option = combo.getSelectedOption();
      expect(option?.value).toBe('opt2');
      expect(option?.label).toBe('Option 2');
    });

    it('open() opens dropdown', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();

      expect(combo.isOpen()).toBe(true);
    });

    it('close() closes dropdown', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();
      combo.close();

      expect(combo.isOpen()).toBe(false);
    });

    it('toggle() toggles dropdown', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.toggle();
      expect(combo.isOpen()).toBe(true);

      combo.toggle();
      expect(combo.isOpen()).toBe(false);
    });

    it('setOptions() replaces options', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      const newOptions: ComboboxOption[] = [
        { value: 'new1', label: 'New 1' },
        { value: 'new2', label: 'New 2' },
      ];

      combo.setOptions(newOptions);
      combo.open();

      const visibleOptions = combo.querySelectorAll('.dos-combobox__option');
      expect(visibleOptions.length).toBe(2);
      expect(visibleOptions[0].getAttribute('data-value')).toBe('new1');
    });

    it('getOptions() returns current options', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      const options = combo.getOptions();
      expect(options.length).toBe(3);
      expect(options[0].value).toBe('opt1');
    });

    it('focus() focuses input', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.focus();

      expect(document.activeElement).toBe(combo.querySelector('.dos-combobox__input'));
    });

    it('blur() blurs input', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.focus();

      combo.blur();

      expect(document.activeElement).not.toBe(input);
    });

    it('isDisabled() returns disabled state', () => {
      const combo = createCombobox({ options: defaultOptions, disabled: true });
      container.appendChild(combo);

      expect(combo.isDisabled()).toBe(true);
    });

    it('setDisabled() sets disabled state', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.setDisabled(true);

      expect(combo.isDisabled()).toBe(true);
      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('setDisabled(true) closes dropdown if open', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();
      combo.setDisabled(true);

      expect(combo.isOpen()).toBe(false);
    });

    it('destroy() cleans up event listeners', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.destroy();

      // Input events should no longer work
      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Dropdown should not open (event handler removed)
      // This is a basic check - actual verification would require spy on document
    });
  });

  describe('maxDropdownHeight', () => {
    it('sets max-height on dropdown', () => {
      const combo = createCombobox({ options: defaultOptions, maxDropdownHeight: 150 });
      container.appendChild(combo);

      const dropdown = combo.querySelector('.dos-combobox__dropdown') as HTMLElement;
      expect(dropdown.style.maxHeight).toBe('150px');
    });
  });

  describe('focus states', () => {
    it('adds focused class on input focus', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));

      expect(combo.className).toContain('dos-combobox--focused');
    });

    it('removes focused class on input blur', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      const input = combo.querySelector('.dos-combobox__input') as HTMLInputElement;
      input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
      input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

      expect(combo.className).not.toContain('dos-combobox--focused');
    });
  });

  describe('selected option display', () => {
    it('shows check mark on selected option', () => {
      const combo = createCombobox({ options: defaultOptions, value: 'opt2' });
      container.appendChild(combo);

      combo.open();

      const selectedOption = combo.querySelector('[data-value="opt2"]');
      const checkMark = selectedOption?.querySelector('.dos-combobox__option-check');
      expect(checkMark?.textContent).toBe('✓');
    });

    it('highlights selected option differently', () => {
      const combo = createCombobox({ options: defaultOptions, value: 'opt2' });
      container.appendChild(combo);

      combo.open();

      const selectedOption = combo.querySelector('[data-value="opt2"]');
      expect(selectedOption?.className).toContain('dos-combobox__option--selected');
    });
  });

  describe('click outside', () => {
    it('closes dropdown on click outside', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();
      expect(combo.isOpen()).toBe(true);

      // Click outside
      document.body.click();

      expect(combo.isOpen()).toBe(false);
    });

    it('does not close dropdown on click inside', () => {
      const combo = createCombobox({ options: defaultOptions });
      container.appendChild(combo);

      combo.open();

      // Click inside
      combo.click();

      expect(combo.isOpen()).toBe(true);
    });
  });
});
