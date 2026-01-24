/**
 * Data Display Components Page
 *
 * Demonstrates Table, DataGrid, ListBox, TreeView, Badge, Avatar,
 * Card, Timeline, and EmptyState components.
 */

import { createDemoSection } from '../components/DemoSection';
import {
  createTable,
  createButton,
  createListBox,
  createTreeView,
  createBadge,
  createAvatar,
  createCard,
  createTimeline,
  createEmptyState,
  getPresetIconNames,
} from 'dosage';
import type { TableColumn, TableRow, ListBoxItem, TreeNode, BadgeVariant, AvatarStatus, TimelineEvent, EmptyStateIconPreset } from 'dosage';

/**
 * Renders the Table demo page
 */
export function renderTablePage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Table';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style data table with sorting, selection, striped rows, and full keyboard navigation.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Sample data
  const fileData: TableRow[] = [
    { id: '1', name: 'CONFIG.SYS', size: 1024, date: '01-15-26', type: 'System' },
    { id: '2', name: 'AUTOEXEC.BAT', size: 512, date: '01-15-26', type: 'Batch' },
    { id: '3', name: 'COMMAND.COM', size: 54619, date: '01-15-26', type: 'Executable' },
    { id: '4', name: 'HIMEM.SYS', size: 13984, date: '01-15-26', type: 'Driver' },
    { id: '5', name: 'EMM386.EXE', size: 120926, date: '01-15-26', type: 'Executable' },
    { id: '6', name: 'README.TXT', size: 2048, date: '01-14-26', type: 'Text' },
    { id: '7', name: 'INSTALL.BAT', size: 384, date: '01-10-26', type: 'Batch' },
  ];

  const columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true, width: '200px' },
    { key: 'size', label: 'Size', align: 'right', sortable: true, width: '100px' },
    { key: 'date', label: 'Date', width: '100px' },
    { key: 'type', label: 'Type', sortable: true, width: '120px' },
  ];

  // Basic Table Example
  const basicSection = createDemoSection({
    title: 'Basic Table',
    description: 'A simple table displaying data in rows and columns.',
    code: `import { createTable } from 'dosage';

const table = createTable({
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'size', label: 'Size', align: 'right' },
    { key: 'date', label: 'Date' },
  ],
  data: [
    { id: '1', name: 'CONFIG.SYS', size: 1024, date: '01-15-26' },
    { id: '2', name: 'AUTOEXEC.BAT', size: 512, date: '01-15-26' },
  ],
});

document.body.appendChild(table.element);`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const table = createTable({
      columns: columns.slice(0, 3),
      data: fileData.slice(0, 4),
    });
    basicExample.appendChild(table.element);
  }
  content.appendChild(basicSection);

  // Sortable Table Example
  const sortableSection = createDemoSection({
    title: 'Sortable Columns',
    description: 'Click column headers to sort. Click again to toggle direction.',
    code: `const table = createTable({
  columns: [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'size', label: 'Size', align: 'right', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
  ],
  data: fileData,
  sortable: true,
  onSort: (column, direction) => {
    console.log(\`Sorted by \${column} \${direction}\`);
    // Re-sort your data and call table.setData()
  },
});`,
  });

  const sortableExample = sortableSection.querySelector('.dos-demo-section___examples');
  if (sortableExample) {
    let sortedData = [...fileData];
    
    const table = createTable({
      columns,
      data: sortedData,
      sortable: true,
      onSort: (column, direction) => {
        sortedData = [...fileData].sort((a, b) => {
          const aVal = a[column];
          const bVal = b[column];
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return direction === 'asc' ? aVal - bVal : bVal - aVal;
          }
          const strA = String(aVal);
          const strB = String(bVal);
          return direction === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
        });
        table.setData(sortedData);
      },
    });
    sortableExample.appendChild(table.element);
  }
  content.appendChild(sortableSection);

  // Selectable Table Example
  const selectableSection = createDemoSection({
    title: 'Selectable Rows',
    description: 'Click rows or use checkboxes to select. Space key also toggles selection.',
    code: `const table = createTable({
  columns,
  data: fileData,
  selectable: true,
  onSelect: (selectedRows) => {
    console.log('Selected:', selectedRows);
  },
  onRowClick: (row, index) => {
    console.log('Clicked row:', row.name);
  },
});

// Programmatic selection
table.selectRows(['1', '3']);
table.selectAll();
table.clearSelection();`,
  });

  const selectableExample = selectableSection.querySelector('.dos-demo-section___examples');
  if (selectableExample) {
    const statusEl = document.createElement('div');
    statusEl.style.marginBottom = '8px';
    statusEl.style.color = 'var(--dos-color-secondary)';
    statusEl.textContent = 'Selected: none';

    const table = createTable({
      columns,
      data: fileData,
      selectable: true,
      onSelect: (selectedRows) => {
        statusEl.textContent = selectedRows.length > 0 
          ? `Selected: ${selectedRows.join(', ')}` 
          : 'Selected: none';
      },
    });

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '8px';
    btnContainer.style.marginTop = '8px';

    const selectAllBtn = createButton({
      label: 'Select All',
      size: 'small',
      onClick: () => table.selectAll(),
    });

    const clearBtn = createButton({
      label: 'Clear',
      size: 'small',
      variant: 'secondary',
      onClick: () => table.clearSelection(),
    });

    btnContainer.appendChild(selectAllBtn);
    btnContainer.appendChild(clearBtn);

    selectableExample.appendChild(statusEl);
    selectableExample.appendChild(table.element);
    selectableExample.appendChild(btnContainer);
  }
  content.appendChild(selectableSection);

  // Striped Table Example
  const stripedSection = createDemoSection({
    title: 'Striped Rows',
    description: 'Alternating row colors for better readability.',
    code: `const table = createTable({
  columns,
  data: fileData,
  striped: true,
});`,
  });

  const stripedExample = stripedSection.querySelector('.dos-demo-section___examples');
  if (stripedExample) {
    const table = createTable({
      columns,
      data: fileData,
      striped: true,
    });
    stripedExample.appendChild(table.element);
  }
  content.appendChild(stripedSection);

  // Custom Cell Renderer Example
  const customSection = createDemoSection({
    title: 'Custom Cell Renderer',
    description: 'Use custom render functions to display formatted content.',
    code: `const table = createTable({
  columns: [
    { key: 'name', label: 'Name' },
    { 
      key: 'size', 
      label: 'Size', 
      align: 'right',
      render: (value) => {
        const bytes = value as number;
        if (bytes >= 1024) {
          return \`\${(bytes / 1024).toFixed(1)} KB\`;
        }
        return \`\${bytes} B\`;
      },
    },
    {
      key: 'type',
      label: 'Type',
      render: (value, row) => {
        const span = document.createElement('span');
        const icon = value === 'Executable' ? '▶' : 
                     value === 'System' ? '⚙' : '📄';
        span.textContent = \`\${icon} \${value}\`;
        return span;
      },
    },
  ],
  data: fileData,
});`,
  });

  const customExample = customSection.querySelector('.dos-demo-section___examples');
  if (customExample) {
    const customColumns: TableColumn[] = [
      { key: 'name', label: 'Name', width: '200px' },
      { 
        key: 'size', 
        label: 'Size', 
        align: 'right',
        width: '100px',
        render: (value) => {
          const bytes = value as number;
          if (bytes >= 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
          }
          return `${bytes} B`;
        },
      },
      {
        key: 'type',
        label: 'Type',
        width: '150px',
        render: (value) => {
          const span = document.createElement('span');
          const icon = value === 'Executable' ? '▶ ' : 
                       value === 'System' ? '⚙ ' : 
                       value === 'Driver' ? '◆ ' :
                       value === 'Batch' ? '» ' : '  ';
          span.textContent = `${icon}${value}`;
          return span;
        },
      },
    ];

    const table = createTable({
      columns: customColumns,
      data: fileData,
    });
    customExample.appendChild(table.element);
  }
  content.appendChild(customSection);

  // Empty State Example
  const emptySection = createDemoSection({
    title: 'Empty State',
    description: 'Custom message displayed when there is no data.',
    code: `const table = createTable({
  columns,
  data: [],
  emptyMessage: 'No files found in this directory.',
});`,
  });

  const emptyExample = emptySection.querySelector('.dos-demo-section___examples');
  if (emptyExample) {
    const table = createTable({
      columns,
      data: [],
      emptyMessage: 'No files found in this directory.',
    });
    emptyExample.appendChild(table.element);
  }
  content.appendChild(emptySection);

  // Keyboard Navigation Section
  const keyboardSection = createDemoSection({
    title: 'Keyboard Navigation',
    description: 'Full keyboard support for navigating and selecting rows.',
    code: `// Keyboard shortcuts:
// ↑/↓ - Navigate rows
// Home/End - First/last row
// Space - Select row (when selectable)
// Enter - Trigger row click
// Tab - Move between sortable headers`,
  });

  const keyboardExample = keyboardSection.querySelector('.dos-demo-section___examples');
  if (keyboardExample) {
    const instructions = document.createElement('div');
    instructions.innerHTML = `
      <div style="margin-bottom: 12px; color: var(--dos-color-secondary);">
        <strong>Try these keys:</strong><br>
        ↑/↓ Arrow keys - Navigate rows<br>
        Home/End - Jump to first/last row<br>
        Space - Toggle selection<br>
        Tab - Focus sortable headers
      </div>
    `;

    const table = createTable({
      columns,
      data: fileData,
      selectable: true,
      sortable: true,
      striped: true,
      onRowClick: (row) => {
        console.log('Activated:', row.name);
      },
    });

    keyboardExample.appendChild(instructions);
    keyboardExample.appendChild(table.element);

    // Focus button
    const focusBtn = createButton({
      label: 'Focus Table',
      size: 'small',
      onClick: () => table.focus(),
    });
    focusBtn.style.marginTop = '8px';
    keyboardExample.appendChild(focusBtn);
  }
  content.appendChild(keyboardSection);

  // Accessibility Notes
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'The Table component follows ARIA best practices for data tables.',
    code: `// ARIA attributes automatically applied:
// - role="table" on the table element
// - role="rowgroup" on thead and tbody
// - role="row" on tr elements
// - role="columnheader" with scope="col" on th
// - role="cell" on td elements
// - aria-sort on sortable columns
// - aria-selected on selectable rows
// - aria-rowindex for row position
// - aria-rowcount and aria-colcount on table`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const notes = document.createElement('div');
    notes.innerHTML = `
      <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
        <li>Screen readers announce column count, row count, and table structure</li>
        <li>Sortable columns indicate sort direction (ascending/descending/none)</li>
        <li>Selected rows are announced via aria-selected</li>
        <li>All interactive elements are keyboard accessible</li>
        <li>Focus is visible with high-contrast outline</li>
      </ul>
    `;
    a11yExample.appendChild(notes);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the DataGrid demo page
 */
