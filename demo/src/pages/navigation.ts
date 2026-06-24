/**
 * Navigation Components Page
 *
 * Demonstrates MenuBar, DropdownMenu, ContextMenu, Sidebar, Breadcrumbs and other navigation components.
 */

import { createDemoSection } from '../components/DemoSection';
import { createMenuBar, createDropdownMenu, createContextMenu, createSidebar, createBreadcrumbs, createPagination, createStepper, createButton } from 'dosage';
import type { MenuBarItem, DropdownMenuItem, SidebarItem, BreadcrumbItem, Step } from 'dosage';

/**
 * Renders the MenuBar demo page
 */
export function renderMenuBarPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'MenuBar';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent =
    'DOS-style horizontal menu bar with dropdown menus, keyboard navigation, and Alt+key shortcuts.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic MenuBar',
    description: 'A classic DOS-style menu bar with File, Edit, and View menus.',
    code: `import { createMenuBar } from 'dosage';

const menuBar = createMenuBar({
  items: [
    {
      label: 'File',
      accessKey: 'F',
      items: [
        { label: 'New', shortcut: 'Ctrl+N', action: () => console.log('New') },
        { label: 'Open', shortcut: 'Ctrl+O', action: () => console.log('Open') },
        { label: 'Save', shortcut: 'Ctrl+S', action: () => console.log('Save') },
        { divider: true },
        { label: 'Exit', shortcut: 'Alt+F4', action: () => console.log('Exit') }
      ]
    },
    {
      label: 'Edit',
      accessKey: 'E',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z' },
        { label: 'Redo', shortcut: 'Ctrl+Y' },
        { divider: true },
        { label: 'Cut', shortcut: 'Ctrl+X' },
        { label: 'Copy', shortcut: 'Ctrl+C' },
        { label: 'Paste', shortcut: 'Ctrl+V' }
      ]
    },
    {
      label: 'View',
      items: [
        { label: 'Zoom In', shortcut: 'Ctrl++' },
        { label: 'Zoom Out', shortcut: 'Ctrl+-' },
        { divider: true },
        { label: 'Full Screen', shortcut: 'F11' }
      ]
    }
  ],
  onSelect: (item, path) => console.log('Selected:', path.join(' > '))
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const statusBar = document.createElement('div');
    statusBar.style.marginBottom = 'var(--dos-space-md)';
    statusBar.style.padding = 'var(--dos-space-xs) var(--dos-space-sm)';
    statusBar.style.backgroundColor = 'var(--dos-surface-tertiary)';
    statusBar.style.fontFamily = 'var(--dos-font-family)';
    statusBar.textContent = 'Selected: (none)';

    const basicItems: MenuBarItem[] = [
      {
        label: 'File',
        accessKey: 'F',
        items: [
          { label: 'New', shortcut: 'Ctrl+N', action: () => (statusBar.textContent = 'Action: New file') },
          { label: 'Open', shortcut: 'Ctrl+O', action: () => (statusBar.textContent = 'Action: Open file') },
          { label: 'Save', shortcut: 'Ctrl+S', action: () => (statusBar.textContent = 'Action: Save file') },
          { divider: true },
          { label: 'Exit', shortcut: 'Alt+F4', action: () => (statusBar.textContent = 'Action: Exit') },
        ],
      },
      {
        label: 'Edit',
        accessKey: 'E',
        items: [
          { label: 'Undo', shortcut: 'Ctrl+Z', action: () => (statusBar.textContent = 'Action: Undo') },
          { label: 'Redo', shortcut: 'Ctrl+Y', action: () => (statusBar.textContent = 'Action: Redo') },
          { divider: true },
          { label: 'Cut', shortcut: 'Ctrl+X', action: () => (statusBar.textContent = 'Action: Cut') },
          { label: 'Copy', shortcut: 'Ctrl+C', action: () => (statusBar.textContent = 'Action: Copy') },
          { label: 'Paste', shortcut: 'Ctrl+V', action: () => (statusBar.textContent = 'Action: Paste') },
        ],
      },
      {
        label: 'View',
        items: [
          { label: 'Zoom In', shortcut: 'Ctrl++', action: () => (statusBar.textContent = 'Action: Zoom In') },
          { label: 'Zoom Out', shortcut: 'Ctrl+-', action: () => (statusBar.textContent = 'Action: Zoom Out') },
          { divider: true },
          { label: 'Full Screen', shortcut: 'F11', action: () => (statusBar.textContent = 'Action: Full Screen') },
        ],
      },
    ];

    const menuBar = createMenuBar({
      items: basicItems,
      onSelect: (item, path) => {
        statusBar.textContent = `Selected: ${path.join(' > ')}`;
      },
    });

    basicExample.appendChild(menuBar);
    basicExample.appendChild(statusBar);
  }
  content.appendChild(basicSection);

  // With Submenus
  const submenuSection = createDemoSection({
    title: 'Nested Submenus',
    description: 'Menu items can have nested submenus for hierarchical navigation.',
    code: `const menuBar = createMenuBar({
  items: [
    {
      label: 'Options',
      items: [
        { label: 'General' },
        {
          label: 'Advanced',
          children: [
            { label: 'Debug Mode' },
            { label: 'Performance' },
            {
              label: 'More...',
              children: [
                { label: 'Option A' },
                { label: 'Option B' }
              ]
            }
          ]
        }
      ]
    }
  ]
});`,
  });

  const submenuExample = submenuSection.querySelector('.dos-demo-section___examples');
  if (submenuExample) {
    const statusBar = document.createElement('div');
    statusBar.style.marginBottom = 'var(--dos-space-md)';
    statusBar.style.padding = 'var(--dos-space-xs) var(--dos-space-sm)';
    statusBar.style.backgroundColor = 'var(--dos-surface-tertiary)';
    statusBar.style.fontFamily = 'var(--dos-font-family)';
    statusBar.textContent = 'Selected: (none)';

    const submenuItems: MenuBarItem[] = [
      {
        label: 'Options',
        accessKey: 'O',
        items: [
          { label: 'General', action: () => (statusBar.textContent = 'Selected: General') },
          {
            label: 'Advanced',
            children: [
              { label: 'Debug Mode', action: () => (statusBar.textContent = 'Selected: Debug Mode') },
              { label: 'Performance', action: () => (statusBar.textContent = 'Selected: Performance') },
              {
                label: 'More...',
                children: [
                  { label: 'Option A', action: () => (statusBar.textContent = 'Selected: Option A') },
                  { label: 'Option B', action: () => (statusBar.textContent = 'Selected: Option B') },
                ],
              },
            ],
          },
          { divider: true },
          { label: 'Reset', action: () => (statusBar.textContent = 'Selected: Reset') },
        ],
      },
      {
        label: 'Help',
        accessKey: 'H',
        items: [
          { label: 'Documentation', action: () => (statusBar.textContent = 'Selected: Documentation') },
          { label: 'About', action: () => (statusBar.textContent = 'Selected: About') },
        ],
      },
    ];

    const menuBar = createMenuBar({
      items: submenuItems,
      onSelect: (item, path) => {
        statusBar.textContent = `Selected: ${path.join(' > ')}`;
      },
    });

    submenuExample.appendChild(menuBar);
    submenuExample.appendChild(statusBar);
  }
  content.appendChild(submenuSection);

  // With Icons
  const iconsSection = createDemoSection({
    title: 'Menu Items with Icons',
    description: 'Menu items can display icons using ASCII characters or symbols.',
    code: `const menuBar = createMenuBar({
  items: [
    {
      label: 'File',
      items: [
        { label: 'New', icon: '📄', shortcut: 'Ctrl+N' },
        { label: 'Open', icon: '📂', shortcut: 'Ctrl+O' },
        { label: 'Save', icon: '💾', shortcut: 'Ctrl+S' },
        { divider: true },
        { label: 'Print', icon: '🖨️', shortcut: 'Ctrl+P' }
      ]
    }
  ]
});`,
  });

  const iconsExample = iconsSection.querySelector('.dos-demo-section___examples');
  if (iconsExample) {
    const iconItems: MenuBarItem[] = [
      {
        label: 'File',
        accessKey: 'F',
        items: [
          { label: 'New', icon: '📄', shortcut: 'Ctrl+N' },
          { label: 'Open', icon: '📂', shortcut: 'Ctrl+O' },
          { label: 'Save', icon: '💾', shortcut: 'Ctrl+S' },
          { divider: true },
          { label: 'Print', icon: '🖨️', shortcut: 'Ctrl+P' },
        ],
      },
      {
        label: 'Edit',
        accessKey: 'E',
        items: [
          { label: 'Undo', icon: '↩️', shortcut: 'Ctrl+Z' },
          { label: 'Redo', icon: '↪️', shortcut: 'Ctrl+Y' },
          { divider: true },
          { label: 'Find', icon: '🔍', shortcut: 'Ctrl+F' },
          { label: 'Replace', icon: '🔄', shortcut: 'Ctrl+H' },
        ],
      },
    ];

    const menuBar = createMenuBar({ items: iconItems });
    iconsExample.appendChild(menuBar);
  }
  content.appendChild(iconsSection);

  // Disabled Items
  const disabledSection = createDemoSection({
    title: 'Disabled Items',
    description: 'Menu items and entire menus can be disabled.',
    code: `const menuBar = createMenuBar({
  items: [
    {
      label: 'File',
      items: [
        { label: 'New' },
        { label: 'Open' },
        { label: 'Save', disabled: true },  // Disabled item
        { divider: true },
        { label: 'Export', disabled: true }
      ]
    },
    {
      label: 'Edit',
      disabled: true  // Entire menu disabled
    }
  ]
});`,
  });

  const disabledExample = disabledSection.querySelector('.dos-demo-section___examples');
  if (disabledExample) {
    const disabledItems: MenuBarItem[] = [
      {
        label: 'File',
        accessKey: 'F',
        items: [
          { label: 'New' },
          { label: 'Open' },
          { label: 'Save', disabled: true },
          { divider: true },
          { label: 'Export', disabled: true },
        ],
      },
      {
        label: 'Edit',
        disabled: true,
        items: [
          { label: 'Cut' },
          { label: 'Copy' },
          { label: 'Paste' },
        ],
      },
      {
        label: 'View',
        items: [{ label: 'Refresh' }, { label: 'Settings' }],
      },
    ];

    const menuBar = createMenuBar({ items: disabledItems });
    disabledExample.appendChild(menuBar);
  }
  content.appendChild(disabledSection);

  // Keyboard Navigation
  const keyboardSection = createDemoSection({
    title: 'Keyboard Navigation',
    description: 'Full keyboard support for accessibility.',
    code: `// Keyboard shortcuts:
