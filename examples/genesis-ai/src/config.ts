/**
 * Genesis AI - Configuration Constants
 */

import type { Settings, ThemePreset } from './types';

/** Application version */
export const APP_VERSION = '1.0.0';

/** Application name */
export const APP_NAME = 'Genesis AI';

/** Local storage key */
export const STORAGE_KEY = 'genesis-ai-data';

/** Default settings */
export const DEFAULT_SETTINGS: Settings = {
  displayName: 'User',
  theme: 'dos-blue' as ThemePreset,
  soundEnabled: false,
  showTimestamps: true,
  autoScroll: true,
  fontSize: 14,
};

/** Available theme options */
export const THEME_OPTIONS: Array<{ value: ThemePreset; label: string }> = [
  { value: 'dos-blue', label: 'DOS Blue' },
  { value: 'amber', label: 'Amber' },
  { value: 'green-phosphor', label: 'Green Phosphor' },
  { value: 'cga', label: 'CGA' },
];

/** AI response delay range (ms) */
export const AI_RESPONSE_DELAY = {
  min: 800,
  max: 2500,
};

/** Maximum messages per conversation */
export const MAX_MESSAGES = 100;

/** Maximum conversations stored */
export const MAX_CONVERSATIONS = 50;

/** Character limit for message input */
export const MESSAGE_CHAR_LIMIT = 4000;

/** ASCII Art Logo */
export const ASCII_LOGO = `
 ██████╗ ███████╗███╗   ██╗███████╗███████╗██╗███████╗
██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔════╝██║██╔════╝
██║  ███╗█████╗  ██╔██╗ ██║█████╗  ███████╗██║███████╗
██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ╚════██║██║╚════██║
╚██████╔╝███████╗██║ ╚████║███████╗███████║██║███████║
 ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝╚═╝╚══════╝
                        AI`;

/** ASCII Logo (compact) */
export const ASCII_LOGO_SMALL = '[GENESIS·AI]';

/** Keyboard shortcuts */
export const SHORTCUTS = {
  newChat: 'Ctrl+N',
  settings: 'Ctrl+,',
  commandPalette: 'Ctrl+K',
  toggleSidebar: 'F9',
  help: 'F1',
  send: 'Ctrl+Enter',
  export: 'Ctrl+E',
  clearChat: 'Ctrl+L',
} as const;
