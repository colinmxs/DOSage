/**
 * TagInput Component
 *
 * A DOS-style tag input component with free-form tag creation,
 * validation, and optional autocomplete suggestions.
 */

import type {
  TagInputProps,
  Tag,
  TagSuggestion,
  TagInputState,
  TagInputElement,
  TagValidationResult,
  TagAddEventDetail,
  TagRemoveEventDetail,
  TagInvalidEventDetail,
} from './TagInput.types';
import { createDOSCursor, type DOSCursorInstance } from '../../utils/DOSCursor';
import './TagInput.css';

/**
 * Generate a unique ID for a tag
 */
function generateTagId(): string {
  return `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates a DOS-style tag input component.
 *
 * @param props - TagInput configuration options
 * @returns The tag input element with attached methods
 *
 * @example
 * ```typescript
 * import { createTagInput } from 'dosage';
 *
 * const input = createTagInput({
 *   placeholder: 'Add tags...',
 *   delimiters: ['Enter', ','],
 *   maxTags: 5,
 *   onChange: (tags) => console.log('Tags:', tags)
 * });
 *
 * document.body.appendChild(input);
 * ```
 */
export function createTagInput(props: TagInputProps): TagInputElement {
  const {
    value: initialTags = [],
    placeholder = 'Add tags...',
    disabled: initialDisabled = false,
    required = false,
    name,
    delimiters = ['Enter', ','],
    allowDuplicates = false,
    maxTags,
    minTagLength = 1,
    maxTagLength,
    validate,
    suggestions: initialSuggestions = [],
    loadSuggestions,
    suggestionsDebounce = 300,
    showSuggestionsOnFocus = false,
    suggestionsOnly = false,
    maxTagsMessage = 'Maximum tags reached',
    invalidTagMessage = 'Invalid tag',
    duplicateTagMessage = 'Tag already exists',
    className,
    id,
    onChange,
    onAdd,
    onRemove,
    onInvalid,
    onInput,
  } = props;

  // State
  const state: TagInputState = {
    tags: initialTags.map((t) => ({ ...t, id: t.id || generateTagId() })),
    inputValue: '',
    focusedTagIndex: -1,
    suggestionsOpen: false,
    suggestions: [...initialSuggestions],
    highlightedSuggestionIndex: -1,
    isLoading: false,
    error: null,
  };

  // Disabled state
  let isDisabled = initialDisabled;

  // Debounce timer
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Create container
  const container = document.createElement('div') as TagInputElement;
  container.className = buildContainerClasses();
  if (id) {
    container.id = id;
  }

  // Create inner wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'dos-taginput__wrapper';

  // Create tags container
  const tagsContainer = document.createElement('div');
  tagsContainer.className = 'dos-taginput__tags';
  tagsContainer.setAttribute('role', 'list');

  // Create input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'dos-taginput__input';
  input.placeholder = state.tags.length === 0 ? placeholder : '';
  input.disabled = isDisabled;
  input.required = required;
  if (name) {
    input.name = name;
  }

  // ARIA attributes
  const suggestionsId = `${id ?? 'taginput'}-suggestions`;
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', suggestionsId);
  input.setAttribute('aria-haspopup', 'listbox');

  wrapper.appendChild(tagsContainer);
  wrapper.appendChild(input);

  // Create suggestions dropdown
  const suggestionsDropdown = document.createElement('div');
  suggestionsDropdown.id = suggestionsId;
  suggestionsDropdown.className = 'dos-taginput__suggestions';
  suggestionsDropdown.setAttribute('role', 'listbox');
  suggestionsDropdown.hidden = true;

  // Create error message
  const errorEl = document.createElement('div');
  errorEl.className = 'dos-taginput__error';
  errorEl.setAttribute('role', 'alert');
  errorEl.setAttribute('aria-live', 'polite');
  errorEl.hidden = true;

  // Assemble container
  container.appendChild(wrapper);
  container.appendChild(suggestionsDropdown);
  container.appendChild(errorEl);

  // Initialize DOS block cursor overlay
  let cursor: DOSCursorInstance | null = null;
  if (!initialDisabled) {
    cursor = createDOSCursor({
      input,
      wrapper,
      readonly: false,
      disabled: initialDisabled,
    });
  }

  // Initialize
  renderTags();

  /**
   * Build container class string
   */
  function buildContainerClasses(): string {
    const classes = ['dos-taginput'];
    if (isDisabled) {
      classes.push('dos-taginput--disabled');
    }
    if (state.tags.length > 0) {
      classes.push('dos-taginput--has-tags');
    }
    if (state.suggestionsOpen) {
      classes.push('dos-taginput--suggestions-open');
    }
    if (state.error) {
      classes.push('dos-taginput--error');
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
   * Render tags
   */
  function renderTags(): void {
    tagsContainer.innerHTML = '';

    state.tags.forEach((tag, index) => {
      const tagEl = document.createElement('span');
      tagEl.className = 'dos-taginput__tag';
      tagEl.setAttribute('role', 'listitem');
      tagEl.setAttribute('data-id', tag.id);

      if (index === state.focusedTagIndex) {
        tagEl.classList.add('dos-taginput__tag--focused');
      }

      const label = document.createElement('span');
      label.className = 'dos-taginput__tag-label';
      label.textContent = tag.label;
      tagEl.appendChild(label);

      if (tag.removable !== false && !isDisabled) {
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'dos-taginput__tag-remove';
        removeBtn.textContent = '×';
        removeBtn.setAttribute('aria-label', `Remove ${tag.label}`);
        removeBtn.setAttribute('tabindex', '-1');
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          removeTagById(tag.id);
        });
        tagEl.appendChild(removeBtn);
      }

      // Click to focus this tag
      tagEl.addEventListener('click', () => {
        state.focusedTagIndex = index;
        renderTags();
        input.focus();
      });

      tagsContainer.appendChild(tagEl);
    });

    // Update placeholder
    input.placeholder = state.tags.length === 0 ? placeholder : '';
  }

  /**
   * Render suggestions
   */
  function renderSuggestions(): void {
    suggestionsDropdown.innerHTML = '';

    if (state.isLoading) {
      const loading = document.createElement('div');
      loading.className = 'dos-taginput__loading';
      loading.textContent = 'Loading...';
      suggestionsDropdown.appendChild(loading);
      return;
    }

    if (state.suggestions.length === 0) {
      return;
    }

    state.suggestions.forEach((suggestion, index) => {
      const item = document.createElement('div');
      item.id = `${id ?? 'taginput'}-suggestion-${index}`;
      item.className = 'dos-taginput__suggestion';
      item.setAttribute('role', 'option');
      item.setAttribute('data-value', suggestion.value);
      item.setAttribute('data-index', String(index));

      if (index === state.highlightedSuggestionIndex) {
        item.classList.add('dos-taginput__suggestion--highlighted');
        item.setAttribute('aria-selected', 'true');
      } else {
        item.setAttribute('aria-selected', 'false');
      }

      if (suggestion.icon) {
        const icon = document.createElement('span');
        icon.className = 'dos-taginput__suggestion-icon';
        icon.textContent = suggestion.icon;
        icon.setAttribute('aria-hidden', 'true');
        item.appendChild(icon);
      }

      const content = document.createElement('div');
      content.className = 'dos-taginput__suggestion-content';

      const label = document.createElement('span');
      label.className = 'dos-taginput__suggestion-label';
      label.textContent = suggestion.value;
      content.appendChild(label);

      if (suggestion.description) {
        const desc = document.createElement('span');
        desc.className = 'dos-taginput__suggestion-description';
        desc.textContent = suggestion.description;
        content.appendChild(desc);
      }

      item.appendChild(content);

      // Click handler
      item.addEventListener('click', () => {
        selectSuggestion(suggestion);
      });

      // Hover handler
      item.addEventListener('mouseenter', () => {
        state.highlightedSuggestionIndex = index;
        updateSuggestionHighlight();
      });

      suggestionsDropdown.appendChild(item);
    });
  }

  /**
   * Update suggestion highlight
   */
  function updateSuggestionHighlight(): void {
    const items = suggestionsDropdown.querySelectorAll('.dos-taginput__suggestion');
    items.forEach((item, index) => {
      if (index === state.highlightedSuggestionIndex) {
        item.classList.add('dos-taginput__suggestion--highlighted');
        item.setAttribute('aria-selected', 'true');
        if (typeof item.scrollIntoView === 'function') {
          (item as HTMLElement).scrollIntoView({ block: 'nearest' });
        }
      } else {
        item.classList.remove('dos-taginput__suggestion--highlighted');
        item.setAttribute('aria-selected', 'false');
      }
    });

    // Update aria-activedescendant
    if (state.highlightedSuggestionIndex >= 0) {
      const activeId = `${id ?? 'taginput'}-suggestion-${state.highlightedSuggestionIndex}`;
      input.setAttribute('aria-activedescendant', activeId);
    } else {
      input.setAttribute('aria-activedescendant', '');
    }
  }

  /**
   * Open suggestions dropdown
   */
  function openSuggestions(): void {
    if (state.suggestionsOpen || isDisabled) return;
    if (state.suggestions.length === 0 && !state.isLoading) return;

    state.suggestionsOpen = true;
    state.highlightedSuggestionIndex = -1;
    suggestionsDropdown.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    updateContainerClasses();
    renderSuggestions();
  }

  /**
   * Close suggestions dropdown
   */
  function closeSuggestions(): void {
    if (!state.suggestionsOpen) return;

    state.suggestionsOpen = false;
    state.highlightedSuggestionIndex = -1;
    suggestionsDropdown.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-activedescendant', '');
    updateContainerClasses();
  }

  /**
   * Select a suggestion
   */
  async function selectSuggestion(suggestion: TagSuggestion): Promise<void> {
    await addTagFromValue(suggestion.value);
    closeSuggestions();
  }

  /**
   * Show error message
   */
  function showError(message: string): void {
    state.error = message;
    errorEl.textContent = message;
    errorEl.hidden = false;
    updateContainerClasses();

    // Clear error after a delay
    setTimeout(() => {
      clearError();
    }, 3000);
  }

  /**
   * Clear error message
   */
  function clearError(): void {
    state.error = null;
    errorEl.hidden = true;
    updateContainerClasses();
  }

  /**
   * Validate a tag value
   */
  async function validateTag(value: string): Promise<TagValidationResult> {
    const trimmed = value.trim();

    // Check empty
    if (trimmed.length === 0) {
      return { valid: false, message: 'Tag cannot be empty' };
    }

    // Check min length
    if (trimmed.length < minTagLength) {
      return { valid: false, message: `Tag must be at least ${minTagLength} characters` };
    }

    // Check max length
    if (maxTagLength && trimmed.length > maxTagLength) {
      return { valid: false, message: `Tag must be at most ${maxTagLength} characters` };
    }

    // Check duplicates
    if (!allowDuplicates) {
      const isDuplicate = state.tags.some(
        (t) => t.label.toLowerCase() === trimmed.toLowerCase()
      );
      if (isDuplicate) {
        return { valid: false, message: duplicateTagMessage };
      }
    }

    // Check max tags
    if (maxTags && state.tags.length >= maxTags) {
      return { valid: false, message: maxTagsMessage };
    }

    // Check suggestions only mode
    if (suggestionsOnly) {
      const allSuggestions = [...initialSuggestions, ...state.suggestions];
      const found = allSuggestions.some(
        (s) => s.value.toLowerCase() === trimmed.toLowerCase()
      );
      if (!found) {
        return { valid: false, message: 'Please select from suggestions' };
      }
    }

    // Custom validation
    if (validate) {
      const result = await validate(trimmed, state.tags);
      if (!result.valid) {
        return result;
      }
    }

    return { valid: true };
  }

  /**
   * Add a tag from a value string
   */
  async function addTagFromValue(value: string): Promise<boolean> {
    const trimmed = value.trim();
    if (!trimmed) return false;

    // Validate
    const result = await validateTag(trimmed);
    if (!result.valid) {
      showError(result.message ?? invalidTagMessage);
      dispatchInvalidEvent(trimmed, result.message ?? invalidTagMessage);
      return false;
    }

    // Create tag
    const tag: Tag = {
      id: generateTagId(),
      label: trimmed,
      removable: true,
    };

    state.tags.push(tag);
    state.inputValue = '';
    input.value = '';
    state.focusedTagIndex = -1;

    clearError();
    renderTags();
    updateContainerClasses();

    dispatchAddEvent(tag);
    dispatchChangeEvent();

    return true;
  }

  /**
   * Remove a tag by ID
   */
  function removeTagById(tagId: string): void {
    const index = state.tags.findIndex((t) => t.id === tagId);
    if (index === -1) return;

    const tag = state.tags[index];
    state.tags.splice(index, 1);

    // Adjust focused index
    if (state.focusedTagIndex >= state.tags.length) {
      state.focusedTagIndex = state.tags.length - 1;
    }

    renderTags();
    updateContainerClasses();

    if (tag) {
      dispatchRemoveEvent(tag);
    }
    dispatchChangeEvent();
  }

  /**
   * Dispatch add event
   */
  function dispatchAddEvent(tag: Tag): void {
    const event = new CustomEvent<TagAddEventDetail>('dos:taginput:add', {
      bubbles: true,
      detail: {
        tag,
        tags: [...state.tags],
      },
    });
    container.dispatchEvent(event);

    if (onAdd) {
      onAdd(tag);
    }
  }

  /**
   * Dispatch remove event
   */
  function dispatchRemoveEvent(tag: Tag): void {
    const event = new CustomEvent<TagRemoveEventDetail>('dos:taginput:remove', {
      bubbles: true,
      detail: {
        tag,
        tags: [...state.tags],
      },
    });
    container.dispatchEvent(event);

    if (onRemove) {
      onRemove(tag);
    }
  }

  /**
   * Dispatch invalid event
   */
  function dispatchInvalidEvent(value: string, error: string): void {
    const event = new CustomEvent<TagInvalidEventDetail>('dos:taginput:invalid', {
      bubbles: true,
      detail: {
        value,
        error,
      },
    });
    container.dispatchEvent(event);

    if (onInvalid) {
      onInvalid(value, error);
    }
  }

  /**
   * Dispatch change event
   */
  function dispatchChangeEvent(): void {
    const event = new CustomEvent('dos:taginput:change', {
      bubbles: true,
      detail: {
        tags: [...state.tags],
      },
    });
    container.dispatchEvent(event);

    if (onChange) {
      onChange([...state.tags]);
    }
  }

  /**
   * Load suggestions asynchronously
   */
  async function loadSuggestionsAsync(query: string): Promise<void> {
    if (!loadSuggestions) return;

    state.isLoading = true;
    openSuggestions();
    renderSuggestions();

    try {
      const results = await loadSuggestions(query);
      state.suggestions = results;
      state.isLoading = false;
      state.highlightedSuggestionIndex = -1; // Don't highlight by default

      if (results.length > 0) {
        openSuggestions();
      } else {
        closeSuggestions();
      }

      renderSuggestions();
    } catch {
      state.isLoading = false;
      state.suggestions = [];
      closeSuggestions();
    }
  }

  /**
   * Filter static suggestions
   */
  function filterStaticSuggestions(query: string): void {
    if (initialSuggestions.length === 0) return;

    const normalizedQuery = query.toLowerCase();
    const filtered = initialSuggestions.filter((s) => {
      // Don't suggest already added tags
      if (state.tags.some((t) => t.label.toLowerCase() === s.value.toLowerCase())) {
        return false;
      }
      return s.value.toLowerCase().includes(normalizedQuery);
    });

    state.suggestions = filtered;
    state.highlightedSuggestionIndex = -1; // Don't highlight by default

    if (filtered.length > 0) {
      openSuggestions();
    } else {
      closeSuggestions();
    }

    renderSuggestions();
  }

  /**
   * Handle input changes
   */
  function handleInput(): void {
    const value = input.value;
    state.inputValue = value;
    state.focusedTagIndex = -1;

    clearError();

    if (onInput) {
      onInput(value);
    }

    // Clear debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Load/filter suggestions
    if (loadSuggestions) {
      debounceTimer = setTimeout(() => {
        loadSuggestionsAsync(value);
      }, suggestionsDebounce);
    } else if (initialSuggestions.length > 0) {
      filterStaticSuggestions(value);
    }
  }

  /**
   * Handle keyboard events
   */
  function handleKeyDown(event: KeyboardEvent): void {
    const value = input.value;

    // Check for delimiter keys
    if (delimiters.includes(event.key)) {
      event.preventDefault();

      // If suggestions are open and one is highlighted, select it
      if (
        state.suggestionsOpen &&
        state.highlightedSuggestionIndex >= 0 &&
        event.key === 'Enter'
      ) {
        const suggestion = state.suggestions[state.highlightedSuggestionIndex];
        if (suggestion) {
          selectSuggestion(suggestion);
          return;
        }
      }

      // Otherwise add tag from input
      if (value.trim()) {
        addTagFromValue(value);
      }
      return;
    }

    switch (event.key) {
      case 'Backspace':
        if (value === '' && state.tags.length > 0) {
          // Remove the last tag directly when input is empty
          const lastTag = state.tags[state.tags.length - 1];
          if (lastTag && lastTag.removable !== false) {
            removeTagById(lastTag.id);
          }
        }
        break;

      case 'Delete':
        if (state.focusedTagIndex >= 0) {
          const tag = state.tags[state.focusedTagIndex];
          if (tag && tag.removable !== false) {
            removeTagById(tag.id);
          }
        }
        break;

      case 'ArrowLeft':
        if (value === '' && state.tags.length > 0) {
          if (state.focusedTagIndex > 0) {
            state.focusedTagIndex--;
          } else if (state.focusedTagIndex === -1) {
            state.focusedTagIndex = state.tags.length - 1;
          }
          renderTags();
        }
        break;

      case 'ArrowRight':
        if (state.focusedTagIndex >= 0) {
          if (state.focusedTagIndex < state.tags.length - 1) {
            state.focusedTagIndex++;
          } else {
            state.focusedTagIndex = -1;
          }
          renderTags();
        }
        break;

      case 'ArrowDown':
        if (state.suggestionsOpen && state.suggestions.length > 0) {
          event.preventDefault();
          state.highlightedSuggestionIndex =
            (state.highlightedSuggestionIndex + 1) % state.suggestions.length;
          updateSuggestionHighlight();
        } else if (initialSuggestions.length > 0 || loadSuggestions) {
          // Open suggestions when ArrowDown is pressed, even if showSuggestionsOnFocus is false
          event.preventDefault();
          if (initialSuggestions.length > 0) {
            filterStaticSuggestions(value);
            // Highlight first suggestion if suggestions opened successfully
            if (state.suggestions.length > 0) {
              state.highlightedSuggestionIndex = 0;
              updateSuggestionHighlight();
            }
          } else if (loadSuggestions) {
            loadSuggestionsAsync(value);
          }
        }
        break;

      case 'ArrowUp':
        if (state.suggestionsOpen && state.suggestions.length > 0) {
          event.preventDefault();
          state.highlightedSuggestionIndex =
            (state.highlightedSuggestionIndex - 1 + state.suggestions.length) %
            state.suggestions.length;
          updateSuggestionHighlight();
        } else if (initialSuggestions.length > 0 || loadSuggestions) {
          // Open suggestions when ArrowUp is pressed, even if showSuggestionsOnFocus is false
          event.preventDefault();
          if (initialSuggestions.length > 0) {
            filterStaticSuggestions(value);
            // Highlight last suggestion if suggestions opened successfully
            if (state.suggestions.length > 0) {
              state.highlightedSuggestionIndex = state.suggestions.length - 1;
              updateSuggestionHighlight();
            }
          } else if (loadSuggestions) {
            loadSuggestionsAsync(value);
          }
        }
        break;

      case 'Escape':
        if (state.suggestionsOpen) {
          event.preventDefault();
          closeSuggestions();
        } else if (state.focusedTagIndex >= 0) {
          state.focusedTagIndex = -1;
          renderTags();
        } else if (value) {
          input.value = '';
          state.inputValue = '';
        }
        break;

      case 'Home':
        if (state.suggestionsOpen && state.suggestions.length > 0) {
          event.preventDefault();
          state.highlightedSuggestionIndex = 0;
          updateSuggestionHighlight();
        }
        break;

      case 'End':
        if (state.suggestionsOpen && state.suggestions.length > 0) {
          event.preventDefault();
          state.highlightedSuggestionIndex = state.suggestions.length - 1;
          updateSuggestionHighlight();
        }
        break;
    }
  }

  /**
   * Handle input paste
   */
  function handlePaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text');
    if (!pastedText) return;

    // Check if paste contains delimiters
    const delimiterPattern = delimiters
      .filter((d) => d !== 'Enter')
      .map((d) => (d === ',' ? ',' : d))
      .join('|');

    if (delimiterPattern) {
      const regex = new RegExp(delimiterPattern);
      if (regex.test(pastedText)) {
        event.preventDefault();

        // Split by delimiters and add each as tag
        const parts = pastedText.split(regex);
        parts.forEach((part) => {
          const trimmed = part.trim();
          if (trimmed) {
            addTagFromValue(trimmed);
          }
        });
      }
    }
  }

  /**
   * Handle focus
   */
  function handleFocus(): void {
    container.classList.add('dos-taginput--focused');
    state.focusedTagIndex = -1;
    renderTags();

    if (showSuggestionsOnFocus && initialSuggestions.length > 0) {
      filterStaticSuggestions(state.inputValue);
    }
  }

  /**
   * Handle blur
   */
  function handleBlur(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as Node | null;
    if (!container.contains(relatedTarget)) {
      container.classList.remove('dos-taginput--focused');
      closeSuggestions();
    }
  }

  /**
   * Handle clicks outside
   */
  function handleDocumentClick(event: MouseEvent): void {
    if (!container.contains(event.target as Node)) {
      closeSuggestions();
    }
  }

  // Set up event listeners
  input.addEventListener('input', handleInput);
  input.addEventListener('keydown', handleKeyDown);
  input.addEventListener('paste', handlePaste);
  input.addEventListener('focus', handleFocus);
  input.addEventListener('blur', handleBlur);
  container.addEventListener('keydown', handleContainerKeyDown);
  document.addEventListener('click', handleDocumentClick);

  /**
   * Handle keyboard events on container (for tag navigation when focus is on container)
   */
  function handleContainerKeyDown(event: KeyboardEvent): void {
    // Only handle if event target is the container or a tag, not the input
    if (event.target === input) return;
    
    // Handle tag navigation and deletion when a tag is focused
    if (state.focusedTagIndex >= 0) {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (state.focusedTagIndex > 0) {
            state.focusedTagIndex--;
          }
          renderTags();
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (state.focusedTagIndex < state.tags.length - 1) {
            state.focusedTagIndex++;
          } else {
            state.focusedTagIndex = -1;
            input.focus();
          }
          renderTags();
          break;

        case 'Backspace':
        case 'Delete': {
          event.preventDefault();
          const tag = state.tags[state.focusedTagIndex];
          if (tag && tag.removable !== false) {
            const wasLastTag = state.focusedTagIndex === state.tags.length - 1;
            removeTagById(tag.id);
            // Adjust focus
            if (state.tags.length === 0) {
              state.focusedTagIndex = -1;
              input.focus();
            } else if (wasLastTag) {
              state.focusedTagIndex = state.tags.length - 1;
            }
            renderTags();
          }
          break;
        }

        case 'Escape':
          event.preventDefault();
          state.focusedTagIndex = -1;
          input.focus();
          renderTags();
          break;
      }
    }
  }

  // Public API
  container.getTags = (): Tag[] => [...state.tags];

  container.setTags = (tags: Tag[]): void => {
    state.tags = tags.map((t) => ({ ...t, id: t.id ?? generateTagId() }));
    if (maxTags && state.tags.length > maxTags) {
      state.tags = state.tags.slice(0, maxTags);
    }
    state.focusedTagIndex = -1;
    renderTags();
    updateContainerClasses();
  };

  container.addTag = async (label: string): Promise<boolean> => {
    return addTagFromValue(label);
  };

  container.removeTag = (tagId: string): void => {
    removeTagById(tagId);
  };

  container.clearTags = (): void => {
    state.tags = [];
    state.focusedTagIndex = -1;
    renderTags();
    updateContainerClasses();
    dispatchChangeEvent();
  };

  container.getInputValue = (): string => state.inputValue;

  container.setInputValue = (value: string): void => {
    state.inputValue = value;
    input.value = value;
  };

  container.clearInput = (): void => {
    state.inputValue = '';
    input.value = '';
  };

  container.focus = (): void => input.focus();
  container.blur = (): void => input.blur();

  container.isDisabled = (): boolean => isDisabled;

  container.setDisabled = (disabled: boolean): void => {
    isDisabled = disabled;
    input.disabled = disabled;
    updateContainerClasses();
    renderTags();
    // Update cursor disabled state
    cursor?.setDisabled(disabled);
    if (disabled) {
      closeSuggestions();
    }
  };

  container.setSuggestions = (suggestions: TagSuggestion[]): void => {
    state.suggestions = suggestions;
    if (state.suggestionsOpen) {
      renderSuggestions();
    }
  };

  container.openSuggestions = (): void => {
    if (state.suggestions.length > 0 || state.isLoading) {
      openSuggestions();
    }
  };

  container.closeSuggestions = (): void => closeSuggestions();

  container.isMaxTagsReached = (): boolean => {
    return maxTags !== undefined && state.tags.length >= maxTags;
  };

  container.destroy = (): void => {
    input.removeEventListener('input', handleInput);
    input.removeEventListener('keydown', handleKeyDown);
    input.removeEventListener('paste', handlePaste);
    input.removeEventListener('focus', handleFocus);
    input.removeEventListener('blur', handleBlur);
    document.removeEventListener('click', handleDocumentClick);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    // Clean up cursor
    cursor?.destroy();
    cursor = null;
  };

  return container;
}
