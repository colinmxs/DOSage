/**
 * Table Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTable } from '../../src/components/Table';
import type { TableColumn, TableRow } from '../../src/components/Table';

describe('Table', () => {
  let container: HTMLElement;

  // Sample data for tests
  const sampleColumns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'size', label: 'Size', align: 'right', sortable: true },
    { key: 'date', label: 'Date' },
  ];

  const sampleData: TableRow[] = [
    { id: '1', name: 'CONFIG.SYS', size: 1024, date: '01-15-26' },
    { id: '2', name: 'AUTOEXEC.BAT', size: 512, date: '01-15-26' },
    { id: '3', name: 'COMMAND.COM', size: 54619, date: '01-15-26' },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('renders a table with columns and data', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
      });

      container.appendChild(table.element);

      const tableEl = table.element.querySelector('table');
      expect(tableEl).toBeTruthy();
      expect(tableEl?.classList.contains('dos-table')).toBe(true);

      // Check headers
      const headers = tableEl?.querySelectorAll('th');
      expect(headers?.length).toBe(3);
      expect(headers?.[0].textContent).toContain('Name');
      expect(headers?.[1].textContent).toContain('Size');
      expect(headers?.[2].textContent).toContain('Date');

      // Check rows
      const rows = tableEl?.querySelectorAll('tbody tr');
      expect(rows?.length).toBe(3);
    });

    it('renders empty state when no data', () => {
      const table = createTable({
        columns: sampleColumns,
        data: [],
        emptyMessage: 'No files found',
      });

      container.appendChild(table.element);

      const emptyCell = table.element.querySelector('.dos-table__empty-cell');
      expect(emptyCell).toBeTruthy();
      expect(emptyCell?.textContent).toBe('No files found');
    });

    it('renders with custom className and id', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        className: 'my-custom-table',
        id: 'files-table',
      });

      container.appendChild(table.element);

      const tableEl = table.element.querySelector('table');
      expect(tableEl?.classList.contains('my-custom-table')).toBe(true);
      expect(tableEl?.id).toBe('files-table');
    });

    it('renders striped rows when striped is true', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        striped: true,
      });

      container.appendChild(table.element);

      const tableEl = table.element.querySelector('table');
      expect(tableEl?.classList.contains('dos-table--striped')).toBe(true);
    });

    it('renders bordered table when bordered is true', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        bordered: true,
      });

      container.appendChild(table.element);

      const tableEl = table.element.querySelector('table');
      expect(tableEl?.classList.contains('dos-table--bordered')).toBe(true);
    });

    it('renders cell values correctly', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
      });

      container.appendChild(table.element);

      const cells = table.element.querySelectorAll('tbody td');
      expect(cells[0].textContent).toBe('CONFIG.SYS');
      expect(cells[1].textContent).toBe('1,024'); // Number should be formatted
      expect(cells[2].textContent).toBe('01-15-26');
    });

    it('applies column alignment', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
      });

      container.appendChild(table.element);

      const sizeCells = table.element.querySelectorAll('tbody td:nth-child(2)');
      sizeCells.forEach(cell => {
        expect(cell.classList.contains('dos-table__cell--align-right')).toBe(true);
      });
    });

    it('renders with custom cell renderer', () => {
      const customColumns: TableColumn[] = [
        {
          key: 'name',
          label: 'Name',
          render: (value) => {
            const span = document.createElement('span');
            span.className = 'custom-name';
            span.textContent = `📄 ${value}`;
            return span;
          },
        },
      ];

      const table = createTable({
        columns: customColumns,
        data: [{ id: '1', name: 'test.txt' }],
      });

      container.appendChild(table.element);

      const customEl = table.element.querySelector('.custom-name');
      expect(customEl).toBeTruthy();
      expect(customEl?.textContent).toBe('📄 test.txt');
    });
  });

  describe('sorting', () => {
    it('shows sort indicators on sortable columns', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        sortable: true,
      });

      container.appendChild(table.element);

      // With sortable: true globally and columns having sortable: true, all become sortable
      // date column does not have sortable: true, but global sortable: true makes columns
      // with sortable !== false all sortable
      const sortableHeaders = table.element.querySelectorAll('.dos-table__header-cell--sortable');
      // All columns are sortable when sortable: true unless explicitly set to false
      expect(sortableHeaders.length).toBe(3);
    });

    it('calls onSort when clicking sortable column', () => {
      const onSort = vi.fn();
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        sortable: true,
        onSort,
      });

      container.appendChild(table.element);

      const nameHeader = table.element.querySelector('.dos-table__header-cell--sortable');
      (nameHeader as HTMLElement)?.click();

      expect(onSort).toHaveBeenCalledWith('name', 'asc');
    });

    it('toggles sort direction on repeated clicks', () => {
      const onSort = vi.fn();
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        sortable: true,
        onSort,
      });

      container.appendChild(table.element);

      const nameHeader = table.element.querySelector('.dos-table__header-cell--sortable');
      
      // First click - ascending
      (nameHeader as HTMLElement)?.click();
      expect(onSort).toHaveBeenLastCalledWith('name', 'asc');

      // Second click - descending
      (nameHeader as HTMLElement)?.click();
      expect(onSort).toHaveBeenLastCalledWith('name', 'desc');

      // Third click - ascending again
      (nameHeader as HTMLElement)?.click();
      expect(onSort).toHaveBeenLastCalledWith('name', 'asc');
    });

    it('updates sort indicator visually', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        sortable: true,
      });

      container.appendChild(table.element);

      // Get initial header
      let nameHeader = table.element.querySelector('.dos-table__header-cell--sortable') as HTMLElement;
      nameHeader?.click();

      // Re-query the header after click causes re-render
      nameHeader = table.element.querySelector('.dos-table__header-cell--sortable') as HTMLElement;

      expect(nameHeader?.classList.contains('dos-table__header-cell--sorted')).toBe(true);
      expect(nameHeader?.getAttribute('aria-sort')).toBe('ascending');

      const indicator = nameHeader?.querySelector('.dos-table__sort-indicator');
      expect(indicator?.textContent).toBe('▲');
    });

    it('can sort programmatically', () => {
      const onSort = vi.fn();
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        sortable: true,
        onSort,
      });

      container.appendChild(table.element);

      table.sort('size', 'desc');

      expect(onSort).toHaveBeenCalledWith('size', 'desc');
      expect(table.getSortState()).toEqual({ column: 'size', direction: 'desc' });
    });

    it('responds to Enter/Space key on sortable header', () => {
      const onSort = vi.fn();
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        sortable: true,
        onSort,
      });

      container.appendChild(table.element);

      const nameHeader = table.element.querySelector('.dos-table__header-cell--sortable') as HTMLElement;
      
      // Enter key
      nameHeader?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(onSort).toHaveBeenCalledWith('name', 'asc');

      // Space key
      nameHeader?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      expect(onSort).toHaveBeenCalledWith('name', 'desc');
    });
  });

  describe('selection', () => {
    it('renders checkboxes when selectable is true', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
      });

      container.appendChild(table.element);

      const checkboxes = table.element.querySelectorAll('.dos-table__checkbox');
      // 1 for select-all + 3 for rows
      expect(checkboxes.length).toBe(4);
    });

    it('calls onSelect when selecting a row', () => {
      const onSelect = vi.fn();
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        onSelect,
      });

      container.appendChild(table.element);

      const firstRowCheckbox = table.element.querySelectorAll('.dos-table__checkbox')[1];
      (firstRowCheckbox as HTMLElement).click();

      expect(onSelect).toHaveBeenCalledWith(['1']);
    });

    it('toggles selection on row click', () => {
      const onSelect = vi.fn();
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        onSelect,
      });

      container.appendChild(table.element);

      let firstRow = table.element.querySelector('tbody tr') as HTMLElement;
      firstRow.click();

      expect(onSelect).toHaveBeenCalledWith(['1']);
      
      // Re-query after re-render
      firstRow = table.element.querySelector('tbody tr') as HTMLElement;
      expect(firstRow?.classList.contains('dos-table__row--selected')).toBe(true);

      // Click again to deselect
      firstRow.click();
      expect(onSelect).toHaveBeenLastCalledWith([]);
    });

    it('can select all rows', () => {
      const onSelect = vi.fn();
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        onSelect,
      });

      container.appendChild(table.element);

      table.selectAll();

      expect(onSelect).toHaveBeenCalledWith(['1', '2', '3']);
      expect(table.getSelectedRows()).toEqual(['1', '2', '3']);
    });

    it('can clear selection', () => {
      const onSelect = vi.fn();
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        selectedRows: ['1', '2'],
        onSelect,
      });

      container.appendChild(table.element);

      table.clearSelection();

      expect(onSelect).toHaveBeenCalledWith([]);
      expect(table.getSelectedRows()).toEqual([]);
    });

    it('select-all checkbox shows mixed state when some rows selected', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        selectedRows: ['1'],
      });

      container.appendChild(table.element);

      const selectAllBtn = table.element.querySelector('thead .dos-table__checkbox');
      expect(selectAllBtn?.textContent).toBe('[-]');
      expect(selectAllBtn?.getAttribute('aria-checked')).toBe('mixed');
    });

    it('select-all checkbox shows checked when all rows selected', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        selectedRows: ['1', '2', '3'],
      });

      container.appendChild(table.element);

      const selectAllBtn = table.element.querySelector('thead .dos-table__checkbox');
      expect(selectAllBtn?.textContent).toBe('[X]');
      expect(selectAllBtn?.getAttribute('aria-checked')).toBe('true');
    });

    it('can select rows programmatically', () => {
      const onSelect = vi.fn();
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        onSelect,
      });

      container.appendChild(table.element);

      table.selectRows(['2', '3']);

      expect(onSelect).toHaveBeenCalledWith(['2', '3']);
      expect(table.getSelectedRows()).toEqual(['2', '3']);
    });
  });

  describe('keyboard navigation', () => {
    it('navigates rows with Arrow keys', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
      });

      container.appendChild(table.element);

      // Focus first row
      table.focus();

      const rows = table.element.querySelectorAll('tbody tr');
      expect(document.activeElement).toBe(rows[0]);

      // Arrow down
      rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(document.activeElement).toBe(rows[1]);

      // Arrow up
      rows[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(document.activeElement).toBe(rows[0]);
    });

    it('navigates to first/last row with Home/End', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
      });

      container.appendChild(table.element);

      table.focus();
      const rows = table.element.querySelectorAll('tbody tr');

      // End key
      rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      expect(document.activeElement).toBe(rows[2]);

      // Home key
      rows[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      expect(document.activeElement).toBe(rows[0]);
    });

    it('selects row with Space key when selectable', () => {
      const onSelect = vi.fn();
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        onSelect,
      });

      container.appendChild(table.element);

      table.focus();
      const firstRow = table.element.querySelector('tbody tr');
      
      firstRow?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      expect(onSelect).toHaveBeenCalledWith(['1']);
    });

    it('triggers row click on Enter', () => {
      const onRowClick = vi.fn();
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        onRowClick,
      });

      container.appendChild(table.element);

      table.focus();
      const firstRow = table.element.querySelector('tbody tr');
      
      firstRow?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(onRowClick).toHaveBeenCalledWith(sampleData[0], 0);
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes on table', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
      });

      container.appendChild(table.element);

      const tableEl = table.element.querySelector('table');
      expect(tableEl?.getAttribute('role')).toBe('table');
      expect(tableEl?.getAttribute('aria-rowcount')).toBe('3');
      expect(tableEl?.getAttribute('aria-colcount')).toBe('3');
    });

    it('has correct ARIA attributes on header cells', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        sortable: true,
      });

      container.appendChild(table.element);

      const headers = table.element.querySelectorAll('th');
      headers.forEach(header => {
        expect(header.getAttribute('role')).toBe('columnheader');
        expect(header.getAttribute('scope')).toBe('col');
      });
    });

    it('has correct ARIA attributes on selectable rows', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        selectedRows: ['1'],
      });

      container.appendChild(table.element);

      const rows = table.element.querySelectorAll('tbody tr');
      expect(rows[0].getAttribute('aria-selected')).toBe('true');
      expect(rows[1].getAttribute('aria-selected')).toBe('false');
    });

    it('has aria-rowindex on body rows', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
      });

      container.appendChild(table.element);

      const rows = table.element.querySelectorAll('tbody tr');
      expect(rows[0].getAttribute('aria-rowindex')).toBe('2'); // 1-indexed, header is 1
      expect(rows[1].getAttribute('aria-rowindex')).toBe('3');
      expect(rows[2].getAttribute('aria-rowindex')).toBe('4');
    });

    it('sortable headers have correct aria-sort', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        sortable: true,
        sortColumn: 'name',
        sortDirection: 'desc',
      });

      container.appendChild(table.element);

      const nameHeader = table.element.querySelector('.dos-table__header-cell--sortable');
      expect(nameHeader?.getAttribute('aria-sort')).toBe('descending');
    });

    it('selection checkboxes have aria-label', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
      });

      container.appendChild(table.element);

      const selectAllCheckbox = table.element.querySelector('thead .dos-table__checkbox');
      expect(selectAllCheckbox?.getAttribute('aria-label')).toBe('Select all rows');

      const rowCheckboxes = table.element.querySelectorAll('tbody .dos-table__checkbox');
      expect(rowCheckboxes[0].getAttribute('aria-label')).toBe('Select row 1');
    });
  });

  describe('instance methods', () => {
    it('setData updates table content', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
      });

      container.appendChild(table.element);

      const newData: TableRow[] = [
        { id: '4', name: 'NEW.TXT', size: 100, date: '01-20-26' },
      ];

      table.setData(newData);

      const rows = table.element.querySelectorAll('tbody tr');
      expect(rows.length).toBe(1);
      expect(rows[0].querySelector('td')?.textContent).toBe('NEW.TXT');
    });

    it('setColumns updates table headers', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
      });

      container.appendChild(table.element);

      const newColumns: TableColumn[] = [
        { key: 'name', label: 'File Name' },
      ];

      table.setColumns(newColumns);

      const headers = table.element.querySelectorAll('th');
      expect(headers.length).toBe(1);
      expect(headers[0].textContent).toContain('File Name');
    });

    it('destroy removes the table', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
      });

      container.appendChild(table.element);
      expect(container.children.length).toBe(1);

      table.destroy();
      expect(container.children.length).toBe(0);
    });

    it('getSortState returns current sort state', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        sortable: true,
        sortColumn: 'size',
        sortDirection: 'asc',
      });

      expect(table.getSortState()).toEqual({ column: 'size', direction: 'asc' });
    });

    it('getSelectedRows returns selected row IDs', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        selectedRows: ['1', '3'],
      });

      expect(table.getSelectedRows()).toEqual(['1', '3']);
    });
  });

  describe('row interaction', () => {
    it('calls onRowClick when row is clicked', () => {
      const onRowClick = vi.fn();
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        onRowClick,
      });

      container.appendChild(table.element);

      const secondRow = table.element.querySelectorAll('tbody tr')[1];
      (secondRow as HTMLElement).click();

      expect(onRowClick).toHaveBeenCalledWith(sampleData[1], 1);
    });

    it('does not call onRowClick when clicking checkbox', () => {
      const onRowClick = vi.fn();
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        selectable: true,
        onRowClick,
      });

      container.appendChild(table.element);

      const firstCheckbox = table.element.querySelectorAll('tbody .dos-table__checkbox')[0];
      (firstCheckbox as HTMLElement).click();

      // onRowClick should not be called when clicking the checkbox directly
      expect(onRowClick).not.toHaveBeenCalled();
    });

    it('applies hover styles class exists', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
      });

      container.appendChild(table.element);

      // Just verify the table has the class structure that CSS hooks into
      const tableEl = table.element.querySelector('table');
      expect(tableEl?.classList.contains('dos-table')).toBe(true);
      
      const rows = table.element.querySelectorAll('.dos-table__row');
      expect(rows.length).toBeGreaterThan(0);
    });
  });

  describe('sticky header', () => {
    it('applies sticky header class when stickyHeader is true', () => {
      const table = createTable({
        columns: sampleColumns,
        data: sampleData,
        stickyHeader: true,
      });

      container.appendChild(table.element);

      const tableEl = table.element.querySelector('table');
      expect(tableEl?.classList.contains('dos-table--sticky-header')).toBe(true);

      const wrapper = table.element;
      expect(wrapper.classList.contains('dos-table-wrapper--sticky')).toBe(true);
    });
  });
});
