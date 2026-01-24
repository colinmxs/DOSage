/**
 * ListBox Component Types
 *
 * Types for the DOS-style selectable list component with keyboard navigation.
 */

/**
 * Individual list item definition
 */
export interface ListBoxItem {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Primary/main text content
   */
  primary: string;

  /**
   * Secondary/supporting text (optional)
   */
  secondary?: string;

  /**
   * Leading icon character (optional)
   */
  icon?: string;

  /**
   * Trailing content - text or element (optional)
   */
  trailing?: string | HTMLElement;

  /**
   * Whether this item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional data associated with the item
   */
  data?: Record<string, unknown>;
}

/**
 * Props for creating a ListBox component
 */
export interface ListBoxProps {
  /**
   * List items to display
   */
  items: ListBoxItem[];

  /**
   * Enable item selection
   * @default false
   */
  selectable?: boolean;

  /**
   * Allow multiple items to be selected
   * @default false
   */
  multiSelect?: boolean;

  /**
   * Currently selected item IDs
   * @default []
   */
  selectedItems?: string[];

  /**
   * Show borders around items
   * @default false
   */
  bordered?: boolean;

  /**
   * Show dividers between items
   * @default false
   */
  dividers?: boolean;

  /**
   * Show selection checkboxes/indicators
   * @default true (when selectable)
   */
  showSelectionIndicator?: boolean;

  /**
   * Callback when selection changes
   */
  onSelect?: (selectedIds: string[]) => void;

  /**
   * Callback when an item is clicked
   */
  onItemClick?: (item: ListBoxItem, index: number) => void;

  /**
   * Callback when an item is double-clicked
   */
  onItemDoubleClick?: (item: ListBoxItem, index: number) => void;

  /**
   * Maximum height before scrolling (CSS value)
   */
  maxHeight?: string | number;

  /**
   * Empty state message
   * @default 'No items'
   */
  emptyMessage?: string;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Custom element ID
   */
  id?: string;

  /**
   * Accessible label for the list
   */
  ariaLabel?: string;
}

/**
 * Instance methods for ListBox
 */
export interface ListBoxInstance {
  /**
   * The list DOM element
   */
  element: HTMLElement;

  /**
   * Update the list items
   */
  setItems: (items: ListBoxItem[]) => void;

  /**
   * Get all items
   */
  getItems: () => ListBoxItem[];

  /**
   * Select items by ID
   */
  selectItems: (itemIds: string[]) => void;

  /**
   * Clear all selections
   */
  clearSelection: () => void;

  /**
   * Select all items
   */
  selectAll: () => void;

  /**
   * Toggle selection of an item
   */
  toggleSelection: (itemId: string) => void;

  /**
   * Get currently selected item IDs
   */
  getSelectedItems: () => string[];

  /**
   * Get selected item objects
   */
  getSelectedData: () => ListBoxItem[];

  /**
   * Focus the list for keyboard navigation
   */
  focus: () => void;

  /**
   * Focus a specific item by ID
   */
  focusItem: (itemId: string) => void;

  /**
   * Scroll an item into view
   */
  scrollToItem: (itemId: string) => void;

  /**
   * Enable/disable an item
   */
  setItemDisabled: (itemId: string, disabled: boolean) => void;

  /**
   * Clean up and remove the list
   */
  destroy: () => void;
}
