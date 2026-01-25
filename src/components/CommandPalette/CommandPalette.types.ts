/**
 * CommandPalette Component Types
 *
 * Type definitions for the DOS-style command palette component.
 */

/**
 * Definition for a single command
 */
export interface CommandItem {
  /** Unique identifier for the command */
  id: string;

  /** Display label for the command */
  label: string;

  /** Optional keyboard shortcut display (e.g., 'Ctrl+S') */
  shortcut?: string;

  /** Optional description for the command */
  description?: string;

  /** Optional category for grouping */
  category?: string;

  /** Optional icon (character or string) */
  icon?: string;

  /**
   * Action to execute when command is selected
   * Return false to prevent closing the palette
   */
  action: () => boolean | undefined;

  /** Whether the command is disabled */
  disabled?: boolean;

  /** Custom data associated with the command */
  data?: unknown;

  /** Keywords for search matching */
  keywords?: string[];
}

/**
 * Category definition for grouping commands
 */
export interface CommandCategory {
  /** Unique identifier for the category */
  id: string;

  /** Display label for the category */
  label: string;

  /** Optional icon for the category */
  icon?: string;

  /** Sort order (lower numbers first) */
  order?: number;
}

/**
 * Props for the CommandPalette component
 */
export interface CommandPaletteProps {
  /** Array of commands to display */
  commands: CommandItem[];

  /** Optional categories for grouping commands */
  categories?: CommandCategory[];

  /** Placeholder text for the input */
  placeholder?: string;

  /**
   * DOS-style prompt prefix
   * @default 'C:\\>'
   */
  prompt?: string;

  /**
   * Whether to show recently used commands first
   * @default true
   */
  showRecent?: boolean;

  /**
   * Maximum number of recent commands to track
   * @default 5
   */
  maxRecentCommands?: number;

  /**
   * Whether fuzzy search is enabled
   * @default false
   */
  fuzzySearch?: boolean;

  /**
   * Whether to close on command execution
   * @default true
   */
  closeOnExecute?: boolean;

  /**
   * Whether to close when clicking outside
   * @default true
   */
  closeOnClickOutside?: boolean;

  /**
   * Whether the palette starts open
   * @default false
   */
  open?: boolean;

  /** Custom CSS class name */
  className?: string;

  /** Custom id attribute */
  id?: string;

  /**
   * Callback fired when the palette is opened
   */
  onOpen?: () => void;

  /**
   * Callback fired when the palette is closed
   */
  onClose?: () => void;

  /**
   * Callback fired when a command is executed
   * @param command - The command that was executed
   */
  onExecute?: (command: CommandItem) => void;

  /**
   * Callback fired when the search query changes
   * @param query - The current search query
   */
  onSearch?: (query: string) => void;
}

/**
 * Internal state for the CommandPalette component
 */
export interface CommandPaletteState {
  /** Whether the palette is currently open */
  isOpen: boolean;

  /** Current search query */
  query: string;

  /** Currently highlighted command index */
  highlightedIndex: number;

  /** Filtered commands based on query */
  filteredCommands: CommandItem[];

  /** Recently used command IDs */
  recentCommandIds: string[];
}

/**
 * Extended HTMLElement with CommandPalette-specific methods
 */
export interface CommandPaletteElement extends HTMLDivElement {
  /**
   * Open the command palette
   */
  open(): void;

  /**
   * Close the command palette
   */
  close(): void;

  /**
   * Toggle the palette open/closed state
   */
  toggle(): void;

  /**
   * Check if the palette is open
   */
  isOpen(): boolean;

  /**
   * Get the current search query
   */
  getQuery(): string;

  /**
   * Set the search query programmatically
   * @param query - The query to set
   */
  setQuery(query: string): void;

  /**
   * Clear the search query
   */
  clearQuery(): void;

  /**
   * Execute a command by ID
   * @param commandId - The ID of the command to execute
   */
  executeCommand(commandId: string): void;

  /**
   * Get the filtered commands based on current query
   */
  getFilteredCommands(): CommandItem[];

  /**
   * Get the currently highlighted command
   */
  getHighlightedCommand(): CommandItem | null;

  /**
   * Get recently used commands
   */
  getRecentCommands(): CommandItem[];

  /**
   * Register a new command
   * @param command - The command to register
   */
  registerCommand(command: CommandItem): void;

  /**
   * Unregister a command
   * @param commandId - The ID of the command to unregister
   */
  unregisterCommand(commandId: string): void;

  /**
   * Update commands
   * @param commands - New array of commands
   */
  setCommands(commands: CommandItem[]): void;

  /**
   * Focus the input field
   */
  focus(): void;

  /**
   * Clean up event listeners
   */
  destroy(): void;
}

/**
 * Event detail for command palette open/close events
 */
export interface CommandPaletteOpenEventDetail {
  /** Whether the palette is now open */
  open: boolean;
}

/**
 * Event detail for command execution events
 */
export interface CommandPaletteExecuteEventDetail {
  /** The command that was executed */
  command: CommandItem;

  /** The search query at time of execution */
  query: string;
}
