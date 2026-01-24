/**
 * TagInput Component Types
 *
 * Type definitions for the DOS-style tag input component with
 * free-form tag creation and optional autocomplete.
 */

/**
 * A tag in the TagInput
 */
export interface Tag {
  /** Unique identifier for the tag */
  id: string;

  /** Display label for the tag */
  label: string;

  /** Whether the tag can be removed */
  removable?: boolean;
}

/**
 * Suggestion for autocomplete
 */
export interface TagSuggestion {
  /** Value/label for the suggestion */
  value: string;

  /** Optional description */
  description?: string;

  /** Optional icon */
  icon?: string;
}

/**
 * Validation result
 */
export interface TagValidationResult {
  /** Whether the tag is valid */
  valid: boolean;

  /** Error message if invalid */
  message?: string;
}

/**
 * Validation function type
 */
export type TagInputValidation = (
  value: string,
  existingTags: Tag[]
) => TagValidationResult | Promise<TagValidationResult>;

/**
 * Configuration options for the TagInput component
 */
export interface TagInputProps {
  /** Initial tags */
  value?: Tag[];

  /** Placeholder text when no tags */
  placeholder?: string;

  /** Whether the component is disabled */
  disabled?: boolean;

  /** Whether the component is required */
  required?: boolean;

  /** Name attribute for form submission */
  name?: string;

  /** Delimiter characters for creating tags (default: Enter, comma) */
  delimiters?: string[];

  /** Allow duplicate tags */
  allowDuplicates?: boolean;

  /** Maximum number of tags */
  maxTags?: number;

  /** Minimum tag length */
  minTagLength?: number;

  /** Maximum tag length */
  maxTagLength?: number;

  /** Custom validation function */
  validate?: TagInputValidation;

  /** Suggestions for autocomplete */
  suggestions?: TagSuggestion[];

  /** Async function to load suggestions */
  loadSuggestions?: (query: string) => Promise<TagSuggestion[]>;

  /** Debounce delay for loading suggestions (ms) */
  suggestionsDebounce?: number;

  /** Show suggestions immediately on focus */
  showSuggestionsOnFocus?: boolean;

  /** Allow only values from suggestions (no free-form) */
  suggestionsOnly?: boolean;

  /** Message when max tags reached */
  maxTagsMessage?: string;

  /** Message when tag is invalid */
  invalidTagMessage?: string;

  /** Message when tag is duplicate */
  duplicateTagMessage?: string;

  /** Additional CSS class names */
  className?: string;

  /** Element ID */
  id?: string;

  /**
   * Callback when tags change
   * @param tags - Array of current tags
   */
  onChange?: (tags: Tag[]) => void;

  /**
   * Callback when a tag is added
   * @param tag - The added tag
   */
  onAdd?: (tag: Tag) => void;

  /**
   * Callback when a tag is removed
   * @param tag - The removed tag
   */
  onRemove?: (tag: Tag) => void;

  /**
   * Callback when validation fails
   * @param value - The invalid value
   * @param error - The error message
   */
  onInvalid?: (value: string, error: string) => void;

  /**
   * Callback when input changes
   * @param value - Current input value
   */
  onInput?: (value: string) => void;
}

/**
 * Internal state for the TagInput component
 */
export interface TagInputState {
  /** Current tags */
  tags: Tag[];

  /** Current input value */
  inputValue: string;

  /** Currently focused tag index (-1 for input) */
  focusedTagIndex: number;

  /** Whether suggestions are shown */
  suggestionsOpen: boolean;

  /** Current suggestions */
  suggestions: TagSuggestion[];

  /** Highlighted suggestion index */
  highlightedSuggestionIndex: number;

  /** Whether suggestions are loading */
  isLoading: boolean;

  /** Current error message */
  error: string | null;
}

/**
 * Event detail for tag add events
 */
export interface TagAddEventDetail {
  /** The added tag */
  tag: Tag;

  /** All current tags */
  tags: Tag[];
}

/**
 * Event detail for tag remove events
 */
export interface TagRemoveEventDetail {
  /** The removed tag */
  tag: Tag;

  /** All current tags */
  tags: Tag[];
}

/**
 * Event detail for invalid tag events
 */
export interface TagInvalidEventDetail {
  /** The invalid value */
  value: string;

  /** The error message */
  error: string;
}

/**
 * Extended HTMLElement with TagInput methods
 */
export interface TagInputElement extends HTMLDivElement {
  /** Get current tags */
  getTags: () => Tag[];

  /** Set tags */
  setTags: (tags: Tag[]) => void;

  /** Add a tag */
  addTag: (label: string) => Promise<boolean>;

  /** Remove a tag by ID */
  removeTag: (id: string) => void;

  /** Clear all tags */
  clearTags: () => void;

  /** Get input value */
  getInputValue: () => string;

  /** Set input value */
  setInputValue: (value: string) => void;

  /** Clear input */
  clearInput: () => void;

  /** Focus the input */
  focus: () => void;

  /** Blur the input */
  blur: () => void;

  /** Check if disabled */
  isDisabled: () => boolean;

  /** Set disabled state */
  setDisabled: (disabled: boolean) => void;

  /** Set suggestions */
  setSuggestions: (suggestions: TagSuggestion[]) => void;

  /** Open suggestions */
  openSuggestions: () => void;

  /** Close suggestions */
  closeSuggestions: () => void;

  /** Check if max tags reached */
  isMaxTagsReached: () => boolean;

  /** Clean up event listeners */
  destroy: () => void;
}
