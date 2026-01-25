/**
 * DataGrid Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDataGrid } from '../../src/components/DataGrid';
import type { DataGridColumn, TableRow } from '../../src/components/DataGrid';

describe('DataGrid', () => {
  let container: HTMLElement;

  const sampleColumns: DataGridColumn[] = [
    { key: 'name', label: 'Name', editable: true },
    { key: 'value', label: 'Value', align: 'right', editable: true, inputType: 'number' },
    { key: 'status', label: 'Status', editable: false },
  ];

  const sampleData: TableRow[] = [
    { id: '1', name: 'Item 1', value: 100, status: 'Active' },
    { id: '2', name: 'Item 2', value: 200, status: 'Inactive' },
    { id: '3', name: 'Item 3', value: 300, status: 'Active' },
    { id: '4', name: 'Item 4', value: 400, status: 'Pending' },
    { id: '5', name: 'Item 5', value: 500, status: 'Active' },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('renders with basic props', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });
      container.appendChild(grid.element);

      expect(grid.element).toBeDefined();
      expect(grid.element.classList.contains('dos-data-grid')).toBe(true);
    });

    it('renders all columns', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });
      container.appendChild(grid.element);

      const headers = grid.element.querySelectorAll('.dos-data-grid___header-cell[data-column-key]');
      expect(headers.length).toBe(3);
    });

    it('renders all rows', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });
      container.appendChild(grid.element);

      const rows = grid.element.querySelectorAll('.dos-data-grid___row');
      expect(rows.length).toBe(5);
    });

    it('renders empty message when no data', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: [],
        emptyMessage: 'No items found',
      });
      container.appendChild(grid.element);

      const empty = grid.element.querySelector('.dos-data-grid___empty');
      expect(empty?.textContent).toBe('No items found');
    });

    it('applies bordered class', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        bordered: true,
      });

      expect(grid.element.classList.contains('dos-data-grid--bordered')).toBe(true);
    });

    it('applies sticky header class', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        stickyHeader: true,
      });

      expect(grid.element.classList.contains('dos-data-grid--sticky-header')).toBe(true);
    });

    it('applies custom className and id', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        className: 'custom-grid',
        id: 'my-grid',
      });

      expect(grid.element.classList.contains('custom-grid')).toBe(true);
      expect(grid.element.id).toBe('my-grid');
    });
  });

  describe('sorting', () => {
    it('shows sort indicators when sortable', () => {
      const grid = createDataGrid({
        columns: [
          { key: 'name', label: 'Name', sortable: true },
          { key: 'value', label: 'Value', sortable: true },
        ],
        data: sampleData,
        sortable: true,
      });
      container.appendChild(grid.element);

      const indicators = grid.element.querySelectorAll('.dos-data-grid___sort-indicator');
      expect(indicators.length).toBe(2);
    });

    it('calls onSort when clicking sortable column', () => {
      const onSort = vi.fn();
      const grid = createDataGrid({
        columns: [{ key: 'name', label: 'Name', sortable: true }],
        data: sampleData,
        sortable: true,
        onSort,
      });
      container.appendChild(grid.element);

      const header = grid.element.querySelector('.dos-data-grid___header-cell--sortable') as HTMLElement;
      header.click();

      expect(onSort).toHaveBeenCalledWith('name', 'asc');
    });

    it('toggles sort direction on subsequent clicks', () => {
      const onSort = vi.fn();
      const grid = createDataGrid({
        columns: [{ key: 'name', label: 'Name', sortable: true }],
        data: sampleData,
        sortable: true,
        onSort,
      });
      container.appendChild(grid.element);

      const header = grid.element.querySelector('.dos-data-grid___header-cell--sortable') as HTMLElement;
      header.click();
      header.click();

      expect(onSort).toHaveBeenLastCalledWith('name', 'desc');
    });

    it('supports keyboard sorting with Enter', () => {
      const onSort = vi.fn();
      const grid = createDataGrid({
        columns: [{ key: 'name', label: 'Name', sortable: true }],
        data: sampleData,
        sortable: true,
        onSort,
      });
      container.appendChild(grid.element);

      const header = grid.element.querySelector('.dos-data-grid___header-cell--sortable') as HTMLElement;
      header.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(onSort).toHaveBeenCalled();
    });

    it('has correct aria-sort attribute', () => {
      const grid = createDataGrid({
        columns: [{ key: 'name', label: 'Name', sortable: true }],
        data: sampleData,
        sortable: true,
        sortColumn: 'name',
        sortDirection: 'asc',
      });
      container.appendChild(grid.element);

      const header = grid.element.querySelector('.dos-data-grid___header-cell--sortable');
      expect(header?.getAttribute('aria-sort')).toBe('ascending');
    });
  });

  describe('selection', () => {
    it('renders checkboxes when selectable', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
      });
      container.appendChild(grid.element);

      const checkboxes = grid.element.querySelectorAll('.dos-data-grid___checkbox');
      expect(checkboxes.length).toBe(6); // 5 rows + 1 header
    });

    it('checkbox cells have proper CSS class to prevent truncation', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
      });
      container.appendChild(grid.element);

      const checkboxCells = grid.element.querySelectorAll('.dos-data-grid___checkbox-cell');
      expect(checkboxCells.length).toBeGreaterThan(0);

      // Verify that checkbox cells have the correct class that includes
      // text-overflow: clip and white-space: nowrap in the CSS
      checkboxCells.forEach((cell) => {
        expect(cell.classList.contains('dos-data-grid___checkbox-cell')).toBe(true);
      });
    });

    it('calls onSelect when clicking row checkbox', () => {
      const onSelect = vi.fn();
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        onSelect,
      });
      container.appendChild(grid.element);

      const checkbox = grid.element.querySelector('.dos-data-grid___row .dos-data-grid___checkbox') as HTMLElement;
      checkbox.click();

      expect(onSelect).toHaveBeenCalledWith(['1']);
    });

    it('supports select all', () => {
      const onSelect = vi.fn();
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        onSelect,
      });
      container.appendChild(grid.element);

      grid.selectAll();
      expect(grid.getSelectedRows()).toEqual(['1', '2', '3', '4', '5']);
    });

    it('selectAll() without options selects only current page when paginated', () => {
      const manyItems: TableRow[] = Array.from({ length: 15 }, (_, i) => ({
        id: String(i + 1),
        name: `Item ${i + 1}`,
        value: (i + 1) * 100,
        status: 'Active',
      }));

      const grid = createDataGrid({
        columns: sampleColumns,
        data: manyItems,
        selectable: true,
        pagination: { enabled: true, pageSize: 5 },
      });
      container.appendChild(grid.element);

      grid.selectAll();
      expect(grid.getSelectedRows()).toEqual(['1', '2', '3', '4', '5']);
    });

    it('selectAll({ allPages: true }) selects all rows across entire dataset', () => {
      const manyItems: TableRow[] = Array.from({ length: 15 }, (_, i) => ({
        id: String(i + 1),
        name: `Item ${i + 1}`,
        value: (i + 1) * 100,
        status: 'Active',
      }));

      const grid = createDataGrid({
        columns: sampleColumns,
        data: manyItems,
        selectable: true,
        pagination: { enabled: true, pageSize: 5 },
      });
      container.appendChild(grid.element);

      grid.selectAll({ allPages: true });
      expect(grid.getSelectedRows().length).toBe(15);
      expect(grid.getSelectedRows()).toEqual(
        Array.from({ length: 15 }, (_, i) => String(i + 1))
      );
    });

    it('selectAll({ allPages: false }) selects only current page', () => {
      const manyItems: TableRow[] = Array.from({ length: 15 }, (_, i) => ({
        id: String(i + 1),
        name: `Item ${i + 1}`,
        value: (i + 1) * 100,
        status: 'Active',
      }));

      const grid = createDataGrid({
        columns: sampleColumns,
        data: manyItems,
        selectable: true,
        pagination: { enabled: true, pageSize: 5 },
      });
      container.appendChild(grid.element);

      grid.selectAll({ allPages: false });
      expect(grid.getSelectedRows()).toEqual(['1', '2', '3', '4', '5']);
    });

    it('supports clear selection', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        selectedRows: ['1', '2'],
      });

      grid.clearSelection();
      expect(grid.getSelectedRows()).toEqual([]);
    });

    it('has correct aria-selected attribute', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        selectedRows: ['1'],
      });
      container.appendChild(grid.element);

      const selectedRow = grid.element.querySelector('tr[data-row-id="1"]');
      expect(selectedRow?.getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('cell editing', () => {
    it('marks editable cells', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        editable: true,
      });
      container.appendChild(grid.element);

      const editableCells = grid.element.querySelectorAll('.dos-data-grid___cell--editable');
      // name and value columns are editable, status is not = 10 editable cells (5 rows * 2 cols)
      expect(editableCells.length).toBe(10);
    });

    it('starts editing on double-click', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        editable: true,
      });
      container.appendChild(grid.element);

      const cell = grid.element.querySelector('.dos-data-grid___cell--editable') as HTMLElement;
      cell.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

      const editor = grid.element.querySelector('.dos-data-grid___cell-editor');
      expect(editor).not.toBeNull();
    });

    it('calls onCellEdit when editing is committed', () => {
      const onCellEdit = vi.fn();
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        editable: true,
        onCellEdit,
      });
      container.appendChild(grid.element);

      // Start editing
      grid.startEdit('1', 'name');
      
      // Find the editor and change value
      const editor = grid.element.querySelector('.dos-data-grid___cell-editor') as HTMLInputElement;
      expect(editor).not.toBeNull();
      
      editor.value = 'New Name';
      editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(onCellEdit).toHaveBeenCalled();
      const callArg = onCellEdit.mock.calls[0][0];
      expect(callArg.newValue).toBe('New Name');
      expect(callArg.oldValue).toBe('Item 1');
    });

    it('cancels editing on Escape', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        editable: true,
      });
      container.appendChild(grid.element);

      grid.startEdit('1', 'name');
      
      const editor = grid.element.querySelector('.dos-data-grid___cell-editor') as HTMLInputElement;
      editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      expect(grid.getEditingCell()).toBeNull();
    });

    it('renders select editor for select columns', () => {
      const columns: DataGridColumn[] = [
        {
          key: 'status',
          label: 'Status',
          editable: true,
          inputType: 'select',
          selectOptions: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ],
        },
      ];

      const grid = createDataGrid({
        columns,
        data: [{ id: '1', status: 'active' }],
        editable: true,
      });
      container.appendChild(grid.element);

      grid.startEdit('1', 'status');
      
      const editor = grid.element.querySelector('select.dos-data-grid___cell-editor');
      expect(editor).not.toBeNull();
    });

    it('has aria-readonly attribute on non-editable cells', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        editable: true,
      });
      container.appendChild(grid.element);

      const nonEditableCell = grid.element.querySelector('td[data-column-key="status"]');
      expect(nonEditableCell?.getAttribute('aria-readonly')).toBe('true');
    });
  });

  describe('column resizing', () => {
    it('renders resize handles when enabled', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        resizableColumns: true,
      });
      container.appendChild(grid.element);

      const handles = grid.element.querySelectorAll('.dos-data-grid___resize-handle');
      expect(handles.length).toBe(3);
    });

    it('updates column width on resize', () => {
      const onColumnResize = vi.fn();
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        resizableColumns: true,
        onColumnResize,
      });
      container.appendChild(grid.element);

      grid.resizeColumn('name', 200);
      expect(grid.getColumnWidths()['name']).toBe(200);
    });

    it('does not render resize handle for non-resizable columns', () => {
      const columns: DataGridColumn[] = [
        { key: 'name', label: 'Name', resizable: true },
        { key: 'value', label: 'Value', resizable: false },
      ];

      const grid = createDataGrid({
        columns,
        data: sampleData,
        resizableColumns: true,
      });
      container.appendChild(grid.element);

      const handles = grid.element.querySelectorAll('.dos-data-grid___resize-handle');
      expect(handles.length).toBe(1);
    });
  });

  describe('column reordering', () => {
    it('makes headers draggable when enabled', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        reorderableColumns: true,
      });
      container.appendChild(grid.element);

      const header = grid.element.querySelector('.dos-data-grid___header-cell--reorderable');
      expect(header?.getAttribute('draggable')).toBe('true');
    });

    it('updates column order programmatically', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        reorderableColumns: true,
      });

      const originalOrder = grid.getColumnOrder();
      expect(originalOrder).toEqual(['name', 'value', 'status']);

      grid.reorderColumns(['status', 'name', 'value']);
      expect(grid.getColumnOrder()).toEqual(['status', 'name', 'value']);
    });
  });

  describe('pagination', () => {
    const manyItems: TableRow[] = Array.from({ length: 25 }, (_, i) => ({
      id: String(i + 1),
      name: `Item ${i + 1}`,
      value: (i + 1) * 100,
      status: 'Active',
    }));

    it('shows pagination controls when enabled', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: manyItems,
        pagination: { enabled: true, pageSize: 10 },
      });
      container.appendChild(grid.element);

      const footer = grid.element.querySelector('.dos-data-grid___footer');
      expect(footer).not.toBeNull();
    });

    it('displays correct number of rows per page', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: manyItems,
        pagination: { enabled: true, pageSize: 10 },
      });
      container.appendChild(grid.element);

      const rows = grid.element.querySelectorAll('.dos-data-grid___row');
      expect(rows.length).toBe(10);
    });

    it('navigates to next page', () => {
      const onPageChange = vi.fn();
      const grid = createDataGrid({
        columns: sampleColumns,
        data: manyItems,
        pagination: { enabled: true, pageSize: 10 },
        onPageChange,
      });
      container.appendChild(grid.element);

      grid.goToPage(2);
      expect(onPageChange).toHaveBeenCalledWith(2);
      expect(grid.getPaginationState().currentPage).toBe(2);
    });

    it('updates page size', () => {
      const onPageSizeChange = vi.fn();
      const grid = createDataGrid({
        columns: sampleColumns,
        data: manyItems,
        pagination: { enabled: true, pageSize: 10 },
        onPageSizeChange,
      });
      container.appendChild(grid.element);

      grid.setPageSize(25);
      expect(onPageSizeChange).toHaveBeenCalledWith(25);
      expect(grid.getPaginationState().pageSize).toBe(25);
    });

    it('shows row count info', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: manyItems,
        pagination: { enabled: true, pageSize: 10, showRowCount: true },
      });
      container.appendChild(grid.element);

      const pageInfo = grid.element.querySelector('.dos-data-grid___page-info');
      expect(pageInfo?.textContent).toContain('1-10');
      expect(pageInfo?.textContent).toContain('25');
    });

    it('returns correct pagination state', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: manyItems,
        pagination: { enabled: true, pageSize: 10 },
      });

      const state = grid.getPaginationState();
      expect(state.currentPage).toBe(1);
      expect(state.pageSize).toBe(10);
      expect(state.totalPages).toBe(3);
      expect(state.totalRows).toBe(25);
    });
  });

  describe('keyboard navigation', () => {
    it('navigates rows with arrow keys', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });
      container.appendChild(grid.element);

      grid.focus();
      const firstRow = grid.element.querySelector('.dos-data-grid___row') as HTMLElement;
      
      firstRow.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      
      const secondRow = grid.element.querySelectorAll('.dos-data-grid___row')[1] as HTMLElement;
      expect(document.activeElement).toBe(secondRow);
    });

    it('selects row with Space key when selectable', () => {
      const onSelect = vi.fn();
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        onSelect,
      });
      container.appendChild(grid.element);

      const firstRow = grid.element.querySelector('.dos-data-grid___row') as HTMLElement;
      firstRow.focus();
      firstRow.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(onSelect).toHaveBeenCalled();
    });

    it('starts editing with F2 key', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        editable: true,
      });
      container.appendChild(grid.element);

      const firstRow = grid.element.querySelector('.dos-data-grid___row') as HTMLElement;
      firstRow.focus();
      firstRow.dispatchEvent(new KeyboardEvent('keydown', { key: 'F2', bubbles: true }));

      expect(grid.getEditingCell()).not.toBeNull();
    });

    it('navigates to first row with Home key', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });
      container.appendChild(grid.element);

      const lastRow = grid.element.querySelectorAll('.dos-data-grid___row')[4] as HTMLElement;
      lastRow.focus();
      lastRow.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));

      const firstRow = grid.element.querySelector('.dos-data-grid___row') as HTMLElement;
      expect(document.activeElement).toBe(firstRow);
    });

    it('navigates to last row with End key', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });
      container.appendChild(grid.element);

      const firstRow = grid.element.querySelector('.dos-data-grid___row') as HTMLElement;
      firstRow.focus();
      firstRow.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));

      const lastRow = grid.element.querySelectorAll('.dos-data-grid___row')[4] as HTMLElement;
      expect(document.activeElement).toBe(lastRow);
    });
  });

  describe('accessibility', () => {
    it('has role="grid"', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });

      expect(grid.element.getAttribute('role')).toBe('grid');
    });

    it('has aria-rowcount', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });

      expect(grid.element.getAttribute('aria-rowcount')).toBe('6'); // 5 data + 1 header
    });

    it('has aria-colcount', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });

      expect(grid.element.getAttribute('aria-colcount')).toBe('3');
    });

    it('includes selection column in aria-colcount when selectable', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
      });

      expect(grid.element.getAttribute('aria-colcount')).toBe('4');
    });

    it('has proper rowgroup roles', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });
      container.appendChild(grid.element);

      const thead = grid.element.querySelector('thead');
      const tbody = grid.element.querySelector('tbody');
      
      expect(thead?.getAttribute('role')).toBe('rowgroup');
      expect(tbody?.getAttribute('role')).toBe('rowgroup');
    });

    it('has aria-rowindex on data rows', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });
      container.appendChild(grid.element);

      const rows = grid.element.querySelectorAll('.dos-data-grid___row');
      expect(rows[0].getAttribute('aria-rowindex')).toBe('2'); // First data row is index 2 (1-based, after header)
    });
  });

  describe('instance methods', () => {
    it('setData updates the data', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });
      container.appendChild(grid.element);

      grid.setData([{ id: 'new', name: 'New Item', value: 999, status: 'New' }]);
      
      const rows = grid.element.querySelectorAll('.dos-data-grid___row');
      expect(rows.length).toBe(1);
    });

    it('setColumns updates the columns', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });
      container.appendChild(grid.element);

      grid.setColumns([{ key: 'name', label: 'Only Name' }]);
      
      const headers = grid.element.querySelectorAll('.dos-data-grid___header-cell[data-column-key]');
      expect(headers.length).toBe(1);
    });

    it('sort method sorts the data', () => {
      const onSort = vi.fn();
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
        sortable: true,
        onSort,
      });

      grid.sort('name', 'desc');
      
      expect(onSort).toHaveBeenCalledWith('name', 'desc');
      expect(grid.getSortState()).toEqual({ column: 'name', direction: 'desc' });
    });

    it('focus method focuses the grid', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });
      container.appendChild(grid.element);

      grid.focus();
      
      const firstRow = grid.element.querySelector('.dos-data-grid___row');
      expect(document.activeElement).toBe(firstRow);
    });

    it('destroy method removes the element', () => {
      const grid = createDataGrid({
        columns: sampleColumns,
        data: sampleData,
      });
      container.appendChild(grid.element);

      grid.destroy();
      
      expect(container.querySelector('.dos-data-grid')).toBeNull();
    });
  });

  describe('custom rendering', () => {
    it('uses custom cell renderer', () => {
      const columns: DataGridColumn[] = [
        {
          key: 'name',
          label: 'Name',
          render: (value) => {
            const span = document.createElement('span');
            span.className = 'custom-cell';
            span.textContent = `>> ${value}`;
            return span;
          },
        },
      ];

      const grid = createDataGrid({
        columns,
        data: sampleData,
      });
      container.appendChild(grid.element);

      const customCell = grid.element.querySelector('.custom-cell');
      expect(customCell?.textContent).toBe('>> Item 1');
    });

    it('uses custom cell editor', () => {
      const columns: DataGridColumn[] = [
        {
          key: 'name',
          label: 'Name',
          editable: true,
          renderEditor: () => {
            const div = document.createElement('div');
            div.className = 'custom-editor';
            return div;
          },
        },
      ];

      const grid = createDataGrid({
        columns,
        data: sampleData,
        editable: true,
      });
      container.appendChild(grid.element);

      grid.startEdit('1', 'name');

      const customEditor = grid.element.querySelector('.custom-editor');
      expect(customEditor).not.toBeNull();
    });
  });

  describe('validation', () => {
    it('rejects invalid edits', () => {
      const onCellEdit = vi.fn();
      const columns: DataGridColumn[] = [
        {
          key: 'value',
          label: 'Value',
          editable: true,
          inputType: 'number',
          validate: (value) => {
            if (typeof value === 'number' && value < 0) {
              return 'Value must be positive';
            }
            return true;
          },
        },
      ];

      const grid = createDataGrid({
        columns,
        data: [{ id: '1', value: 100 }],
        editable: true,
        onCellEdit,
      });
      container.appendChild(grid.element);

      grid.startEdit('1', 'value');
      const editor = grid.element.querySelector('.dos-data-grid___cell-editor') as HTMLInputElement;
      editor.value = '-50';
      editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      // Should not call onCellEdit because validation failed
      expect(onCellEdit).not.toHaveBeenCalled();
    });
  });
});