export function renderDataGridPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'DataGrid';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'Enhanced DOS-style data grid with cell editing, column resizing, reordering, and pagination support.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Import dynamically to avoid circular deps
  import('dosage').then(({ createDataGrid, createButton }) => {
    // Sample data
    const fileData = [
      { id: '1', name: 'CONFIG.SYS', size: 1024, date: '01-15-26', type: 'System' },
      { id: '2', name: 'AUTOEXEC.BAT', size: 512, date: '01-15-26', type: 'Batch' },
      { id: '3', name: 'COMMAND.COM', size: 54619, date: '01-15-26', type: 'Executable' },
      { id: '4', name: 'HIMEM.SYS', size: 13984, date: '01-15-26', type: 'Driver' },
      { id: '5', name: 'EMM386.EXE', size: 120926, date: '01-15-26', type: 'Executable' },
      { id: '6', name: 'README.TXT', size: 2048, date: '01-14-26', type: 'Text' },
      { id: '7', name: 'INSTALL.BAT', size: 384, date: '01-10-26', type: 'Batch' },
      { id: '8', name: 'SETUP.EXE', size: 45678, date: '01-08-26', type: 'Executable' },
      { id: '9', name: 'NOTES.TXT', size: 890, date: '01-05-26', type: 'Text' },
      { id: '10', name: 'BACKUP.BAT', size: 256, date: '01-01-26', type: 'Batch' },
      { id: '11', name: 'DRIVER.SYS', size: 8765, date: '12-28-25', type: 'Driver' },
      { id: '12', name: 'HELP.TXT', size: 4321, date: '12-25-25', type: 'Text' },
    ];

    // Basic DataGrid Section
    const basicSection = createDemoSection({
      title: 'Basic DataGrid',
      description: 'DataGrid extends Table with additional features like editing, resizing, and pagination.',
      code: `import { createDataGrid } from 'dosage';

const grid = createDataGrid({
  columns: [
    { key: 'name', label: 'Name', editable: true },
    { key: 'size', label: 'Size', align: 'right', editable: true, inputType: 'number' },
    { key: 'type', label: 'Type' },
  ],
  data: fileData,
  editable: true,
});

document.body.appendChild(grid.element);`,
    });

    const basicExample = basicSection.querySelector('.dos-demo-section___examples');
    if (basicExample) {
      const grid = createDataGrid({
        columns: [
          { key: 'name', label: 'Name', width: '200px' },
          { key: 'size', label: 'Size', align: 'right', width: '100px' },
          { key: 'type', label: 'Type', width: '120px' },
        ],
        data: fileData.slice(0, 5),
      });
      basicExample.appendChild(grid.element);
    }
    content.appendChild(basicSection);

    // Editable DataGrid Section
    const editableSection = createDemoSection({
      title: 'Editable Cells',
      description: 'Double-click a cell to edit. Press Enter to save, Escape to cancel, Tab to move to next cell.',
      code: `const grid = createDataGrid({
  columns: [
    { key: 'name', label: 'Name', editable: true },
    { key: 'size', label: 'Size', editable: true, inputType: 'number' },
    { 
      key: 'type', 
      label: 'Type', 
      editable: true,
      inputType: 'select',
      selectOptions: [
        { value: 'System', label: 'System' },
        { value: 'Executable', label: 'Executable' },
        { value: 'Text', label: 'Text' },
        { value: 'Batch', label: 'Batch' },
      ],
    },
  ],
  data: fileData,
  editable: true,
  onCellEdit: (event) => {
    console.log('Cell edited:', event);
  },
});`,
    });

    const editableExample = editableSection.querySelector('.dos-demo-section___examples');
    if (editableExample) {
      const statusEl = document.createElement('div');
      statusEl.style.marginBottom = '8px';
      statusEl.style.color = 'var(--dos-color-secondary)';
      statusEl.textContent = 'Double-click a cell to edit';

      const grid = createDataGrid({
        columns: [
          { key: 'name', label: 'Name', editable: true, width: '180px' },
          { key: 'size', label: 'Size', editable: true, inputType: 'number', align: 'right', width: '100px' },
          { 
            key: 'type', 
            label: 'Type', 
            editable: true,
            inputType: 'select',
            width: '120px',
            selectOptions: [
              { value: 'System', label: 'System' },
              { value: 'Executable', label: 'Executable' },
              { value: 'Text', label: 'Text' },
              { value: 'Batch', label: 'Batch' },
              { value: 'Driver', label: 'Driver' },
            ],
          },
        ],
        data: JSON.parse(JSON.stringify(fileData.slice(0, 5))), // Clone to avoid mutation
        editable: true,
        onCellEdit: (event) => {
          statusEl.textContent = `Edited ${event.column}: "${event.oldValue}" → "${event.newValue}"`;
        },
      });

      editableExample.appendChild(statusEl);
      editableExample.appendChild(grid.element);
    }
    content.appendChild(editableSection);

    // Resizable Columns Section
    const resizableSection = createDemoSection({
      title: 'Resizable Columns',
      description: 'Drag the column borders to resize. Column widths are preserved.',
      code: `const grid = createDataGrid({
  columns: [
    { key: 'name', label: 'Name', resizable: true, width: 200 },
    { key: 'size', label: 'Size', resizable: true, width: 100 },
    { key: 'type', label: 'Type', resizable: true, width: 120 },
  ],
  data: fileData,
  resizableColumns: true,
  onColumnResize: (event) => {
    console.log(\`Resized \${event.column}: \${event.oldWidth} → \${event.newWidth}\`);
  },
});`,
    });

    const resizableExample = resizableSection.querySelector('.dos-demo-section___examples');
    if (resizableExample) {
      const statusEl = document.createElement('div');
      statusEl.style.marginBottom = '8px';
      statusEl.style.color = 'var(--dos-color-secondary)';
      statusEl.textContent = 'Drag column edges to resize';

      const grid = createDataGrid({
        columns: [
          { key: 'name', label: 'Name', width: 180, minWidth: 100 },
          { key: 'size', label: 'Size', align: 'right', width: 100, minWidth: 60 },
          { key: 'date', label: 'Date', width: 100, minWidth: 80 },
          { key: 'type', label: 'Type', width: 120, minWidth: 80 },
        ],
        data: fileData.slice(0, 5),
        resizableColumns: true,
        onColumnResize: (event) => {
          statusEl.textContent = `Resized ${event.column}: ${event.oldWidth}px → ${event.newWidth}px`;
        },
      });

      resizableExample.appendChild(statusEl);
      resizableExample.appendChild(grid.element);
    }
    content.appendChild(resizableSection);

    // Pagination Section
    const paginationSection = createDemoSection({
      title: 'Pagination',
      description: 'Built-in pagination for large datasets with page size selector.',
      code: `const grid = createDataGrid({
  columns,
  data: largeDataset,
  pagination: {
    enabled: true,
    pageSize: 5,
    pageSizeOptions: [5, 10, 25],
    showPageSizeSelector: true,
    showRowCount: true,
  },
  onPageChange: (page) => console.log('Page:', page),
  onPageSizeChange: (size) => console.log('Page size:', size),
});`,
    });

    const paginationExample = paginationSection.querySelector('.dos-demo-section___examples');
    if (paginationExample) {
      const grid = createDataGrid({
        columns: [
          { key: 'name', label: 'Name', width: '180px' },
          { key: 'size', label: 'Size', align: 'right', width: '100px' },
          { key: 'date', label: 'Date', width: '100px' },
          { key: 'type', label: 'Type', width: '120px' },
        ],
        data: fileData,
        selectable: true,
        striped: true,
        pagination: {
          enabled: true,
          pageSize: 5,
          pageSizeOptions: [5, 10],
          showPageSizeSelector: true,
          showRowCount: true,
        },
      });
      paginationExample.appendChild(grid.element);
    }
    content.appendChild(paginationSection);

    // Combined Features Section
    const combinedSection = createDemoSection({
      title: 'All Features Combined',
      description: 'Sortable, selectable, editable grid with resizable columns and pagination.',
      code: `const grid = createDataGrid({
  columns,
  data: fileData,
  sortable: true,
  selectable: true,
  editable: true,
  resizableColumns: true,
  striped: true,
  pagination: { enabled: true, pageSize: 5 },
});`,
    });

    const combinedExample = combinedSection.querySelector('.dos-demo-section___examples');
    if (combinedExample) {
      let gridData = JSON.parse(JSON.stringify(fileData));
      
      const grid = createDataGrid({
        columns: [
          { key: 'name', label: 'Name', sortable: true, editable: true, width: 160, minWidth: 100 },
          { key: 'size', label: 'Size', sortable: true, editable: true, inputType: 'number', align: 'right', width: 90, minWidth: 60 },
          { key: 'date', label: 'Date', sortable: true, width: 90, minWidth: 80 },
          { key: 'type', label: 'Type', sortable: true, editable: true, inputType: 'select', width: 100, minWidth: 80,
            selectOptions: [
              { value: 'System', label: 'System' },
              { value: 'Executable', label: 'Executable' },
              { value: 'Text', label: 'Text' },
              { value: 'Batch', label: 'Batch' },
              { value: 'Driver', label: 'Driver' },
            ],
          },
        ],
        data: gridData,
        sortable: true,
        selectable: true,
        editable: true,
        resizableColumns: true,
        striped: true,
        pagination: {
          enabled: true,
          pageSize: 5,
          showRowCount: true,
        },
        onSort: (column, direction) => {
          gridData = [...gridData].sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            if (typeof aVal === 'number' && typeof bVal === 'number') {
              return direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return direction === 'asc' 
              ? String(aVal).localeCompare(String(bVal))
              : String(bVal).localeCompare(String(aVal));
          });
          grid.setData(gridData);
        },
      });
      
      combinedExample.appendChild(grid.element);

      const btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.gap = '8px';
      btnContainer.style.marginTop = '8px';

      const selectAllBtn = createButton({
        label: 'Select All',
        size: 'small',
        onClick: () => grid.selectAll(),
      });

      const clearBtn = createButton({
        label: 'Clear Selection',
        size: 'small',
        variant: 'secondary',
        onClick: () => grid.clearSelection(),
      });

      btnContainer.appendChild(selectAllBtn);
      btnContainer.appendChild(clearBtn);
      combinedExample.appendChild(btnContainer);
    }
    content.appendChild(combinedSection);

    // Keyboard Navigation Section
    const keyboardSection = createDemoSection({
      title: 'Keyboard Navigation',
      description: 'Full keyboard support for navigating, selecting, and editing.',
      code: `// Keyboard shortcuts:
// ↑/↓ - Navigate rows
// Home/End - First/last row
// Space - Select row (when selectable)
// F2 or Enter - Start editing cell
// Escape - Cancel edit
// Tab - Move to next editable cell
// Enter - Commit edit`,
    });

    const keyboardExample = keyboardSection.querySelector('.dos-demo-section___examples');
    if (keyboardExample) {
      const instructions = document.createElement('div');
      instructions.innerHTML = `
        <div style="margin-bottom: 12px; color: var(--dos-color-secondary);">
          <strong>Try these keys:</strong><br>
          ↑/↓ Arrow keys - Navigate rows<br>
          Home/End - Jump to first/last row<br>
          Space - Toggle selection<br>
          F2 or Enter - Edit current cell<br>
          Escape - Cancel editing<br>
          Tab - Move to next cell while editing
        </div>
      `;

      const grid = createDataGrid({
        columns: [
          { key: 'name', label: 'Name', editable: true, width: '180px' },
          { key: 'size', label: 'Size', editable: true, inputType: 'number', align: 'right', width: '100px' },
          { key: 'type', label: 'Type', width: '120px' },
        ],
        data: JSON.parse(JSON.stringify(fileData.slice(0, 5))),
        selectable: true,
        editable: true,
        striped: true,
      });

      keyboardExample.appendChild(instructions);
      keyboardExample.appendChild(grid.element);

      const focusBtn = createButton({
        label: 'Focus Grid',
        size: 'small',
        onClick: () => grid.focus(),
      });
      focusBtn.style.marginTop = '8px';
      keyboardExample.appendChild(focusBtn);
    }
    content.appendChild(keyboardSection);

    // Accessibility Notes
    const a11ySection = createDemoSection({
      title: 'Accessibility',
      description: 'The DataGrid follows ARIA best practices for interactive grids.',
      code: `// ARIA attributes automatically applied:
// - role="grid" on the container
// - role="rowgroup" on thead and tbody
// - role="row" on tr elements
// - role="columnheader" on th elements
// - aria-sort on sortable columns
// - aria-selected on selectable rows
// - aria-readonly on non-editable cells
// - aria-rowcount and aria-colcount on grid`,
    });

    const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
    if (a11yExample) {
      const notes = document.createElement('div');
      notes.innerHTML = `
        <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
          <li>Screen readers announce grid structure and cell positions</li>
          <li>Editable cells indicate edit mode to assistive technology</li>
          <li>Column resize and reorder announced for screen readers</li>
          <li>Pagination controls are fully keyboard accessible</li>
          <li>All interactive elements have visible focus indicators</li>
        </ul>
      `;
      a11yExample.appendChild(notes);
    }
    content.appendChild(a11ySection);
  });

  page.appendChild(content);
  return page;
}

/**
 * Renders placeholder for ListBox (not yet implemented)
 */
