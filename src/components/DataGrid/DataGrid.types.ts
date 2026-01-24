/**
 * DataGrid Component Types
 *
 * Types for the enhanced DOS-style data grid with cell editing,
 * column resizing, reordering, and pagination support.
 */

import type { TableProps, TableColumn, TableRow, SortDirection, CellAlignment } from '../Table/Table.types';

/**
 * Re-export types from Table
 */
export type { SortDirection, CellAlignment, TableRow };

/**
 * Extended column definition for DataGrid
 */
export interface DataGridColumn extends TableColumn {
  /**
   * Whether this column is editable
   * @default false
   */
  editable?: boolean;

  /**
   * Whether this column can be resized
   * @default true
   */
  resizable?: boolean;

  /**
   * Minimum width when resizing (CSS value)
   * @default '50px'
   */
  minWidth?: string | number;

  /**
   * Maximum width when resizing (CSS value)
   */
  maxWidth?: string | number;

  /**
   * Input type for editing ('text', 'number', 'select')
   * @default 'text'
   */
  inputType?: 'text' | 'number' | 'select';

  /**
   * Options for select input type
   */
  selectOptions?: { value: string; label: string }[];

  /**
   * Custom editor renderer
   */
  renderEditor?: (value: unknown, row: TableRow, column: DataGridColumn) => HTMLElement;

  /**
   * Validation function for cell edits
   * @returns true if valid, or error message string
   */
  validate?: (value: unknown, row: TableRow) => boolean | string;
}

/**
 * Pagination configuration for DataGrid
 */
export interface PaginationConfig {
  /**
   * Enable pagination
   * @default false
   */
  enabled: boolean;

  /**
   * Number of rows per page
   * @default 10
   */
  pageSize?: number;

  /**
   * Available page size options
   * @default [10, 25, 50, 100]
   */
  pageSizeOptions?: number[];

  /**
   * Current page (1-indexed)
   * @default 1
   */
  currentPage?: number;

  /**
   * Show page size selector
   * @default true
   */
  showPageSizeSelector?: boolean;

  /**
   * Show row count info
   * @default true
   */
  showRowCount?: boolean;
}

/**
 * Cell edit event data
 */
export interface CellEditEvent {
  /**
   * The row being edited
   */
  row: TableRow;

  /**
   * Row index in the data array
   */
  rowIndex: number;

  /**
   * Column key
   */
  column: string;

  /**
   * Previous cell value
   */
  oldValue: unknown;

  /**
   * New cell value
   */
  newValue: unknown;
}

/**
 * Column resize event data
 */
export interface ColumnResizeEvent {
  /**
   * Column key
   */
  column: string;

  /**
   * Previous width
   */
  oldWidth: number;

  /**
   * New width
   */
  newWidth: number;
}

/**
 * Column reorder event data
 */
export interface ColumnReorderEvent {
  /**
   * Column key being moved
   */
  column: string;

  /**
   * Previous column index
   */
  fromIndex: number;

  /**
   * New column index
   */
  toIndex: number;

  /**
   * New column order
   */
  newOrder: string[];
}

/**
 * Props for creating a DataGrid component
 */
export interface DataGridProps extends Omit<TableProps, 'columns'> {
  /**
   * Extended column definitions
   */
  columns: DataGridColumn[];

  /**
   * Enable cell editing
   * @default false
   */
  editable?: boolean;

  /**
   * Enable column resizing
   * @default false
   */
  resizableColumns?: boolean;

  /**
   * Enable column reordering via drag
   * @default false
   */
  reorderableColumns?: boolean;

  /**
   * Pagination configuration
   */
  pagination?: PaginationConfig;

  /**
   * Enable virtual scrolling for large datasets
   * Note: Virtual scrolling is placeholder - full implementation pending
   * @default false
   */
  virtualScroll?: boolean;

  /**
   * Callback when a cell is edited
   */
  onCellEdit?: (event: CellEditEvent) => void;

  /**
   * Callback when a column is resized
   */
  onColumnResize?: (event: ColumnResizeEvent) => void;

  /**
   * Callback when columns are reordered
   */
  onColumnReorder?: (event: ColumnReorderEvent) => void;

  /**
   * Callback when page changes
   */
  onPageChange?: (page: number) => void;

  /**
   * Callback when page size changes
   */
  onPageSizeChange?: (pageSize: number) => void;
}

/**
 * Instance methods for DataGrid
 */
export interface DataGridInstance {
  /**
   * The grid DOM element
   */
  element: HTMLElement;

  /**
   * Update the grid data
   */
  setData: (data: TableRow[]) => void;

  /**
   * Update the columns
   */
  setColumns: (columns: DataGridColumn[]) => void;

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
   * Select all rows on current page
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
   * Start editing a cell
   */
  startEdit: (rowId: string, column: string) => void;

  /**
   * Cancel current edit
   */
  cancelEdit: () => void;

  /**
   * Commit current edit
   */
  commitEdit: () => void;

  /**
   * Get the currently editing cell info
   */
  getEditingCell: () => { rowId: string; column: string } | null;

  /**
   * Resize a column
   */
  resizeColumn: (column: string, width: number) => void;

  /**
   * Get column widths
   */
  getColumnWidths: () => Record<string, number>;

  /**
   * Reorder columns
   */
  reorderColumns: (newOrder: string[]) => void;

  /**
   * Get current column order
   */
  getColumnOrder: () => string[];

  /**
   * Go to a specific page
   */
  goToPage: (page: number) => void;

  /**
   * Set page size
   */
  setPageSize: (pageSize: number) => void;

  /**
   * Get pagination state
   */
  getPaginationState: () => {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRows: number;
  };

  /**
   * Focus the grid for keyboard navigation
   */
  focus: () => void;

  /**
   * Clean up and remove the grid
   */
  destroy: () => void;
}
