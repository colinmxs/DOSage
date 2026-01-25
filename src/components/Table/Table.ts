/**
 * Table Component
 *
 * A DOS-style data table with box-drawing characters, sortable columns,
 * row selection, striped rows, and full keyboard navigation support.
 *
 * @example
 * ```typescript
 * import { createTable } from 'dosage';
 *
 * const table = createTable({
 *   columns: [
 *     { key: 'name', label: 'Name', sortable: true },
 *     { key: 'size', label: 'Size', align: 'right', sortable: true },
 *     { key: 'date', label: 'Date' }
 *   ],
 *   data: [
 *     { id: '1', name: 'CONFIG.SYS', size: 1024, date: '01-15-26' },
 *     { id: '2', name: 'AUTOEXEC.BAT', size: 512, date: '01-15-26' },
 *   ],
 *   sortable: true,
 *   striped: true,
 *   onSort: (column, direction) => console.log(`Sorted by ${column} ${direction}`),
 * });
 *
 * document.body.appendChild(table.element);
 * ```
 */

import type {
  TableProps,
  TableInstance,
  TableColumn,
  TableRow,
  SortDirection,
} from './Table.types';
import './Table.css';

/**
 * Creates a DOS-style data table
 */
export function createTable(props: TableProps): TableInstance {
  const {
    columns: initialColumns,
    data: initialData,
    sortable = false,
    sortColumn: initialSortColumn,
    sortDirection: initialSortDirection,
    selectable = false,
    selectedRows: initialSelectedRows = [],
    striped = false,
    bordered = true,
    stickyHeader = false,
    emptyMessage = 'No data available',
    onSort,
    onSelect,
    onRowClick,
    className,
    id,
  } = props;

  // State
  let columns = [...initialColumns];
  let data = [...initialData];
  let sortColumnKey: string | null = initialSortColumn ?? null;
  let currentSortDirection: SortDirection | null = initialSortDirection ?? null;
  let selectedRowIds = new Set<string>(initialSelectedRows);
  let focusedRowIndex = -1;

  // Create wrapper for scroll behavior
  const wrapper = document.createElement('div');
  wrapper.className = `dos-table-wrapper${stickyHeader ? ' dos-table-wrapper--sticky' : ''}`;

  // Create table element
  const tableEl = document.createElement('table');
  const classes = ['dos-table'];
  if (striped) classes.push('dos-table--striped');
  if (bordered) classes.push('dos-table--bordered', 'dos-table--box-drawing');
  if (stickyHeader) classes.push('dos-table--sticky-header');
  if (selectable) classes.push('dos-table--selectable');
  if (className) classes.push(className);
  tableEl.className = classes.join(' ');

  if (id) {
    tableEl.id = id;
  }

  // ARIA attributes
  tableEl.setAttribute('role', 'table');
  tableEl.setAttribute('aria-rowcount', String(data.length));
  tableEl.setAttribute('aria-colcount', String(columns.length + (selectable ? 1 : 0)));

  // Create table head
  const thead = document.createElement('thead');
  thead.className = 'dos-table__header';
  thead.setAttribute('role', 'rowgroup');

  // Create table body
  const tbody = document.createElement('tbody');
  tbody.className = 'dos-table__body';
  tbody.setAttribute('role', 'rowgroup');

  /**
   * Render the table header
   */
  function renderHeader(): void {
    thead.innerHTML = '';

    const headerRow = document.createElement('tr');
    headerRow.className = 'dos-table__header-row';
    headerRow.setAttribute('role', 'row');

    // Selection checkbox column
    if (selectable) {
      const checkboxTh = document.createElement('th');
      checkboxTh.className = 'dos-table__header-cell dos-table__header-cell--checkbox';
      checkboxTh.setAttribute('role', 'columnheader');
      checkboxTh.setAttribute('scope', 'col');

      const selectAllBtn = document.createElement('button');
      selectAllBtn.className = 'dos-table__checkbox';
      selectAllBtn.type = 'button';
      selectAllBtn.setAttribute('aria-label', 'Select all rows');
      
      const allSelected = data.length > 0 && selectedRowIds.size === data.length;
      const someSelected = selectedRowIds.size > 0 && selectedRowIds.size < data.length;
      selectAllBtn.textContent = allSelected ? '[X]' : someSelected ? '[-]' : '[ ]';
      selectAllBtn.setAttribute('aria-checked', allSelected ? 'true' : someSelected ? 'mixed' : 'false');

      selectAllBtn.addEventListener('click', () => {
        if (allSelected) {
          clearSelection();
        } else {
          selectAll();
        }
      });

      checkboxTh.appendChild(selectAllBtn);
      headerRow.appendChild(checkboxTh);
    }

    // Column headers
    columns.forEach((column) => {
      const th = document.createElement('th');
      th.className = 'dos-table__header-cell';
      th.setAttribute('role', 'columnheader');
      th.setAttribute('scope', 'col');

      // Alignment
      if (column.align) {
        th.classList.add(`dos-table__header-cell--align-${column.align}`);
      }

      // Width
      if (column.width) {
        th.style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
      }

      // Sortable column
      const isColumnSortable = sortable && column.sortable !== false;
      const isSorted = sortColumnKey === column.key;

      if (isColumnSortable) {
        th.classList.add('dos-table__header-cell--sortable');
        th.setAttribute('tabindex', '0');
        th.setAttribute('aria-sort', isSorted 
          ? (currentSortDirection === 'asc' ? 'ascending' : 'descending')
          : 'none'
        );

        if (isSorted) {
          th.classList.add('dos-table__header-cell--sorted');
        }

        // Sort indicator
        const indicator = document.createElement('span');
        indicator.className = 'dos-table__sort-indicator';
        indicator.setAttribute('aria-hidden', 'true');
        indicator.textContent = isSorted 
          ? (currentSortDirection === 'asc' ? '▲' : '▼')
          : '○';
        th.appendChild(indicator);

        // Click handler
        th.addEventListener('click', () => handleSort(column.key));

        // Keyboard handler
        th.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSort(column.key);
          }
        });
      }

      // Label text
      const labelSpan = document.createElement('span');
      labelSpan.textContent = column.label;
      th.insertBefore(labelSpan, th.firstChild);

      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
  }

  /**
   * Render the table body
   */
  function renderBody(): void {
    tbody.innerHTML = '';

    if (data.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.className = 'dos-table__row dos-table__row--empty';
      emptyRow.setAttribute('role', 'row');

      const emptyCell = document.createElement('td');
      emptyCell.className = 'dos-table__empty-cell';
      emptyCell.colSpan = columns.length + (selectable ? 1 : 0);
      emptyCell.textContent = emptyMessage;
      emptyCell.setAttribute('role', 'cell');

      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
      return;
    }

    data.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');
      tr.className = 'dos-table__row';
      tr.setAttribute('role', 'row');
      tr.setAttribute('aria-rowindex', String(rowIndex + 2)); // +2 because 1-indexed and header is row 1
      tr.dataset.rowId = row.id;

      const isSelected = selectedRowIds.has(row.id);
      if (isSelected) {
        tr.classList.add('dos-table__row--selected');
        tr.setAttribute('aria-selected', 'true');
      } else if (selectable) {
        tr.setAttribute('aria-selected', 'false');
      }

      // Make row focusable for keyboard navigation
      tr.setAttribute('tabindex', rowIndex === focusedRowIndex ? '0' : '-1');

      // Row click handler
      tr.addEventListener('click', (e) => {
        // Don't trigger row click if clicking on checkbox
        if ((e.target as HTMLElement).closest('.dos-table__checkbox')) {
          return;
        }

        if (selectable) {
          toggleRowSelection(row.id);
        }

        onRowClick?.(row, rowIndex);
        focusRow(rowIndex);
      });

      // Keyboard navigation for rows
      tr.addEventListener('keydown', (e) => handleRowKeydown(e, row, rowIndex));

      // Selection checkbox
      if (selectable) {
        const checkboxTd = document.createElement('td');
        checkboxTd.className = 'dos-table__cell dos-table__cell--checkbox';
        checkboxTd.setAttribute('role', 'cell');

        const checkbox = document.createElement('button');
        checkbox.className = 'dos-table__checkbox';
        checkbox.type = 'button';
        checkbox.setAttribute('aria-label', `Select row ${rowIndex + 1}`);
        checkbox.textContent = isSelected ? '[X]' : '[ ]';
        checkbox.setAttribute('aria-checked', String(isSelected));

        checkbox.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleRowSelection(row.id);
        });

        checkboxTd.appendChild(checkbox);
        tr.appendChild(checkboxTd);
      }

      // Data cells
      columns.forEach((column) => {
        const td = document.createElement('td');
        td.className = 'dos-table__cell';
        td.setAttribute('role', 'cell');

        if (column.align) {
          td.classList.add(`dos-table__cell--align-${column.align}`);
        }

        const value = row[column.key];

        // Custom renderer or default
        if (column.render) {
          const rendered = column.render(value, row, rowIndex);
          if (typeof rendered === 'string') {
            td.textContent = rendered;
          } else {
            td.appendChild(rendered);
          }
        } else {
          td.textContent = formatCellValue(value);
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  /**
   * Format a cell value for display
   */
  function formatCellValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return String(value);
  }

  /**
   * Handle column sort
   */
  function handleSort(columnKey: string): void {
    let newDirection: SortDirection;

    if (sortColumnKey === columnKey) {
      // Toggle direction
      newDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to ascending
      newDirection = 'asc';
    }

    sortColumnKey = columnKey;
    currentSortDirection = newDirection;

    // Re-render header to update indicators
    renderHeader();

    // Notify callback
    onSort?.(columnKey, newDirection);
  }

  /**
   * Toggle row selection
   */
  function toggleRowSelection(rowId: string): void {
    if (selectedRowIds.has(rowId)) {
      selectedRowIds.delete(rowId);
    } else {
      selectedRowIds.add(rowId);
    }

    renderHeader(); // Update select all checkbox
    renderBody(); // Update row selections
    onSelect?.(Array.from(selectedRowIds));
  }

  /**
   * Handle keyboard navigation on rows
   */
  function handleRowKeydown(e: KeyboardEvent, row: TableRow, rowIndex: number): void {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusRow(Math.min(rowIndex + 1, data.length - 1));
        break;

      case 'ArrowUp':
        e.preventDefault();
        focusRow(Math.max(rowIndex - 1, 0));
        break;

      case 'Home':
        e.preventDefault();
        focusRow(0);
        break;

      case 'End':
        e.preventDefault();
        focusRow(data.length - 1);
        break;

      case ' ':
      case 'Space':
        if (selectable) {
          e.preventDefault();
          toggleRowSelection(row.id);
        }
        break;

      case 'Enter':
        e.preventDefault();
        onRowClick?.(row, rowIndex);
        break;
    }
  }

  /**
   * Focus a specific row
   */
  function focusRow(index: number): void {
    if (index < 0 || index >= data.length) return;

    focusedRowIndex = index;
    const rows = tbody.querySelectorAll('.dos-table__row:not(.dos-table__row--empty)');
    
    rows.forEach((row, i) => {
      const tr = row as HTMLElement;
      tr.setAttribute('tabindex', i === index ? '0' : '-1');
      if (i === index) {
        tr.focus();
      }
    });
  }

  /**
   * Initial render
   */
  function render(): void {
    tableEl.innerHTML = '';
    renderHeader();
    renderBody();
    tableEl.appendChild(thead);
    tableEl.appendChild(tbody);
  }

  // Instance methods
  function setData(newData: TableRow[]): void {
    data = [...newData];
    tableEl.setAttribute('aria-rowcount', String(data.length));
    renderBody();
    renderHeader(); // Update select all state
  }

  function setColumns(newColumns: TableColumn[]): void {
    columns = [...newColumns];
    tableEl.setAttribute('aria-colcount', String(columns.length + (selectable ? 1 : 0)));
    render();
  }

  function sort(columnKey: string, direction?: SortDirection): void {
    sortColumnKey = columnKey;
    currentSortDirection = direction ?? 'asc';
    renderHeader();
    onSort?.(columnKey, currentSortDirection);
  }

  function selectRows(rowIds: string[]): void {
    selectedRowIds = new Set(rowIds);
    renderHeader();
    renderBody();
    onSelect?.(Array.from(selectedRowIds));
  }

  function clearSelection(): void {
    selectedRowIds.clear();
    renderHeader();
    renderBody();
    onSelect?.([]);
  }

  function selectAll(): void {
    selectedRowIds = new Set(data.map(row => row.id));
    renderHeader();
    renderBody();
    onSelect?.(Array.from(selectedRowIds));
  }

  function getSelectedRows(): string[] {
    return Array.from(selectedRowIds);
  }

  function getSortState(): { column: string | null; direction: SortDirection | null } {
    return { column: sortColumnKey, direction: currentSortDirection };
  }

  function focus(): void {
    if (data.length > 0) {
      focusRow(focusedRowIndex >= 0 ? focusedRowIndex : 0);
    } else {
      tableEl.focus();
    }
  }

  function destroy(): void {
    wrapper.remove();
  }

  // Initial render
  render();
  wrapper.appendChild(tableEl);

  return {
    element: wrapper,
    setData,
    setColumns,
    sort,
    selectRows,
    clearSelection,
    selectAll,
    getSelectedRows,
    getSortState,
    focus,
    destroy,
  };
}
