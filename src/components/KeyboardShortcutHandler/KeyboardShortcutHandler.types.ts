/**
 * KeyboardShortcutHandler Component Types
 *
 * Type definitions for the keyboard shortcut management utility.
 */

import type { BaseComponentProps } from '../../types/common';

/**
 * Modifier key options
 */
export interface ModifierKeys {
  /** Control key (Command on Mac) */
  ctrl?: boolean;
  /** Alt key (Option on Mac) */
  alt?: boolean;
  /** Shift key */
  shift?: boolean;
  /** Meta key (Windows key / Command on Mac) */
  meta?: boolean;
}

/**
 * Shortcut definition
 */
export interface ShortcutDefinition {
  /**
   * Unique identifier for the shortcut
   */
  id: string;

  /**
   * The key or key combination (e.g., 'a', 'Enter', 'Escape')
   */
  key: string;

  /**
   * Modifier keys required
   */
  modifiers?: ModifierKeys;

  /**
   * Human-readable description of the shortcut
   */
  description?: string;

  /**
   * Category for grouping shortcuts
   */
  category?: string;

  /**
   * Callback function when shortcut is triggered
   */
  callback: ShortcutCallback;

  /**
   * Whether the shortcut is currently enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Prevent default browser behavior when triggered
   * @default true
   */
  preventDefault?: boolean;

  /**
   * Stop event propagation when triggered
   * @default false
   */
  stopPropagation?: boolean;

  /**
   * Whether this shortcut can repeat when key is held
   * @default false
   */
  allowRepeat?: boolean;

  /**
   * Priority when multiple shortcuts match (higher = first)
   * @default 0
   */
  priority?: number;
}

/**
 * Shortcut callback function type
 */
export type ShortcutCallback = (event: KeyboardEvent, shortcut: ShortcutDefinition) => void | boolean;

/**
 * Parsed shortcut key combination
 */
export interface ParsedShortcut {
  key: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
}

/**
 * Shortcut sequence definition for multi-key shortcuts
 */
export interface ShortcutSequence {
  /**
   * Unique identifier for the sequence
   */
  id: string;

  /**
   * Array of shortcuts that must be pressed in order
   * e.g., ['Ctrl+K', 'Ctrl+C'] for VS Code-style shortcuts
   */
  sequence: string[];

  /**
   * Maximum time between key presses (ms)
   * @default 1000
   */
  timeout?: number;

  /**
   * Description of the shortcut sequence
   */
  description?: string;

  /**
   * Category for grouping
   */
  category?: string;

  /**
   * Callback when sequence is completed
   */
  callback: ShortcutCallback;

  /**
   * Whether the sequence is enabled
   * @default true
   */
  enabled?: boolean;
}

/**
 * Props for KeyboardShortcutHandler
 */
export interface KeyboardShortcutHandlerProps extends BaseComponentProps {
  /**
   * Initial shortcuts to register
   */
  shortcuts?: ShortcutDefinition[];

  /**
   * Initial shortcut sequences to register
   */
  sequences?: ShortcutSequence[];

  /**
   * Scope element for the shortcuts (defaults to document)
   */
  scope?: HTMLElement | Document | 'global';

  /**
   * Whether the handler starts enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Whether to handle platform differences (Ctrl vs Cmd on Mac)
   * @default true
   */
  handlePlatformDifferences?: boolean;

  /**
   * Callback when any shortcut is triggered
   */
  onShortcut?: (shortcut: ShortcutDefinition, event: KeyboardEvent) => void;

  /**
   * Callback when a shortcut conflict is detected
   */
  onConflict?: (existing: ShortcutDefinition, incoming: ShortcutDefinition) => void;
}

/**
 * KeyboardShortcutHandler instance
 */
export interface KeyboardShortcutHandlerInstance {
  /**
   * Register a new shortcut
   */
  register(shortcut: ShortcutDefinition): void;

  /**
   * Register multiple shortcuts at once
   */
  registerAll(shortcuts: ShortcutDefinition[]): void;

  /**
   * Register a shortcut sequence
   */
  registerSequence(sequence: ShortcutSequence): void;

  /**
   * Unregister a shortcut by ID
   */
  unregister(id: string): void;

  /**
   * Unregister a sequence by ID
   */
  unregisterSequence(id: string): void;

  /**
   * Enable the handler
   */
  enable(): void;

  /**
   * Disable the handler
   */
  disable(): void;

  /**
   * Check if handler is enabled
   */
  isEnabled(): boolean;

  /**
   * Enable a specific shortcut by ID
   */
  enableShortcut(id: string): void;

  /**
   * Disable a specific shortcut by ID
   */
  disableShortcut(id: string): void;

  /**
   * Get all registered shortcuts
   */
  getShortcuts(): ShortcutDefinition[];

  /**
   * Get all registered sequences
   */
  getSequences(): ShortcutSequence[];

  /**
   * Get a shortcut by ID
   */
  getShortcut(id: string): ShortcutDefinition | undefined;

  /**
   * Get shortcuts by category
   */
  getShortcutsByCategory(category: string): ShortcutDefinition[];

  /**
   * Format a shortcut for display (e.g., "Ctrl+Shift+P")
   */
  formatShortcut(shortcut: ShortcutDefinition | string): string;

  /**
   * Check if a shortcut string is valid
   */
  isValidShortcut(shortcutString: string): boolean;

  /**
   * Destroy the handler and clean up
   */
  destroy(): void;
}

/**
 * Shortcut hint component props
 */
export interface ShortcutHintProps {
  /**
   * The shortcut to display
   */
  shortcut: string | ShortcutDefinition;

  /**
   * Visual style variant
   */
  variant?: 'inline' | 'badge' | 'compact';

  /**
   * Additional CSS class
   */
  className?: string;
}