// - Tab/Shift+Tab: Navigate between menu triggers
// - Enter/Space/ArrowDown: Open dropdown
// - ArrowLeft/Right: Navigate between menus
// - ArrowUp/Down: Navigate within dropdown
// - Home/End: Jump to first/last item
// - Escape: Close dropdown
// - Alt+Key: Open menu by access key (e.g., Alt+F for File)
// - Type letters: Jump to matching menu item`,
  });

  const keyboardExample = keyboardSection.querySelector('.dos-demo-section___examples');
  if (keyboardExample) {
    const instructions = document.createElement('div');
    instructions.style.fontFamily = 'var(--dos-font-family)';
    instructions.style.marginBottom = 'var(--dos-space-md)';
    instructions.innerHTML = `
      <p style="margin-bottom: var(--dos-space-sm);">Try these keyboard shortcuts:</p>
      <ul style="list-style: none; padding-left: 0;">
        <li>• <strong>Alt+F</strong> - Open File menu</li>
        <li>• <strong>Alt+E</strong> - Open Edit menu</li>
        <li>• <strong>↑/↓</strong> - Navigate menu items</li>
        <li>• <strong>←/→</strong> - Switch menus</li>
        <li>• <strong>Enter</strong> - Select item</li>
        <li>• <strong>Escape</strong> - Close menu</li>
      </ul>
    `;

    const keyboardItems: MenuBarItem[] = [
      {
        label: 'File',
        accessKey: 'F',
        items: [
          { label: 'New', shortcut: 'Ctrl+N' },
          { label: 'Open', shortcut: 'Ctrl+O' },
          { label: 'Save', shortcut: 'Ctrl+S' },
        ],
      },
      {
        label: 'Edit',
        accessKey: 'E',
        items: [
          { label: 'Cut', shortcut: 'Ctrl+X' },
          { label: 'Copy', shortcut: 'Ctrl+C' },
          { label: 'Paste', shortcut: 'Ctrl+V' },
        ],
      },
      {
        label: 'Search',
        accessKey: 'S',
        items: [
          { label: 'Find', shortcut: 'Ctrl+F' },
          { label: 'Replace', shortcut: 'Ctrl+H' },
          { label: 'Go to Line', shortcut: 'Ctrl+G' },
        ],
      },
    ];

    const menuBar = createMenuBar({ items: keyboardItems });

    keyboardExample.appendChild(instructions);
    keyboardExample.appendChild(menuBar);
  }
  content.appendChild(keyboardSection);

  // API Methods
  const apiSection = createDemoSection({
    title: 'Programmatic Control',
    description: 'Control the menu bar programmatically using its API methods.',
    code: `const menuBar = createMenuBar({ items: [...] });

// Open a specific menu
menuBar.openMenu('File');

// Close the current menu
menuBar.closeMenu();

// Get the currently open menu
const openMenu = menuBar.getOpenMenu(); // 'File' or null

// Update menu items dynamically
menuBar.setItems(newItems);

// Enable/disable a menu
menuBar.setMenuDisabled('Edit', true);

// Enable/disable a menu item
menuBar.setItemDisabled(['File', 'Save'], true);

// Clean up event listeners
menuBar.destroy();`,
  });

  const apiExample = apiSection.querySelector('.dos-demo-section___examples');
  if (apiExample) {
    const controlPanel = document.createElement('div');
    controlPanel.style.display = 'flex';
    controlPanel.style.flexWrap = 'wrap';
    controlPanel.style.gap = 'var(--dos-space-sm)';
    controlPanel.style.marginBottom = 'var(--dos-space-md)';

    const apiItems: MenuBarItem[] = [
      {
        label: 'File',
        accessKey: 'F',
        items: [
          { label: 'New' },
          { label: 'Open' },
          { label: 'Save' },
        ],
      },
      {
        label: 'Edit',
        accessKey: 'E',
        items: [
          { label: 'Cut' },
          { label: 'Copy' },
          { label: 'Paste' },
        ],
      },
    ];

    const menuBar = createMenuBar({ items: apiItems });

    // Create control buttons
    const createControlButton = (label: string, onClick: () => void) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.fontFamily = 'var(--dos-font-family)';
      btn.style.padding = 'var(--dos-space-xs) var(--dos-space-sm)';
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', onClick);
      return btn;
    };

    controlPanel.appendChild(
      createControlButton('Open File Menu', () => menuBar.openMenu('File'))
    );
    controlPanel.appendChild(
      createControlButton('Open Edit Menu', () => menuBar.openMenu('Edit'))
    );
    controlPanel.appendChild(
      createControlButton('Close Menu', () => menuBar.closeMenu())
    );
    controlPanel.appendChild(
      createControlButton('Disable Edit', () => menuBar.setMenuDisabled('Edit', true))
    );
    controlPanel.appendChild(
      createControlButton('Enable Edit', () => menuBar.setMenuDisabled('Edit', false))
    );
    controlPanel.appendChild(
      createControlButton('Disable Save', () => menuBar.setItemDisabled(['File', 'Save'], true))
    );
    controlPanel.appendChild(
      createControlButton('Enable Save', () => menuBar.setItemDisabled(['File', 'Save'], false))
    );

    apiExample.appendChild(controlPanel);
    apiExample.appendChild(menuBar);
  }
  content.appendChild(apiSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'The MenuBar component follows WAI-ARIA menu bar patterns.',
    code: `// ARIA attributes are automatically set:
// - role="menubar" on the container
// - role="menuitem" on triggers and items
// - aria-haspopup="menu" on triggers
// - aria-expanded on triggers (true/false)
// - role="menu" on dropdowns
// - aria-disabled on disabled items
// - tabindex management for keyboard navigation

// Access key underlines are shown with <u> tags
// Alt+key shortcuts work for menu access`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const a11yInfo = document.createElement('div');
    a11yInfo.style.fontFamily = 'var(--dos-font-family)';
    a11yInfo.innerHTML = `
      <p style="margin-bottom: var(--dos-space-sm);">This component implements:</p>
      <ul style="margin-bottom: var(--dos-space-md);">
        <li>✓ WAI-ARIA menubar pattern</li>
        <li>✓ Keyboard navigation</li>
        <li>✓ Focus management</li>
        <li>✓ Screen reader announcements</li>
        <li>✓ Access key underlines</li>
        <li>✓ Alt+key shortcuts</li>
      </ul>
    `;

    const a11yItems: MenuBarItem[] = [
      {
        label: 'File',
        accessKey: 'F',
        items: [
          { label: 'New', shortcut: 'Ctrl+N' },
          { label: 'Open', shortcut: 'Ctrl+O' },
        ],
      },
      {
        label: 'Edit',
        accessKey: 'E',
        items: [
          { label: 'Undo', shortcut: 'Ctrl+Z' },
          { label: 'Redo', shortcut: 'Ctrl+Y' },
        ],
      },
    ];

    const menuBar = createMenuBar({ items: a11yItems });

    a11yExample.appendChild(a11yInfo);
    a11yExample.appendChild(menuBar);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the DropdownMenu demo page
 */
export function renderDropdownMenuPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'DropdownMenu';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent =
    'A DOS-style dropdown menu with submenus, icons, shortcuts, and full keyboard navigation.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic Dropdown',
    description: 'A simple dropdown menu triggered by a button click.',
    code: `import { createDropdownMenu, createButton } from 'dosage';

const button = createButton({ label: 'Actions ▼', variant: 'secondary' });
document.body.appendChild(button);

const dropdown = createDropdownMenu({
  items: [
    { label: 'New', shortcut: 'Ctrl+N', action: () => console.log('New') },
    { label: 'Open', shortcut: 'Ctrl+O', action: () => console.log('Open') },
    { divider: true },
    { label: 'Save', shortcut: 'Ctrl+S', action: () => console.log('Save') },
    { label: 'Save As...', action: () => console.log('Save As') },
    { divider: true },
    { label: 'Exit', shortcut: 'Alt+F4', action: () => console.log('Exit') }
  ],
  trigger: button,
  onSelect: (item, path) => console.log('Selected:', path.join(' > '))
});

document.body.appendChild(dropdown);`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const statusBar = document.createElement('div');
    statusBar.style.marginBottom = 'var(--dos-space-md)';
    statusBar.style.padding = 'var(--dos-space-xs) var(--dos-space-sm)';
    statusBar.style.backgroundColor = 'var(--dos-surface-tertiary)';
    statusBar.style.fontFamily = 'var(--dos-font-family)';
    statusBar.textContent = 'Selected: (none)';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'relative';
    buttonContainer.style.marginBottom = 'var(--dos-space-md)';

    const button = createButton({ label: 'Actions ▼', variant: 'secondary' });
    buttonContainer.appendChild(button);

    const basicItems: DropdownMenuItem[] = [
      { label: 'New', shortcut: 'Ctrl+N', action: () => (statusBar.textContent = 'Action: New') },
      { label: 'Open', shortcut: 'Ctrl+O', action: () => (statusBar.textContent = 'Action: Open') },
      { divider: true, label: '' },
      { label: 'Save', shortcut: 'Ctrl+S', action: () => (statusBar.textContent = 'Action: Save') },
      { label: 'Save As...', action: () => (statusBar.textContent = 'Action: Save As') },
      { divider: true, label: '' },
      { label: 'Exit', shortcut: 'Alt+F4', action: () => (statusBar.textContent = 'Action: Exit') },
    ];

    const dropdown = createDropdownMenu({
      items: basicItems,
      trigger: button,
      onSelect: (item, path) => {
        statusBar.textContent = `Selected: ${path.join(' > ')}`;
      },
    });

    buttonContainer.appendChild(dropdown);
    basicExample.appendChild(buttonContainer);
    basicExample.appendChild(statusBar);
  }
  content.appendChild(basicSection);

  // With Icons
  const iconsSection = createDemoSection({
    title: 'With Icons',
    description: 'Menu items can display icons alongside their labels.',
    code: `const dropdown = createDropdownMenu({
  items: [
    { label: 'Cut', icon: '✂', shortcut: 'Ctrl+X' },
    { label: 'Copy', icon: '📋', shortcut: 'Ctrl+C' },
    { label: 'Paste', icon: '📄', shortcut: 'Ctrl+V' },
    { divider: true },
    { label: 'Delete', icon: '✗', shortcut: 'Del' }
  ],
  trigger: editButton
});`,
  });

  const iconsExample = iconsSection.querySelector('.dos-demo-section___examples');
  if (iconsExample) {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'relative';
    buttonContainer.style.marginBottom = 'var(--dos-space-md)';

    const button = createButton({ label: 'Edit ▼', variant: 'secondary' });
    buttonContainer.appendChild(button);

    const statusBar = document.createElement('div');
    statusBar.style.marginBottom = 'var(--dos-space-md)';
    statusBar.style.padding = 'var(--dos-space-xs) var(--dos-space-sm)';
    statusBar.style.backgroundColor = 'var(--dos-surface-tertiary)';
    statusBar.style.fontFamily = 'var(--dos-font-family)';
    statusBar.textContent = 'Selected: (none)';

    const iconItems: DropdownMenuItem[] = [
      { label: 'Cut', icon: '✂', shortcut: 'Ctrl+X', action: () => (statusBar.textContent = 'Action: Cut') },
      { label: 'Copy', icon: '📋', shortcut: 'Ctrl+C', action: () => (statusBar.textContent = 'Action: Copy') },
      { label: 'Paste', icon: '📄', shortcut: 'Ctrl+V', action: () => (statusBar.textContent = 'Action: Paste') },
      { divider: true, label: '' },
      { label: 'Delete', icon: '✗', shortcut: 'Del', action: () => (statusBar.textContent = 'Action: Delete') },
    ];

    const dropdown = createDropdownMenu({
      items: iconItems,
      trigger: button,
      onSelect: (item, path) => {
        statusBar.textContent = `Selected: ${path.join(' > ')}`;
      },
    });

    buttonContainer.appendChild(dropdown);
    iconsExample.appendChild(buttonContainer);
    iconsExample.appendChild(statusBar);
  }
  content.appendChild(iconsSection);

  // Nested Submenus
  const submenuSection = createDemoSection({
    title: 'Nested Submenus',
    description: 'Menu items can have nested submenus for hierarchical navigation.',
    code: `const dropdown = createDropdownMenu({
  items: [
    {
      label: 'Export',
      items: [
        { label: 'As PDF' },
        { label: 'As HTML' },
        {
          label: 'As Image',
          items: [
            { label: 'PNG' },
            { label: 'JPEG' },
            { label: 'GIF' }
          ]
        }
      ]
    },
    { divider: true },
    { label: 'Print...' }
  ],
  trigger: exportButton
});`,
  });

  const submenuExample = submenuSection.querySelector('.dos-demo-section___examples');
  if (submenuExample) {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'relative';
    buttonContainer.style.marginBottom = 'var(--dos-space-md)';

    const button = createButton({ label: 'Export ▼', variant: 'secondary' });
    buttonContainer.appendChild(button);

    const statusBar = document.createElement('div');
    statusBar.style.marginBottom = 'var(--dos-space-md)';
    statusBar.style.padding = 'var(--dos-space-xs) var(--dos-space-sm)';
    statusBar.style.backgroundColor = 'var(--dos-surface-tertiary)';
    statusBar.style.fontFamily = 'var(--dos-font-family)';
    statusBar.textContent = 'Selected: (none)';

    const submenuItems: DropdownMenuItem[] = [
      {
        label: 'Export',
        items: [
          { label: 'As PDF', action: () => (statusBar.textContent = 'Export: PDF') },
          { label: 'As HTML', action: () => (statusBar.textContent = 'Export: HTML') },
          {
            label: 'As Image',
            items: [
              { label: 'PNG', action: () => (statusBar.textContent = 'Export: PNG') },
              { label: 'JPEG', action: () => (statusBar.textContent = 'Export: JPEG') },
              { label: 'GIF', action: () => (statusBar.textContent = 'Export: GIF') },
            ],
          },
        ],
      },
      { divider: true, label: '' },
      { label: 'Print...', shortcut: 'Ctrl+P', action: () => (statusBar.textContent = 'Action: Print') },
    ];

    const dropdown = createDropdownMenu({
      items: submenuItems,
      trigger: button,
      onSelect: (item, path) => {
        statusBar.textContent = `Selected: ${path.join(' > ')}`;
      },
    });

    buttonContainer.appendChild(dropdown);
    submenuExample.appendChild(buttonContainer);
    submenuExample.appendChild(statusBar);
  }
  content.appendChild(submenuSection);

  // Programmatic Control
  const apiSection = createDemoSection({
    title: 'Programmatic Control',
    description: 'Use the API methods to control the dropdown programmatically.',
    code: `// Create dropdown
const dropdown = createDropdownMenu({
  items: [...],
  trigger: button
});

// Open the dropdown
dropdown.open();

// Close the dropdown
dropdown.close();

// Toggle open/closed
dropdown.toggle();

// Check if open
const isOpen = dropdown.isOpen();

// Update items
dropdown.setItems(newItems);

// Disable an item by path
dropdown.setItemDisabled(['Export', 'As PDF'], true);

// Change position
dropdown.setPosition('bottom-end');

// Clean up
dropdown.destroy();`,
  });

  const apiExample = apiSection.querySelector('.dos-demo-section___examples');
  if (apiExample) {
    const controlPanel = document.createElement('div');
    controlPanel.style.display = 'flex';
    controlPanel.style.flexWrap = 'wrap';
    controlPanel.style.gap = 'var(--dos-space-sm)';
    controlPanel.style.marginBottom = 'var(--dos-space-md)';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'relative';
    buttonContainer.style.marginBottom = 'var(--dos-space-md)';

    const triggerBtn = createButton({ label: 'Menu ▼', variant: 'secondary' });
    buttonContainer.appendChild(triggerBtn);

    const apiItems: DropdownMenuItem[] = [
      { label: 'Option 1', action: () => {} },
      { label: 'Option 2', action: () => {} },
      { label: 'Option 3 (disable me)', action: () => {} },
    ];

    const dropdown = createDropdownMenu({
      items: apiItems,
      trigger: triggerBtn,
    });

    buttonContainer.appendChild(dropdown);

    // Create control buttons
    const createControlButton = (label: string, onClick: () => void) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.fontFamily = 'var(--dos-font-family)';
      btn.style.padding = 'var(--dos-space-xs) var(--dos-space-sm)';
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling to document
        onClick();
      });
      return btn;
    };

    controlPanel.appendChild(createControlButton('Open', () => dropdown.open()));
    controlPanel.appendChild(createControlButton('Close', () => dropdown.close()));
    controlPanel.appendChild(createControlButton('Toggle', () => dropdown.toggle()));
    controlPanel.appendChild(
      createControlButton('Disable Option 3', () => dropdown.setItemDisabled(['Option 3 (disable me)'], true))
    );
    controlPanel.appendChild(
      createControlButton('Enable Option 3', () => dropdown.setItemDisabled(['Option 3 (disable me)'], false))
    );

    apiExample.appendChild(controlPanel);
    apiExample.appendChild(buttonContainer);
  }
  content.appendChild(apiSection);

  // Keyboard Navigation
  const keyboardSection = createDemoSection({
    title: 'Keyboard Navigation',
    description: 'Full keyboard support for navigating the dropdown menu.',
    code: `// Keyboard shortcuts:
// Enter / Space - Open dropdown, select item
// ArrowDown     - Open dropdown, move to next item
// ArrowUp       - Open dropdown (to last), move to previous item
// ArrowRight    - Open submenu
// ArrowLeft     - Close submenu
// Home          - Jump to first item
// End           - Jump to last item
// Escape        - Close dropdown
// Type-ahead    - Jump to item starting with typed character`,
  });

  const keyboardExample = keyboardSection.querySelector('.dos-demo-section___examples');
  if (keyboardExample) {
    const info = document.createElement('div');
    info.style.fontFamily = 'var(--dos-font-family)';
    info.innerHTML = `
      <p style="margin-bottom: var(--dos-space-sm);">Try these keyboard shortcuts:</p>
      <ul style="margin-bottom: var(--dos-space-md);">
        <li><strong>Enter/Space</strong> - Open menu or select item</li>
        <li><strong>↑↓</strong> - Navigate up/down</li>
        <li><strong>→</strong> - Open submenu</li>
        <li><strong>←</strong> - Close submenu</li>
        <li><strong>Home/End</strong> - Jump to first/last</li>
        <li><strong>Escape</strong> - Close menu</li>
        <li><strong>Type letter</strong> - Jump to matching item</li>
      </ul>
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'relative';
    buttonContainer.style.marginBottom = 'var(--dos-space-md)';

    const button = createButton({ label: 'Try Keyboard ▼', variant: 'secondary' });
    buttonContainer.appendChild(button);

    const keyboardItems: DropdownMenuItem[] = [
      { label: 'Apple' },
      { label: 'Banana' },
      { label: 'Cherry' },
      { label: 'Date' },
      {
        label: 'More Fruits',
        items: [
          { label: 'Elderberry' },
          { label: 'Fig' },
          { label: 'Grape' },
        ],
      },
    ];

    const dropdown = createDropdownMenu({
      items: keyboardItems,
      trigger: button,
    });

    buttonContainer.appendChild(dropdown);
    keyboardExample.appendChild(info);
    keyboardExample.appendChild(buttonContainer);
  }
  content.appendChild(keyboardSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'The DropdownMenu component follows WAI-ARIA menu patterns.',
    code: `// ARIA attributes are automatically set:
// - role="menu" on the dropdown
// - role="menuitem" on items
// - role="separator" on dividers
// - aria-haspopup="menu" on items with submenus
// - aria-expanded on submenu triggers
// - aria-disabled on disabled items
// - tabindex management for keyboard navigation`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const a11yInfo = document.createElement('div');
    a11yInfo.style.fontFamily = 'var(--dos-font-family)';
    a11yInfo.innerHTML = `
      <p style="margin-bottom: var(--dos-space-sm);">This component implements:</p>
      <ul style="margin-bottom: var(--dos-space-md);">
        <li>✓ WAI-ARIA menu pattern</li>
        <li>✓ Full keyboard navigation</li>
        <li>✓ Focus management</li>
        <li>✓ Screen reader announcements</li>
        <li>✓ Type-ahead character search</li>
      </ul>
    `;

    a11yExample.appendChild(a11yInfo);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the ContextMenu demo page
 */
export function renderContextMenuPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'ContextMenu';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent =
    'A DOS-style context menu that appears on right-click, with full keyboard support via Shift+F10.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic Context Menu',
    description: 'Right-click in the target area below to open the context menu.',
    code: `import { createContextMenu } from 'dosage';

const contextMenu = createContextMenu({
  items: [
    { label: 'Cut', shortcut: 'Ctrl+X', action: () => console.log('Cut') },
    { label: 'Copy', shortcut: 'Ctrl+C', action: () => console.log('Copy') },
    { label: 'Paste', shortcut: 'Ctrl+V', action: () => console.log('Paste') },
    { divider: true },
    { label: 'Delete', action: () => console.log('Delete') }
  ],
  target: document.getElementById('target-area'),
  onSelect: (item, path) => console.log('Selected:', item.label)
});

document.body.appendChild(contextMenu);`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const statusBar = document.createElement('div');
    statusBar.style.marginBottom = 'var(--dos-space-md)';
    statusBar.style.padding = 'var(--dos-space-xs) var(--dos-space-sm)';
    statusBar.style.backgroundColor = 'var(--dos-surface-tertiary)';
    statusBar.style.fontFamily = 'var(--dos-font-family)';
    statusBar.textContent = 'Selected: (none)';

    const targetArea = document.createElement('div');
    targetArea.id = 'basic-context-target';
    targetArea.style.width = '100%';
    targetArea.style.height = '150px';
    targetArea.style.border = '1px dashed var(--dos-border-color)';
    targetArea.style.display = 'flex';
    targetArea.style.alignItems = 'center';
    targetArea.style.justifyContent = 'center';
    targetArea.style.fontFamily = 'var(--dos-font-family)';
    targetArea.style.color = 'var(--dos-text-secondary)';
    targetArea.style.marginBottom = 'var(--dos-space-md)';
    targetArea.style.backgroundColor = 'var(--dos-surface-secondary)';
    targetArea.textContent = 'Right-click here (or Shift+F10)';
    targetArea.tabIndex = 0;

    const basicItems: DropdownMenuItem[] = [
      { label: 'Cut', shortcut: 'Ctrl+X', icon: '✂', action: () => (statusBar.textContent = 'Action: Cut') },
      { label: 'Copy', shortcut: 'Ctrl+C', icon: '📋', action: () => (statusBar.textContent = 'Action: Copy') },
      { label: 'Paste', shortcut: 'Ctrl+V', icon: '📄', action: () => (statusBar.textContent = 'Action: Paste') },
      { divider: true, label: '' },
      { label: 'Delete', icon: '🗑', action: () => (statusBar.textContent = 'Action: Delete') },
    ];

    const contextMenu = createContextMenu({
      items: basicItems,
      target: targetArea,
      onSelect: (item) => {
        statusBar.textContent = `Selected: ${item.label}`;
      },
    });

    basicExample.appendChild(targetArea);
    basicExample.appendChild(statusBar);
    basicExample.appendChild(contextMenu);
  }
  content.appendChild(basicSection);

  // With Icons and Shortcuts
  const iconsSection = createDemoSection({
    title: 'With Icons and Shortcuts',
    description: 'Context menu with icon prefixes and keyboard shortcut hints.',
    code: `const contextMenu = createContextMenu({
  items: [
    { label: 'New File', icon: '📄', shortcut: 'Ctrl+N' },
    { label: 'New Folder', icon: '📁', shortcut: 'Ctrl+Shift+N' },
    { divider: true },
    { label: 'Refresh', icon: '🔄', shortcut: 'F5' },
    { divider: true },
    { label: 'Properties', icon: 'ℹ', shortcut: 'Alt+Enter' }
  ],
  target: '#file-area'
});`,
  });

  const iconsExample = iconsSection.querySelector('.dos-demo-section___examples');
  if (iconsExample) {
    const statusBar = document.createElement('div');
    statusBar.style.marginBottom = 'var(--dos-space-md)';
    statusBar.style.padding = 'var(--dos-space-xs) var(--dos-space-sm)';
    statusBar.style.backgroundColor = 'var(--dos-surface-tertiary)';
    statusBar.style.fontFamily = 'var(--dos-font-family)';
    statusBar.textContent = 'Selected: (none)';

    const targetArea = document.createElement('div');
    targetArea.id = 'icons-context-target';
    targetArea.style.width = '100%';
    targetArea.style.height = '150px';
    targetArea.style.border = '1px dashed var(--dos-border-color)';
    targetArea.style.display = 'flex';
    targetArea.style.alignItems = 'center';
    targetArea.style.justifyContent = 'center';
    targetArea.style.fontFamily = 'var(--dos-font-family)';
    targetArea.style.color = 'var(--dos-text-secondary)';
    targetArea.style.marginBottom = 'var(--dos-space-md)';
    targetArea.style.backgroundColor = 'var(--dos-surface-secondary)';
    targetArea.innerHTML = '📁 File Explorer Area<br><small>(Right-click here)</small>';
    targetArea.tabIndex = 0;

    const iconsItems: DropdownMenuItem[] = [
      { label: 'New File', icon: '📄', shortcut: 'Ctrl+N', action: () => (statusBar.textContent = 'Action: New File') },
      { label: 'New Folder', icon: '📁', shortcut: 'Ctrl+Shift+N', action: () => (statusBar.textContent = 'Action: New Folder') },
      { divider: true, label: '' },
      { label: 'Refresh', icon: '🔄', shortcut: 'F5', action: () => (statusBar.textContent = 'Action: Refresh') },
      { divider: true, label: '' },
      { label: 'Properties', icon: 'ℹ', shortcut: 'Alt+Enter', action: () => (statusBar.textContent = 'Action: Properties') },
    ];

    const contextMenu = createContextMenu({
      items: iconsItems,
      target: targetArea,
      onSelect: (item) => {
        statusBar.textContent = `Selected: ${item.label}`;
      },
    });

    iconsExample.appendChild(targetArea);
    iconsExample.appendChild(statusBar);
    iconsExample.appendChild(contextMenu);
  }
  content.appendChild(iconsSection);

  // Nested Submenus
  const submenuSection = createDemoSection({
    title: 'Nested Submenus',
    description: 'Context menu with hierarchical submenu structure.',
    code: `const contextMenu = createContextMenu({
  items: [
    { label: 'View', items: [
      { label: 'Large Icons' },
      { label: 'Small Icons' },
      { label: 'List' },
      { label: 'Details' }
    ]},
    { label: 'Sort by', items: [
      { label: 'Name' },
      { label: 'Size' },
      { label: 'Date Modified' },
      { label: 'Type' }
    ]},
    { divider: true },
    { label: 'Refresh' }
  ],
  target: '#folder-area'
});`,
  });

  const submenuExample = submenuSection.querySelector('.dos-demo-section___examples');
  if (submenuExample) {
    const statusBar = document.createElement('div');
    statusBar.style.marginBottom = 'var(--dos-space-md)';
    statusBar.style.padding = 'var(--dos-space-xs) var(--dos-space-sm)';
    statusBar.style.backgroundColor = 'var(--dos-surface-tertiary)';
    statusBar.style.fontFamily = 'var(--dos-font-family)';
    statusBar.textContent = 'Selected: (none)';

    const targetArea = document.createElement('div');
    targetArea.id = 'submenu-context-target';
    targetArea.style.width = '100%';
    targetArea.style.height = '150px';
    targetArea.style.border = '1px dashed var(--dos-border-color)';
    targetArea.style.display = 'flex';
    targetArea.style.alignItems = 'center';
    targetArea.style.justifyContent = 'center';
    targetArea.style.fontFamily = 'var(--dos-font-family)';
    targetArea.style.color = 'var(--dos-text-secondary)';
    targetArea.style.marginBottom = 'var(--dos-space-md)';
    targetArea.style.backgroundColor = 'var(--dos-surface-secondary)';
    targetArea.innerHTML = '📂 Folder View<br><small>(Right-click for options)</small>';
    targetArea.tabIndex = 0;

    const submenuItems: DropdownMenuItem[] = [
      {
        label: 'View',
        items: [
          { label: 'Large Icons', action: () => (statusBar.textContent = 'View: Large Icons') },
          { label: 'Small Icons', action: () => (statusBar.textContent = 'View: Small Icons') },
          { label: 'List', action: () => (statusBar.textContent = 'View: List') },
          { label: 'Details', action: () => (statusBar.textContent = 'View: Details') },
        ],
      },
      {
        label: 'Sort by',
        items: [
          { label: 'Name', action: () => (statusBar.textContent = 'Sort: Name') },
          { label: 'Size', action: () => (statusBar.textContent = 'Sort: Size') },
          { label: 'Date Modified', action: () => (statusBar.textContent = 'Sort: Date') },
          { label: 'Type', action: () => (statusBar.textContent = 'Sort: Type') },
        ],
      },
      { divider: true, label: '' },
      { label: 'Refresh', shortcut: 'F5', action: () => (statusBar.textContent = 'Action: Refresh') },
    ];

    const contextMenu = createContextMenu({
      items: submenuItems,
      target: targetArea,
      onSelect: (item) => {
        statusBar.textContent = `Selected: ${item.label}`;
      },
    });

    submenuExample.appendChild(targetArea);
    submenuExample.appendChild(statusBar);
    submenuExample.appendChild(contextMenu);
  }
  content.appendChild(submenuSection);

  // Programmatic Control
  const apiSection = createDemoSection({
    title: 'Programmatic Control',
    description: 'Demonstrate all programmatic API methods with clear visual feedback.',
    code: `const contextMenu = createContextMenu({
  items: [
    { label: 'Option 1' },
    { label: 'Option 2' },
    { label: 'Option 3' }
  ]
});

document.body.appendChild(contextMenu);

// Open at specific position
contextMenu.open({ x: 200, y: 150 });

// Close programmatically
contextMenu.close();

// Check if open
console.log(contextMenu.isOpen());

// Update items dynamically
contextMenu.setItems([
  { label: 'New Option 1' },
  { label: 'New Option 2' }
]);`,
  });

  const apiExample = apiSection.querySelector('.dos-demo-section___examples');
  if (apiExample) {
    // Status bar
    const statusBar = document.createElement('div');
    statusBar.style.marginBottom = 'var(--dos-space-md)';
    statusBar.style.padding = 'var(--dos-space-xs) var(--dos-space-sm)';
    statusBar.style.backgroundColor = 'var(--dos-surface-tertiary)';
    statusBar.style.fontFamily = 'var(--dos-font-family)';
    statusBar.textContent = 'Status: Click a button to interact';

    // Visual target area with marker
    const targetArea = document.createElement('div');
    targetArea.style.position = 'relative';
    targetArea.style.height = '300px';
    targetArea.style.marginBottom = 'var(--dos-space-md)';
    targetArea.style.padding = 'var(--dos-space-md)';
    targetArea.style.border = '1px solid var(--dos-border-color)';
    targetArea.style.backgroundColor = 'var(--dos-surface-secondary)';
    targetArea.style.fontFamily = 'var(--dos-font-family)';
    targetArea.textContent = '↓ Menu will appear at marked positions in this area';

    // Position markers
    const positions = [
      { x: 50, y: 80, label: 'Top-Left' },
      { x: 200, y: 80, label: 'Top-Center' },
      { x: 50, y: 200, label: 'Bottom-Left' },
    ];

    positions.forEach((pos) => {
      const marker = document.createElement('div');
      marker.style.position = 'absolute';
      marker.style.left = `${pos.x}px`;
      marker.style.top = `${pos.y}px`;
      marker.style.width = '8px';
      marker.style.height = '8px';
      marker.style.backgroundColor = 'var(--dos-accent-color)';
      marker.textContent = '✕';
      marker.style.fontSize = '10px';
      marker.style.lineHeight = '8px';
      marker.style.textAlign = 'center';
      marker.setAttribute('title', pos.label);
      targetArea.appendChild(marker);

      const label = document.createElement('div');
      label.style.position = 'absolute';
      label.style.left = `${pos.x + 12}px`;
      label.style.top = `${pos.y - 2}px`;
      label.style.fontSize = '11px';
      label.style.color = 'var(--dos-text-secondary)';
      label.textContent = pos.label;
      targetArea.appendChild(label);
    });

    // Button containers
    const buttonRow1 = document.createElement('div');
    buttonRow1.style.display = 'flex';
    buttonRow1.style.gap = 'var(--dos-space-sm)';
    buttonRow1.style.marginBottom = 'var(--dos-space-sm)';
    buttonRow1.style.flexWrap = 'wrap';

    const buttonRow2 = document.createElement('div');
    buttonRow2.style.display = 'flex';
    buttonRow2.style.gap = 'var(--dos-space-sm)';
    buttonRow2.style.marginBottom = 'var(--dos-space-md)';
    buttonRow2.style.flexWrap = 'wrap';

    const apiItems: DropdownMenuItem[] = [
      { id: 'opt1', label: 'Option 1', action: () => (statusBar.textContent = 'Selected: Option 1') },
      { id: 'opt2', label: 'Option 2', action: () => (statusBar.textContent = 'Selected: Option 2') },
      { id: 'opt3', label: 'Option 3', action: () => (statusBar.textContent = 'Selected: Option 3') },
    ];

    const contextMenu = createContextMenu({
      items: apiItems,
      onOpen: (position) => {
        statusBar.textContent = `Menu opened at (${position.x}, ${position.y})`;
      },
      onClose: () => {
        statusBar.textContent = 'Menu closed';
      },
    });

    // Position buttons
    const openTopLeftBtn = createButton({
      label: 'Open Top-Left',
      onClick: () => {
        const rect = targetArea.getBoundingClientRect();
        contextMenu.open({ x: rect.left + 50, y: rect.top + 80 });
      },
    });

    const openTopCenterBtn = createButton({
      label: 'Open Top-Center',
      onClick: () => {
        const rect = targetArea.getBoundingClientRect();
        contextMenu.open({ x: rect.left + 200, y: rect.top + 80 });
      },
    });

    const openBottomLeftBtn = createButton({
      label: 'Open Bottom-Left',
      onClick: () => {
        const rect = targetArea.getBoundingClientRect();
        contextMenu.open({ x: rect.left + 50, y: rect.top + 200 });
      },
    });

    const closeBtn = createButton({
      label: 'Close Menu',
      variant: 'secondary',
      onClick: () => {
        contextMenu.close();
      },
    });

    // API method buttons
    const checkStateBtn = createButton({
      label: 'Check isOpen()',
      variant: 'secondary',
      onClick: () => {
        const isOpen = contextMenu.isOpen();
        statusBar.textContent = `Menu is currently: ${isOpen ? 'OPEN' : 'CLOSED'}`;
      },
    });

    const updateItemsBtn = createButton({
      label: 'Update Items',
      variant: 'secondary',
      onClick: () => {
        const newItems: DropdownMenuItem[] = [
          { label: '★ New Item 1', action: () => (statusBar.textContent = 'Selected: New Item 1') },
          { label: '★ New Item 2', action: () => (statusBar.textContent = 'Selected: New Item 2') },
          { label: '★ New Item 3', action: () => (statusBar.textContent = 'Selected: New Item 3') },
        ];
        contextMenu.setItems(newItems);
        statusBar.textContent = 'Items updated! Open menu to see new items.';
      },
    });

    const resetItemsBtn = createButton({
      label: 'Reset Items',
      variant: 'secondary',
      onClick: () => {
        contextMenu.setItems(apiItems);
        statusBar.textContent = 'Items reset to original.';
      },
    });

    const toggleDisableBtn = createButton({
      label: 'Disable Option 2',
      variant: 'secondary',
      onClick: () => {
        contextMenu.setItemDisabled('opt2', true);
        statusBar.textContent = 'Option 2 disabled.';
      },
    });

    // Arrange buttons
    buttonRow1.appendChild(openTopLeftBtn);
    buttonRow1.appendChild(openTopCenterBtn);
    buttonRow1.appendChild(openBottomLeftBtn);
    buttonRow1.appendChild(closeBtn);

    buttonRow2.appendChild(checkStateBtn);
    buttonRow2.appendChild(updateItemsBtn);
    buttonRow2.appendChild(resetItemsBtn);
    buttonRow2.appendChild(toggleDisableBtn);

    apiExample.appendChild(buttonRow1);
    apiExample.appendChild(buttonRow2);
    apiExample.appendChild(statusBar);
    apiExample.appendChild(targetArea);
    apiExample.appendChild(contextMenu);
  }
  content.appendChild(apiSection);

  // Keyboard Navigation
  const keyboardSection = createDemoSection({
    title: 'Keyboard Navigation',
    description: 'Full keyboard support for accessibility.',
    code: `// Keyboard shortcuts:
// - Right-click: Open context menu at cursor
// - Shift+F10: Open context menu for focused element
// - Arrow Up/Down: Navigate items
// - Arrow Right: Open submenu
// - Arrow Left: Close submenu
// - Enter/Space: Activate item
// - Escape: Close menu
// - Home/End: Jump to first/last item
// - Type character: Jump to matching item`,
  });

  const keyboardExample = keyboardSection.querySelector('.dos-demo-section___examples');
  if (keyboardExample) {
    const keyboardInfo = document.createElement('div');
    keyboardInfo.style.fontFamily = 'var(--dos-font-family)';
    keyboardInfo.innerHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);"><strong>Right-click</strong></td>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);">Open menu at cursor</td>
        </tr>
        <tr>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);"><strong>Shift+F10</strong></td>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);">Open menu (standard keyboard shortcut)</td>
        </tr>
        <tr>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);"><strong>↑ / ↓</strong></td>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);">Navigate items</td>
        </tr>
        <tr>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);"><strong>→</strong></td>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);">Open submenu</td>
        </tr>
        <tr>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);"><strong>←</strong></td>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);">Close submenu</td>
        </tr>
        <tr>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);"><strong>Enter / Space</strong></td>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);">Activate item</td>
        </tr>
        <tr>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);"><strong>Escape</strong></td>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);">Close menu</td>
        </tr>
        <tr>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);"><strong>Home / End</strong></td>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);">Jump to first/last item</td>
        </tr>
        <tr>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);"><strong>A-Z</strong></td>
          <td style="padding: 4px; border: 1px solid var(--dos-border-color);">Jump to item starting with letter</td>
        </tr>
      </table>
    `;
    keyboardExample.appendChild(keyboardInfo);
  }
  content.appendChild(keyboardSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'The ContextMenu component follows WAI-ARIA best practices.',
    code: `// ARIA attributes automatically added:
