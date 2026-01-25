/**
 * Genesis AI - Header Component
 * Title bar + full-width menu bar
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

  // Create the main header container (vertical stack)
  const header = createBox({
    className: 'genesis-header',
  });
  header.style.cssText = `
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  `;

  // Title bar at the top with app name right-aligned
  const titleBar = createBox({});
  titleBar.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 2px 8px;
    background-color: var(--dos-color-shadow);
    border-bottom: 1px solid var(--dos-color-border);
  `;

  const titleText = createText({
    children: `█ ${APP_NAME} █`,
    weight: 'bold',
    size: 'sm',
  });
  titleBar.appendChild(titleText);

  // Menu bar wrapper - full width
  const menuWrapper = createBox({});
  menuWrapper.style.cssText = `
    border-bottom: 1px solid var(--dos-color-border);
  `;
  menuBar.style.width = '100%';
  menuWrapper.appendChild(menuBar);

  // Assemble: title bar on top, menu bar below
  header.appendChild(titleBar);
  header.appendChild(menuWrapper);

  return {
    element: header,
    menuBar,
    destroy: () => {
      menuBar.destroy?.();
    },
  };
}
