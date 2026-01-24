/**
 * SearchInput Component
 *
 * A DOS-style search input with autocomplete suggestions support.
 * Features debounced search, async loading, keyboard navigation, and accessibility.
 */

import type {
  SearchInputProps,
  SearchSuggestion,
  SearchInputState,
  SearchInputElement,
  SearchInputEventDetail,
  SearchSelectEventDetail,
} from './SearchInput.types';
import './SearchInput.css';

/**
 * Creates a DOS-style search input component.
 *
 * @param props - SearchInput configuration options
 * @returns The search input element with attached methods
 *
 * @example
 * ```typescript
 * import { createSearchInput } from 'dosage';
 *
 * const search = createSearchInput({
 *   prompt: 'FIND:',
 *   suggestions: [
 *     { id: '1', label: 'CONFIG.SYS' },
 *     { id: '2', label: 'AUTOEXEC.BAT' },
 *   ],
 *   onSelect: (suggestion) => console.log(`Selected: ${suggestion.label}`)
 * });
 *
 * document.body.appendChild(search);
 * ```
 */
export function createSearchInput(props: SearchInputProps): SearchInputElement {
  const {
    value: initialValue = '',
    placeholder = 'Search...',
    prompt = '[?]',
    suggestions: staticSuggestions = [],
    suggestionProvider,
    debounceDelay = 300,
    minChars = 1,
    maxSuggestions = 10,
    highlightMatches = true,
    showClearButton = true,
    closeOnSelect = true,
    clearOnSelect = false,
    disabled: initialDisabled = false,
    required = false,
    name,
    noResultsMessage = 'No results found',
    loadingMessage = 'Searching...',
    className,
    id,
    onChange,
    onSelect,
    onSubmit,
    onClear,
    onSuggestionsToggle,
  } = props;

  // State
  const state: SearchInputState = {
    value: initialValue,
    suggestionsOpen: false,
    suggestions: [],
    highlightedIndex: -1,
    isLoading: false,
    hasError: false,
  };

  // Debounce timer
  let debounceTimer: number | null = null;

  // Disabled state
  let isDisabled = initialDisabled;

  // Create container
  const container = document.createElement('div') as unknown as SearchInputElement;
  container.className = buildContainerClasses();
  if (id) {
    container.id = id;
  }

  // Create input wrapper
  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'dos-searchinput__wrapper';

  // Create prompt label
  const promptEl = document.createElement('span');
  promptEl.className = 'dos-searchinput__prompt';
  promptEl.textContent = prompt;
  promptEl.setAttribute('aria-hidden', 'true');

  // Create input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'dos-searchinput__input';
  input.placeholder = placeholder;
  input.value = initialValue;
  input.disabled = isDisabled;
  input.required = required;
  if (name) {
    input.name = name;
  }

  // Combobox ARIA
  const suggestionsId = `${id || 'searchinput'}-suggestions`;
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', suggestionsId);
  input.setAttribute('aria-haspopup', 'listbox');

  // Create clear button
  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'dos-searchinput__clear';
  clearButton.textContent = '[X]';
  clearButton.setAttribute('aria-label', 'Clear search');
  clearButton.tabIndex = -1;
  clearButton.hidden = !showClearButton || !state.value;

  // Assemble input wrapper
  inputWrapper.appendChild(promptEl);
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(clearButton);

  // Create suggestions dropdown
  const suggestionsDropdown = document.createElement('div');
  suggestionsDropdown.id = suggestionsId;
  suggestionsDropdown.className = 'dos-searchinput__suggestions';
  suggestionsDropdown.setAttribute('role', 'listbox');
  suggestionsDropdown.hidden = true;

  // Create loading indicator
  const loadingEl = document.createElement('div');
  loadingEl.className = 'dos-searchinput__loading';
  loadingEl.textContent = loadingMessage;
  loadingEl.hidden = true;

  // Create no results message
  const noResultsEl = document.createElement('div');
  noResultsEl.className = 'dos-searchinput__no-results';
  noResultsEl.textContent = noResultsMessage;
  noResultsEl.hidden = true;

  // Assemble container
  container.appendChild(inputWrapper);
  container.appendChild(suggestionsDropdown);

  /**
   * Build container class string
   */
  function buildContainerClasses(): string {
    const classes = ['dos-searchinput'];
    if (isDisabled) {
      classes.push('dos-searchinput--disabled');
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
   * Filter static suggestions
   */
  function filterStaticSuggestions(query: string): SearchSuggestion[] {
    if (!query || query.length < minChars) {
      return [];
    }

    const normalizedQuery = query.toLowerCase();

    return staticSuggestions
      .filter((suggestion) => {
        if (suggestion.disabled) return false;
        const searchText = [suggestion.label, suggestion.description, suggestion.value]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return searchText.includes(normalizedQuery);
      })
      .slice(0, maxSuggestions);
  }

  /**
   * Load suggestions (async or static)
   */
  async function loadSuggestions(query: string): Promise<void> {
    if (!query || query.length < minChars) {
      closeSuggestionsDropdown();
      return;
    }

    if (suggestionProvider) {
      // Async loading
      state.isLoading = true;
      state.hasError = false;
      updateLoadingState();
      openSuggestionsDropdown();

      try {
        const results = await suggestionProvider(query);
        state.suggestions = results.slice(0, maxSuggestions);
        state.isLoading = false;
        state.highlightedIndex = state.suggestions.length > 0 ? 0 : -1;
        renderSuggestions();
      } catch {
        state.hasError = true;
        state.isLoading = false;
        state.suggestions = [];
        renderSuggestions();
      }
    } else {
      // Static filtering
      state.suggestions = filterStaticSuggestions(query);
      state.highlightedIndex = state.suggestions.length > 0 ? 0 : -1;

      if (state.suggestions.length > 0) {
        openSuggestionsDropdown();
        renderSuggestions();
      } else if (query.length >= minChars) {
        openSuggestionsDropdown();
        renderSuggestions(); // Will show no results
      } else {
        closeSuggestionsDropdown();
      }
    }
  }

  /**
   * Update loading state UI
   */
  function updateLoadingState(): void {
    if (state.isLoading) {
      suggestionsDropdown.innerHTML = '';
      loadingEl.hidden = false;
      suggestionsDropdown.appendChild(loadingEl);
      input.setAttribute('aria-busy', 'true');
    } else {
      loadingEl.hidden = true;
      input.removeAttribute('aria-busy');
    }
  }

  /**
   * Render suggestions list
   */
  function renderSuggestions(): void {
    suggestionsDropdown.innerHTML = '';

    if (state.isLoading) {
      loadingEl.hidden = false;
      suggestionsDropdown.appendChild(loadingEl);
      return;
    }

    if (state.suggestions.length === 0) {
      noResultsEl.hidden = false;
      suggestionsDropdown.appendChild(noResultsEl);
      input.setAttribute('aria-activedescendant', '');
      return;
    }

    noResultsEl.hidden = true;

    state.suggestions.forEach((suggestion, index) => {
      const item = createSuggestionItem(suggestion, index);
      suggestionsDropdown.appendChild(item);
    });

    // Set initial active descendant
    if (state.highlightedIndex >= 0) {
      const activeId = `${id || 'searchinput'}-suggestion-${state.highlightedIndex}`;
      input.setAttribute('aria-activedescendant', activeId);
    }
  }

  /**
   * Create a suggestion item element
   */
  function createSuggestionItem(suggestion: SearchSuggestion, index: number): HTMLElement {
    const item = document.createElement('div');
    item.id = `${id || 'searchinput'}-suggestion-${index}`;
    item.className = 'dos-searchinput__suggestion';
    item.setAttribute('role', 'option');
    item.setAttribute('data-suggestion-id', suggestion.id);
    item.setAttribute('data-index', String(index));

    if (suggestion.disabled) {
      item.classList.add('dos-searchinput__suggestion--disabled');
      item.setAttribute('aria-disabled', 'true');
    }

    if (index === state.highlightedIndex) {
      item.classList.add('dos-searchinput__suggestion--highlighted');
      item.setAttribute('aria-selected', 'true');
    } else {
      item.setAttribute('aria-selected', 'false');
    }

    // Icon
    if (suggestion.icon) {
      const icon = document.createElement('span');
      icon.className = 'dos-searchinput__suggestion-icon';
      icon.textContent = suggestion.icon;
      icon.setAttribute('aria-hidden', 'true');
      item.appendChild(icon);
    }

    // Content container
    const content = document.createElement('div');
    content.className = 'dos-searchinput__suggestion-content';

    // Label
    const label = document.createElement('span');
    label.className = 'dos-searchinput__suggestion-label';
    label.innerHTML = highlightMatches ? highlightMatch(suggestion.label, state.value) : escapeHtml(suggestion.label);
    content.appendChild(label);

    // Description
    if (suggestion.description) {
      const desc = document.createElement('span');
      desc.className = 'dos-searchinput__suggestion-description';
      desc.textContent = suggestion.description;
      content.appendChild(desc);
    }

    item.appendChild(content);

    // Click handler
    item.addEventListener('click', () => {
      if (!suggestion.disabled) {
        selectSuggestion(suggestion);
      }
    });

    // Hover handler
    item.addEventListener('mouseenter', () => {
      if (!suggestion.disabled) {
        state.highlightedIndex = index;
        updateHighlight();
      }
    });

    return item;
  }

  /**
   * Highlight matching text
   */
  function highlightMatch(text: string, query: string): string {
    if (!query) return escapeHtml(text);

    const normalizedQuery = query.toLowerCase();
    const normalizedText = text.toLowerCase();
    const index = normalizedText.indexOf(normalizedQuery);

    if (index === -1) return escapeHtml(text);

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    return `${escapeHtml(before)}<mark class="dos-searchinput__highlight">${escapeHtml(match)}</mark>${escapeHtml(after)}`;
  }

  /**
   * Escape HTML special characters
   */
  function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Update highlight state
   */
  function updateHighlight(): void {
    const items = suggestionsDropdown.querySelectorAll('.dos-searchinput__suggestion');
    items.forEach((item, index) => {
      if (index === state.highlightedIndex) {
        item.classList.add('dos-searchinput__suggestion--highlighted');
        item.setAttribute('aria-selected', 'true');
        if (typeof item.scrollIntoView === 'function') {
          item.scrollIntoView({ block: 'nearest' });
        }
      } else {
        item.classList.remove('dos-searchinput__suggestion--highlighted');
        item.setAttribute('aria-selected', 'false');
      }
    });

    // Update aria-activedescendant
    if (state.highlightedIndex >= 0) {
      const activeId = `${id || 'searchinput'}-suggestion-${state.highlightedIndex}`;
      input.setAttribute('aria-activedescendant', activeId);
    } else {
      input.setAttribute('aria-activedescendant', '');
    }
  }

  /**
   * Open suggestions dropdown
   */
  function openSuggestionsDropdown(): void {
    if (state.suggestionsOpen) return;

    state.suggestionsOpen = true;
    suggestionsDropdown.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    container.classList.add('dos-searchinput--open');

    if (onSuggestionsToggle) {
      onSuggestionsToggle(true);
    }
  }

  /**
   * Close suggestions dropdown
   */
  function closeSuggestionsDropdown(): void {
    if (!state.suggestionsOpen) return;

    state.suggestionsOpen = false;
    state.highlightedIndex = -1;
    suggestionsDropdown.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-activedescendant', '');
    container.classList.remove('dos-searchinput--open');

    if (onSuggestionsToggle) {
      onSuggestionsToggle(false);
    }
  }

  /**
   * Select a suggestion
   */
  function selectSuggestion(suggestion: SearchSuggestion): void {
    const value = suggestion.value || suggestion.label;

    // Dispatch event
    const event = new CustomEvent<SearchSelectEventDetail>('dos:search:select', {
      bubbles: true,
      detail: {
        suggestion,
        value,
      },
    });
    container.dispatchEvent(event);

    // Callback
    if (onSelect) {
      onSelect(suggestion);
    }

    if (clearOnSelect) {
      clearInput();
    } else {
      state.value = value;
      input.value = value;
      updateClearButton();

      if (onChange) {
        onChange(value);
      }
    }

    if (closeOnSelect) {
      closeSuggestionsDropdown();
    }

    input.focus();
  }

  /**
   * Clear the input
   */
  function clearInput(): void {
    state.value = '';
    input.value = '';
    state.suggestions = [];
    state.highlightedIndex = -1;
    updateClearButton();
    closeSuggestionsDropdown();

    // Dispatch event
    const event = new CustomEvent<SearchInputEventDetail>('dos:search:clear', {
      bubbles: true,
      detail: { value: '' },
    });
    container.dispatchEvent(event);

    if (onClear) {
      onClear();
    }

    if (onChange) {
      onChange('');
    }
  }

  /**
   * Update clear button visibility
   */
  function updateClearButton(): void {
    clearButton.hidden = !showClearButton || !state.value;
  }

  /**
   * Handle input change
   */
  function handleInput(): void {
    const newValue = input.value;
    state.value = newValue;
    updateClearButton();

    // Dispatch event
    const event = new CustomEvent<SearchInputEventDetail>('dos:search:input', {
      bubbles: true,
      detail: { value: newValue },
    });
    container.dispatchEvent(event);

    if (onChange) {
      onChange(newValue);
    }

    // Debounced suggestion loading
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = window.setTimeout(() => {
      loadSuggestions(newValue);
    }, debounceDelay);
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!state.suggestionsOpen && state.value.length >= minChars) {
          loadSuggestions(state.value);
        } else if (state.suggestionsOpen && state.suggestions.length > 0) {
          state.highlightedIndex = (state.highlightedIndex + 1) % state.suggestions.length;
          updateHighlight();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (state.suggestionsOpen && state.suggestions.length > 0) {
          state.highlightedIndex =
            (state.highlightedIndex - 1 + state.suggestions.length) % state.suggestions.length;
          updateHighlight();
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (state.suggestionsOpen && state.highlightedIndex >= 0) {
          const suggestion = state.suggestions[state.highlightedIndex];
          if (suggestion && !suggestion.disabled) {
            selectSuggestion(suggestion);
          }
        } else {
          // Submit search
          const submitEvent = new CustomEvent<SearchInputEventDetail>('dos:search:submit', {
            bubbles: true,
            detail: { value: state.value },
          });
          container.dispatchEvent(submitEvent);

          if (onSubmit) {
            onSubmit(state.value);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        if (state.suggestionsOpen) {
          closeSuggestionsDropdown();
        } else if (state.value) {
          clearInput();
        }
        break;

      case 'Tab':
        // Accept highlighted suggestion on Tab (if open)
        if (state.suggestionsOpen && state.highlightedIndex >= 0) {
          const suggestion = state.suggestions[state.highlightedIndex];
          if (suggestion && !suggestion.disabled) {
            selectSuggestion(suggestion);
            event.preventDefault();
          }
        }
        break;

      case 'Home':
        if (state.suggestionsOpen && state.suggestions.length > 0) {
          event.preventDefault();
          state.highlightedIndex = 0;
          updateHighlight();
        }
        break;

      case 'End':
        if (state.suggestionsOpen && state.suggestions.length > 0) {
          event.preventDefault();
          state.highlightedIndex = state.suggestions.length - 1;
          updateHighlight();
        }
        break;
    }
  }

  /**
   * Handle focus
   */
  function handleFocus(): void {
    container.classList.add('dos-searchinput--focused');
  }

  /**
   * Handle blur
   */
  function handleBlur(event: FocusEvent): void {
    container.classList.remove('dos-searchinput--focused');

    // Close suggestions if focus moves outside the component
    const relatedTarget = event.relatedTarget as Node | null;
    if (!container.contains(relatedTarget)) {
      // Delay to allow click events on suggestions
      setTimeout(() => {
        closeSuggestionsDropdown();
      }, 150);
    }
  }

  /**
   * Handle clear button click
   */
  function handleClearClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    clearInput();
    input.focus();
  }

  /**
   * Handle clicks outside
   */
  function handleDocumentClick(event: MouseEvent): void {
    if (!container.contains(event.target as Node)) {
      closeSuggestionsDropdown();
    }
  }

  // Set up event listeners
  input.addEventListener('input', handleInput);
  input.addEventListener('keydown', handleKeyDown);
  input.addEventListener('focus', handleFocus);
  input.addEventListener('blur', handleBlur);
  clearButton.addEventListener('click', handleClearClick);
  document.addEventListener('click', handleDocumentClick);

  // Public API
  container.getValue = () => state.value;

  container.setValue = (value: string) => {
    state.value = value;
    input.value = value;
    updateClearButton();

    if (onChange) {
      onChange(value);
    }
  };

  container.clear = () => {
    clearInput();
  };

  container.openSuggestions = () => {
    loadSuggestions(state.value);
  };

  container.closeSuggestions = () => {
    closeSuggestionsDropdown();
  };

  container.toggleSuggestions = () => {
    if (state.suggestionsOpen) {
      closeSuggestionsDropdown();
    } else {
      loadSuggestions(state.value);
    }
  };

  container.isSuggestionsOpen = () => state.suggestionsOpen;

  container.setSuggestions = (suggestions: SearchSuggestion[]) => {
    state.suggestions = suggestions.slice(0, maxSuggestions);
    state.highlightedIndex = state.suggestions.length > 0 ? 0 : -1;
    if (state.suggestions.length > 0) {
      openSuggestionsDropdown();
    }
    renderSuggestions();
  };

  container.getHighlightedSuggestion = (): SearchSuggestion | null => {
    if (state.highlightedIndex >= 0 && state.highlightedIndex < state.suggestions.length) {
      return state.suggestions[state.highlightedIndex] ?? null;
    }
    return null;
  };

  container.focus = () => {
    input.focus();
  };

  container.blur = () => {
    input.blur();
  };

  container.isDisabled = () => isDisabled;

  container.setDisabled = (disabled: boolean) => {
    isDisabled = disabled;
    input.disabled = disabled;
    updateContainerClasses();
    if (disabled) {
      closeSuggestionsDropdown();
    }
  };

  container.isLoading = () => state.isLoading;

  container.destroy = () => {
    input.removeEventListener('input', handleInput);
    input.removeEventListener('keydown', handleKeyDown);
    input.removeEventListener('focus', handleFocus);
    input.removeEventListener('blur', handleBlur);
    clearButton.removeEventListener('click', handleClearClick);
    document.removeEventListener('click', handleDocumentClick);

    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
    }
  };

  return container;
}