// - role="menu" on the context menu
// - role="menuitem" on each item
// - role="separator" on dividers
// - aria-haspopup on items with submenus
// - aria-expanded on submenu triggers
// - aria-disabled on disabled items
// - aria-label="Context menu" for identification`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const a11yInfo = document.createElement('div');
    a11yInfo.style.fontFamily = 'var(--dos-font-family)';
    a11yInfo.innerHTML = `
      <p style="margin-bottom: var(--dos-space-sm);">This component implements:</p>
      <ul style="margin-bottom: var(--dos-space-md);">
        <li>✓ WAI-ARIA menu pattern</li>
        <li>✓ Shift+F10 standard keyboard trigger</li>
        <li>✓ Full keyboard navigation</li>
        <li>✓ Focus management</li>
        <li>✓ Screen reader announcements</li>
        <li>✓ Type-ahead character search</li>
        <li>✓ Viewport boundary collision handling</li>
      </ul>
    `;

    a11yExample.appendChild(a11yInfo);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Sidebar demo page
 */
export function renderSidebarPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Sidebar';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent =
    'DOS-style navigation sidebar with collapsible sections, keyboard navigation, and active item highlighting.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic Sidebar',
    description: 'A simple navigation sidebar with flat items.',
    code: `import { createSidebar } from 'dosage';

const sidebar = createSidebar({
  items: [
    { id: 'home', label: 'Home', icon: '■' },
    { id: 'about', label: 'About', icon: '●' },
    { id: 'contact', label: 'Contact', icon: '♦' }
  ],
  activeItem: 'home',
  onSelect: (item) => console.log('Selected:', item.id)
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.height = '200px';
    container.style.border = '2px solid var(--dos-color-border)';

    const statusDiv = document.createElement('div');
    statusDiv.style.flex = '1';
    statusDiv.style.padding = 'var(--dos-space-md)';
    statusDiv.style.fontFamily = 'var(--dos-font-family)';
    statusDiv.textContent = 'Selected: home';

    const sidebar = createSidebar({
      items: [
        { id: 'home', label: 'Home', icon: '■' },
        { id: 'about', label: 'About', icon: '●' },
        { id: 'contact', label: 'Contact', icon: '♦' },
      ],
      activeItem: 'home',
      width: '150px',
      onSelect: (item) => {
        statusDiv.textContent = `Selected: ${item.id}`;
      },
    });

    container.appendChild(sidebar);
    container.appendChild(statusDiv);
    basicExample.appendChild(container);
  }
  content.appendChild(basicSection);

  // Collapsible Sections
  const collapsibleSection = createDemoSection({
    title: 'Collapsible Sections',
    description: 'Sidebar with expandable/collapsible sections.',
    code: `import { createSidebar } from 'dosage';

