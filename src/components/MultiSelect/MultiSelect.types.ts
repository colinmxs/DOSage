/**
 * MultiSelect Component Types
 *
 * Type definitions for the DOS-style multi-select component with
 * tag/chip display and searchable dropdown.
 */

/**
 * A single option in the MultiSelect
 */
export interface MultiSelectOption {
  /** Unique value for the option */
  value: string;

  /** Display label for the option */
  label: string;

  /** Optional icon (emoji, character) */
  icon?: string;

  /** Whether the option is disabled */
  disabled?: boolean;

  /** Optional description */
  description?: string;

  /** Group identifier for grouping options */
  group?: string;
}

/**
 * Option group for organizing options
 */
export interface MultiSelectGroup {
  /** Unique group identifier */
  id: string;

  /** Display label for the group */
  label: string;

  /** Optional icon for the group */
  icon?: string;
}

/**
 * Custom render function for options
 */
export type MultiSelectRenderOption = (
  option: MultiSelectOption,
  isHighlighted: boolean,
  isSelected: boolean
) => string | HTMLElement;

/**
 * Custom render function for tags
 */
export type MultiSelectRenderTag = (option: MultiSelectOption) => string | HTMLElement;

/**
 * Configuration options for the MultiSelect component
 */
export interface MultiSelectProps {
  /** Available options */
  options: MultiSelectOption[];

  /** Option groups for organizing options */
  groups?: MultiSelectGroup[];

  /** Initial selected values */
  value?: string[];

  /** Placeholder text when no selection */
  placeholder?: string;

  /** Whether the component is disabled */
  disabled?: boolean;

  /** Whether the component is required */
  required?: boolean;

  /** Name attribute for form submission */
  name?: string;

  /** Enable search/filter functionality */
  searchable?: boolean;

  /** Placeholder for search input */
  searchPlaceholder?: string;

  /** Maximum number of selections allowed */
  maxSelections?: number;

  /** Show "Select All" option */
  showSelectAll?: boolean;

  /** Label for "Select All" option */
  selectAllLabel?: string;

  /** Show "Clear All" button */
  showClearAll?: boolean;

  /** Label for "Clear All" button */
  clearAllLabel?: string;

  /** Custom filter function for search */
  filterFunction?: (option: MultiSelectOption, query: string) => boolean;

  /** Custom render function for options */
  renderOption?: MultiSelectRenderOption;

  /** Custom render function for tags */
  renderTag?: MultiSelectRenderTag;

  /** Message to show when no options match search */
  noMatchesMessage?: string;

  /** Message to show when max selections reached */
  maxSelectionsMessage?: string;

  /** Maximum height of dropdown in pixels */
  maxDropdownHeight?: number;

  /** Additional CSS class names */
  className?: string;

  /** Element ID */
  id?: string;

  /**
   * Callback when selection changes
   * @param values - Array of selected values
   * @param options - Array of selected option objects
   */
  onChange?: (values: string[], options: MultiSelectOption[]) => void;

  /**
   * Callback when dropdown toggles
   * @param isOpen - Whether dropdown is now open
   */
  onDropdownToggle?: (isOpen: boolean) => void;

  /**
   * Callback when search input changes
   * @param query - Current search query
   */
  onSearch?: (query: string) => void;
}

/**
 * Internal state for the MultiSelect component
 */
export interface MultiSelectState {
  /** Currently selected values */
  selectedValues: string[];

  /** Whether dropdown is open */
  isOpen: boolean;

  /** Current search query */
  searchQuery: string;

  /** Currently highlighted option index */
  highlightedIndex: number;

  /** Filtered options based on search */
  filteredOptions: MultiSelectOption[];
}

/**
 * Event detail for selection change events
 */
export interface MultiSelectChangeEventDetail {
  /** Array of selected values */
  values: string[];

  /** Array of selected option objects */
  options: MultiSelectOption[];

  /** The option that was added or removed (if applicable) */
  changedOption: MultiSelectOption | null;

  /** Whether the change was an addition or removal */
  action?: 'add' | 'remove' | 'clear' | 'selectAll';
}

/**
 * Extended HTMLElement with MultiSelect methods
 */
export interface MultiSelectElement extends HTMLDivElement {
  /** Get selected values */
  getValue: () => string[];

  /** Set selected values */
  setValue: (values: string[]) => void;

  /** Get selected options */
  getSelectedOptions: () => MultiSelectOption[];

  /** Select a value */
  select: (value: string) => void;

  /** Deselect a value */
  deselect: (value: string) => void;

  /** Toggle a value */
  toggle: (value: string) => void;

  /** Select all options */
  selectAll: () => void;

  /** Clear all selections */
  clearAll: () => void;

  /** Open dropdown */
  open: () => void;

  /** Close dropdown */
  close: () => void;

  /** Check if dropdown is open */
  isOpen: () => boolean;

  /** Get highlighted option */
  getHighlightedOption: () => MultiSelectOption | null;

  /** Set options dynamically */
  setOptions: (options: MultiSelectOption[]) => void;

  /** Get current options */
  getOptions: () => MultiSelectOption[];

  /** Set search query */
  setSearchQuery: (query: string) => void;

  /** Get search query */
  getSearchQuery: () => string;

  /** Focus the component */
  focus: () => void;

  /** Blur the component */
  blur: () => void;

  /** Check if disabled */
  isDisabled: () => boolean;

  /** Set disabled state */
  setDisabled: (disabled: boolean) => void;

  /** Check if max selections reached */
  isMaxSelectionsReached: () => boolean;

  /** Clean up event listeners */
  destroy: () => void;
}