export function renderListBoxPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'ListBox';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style selectable list with single/multi-select, keyboard navigation, and type-ahead search.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Sample data
  const basicItems: ListBoxItem[] = [
    { id: '1', primary: 'CONFIG.SYS', icon: '█' },
    { id: '2', primary: 'AUTOEXEC.BAT', icon: '█' },
    { id: '3', primary: 'COMMAND.COM', icon: '▓' },
    { id: '4', primary: 'HIMEM.SYS', icon: '█' },
    { id: '5', primary: 'EMM386.EXE', icon: '▓' },
  ];

  const detailedItems: ListBoxItem[] = [
    { id: '1', primary: 'Document.txt', secondary: '2.5 KB - Modified today', icon: '▒', trailing: 'TXT' },
    { id: '2', primary: 'Image.bmp', secondary: '1.2 MB - Modified yesterday', icon: '░', trailing: 'BMP' },
    { id: '3', primary: 'Program.exe', secondary: '45 KB - Modified last week', icon: '▓', trailing: 'EXE' },
    { id: '4', primary: 'Archive.zip', secondary: '128 KB - Modified Jan 10', icon: '█', trailing: 'ZIP' },
    { id: '5', primary: 'ReadMe.txt', secondary: '512 bytes - Modified Jan 05', icon: '▒', trailing: 'TXT' },
  ];

  // Basic ListBox
  const basicSection = createDemoSection({
    title: 'Basic ListBox',
    description: 'A simple list displaying items with optional icons.',
    code: `import { createListBox } from 'dosage';

const listbox = createListBox({
  items: [
    { id: '1', primary: 'CONFIG.SYS', icon: '█' },
    { id: '2', primary: 'AUTOEXEC.BAT', icon: '█' },
    { id: '3', primary: 'COMMAND.COM', icon: '▓' },
  ],
  bordered: true,
});

document.body.appendChild(listbox.element);`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const listbox = createListBox({
      items: basicItems,
      bordered: true,
    });
    basicExample.appendChild(listbox.element);
  }
  content.appendChild(basicSection);

  // Single Select ListBox
  const singleSelectSection = createDemoSection({
    title: 'Single Select',
    description: 'Click an item to select it. Only one item can be selected at a time.',
    code: `const listbox = createListBox({
  items: fileItems,
  selectable: true,
  bordered: true,
  onSelect: (selected) => {
    console.log('Selected:', selected);
  },
});`,
  });

  const singleSelectExample = singleSelectSection.querySelector('.dos-demo-section___examples');
  if (singleSelectExample) {
    const selectedDisplay = document.createElement('div');
    selectedDisplay.className = 'dos-p-2 dos-mb-2';
    selectedDisplay.textContent = 'Selected: (none)';
    
    const listbox = createListBox({
      items: basicItems,
      selectable: true,
      bordered: true,
      onSelect: (selected) => {
        selectedDisplay.textContent = 'Selected: ' + (selected.length > 0 ? selected[0].primary : '(none)');
      },
    });
    
    singleSelectExample.appendChild(selectedDisplay);
    singleSelectExample.appendChild(listbox.element);
  }
  content.appendChild(singleSelectSection);

  // Multi Select ListBox
  const multiSelectSection = createDemoSection({
    title: 'Multi Select',
    description: 'Click items to toggle selection. Multiple items can be selected. Use Ctrl+A to select all.',
    code: `const listbox = createListBox({
  items: fileItems,
  selectable: true,
  multiSelect: true,
  bordered: true,
  dividers: true,
  onSelect: (selected) => {
    console.log('Selected:', selected.map(i => i.primary));
  },
});`,
  });

  const multiSelectExample = multiSelectSection.querySelector('.dos-demo-section___examples');
  if (multiSelectExample) {
    const selectedDisplay = document.createElement('div');
    selectedDisplay.className = 'dos-p-2 dos-mb-2';
    selectedDisplay.textContent = 'Selected: (none)';
    
    const listbox = createListBox({
      items: basicItems,
      selectable: true,
      multiSelect: true,
      bordered: true,
      dividers: true,
      onSelect: (selected) => {
        const names = selected.map(i => i.primary).join(', ');
        selectedDisplay.textContent = 'Selected: ' + (names || '(none)');
      },
    });
    
    singleSelectExample.appendChild(selectedDisplay);
    multiSelectExample.appendChild(listbox.element);
  }
  content.appendChild(multiSelectSection);

  // Rich Items ListBox
  const richItemsSection = createDemoSection({
    title: 'Rich Items',
    description: 'Items can have secondary text and trailing content.',
    code: `const listbox = createListBox({
  items: [
    { 
      id: '1', 
      primary: 'Document.txt', 
      secondary: '2.5 KB - Modified today',
      icon: '▒',
      trailing: 'TXT'
    },
    { 
      id: '2', 
      primary: 'Image.bmp', 
      secondary: '1.2 MB - Modified yesterday',
      icon: '░',
      trailing: 'BMP'
    },
  ],
  bordered: true,
});`,
  });

  const richItemsExample = richItemsSection.querySelector('.dos-demo-section___examples');
  if (richItemsExample) {
    const listbox = createListBox({
      items: detailedItems,
      bordered: true,
      selectable: true,
    });
    richItemsExample.appendChild(listbox.element);
  }
  content.appendChild(richItemsSection);

  // Disabled Items
  const disabledItemsSection = createDemoSection({
    title: 'Disabled Items',
    description: 'Items can be disabled to prevent selection and interaction.',
    code: `const listbox = createListBox({
  items: [
    { id: '1', primary: 'Available Option' },
    { id: '2', primary: 'Disabled Option', disabled: true },
    { id: '3', primary: 'Another Available' },
  ],
  selectable: true,
  bordered: true,
});`,
  });

  const disabledItemsExample = disabledItemsSection.querySelector('.dos-demo-section___examples');
  if (disabledItemsExample) {
    const disabledItems: ListBoxItem[] = [
      { id: '1', primary: 'Available File', icon: '█' },
      { id: '2', primary: 'Locked File', icon: '▓', disabled: true },
      { id: '3', primary: 'Another Available', icon: '█' },
      { id: '4', primary: 'System File', icon: '▓', disabled: true },
      { id: '5', primary: 'User File', icon: '█' },
    ];
    
    const listbox = createListBox({
      items: disabledItems,
      selectable: true,
      bordered: true,
    });
    disabledItemsExample.appendChild(listbox.element);
  }
  content.appendChild(disabledItemsSection);

  // Dense Mode
  const denseModeSection = createDemoSection({
    title: 'Dense Mode',
    description: 'Compact display with reduced padding. Secondary text is hidden.',
    code: `const listbox = createListBox({
  items: fileItems,
  dense: true,
  bordered: true,
  selectable: true,
});`,
  });

  const denseModeExample = denseModeSection.querySelector('.dos-demo-section___examples');
  if (denseModeExample) {
    const listbox = createListBox({
      items: detailedItems,
      dense: true,
      bordered: true,
      selectable: true,
    });
    denseModeExample.appendChild(listbox.element);
  }
  content.appendChild(denseModeSection);

  // Max Height with Scroll
  const scrollableSection = createDemoSection({
    title: 'Scrollable List',
    description: 'Set maxHeight to make the list scrollable when items exceed the height.',
    code: `const listbox = createListBox({
  items: manyItems,
  maxHeight: 150,
  bordered: true,
  selectable: true,
});`,
  });

  const scrollableExample = scrollableSection.querySelector('.dos-demo-section___examples');
  if (scrollableExample) {
    const manyItems: ListBoxItem[] = Array.from({ length: 15 }, (_, i) => ({
      id: `item-${i + 1}`,
      primary: `Item ${i + 1}`,
      icon: i % 2 === 0 ? '█' : '▓',
    }));
    
    const listbox = createListBox({
      items: manyItems,
      maxHeight: 150,
      bordered: true,
      selectable: true,
    });
    scrollableExample.appendChild(listbox.element);
  }
  content.appendChild(scrollableSection);

  // Instance Methods Demo
  const methodsSection = createDemoSection({
    title: 'Instance Methods',
    description: 'ListBox provides methods to programmatically control selection and items.',
    code: `const listbox = createListBox({
  items: fileItems,
  selectable: true,
  multiSelect: true,
  bordered: true,
});

// Select specific items
listbox.selectItems(['1', '3']);

// Get selected items
const selected = listbox.getSelectedItems();

// Clear selection
listbox.clearSelection();

// Select all
listbox.selectAll();

// Add/remove items dynamically
listbox.addItem({ id: 'new', primary: 'New Item' });
listbox.removeItem('1');`,
  });

  const methodsExample = methodsSection.querySelector('.dos-demo-section___examples');
  if (methodsExample) {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'dos-flex dos-gap-2 dos-mb-2 dos-flex-wrap';
    
    const listbox = createListBox({
      items: [...basicItems],
      selectable: true,
      multiSelect: true,
      bordered: true,
    });
    
    const selectAllBtn = createButton({
      label: 'Select All',
      onClick: () => listbox.selectAll(),
    });
    
    const clearBtn = createButton({
      label: 'Clear',
      onClick: () => listbox.clearSelection(),
    });
    
    const addBtn = createButton({
      label: 'Add Item',
      onClick: () => {
        const id = `new-${Date.now()}`;
        listbox.addItem({ id, primary: `New Item ${id.slice(-4)}`, icon: '░' });
      },
    });
    
    const removeBtn = createButton({
      label: 'Remove Selected',
      onClick: () => {
        const selected = listbox.getSelectedIds();
        selected.forEach(id => listbox.removeItem(id));
      },
    });
    
    controlsDiv.appendChild(selectAllBtn);
    controlsDiv.appendChild(clearBtn);
    controlsDiv.appendChild(addBtn);
    controlsDiv.appendChild(removeBtn);
    
    methodsExample.appendChild(controlsDiv);
    methodsExample.appendChild(listbox.element);
  }
  content.appendChild(methodsSection);

  // Keyboard Navigation
  const keyboardSection = createDemoSection({
    title: 'Keyboard Navigation',
    description: 'Full keyboard support for accessibility.',
    code: `// Keyboard shortcuts:
// ↑/↓ - Navigate items
// Home - Jump to first item
// End - Jump to last item
// Enter/Space - Select focused item
// Ctrl+A - Select all (multi-select mode)
// Type letter - Jump to item starting with that letter

const listbox = createListBox({
  items: alphabetItems,
  selectable: true,
  bordered: true,
});`,
  });

  const keyboardExample = keyboardSection.querySelector('.dos-demo-section___examples');
  if (keyboardExample) {
    const alphabetItems: ListBoxItem[] = [
      { id: 'a', primary: 'Apple' },
      { id: 'b', primary: 'Banana' },
      { id: 'c', primary: 'Cherry' },
      { id: 'd', primary: 'Date' },
      { id: 'e', primary: 'Elderberry' },
      { id: 'f', primary: 'Fig' },
      { id: 'g', primary: 'Grape' },
    ];
    
    const hint = document.createElement('p');
    hint.className = 'dos-text-secondary dos-text-sm dos-mb-2';
    hint.textContent = 'Focus the list and use arrow keys, Home/End, Enter/Space, or type a letter to navigate.';
    
    const listbox = createListBox({
      items: alphabetItems,
      selectable: true,
      bordered: true,
      'aria-label': 'Fruit list',
    });
    
    keyboardExample.appendChild(hint);
    keyboardExample.appendChild(listbox.element);
  }
  content.appendChild(keyboardSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'ListBox implements proper ARIA attributes for screen readers.',
    code: `// ListBox includes:
// - role="listbox" on container
// - role="option" on items
// - aria-selected for selection state
// - aria-disabled for disabled items
// - aria-multiselectable for multi-select
// - aria-activedescendant for focus tracking
// - Keyboard navigation per WAI-ARIA guidelines

const listbox = createListBox({
  items: items,
  selectable: true,
  'aria-label': 'File selection list',
});`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const info = document.createElement('div');
    info.innerHTML = `
      <p class="dos-text-sm dos-mb-2">ARIA attributes applied:</p>
      <ul class="dos-text-sm dos-text-secondary" style="list-style: none; padding-left: 16px;">
        <li>• role="listbox" on container</li>
        <li>• role="option" on each item</li>
        <li>• aria-selected="true/false" for selection</li>
        <li>• aria-disabled="true" for disabled items</li>
        <li>• tabindex="0" for keyboard focus</li>
      </ul>
    `;
    a11yExample.appendChild(info);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the TreeView demo page
 */
export function renderTreeViewPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'TreeView';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'Hierarchical tree structure with expand/collapse, selection, keyboard navigation, and ASCII connectors.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Sample file system tree
  const fileSystemTree: TreeNode[] = [
    {
      id: 'c-drive',
      label: 'C:\\',
      icon: '💾',
      children: [
        {
          id: 'dos',
          label: 'DOS',
          icon: '📁',
          children: [
            { id: 'command', label: 'COMMAND.COM', icon: '📄' },
            { id: 'edit', label: 'EDIT.COM', icon: '📄' },
            { id: 'format', label: 'FORMAT.COM', icon: '📄' },
          ],
        },
        {
          id: 'windows',
          label: 'WINDOWS',
          icon: '📁',
          children: [
            { id: 'win', label: 'WIN.COM', icon: '📄' },
            {
              id: 'system',
              label: 'SYSTEM',
              icon: '📁',
              children: [
                { id: 'kernel', label: 'KERNEL.DLL', icon: '📄' },
                { id: 'gdi', label: 'GDI.DLL', icon: '📄' },
              ],
            },
          ],
        },
        { id: 'autoexec', label: 'AUTOEXEC.BAT', icon: '📄' },
        { id: 'config', label: 'CONFIG.SYS', icon: '📄' },
      ],
    },
    {
      id: 'a-drive',
      label: 'A:\\',
      icon: '💾',
      children: [
        { id: 'setup', label: 'SETUP.EXE', icon: '📄' },
        { id: 'readme', label: 'README.TXT', icon: '📄' },
      ],
    },
  ];

  // Basic TreeView Example
  const basicSection = createDemoSection({
    title: 'Basic TreeView',
    description: 'A simple tree showing hierarchical structure. Click the [+] icon to expand nodes.',
    code: `import { createTreeView } from 'dosage';

const tree = createTreeView({
  nodes: [
    {
      id: 'root',
      label: 'Documents',
      children: [
        { id: 'readme', label: 'README.TXT' },
        { id: 'config', label: 'CONFIG.SYS' },
      ],
    },
  ],
});

document.body.appendChild(tree.element);`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const simpleTree: TreeNode[] = [
      {
        id: 'documents',
        label: 'Documents',
        children: [
          { id: 'readme', label: 'README.TXT' },
          { id: 'config', label: 'CONFIG.SYS' },
          {
            id: 'letters',
            label: 'Letters',
            children: [
              { id: 'letter1', label: 'letter1.doc' },
              { id: 'letter2', label: 'letter2.doc' },
            ],
          },
        ],
      },
      {
        id: 'programs',
        label: 'Programs',
        children: [
          { id: 'edit', label: 'EDIT.COM' },
          { id: 'format', label: 'FORMAT.COM' },
        ],
      },
    ];
    const tree = createTreeView({ nodes: simpleTree });
    basicExample.appendChild(tree.element);
  }
  content.appendChild(basicSection);

  // Default Expanded Example
  const expandedSection = createDemoSection({
    title: 'Default Expanded',
    description: 'Set defaultExpanded: true to show all nodes expanded, or provide an array of node IDs.',
    code: `const tree = createTreeView({
  nodes: treeData,
  defaultExpanded: true, // or ['node-id-1', 'node-id-2']
});`,
  });

  const expandedExample = expandedSection.querySelector('.dos-demo-section___examples');
  if (expandedExample) {
    const tree = createTreeView({
      nodes: fileSystemTree,
      defaultExpanded: ['c-drive', 'dos'],
    });
    expandedExample.appendChild(tree.element);
  }
  content.appendChild(expandedSection);

  // With Icons Example
  const iconsSection = createDemoSection({
    title: 'Custom Icons',
    description: 'Add custom icons to nodes with the icon property. Use showIcons to enable icon display.',
    code: `const tree = createTreeView({
  nodes: [
    {
      id: 'c-drive',
      label: 'C:\\\\',
      icon: '💾',
      children: [
        { id: 'dos', label: 'DOS', icon: '📁', children: [...] },
        { id: 'autoexec', label: 'AUTOEXEC.BAT', icon: '📄' },
      ],
    },
  ],
  showIcons: true,
  defaultExpanded: true,
});`,
  });

  const iconsExample = iconsSection.querySelector('.dos-demo-section___examples');
  if (iconsExample) {
    const tree = createTreeView({
      nodes: fileSystemTree,
      showIcons: true,
      defaultExpanded: ['c-drive', 'windows'],
    });
    iconsExample.appendChild(tree.element);
  }
  content.appendChild(iconsSection);

  // Single Selection Example
  const singleSelectSection = createDemoSection({
    title: 'Single Selection',
    description: 'Enable selection with selectable: true. Only one node can be selected at a time.',
    code: `const tree = createTreeView({
  nodes: treeData,
  selectable: true,
  onSelect: (nodes) => {
    console.log('Selected:', nodes);
  },
});`,
  });

  const singleSelectExample = singleSelectSection.querySelector('.dos-demo-section___examples');
  if (singleSelectExample) {
    const outputDiv = document.createElement('div');
    outputDiv.className = 'dos-demo-section___output';
    outputDiv.style.marginTop = 'var(--dos-spacing-md)';
    outputDiv.textContent = 'Selection: (none)';

    const tree = createTreeView({
      nodes: fileSystemTree,
      selectable: true,
      defaultExpanded: ['c-drive'],
      onSelect: (selected) => {
        if (selected.length > 0) {
          outputDiv.textContent = `Selection: ${selected.map((n) => n.label).join(', ')}`;
        } else {
          outputDiv.textContent = 'Selection: (none)';
        }
      },
    });
    singleSelectExample.appendChild(tree.element);
    singleSelectExample.appendChild(outputDiv);
  }
  content.appendChild(singleSelectSection);

  // Multi-Selection Example
  const multiSelectSection = createDemoSection({
    title: 'Multi-Selection',
    description: 'Enable multiple selection with multiSelect: true. Click to toggle selection.',
    code: `const tree = createTreeView({
  nodes: treeData,
  selectable: true,
  multiSelect: true,
  onSelect: (nodes) => {
    console.log('Selected:', nodes);
  },
});`,
  });

  const multiSelectExample = multiSelectSection.querySelector('.dos-demo-section___examples');
  if (multiSelectExample) {
    const outputDiv = document.createElement('div');
    outputDiv.className = 'dos-demo-section___output';
    outputDiv.style.marginTop = 'var(--dos-spacing-md)';
    outputDiv.textContent = 'Selected: (none)';

    const tree = createTreeView({
      nodes: fileSystemTree,
      selectable: true,
      multiSelect: true,
      defaultExpanded: ['c-drive', 'dos'],
      onSelect: (selected) => {
        if (selected.length > 0) {
          outputDiv.textContent = `Selected: ${selected.map((n) => n.label).join(', ')}`;
        } else {
          outputDiv.textContent = 'Selected: (none)';
        }
      },
    });
    multiSelectExample.appendChild(tree.element);
    multiSelectExample.appendChild(outputDiv);
  }
  content.appendChild(multiSelectSection);

  // Disabled Nodes Example
  const disabledSection = createDemoSection({
    title: 'Disabled Nodes',
    description: 'Nodes can be disabled to prevent interaction. Disabled nodes are grayed out.',
    code: `const tree = createTreeView({
  nodes: [
    { id: '1', label: 'Enabled Node' },
    { id: '2', label: 'Disabled Node', disabled: true },
    {
      id: '3',
      label: 'Parent',
      children: [
        { id: '4', label: 'Disabled Child', disabled: true },
      ],
    },
  ],
  selectable: true,
});`,
  });

  const disabledExample = disabledSection.querySelector('.dos-demo-section___examples');
  if (disabledExample) {
    const treeData: TreeNode[] = [
      { id: '1', label: 'Normal File', icon: '📄' },
      { id: '2', label: 'System File (Protected)', icon: '🔒', disabled: true },
      {
        id: '3',
        label: 'Programs',
        icon: '📁',
        children: [
          { id: '4', label: 'Available', icon: '📄' },
          { id: '5', label: 'In Use (Locked)', icon: '🔒', disabled: true },
          { id: '6', label: 'Available', icon: '📄' },
        ],
      },
    ];
    const tree = createTreeView({
      nodes: treeData,
      selectable: true,
      showIcons: true,
      defaultExpanded: true,
    });
    disabledExample.appendChild(tree.element);
  }
  content.appendChild(disabledSection);

  // ASCII Lines Example
  const linesSection = createDemoSection({
    title: 'ASCII Connecting Lines',
    description: 'Show tree structure with ASCII connecting lines (├── └── │). Disable with showLines: false.',
    code: `// Lines enabled (default)
const tree1 = createTreeView({
  nodes: treeData,
  showLines: true, // default
});

// Lines disabled
const tree2 = createTreeView({
  nodes: treeData,
  showLines: false,
});`,
  });

  const linesExample = linesSection.querySelector('.dos-demo-section___examples');
  if (linesExample) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = 'var(--dos-spacing-xl)';
    wrapper.style.flexWrap = 'wrap';

    const col1 = document.createElement('div');
    const label1 = document.createElement('div');
    label1.textContent = 'With Lines:';
    label1.style.marginBottom = 'var(--dos-spacing-sm)';
    col1.appendChild(label1);

    const tree1 = createTreeView({
      nodes: [
        {
          id: 'root',
          label: 'Root',
          children: [
            { id: 'a', label: 'Item A' },
            {
              id: 'b',
              label: 'Item B',
              children: [
                { id: 'b1', label: 'B1' },
                { id: 'b2', label: 'B2' },
              ],
            },
            { id: 'c', label: 'Item C' },
          ],
        },
      ],
      showLines: true,
      defaultExpanded: true,
    });
    col1.appendChild(tree1.element);

    const col2 = document.createElement('div');
    const label2 = document.createElement('div');
    label2.textContent = 'Without Lines:';
    label2.style.marginBottom = 'var(--dos-spacing-sm)';
    col2.appendChild(label2);

    const tree2 = createTreeView({
      nodes: [
        {
          id: 'root',
          label: 'Root',
          children: [
            { id: 'a', label: 'Item A' },
            {
              id: 'b',
              label: 'Item B',
              children: [
                { id: 'b1', label: 'B1' },
                { id: 'b2', label: 'B2' },
              ],
            },
            { id: 'c', label: 'Item C' },
          ],
        },
      ],
      showLines: false,
      defaultExpanded: true,
    });
    col2.appendChild(tree2.element);

    wrapper.appendChild(col1);
    wrapper.appendChild(col2);
    linesExample.appendChild(wrapper);
  }
  content.appendChild(linesSection);

  // Instance Methods Example
  const methodsSection = createDemoSection({
    title: 'Instance Methods',
    description: 'Control the tree programmatically with methods like expandAll, collapseAll, selectNode, etc.',
    code: `const tree = createTreeView({
  nodes: treeData,
  selectable: true,
});

// Expand/collapse
tree.expandAll();
tree.collapseAll();
tree.expandNode('node-id');
tree.toggleNode('node-id');

// Selection
tree.selectNode('node-id');
tree.clearSelection();
const selected = tree.getSelectedNodes();

// Query
const node = tree.getNodeById('node-id');
const isExpanded = tree.isExpanded('node-id');`,
  });

  const methodsExample = methodsSection.querySelector('.dos-demo-section___examples');
  if (methodsExample) {
    const tree = createTreeView({
      nodes: fileSystemTree,
      selectable: true,
      showIcons: true,
    });

    const statusDiv = document.createElement('div');
    statusDiv.className = 'dos-demo-section___output';
    statusDiv.style.marginTop = 'var(--dos-spacing-md)';
    statusDiv.textContent = 'Use the buttons below';

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.gap = 'var(--dos-spacing-sm)';
    buttonRow.style.flexWrap = 'wrap';
    buttonRow.style.marginTop = 'var(--dos-spacing-md)';

    const expandAllBtn = createButton({
      label: 'Expand All',
      onClick: () => {
        tree.expandAll();
        statusDiv.textContent = 'All nodes expanded';
      },
    });

    const collapseAllBtn = createButton({
      label: 'Collapse All',
      onClick: () => {
        tree.collapseAll();
        statusDiv.textContent = 'All nodes collapsed';
      },
    });

    const selectDosBtn = createButton({
      label: 'Select DOS',
      onClick: () => {
        tree.expandNode('c-drive');
        tree.selectNode('dos');
        statusDiv.textContent = 'Selected: DOS';
      },
    });

    const clearBtn = createButton({
      label: 'Clear Selection',
      onClick: () => {
        tree.clearSelection();
        statusDiv.textContent = 'Selection cleared';
      },
    });

    buttonRow.appendChild(expandAllBtn.element);
    buttonRow.appendChild(collapseAllBtn.element);
    buttonRow.appendChild(selectDosBtn.element);
    buttonRow.appendChild(clearBtn.element);

    methodsExample.appendChild(tree.element);
    methodsExample.appendChild(statusDiv);
    methodsExample.appendChild(buttonRow);
  }
  content.appendChild(methodsSection);

  // Keyboard Navigation Example
  const keyboardSection = createDemoSection({
    title: 'Keyboard Navigation',
    description: 'Full keyboard navigation support for accessibility.',
    code: `// Keyboard shortcuts:
// ↑/↓ - Navigate between visible nodes
// ← - Collapse node or move to parent
// → - Expand node or move to first child
// Home - Jump to first node
// End - Jump to last visible node
// Enter/Space - Select focused node (if selectable)
// * - Expand all sibling nodes
// Type letters - Jump to matching node (type-ahead)`,
  });

  const keyboardExample = keyboardSection.querySelector('.dos-demo-section___examples');
  if (keyboardExample) {
    const keyList = document.createElement('div');
    keyList.className = 'dos-demo-section___key-list';
    keyList.innerHTML = `
      <div class="dos-demo-section___key-row"><kbd>↑</kbd><kbd>↓</kbd> Navigate between nodes</div>
      <div class="dos-demo-section___key-row"><kbd>←</kbd> Collapse or move to parent</div>
      <div class="dos-demo-section___key-row"><kbd>→</kbd> Expand or move to child</div>
      <div class="dos-demo-section___key-row"><kbd>Home</kbd> Jump to first node</div>
      <div class="dos-demo-section___key-row"><kbd>End</kbd> Jump to last visible node</div>
      <div class="dos-demo-section___key-row"><kbd>Enter</kbd><kbd>Space</kbd> Select node</div>
      <div class="dos-demo-section___key-row"><kbd>*</kbd> Expand all siblings</div>
      <div class="dos-demo-section___key-row"><kbd>a-z</kbd> Type-ahead search</div>
    `;

    const tree = createTreeView({
      nodes: fileSystemTree,
      selectable: true,
      defaultExpanded: ['c-drive'],
      'aria-label': 'Keyboard navigation demo',
    });

    keyboardExample.appendChild(keyList);
    keyboardExample.appendChild(tree.element);

    const tip = document.createElement('p');
    tip.style.marginTop = 'var(--dos-spacing-sm)';
    tip.textContent = 'Tab to the tree and use keyboard to navigate.';
    keyboardExample.appendChild(tip);
  }
  content.appendChild(keyboardSection);

  // Accessibility Example
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'TreeView includes full ARIA support for screen readers.',
    code: `// ARIA attributes:
// role="tree" on container
// role="treeitem" on each node
// aria-expanded on expandable nodes
// aria-selected on selected nodes
// aria-disabled on disabled nodes
// aria-level for nesting depth
// aria-label for tree description

const tree = createTreeView({
  nodes: treeData,
  selectable: true,
  multiSelect: true,
  'aria-label': 'File Browser',
});`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const ariaInfo = document.createElement('div');
    ariaInfo.innerHTML = `
      <table class="dos-table" style="margin-bottom: var(--dos-spacing-md);">
        <thead>
          <tr>
            <th>ARIA Attribute</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>role="tree"</td><td>Identifies the container as a tree widget</td></tr>
          <tr><td>role="treeitem"</td><td>Identifies each node as a tree item</td></tr>
          <tr><td>aria-expanded</td><td>Indicates expand/collapse state</td></tr>
          <tr><td>aria-selected</td><td>Indicates selection state</td></tr>
          <tr><td>aria-level</td><td>Indicates nesting depth (1, 2, 3...)</td></tr>
          <tr><td>aria-disabled</td><td>Indicates disabled state</td></tr>
          <tr><td>aria-multiselectable</td><td>Indicates multi-select support</td></tr>
        </tbody>
      </table>
    `;

    const tree = createTreeView({
      nodes: fileSystemTree,
      selectable: true,
      multiSelect: true,
      showIcons: true,
      defaultExpanded: ['c-drive'],
      'aria-label': 'Accessible File Browser',
    });

    a11yExample.appendChild(ariaInfo);
    a11yExample.appendChild(tree.element);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Badge demo page
 */
export function renderBadgePage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Badge';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style status badges and tags with bracket notation [LABEL], color variants, and removable option.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Badge Example
  const basicSection = createDemoSection({
    title: 'Basic Badge',
    description: 'Simple badge displaying text in DOS-style brackets.',
    code: `import { createBadge } from 'dosage';

const badge = createBadge({
  label: 'NEW',
});

document.body.appendChild(badge.element);`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = 'var(--dos-spacing-md)';
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.alignItems = 'center';

    const badge1 = createBadge({ label: 'NEW' });
    const badge2 = createBadge({ label: 'v1.0' });
    const badge3 = createBadge({ label: 'BETA' });
    const badge4 = createBadge({ label: 'DOS' });

    wrapper.appendChild(badge1.element);
    wrapper.appendChild(badge2.element);
    wrapper.appendChild(badge3.element);
    wrapper.appendChild(badge4.element);

    basicExample.appendChild(wrapper);
  }
  content.appendChild(basicSection);

  // Variants Example
  const variantsSection = createDemoSection({
    title: 'Color Variants',
    description: 'Badges come in 6 color variants for different semantic meanings.',
    code: `const defaultBadge = createBadge({ label: 'DEFAULT', variant: 'default' });
const primaryBadge = createBadge({ label: 'PRIMARY', variant: 'primary' });
const successBadge = createBadge({ label: 'SUCCESS', variant: 'success' });
const warningBadge = createBadge({ label: 'WARNING', variant: 'warning' });
const errorBadge = createBadge({ label: 'ERROR', variant: 'error' });
const infoBadge = createBadge({ label: 'INFO', variant: 'info' });`,
  });

  const variantsExample = variantsSection.querySelector('.dos-demo-section___examples');
  if (variantsExample) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = 'var(--dos-spacing-md)';
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.alignItems = 'center';

    const variants: BadgeVariant[] = ['default', 'primary', 'success', 'warning', 'error', 'info'];
    variants.forEach((variant) => {
      const badge = createBadge({
        label: variant.toUpperCase(),
        variant,
      });
      wrapper.appendChild(badge.element);
    });

    variantsExample.appendChild(wrapper);
  }
  content.appendChild(variantsSection);

  // Sizes Example
  const sizesSection = createDemoSection({
    title: 'Sizes',
    description: 'Badges can be small or medium (default).',
    code: `const smallBadge = createBadge({ label: 'SMALL', size: 'small' });
const mediumBadge = createBadge({ label: 'MEDIUM', size: 'medium' });`,
  });

  const sizesExample = sizesSection.querySelector('.dos-demo-section___examples');
  if (sizesExample) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = 'var(--dos-spacing-md)';
    wrapper.style.alignItems = 'center';

    const smallBadge = createBadge({ label: 'SMALL', size: 'small', variant: 'primary' });
    const mediumBadge = createBadge({ label: 'MEDIUM', size: 'medium', variant: 'primary' });

    wrapper.appendChild(smallBadge.element);
    wrapper.appendChild(mediumBadge.element);

    sizesExample.appendChild(wrapper);
  }
  content.appendChild(sizesSection);

  // With Icons Example
  const iconsSection = createDemoSection({
    title: 'With Icons',
    description: 'Add a leading icon to badges using emoji or text characters.',
    code: `const badge1 = createBadge({ label: 'PINNED', icon: '📌' });
const badge2 = createBadge({ label: 'STARRED', icon: '★', variant: 'warning' });
const badge3 = createBadge({ label: 'LOCKED', icon: '🔒', variant: 'error' });`,
  });

  const iconsExample = iconsSection.querySelector('.dos-demo-section___examples');
  if (iconsExample) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = 'var(--dos-spacing-md)';
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.alignItems = 'center';

    const badge1 = createBadge({ label: 'PINNED', icon: '📌', variant: 'info' });
    const badge2 = createBadge({ label: 'STARRED', icon: '★', variant: 'warning' });
    const badge3 = createBadge({ label: 'LOCKED', icon: '🔒', variant: 'error' });
    const badge4 = createBadge({ label: 'OK', icon: '✓', variant: 'success' });

    wrapper.appendChild(badge1.element);
    wrapper.appendChild(badge2.element);
    wrapper.appendChild(badge3.element);
    wrapper.appendChild(badge4.element);

    iconsExample.appendChild(wrapper);
  }
  content.appendChild(iconsSection);

  // Removable Example
  const removableSection = createDemoSection({
    title: 'Removable Badges',
    description: 'Add a remove button to badges with the removable prop. Click × to remove.',
    code: `const badge = createBadge({
  label: 'TAG',
  removable: true,
  onRemove: () => {
    badge.destroy();
    console.log('Badge removed');
  },
});`,
  });

  const removableExample = removableSection.querySelector('.dos-demo-section___examples');
  if (removableExample) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = 'var(--dos-spacing-md)';
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.alignItems = 'center';

    const outputDiv = document.createElement('div');
    outputDiv.className = 'dos-demo-section___output';
    outputDiv.style.width = '100%';
    outputDiv.style.marginTop = 'var(--dos-spacing-md)';
    outputDiv.textContent = 'Click × to remove a badge';

    const tags = ['JavaScript', 'TypeScript', 'DOS', 'Retro'];
    const badges: ReturnType<typeof createBadge>[] = [];

    tags.forEach((tag, index) => {
      const variants: BadgeVariant[] = ['primary', 'success', 'warning', 'info'];
      const badge = createBadge({
        label: tag,
        variant: variants[index % variants.length],
        removable: true,
        onRemove: () => {
          badge.destroy();
          outputDiv.textContent = `Removed: ${tag}`;
        },
      });
      badges.push(badge);
      wrapper.appendChild(badge.element);
    });

    removableExample.appendChild(wrapper);
    removableExample.appendChild(outputDiv);
  }
  content.appendChild(removableSection);

  // Instance Methods Example
  const methodsSection = createDemoSection({
    title: 'Instance Methods',
    description: 'Control badges programmatically with instance methods.',
    code: `const badge = createBadge({ label: 'ORIGINAL', variant: 'default' });

// Update label
badge.setLabel('UPDATED');

// Change variant
badge.setVariant('success');

// Add/remove icon
badge.setIcon('🔥');
badge.setIcon(undefined);

// Make removable
badge.setRemovable(true);

// Get current state
console.log(badge.getLabel());
console.log(badge.getVariant());

// Destroy
badge.destroy();`,
  });

  const methodsExample = methodsSection.querySelector('.dos-demo-section___examples');
  if (methodsExample) {
    const demoBadge = createBadge({ label: 'DEMO', variant: 'default' });
    
    const statusDiv = document.createElement('div');
    statusDiv.className = 'dos-demo-section___output';
    statusDiv.style.marginTop = 'var(--dos-spacing-md)';
    statusDiv.textContent = `Label: ${demoBadge.getLabel()} | Variant: ${demoBadge.getVariant()}`;

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.gap = 'var(--dos-spacing-sm)';
    buttonRow.style.flexWrap = 'wrap';
    buttonRow.style.marginTop = 'var(--dos-spacing-md)';

    let variantIndex = 0;
    const variantOptions: BadgeVariant[] = ['default', 'primary', 'success', 'warning', 'error', 'info'];

    const changeLabelBtn = createButton({
      label: 'Change Label',
      onClick: () => {
        const labels = ['HELLO', 'WORLD', 'DOS', 'RETRO', 'BADGE'];
        const newLabel = labels[Math.floor(Math.random() * labels.length)];
        demoBadge.setLabel(newLabel);
        statusDiv.textContent = `Label: ${demoBadge.getLabel()} | Variant: ${demoBadge.getVariant()}`;
      },
    });

    const cycleVariantBtn = createButton({
      label: 'Cycle Variant',
      onClick: () => {
        variantIndex = (variantIndex + 1) % variantOptions.length;
        demoBadge.setVariant(variantOptions[variantIndex]);
        statusDiv.textContent = `Label: ${demoBadge.getLabel()} | Variant: ${demoBadge.getVariant()}`;
      },
    });

    const toggleIconBtn = createButton({
      label: 'Toggle Icon',
      onClick: () => {
        const iconEl = demoBadge.element.querySelector('.dos-badge___icon');
        if (iconEl) {
          demoBadge.setIcon(undefined);
        } else {
          demoBadge.setIcon('🔥');
        }
      },
    });

    buttonRow.appendChild(changeLabelBtn.element);
    buttonRow.appendChild(cycleVariantBtn.element);
    buttonRow.appendChild(toggleIconBtn.element);

    methodsExample.appendChild(demoBadge.element);
    methodsExample.appendChild(statusDiv);
    methodsExample.appendChild(buttonRow);
  }
  content.appendChild(methodsSection);

  // Use Cases Example
  const useCasesSection = createDemoSection({
    title: 'Common Use Cases',
    description: 'Examples of badges in typical applications.',
    code: `// Version badge
createBadge({ label: 'v2.1.0', variant: 'primary' });

// Status badges
createBadge({ label: 'ONLINE', icon: '●', variant: 'success' });
createBadge({ label: 'OFFLINE', icon: '●', variant: 'error' });

// Alert badges
createBadge({ label: '3 NEW', variant: 'error' });

// Tags
createBadge({ label: 'JavaScript', removable: true });`,
  });

  const useCasesExample = useCasesSection.querySelector('.dos-demo-section___examples');
  if (useCasesExample) {
    // Version badges
    const versionRow = document.createElement('div');
    versionRow.style.marginBottom = 'var(--dos-spacing-md)';
    const versionLabel = document.createElement('span');
    versionLabel.textContent = 'Versions: ';
    versionRow.appendChild(versionLabel);

    const v1 = createBadge({ label: 'v1.0.0', variant: 'default' });
    const v2 = createBadge({ label: 'v2.0.0', variant: 'primary' });
    const vLatest = createBadge({ label: 'v2.1.0', variant: 'success', icon: '★' });

    versionRow.appendChild(document.createTextNode(' '));
    versionRow.appendChild(v1.element);
    versionRow.appendChild(document.createTextNode(' '));
    versionRow.appendChild(v2.element);
    versionRow.appendChild(document.createTextNode(' '));
    versionRow.appendChild(vLatest.element);

    // Status badges
    const statusRow = document.createElement('div');
    statusRow.style.marginBottom = 'var(--dos-spacing-md)';
    const statusLabel = document.createElement('span');
    statusLabel.textContent = 'Status: ';
    statusRow.appendChild(statusLabel);

    const online = createBadge({ label: 'ONLINE', icon: '●', variant: 'success' });
    const busy = createBadge({ label: 'BUSY', icon: '●', variant: 'warning' });
    const offline = createBadge({ label: 'OFFLINE', icon: '●', variant: 'error' });

    statusRow.appendChild(document.createTextNode(' '));
    statusRow.appendChild(online.element);
    statusRow.appendChild(document.createTextNode(' '));
    statusRow.appendChild(busy.element);
    statusRow.appendChild(document.createTextNode(' '));
    statusRow.appendChild(offline.element);

    // Notification badges
    const notifRow = document.createElement('div');
    notifRow.style.marginBottom = 'var(--dos-spacing-md)';
    const notifLabel = document.createElement('span');
    notifLabel.textContent = 'Notifications: ';
    notifRow.appendChild(notifLabel);

    const mail = createBadge({ label: '3 NEW', variant: 'error' });
    const updates = createBadge({ label: '1 UPDATE', variant: 'warning' });

    notifRow.appendChild(document.createTextNode(' '));
    notifRow.appendChild(mail.element);
    notifRow.appendChild(document.createTextNode(' '));
    notifRow.appendChild(updates.element);

    useCasesExample.appendChild(versionRow);
    useCasesExample.appendChild(statusRow);
    useCasesExample.appendChild(notifRow);
  }
  content.appendChild(useCasesSection);

  // Accessibility Example
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'Badges include proper ARIA attributes for screen readers.',
    code: `// Badge with custom aria-label
const badge = createBadge({
  label: '3',
  variant: 'error',
  'aria-label': '3 unread messages',
});

// Badge has role="status" for dynamic content
// Remove button has aria-label="Remove {label}"`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const ariaInfo = document.createElement('div');
    ariaInfo.innerHTML = `
      <table class="dos-table" style="margin-bottom: var(--dos-spacing-md);">
        <thead>
          <tr>
            <th>ARIA Attribute</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>role="status"</td><td>Announces badge content to screen readers</td></tr>
          <tr><td>aria-label</td><td>Custom accessible name for the badge</td></tr>
          <tr><td>aria-hidden="true"</td><td>Hides decorative icons from AT</td></tr>
          <tr><td>aria-label on ×</td><td>"Remove {label}" for remove button</td></tr>
        </tbody>
      </table>
    `;

    const demoBadge = createBadge({
      label: '5',
      variant: 'error',
      icon: '✉',
      'aria-label': '5 unread messages',
      removable: true,
    });

    a11yExample.appendChild(ariaInfo);
    a11yExample.appendChild(demoBadge.element);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Avatar demo page
 */