const sidebar = createSidebar({
  items: [
    { id: 'dashboard', label: 'Dashboard', icon: '■' },
    {
      id: 'files',
      label: 'Files',
      icon: '◆',
      items: [
        { id: 'documents', label: 'Documents' },
        { id: 'downloads', label: 'Downloads' },
        { id: 'images', label: 'Images' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '◘',
      expanded: false, // Start collapsed
      items: [
        { id: 'general', label: 'General' },
        { id: 'display', label: 'Display' },
        { id: 'audio', label: 'Audio' }
      ]
    }
  ],
  onSelect: (item) => console.log('Selected:', item.id),
  onToggle: (section, expanded) => 
    console.log('Section', section.id, expanded ? 'expanded' : 'collapsed')
});`,
  });

  const collapsibleExample = collapsibleSection.querySelector('.dos-demo-section___examples');
  if (collapsibleExample) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.height = '280px';
    container.style.border = '2px solid var(--dos-color-border)';

    const statusDiv = document.createElement('div');
    statusDiv.style.flex = '1';
    statusDiv.style.padding = 'var(--dos-space-md)';
    statusDiv.style.fontFamily = 'var(--dos-font-family)';
    statusDiv.innerHTML = '<strong>Events:</strong><br>';

    const sidebar = createSidebar({
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '■' },
        {
          id: 'files',
          label: 'Files',
          icon: '◆',
          items: [
            { id: 'documents', label: 'Documents' },
            { id: 'downloads', label: 'Downloads' },
            { id: 'images', label: 'Images' },
          ],
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: '◘',
          expanded: false,
          items: [
            { id: 'general', label: 'General' },
            { id: 'display', label: 'Display' },
            { id: 'audio', label: 'Audio' },
          ],
        },
      ],
      width: '180px',
      onSelect: (item) => {
        statusDiv.innerHTML += `Selected: ${item.id}<br>`;
        statusDiv.scrollTop = statusDiv.scrollHeight;
      },
      onToggle: (section, expanded) => {
        statusDiv.innerHTML += `${section.id} ${expanded ? 'expanded' : 'collapsed'}<br>`;
        statusDiv.scrollTop = statusDiv.scrollHeight;
      },
    });

    container.appendChild(sidebar);
    container.appendChild(statusDiv);
    collapsibleExample.appendChild(container);
  }
  content.appendChild(collapsibleSection);

  // Disabled Items
  const disabledSection = createDemoSection({
    title: 'Disabled Items',
    description: 'Sidebar items can be individually disabled.',
    code: `import { createSidebar } from 'dosage';

const sidebar = createSidebar({
  items: [
    { id: 'active', label: 'Active Item', icon: '►' },
    { id: 'disabled', label: 'Disabled Item', icon: '○', disabled: true },
    { id: 'another', label: 'Another Active', icon: '►' }
  ]
});`,
  });

  const disabledExample = disabledSection.querySelector('.dos-demo-section___examples');
  if (disabledExample) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.height = '150px';
    container.style.border = '2px solid var(--dos-color-border)';

    const sidebar = createSidebar({
      items: [
        { id: 'active', label: 'Active Item', icon: '►' },
        { id: 'disabled', label: 'Disabled Item', icon: '○', disabled: true },
        { id: 'another', label: 'Another Active', icon: '►' },
      ],
      width: '180px',
    });

    container.appendChild(sidebar);
    disabledExample.appendChild(container);
  }
  content.appendChild(disabledSection);

  // Right Position
  const positionSection = createDemoSection({
    title: 'Right Position',
    description: 'Sidebar can be positioned on the right side.',
    code: `import { createSidebar } from 'dosage';

const sidebar = createSidebar({
  items: [...],
  position: 'right'
});`,
  });

  const positionExample = positionSection.querySelector('.dos-demo-section___examples');
  if (positionExample) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.height = '150px';
    container.style.border = '2px solid var(--dos-color-border)';

    const mainContent = document.createElement('div');
    mainContent.style.flex = '1';
    mainContent.style.padding = 'var(--dos-space-md)';
    mainContent.style.fontFamily = 'var(--dos-font-family)';
    mainContent.textContent = 'Main Content Area';

    const sidebar = createSidebar({
      items: [
        { id: 'tools', label: 'Tools', icon: '◆' },
        { id: 'help', label: 'Help', icon: '?' },
      ],
      width: '120px',
      position: 'right',
    });

    container.appendChild(mainContent);
    container.appendChild(sidebar);
    positionExample.appendChild(container);
  }
  content.appendChild(positionSection);

  // Programmatic API
  const apiSection = createDemoSection({
    title: 'Public API',
    description: 'The sidebar exposes methods to programmatically control it.',
    code: `import { createSidebar } from 'dosage';

const sidebar = createSidebar({ items: [...] });

// Set active item programmatically
sidebar.setActiveItem('documents');

// Get current active item
const active = sidebar.getActiveItem();

// Expand/collapse sections
sidebar.expandSection('files');
sidebar.collapseSection('settings');
sidebar.toggleSection('files');

// Collapse entire sidebar (icon-only mode)
sidebar.setCollapsed(true);

// Update items dynamically
sidebar.setItems(newItems);

// Cleanup
sidebar.destroy();`,
  });

  const apiExample = apiSection.querySelector('.dos-demo-section___examples');
  if (apiExample) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = 'var(--dos-space-md)';

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.flexWrap = 'wrap';
    buttonRow.style.gap = 'var(--dos-space-sm)';

    const sidebarContainer = document.createElement('div');
    sidebarContainer.style.display = 'flex';
    sidebarContainer.style.height = '200px';
    sidebarContainer.style.border = '2px solid var(--dos-color-border)';

    const statusDiv = document.createElement('div');
    statusDiv.style.flex = '1';
    statusDiv.style.padding = 'var(--dos-space-md)';
    statusDiv.style.fontFamily = 'var(--dos-font-family)';
    statusDiv.textContent = 'Active: dashboard';

    const sidebar = createSidebar({
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '■' },
        {
          id: 'files',
          label: 'Files',
          icon: '◆',
          items: [
            { id: 'documents', label: 'Documents' },
            { id: 'images', label: 'Images' },
          ],
        },
      ],
      activeItem: 'dashboard',
      width: '160px',
      onSelect: (item) => {
        statusDiv.textContent = `Active: ${item.id}`;
      },
    });

    // Control buttons
    const setActiveBtn = createButton({
      label: 'Set Active: images',
      onClick: () => {
        sidebar.setActiveItem('images');
        statusDiv.textContent = `Active: ${sidebar.getActiveItem()}`;
      },
    });

    const toggleFilesBtn = createButton({
      label: 'Toggle Files Section',
      onClick: () => {
        sidebar.toggleSection('files');
      },
    });

    const collapseBtn = createButton({
      label: 'Toggle Collapse',
      onClick: () => {
        sidebar.setCollapsed(!sidebar.isCollapsed());
      },
    });

    buttonRow.appendChild(setActiveBtn);
    buttonRow.appendChild(toggleFilesBtn);
    buttonRow.appendChild(collapseBtn);

    sidebarContainer.appendChild(sidebar);
    sidebarContainer.appendChild(statusDiv);

    container.appendChild(buttonRow);
    container.appendChild(sidebarContainer);
    apiExample.appendChild(container);
  }
  content.appendChild(apiSection);

  // Keyboard Navigation
  const keyboardSection = createDemoSection({
    title: 'Keyboard Navigation',
    description: 'Full keyboard support for accessibility.',
    code: `// Keyboard controls:
// ↑ / ↓         Navigate between items
// Enter / Space Select item or toggle section
// → / ←         Expand/collapse section (on headers)
// Home          Go to first item
// End           Go to last item`,
  });

  const keyboardExample = keyboardSection.querySelector('.dos-demo-section___examples');
  if (keyboardExample) {
    const keyboardInfo = document.createElement('div');
    keyboardInfo.style.fontFamily = 'var(--dos-font-family)';
    keyboardInfo.innerHTML = `
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">↑ / ↓</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Navigate between items</td></tr>
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Enter / Space</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Select item or toggle section</td></tr>
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">→</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Expand section (on header)</td></tr>
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">←</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Collapse section (on header)</td></tr>
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Home</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Go to first item</td></tr>
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">End</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Go to last item</td></tr>
      </table>
    `;
    keyboardExample.appendChild(keyboardInfo);
  }
  content.appendChild(keyboardSection);

  // Accessibility
  const a11ySidebarSection = createDemoSection({
    title: 'Accessibility',
    description: 'The Sidebar component follows WAI-ARIA best practices.',
    code: `// ARIA attributes automatically added:
// - role="navigation" on the sidebar
// - aria-label="Sidebar navigation"
// - aria-current="page" on active item
// - aria-expanded on collapsible section headers
// - aria-disabled on disabled items
// - role="group" on section content
// - aria-labelledby linking content to header`,
  });

  const a11ySidebarExample = a11ySidebarSection.querySelector('.dos-demo-section___examples');
  if (a11ySidebarExample) {
    const a11yInfo = document.createElement('div');
    a11yInfo.style.fontFamily = 'var(--dos-font-family)';
    a11yInfo.innerHTML = `
      <p style="margin-bottom: var(--dos-space-sm);">This component implements:</p>
      <ul style="margin-bottom: var(--dos-space-md);">
        <li>✓ Navigation landmark role</li>
        <li>✓ Current page indication</li>
        <li>✓ Collapsible section state</li>
        <li>✓ Full keyboard navigation</li>
        <li>✓ Focus management</li>
        <li>✓ Screen reader announcements</li>
      </ul>
    `;
    a11ySidebarExample.appendChild(a11yInfo);
  }
  content.appendChild(a11ySidebarSection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Breadcrumbs demo page
 */
export function renderBreadcrumbsPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Breadcrumbs';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent =
    'DOS-style breadcrumb navigation trail with customizable separators and overflow handling.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic Breadcrumbs',
    description: 'A simple breadcrumb trail showing navigation path.',
    code: `import { createBreadcrumbs } from 'dosage';

const breadcrumbs = createBreadcrumbs({
  items: [
    { label: 'Home', href: '/' },
    { label: 'Documents', href: '/documents' },
    { label: 'Reports', href: '/documents/reports' },
    { label: 'Q4 Report' } // Current page (no href)
  ],
  onSelect: (item, index) => console.log('Navigate:', item.href)
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const statusDiv = document.createElement('div');
    statusDiv.style.marginTop = 'var(--dos-space-md)';
    statusDiv.style.fontFamily = 'var(--dos-font-family)';
    statusDiv.textContent = 'Click a breadcrumb to see the event';

    const breadcrumbs = createBreadcrumbs({
      items: [
        { label: 'Home', href: '/' },
        { label: 'Documents', href: '/documents' },
        { label: 'Reports', href: '/documents/reports' },
        { label: 'Q4 Report' },
      ],
      onSelect: (item) => {
        statusDiv.textContent = `Would navigate to: ${item.href}`;
      },
    });

    basicExample.appendChild(breadcrumbs);
    basicExample.appendChild(statusDiv);
  }
  content.appendChild(basicSection);

  // Separator Styles
  const separatorSection = createDemoSection({
    title: 'Separator Styles',
    description: 'Different separator characters for various aesthetics.',
    code: `// Available separators: '>' | '»' | '/' | '\\\\' | '│' | '→' | '►'

const breadcrumbs = createBreadcrumbs({
  items: [...],
  separator: '»' // Or any other separator
});`,
  });

  const separatorExample = separatorSection.querySelector('.dos-demo-section___examples');
  if (separatorExample) {
    const separators = ['>', '»', '/', '\\', '│', '→', '►'];
    const demoItems = [
      { label: 'Home', href: '/' },
      { label: 'Section', href: '/section' },
      { label: 'Page' },
    ];

    separators.forEach((sep) => {
      const container = document.createElement('div');
      container.style.marginBottom = 'var(--dos-space-sm)';
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.gap = 'var(--dos-space-md)';

      const label = document.createElement('span');
      label.style.fontFamily = 'var(--dos-font-family)';
      label.style.width = '80px';
      label.textContent = `"${sep}":`;

      const breadcrumbs = createBreadcrumbs({
        items: demoItems,
        separator: sep,
      });

      container.appendChild(label);
      container.appendChild(breadcrumbs);
      separatorExample.appendChild(container);
    });
  }
  content.appendChild(separatorSection);

  // With Icons
  const iconsSection = createDemoSection({
    title: 'With Icons',
    description: 'Breadcrumb items can include ASCII icons.',
    code: `const breadcrumbs = createBreadcrumbs({
  items: [
    { label: 'Home', href: '/', icon: '■' },
    { label: 'Settings', href: '/settings', icon: '◆' },
    { label: 'Display', href: '/settings/display', icon: '◘' },
    { label: 'Theme' }
  ]
});`,
  });

  const iconsExample = iconsSection.querySelector('.dos-demo-section___examples');
  if (iconsExample) {
    const breadcrumbs = createBreadcrumbs({
      items: [
        { label: 'Home', href: '/', icon: '■' },
        { label: 'Settings', href: '/settings', icon: '◆' },
        { label: 'Display', href: '/settings/display', icon: '◘' },
        { label: 'Theme' },
      ],
    });

    iconsExample.appendChild(breadcrumbs);
  }
  content.appendChild(iconsSection);

  // Overflow Handling
  const overflowSection = createDemoSection({
    title: 'Overflow Handling',
    description: 'Long paths can be collapsed with an ellipsis.',
    code: `const breadcrumbs = createBreadcrumbs({
  items: [
    { label: 'Home', href: '/' },
    { label: 'Level 1', href: '/l1' },
    { label: 'Level 2', href: '/l2' },
    { label: 'Level 3', href: '/l3' },
    { label: 'Level 4', href: '/l4' },
    { label: 'Current Page' }
  ],
  maxItems: 3 // Shows first, ellipsis, and last
});`,
  });

  const overflowExample = overflowSection.querySelector('.dos-demo-section___examples');
  if (overflowExample) {
    const longPath = [
      { label: 'Home', href: '/' },
      { label: 'Documents', href: '/documents' },
      { label: 'Projects', href: '/documents/projects' },
      { label: 'DOSage', href: '/documents/projects/dosage' },
      { label: 'Components', href: '/documents/projects/dosage/components' },
      { label: 'Breadcrumbs' },
    ];

    const infoDiv = document.createElement('div');
    infoDiv.style.marginBottom = 'var(--dos-space-md)';
    infoDiv.style.fontFamily = 'var(--dos-font-family)';

    const fullLabel = document.createElement('div');
    fullLabel.textContent = 'Full path (no maxItems):';
    fullLabel.style.marginBottom = 'var(--dos-space-xs)';

    const fullBreadcrumbs = createBreadcrumbs({ items: longPath });

    const collapsedLabel = document.createElement('div');
    collapsedLabel.textContent = 'Collapsed (maxItems: 3):';
    collapsedLabel.style.marginTop = 'var(--dos-space-md)';
    collapsedLabel.style.marginBottom = 'var(--dos-space-xs)';

    const collapsedBreadcrumbs = createBreadcrumbs({ items: longPath, maxItems: 3 });

    const note = document.createElement('p');
    note.style.marginTop = 'var(--dos-space-md)';
    note.style.fontStyle = 'italic';
    note.style.color = 'var(--dos-color-text-muted)';
    note.textContent = 'Click the "..." to expand hidden items.';

    overflowExample.appendChild(fullLabel);
    overflowExample.appendChild(fullBreadcrumbs);
    overflowExample.appendChild(collapsedLabel);
    overflowExample.appendChild(collapsedBreadcrumbs);
    overflowExample.appendChild(note);
  }
  content.appendChild(overflowSection);

  // Programmatic API
  const apiSection = createDemoSection({
    title: 'Public API',
    description: 'The breadcrumbs exposes methods to programmatically control it.',
    code: `const breadcrumbs = createBreadcrumbs({ items: [...] });

// Update items
breadcrumbs.setItems(newItems);

// Get current items
const items = breadcrumbs.getItems();

// Change separator
breadcrumbs.setSeparator('/');

// Change max items
breadcrumbs.setMaxItems(4);

// Cleanup
breadcrumbs.destroy();`,
  });

  const apiExample = apiSection.querySelector('.dos-demo-section___examples');
  if (apiExample) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = 'var(--dos-space-md)';

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.flexWrap = 'wrap';
    buttonRow.style.gap = 'var(--dos-space-sm)';

    const breadcrumbsContainer = document.createElement('div');
    breadcrumbsContainer.style.padding = 'var(--dos-space-md)';
    breadcrumbsContainer.style.border = '1px solid var(--dos-color-border)';

    const breadcrumbs = createBreadcrumbs({
      items: [
        { label: 'Home', href: '/' },
        { label: 'Section', href: '/section' },
        { label: 'Page' },
      ],
    });

    breadcrumbsContainer.appendChild(breadcrumbs);

    // Control buttons
    const setSepBtn = createButton({
      label: 'Separator: »',
      onClick: () => breadcrumbs.setSeparator('»'),
    });

    const setSepSlashBtn = createButton({
      label: 'Separator: /',
      onClick: () => breadcrumbs.setSeparator('/'),
    });

    const addItemBtn = createButton({
      label: 'Add Level',
      onClick: () => {
        const items = breadcrumbs.getItems();
        const lastItem = items[items.length - 1];
        // Convert last item to a link and add new current
        lastItem.href = `/level${items.length}`;
        items.push({ label: `Level ${items.length + 1}` });
        breadcrumbs.setItems(items);
      },
    });

    const resetBtn = createButton({
      label: 'Reset',
      onClick: () => {
        breadcrumbs.setItems([
          { label: 'Home', href: '/' },
          { label: 'Section', href: '/section' },
          { label: 'Page' },
        ]);
        breadcrumbs.setSeparator('>');
      },
    });

    buttonRow.appendChild(setSepBtn);
    buttonRow.appendChild(setSepSlashBtn);
    buttonRow.appendChild(addItemBtn);
    buttonRow.appendChild(resetBtn);

    container.appendChild(buttonRow);
    container.appendChild(breadcrumbsContainer);
    apiExample.appendChild(container);
  }
  content.appendChild(apiSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'The Breadcrumbs component follows WAI-ARIA best practices.',
    code: `// ARIA attributes automatically added:
// - <nav> element with role="navigation"
// - aria-label="Breadcrumb" for landmark identification
// - aria-current="page" on the current page item
// - Separators marked aria-hidden="true"
// - Semantic <ol> list structure`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const a11yInfo = document.createElement('div');
    a11yInfo.style.fontFamily = 'var(--dos-font-family)';
    a11yInfo.innerHTML = `
      <p style="margin-bottom: var(--dos-space-sm);">This component implements:</p>
      <ul style="margin-bottom: var(--dos-space-md);">
        <li>✓ Navigation landmark with aria-label</li>
        <li>✓ Current page indicated with aria-current</li>
        <li>✓ Semantic ordered list structure</li>
        <li>✓ Decorative separators hidden from screen readers</li>
        <li>✓ Tab navigation between links</li>
        <li>✓ Expandable ellipsis with accessible label</li>
      </ul>
    `;
    a11yExample.appendChild(a11yInfo);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Pagination demo page
 */
export function renderPaginationPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Pagination';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent =
    'DOS-style pagination controls with ellipsis support and keyboard navigation.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic Pagination',
    description: 'Simple page navigation with all default options.',
    code: `import { createPagination } from 'dosage';

const pagination = createPagination({
  currentPage: 1,
  totalPages: 10,
  onChange: (page) => console.log('Go to page:', page)
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const statusDiv = document.createElement('div');
    statusDiv.style.marginBottom = 'var(--dos-space-md)';
    statusDiv.style.fontFamily = 'var(--dos-font-family)';
    statusDiv.textContent = 'Current page: 1';

    const pagination = createPagination({
      currentPage: 1,
      totalPages: 10,
      onChange: (pg) => {
        statusDiv.textContent = `Current page: ${pg}`;
      },
    });

    basicExample.appendChild(statusDiv);
    basicExample.appendChild(pagination);
  }
  content.appendChild(basicSection);

  // With Ellipsis
  const ellipsisSection = createDemoSection({
    title: 'Ellipsis for Large Page Counts',
    description: 'Pagination automatically shows ellipsis when there are many pages.',
    code: `const pagination = createPagination({
  currentPage: 15,
  totalPages: 50,
  siblingCount: 1,  // Pages shown around current
  boundaryCount: 1  // Pages shown at start/end
});`,
  });

  const ellipsisExample = ellipsisSection.querySelector('.dos-demo-section___examples');
  if (ellipsisExample) {
    const statusDiv = document.createElement('div');
    statusDiv.style.marginBottom = 'var(--dos-space-md)';
    statusDiv.style.fontFamily = 'var(--dos-font-family)';
    statusDiv.textContent = 'Current page: 15 of 50';

    const pagination = createPagination({
      currentPage: 15,
      totalPages: 50,
      siblingCount: 1,
      boundaryCount: 1,
      onChange: (pg) => {
        statusDiv.textContent = `Current page: ${pg} of 50`;
      },
    });

    ellipsisExample.appendChild(statusDiv);
    ellipsisExample.appendChild(pagination);
  }
  content.appendChild(ellipsisSection);

  // Configuration Options
  const configSection = createDemoSection({
    title: 'Configuration Options',
    description: 'Customize which navigation buttons appear.',
    code: `// Show only page numbers (no nav buttons)
const minimal = createPagination({
  currentPage: 3,
  totalPages: 10,
  showFirstLast: false,
  showPrevNext: false
});

// Show only prev/next
const prevNext = createPagination({
  currentPage: 3,
  totalPages: 10,
  showFirstLast: false
});`,
  });

  const configExample = configSection.querySelector('.dos-demo-section___examples');
  if (configExample) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = 'var(--dos-space-md)';

    // Full (default)
    const fullLabel = document.createElement('div');
    fullLabel.style.fontFamily = 'var(--dos-font-family)';
    fullLabel.textContent = 'Full (default):';

    const fullPagination = createPagination({
      currentPage: 3,
      totalPages: 10,
    });

    // Prev/Next only
    const prevNextLabel = document.createElement('div');
    prevNextLabel.style.fontFamily = 'var(--dos-font-family)';
    prevNextLabel.textContent = 'Prev/Next only:';

    const prevNextPagination = createPagination({
      currentPage: 3,
      totalPages: 10,
      showFirstLast: false,
    });

    // Pages only
    const pagesOnlyLabel = document.createElement('div');
    pagesOnlyLabel.style.fontFamily = 'var(--dos-font-family)';
    pagesOnlyLabel.textContent = 'Pages only:';

    const pagesOnlyPagination = createPagination({
      currentPage: 3,
      totalPages: 10,
      showFirstLast: false,
      showPrevNext: false,
    });

    container.appendChild(fullLabel);
    container.appendChild(fullPagination);
    container.appendChild(prevNextLabel);
    container.appendChild(prevNextPagination);
    container.appendChild(pagesOnlyLabel);
    container.appendChild(pagesOnlyPagination);

    configExample.appendChild(container);
  }
  content.appendChild(configSection);

  // Custom Labels
  const labelsSection = createDemoSection({
    title: 'Custom Labels',
    description: 'Customize the navigation button labels.',
    code: `const pagination = createPagination({
  currentPage: 5,
  totalPages: 10,
  labels: {
    first: '<<',
    previous: '<',
    next: '>',
    last: '>>'
  }
});`,
  });

  const labelsExample = labelsSection.querySelector('.dos-demo-section___examples');
  if (labelsExample) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = 'var(--dos-space-md)';

    // Default
    const defaultLabel = document.createElement('div');
    defaultLabel.style.fontFamily = 'var(--dos-font-family)';
    defaultLabel.textContent = 'Default labels (|< < > >|):';

    const defaultPagination = createPagination({
      currentPage: 5,
      totalPages: 10,
    });

    // Custom arrows
    const customLabel = document.createElement('div');
    customLabel.style.fontFamily = 'var(--dos-font-family)';
    customLabel.textContent = 'Custom labels (<< < > >>):';

    const customPagination = createPagination({
      currentPage: 5,
      totalPages: 10,
      labels: {
        first: '<<',
        previous: '<',
        next: '>',
        last: '>>',
      },
    });

    container.appendChild(defaultLabel);
    container.appendChild(defaultPagination);
    container.appendChild(customLabel);
    container.appendChild(customPagination);

    labelsExample.appendChild(container);
  }
  content.appendChild(labelsSection);

  // Programmatic API
  const apiSection = createDemoSection({
    title: 'Public API',
    description: 'The pagination exposes methods to programmatically control it.',
    code: `const pagination = createPagination({ currentPage: 1, totalPages: 10 });

// Navigate programmatically
pagination.setPage(5);
pagination.nextPage();
pagination.previousPage();
pagination.firstPage();
pagination.lastPage();

// Get state
const current = pagination.getPage();
const total = pagination.getTotalPages();

// Update total pages
pagination.setTotalPages(20);

// Disable/enable
pagination.setDisabled(true);

// Cleanup
pagination.destroy();`,
  });

  const apiExample = apiSection.querySelector('.dos-demo-section___examples');
  if (apiExample) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = 'var(--dos-space-md)';

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.flexWrap = 'wrap';
    buttonRow.style.gap = 'var(--dos-space-sm)';

    const statusDiv = document.createElement('div');
    statusDiv.style.fontFamily = 'var(--dos-font-family)';
    statusDiv.textContent = 'Page: 5 of 20';

    const pagination = createPagination({
      currentPage: 5,
      totalPages: 20,
      onChange: (pg) => {
        statusDiv.textContent = `Page: ${pg} of ${pagination.getTotalPages()}`;
      },
    });

    // Control buttons
    const firstBtn = createButton({
      label: 'First',
      onClick: () => pagination.firstPage(),
    });

    const prevBtn = createButton({
      label: 'Prev',
      onClick: () => pagination.previousPage(),
    });

    const nextBtn = createButton({
      label: 'Next',
      onClick: () => pagination.nextPage(),
    });

    const lastBtn = createButton({
      label: 'Last',
      onClick: () => pagination.lastPage(),
    });

    const jumpBtn = createButton({
      label: 'Jump to 10',
      onClick: () => pagination.setPage(10),
    });

    const toggleBtn = createButton({
      label: 'Toggle Disabled',
      onClick: () => pagination.setDisabled(!pagination.isDisabled()),
    });

    buttonRow.appendChild(firstBtn);
    buttonRow.appendChild(prevBtn);
    buttonRow.appendChild(nextBtn);
    buttonRow.appendChild(lastBtn);
    buttonRow.appendChild(jumpBtn);
    buttonRow.appendChild(toggleBtn);

    container.appendChild(buttonRow);
    container.appendChild(statusDiv);
    container.appendChild(pagination);
    apiExample.appendChild(container);
  }
  content.appendChild(apiSection);

  // Keyboard Navigation
  const keyboardSection = createDemoSection({
    title: 'Keyboard Navigation',
    description: 'Full keyboard support for accessibility.',
    code: `// When pagination is focused:
// ← (ArrowLeft)   Go to previous page
// → (ArrowRight)  Go to next page
// Home            Go to first page
// End             Go to last page
// Tab             Navigate between buttons`,
  });

  const keyboardExample = keyboardSection.querySelector('.dos-demo-section___examples');
  if (keyboardExample) {
    const keyboardInfo = document.createElement('div');
    keyboardInfo.style.fontFamily = 'var(--dos-font-family)';
    keyboardInfo.innerHTML = `
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">← / →</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Previous/Next page</td></tr>
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Home</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Go to first page</td></tr>
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">End</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Go to last page</td></tr>
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Tab</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Navigate between buttons</td></tr>
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Enter</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Activate focused button</td></tr>
      </table>
    `;
    keyboardExample.appendChild(keyboardInfo);
  }
  content.appendChild(keyboardSection);

  // Accessibility
  const a11ySection2 = createDemoSection({
    title: 'Accessibility',
    description: 'The Pagination component follows WAI-ARIA best practices.',
    code: `// ARIA attributes automatically added:
// - <nav> element with role="navigation"
// - aria-label="Pagination"
// - aria-current="page" on current page button
// - aria-label on all buttons for screen readers
// - aria-disabled on disabled buttons
// - Ellipsis hidden from screen readers`,
  });

  const a11yExample2 = a11ySection2.querySelector('.dos-demo-section___examples');
  if (a11yExample2) {
    const a11yInfo = document.createElement('div');
    a11yInfo.style.fontFamily = 'var(--dos-font-family)';
    a11yInfo.innerHTML = `
      <p style="margin-bottom: var(--dos-space-sm);">This component implements:</p>
      <ul style="margin-bottom: var(--dos-space-md);">
        <li>✓ Navigation landmark with aria-label</li>
        <li>✓ Current page indicated with aria-current</li>
        <li>✓ Descriptive labels on all buttons</li>
        <li>✓ Disabled state properly announced</li>
        <li>✓ Keyboard navigation support</li>
        <li>✓ Focus visible indicators</li>
      </ul>
    `;
    a11yExample2.appendChild(a11yInfo);
  }
  content.appendChild(a11ySection2);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Stepper demo page
 */
