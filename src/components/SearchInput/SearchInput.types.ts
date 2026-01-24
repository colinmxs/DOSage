/**
 * SearchInput Component Types
 *
 * Type definitions for the DOS-style search input with autocomplete.
 */

/**
 * Search suggestion item definition
 */
export interface SearchSuggestion {
  /** Unique identifier for the suggestion */
  id: string;
  /** Display text for the suggestion */
  label: string;
  /** Optional description shown below the label */
  description?: string;
  /** Optional value (if different from label) */
  value?: string;
  /** Optional icon to display */
  icon?: string;
  /** Whether the suggestion is disabled */
  disabled?: boolean;
  /** Optional category for grouping */
  category?: string;
  /** Custom data associated with the suggestion */
  data?: unknown;
}

/**
 * Suggestion provider function for async loading
 */
export type SuggestionProvider = (query: string) => SearchSuggestion[] | Promise<SearchSuggestion[]>;

/**
 * SearchInput component configuration options
 */
export interface SearchInputProps {
  /** Initial search value */
  value?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Prompt/prefix text shown before input (e.g., "FIND:" or "[?]") */
  prompt?: string;

  /** Static suggestions list (used if no provider specified) */
  suggestions?: SearchSuggestion[];

  /** Async suggestion provider function */
  suggestionProvider?: SuggestionProvider;

  /** Debounce delay in milliseconds for suggestion loading (default: 300) */
  debounceDelay?: number;

  /** Minimum characters required before showing suggestions (default: 1) */
  minChars?: number;

  /** Maximum number of suggestions to display (default: 10) */
  maxSuggestions?: number;

  /** Whether to highlight matching text in suggestions (default: true) */
  highlightMatches?: boolean;

  /** Whether to show a clear button (default: true) */
  showClearButton?: boolean;

  /** Whether to close suggestions on select (default: true) */
  closeOnSelect?: boolean;

  /** Whether to clear input on select (default: false) */
  clearOnSelect?: boolean;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Whether the input is required */
  required?: boolean;

  /** Optional name attribute for form submission */
  name?: string;

  /** Message shown when no results match (default: "No results found") */
  noResultsMessage?: string;

  /** Loading message shown during async loading (default: "Searching...") */
  loadingMessage?: string;

  /** Custom className for the container */
  className?: string;

  /** Custom id for the container */
  id?: string;

  /** Callback fired when value changes */
  onChange?: (value: string) => void;

  /** Callback fired when a suggestion is selected */
  onSelect?: (suggestion: SearchSuggestion) => void;

  /** Callback fired when search is submitted (Enter without selecting) */
  onSubmit?: (value: string) => void;

  /** Callback fired when input is cleared */
  onClear?: () => void;

  /** Callback fired when suggestions open/close */
  onSuggestionsToggle?: (open: boolean) => void;
}

/**
 * Internal state for SearchInput
 */
export interface SearchInputState {
  /** Current input value */
  value: string;
  /** Whether suggestions are visible */
  suggestionsOpen: boolean;
  /** Currently filtered/loaded suggestions */
  suggestions: SearchSuggestion[];
  /** Index of highlighted suggestion (-1 for none) */
  highlightedIndex: number;
  /** Whether suggestions are loading */
  isLoading: boolean;
  /** Whether there was an error loading suggestions */
  hasError: boolean;
}

/**
 * Custom event detail for search input events
 */
export interface SearchInputEventDetail {
  value: string;
}

/**
 * Custom event detail for suggestion selection
 */
export interface SearchSelectEventDetail {
  suggestion: SearchSuggestion;
  value: string;
}

/**
 * Extended HTMLElement with SearchInput public API
 */
export interface SearchInputElement extends HTMLElement {
  /** Get the current input value */
  getValue: () => string;

  /** Set the input value */
  setValue: (value: string) => void;

  /** Clear the input and close suggestions */
  clear: () => void;

  /** Open the suggestions dropdown */
  openSuggestions: () => void;

  /** Close the suggestions dropdown */
  closeSuggestions: () => void;

  /** Toggle the suggestions dropdown */
  toggleSuggestions: () => void;

  /** Whether suggestions are currently open */
  isSuggestionsOpen: () => boolean;

  /** Update suggestions programmatically */
  setSuggestions: (suggestions: SearchSuggestion[]) => void;

  /** Get the currently highlighted suggestion */
  getHighlightedSuggestion: () => SearchSuggestion | null;

  /** Focus the input */
  focus: () => void;

  /** Blur the input */
  blur: () => void;

  /** Whether the input is disabled */
  isDisabled: () => boolean;

  /** Set disabled state */
  setDisabled: (disabled: boolean) => void;

  /** Check if loading */
  isLoading: () => boolean;

  /** Clean up event listeners */
  destroy: () => void;
}
