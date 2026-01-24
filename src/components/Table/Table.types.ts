/**
 * Table Component Types
 *
 * Types for the DOS-style data table component with sorting,
 * selection, and keyboard navigation support.
 */

/**
 * Sort direction for table columns
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Text alignment options for table cells
 */
export type CellAlignment = 'left' | 'center' | 'right';

/**
 * Column definition for the table
 */
export interface TableColumn {
  /**
   * Unique key that maps to the data property
   */
  key: string;

  /**
   * Column header text
   */
  label: string;

  /**
   * Column width (CSS value)
   */
  width?: string | number;

  /**
   * Whether this column is sortable
   * @default false
   */
  sortable?: boolean;

  /**
   * Text alignment for cells in this column
   * @default 'left'
   */
  align?: CellAlignment;

  /**
   * Custom cell renderer function
   * @param value - The cell value
   * @param row - The entire row data
   * @param rowIndex - The row index
   * @returns HTML element or string to render
   */
  render?: (value: unknown, row: Record<string, unknown>, rowIndex: number) => HTMLElement | string;
}

/**
 * Row data with required ID field
 */
export interface TableRow {
  /**
   * Unique identifier for the row (required for selection)
   */
  id: string;

  /**
   * Additional data properties
   */
  [key: string]: unknown;
}

/**
 * Props for creating a Table component
 */
export interface TableProps {
  /**
   * Column definitions
   */
  columns: TableColumn[];

  /**
   * Row data array
   */
  data: TableRow[];

  /**
   * Enable sorting functionality
   * @default false
   */
  sortable?: boolean;

  /**
   * Currently sorted column key
   */
  sortColumn?: string;

  /**
   * Current sort direction
   */
  sortDirection?: SortDirection;

  /**
   * Enable row selection
   * @default false
   */
  selectable?: boolean;

  /**
   * Currently selected row IDs
   * @default []
   */
  selectedRows?: string[];

  /**
   * Show alternating row colors
   * @default false
   */
  striped?: boolean;

  /**
   * Show cell borders
   * @default true
   */
  bordered?: boolean;

  /**
   * Keep header fixed when scrolling
   * @default false
   */
  stickyHeader?: boolean;

  /**
   * Message displayed when there's no data
   * @default 'No data available'
   */
  emptyMessage?: string;

  /**
   * Callback when a column is sorted
   */
  onSort?: (column: string, direction: SortDirection) => void;

  /**
   * Callback when row selection changes
   */
  onSelect?: (selectedRows: string[]) => void;

  /**
   * Callback when a row is clicked
   */
  onRowClick?: (row: TableRow, index: number) => void;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Custom element ID
   */
  id?: string;
}

/**
 * Instance methods for Table
 */
export interface TableInstance {
  /**
   * The table DOM element
   */
  element: HTMLElement;

  /**
   * Update the table data
   */
  setData: (data: TableRow[]) => void;

  /**
   * Update the columns
   */
  setColumns: (columns: TableColumn[]) => void;

  /**
   * Sort by a specific column
   */
  sort: (column: string, direction?: SortDirection) => void;

  /**
   * Select rows programmatically
   */
  selectRows: (rowIds: string[]) => void;

  /**
   * Clear all selections
   */
  clearSelection: () => void;

  /**
   * Select all rows
   */
  selectAll: () => void;

  /**
   * Get currently selected row IDs
   */
  getSelectedRows: () => string[];

  /**
   * Get the current sort state
   */
  getSortState: () => { column: string | null; direction: SortDirection | null };

  /**
   * Focus the table for keyboard navigation
   */
  focus: () => void;

  /**
   * Clean up and remove the table
   */
  destroy: () => void;
}