export function renderAvatarPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Avatar';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style user avatar displaying initials in an ASCII box with optional status indicators.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Avatar Example
  const basicSection = createDemoSection({
    title: 'Basic Avatar',
    description: 'Simple avatar displaying user initials extracted from their name.',
    code: `import { createAvatar } from 'dosage';

const avatar = createAvatar({
  name: 'John Doe',
});

document.body.appendChild(avatar.element);`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = 'var(--dos-spacing-lg)';
    wrapper.style.alignItems = 'center';

    const avatar1 = createAvatar({ name: 'John Doe' });
    const avatar2 = createAvatar({ name: 'Jane Smith' });
    const avatar3 = createAvatar({ name: 'Bob' });
    const avatar4 = createAvatar({ name: 'Alice Williams' });

    wrapper.appendChild(avatar1.element);
    wrapper.appendChild(avatar2.element);
    wrapper.appendChild(avatar3.element);
    wrapper.appendChild(avatar4.element);

    basicExample.appendChild(wrapper);
  }
  content.appendChild(basicSection);

  // Sizes Example
  const sizesSection = createDemoSection({
    title: 'Sizes',
    description: 'Avatars come in three sizes: small, medium (default), and large.',
    code: `const small = createAvatar({ name: 'SM', size: 'small' });
const medium = createAvatar({ name: 'MD', size: 'medium' });
const large = createAvatar({ name: 'LG', size: 'large' });`,
  });

  const sizesExample = sizesSection.querySelector('.dos-demo-section___examples');
  if (sizesExample) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = 'var(--dos-spacing-lg)';
    wrapper.style.alignItems = 'flex-end';

    const small = createAvatar({ name: 'Small User', size: 'small' });
    const medium = createAvatar({ name: 'Medium User', size: 'medium' });
    const large = createAvatar({ name: 'Large User', size: 'large' });

    // Add labels
    const createLabeledAvatar = (avatar: ReturnType<typeof createAvatar>, label: string) => {
      const container = document.createElement('div');
      container.style.textAlign = 'center';
      container.appendChild(avatar.element);
      const labelEl = document.createElement('div');
      labelEl.textContent = label;
      labelEl.style.marginTop = 'var(--dos-spacing-xs)';
      labelEl.style.fontSize = 'var(--dos-font-size-xs)';
      container.appendChild(labelEl);
      return container;
    };

    wrapper.appendChild(createLabeledAvatar(small, 'Small'));
    wrapper.appendChild(createLabeledAvatar(medium, 'Medium'));
    wrapper.appendChild(createLabeledAvatar(large, 'Large'));

    sizesExample.appendChild(wrapper);
  }
  content.appendChild(sizesSection);

  // Custom Initials Example
  const initialsSection = createDemoSection({
    title: 'Custom Initials',
    description: 'Override automatically extracted initials with custom text.',
    code: `// Auto-extracted from name
const auto = createAvatar({ name: 'John Michael Doe' }); // "JD"

// Custom initials override
const custom = createAvatar({
  name: 'Administrator',
  initials: '★',
});`,
  });

  const initialsExample = initialsSection.querySelector('.dos-demo-section___examples');
  if (initialsExample) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = 'var(--dos-spacing-lg)';
    wrapper.style.alignItems = 'center';

    const auto1 = createAvatar({ name: 'John Doe' });
    const auto2 = createAvatar({ name: 'John Michael Doe' });
    const custom1 = createAvatar({ name: 'Administrator', initials: '★' });
    const custom2 = createAvatar({ name: 'System', initials: 'SYS' });

    wrapper.appendChild(auto1.element);
    wrapper.appendChild(auto2.element);
    wrapper.appendChild(custom1.element);
    wrapper.appendChild(custom2.element);

    sizesExample?.parentElement?.appendChild(wrapper);
    initialsExample.appendChild(wrapper);
  }
  content.appendChild(initialsSection);

  // Status Indicators Example
  const statusSection = createDemoSection({
    title: 'Status Indicators',
    description: 'Show user availability status with color-coded indicators.',
    code: `const online = createAvatar({ name: 'Online User', status: 'online' });
const busy = createAvatar({ name: 'Busy User', status: 'busy' });
const away = createAvatar({ name: 'Away User', status: 'away' });
const offline = createAvatar({ name: 'Offline User', status: 'offline' });`,
  });

  const statusExample = statusSection.querySelector('.dos-demo-section___examples');
  if (statusExample) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = 'var(--dos-spacing-xl)';
    wrapper.style.alignItems = 'flex-end';

    const statuses: AvatarStatus[] = ['online', 'busy', 'away', 'offline'];
    const names = ['Online User', 'Busy User', 'Away User', 'Offline User'];

    statuses.forEach((status, index) => {
      const container = document.createElement('div');
      container.style.textAlign = 'center';

      const avatar = createAvatar({
        name: names[index],
        status,
        size: 'large',
      });
      container.appendChild(avatar.element);

      const label = document.createElement('div');
      label.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      label.style.marginTop = 'var(--dos-spacing-sm)';
      label.style.fontSize = 'var(--dos-font-size-xs)';
      container.appendChild(label);

      wrapper.appendChild(container);
    });

    statusExample.appendChild(wrapper);
  }
  content.appendChild(statusSection);

  // Instance Methods Example
  const methodsSection = createDemoSection({
    title: 'Instance Methods',
    description: 'Control avatars programmatically with instance methods.',
    code: `const avatar = createAvatar({ name: 'John Doe' });

// Update name (recalculates initials)
avatar.setName('Jane Smith');

// Set custom initials
avatar.setInitials('XX');

// Change status
avatar.setStatus('online');
avatar.setStatus(undefined); // Remove status

// Get current state
console.log(avatar.getName()); // 'Jane Smith'
console.log(avatar.getInitials()); // 'XX'
console.log(avatar.getStatus()); // undefined

// Destroy
avatar.destroy();`,
  });

  const methodsExample = methodsSection.querySelector('.dos-demo-section___examples');
  if (methodsExample) {
    const demoAvatar = createAvatar({ name: 'Demo User', size: 'large' });

    const statusDiv = document.createElement('div');
    statusDiv.className = 'dos-demo-section___output';
    statusDiv.style.marginTop = 'var(--dos-spacing-md)';
    statusDiv.textContent = `Name: ${demoAvatar.getName()} | Initials: ${demoAvatar.getInitials()}`;

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.gap = 'var(--dos-spacing-sm)';
    buttonRow.style.flexWrap = 'wrap';
    buttonRow.style.marginTop = 'var(--dos-spacing-md)';

    const names = ['Alice Brown', 'Bob White', 'Carol Green', 'Dave Black'];
    let nameIndex = 0;

    const changeNameBtn = createButton({
      label: 'Change Name',
      onClick: () => {
        nameIndex = (nameIndex + 1) % names.length;
        demoAvatar.setName(names[nameIndex]);
        statusDiv.textContent = `Name: ${demoAvatar.getName()} | Initials: ${demoAvatar.getInitials()}`;
      },
    });

    const statuses: (AvatarStatus | undefined)[] = ['online', 'busy', 'away', 'offline', undefined];
    let statusIndex = 0;

    const cycleStatusBtn = createButton({
      label: 'Cycle Status',
      onClick: () => {
        statusIndex = (statusIndex + 1) % statuses.length;
        demoAvatar.setStatus(statuses[statusIndex]);
        statusDiv.textContent = `Name: ${demoAvatar.getName()} | Status: ${demoAvatar.getStatus() || 'none'}`;
      },
    });

    buttonRow.appendChild(changeNameBtn.element);
    buttonRow.appendChild(cycleStatusBtn.element);

    methodsExample.appendChild(demoAvatar.element);
    methodsExample.appendChild(statusDiv);
    methodsExample.appendChild(buttonRow);
  }
  content.appendChild(methodsSection);

  // User List Example
  const useCasesSection = createDemoSection({
    title: 'Common Use Cases',
    description: 'Examples of avatars in typical applications like user lists and comments.',
    code: `// User list with status
const users = [
  { name: 'John Doe', status: 'online' },
  { name: 'Jane Smith', status: 'busy' },
  { name: 'Bob Wilson', status: 'away' },
];

users.forEach(user => {
  const avatar = createAvatar({
    name: user.name,
    status: user.status,
    size: 'small',
  });
  // Append to user list...
});`,
  });

  const useCasesExample = useCasesSection.querySelector('.dos-demo-section___examples');
  if (useCasesExample) {
    // User list example
    const userList = document.createElement('div');
    userList.style.display = 'flex';
    userList.style.flexDirection = 'column';
    userList.style.gap = 'var(--dos-spacing-sm)';

    const users = [
      { name: 'John Doe', status: 'online' as AvatarStatus },
      { name: 'Jane Smith', status: 'busy' as AvatarStatus },
      { name: 'Bob Wilson', status: 'away' as AvatarStatus },
      { name: 'Alice Brown', status: 'offline' as AvatarStatus },
    ];

    users.forEach((user) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = 'var(--dos-spacing-sm)';

      const avatar = createAvatar({
        name: user.name,
        status: user.status,
        size: 'small',
      });
      row.appendChild(avatar.element);

      const nameEl = document.createElement('span');
      nameEl.textContent = user.name;
      row.appendChild(nameEl);

      userList.appendChild(row);
    });

    useCasesExample.appendChild(userList);
  }
  content.appendChild(useCasesSection);

  // Accessibility Example
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'Avatars include proper ARIA attributes for screen readers.',
    code: `// Avatar with accessible label
const avatar = createAvatar({
  name: 'John Doe',
  status: 'online',
});
// Announces: "John Doe, Online"

// Custom aria-label
const customLabel = createAvatar({
  name: 'John Doe',
  'aria-label': 'User John Doe is currently available',
});`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const ariaInfo = document.createElement('div');
    ariaInfo.innerHTML = `
      <table class="dos-table" style="margin-bottom: var(--dos-spacing-md);">
        <thead>
          <tr>
            <th>ARIA Attribute</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>role="img"</td><td>Identifies as an image to assistive tech</td></tr>
          <tr><td>aria-label</td><td>Announces user name (and status if present)</td></tr>
          <tr><td>aria-hidden="true"</td><td>Hides status indicator from AT</td></tr>
        </tbody>
      </table>
    `;

    const demoAvatar = createAvatar({
      name: 'John Doe',
      status: 'online',
      size: 'large',
    });

    a11yExample.appendChild(ariaInfo);
    a11yExample.appendChild(demoAvatar.element);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders placeholder for Card (not yet implemented)
 */