export function renderStepperPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Stepper / Wizard';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent =
    'DOS-style step progress indicator for multi-step processes with horizontal and vertical layouts.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic Stepper',
    description: 'A simple horizontal stepper showing progress through steps.',
    code: `import { createStepper } from 'dosage';

const stepper = createStepper({
  steps: [
    { label: 'Account' },
    { label: 'Profile' },
    { label: 'Review' },
    { label: 'Complete' }
  ],
  currentStep: 1,
  onChange: (index) => console.log('Step:', index)
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const steps: Step[] = [
      { label: 'Account' },
      { label: 'Profile' },
      { label: 'Review' },
      { label: 'Complete' },
    ];

    const statusDiv = document.createElement('div');
    statusDiv.style.marginBottom = 'var(--dos-space-md)';
    statusDiv.style.fontFamily = 'var(--dos-font-family)';
    statusDiv.textContent = 'Current step: 2 (Profile)';

    const stepper = createStepper({
      steps,
      currentStep: 1,
      onChange: (index) => {
        statusDiv.textContent = `Current step: ${index + 1} (${steps[index]?.label})`;
      },
    });

    basicExample.appendChild(statusDiv);
    basicExample.appendChild(stepper);
  }
  content.appendChild(basicSection);

  // Vertical Stepper
  const verticalSection = createDemoSection({
    title: 'Vertical Orientation',
    description: 'Stepper can also be displayed vertically for sidebar layouts.',
    code: `const stepper = createStepper({
  steps: [
    { label: 'Select Plan', description: 'Choose your subscription' },
    { label: 'Add Details', description: 'Enter your information' },
    { label: 'Payment', description: 'Complete purchase' }
  ],
  currentStep: 1,
  orientation: 'vertical'
});`,
  });

  const verticalExample = verticalSection.querySelector('.dos-demo-section___examples');
  if (verticalExample) {
    const stepper = createStepper({
      steps: [
        { label: 'Select Plan', description: 'Choose your subscription' },
        { label: 'Add Details', description: 'Enter your information' },
        { label: 'Payment', description: 'Complete purchase' },
      ],
      currentStep: 1,
      orientation: 'vertical',
    });

    verticalExample.appendChild(stepper);
  }
  content.appendChild(verticalSection);

  // Step States
  const statesSection = createDemoSection({
    title: 'Step States',
    description: 'Steps can show completed, error, or disabled states.',
    code: `const stepper = createStepper({
  steps: [
    { label: 'Login', completed: true },
    { label: 'Verify Email', completed: true },
    { label: 'Profile', error: true },  // Error state
    { label: 'Settings' },               // Current
    { label: 'Finish', disabled: true }  // Disabled
  ],
  currentStep: 3
});`,
  });

  const statesExample = statesSection.querySelector('.dos-demo-section___examples');
  if (statesExample) {
    const stepper = createStepper({
      steps: [
        { label: 'Login', completed: true },
        { label: 'Verify Email', completed: true },
        { label: 'Profile', error: true },
        { label: 'Settings' },
        { label: 'Finish', disabled: true },
      ],
      currentStep: 3,
    });

    const legend = document.createElement('div');
    legend.style.fontFamily = 'var(--dos-font-family)';
    legend.style.marginTop = 'var(--dos-space-md)';
    legend.innerHTML = `
      <p style="margin-bottom: var(--dos-space-sm);">Step indicators:</p>
      <ul>
        <li>✓ = Completed</li>
        <li>✗ = Error</li>
        <li>● = Current (when numbers hidden)</li>
        <li>1, 2, 3... = Step numbers</li>
      </ul>
    `;

    statesExample.appendChild(stepper);
    statesExample.appendChild(legend);
  }
  content.appendChild(statesSection);

  // Clickable Steps
  const clickableSection = createDemoSection({
    title: 'Clickable Steps',
    description: 'Enable clicking on steps to navigate directly to them.',
    code: `const stepper = createStepper({
  steps: [
    { label: 'Step 1', completed: true },
    { label: 'Step 2', completed: true },
    { label: 'Step 3' },
    { label: 'Step 4' },
    { label: 'Step 5', disabled: true }
  ],
  currentStep: 2,
  allowStepClick: true,
  onChange: (index) => console.log('Navigated to step:', index)
});`,
  });

  const clickableExample = clickableSection.querySelector('.dos-demo-section___examples');
  if (clickableExample) {
    const clickableSteps: Step[] = [
      { label: 'Step 1', completed: true },
      { label: 'Step 2', completed: true },
      { label: 'Step 3' },
      { label: 'Step 4' },
      { label: 'Step 5', disabled: true },
    ];

    const statusDiv = document.createElement('div');
    statusDiv.style.marginBottom = 'var(--dos-space-md)';
    statusDiv.style.fontFamily = 'var(--dos-font-family)';
    statusDiv.textContent = 'Click any step to navigate (Step 5 is disabled)';

    const stepper = createStepper({
      steps: clickableSteps,
      currentStep: 2,
      allowStepClick: true,
      onChange: (index) => {
        statusDiv.textContent = `Navigated to: ${clickableSteps[index]?.label}`;
      },
    });

    clickableExample.appendChild(statusDiv);
    clickableExample.appendChild(stepper);
  }
  content.appendChild(clickableSection);

  // Without Numbers
  const noNumbersSection = createDemoSection({
    title: 'Without Step Numbers',
    description: 'Hide step numbers for a cleaner look.',
    code: `const stepper = createStepper({
  steps: [
    { label: 'Start', completed: true },
    { label: 'Configure' },
    { label: 'Review' },
    { label: 'Deploy' }
  ],
  currentStep: 1,
  showStepNumbers: false
});`,
  });

  const noNumbersExample = noNumbersSection.querySelector('.dos-demo-section___examples');
  if (noNumbersExample) {
    const stepper = createStepper({
      steps: [
        { label: 'Start', completed: true },
        { label: 'Configure' },
        { label: 'Review' },
        { label: 'Deploy' },
      ],
      currentStep: 1,
      showStepNumbers: false,
    });

    noNumbersExample.appendChild(stepper);
  }
  content.appendChild(noNumbersSection);

  // Programmatic API
  const apiSection = createDemoSection({
    title: 'Public API',
    description: 'The stepper exposes methods to control it programmatically.',
    code: `const stepper = createStepper({ steps, currentStep: 0 });

