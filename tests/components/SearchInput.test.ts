/**
 * SearchInput Component Tests
 *
 * Comprehensive tests for the DOS-style search input component.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSearchInput, type SearchInputProps, type SearchSuggestion } from '../../src/components/SearchInput';

describe('SearchInput', () => {
  let container: HTMLElement;

  const defaultSuggestions: SearchSuggestion[] = [
    { id: '1', label: 'CONFIG.SYS' },
    { id: '2', label: 'AUTOEXEC.BAT' },
    { id: '3', label: 'COMMAND.COM' },
    { id: '4', label: 'README.TXT', description: 'Read me file' },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  function createTestSearchInput(props: Partial<SearchInputProps> = {}) {
    const search = createSearchInput({
      suggestions: defaultSuggestions,
      id: 'test-search',
      debounceDelay: 0, // Disable debounce for tests
      ...props,
    });
    container.appendChild(search);
    return search;
  }

  describe('rendering', () => {
    it('renders with default props', () => {
      const search = createTestSearchInput();

      expect(search).toBeInstanceOf(HTMLElement);
      expect(search.classList.contains('dos-searchinput')).toBe(true);
    });

    it('renders with custom id', () => {
      const search = createTestSearchInput({ id: 'my-search' });

      expect(search.id).toBe('my-search');
    });

    it('renders with custom className', () => {
      const search = createTestSearchInput({ className: 'custom-class' });

      expect(search.classList.contains('custom-class')).toBe(true);
    });

    it('renders prompt with default value', () => {
      const search = createTestSearchInput();

      const prompt = search.querySelector('.dos-searchinput__prompt');
      expect(prompt?.textContent).toBe('[?]');
    });

    it('renders custom prompt', () => {
      const search = createTestSearchInput({ prompt: 'FIND:' });

      const prompt = search.querySelector('.dos-searchinput__prompt');
      expect(prompt?.textContent).toBe('FIND:');
    });

    it('renders placeholder', () => {
      const search = createTestSearchInput({ placeholder: 'Search files...' });

      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;
      expect(input.placeholder).toBe('Search files...');
    });

    it('renders with initial value', () => {
      const search = createTestSearchInput({ value: 'test' });

      expect(search.getValue()).toBe('test');
    });

    it('renders clear button when value exists', () => {
      const search = createTestSearchInput({ value: 'test' });

      const clearButton = search.querySelector('.dos-searchinput__clear') as HTMLElement;
      expect(clearButton.hidden).toBe(false);
    });

    it('hides clear button when value is empty', () => {
      const search = createTestSearchInput({ value: '' });

      const clearButton = search.querySelector('.dos-searchinput__clear') as HTMLElement;
      expect(clearButton.hidden).toBe(true);
    });

    it('hides clear button when disabled', () => {
      const search = createTestSearchInput({ value: 'test', showClearButton: false });

      const clearButton = search.querySelector('.dos-searchinput__clear') as HTMLElement;
      expect(clearButton.hidden).toBe(true);
    });
  });

  describe('value management', () => {
    it('gets current value with getValue()', () => {
      const search = createTestSearchInput({ value: 'hello' });

      expect(search.getValue()).toBe('hello');
    });

    it('sets value with setValue()', () => {
      const search = createTestSearchInput();

      search.setValue('world');

      expect(search.getValue()).toBe('world');
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;
      expect(input.value).toBe('world');
    });

    it('clears value with clear()', () => {
      const search = createTestSearchInput({ value: 'test' });

      search.clear();

      expect(search.getValue()).toBe('');
    });

    it('updates clear button visibility on setValue', () => {
      const search = createTestSearchInput({ value: '' });
      const clearButton = search.querySelector('.dos-searchinput__clear') as HTMLElement;

      expect(clearButton.hidden).toBe(true);

      search.setValue('test');
      expect(clearButton.hidden).toBe(false);
    });
  });

  describe('suggestions', () => {
    it('shows suggestions on input', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CON';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Wait for debounce (0ms in tests)
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(search.isSuggestionsOpen()).toBe(true);
    });

    it('filters suggestions by label', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      const suggestions = search.querySelectorAll('.dos-searchinput__suggestion');
      expect(suggestions.length).toBe(1);
    });

    it('shows no results message when no matches', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'NONEXISTENT';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      const noResults = search.querySelector('.dos-searchinput__no-results');
      expect(noResults?.hidden).toBe(false);
    });

    it('respects minChars setting', async () => {
      const search = createTestSearchInput({ minChars: 3 });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CO';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(search.isSuggestionsOpen()).toBe(false);

      input.value = 'CON';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(search.isSuggestionsOpen()).toBe(true);
    });

    it('limits suggestions to maxSuggestions', async () => {
      const manySuggestions = Array.from({ length: 20 }, (_, i) => ({
        id: String(i),
        label: `Item ${i}`,
      }));

      const search = createTestSearchInput({
        suggestions: manySuggestions,
        maxSuggestions: 5,
      });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'Item';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      const suggestions = search.querySelectorAll('.dos-searchinput__suggestion');
      expect(suggestions.length).toBe(5);
    });

    it('opens suggestions with openSuggestions()', async () => {
      const search = createTestSearchInput();
      search.setValue('CON');

      search.openSuggestions();

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(search.isSuggestionsOpen()).toBe(true);
    });

    it('closes suggestions with closeSuggestions()', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CON';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      search.closeSuggestions();

      expect(search.isSuggestionsOpen()).toBe(false);
    });

    it('toggles suggestions with toggleSuggestions()', async () => {
      const search = createTestSearchInput();
      search.setValue('CON');

      search.toggleSuggestions();
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(search.isSuggestionsOpen()).toBe(true);

      search.toggleSuggestions();
      expect(search.isSuggestionsOpen()).toBe(false);
    });

    it('sets suggestions programmatically with setSuggestions()', () => {
      const search = createTestSearchInput();

      search.setSuggestions([
        { id: 'new1', label: 'New Item 1' },
        { id: 'new2', label: 'New Item 2' },
      ]);

      expect(search.isSuggestionsOpen()).toBe(true);
      const suggestions = search.querySelectorAll('.dos-searchinput__suggestion');
      expect(suggestions.length).toBe(2);
    });
  });

  describe('async suggestions', () => {
    it('shows loading state during async load', async () => {
      const provider = vi.fn().mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([{ id: '1', label: 'Result' }]);
          }, 50);
        });
      });

      const search = createTestSearchInput({
        suggestions: [],
        suggestionProvider: provider,
      });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(search.isLoading()).toBe(true);
      const loading = search.querySelector('.dos-searchinput__loading');
      expect(loading?.hidden).toBe(false);

      // Wait for load to complete
      await new Promise(resolve => setTimeout(resolve, 60));

      expect(search.isLoading()).toBe(false);
    });

    it('calls suggestion provider with query', async () => {
      const provider = vi.fn().mockResolvedValue([]);

      const search = createTestSearchInput({
        suggestions: [],
        suggestionProvider: provider,
      });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'test query';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(provider).toHaveBeenCalledWith('test query');
    });
  });

  describe('keyboard navigation', () => {
    it('opens suggestions on ArrowDown', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      // Use setValue to properly update state
      search.setValue('CON');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(search.isSuggestionsOpen()).toBe(true);
    });

    it('navigates down with ArrowDown', async () => {
      const search = createTestSearchInput({
        suggestions: [
          { id: '1', label: 'First Item' },
          { id: '2', label: 'Second Item' },
          { id: '3', label: 'Third Item' },
        ],
      });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'Item';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      // First item is highlighted by default (index 0)
      expect(search.getHighlightedSuggestion()?.id).toBe('1');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      // Now should be second item (index 1)
      expect(search.getHighlightedSuggestion()?.id).toBe('2');
    });

    it('navigates up with ArrowUp', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CO';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      // Move down first
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      // Then up
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

      expect(search.getHighlightedSuggestion()?.id).toBe('1');
    });

    it('wraps around at end', async () => {
      const search = createTestSearchInput({
        suggestions: [
          { id: '1', label: 'Item 1' },
          { id: '2', label: 'Item 2' },
        ],
      });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'Item';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      // Navigate past last item
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      // Should wrap to first
      expect(search.getHighlightedSuggestion()?.id).toBe('1');
    });

    it('selects suggestion on Enter', async () => {
      const onSelect = vi.fn();
      const search = createTestSearchInput({ onSelect });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(onSelect).toHaveBeenCalled();
      expect(onSelect.mock.calls[0][0].label).toBe('CONFIG.SYS');
    });

    it('submits search on Enter without selection', async () => {
      const onSubmit = vi.fn();
      const search = createTestSearchInput({ onSubmit, suggestions: [] });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      // Use setValue to properly update the state
      search.setValue('test');
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(onSubmit).toHaveBeenCalledWith('test');
    });

    it('closes suggestions on Escape', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      expect(search.isSuggestionsOpen()).toBe(false);
    });

    it('clears input on Escape when suggestions closed', () => {
      const search = createTestSearchInput({ value: 'test' });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      expect(search.getValue()).toBe('');
    });

    it('jumps to first item on Home', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CO';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      // Move down
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      // Jump to first
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));

      expect(search.getHighlightedSuggestion()?.id).toBe('1');
    });

    it('jumps to last item on End', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CO';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));

      // Should be last matching item
      const highlighted = search.getHighlightedSuggestion();
      expect(highlighted).not.toBeNull();
    });
  });

  describe('selection behavior', () => {
    it('closes suggestions after selection by default', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(search.isSuggestionsOpen()).toBe(false);
    });

    it('keeps suggestions open when closeOnSelect is false', async () => {
      const search = createTestSearchInput({ closeOnSelect: false });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(search.isSuggestionsOpen()).toBe(true);
    });

    it('clears input on selection when clearOnSelect is true', async () => {
      const search = createTestSearchInput({ clearOnSelect: true });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(search.getValue()).toBe('');
    });

    it('sets value to suggestion value on selection', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(search.getValue()).toBe('CONFIG.SYS');
    });

    it('uses suggestion.value when provided', async () => {
      const search = createTestSearchInput({
        suggestions: [
          { id: '1', label: 'Display Name', value: 'actual_value' },
        ],
      });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'Display';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(search.getValue()).toBe('actual_value');
    });

    it('selects on click', async () => {
      const onSelect = vi.fn();
      const search = createTestSearchInput({ onSelect });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      const suggestion = search.querySelector('.dos-searchinput__suggestion') as HTMLElement;
      suggestion.click();

      expect(onSelect).toHaveBeenCalled();
    });

    it('does not select disabled suggestions', async () => {
      const onSelect = vi.fn();
      const search = createTestSearchInput({
        onSelect,
        suggestions: [
          { id: '1', label: 'Item A', disabled: true },
          { id: '2', label: 'Item B' },
        ],
      });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      // Search for "Item" which matches both
      input.value = 'Item';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      // Get the disabled suggestion (first one) - but it's filtered out
      // Actually disabled items are filtered out, so let's test differently:
      // Directly set suggestions including disabled ones
      search.setSuggestions([
        { id: '1', label: 'Disabled One', disabled: true },
        { id: '2', label: 'Enabled One' },
      ]);

      const suggestions = search.querySelectorAll('.dos-searchinput__suggestion');
      const disabledSuggestion = suggestions[0] as HTMLElement;
      disabledSuggestion.click();

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('clear button', () => {
    it('clears input on clear button click', () => {
      const search = createTestSearchInput({ value: 'test' });
      const clearButton = search.querySelector('.dos-searchinput__clear') as HTMLElement;

      clearButton.click();

      expect(search.getValue()).toBe('');
    });

    it('closes suggestions on clear', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;
      const clearButton = search.querySelector('.dos-searchinput__clear') as HTMLElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      clearButton.click();

      expect(search.isSuggestionsOpen()).toBe(false);
    });

    it('calls onClear callback', () => {
      const onClear = vi.fn();
      const search = createTestSearchInput({ value: 'test', onClear });
      const clearButton = search.querySelector('.dos-searchinput__clear') as HTMLElement;

      clearButton.click();

      expect(onClear).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('renders in disabled state', () => {
      const search = createTestSearchInput({ disabled: true });

      expect(search.isDisabled()).toBe(true);
      expect(search.classList.contains('dos-searchinput--disabled')).toBe(true);
    });

    it('disables input element', () => {
      const search = createTestSearchInput({ disabled: true });

      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('toggles disabled with setDisabled()', () => {
      const search = createTestSearchInput();

      search.setDisabled(true);
      expect(search.isDisabled()).toBe(true);

      search.setDisabled(false);
      expect(search.isDisabled()).toBe(false);
    });

    it('closes suggestions when disabled', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      search.setDisabled(true);

      expect(search.isSuggestionsOpen()).toBe(false);
    });
  });

  describe('callbacks', () => {
    it('calls onChange when value changes', () => {
      const onChange = vi.fn();
      const search = createTestSearchInput({ onChange });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(onChange).toHaveBeenCalledWith('test');
    });

    it('calls onSelect when suggestion selected', async () => {
      const onSelect = vi.fn();
      const search = createTestSearchInput({ onSelect });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(onSelect).toHaveBeenCalled();
      expect(onSelect.mock.calls[0][0].label).toBe('CONFIG.SYS');
    });

    it('calls onSubmit when Enter pressed without selection', () => {
      const onSubmit = vi.fn();
      const search = createTestSearchInput({ onSubmit, suggestions: [] });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      // Use setValue to properly update state
      search.setValue('search query');
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(onSubmit).toHaveBeenCalledWith('search query');
    });

    it('calls onSuggestionsToggle when suggestions open/close', async () => {
      const onSuggestionsToggle = vi.fn();
      const search = createTestSearchInput({ onSuggestionsToggle });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(onSuggestionsToggle).toHaveBeenCalledWith(true);

      search.closeSuggestions();

      expect(onSuggestionsToggle).toHaveBeenCalledWith(false);
    });
  });

  describe('custom events', () => {
    it('dispatches dos:search:input on input', () => {
      const search = createTestSearchInput();
      const handler = vi.fn();
      search.addEventListener('dos:search:input', handler);

      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].detail.value).toBe('test');
    });

    it('dispatches dos:search:select on selection', async () => {
      const search = createTestSearchInput();
      const handler = vi.fn();
      search.addEventListener('dos:search:select', handler);

      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;
      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].detail.suggestion.label).toBe('CONFIG.SYS');
    });

    it('dispatches dos:search:submit on submit', () => {
      const search = createTestSearchInput({ suggestions: [] });
      const handler = vi.fn();
      search.addEventListener('dos:search:submit', handler);

      // Use setValue to properly update state
      search.setValue('query');
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].detail.value).toBe('query');
    });

    it('dispatches dos:search:clear on clear', () => {
      const search = createTestSearchInput({ value: 'test' });
      const handler = vi.fn();
      search.addEventListener('dos:search:clear', handler);

      search.clear();

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('ARIA attributes', () => {
    it('has role="combobox" on input', () => {
      const search = createTestSearchInput();

      const input = search.querySelector('.dos-searchinput__input');
      expect(input?.getAttribute('role')).toBe('combobox');
    });

    it('has aria-autocomplete on input', () => {
      const search = createTestSearchInput();

      const input = search.querySelector('.dos-searchinput__input');
      expect(input?.getAttribute('aria-autocomplete')).toBe('list');
    });

    it('has role="listbox" on suggestions', () => {
      const search = createTestSearchInput();

      const suggestions = search.querySelector('.dos-searchinput__suggestions');
      expect(suggestions?.getAttribute('role')).toBe('listbox');
    });

    it('has role="option" on suggestion items', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      const item = search.querySelector('.dos-searchinput__suggestion');
      expect(item?.getAttribute('role')).toBe('option');
    });

    it('updates aria-expanded when suggestions open/close', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      expect(input.getAttribute('aria-expanded')).toBe('false');

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(input.getAttribute('aria-expanded')).toBe('true');

      search.closeSuggestions();

      expect(input.getAttribute('aria-expanded')).toBe('false');
    });

    it('sets aria-activedescendant to highlighted item', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      const activeId = input.getAttribute('aria-activedescendant');
      expect(activeId).toBe('test-search-suggestion-0');
    });

    it('sets aria-busy during loading', async () => {
      const provider = vi.fn().mockImplementation(() => {
        return new Promise(resolve => setTimeout(() => resolve([]), 100));
      });

      const search = createTestSearchInput({
        suggestions: [],
        suggestionProvider: provider,
      });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(input.getAttribute('aria-busy')).toBe('true');
    });
  });

  describe('highlight matches', () => {
    it('highlights matching text by default', async () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      const highlight = search.querySelector('.dos-searchinput__highlight');
      expect(highlight).not.toBeNull();
      expect(highlight?.textContent).toBe('CONFIG');
    });

    it('disables highlighting when highlightMatches is false', async () => {
      const search = createTestSearchInput({ highlightMatches: false });
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.value = 'CONFIG';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 10));

      const highlight = search.querySelector('.dos-searchinput__highlight');
      expect(highlight).toBeNull();
    });
  });

  describe('focus management', () => {
    it('focuses input with focus()', () => {
      const search = createTestSearchInput();

      search.focus();

      const input = search.querySelector('.dos-searchinput__input');
      expect(document.activeElement).toBe(input);
    });

    it('blurs input with blur()', () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;
      input.focus();

      search.blur();

      expect(document.activeElement).not.toBe(input);
    });

    it('adds focused class on focus', () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));

      expect(search.classList.contains('dos-searchinput--focused')).toBe(true);
    });

    it('removes focused class on blur', () => {
      const search = createTestSearchInput();
      const input = search.querySelector('.dos-searchinput__input') as HTMLInputElement;

      input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
      input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

      expect(search.classList.contains('dos-searchinput--focused')).toBe(false);
    });
  });

  describe('destroy', () => {
    it('cleans up event listeners', () => {
      const search = createTestSearchInput();

      expect(() => search.destroy()).not.toThrow();
    });
  });
});