export function renderCardPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Card';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style content cards with header, body, and footer sections. Supports bordered, elevated, and interactive modes.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Section 1: Basic Card
  const basicSection = createDemoSection({
    title: '1. Basic Card',
    description: 'A simple card with header and content.'
  });

  const basicCard = createCard({
    header: 'Basic Card',
    content: 'This is a simple card with header and content sections. Cards are useful for grouping related information.'
  });

  basicSection.appendChild(basicCard.element);
  content.appendChild(basicSection);

  // Section 2: Card with Footer
  const footerSection = createDemoSection({
    title: '2. Card with Footer',
    description: 'Card with header, content, and footer actions.'
  });

  const footerActions = document.createElement('div');
  footerActions.style.display = 'flex';
  footerActions.style.gap = '8px';

  const saveBtn = createButton({ label: '[ Save ]', variant: 'primary' });
  const cancelBtn = createButton({ label: '[ Cancel ]', variant: 'secondary' });
  footerActions.appendChild(saveBtn.element);
  footerActions.appendChild(cancelBtn.element);

  const footerCard = createCard({
    header: 'Card with Actions',
    content: 'This card has action buttons in the footer section.',
    footer: footerActions
  });

  footerSection.appendChild(footerCard.element);
  content.appendChild(footerSection);

  // Section 3: Bordered vs Non-bordered
  const borderSection = createDemoSection({
    title: '3. Border Styles',
    description: 'Cards with and without borders.'
  });

  const borderWrapper = document.createElement('div');
  borderWrapper.style.display = 'flex';
  borderWrapper.style.gap = '16px';
  borderWrapper.style.flexWrap = 'wrap';

  const borderedCard = createCard({
    header: 'Bordered (Default)',
    content: 'This card has a visible border.',
    bordered: true
  });

  const nonBorderedCard = createCard({
    header: 'No Border',
    content: 'This card has no border.',
    bordered: false
  });

  borderWrapper.appendChild(borderedCard.element);
  borderWrapper.appendChild(nonBorderedCard.element);
  borderSection.appendChild(borderWrapper);
  content.appendChild(borderSection);

  // Section 4: Elevated Card
  const elevatedSection = createDemoSection({
    title: '4. Elevated Card',
    description: 'Card with DOS-style shadow effect.'
  });

  const elevatedCard = createCard({
    header: 'Elevated Card',
    content: 'This card has an elevated appearance with a shadow effect, creating depth on the page.',
    elevated: true
  });

  elevatedSection.appendChild(elevatedCard.element);
  content.appendChild(elevatedSection);

  // Section 5: Interactive Card
  const interactiveSection = createDemoSection({
    title: '5. Interactive Card',
    description: 'Clickable cards with keyboard support.'
  });

  const interactiveWrapper = document.createElement('div');
  interactiveWrapper.style.display = 'flex';
  interactiveWrapper.style.gap = '16px';
  interactiveWrapper.style.flexWrap = 'wrap';

  const interactiveCard = createCard({
    header: 'Click Me!',
    content: 'This card is clickable. Click or press Enter/Space when focused.',
    interactive: true,
    onClick: () => alert('Card clicked!')
  });

  // Selectable card demo
  const selectableCard = createCard({
    header: 'Selectable Card',
    content: 'Click to toggle selection state.',
    interactive: true,
    selected: false,
    onClick: () => selectableCard.setSelected(!selectableCard.isSelected())
  });

  interactiveWrapper.appendChild(interactiveCard.element);
  interactiveWrapper.appendChild(selectableCard.element);
  interactiveSection.appendChild(interactiveWrapper);
  content.appendChild(interactiveSection);

  // Section 6: Content-Only Cards
  const contentOnlySection = createDemoSection({
    title: '6. Content-Only Card',
    description: 'Minimal cards with just content.'
  });

  const contentOnlyCard = createCard({
    content: 'A simple note card without header or footer. Useful for displaying brief information.',
    bordered: true
  });

  contentOnlySection.appendChild(contentOnlyCard.element);
  content.appendChild(contentOnlySection);

  // Section 7: Card with HTML Content
  const htmlContentSection = createDemoSection({
    title: '7. Rich Content',
    description: 'Card with custom HTML content.'
  });

  const richContent = document.createElement('div');
  richContent.innerHTML = `
    <p style="margin: 0 0 8px 0;">╔════════════════════════════╗</p>
    <p style="margin: 0 0 8px 0;">║  <strong>File:</strong> README.TXT      ║</p>
    <p style="margin: 0 0 8px 0;">║  <strong>Size:</strong> 1,024 bytes     ║</p>
    <p style="margin: 0 0 8px 0;">║  <strong>Date:</strong> 01-15-2026      ║</p>
    <p style="margin: 0;">╚════════════════════════════╝</p>
  `;

  const htmlCard = createCard({
    header: 'File Properties',
    content: richContent,
    elevated: true
  });

  htmlContentSection.appendChild(htmlCard.element);
  content.appendChild(htmlContentSection);

  // Section 8: Instance Methods Demo
  const methodsSection = createDemoSection({
    title: '8. Instance Methods',
    description: 'Dynamically update card properties.'
  });

  const methodsCard = createCard({
    header: 'Dynamic Card',
    content: 'Use the buttons below to modify this card.',
    bordered: true,
    elevated: false
  });

  const methodsControls = document.createElement('div');
  methodsControls.style.display = 'flex';
  methodsControls.style.gap = '8px';
  methodsControls.style.flexWrap = 'wrap';
  methodsControls.style.marginTop = '16px';

  const toggleElevatedBtn = createButton({
    label: '[ Toggle Elevation ]',
    onClick: () => methodsCard.setElevated(!methodsCard.isElevated())
  });

  const toggleBorderBtn = createButton({
    label: '[ Toggle Border ]',
    onClick: () => methodsCard.setBordered(!methodsCard.isBordered())
  });

  const changeHeaderBtn = createButton({
    label: '[ Change Header ]',
    onClick: () => {
      const headers = ['Dynamic Card', 'Updated!', 'Changed Header', 'New Title'];
      const current = methodsCard.getHeader()?.textContent || '';
      const currentIndex = headers.indexOf(current);
      const nextIndex = (currentIndex + 1) % headers.length;
      methodsCard.setHeader(headers[nextIndex]);
    }
  });

  const addFooterBtn = createButton({
    label: '[ Toggle Footer ]',
    onClick: () => {
      if (methodsCard.getFooter()) {
        methodsCard.setFooter(undefined);
      } else {
        const footer = document.createElement('span');
        footer.textContent = 'Footer added dynamically';
        methodsCard.setFooter(footer);
      }
    }
  });

  methodsControls.appendChild(toggleElevatedBtn.element);
  methodsControls.appendChild(toggleBorderBtn.element);
  methodsControls.appendChild(changeHeaderBtn.element);
  methodsControls.appendChild(addFooterBtn.element);

  methodsSection.appendChild(methodsCard.element);
  methodsSection.appendChild(methodsControls);
  content.appendChild(methodsSection);

  // Section 9: Card Grid Layout
  const gridSection = createDemoSection({
    title: '9. Card Grid',
    description: 'Multiple cards in a grid layout.'
  });

  const cardGrid = document.createElement('div');
  cardGrid.style.display = 'grid';
  cardGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
  cardGrid.style.gap = '16px';

  const programs = [
    { name: 'EDIT.COM', desc: 'DOS Text Editor', type: 'Utility' },
    { name: 'DEBUG.EXE', desc: 'Assembly Debugger', type: 'Development' },
    { name: 'FORMAT.COM', desc: 'Disk Formatter', type: 'System' },
    { name: 'CHKDSK.EXE', desc: 'Disk Check', type: 'System' },
    { name: 'XCOPY.EXE', desc: 'Extended Copy', type: 'Utility' },
    { name: 'QBASIC.EXE', desc: 'BASIC IDE', type: 'Development' }
  ];

  programs.forEach(prog => {
    const card = createCard({
      header: prog.name,
      content: `${prog.desc}\n\nType: ${prog.type}`,
      bordered: true
    });
    cardGrid.appendChild(card.element);
  });

  gridSection.appendChild(cardGrid);
  content.appendChild(gridSection);

  // Section 10: Code Example
  const codeSection = createDemoSection({
    title: '10. Code Example',
    description: 'How to create cards programmatically.'
  });

  const codeBlock = document.createElement('pre');
  codeBlock.className = 'dos-code-block';
  codeBlock.textContent = `import { createCard, createButton } from 'dosage';

// Basic card
const card = createCard({
  header: 'Card Title',
  content: 'Card body content here.',
  bordered: true,
  elevated: true
});
document.body.appendChild(card.element);

// Card with footer actions
const footerEl = document.createElement('div');
const saveBtn = createButton({ label: '[ Save ]' });
footerEl.appendChild(saveBtn.element);

const actionCard = createCard({
  header: 'Action Card',
  content: 'Card with footer buttons.',
  footer: footerEl
});

// Interactive card
const clickableCard = createCard({
  header: 'Clickable Card',
  content: 'Click me!',
  interactive: true,
  onClick: () => console.log('Card clicked!')
});

// Instance methods
card.setHeader('New Header');
card.setElevated(true);
card.setSelected(true);  // For interactive cards

// Clean up
card.destroy();`;

  codeSection.appendChild(codeBlock);
  content.appendChild(codeSection);

  // Section 11: Accessibility
  const a11ySection = createDemoSection({
    title: '11. Accessibility',
    description: 'Card accessibility features.'
  });

  const a11yList = document.createElement('ul');
  a11yList.style.marginLeft = '20px';
  a11yList.innerHTML = `
    <li>Non-interactive cards use <code>role="article"</code></li>
    <li>Interactive cards use <code>role="button"</code></li>
    <li>Interactive cards are focusable with <code>tabindex="0"</code></li>
    <li>Header is used for <code>aria-labelledby</code> when present</li>
    <li>Custom <code>aria-label</code> can override automatic labeling</li>
    <li>Selected state uses <code>aria-pressed</code></li>
    <li>Keyboard: Enter/Space activates interactive cards</li>
    <li>Tab navigation moves between focusable elements</li>
  `;

  a11ySection.appendChild(a11yList);
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Timeline demo page
 */
