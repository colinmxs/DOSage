/**
 * DataGrid Component
 *
 * An enhanced DOS-style data grid with cell editing, column resizing,
 * column reordering, and pagination support.
 */

import type {
  DataGridProps,
  DataGridColumn,
  DataGridInstance,
  CellEditEvent,
  ColumnResizeEvent,
  ColumnReorderEvent,
  SortDirection,
  TableRow,
} from './DataGrid.types';
import './DataGrid.css';

/**
 * Creates a DOS-style DataGrid component
 */
export function createDataGrid(props: DataGridProps): DataGridInstance {
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
    editable = false,
    resizableColumns = false,
    reorderableColumns = false,
    pagination,
    onSort,
    onSelect,
    onRowClick,
    onCellEdit,
    onColumnResize,
    onColumnReorder,
    onPageChange,
    onPageSizeChange,
    className,
    id,
  } = props;

  // State
  let columns = [...initialColumns];
  let data = [...initialData];
  let sortColumnState = initialSortColumn || null;
  let sortDirectionState: SortDirection | null = initialSortDirection || null;
  let selectedRowsState = new Set<string>(initialSelectedRows);
  let currentPage = pagination?.currentPage || 1;
  let pageSize = pagination?.pageSize || 10;
  let editingCell: { rowId: string; column: string; element: HTMLElement } | null = null;
  let columnWidths: Record<string, number> = {};
  let columnOrder: string[] = columns.map(col => col.key);
  let focusedRowIndex = -1;

  // Initialize column widths
  columns.forEach(col => {
    if (col.width) {
      const widthNum = typeof col.width === 'number' ? col.width : parseInt(col.width as string, 10);
      if (!isNaN(widthNum)) {
        columnWidths[col.key] = widthNum;
      }
    }
  });

  // Create main container
  const container = document.createElement('div');
  container.className = 'dos-data-grid';
  if (bordered) container.classList.add('dos-data-grid--bordered');
  if (stickyHeader) container.classList.add('dos-data-grid--sticky-header');
  if (className) container.classList.add(className);
  if (id) container.id = id;
  container.setAttribute('role', 'grid');

  // Table wrapper
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'dos-data-grid___table-wrapper';

  // Create table
  const table = document.createElement('table');
  table.className = 'dos-data-grid___table';

  // Generate unique IDs (used for internal element id attributes)
  void (id || `datagrid-${Math.random().toString(36).slice(2, 9)}`);

  /**
   * Get data for current page
   */
  function getPageData(): TableRow[] {
    if (!pagination?.enabled) {
      return data;
    }
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }

  /**
   * Get total pages
   */
  function getTotalPages(): number {
    if (!pagination?.enabled) return 1;
    return Math.max(1, Math.ceil(data.length / pageSize));
  }

  /**
   * Get ordered columns
   */
  function getOrderedColumns(): DataGridColumn[] {
    return columnOrder
      .map(key => columns.find(col => col.key === key))
      .filter((col): col is DataGridColumn => col !== undefined);
  }

  /**
   * Render the table header
   */
  function renderHeader(): HTMLTableSectionElement {
    const thead = document.createElement('thead');
    thead.className = 'dos-data-grid___header';
    thead.setAttribute('role', 'rowgroup');

    const headerRow = document.createElement('tr');
    headerRow.className = 'dos-data-grid___header-row';
    headerRow.setAttribute('role', 'row');

    // Selection checkbox column
    if (selectable) {
      const checkboxTh = document.createElement('th');
      checkboxTh.className = 'dos-data-grid___header-cell dos-data-grid___checkbox-cell';
      checkboxTh.setAttribute('scope', 'col');
      checkboxTh.setAttribute('role', 'columnheader');

      const selectAll = document.createElement('span');
      selectAll.className = 'dos-data-grid___checkbox';
      selectAll.textContent = selectedRowsState.size === getPageData().length && getPageData().length > 0 ? '[X]' : '[ ]';
      selectAll.setAttribute('role', 'checkbox');
      selectAll.setAttribute('aria-checked', String(selectedRowsState.size === getPageData().length && getPageData().length > 0));
      selectAll.setAttribute('aria-label', 'Select all rows');
      selectAll.setAttribute('tabindex', '0');
      selectAll.addEventListener('click', handleSelectAll);
      selectAll.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleSelectAll();
        }
      });

      checkboxTh.appendChild(selectAll);
      headerRow.appendChild(checkboxTh);
    }

    // Data columns
    const orderedColumns = getOrderedColumns();
    orderedColumns.forEach((column) => {
      const th = document.createElement('th');
      th.className = 'dos-data-grid___header-cell';
      th.setAttribute('scope', 'col');
      th.setAttribute('role', 'columnheader');
      th.dataset.columnKey = column.key;

      // Apply width
      if (columnWidths[column.key]) {
        th.style.width = `${columnWidths[column.key]}px`;
      } else if (column.width) {
        th.style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
      }

      // Sortable
      const isColumnSortable = sortable && column.sortable !== false;
      if (isColumnSortable) {
        th.classList.add('dos-data-grid___header-cell--sortable');
        th.setAttribute('tabindex', '0');
        th.setAttribute('aria-sort', 
          sortColumnState === column.key 
            ? (sortDirectionState === 'asc' ? 'ascending' : 'descending')
            : 'none'
        );
        th.addEventListener('click', () => handleSort(column.key));
        th.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSort(column.key);
          }
        });
      }

      // Reorderable
      if (reorderableColumns) {
        th.classList.add('dos-data-grid___header-cell--reorderable');
        th.draggable = true;
        th.addEventListener('dragstart', (e) => handleDragStart(e, column.key));
        th.addEventListener('dragover', handleDragOver);
        th.addEventListener('dragleave', handleDragLeave);
        th.addEventListener('drop', (e) => handleDrop(e, column.key));
        th.addEventListener('dragend', handleDragEnd);
      }

      // Header content
      const content = document.createElement('div');
      content.className = 'dos-data-grid___header-content';

      const label = document.createElement('span');
      label.textContent = column.label;
      content.appendChild(label);

      // Sort indicator
      if (isColumnSortable) {
        const sortIndicator = document.createElement('span');
        sortIndicator.className = 'dos-data-grid___sort-indicator';
        if (sortColumnState === column.key) {
          sortIndicator.classList.add('dos-data-grid___sort-indicator--active');
          sortIndicator.textContent = sortDirectionState === 'asc' ? '▲' : '▼';
        } else {
          sortIndicator.textContent = '◇';
        }
        content.appendChild(sortIndicator);
      }

      th.appendChild(content);

      // Resize handle
      if (resizableColumns && column.resizable !== false) {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'dos-data-grid___resize-handle';
        resizeHandle.addEventListener('mousedown', (e) => handleResizeStart(e, column.key, th));
        th.appendChild(resizeHandle);
      }

      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    return thead;
  }

  /**
   * Render the table body
   */
  function renderBody(): HTMLTableSectionElement {
    const tbody = document.createElement('tbody');
    tbody.className = 'dos-data-grid___body';
    tbody.setAttribute('role', 'rowgroup');

    const pageData = getPageData();
    const orderedColumns = getOrderedColumns();

    if (pageData.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.setAttribute('role', 'row');
      const emptyCell = document.createElement('td');
      emptyCell.className = 'dos-data-grid___empty';
      emptyCell.colSpan = (selectable ? 1 : 0) + orderedColumns.length;
      emptyCell.setAttribute('role', 'cell');
      emptyCell.textContent = emptyMessage;
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
      return tbody;
    }

    pageData.forEach((row, pageIndex) => {
      const actualIndex = pagination?.enabled 
        ? (currentPage - 1) * pageSize + pageIndex 
        : pageIndex;
      const tr = document.createElement('tr');
      tr.className = 'dos-data-grid___row';
      if (striped) tr.classList.add('dos-data-grid___row--striped');
      if (selectedRowsState.has(row.id)) {
        tr.classList.add('dos-data-grid___row--selected');
      }
      tr.setAttribute('role', 'row');
      tr.setAttribute('aria-rowindex', String(actualIndex + 2)); // +2 for header and 1-based
      tr.setAttribute('aria-selected', String(selectedRowsState.has(row.id)));
      tr.setAttribute('tabindex', pageIndex === focusedRowIndex ? '0' : '-1');
      tr.dataset.rowId = row.id;

      // Row keyboard navigation
      tr.addEventListener('keydown', (e) => handleRowKeyDown(e, row, actualIndex, pageIndex));
      tr.addEventListener('click', (e) => {
        if (onRowClick && !(e.target as HTMLElement).closest('.dos-data-grid___checkbox')) {
          onRowClick(row, actualIndex);
        }
      });

      // Selection checkbox
      if (selectable) {
        const checkboxTd = document.createElement('td');
        checkboxTd.className = 'dos-data-grid___cell dos-data-grid___checkbox-cell';
        checkboxTd.setAttribute('role', 'cell');

        const checkbox = document.createElement('span');
        checkbox.className = 'dos-data-grid___checkbox';
        checkbox.textContent = selectedRowsState.has(row.id) ? '[X]' : '[ ]';
        checkbox.setAttribute('role', 'checkbox');
        checkbox.setAttribute('aria-checked', String(selectedRowsState.has(row.id)));
        checkbox.setAttribute('aria-label', `Select row ${row.id}`);
        checkbox.addEventListener('click', (e) => {
          e.stopPropagation();
          handleRowSelect(row.id);
        });

        checkboxTd.appendChild(checkbox);
        tr.appendChild(checkboxTd);
      }

      // Data cells
      orderedColumns.forEach((column) => {
        const td = document.createElement('td');
        td.className = 'dos-data-grid___cell';
        td.setAttribute('role', 'cell');
        td.dataset.columnKey = column.key;

        // Alignment
        const align = column.align || 'left';
        td.classList.add(`dos-data-grid___cell--align-${align}`);

        // Editable
        const isCellEditable = editable && column.editable !== false;
        if (isCellEditable) {
          td.classList.add('dos-data-grid___cell--editable');
          td.setAttribute('aria-readonly', 'false');
          td.addEventListener('dblclick', () => startCellEdit(row.id, column.key, td));
        } else {
          td.setAttribute('aria-readonly', 'true');
        }

        // Check if this cell is being edited
        if (editingCell && editingCell.rowId === row.id && editingCell.column === column.key) {
          td.classList.add('dos-data-grid___cell--editing');
          renderCellEditor(td, row, column);
        } else {
          // Render cell content
          const value = row[column.key];
          if (column.render) {
            const rendered = column.render(value, row, actualIndex);
            if (rendered instanceof HTMLElement) {
              td.appendChild(rendered);
            } else {
              td.textContent = String(rendered);
            }
          } else {
            td.textContent = value != null ? String(value) : '';
          }
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    return tbody;
  }

  /**
   * Render cell editor
   */
  function renderCellEditor(cell: HTMLElement, row: TableRow, column: DataGridColumn): void {
    const value = row[column.key];
    
    if (column.renderEditor) {
      const editor = column.renderEditor(value, row, column);
      cell.appendChild(editor);
      return;
    }

    if (column.inputType === 'select' && column.selectOptions) {
      const select = document.createElement('select');
      select.className = 'dos-data-grid___cell-editor dos-data-grid___cell-editor--select';
      
      column.selectOptions.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        if (String(value) === opt.value) {
          option.selected = true;
        }
        select.appendChild(option);
      });

      select.addEventListener('blur', () => commitCellEdit(select.value, row, column));
      select.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          cancelCellEdit();
        } else if (e.key === 'Enter') {
          commitCellEdit(select.value, row, column);
        } else if (e.key === 'Tab') {
          e.preventDefault();
          commitCellEdit(select.value, row, column);
          moveToNextCell(row.id, column.key, e.shiftKey);
        }
      });

      cell.appendChild(select);
      select.focus();
    } else {
      const input = document.createElement('input');
      input.className = 'dos-data-grid___cell-editor';
      input.type = column.inputType === 'number' ? 'number' : 'text';
      input.value = value != null ? String(value) : '';

      input.addEventListener('blur', () => commitCellEdit(input.value, row, column));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          cancelCellEdit();
        } else if (e.key === 'Enter') {
          commitCellEdit(input.value, row, column);
        } else if (e.key === 'Tab') {
          e.preventDefault();
          commitCellEdit(input.value, row, column);
          moveToNextCell(row.id, column.key, e.shiftKey);
        }
      });

      cell.appendChild(input);
      input.focus();
      input.select();
    }
  }

  /**
   * Render pagination footer
   */
  function renderFooter(): HTMLElement | null {
    if (!pagination?.enabled) {
      return null;
    }

    const footer = document.createElement('div');
    footer.className = 'dos-data-grid___footer';

    // Row count info
    if (pagination.showRowCount !== false) {
      const pageInfo = document.createElement('div');
      pageInfo.className = 'dos-data-grid___page-info';
      const startRow = Math.min((currentPage - 1) * pageSize + 1, data.length);
      const endRow = Math.min(currentPage * pageSize, data.length);
      pageInfo.textContent = `Showing ${startRow}-${endRow} of ${data.length} rows`;
      footer.appendChild(pageInfo);
    }

    // Page size selector
    if (pagination.showPageSizeSelector !== false) {
      const pageSizeContainer = document.createElement('div');
      pageSizeContainer.className = 'dos-data-grid___page-size';

      const label = document.createElement('span');
      label.className = 'dos-data-grid___page-size-label';
      label.textContent = 'Rows per page:';
      pageSizeContainer.appendChild(label);

      const select = document.createElement('select');
      select.className = 'dos-data-grid___page-size-select';
      select.setAttribute('aria-label', 'Rows per page');

      const options = pagination.pageSizeOptions || [10, 25, 50, 100];
      options.forEach(size => {
        const option = document.createElement('option');
        option.value = String(size);
        option.textContent = String(size);
        if (size === pageSize) option.selected = true;
        select.appendChild(option);
      });

      select.addEventListener('change', () => {
        pageSize = parseInt(select.value, 10);
        currentPage = 1; // Reset to first page
        onPageSizeChange?.(pageSize);
        render();
      });

      pageSizeContainer.appendChild(select);
      footer.appendChild(pageSizeContainer);
    }

    // Pagination controls
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'dos-data-grid___pagination';
    paginationContainer.setAttribute('role', 'navigation');
    paginationContainer.setAttribute('aria-label', 'Pagination');

    const totalPages = getTotalPages();

    // First button
    const firstBtn = createPageButton('|◄', () => goToPage(1), currentPage === 1);
    firstBtn.setAttribute('aria-label', 'First page');
    paginationContainer.appendChild(firstBtn);

    // Previous button
    const prevBtn = createPageButton('◄', () => goToPage(currentPage - 1), currentPage === 1);
    prevBtn.setAttribute('aria-label', 'Previous page');
    paginationContainer.appendChild(prevBtn);

    // Page numbers
    const pages = getPaginationRange(currentPage, totalPages);
    pages.forEach((pageNum, _idx) => {
      if (pageNum === '...') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'dos-data-grid___page-ellipsis';
        ellipsis.textContent = '...';
        paginationContainer.appendChild(ellipsis);
      } else {
        const pageBtn = createPageButton(String(pageNum), () => goToPage(pageNum as number), false);
        if (pageNum === currentPage) {
          pageBtn.classList.add('dos-data-grid___page-btn--current');
          pageBtn.setAttribute('aria-current', 'page');
        }
        pageBtn.setAttribute('aria-label', `Page ${pageNum}`);
        paginationContainer.appendChild(pageBtn);
      }
    });

    // Next button
    const nextBtn = createPageButton('►', () => goToPage(currentPage + 1), currentPage === totalPages);
    nextBtn.setAttribute('aria-label', 'Next page');
    paginationContainer.appendChild(nextBtn);

    // Last button
    const lastBtn = createPageButton('►|', () => goToPage(totalPages), currentPage === totalPages);
    lastBtn.setAttribute('aria-label', 'Last page');
    paginationContainer.appendChild(lastBtn);

    footer.appendChild(paginationContainer);
    return footer;
  }

  /**
   * Create pagination button
   */
  function createPageButton(label: string, onClick: () => void, disabled: boolean): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = 'dos-data-grid___page-btn';
    btn.type = 'button';
    btn.textContent = label;
    btn.disabled = disabled;
    btn.addEventListener('click', onClick);
    return btn;
  }

  /**
   * Get pagination range with ellipsis
   */
  function getPaginationRange(current: number, total: number): (number | string)[] {
    const delta = 1;
    const range: (number | string)[] = [];
    
    for (let i = 1; i <= total; i++) {
      if (
        i === 1 || // First page
        i === total || // Last page
        (i >= current - delta && i <= current + delta) // Around current
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    
    return range;
  }

  /**
   * Handle sort
   */
  function handleSort(columnKey: string): void {
    let newDirection: SortDirection = 'asc';
    if (sortColumnState === columnKey) {
      newDirection = sortDirectionState === 'asc' ? 'desc' : 'asc';
    }
    sortColumnState = columnKey;
    sortDirectionState = newDirection;
    onSort?.(columnKey, newDirection);
    render();
  }

  /**
   * Handle select all
   */
  function handleSelectAll(): void {
    const pageData = getPageData();
    const allSelected = pageData.every(row => selectedRowsState.has(row.id));
    
    if (allSelected) {
      pageData.forEach(row => selectedRowsState.delete(row.id));
    } else {
      pageData.forEach(row => selectedRowsState.add(row.id));
    }
    
    onSelect?.(Array.from(selectedRowsState));
    render();
  }

  /**
   * Handle row selection
   */
  function handleRowSelect(rowId: string): void {
    if (selectedRowsState.has(rowId)) {
      selectedRowsState.delete(rowId);
    } else {
      selectedRowsState.add(rowId);
    }
    onSelect?.(Array.from(selectedRowsState));
    render();
  }

  /**
   * Handle row keyboard navigation
   */
  function handleRowKeyDown(e: KeyboardEvent, row: TableRow, actualIndex: number, pageIndex: number): void {
    const pageData = getPageData();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (pageIndex < pageData.length - 1) {
          focusedRowIndex = pageIndex + 1;
          focusRow(focusedRowIndex);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (pageIndex > 0) {
          focusedRowIndex = pageIndex - 1;
          focusRow(focusedRowIndex);
        }
        break;

      case 'Home':
        e.preventDefault();
        focusedRowIndex = 0;
        focusRow(focusedRowIndex);
        break;

      case 'End':
        e.preventDefault();
        focusedRowIndex = pageData.length - 1;
        focusRow(focusedRowIndex);
        break;

      case ' ':
        if (selectable) {
          e.preventDefault();
          handleRowSelect(row.id);
        }
        break;

      case 'Enter':
      case 'F2':
        if (editable) {
          e.preventDefault();
          // Find first editable column
          const orderedCols = getOrderedColumns();
          const editableCol = orderedCols.find(col => col.editable !== false);
          if (editableCol) {
            const cell = container.querySelector(
              `tr[data-row-id="${row.id}"] td[data-column-key="${editableCol.key}"]`
            ) as HTMLElement;
            if (cell) {
              startCellEdit(row.id, editableCol.key, cell);
            }
          }
        } else if (onRowClick) {
          onRowClick(row, actualIndex);
        }
        break;
    }
  }

  /**
   * Focus a row by page index
   */
  function focusRow(pageIndex: number): void {
    const rows = container.querySelectorAll('.dos-data-grid___row');
    if (rows[pageIndex]) {
      (rows[pageIndex] as HTMLElement).focus();
    }
  }

  /**
   * Start cell editing
   */
  function startCellEdit(rowId: string, columnKey: string, cell: HTMLElement): void {
    if (editingCell) {
      // Already editing - commit current edit first
      return;
    }
    editingCell = { rowId, column: columnKey, element: cell };
    render();
  }

  /**
   * Commit cell edit
   */
  function commitCellEdit(newValue: string, row: TableRow, column: DataGridColumn): void {
    if (!editingCell) return;

    const oldValue = row[column.key];
    let parsedValue: unknown = newValue;

    // Parse number values
    if (column.inputType === 'number') {
      parsedValue = newValue === '' ? null : parseFloat(newValue);
    }

    // Validate
    if (column.validate) {
      const validationResult = column.validate(parsedValue, row);
      if (validationResult !== true) {
        // Show validation error
        const editor = editingCell.element.querySelector('.dos-data-grid___cell-editor');
        if (editor) {
          editor.classList.add('dos-data-grid___cell-editor--invalid');
        }
        return;
      }
    }

    // Update data
    const rowIndex = data.findIndex(r => r.id === row.id);
    const existingRow = data[rowIndex];
    if (rowIndex !== -1 && existingRow) {
      const updatedRow: TableRow = { ...existingRow, [column.key]: parsedValue };
      data[rowIndex] = updatedRow;
    }

    const updatedRow = data[rowIndex];
    if (!updatedRow) return;

    const editEvent: CellEditEvent = {
      row: updatedRow,
      rowIndex,
      column: column.key,
      oldValue,
      newValue: parsedValue,
    };

    onCellEdit?.(editEvent);
    editingCell = null;
    render();
  }

  /**
   * Cancel cell edit
   */
  function cancelCellEdit(): void {
    editingCell = null;
    render();
  }

  /**
   * Move to next editable cell
   */
  function moveToNextCell(rowId: string, columnKey: string, reverse: boolean): void {
    const orderedCols = getOrderedColumns();
    const pageData = getPageData();
    
    const currentColIndex = orderedCols.findIndex(col => col.key === columnKey);
    const currentRowIndex = pageData.findIndex(row => row.id === rowId);
    
    let nextColIndex = reverse ? currentColIndex - 1 : currentColIndex + 1;
    let nextRowIndex = currentRowIndex;
    
    // Find next editable cell
    while (true) {
      if (nextColIndex < 0) {
        nextColIndex = orderedCols.length - 1;
        nextRowIndex--;
      } else if (nextColIndex >= orderedCols.length) {
        nextColIndex = 0;
        nextRowIndex++;
      }
      
      if (nextRowIndex < 0 || nextRowIndex >= pageData.length) {
        break; // No more rows
      }
      
      const col = orderedCols[nextColIndex];
      const row = pageData[nextRowIndex];
      if (col && col.editable !== false && row) {
        const cell = container.querySelector(
          `tr[data-row-id="${row.id}"] td[data-column-key="${col.key}"]`
        ) as HTMLElement;
        if (cell) {
          startCellEdit(row.id, col.key, cell);
        }
        break;
      }
      
      nextColIndex = reverse ? nextColIndex - 1 : nextColIndex + 1;
    }
  }

  /**
   * Handle column resize start
   */
  function handleResizeStart(e: MouseEvent, columnKey: string, th: HTMLElement): void {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidth = th.offsetWidth;
    const column = columns.find(col => col.key === columnKey);
    const minWidth = column?.minWidth 
      ? (typeof column.minWidth === 'number' ? column.minWidth : parseInt(column.minWidth, 10))
      : 50;
    const maxWidth = column?.maxWidth
      ? (typeof column.maxWidth === 'number' ? column.maxWidth : parseInt(column.maxWidth, 10))
      : Infinity;

    const resizeHandle = th.querySelector('.dos-data-grid___resize-handle');
    resizeHandle?.classList.add('dos-data-grid___resize-handle--active');

    function onMouseMove(moveEvent: MouseEvent): void {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + delta));
      th.style.width = `${newWidth}px`;
      columnWidths[columnKey] = newWidth;
    }

    function onMouseUp(): void {
      resizeHandle?.classList.remove('dos-data-grid___resize-handle--active');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      const resizeEvent: ColumnResizeEvent = {
        column: columnKey,
        oldWidth: startWidth,
        newWidth: columnWidths[columnKey] ?? startWidth,
      };
      onColumnResize?.(resizeEvent);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  // Column reordering drag state
  let draggedColumn: string | null = null;

  /**
   * Handle drag start for column reordering
   */
  function handleDragStart(e: DragEvent, columnKey: string): void {
    draggedColumn = columnKey;
    (e.target as HTMLElement).classList.add('dos-data-grid___header-cell--dragging');
    e.dataTransfer?.setData('text/plain', columnKey);
  }

  /**
   * Handle drag over
   */
  function handleDragOver(e: DragEvent): void {
    e.preventDefault();
    const th = (e.target as HTMLElement).closest('.dos-data-grid___header-cell') as HTMLElement;
    if (th && th.dataset.columnKey !== draggedColumn) {
      th.classList.add('dos-data-grid___header-cell--drag-over');
    }
  }

  /**
   * Handle drag leave
   */
  function handleDragLeave(e: DragEvent): void {
    const th = (e.target as HTMLElement).closest('.dos-data-grid___header-cell') as HTMLElement;
    th?.classList.remove('dos-data-grid___header-cell--drag-over');
  }

  /**
   * Handle drop for column reordering
   */
  function handleDrop(e: DragEvent, targetColumnKey: string): void {
    e.preventDefault();
    const th = (e.target as HTMLElement).closest('.dos-data-grid___header-cell') as HTMLElement;
    th?.classList.remove('dos-data-grid___header-cell--drag-over');

    if (!draggedColumn || draggedColumn === targetColumnKey) return;

    const fromIndex = columnOrder.indexOf(draggedColumn);
    const toIndex = columnOrder.indexOf(targetColumnKey);

    if (fromIndex === -1 || toIndex === -1) return;

    // Reorder
    columnOrder.splice(fromIndex, 1);
    columnOrder.splice(toIndex, 0, draggedColumn);

    const reorderEvent: ColumnReorderEvent = {
      column: draggedColumn,
      fromIndex,
      toIndex,
      newOrder: [...columnOrder],
    };

    onColumnReorder?.(reorderEvent);
    render();
  }

  /**
   * Handle drag end
   */
  function handleDragEnd(): void {
    const cells = container.querySelectorAll('.dos-data-grid___header-cell');
    cells.forEach(cell => {
      cell.classList.remove('dos-data-grid___header-cell--dragging');
      cell.classList.remove('dos-data-grid___header-cell--drag-over');
    });
    draggedColumn = null;
  }

  /**
   * Go to a specific page
   */
  function goToPage(page: number): void {
    const totalPages = getTotalPages();
    const newPage = Math.max(1, Math.min(totalPages, page));
    if (newPage !== currentPage) {
      currentPage = newPage;
      focusedRowIndex = 0;
      onPageChange?.(currentPage);
      render();
    }
  }

  /**
   * Render the entire grid
   */
  function render(): void {
    // Clear existing content
    table.innerHTML = '';
    tableWrapper.innerHTML = '';

    // Render parts
    table.appendChild(renderHeader());
    table.appendChild(renderBody());
    tableWrapper.appendChild(table);

    // Update container
    container.innerHTML = '';
    container.appendChild(tableWrapper);

    const footer = renderFooter();
    if (footer) {
      container.appendChild(footer);
    }

    // Update ARIA attributes
    container.setAttribute('aria-rowcount', String(data.length + 1)); // +1 for header
    container.setAttribute('aria-colcount', String(getOrderedColumns().length + (selectable ? 1 : 0)));
  }

  // Initial render
  render();

  // Instance methods
  const instance: DataGridInstance = {
    element: container,

    setData: (newData: TableRow[]) => {
      data = [...newData];
      selectedRowsState.clear();
      currentPage = 1;
      render();
    },

    setColumns: (newColumns: DataGridColumn[]) => {
      columns = [...newColumns];
      columnOrder = columns.map(col => col.key);
      render();
    },

    sort: (column: string, direction?: SortDirection) => {
      sortColumnState = column;
      sortDirectionState = direction || 'asc';
      onSort?.(sortColumnState, sortDirectionState);
      render();
    },

    selectRows: (rowIds: string[]) => {
      selectedRowsState = new Set(rowIds);
      onSelect?.(Array.from(selectedRowsState));
      render();
    },

    clearSelection: () => {
      selectedRowsState.clear();
      onSelect?.(Array.from(selectedRowsState));
      render();
    },

    selectAll: () => {
      getPageData().forEach(row => selectedRowsState.add(row.id));
      onSelect?.(Array.from(selectedRowsState));
      render();
    },

    getSelectedRows: () => Array.from(selectedRowsState),

    getSortState: () => ({
      column: sortColumnState,
      direction: sortDirectionState,
    }),

    startEdit: (rowId: string, column: string) => {
      const cell = container.querySelector(
        `tr[data-row-id="${rowId}"] td[data-column-key="${column}"]`
      ) as HTMLElement;
      if (cell) {
        startCellEdit(rowId, column, cell);
      }
    },

    cancelEdit: () => {
      cancelCellEdit();
    },

    commitEdit: () => {
      if (!editingCell) return;
      const row = data.find(r => r.id === editingCell!.rowId);
      const column = columns.find(c => c.key === editingCell!.column);
      const editor = editingCell.element.querySelector('.dos-data-grid___cell-editor') as HTMLInputElement | HTMLSelectElement;
      if (row && column && editor) {
        commitCellEdit(editor.value, row, column);
      }
    },

    getEditingCell: () => {
      if (!editingCell) return null;
      return { rowId: editingCell.rowId, column: editingCell.column };
    },

    resizeColumn: (column: string, width: number) => {
      columnWidths[column] = width;
      render();
    },

    getColumnWidths: () => ({ ...columnWidths }),

    reorderColumns: (newOrder: string[]) => {
      columnOrder = [...newOrder];
      render();
    },

    getColumnOrder: () => [...columnOrder],

    goToPage,

    setPageSize: (newPageSize: number) => {
      pageSize = newPageSize;
      currentPage = 1;
      onPageSizeChange?.(pageSize);
      render();
    },

    getPaginationState: () => ({
      currentPage,
      pageSize,
      totalPages: getTotalPages(),
      totalRows: data.length,
    }),

    focus: () => {
      const firstRow = container.querySelector('.dos-data-grid___row') as HTMLElement;
      if (firstRow) {
        focusedRowIndex = 0;
        firstRow.focus();
      }
    },

    destroy: () => {
      container.remove();
    },
  };

  return instance;
}
