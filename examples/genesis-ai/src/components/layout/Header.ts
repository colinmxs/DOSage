/**
 * Genesis AI - Header Component
 * Top menu bar with File, Edit, View, Help menus
 */

import {
  createMenuBar,
  createBox,
  createText,
  type MenuBarElement,
} from 'dosage';
import { APP_NAME, SHORTCUTS } from '../../config';

export interface HeaderProps {
  onNewChat: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  onShowHelp: () => void;
  onShowAbout: () => void;
  onExport: () => void;
  onClearChat: () => void;
  onThemeChange: (theme: string) => void;
  onOpenCommandPalette: () => void;
}

export interface HeaderInstance {
  element: HTMLElement;
  menuBar: MenuBarElement;
  destroy: () => void;
}

export function createHeader(props: HeaderProps): HeaderInstance {
  const {
    onNewChat,
    onOpenSettings,
    onToggleSidebar,
    onShowHelp,
    onShowAbout,
    onExport,
    onClearChat,
    onThemeChange,
    onOpenCommandPalette,
  } = props;

  // Create the menu bar
  const menuBar = createMenuBar({
    items: [
      {
        label: 'File',
        accessKey: 'F',
        items: [
          {
            label: 'New Chat',
            shortcut: SHORTCUTS.newChat,
            action: onNewChat,
          },
          { label: '', divider: true },
          {
            label: 'Export...',
            shortcut: SHORTCUTS.export,
            action: onExport,
          },
          { label: '', divider: true },
          {
            label: 'Settings',
            shortcut: SHORTCUTS.settings,
            action: onOpenSettings,
          },
        ],
      },
      {
        label: 'Edit',
        accessKey: 'E',
        items: [
          {
            label: 'Clear Chat',
            shortcut: SHORTCUTS.clearChat,
            action: onClearChat,
          },
        ],
      },
      {
        label: 'View',
        accessKey: 'V',
        items: [
          {
            label: 'Toggle Sidebar',
            shortcut: SHORTCUTS.toggleSidebar,
            action: onToggleSidebar,
          },
          { label: '', divider: true },
          {
            label: 'Theme',
            items: [
              {
                label: 'DOS Blue',
                action: () => onThemeChange('dos-blue'),
              },
              {
                label: 'Amber',
                action: () => onThemeChange('amber'),
              },
              {
                label: 'Green Phosphor',
                action: () => onThemeChange('green-phosphor'),
              },
              {
                label: 'CGA',
                action: () => onThemeChange('cga'),
              },
            ],
          },
        ],
      },
      {
        label: 'Help',
        accessKey: 'H',
        items: [
          {
            label: 'Quick Commands',
            shortcut: SHORTCUTS.commandPalette,
            action: onOpenCommandPalette,
          },
          { label: '', divider: true },
          {
            label: 'Documentation',
            shortcut: SHORTCUTS.help,
            action: onShowHelp,
          },
          { label: '', divider: true },
          {
            label: 'About Genesis AI',
            action: onShowAbout,
          },
        ],
      },
    ],
  });

  // Create the header container with logo on the right
  const header = createBox({
    display: 'flex',
    className: 'genesis-header',
  });

  // Style the header for flex layout
  header.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid currentColor;
  `;

  // Menu bar on the left
  const menuWrapper = createBox({});
  menuWrapper.appendChild(menuBar);

  // Logo on the right
  const logoWrapper = createBox({
    padding: 'sm',
  });
  const logoText = createText({
    children: `[${APP_NAME}]`,
    weight: 'bold',
    size: 'sm',
  });
  logoWrapper.appendChild(logoText);

  header.appendChild(menuWrapper);
  header.appendChild(logoWrapper);

  return {
    element: header,
    menuBar,
    destroy: () => {
      menuBar.destroy?.();
    },
  };
}