export function renderTimelinePage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Timeline';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style timeline for displaying events with status indicators, connecting lines, and timestamps.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Section 1: Basic Timeline
  const basicSection = createDemoSection({
    title: '1. Basic Timeline',
    description: 'A simple vertical timeline with events.'
  });

  const basicEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'Project Started',
      description: 'Initial project setup completed',
      timestamp: '01/01/2026',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Development Phase',
      description: 'Active development in progress',
      timestamp: '01/15/2026',
      status: 'current'
    },
    {
      id: '3',
      title: 'Testing',
      description: 'Quality assurance testing',
      timestamp: '01/25/2026',
      status: 'upcoming'
    },
    {
      id: '4',
      title: 'Launch',
      timestamp: '02/01/2026',
      status: 'upcoming'
    }
  ];

  const basicTimeline = createTimeline({ events: basicEvents });
  basicSection.appendChild(basicTimeline.element);
  content.appendChild(basicSection);

  // Section 2: Status Indicators
  const statusSection = createDemoSection({
    title: '2. Status Indicators',
    description: 'Timeline events use different markers based on status: ● completed, ○ current, ◌ upcoming.'
  });

  const statusInfo = document.createElement('div');
  statusInfo.style.marginBottom = '16px';
  statusInfo.innerHTML = `
    <div style="margin-bottom: 8px;"><span style="color: #55FF55;">●</span> Completed - Task finished</div>
    <div style="margin-bottom: 8px;"><span style="color: #FFFF55;">○</span> Current - Currently active</div>
    <div><span style="color: #AAAAAA;">◌</span> Upcoming - Not yet started</div>
  `;
  statusSection.appendChild(statusInfo);
  content.appendChild(statusSection);

  // Section 3: Custom Icons
  const iconsSection = createDemoSection({
    title: '3. Custom Icons',
    description: 'Events can display custom icons instead of status markers.'
  });

  const iconEvents: TimelineEvent[] = [
    { id: '1', title: 'File Created', icon: '📄', timestamp: '01/01/2026', status: 'completed' },
    { id: '2', title: 'Code Written', icon: '💻', timestamp: '01/05/2026', status: 'completed' },
    { id: '3', title: 'Bug Fixed', icon: '🐛', timestamp: '01/10/2026', status: 'current' },
    { id: '4', title: 'Deployed', icon: '🚀', timestamp: '01/15/2026', status: 'upcoming' }
  ];

  const iconTimeline = createTimeline({ events: iconEvents });
  iconsSection.appendChild(iconTimeline.element);
  content.appendChild(iconsSection);

  // Section 4: Without Connectors
  const noConnectorSection = createDemoSection({
    title: '4. Without Connectors',
    description: 'Timeline can hide connecting lines between events.'
  });

  const noConnectorEvents: TimelineEvent[] = [
    { id: '1', title: 'Event A', timestamp: '10:00 AM', status: 'completed' },
    { id: '2', title: 'Event B', timestamp: '11:00 AM', status: 'current' },
    { id: '3', title: 'Event C', timestamp: '12:00 PM', status: 'upcoming' }
  ];

  const noConnectorTimeline = createTimeline({
    events: noConnectorEvents,
    showConnectors: false
  });
  noConnectorSection.appendChild(noConnectorTimeline.element);
  content.appendChild(noConnectorSection);

  // Section 5: DOS History Timeline
  const dosSection = createDemoSection({
    title: '5. DOS History',
    description: 'A timeline of MS-DOS releases.'
  });

  const dosHistory: TimelineEvent[] = [
    { id: '1', title: 'MS-DOS 1.0', description: 'Initial release for IBM PC', timestamp: '08/12/1981', status: 'completed' },
    { id: '2', title: 'MS-DOS 3.0', description: 'Introduced FAT16', timestamp: '08/14/1984', status: 'completed' },
    { id: '3', title: 'MS-DOS 5.0', description: 'Added QBASIC and EDIT', timestamp: '06/11/1991', status: 'completed' },
    { id: '4', title: 'MS-DOS 6.0', description: 'DoubleSpace compression', timestamp: '03/30/1993', status: 'completed' },
    { id: '5', title: 'Windows 95', description: 'DOS became underlying layer', timestamp: '08/24/1995', status: 'completed' }
  ];

  const dosTimeline = createTimeline({ events: dosHistory });
  dosSection.appendChild(dosTimeline.element);
  content.appendChild(dosSection);

  // Section 6: Instance Methods
  const methodsSection = createDemoSection({
    title: '6. Instance Methods',
    description: 'Dynamically add, remove, and update events.'
  });

  const methodsEvents: TimelineEvent[] = [
    { id: '1', title: 'Initial Event', status: 'completed' }
  ];

  const methodsTimeline = createTimeline({ events: methodsEvents });

  const methodsControls = document.createElement('div');
  methodsControls.style.display = 'flex';
  methodsControls.style.gap = '8px';
  methodsControls.style.flexWrap = 'wrap';
  methodsControls.style.marginTop = '16px';

  let eventCounter = 2;

  const addEventBtn = createButton({
    label: '[ Add Event ]',
    onClick: () => {
      methodsTimeline.addEvent({
        id: String(eventCounter),
        title: `Event ${eventCounter}`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'upcoming'
      });
      eventCounter++;
    }
  });

  const markCurrentBtn = createButton({
    label: '[ Mark Current ]',
    onClick: () => {
      const events = methodsTimeline.getEvents();
      const lastUpcoming = events.filter(e => e.status === 'upcoming')[0];
      if (lastUpcoming) {
        // First, mark all current as completed
        events.forEach(e => {
          if (e.status === 'current') {
            methodsTimeline.updateEvent(e.id, { status: 'completed' });
          }
        });
        methodsTimeline.updateEvent(lastUpcoming.id, { status: 'current' });
      }
    }
  });

  const clearBtn = createButton({
    label: '[ Clear All ]',
    onClick: () => {
      methodsTimeline.setEvents([]);
      eventCounter = 1;
    }
  });

  methodsControls.appendChild(addEventBtn.element);
  methodsControls.appendChild(markCurrentBtn.element);
  methodsControls.appendChild(clearBtn.element);

  methodsSection.appendChild(methodsTimeline.element);
  methodsSection.appendChild(methodsControls);
  content.appendChild(methodsSection);

  // Section 7: Custom Date Formatting
  const dateFormatSection = createDemoSection({
    title: '7. Custom Date Formatting',
    description: 'Use a custom function to format dates.'
  });

  const dateEvents: TimelineEvent[] = [
    { id: '1', title: 'Event 1', timestamp: new Date(2026, 0, 15), status: 'completed' },
    { id: '2', title: 'Event 2', timestamp: new Date(2026, 1, 20), status: 'current' },
    { id: '3', title: 'Event 3', timestamp: new Date(2026, 2, 25), status: 'upcoming' }
  ];

  const dateTimeline = createTimeline({
    events: dateEvents,
    formatDate: (date) => {
      if (date instanceof Date) {
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      }
      return date;
    }
  });

  dateFormatSection.appendChild(dateTimeline.element);
  content.appendChild(dateFormatSection);

  // Section 8: Code Example
  const codeSection = createDemoSection({
    title: '8. Code Example',
    description: 'How to create timelines programmatically.'
  });

  const codeBlock = document.createElement('pre');
  codeBlock.className = 'dos-code-block';
  codeBlock.textContent = `import { createTimeline } from 'dosage';
import type { TimelineEvent } from 'dosage';

// Define events
const events: TimelineEvent[] = [
  {
    id: '1',
    title: 'Task Started',
    description: 'Initial setup completed',
    timestamp: '01/01/2026',
    status: 'completed'
  },
  {
    id: '2',
    title: 'In Progress',
    description: 'Currently working on this',
    timestamp: '01/15/2026',
    status: 'current'
  },
  {
    id: '3',
    title: 'Future Task',
    timestamp: '02/01/2026',
    status: 'upcoming'
  }
];

// Create timeline
const timeline = createTimeline({
  events,
  orientation: 'vertical',  // or 'horizontal'
  showConnectors: true,
  'aria-label': 'Project timeline'
});

document.body.appendChild(timeline.element);

// Instance methods
timeline.addEvent({ id: '4', title: 'New Task', status: 'upcoming' });
timeline.updateEvent('2', { status: 'completed' });
timeline.removeEvent('3');

const current = timeline.getCurrentEvent();
console.log('Current task:', current?.title);`;

  codeSection.appendChild(codeBlock);
  content.appendChild(codeSection);

  // Section 9: Accessibility
  const a11ySection = createDemoSection({
    title: '9. Accessibility',
    description: 'Timeline accessibility features.'
  });

  const a11yList = document.createElement('ul');
  a11yList.style.marginLeft = '20px';
  a11yList.innerHTML = `
    <li>Uses <code>role="list"</code> for the timeline container</li>
    <li>Each event uses <code>role="listitem"</code></li>
    <li>Timestamps use semantic <code>&lt;time&gt;</code> elements</li>
    <li>Date timestamps include <code>datetime</code> attribute for machine readability</li>
    <li>Custom <code>aria-label</code> can describe the timeline's purpose</li>
    <li>Status markers provide visual differentiation</li>
  `;

  a11ySection.appendChild(a11yList);
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the EmptyState demo page
 */