// Navigate
stepper.setStep(2);
stepper.nextStep();
stepper.previousStep();

// Get state
const current = stepper.getStep();
const stepState = stepper.getStepState(0);

// Update step states
stepper.setStepCompleted(0, true);
stepper.setStepError(1, true);
stepper.setStepDisabled(2, true);

// Replace all steps
stepper.setSteps([...newSteps]);

// Cleanup
stepper.destroy();`,
  });

  const apiExample = apiSection.querySelector('.dos-demo-section___examples');
  if (apiExample) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = 'var(--dos-space-md)';

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.flexWrap = 'wrap';
    buttonRow.style.gap = 'var(--dos-space-sm)';

    const apiSteps: Step[] = [
      { label: 'Step 1' },
      { label: 'Step 2' },
      { label: 'Step 3' },
      { label: 'Step 4' },
    ];

    const statusDiv = document.createElement('div');
    statusDiv.style.fontFamily = 'var(--dos-font-family)';
    statusDiv.textContent = 'Current step: 1';

    const stepper = createStepper({
      steps: apiSteps,
      currentStep: 0,
      onChange: (index) => {
        statusDiv.textContent = `Current step: ${index + 1}`;
      },
    });

    // Control buttons
    const prevBtn = createButton({
      label: 'Previous',
      onClick: () => stepper.previousStep(),
    });

    const nextBtn = createButton({
      label: 'Next',
      onClick: () => stepper.nextStep(),
    });

    const completeBtn = createButton({
      label: 'Complete Current',
      onClick: () => {
        const current = stepper.getStep();
        stepper.setStepCompleted(current, true);
      },
    });

    const errorBtn = createButton({
      label: 'Toggle Error on 2',
      onClick: () => {
        const state = stepper.getStepState(1);
        stepper.setStepError(1, !state?.error);
      },
    });

    const resetBtn = createButton({
      label: 'Reset',
      onClick: () => {
        stepper.setSteps([
          { label: 'Step 1' },
          { label: 'Step 2' },
          { label: 'Step 3' },
          { label: 'Step 4' },
        ]);
        stepper.setStep(0);
      },
    });

    buttonRow.appendChild(prevBtn);
    buttonRow.appendChild(nextBtn);
    buttonRow.appendChild(completeBtn);
    buttonRow.appendChild(errorBtn);
    buttonRow.appendChild(resetBtn);

    container.appendChild(buttonRow);
    container.appendChild(statusDiv);
    container.appendChild(stepper);
    apiExample.appendChild(container);
  }
  content.appendChild(apiSection);

  // Keyboard Navigation
  const keyboardSection = createDemoSection({
    title: 'Keyboard Navigation',
    description: 'Full keyboard support when steps are clickable.',
    code: `// When stepper is clickable and focused:
