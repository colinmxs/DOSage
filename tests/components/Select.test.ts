/**
 * Select Component Tests
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createSelect } from '../../src/components/Select';
import type { SelectOption } from '../../src/components/Select';

describe('Select', () => {
  let container: HTMLDivElement;

  const basicOptions: SelectOption[] = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
  ];

  const groupedOptions: SelectOption[] = [
    { value: 'apple', label: 'Apple', group: 'Fruits' },
    { value: 'banana', label: 'Banana', group: 'Fruits' },
    { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
    { value: 'potato', label: 'Potato', group: 'Vegetables' },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      expect(select.classList.contains('dos-select')).toBe(true);
      expect(select.querySelector('.dos-select__trigger')).toBeTruthy();
      expect(select.querySelector('.dos-select__dropdown')).toBeTruthy();
    });

    it('renders with label', () => {
      const select = createSelect({
        options: basicOptions,
        label: 'Choose a color',
      });
      container.appendChild(select);

      const label = select.querySelector('.dos-select__label');
      expect(label).toBeTruthy();
      expect(label?.textContent).toBe('Choose a color');
    });

    it('renders with required indicator', () => {
      const select = createSelect({
        options: basicOptions,
        label: 'Color',
        required: true,
      });
      container.appendChild(select);

      const label = select.querySelector('.dos-select__label');
      expect(label?.classList.contains('dos-select__label--required')).toBe(true);
    });

    it('renders with selected value', () => {
      const select = createSelect({
        options: basicOptions,
        value: 'green',
      });
      container.appendChild(select);

      const valueDisplay = select.querySelector('.dos-select__value');
      expect(valueDisplay?.textContent).toBe('Green');
    });

    it('renders placeholder when no value selected', () => {
      const select = createSelect({
        options: basicOptions,
        placeholder: 'Select a color...',
      });
      container.appendChild(select);

      const valueDisplay = select.querySelector('.dos-select__placeholder');
      expect(valueDisplay?.textContent).toBe('Select a color...');
    });

    it('renders with option groups', () => {
      const select = createSelect({ options: groupedOptions });
      container.appendChild(select);

      // Open dropdown to see options
      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click();

      const groups = select.querySelectorAll('.dos-select__group-label');
      expect(groups.length).toBe(2);
      expect(groups[0].textContent).toBe('Fruits');
      expect(groups[1].textContent).toBe('Vegetables');
    });

    it('renders all size variants', () => {
      const sizes = ['small', 'medium', 'large'] as const;

      sizes.forEach((size) => {
        const select = createSelect({ options: basicOptions, size });
        container.appendChild(select);
        expect(select.classList.contains(`dos-select--${size}`)).toBe(true);
        select.remove();
      });
    });
  });

  describe('dropdown behavior', () => {
    it('opens dropdown on click', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click();

      expect(select.classList.contains('dos-select--open')).toBe(true);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('closes dropdown on second click', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open
      trigger.click(); // Close

      expect(select.classList.contains('dos-select--open')).toBe(false);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('closes dropdown on outside click', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      // Click outside
      document.body.click();

      expect(select.classList.contains('dos-select--open')).toBe(false);
    });

    it('closes dropdown on Escape key', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      expect(select.classList.contains('dos-select--open')).toBe(false);
    });
  });

  describe('selection', () => {
    it('selects option on click', () => {
      const onChange = vi.fn();
      const select = createSelect({
        options: basicOptions,
        onChange,
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      const options = select.querySelectorAll('.dos-select__option');
      (options[1] as HTMLElement).click(); // Click "Green"

      expect(select.getValue()).toBe('green');
      expect(onChange).toHaveBeenCalledWith('green');
    });

    it('closes dropdown after single selection', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      const options = select.querySelectorAll('.dos-select__option');
      (options[0] as HTMLElement).click();

      expect(select.classList.contains('dos-select--open')).toBe(false);
    });

    it('supports multiple selection', () => {
      const onChange = vi.fn();
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        onChange,
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      const options = select.querySelectorAll('.dos-select__option');
      (options[0] as HTMLElement).click(); // Select "Red"
      (options[1] as HTMLElement).click(); // Select "Green"

      expect(select.getValue()).toEqual(['red', 'green']);
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('keeps dropdown open for multiple selection', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      const options = select.querySelectorAll('.dos-select__option');
      (options[0] as HTMLElement).click();

      expect(select.classList.contains('dos-select--open')).toBe(true);
    });

    it('toggles selection in multiple mode', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        value: ['red'],
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      const options = select.querySelectorAll('.dos-select__option');
      (options[0] as HTMLElement).click(); // Deselect "Red"

      expect(select.getValue()).toEqual([]);
    });

    it('does not select disabled options', () => {
      const optionsWithDisabled: SelectOption[] = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B', disabled: true },
        { value: 'c', label: 'Option C' },
      ];

      const onChange = vi.fn();
      const select = createSelect({
        options: optionsWithDisabled,
        onChange,
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      const options = select.querySelectorAll('.dos-select__option');
      (options[1] as HTMLElement).click(); // Try to click disabled option

      expect(onChange).not.toHaveBeenCalled();
      expect(select.getValue()).toBe('');
    });
  });

  describe('keyboard navigation', () => {
    it('opens dropdown on Enter', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(select.classList.contains('dos-select--open')).toBe(true);
    });

    it('opens dropdown on Space', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(select.classList.contains('dos-select--open')).toBe(true);
    });

    it('opens dropdown on ArrowDown', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(select.classList.contains('dos-select--open')).toBe(true);
    });

    it('navigates options with ArrowDown/ArrowUp', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      // ArrowDown
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      let highlighted = select.querySelector('.dos-select__option--highlighted');
      expect(highlighted?.getAttribute('data-value')).toBe('green');

      // ArrowUp
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      highlighted = select.querySelector('.dos-select__option--highlighted');
      expect(highlighted?.getAttribute('data-value')).toBe('red');
    });

    it('navigates to first option with Home', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      // Navigate down
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      // Home
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      const highlighted = select.querySelector('.dos-select__option--highlighted');
      expect(highlighted?.getAttribute('data-value')).toBe('red');
    });

    it('navigates to last option with End', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      // End
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      const highlighted = select.querySelector('.dos-select__option--highlighted');
      expect(highlighted?.getAttribute('data-value')).toBe('blue');
    });

    it('selects highlighted option with Enter', () => {
      const onChange = vi.fn();
      const select = createSelect({
        options: basicOptions,
        onChange,
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      // Navigate and select
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(select.getValue()).toBe('green');
      expect(onChange).toHaveBeenCalledWith('green');
    });

    it('supports type-ahead navigation', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      // Type 'b' to jump to 'Blue'
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }));
      const highlighted = select.querySelector('.dos-select__option--highlighted');
      expect(highlighted?.getAttribute('data-value')).toBe('blue');
    });
  });

  describe('searchable mode', () => {
    it('renders search input when searchable', () => {
      const select = createSelect({
        options: basicOptions,
        searchable: true,
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      const searchInput = select.querySelector('.dos-select__search-input');
      expect(searchInput).toBeTruthy();
    });

    it('filters options based on search query', () => {
      const select = createSelect({
        options: basicOptions,
        searchable: true,
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      const searchInput = select.querySelector('.dos-select__search-input') as HTMLInputElement;
      searchInput.value = 're';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));

      const visibleOptions = select.querySelectorAll('.dos-select__option');
      expect(visibleOptions.length).toBe(2); // "Red" and "Green"
    });

    it('shows no options message when filter has no matches', () => {
      const select = createSelect({
        options: basicOptions,
        searchable: true,
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      const searchInput = select.querySelector('.dos-select__search-input') as HTMLInputElement;
      searchInput.value = 'xyz';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));

      const noOptions = select.querySelector('.dos-select__no-options');
      expect(noOptions?.textContent).toBe('No matching options');
    });
  });

  describe('disabled state', () => {
    it('renders disabled state', () => {
      const select = createSelect({
        options: basicOptions,
        disabled: true,
      });
      container.appendChild(select);

      expect(select.classList.contains('dos-select--disabled')).toBe(true);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      expect(trigger.disabled).toBe(true);
      expect(trigger.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not open when disabled', () => {
      const select = createSelect({
        options: basicOptions,
        disabled: true,
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click();

      expect(select.classList.contains('dos-select--open')).toBe(false);
    });

    it('can be disabled programmatically', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      select.setDisabled(true);

      expect(select.classList.contains('dos-select--disabled')).toBe(true);
      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      expect(trigger.disabled).toBe(true);
    });
  });

  describe('error state', () => {
    it('renders error state with message', () => {
      const select = createSelect({
        options: basicOptions,
        error: 'Please select an option',
      });
      container.appendChild(select);

      expect(select.classList.contains('dos-select--error')).toBe(true);

      const errorEl = select.querySelector('.dos-select__error');
      expect(errorEl?.textContent).toBe('Please select an option');
    });

    it('renders error state without message', () => {
      const select = createSelect({
        options: basicOptions,
        error: true,
      });
      container.appendChild(select);

      expect(select.classList.contains('dos-select--error')).toBe(true);
      expect(select.querySelector('.dos-select__error')).toBeNull();
    });

    it('can set error programmatically', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      select.setError('Selection required');

      expect(select.classList.contains('dos-select--error')).toBe(true);
      const errorEl = select.querySelector('.dos-select__error');
      expect(errorEl?.textContent).toBe('Selection required');
    });

    it('can clear error programmatically', () => {
      const select = createSelect({
        options: basicOptions,
        error: 'Error message',
      });
      container.appendChild(select);

      select.setError(false);

      expect(select.classList.contains('dos-select--error')).toBe(false);
      expect(select.querySelector('.dos-select__error')).toBeNull();
    });
  });

  describe('public methods', () => {
    it('getValue returns current value', () => {
      const select = createSelect({
        options: basicOptions,
        value: 'blue',
      });
      container.appendChild(select);

      expect(select.getValue()).toBe('blue');
    });

    it('setValue updates selection', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      select.setValue('green');

      expect(select.getValue()).toBe('green');
      const valueDisplay = select.querySelector('.dos-select__value');
      expect(valueDisplay?.textContent).toBe('Green');
    });

    it('setValue handles multiple values', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
      });
      container.appendChild(select);

      select.setValue(['red', 'blue']);

      expect(select.getValue()).toEqual(['red', 'blue']);
    });

    it('open and close work correctly', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      select.open();
      expect(select.isOpen()).toBe(true);

      select.close();
      expect(select.isOpen()).toBe(false);
    });

    it('toggle works correctly', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      select.toggle();
      expect(select.isOpen()).toBe(true);

      select.toggle();
      expect(select.isOpen()).toBe(false);
    });

    it('clear removes selection', () => {
      const onChange = vi.fn();
      const select = createSelect({
        options: basicOptions,
        value: 'red',
        onChange,
      });
      container.appendChild(select);

      select.clear();

      expect(select.getValue()).toBe('');
      expect(onChange).toHaveBeenCalledWith('');
    });

    it('setOptions updates available options', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const newOptions: SelectOption[] = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
      ];

      select.setOptions(newOptions);
      select.open();

      const options = select.querySelectorAll('.dos-select__option');
      expect(options.length).toBe(2);
    });

    it('setOptions removes invalid selections', () => {
      const select = createSelect({
        options: basicOptions,
        value: 'green',
      });
      container.appendChild(select);

      const newOptions: SelectOption[] = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
      ];

      select.setOptions(newOptions);

      expect(select.getValue()).toBe('');
    });

    it('destroy removes event listeners and element', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      select.destroy();

      expect(container.contains(select)).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes on trigger', () => {
      const select = createSelect({
        options: basicOptions,
        label: 'Color',
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger');
      expect(trigger?.getAttribute('role')).toBe('combobox');
      expect(trigger?.getAttribute('aria-haspopup')).toBe('listbox');
      expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    });

    it('has correct ARIA attributes on dropdown', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
      });
      container.appendChild(select);

      const dropdown = select.querySelector('.dos-select__dropdown');
      expect(dropdown?.getAttribute('role')).toBe('listbox');
      expect(dropdown?.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('has correct ARIA attributes on options', () => {
      const select = createSelect({
        options: basicOptions,
        value: 'green',
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      const options = select.querySelectorAll('.dos-select__option');
      expect(options[0].getAttribute('role')).toBe('option');
      expect(options[0].getAttribute('aria-selected')).toBe('false');
      expect(options[1].getAttribute('aria-selected')).toBe('true');
    });

    it('updates aria-activedescendant during navigation', () => {
      const select = createSelect({ options: basicOptions });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();
    });

    it('sets aria-invalid on error', () => {
      const select = createSelect({
        options: basicOptions,
        error: 'Required',
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger');
      expect(trigger?.getAttribute('aria-invalid')).toBe('true');
    });

    it('links error message with aria-describedby', () => {
      const select = createSelect({
        options: basicOptions,
        error: 'Required',
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger');
      const errorEl = select.querySelector('.dos-select__error');

      expect(trigger?.getAttribute('aria-describedby')).toBe(errorEl?.id);
    });

    it('disabled options have aria-disabled', () => {
      const optionsWithDisabled: SelectOption[] = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B', disabled: true },
      ];

      const select = createSelect({ options: optionsWithDisabled });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.click(); // Open

      const options = select.querySelectorAll('.dos-select__option');
      expect(options[1].getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('form integration', () => {
    it('creates hidden input with name', () => {
      const select = createSelect({
        options: basicOptions,
        name: 'color',
        value: 'red',
      });
      container.appendChild(select);

      const hiddenInput = select.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(hiddenInput).toBeTruthy();
      expect(hiddenInput.name).toBe('color');
      expect(hiddenInput.value).toBe('red');
    });

    it('creates multiple hidden inputs for multiple selection', () => {
      const select = createSelect({
        options: basicOptions,
        name: 'colors',
        multiple: true,
        value: ['red', 'blue'],
      });
      container.appendChild(select);

      const hiddenInputs = select.querySelectorAll('input[type="hidden"]');
      expect(hiddenInputs.length).toBe(2);
      expect((hiddenInputs[0] as HTMLInputElement).name).toBe('colors[]');
      expect((hiddenInputs[1] as HTMLInputElement).name).toBe('colors[]');
    });

    it('updates hidden inputs on selection change', () => {
      const select = createSelect({
        options: basicOptions,
        name: 'color',
      });
      container.appendChild(select);

      select.setValue('green');

      const hiddenInput = select.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(hiddenInput.value).toBe('green');
    });
  });

  describe('callbacks', () => {
    it('calls onOpen when dropdown opens', () => {
      const onOpen = vi.fn();
      const select = createSelect({
        options: basicOptions,
        onOpen,
      });
      container.appendChild(select);

      select.open();

      expect(onOpen).toHaveBeenCalled();
    });

    it('calls onClose when dropdown closes', () => {
      const onClose = vi.fn();
      const select = createSelect({
        options: basicOptions,
        onClose,
      });
      container.appendChild(select);

      select.open();
      select.close();

      expect(onClose).toHaveBeenCalled();
    });

    it('calls onFocus when trigger receives focus', () => {
      const onFocus = vi.fn();
      const select = createSelect({
        options: basicOptions,
        onFocus,
      });
      container.appendChild(select);

      const trigger = select.querySelector('.dos-select__trigger') as HTMLButtonElement;
      trigger.dispatchEvent(new FocusEvent('focus'));

      expect(onFocus).toHaveBeenCalled();
    });
  });
});