export function renderEmptyStatePage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'EmptyState';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style empty state placeholders with ASCII art icons, titles, descriptions, and action buttons.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Section 1: Basic Empty State
  const basicSection = createDemoSection({
    title: '1. Basic Empty State',
    description: 'A simple empty state with just a title.'
  });

  const basicEmpty = createEmptyState({
    title: 'No data available'
  });

  basicSection.appendChild(basicEmpty.element);
  content.appendChild(basicSection);

  // Section 2: With Description
  const descSection = createDemoSection({
    title: '2. With Description',
    description: 'Empty state with title and description text.'
  });

  const descEmpty = createEmptyState({
    title: 'No files found',
    description: 'Try adjusting your search terms or check a different folder.'
  });

  descSection.appendChild(descEmpty.element);
  content.appendChild(descSection);

  // Section 3: Preset Icons
  const iconsSection = createDemoSection({
    title: '3. Preset Icons',
    description: 'Empty states with built-in ASCII art icons.'
  });

  const iconGrid = document.createElement('div');
  iconGrid.style.display = 'grid';
  iconGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
  iconGrid.style.gap = '24px';

  const presets: { preset: EmptyStateIconPreset; title: string }[] = [
    { preset: 'folder', title: 'Empty Folder' },
    { preset: 'search', title: 'No Results' },
    { preset: 'error', title: 'Error Occurred' },
    { preset: 'data', title: 'No Data' },
    { preset: 'file', title: 'File Not Found' }
  ];

  presets.forEach(({ preset, title }) => {
    const emptyState = createEmptyState({
      title,
      icon: preset,
      size: 'small'
    });
    emptyState.element.style.border = '1px solid #555';
    emptyState.element.style.padding = '16px';
    iconGrid.appendChild(emptyState.element);
  });

  iconsSection.appendChild(iconGrid);
  content.appendChild(iconsSection);

  // Section 4: With Action Button
  const actionSection = createDemoSection({
    title: '4. With Action Button',
    description: 'Empty state with an actionable button.'
  });

  const actionBtn = createButton({
    label: '[ Browse Files ]',
    onClick: () => alert('Browse files clicked!')
  });

  const actionEmpty = createEmptyState({
    title: 'No files selected',
    description: 'Select files to upload or browse your computer.',
    icon: 'folder',
    action: actionBtn.element
  });

  actionSection.appendChild(actionEmpty.element);
  content.appendChild(actionSection);

  // Section 5: Sizes
  const sizesSection = createDemoSection({
    title: '5. Size Variants',
    description: 'Empty states in small, medium, and large sizes.'
  });

  const sizesWrapper = document.createElement('div');
  sizesWrapper.style.display = 'flex';
  sizesWrapper.style.flexDirection = 'column';
  sizesWrapper.style.gap = '24px';

  const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
  sizes.forEach(size => {
    const sizeLabel = document.createElement('div');
    sizeLabel.style.color = '#AAAAAA';
    sizeLabel.textContent = `Size: ${size}`;
    
    const emptyState = createEmptyState({
      title: `${size.charAt(0).toUpperCase() + size.slice(1)} Empty State`,
      description: 'Description text goes here.',
      icon: 'file',
      size
    });
    emptyState.element.style.border = '1px dashed #555';

    const wrapper = document.createElement('div');
    wrapper.appendChild(sizeLabel);
    wrapper.appendChild(emptyState.element);
    sizesWrapper.appendChild(wrapper);
  });

  sizesSection.appendChild(sizesWrapper);
  content.appendChild(sizesSection);

  // Section 6: Custom ASCII Art
  const customSection = createDemoSection({
    title: '6. Custom ASCII Art',
    description: 'Empty state with custom ASCII art icon.'
  });

  const customArt = `
    ╔═══════════╗
    ║  404  ║
    ║ ¯\\_(ツ)_/¯ ║
    ╚═══════════╝
  `;

  const customEmpty = createEmptyState({
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
    icon: customArt
  });

  customSection.appendChild(customEmpty.element);
  content.appendChild(customSection);

  // Section 7: Error State
  const errorSection = createDemoSection({
    title: '7. Error State',
    description: 'Empty state for error situations.'
  });

  const retryBtn = createButton({
    label: '[ Retry ]',
    variant: 'primary',
    onClick: () => alert('Retrying...')
  });

  const errorEmpty = createEmptyState({
    title: 'Something went wrong',
    description: 'Unable to load data. Please check your connection and try again.',
    icon: 'error',
    action: retryBtn.element,
    size: 'large'
  });

  errorSection.appendChild(errorEmpty.element);
  content.appendChild(errorSection);

  // Section 8: Dynamic Empty State
  const dynamicSection = createDemoSection({
    title: '8. Dynamic Empty State',
    description: 'Empty state shown dynamically with screen reader announcement.'
  });

  const dynamicContainer = document.createElement('div');
  dynamicContainer.style.minHeight = '200px';
  dynamicContainer.style.border = '1px solid #555';
  dynamicContainer.style.padding = '16px';

  let isShowing = false;
  const toggleBtn = createButton({
    label: '[ Toggle Empty State ]',
    onClick: () => {
      isShowing = !isShowing;
      dynamicContainer.innerHTML = '';
      
      if (isShowing) {
        const dynamicEmpty = createEmptyState({
          title: 'Search Complete',
          description: 'No matching results found.',
          icon: 'search',
          dynamic: true
        });
        dynamicContainer.appendChild(dynamicEmpty.element);
      } else {
        dynamicContainer.innerHTML = '<p style="padding: 60px; text-align: center;">Click the button to show empty state</p>';
      }
    }
  });

  dynamicContainer.innerHTML = '<p style="padding: 60px; text-align: center;">Click the button to show empty state</p>';
  
  dynamicSection.appendChild(toggleBtn.element);
  dynamicSection.appendChild(document.createElement('br'));
  dynamicSection.appendChild(document.createElement('br'));
  dynamicSection.appendChild(dynamicContainer);
  content.appendChild(dynamicSection);

  // Section 9: Instance Methods
  const methodsSection = createDemoSection({
    title: '9. Instance Methods',
    description: 'Dynamically update empty state properties.'
  });

  const methodsEmpty = createEmptyState({
    title: 'Initial Title',
    description: 'Initial description text.',
    icon: 'folder',
    size: 'medium'
  });

  const methodsControls = document.createElement('div');
  methodsControls.style.display = 'flex';
  methodsControls.style.gap = '8px';
  methodsControls.style.flexWrap = 'wrap';
  methodsControls.style.marginTop = '16px';

  const changeIconBtn = createButton({
    label: '[ Change Icon ]',
    onClick: () => {
      const icons: EmptyStateIconPreset[] = ['folder', 'search', 'error', 'data', 'file'];
      const currentIndex = icons.indexOf(methodsEmpty.getSize() as unknown as EmptyStateIconPreset);
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      methodsEmpty.setIcon(randomIcon);
    }
  });

  const changeTitleBtn = createButton({
    label: '[ Change Title ]',
    onClick: () => {
      const titles = ['Updated Title', 'New Title', 'Changed!', 'Different Text'];
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      methodsEmpty.setTitle(randomTitle);
    }
  });

  const toggleDescBtn = createButton({
    label: '[ Toggle Description ]',
    onClick: () => {
      if (methodsEmpty.getDescription()) {
        methodsEmpty.setDescription(undefined);
      } else {
        methodsEmpty.setDescription('Description has been restored.');
      }
    }
  });

  const toggleActionBtn = createButton({
    label: '[ Toggle Action ]',
    onClick: () => {
      if (methodsEmpty.getAction()) {
        methodsEmpty.setAction(undefined);
      } else {
        const btn = createButton({ label: '[ Action Button ]' });
        methodsEmpty.setAction(btn.element);
      }
    }
  });

  methodsControls.appendChild(changeIconBtn.element);
  methodsControls.appendChild(changeTitleBtn.element);
  methodsControls.appendChild(toggleDescBtn.element);
  methodsControls.appendChild(toggleActionBtn.element);

  methodsSection.appendChild(methodsEmpty.element);
  methodsSection.appendChild(methodsControls);
  content.appendChild(methodsSection);

  // Section 10: Code Example
  const codeSection = createDemoSection({
    title: '10. Code Example',
    description: 'How to create empty states programmatically.'
  });

  const codeBlock = document.createElement('pre');
  codeBlock.className = 'dos-code-block';
  codeBlock.textContent = `import { createEmptyState, createButton } from 'dosage';

// Basic empty state
const emptyState = createEmptyState({
  title: 'No data available',
  description: 'Try adjusting your filters.',
  icon: 'folder',
  size: 'medium'
});
document.body.appendChild(emptyState.element);

// With action button
const button = createButton({
  label: '[ Browse Files ]',
  onClick: () => console.log('Browse clicked')
});

const actionEmpty = createEmptyState({
  title: 'No files selected',
  description: 'Select files to continue.',
  icon: 'file',
  action: button.element
});

// Dynamic empty state (announces to screen readers)
const dynamicEmpty = createEmptyState({
  title: 'Search Complete',
  description: 'No results found.',
  icon: 'search',
  dynamic: true  // Adds role="status" and aria-live="polite"
});

// Custom ASCII art icon
const customEmpty = createEmptyState({
  title: 'Custom Icon',
  icon: \`
    [X]
   /   \\\\
  \`
});

// Instance methods
emptyState.setTitle('New Title');
emptyState.setDescription('New description');
emptyState.setIcon('error');
emptyState.setSize('large');
emptyState.focusAction();  // Focus the action button
emptyState.destroy();`;

  codeSection.appendChild(codeBlock);
  content.appendChild(codeSection);

  // Section 11: Accessibility
  const a11ySection = createDemoSection({
    title: '11. Accessibility',
    description: 'EmptyState accessibility features.'
  });

  const a11yList = document.createElement('ul');
  a11yList.style.marginLeft = '20px';
  a11yList.innerHTML = `
    <li>Icons are hidden from screen readers (<code>aria-hidden="true"</code>)</li>
    <li>Title and description are read by screen readers</li>
    <li>Dynamic empty states use <code>role="status"</code> and <code>aria-live="polite"</code></li>
    <li>Action buttons are focusable and announced</li>
    <li>Custom <code>aria-label</code> can override default labeling</li>
    <li><code>focusAction()</code> method helps manage focus programmatically</li>
  `;

  a11ySection.appendChild(a11yList);
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}