// ← / ↑  Move focus to previous step
// → / ↓  Move focus to next step
// Home   Move focus to first step
// End    Move focus to last step
// Enter  Activate focused step
// Space  Activate focused step`,
  });

  const keyboardExample = keyboardSection.querySelector('.dos-demo-section___examples');
  if (keyboardExample) {
    const keyboardInfo = document.createElement('div');
    keyboardInfo.style.fontFamily = 'var(--dos-font-family)';
    keyboardInfo.innerHTML = `
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">← / ↑</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Focus previous step</td></tr>
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">→ / ↓</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Focus next step</td></tr>
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Home</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Focus first step</td></tr>
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">End</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Focus last step</td></tr>
        <tr><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Enter/Space</td><td style="padding: 4px; border: 1px solid var(--dos-color-border);">Activate step</td></tr>
      </table>
    `;
    keyboardExample.appendChild(keyboardInfo);
  }
  content.appendChild(keyboardSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'The Stepper component follows WAI-ARIA best practices.',
    code: `// ARIA attributes automatically added:
// - role="list" on container
// - role="listitem" on each step
// - aria-current="step" on current step
// - aria-label on clickable step indicators
// - Connector lines hidden from screen readers`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const a11yInfo = document.createElement('div');
    a11yInfo.style.fontFamily = 'var(--dos-font-family)';
    a11yInfo.innerHTML = `
      <p style="margin-bottom: var(--dos-space-sm);">This component implements:</p>
      <ul style="margin-bottom: var(--dos-space-md);">
        <li>✓ List structure for step sequence</li>
        <li>✓ Current step indicated with aria-current</li>
        <li>✓ Descriptive labels on clickable steps</li>
        <li>✓ Completed/error states announced</li>
        <li>✓ Keyboard navigation support</li>
        <li>✓ Focus visible indicators</li>
      </ul>
    `;
    a11yExample.appendChild(a11yInfo);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}