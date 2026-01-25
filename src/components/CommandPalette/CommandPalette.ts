/**
 * CommandPalette Component
 *
 * A DOS-style command palette with search, keyboard navigation, and command execution.
 * Similar to VS Code's command palette (Ctrl+Shift+P).
 */

import type {
  CommandPaletteProps,
  CommandItem,
  CommandCategory,
  CommandPaletteState,
  CommandPaletteElement,
  CommandPaletteOpenEventDetail,
  CommandPaletteExecuteEventDetail,
} from './CommandPalette.types';
import { createDOSCursor, type DOSCursorInstance } from '../../utils/DOSCursor';
import './CommandPalette.css';

/**
 * Creates a DOS-style command palette component.
 *
 * @param props - CommandPalette configuration options
 * @returns The command palette element with attached methods
 *
 * @example
 * ```typescript
 * import { createCommandPalette } from 'dosage';
 *
 * const palette = createCommandPalette({
 *   commands: [
 *     { id: 'save', label: 'Save File', shortcut: 'Ctrl+S', action: () => saveFile() },
 *     { id: 'open', label: 'Open File', shortcut: 'Ctrl+O', action: () => openFile() },
 *   ],
 *   onExecute: (cmd) => console.log(`Executed: ${cmd.label}`)
 * });
 *
 * document.body.appendChild(palette);
 * palette.open();
 * ```
 */
export function createCommandPalette(props: CommandPaletteProps): CommandPaletteElement {
  const {
    commands: initialCommands,
    categories = [],
    placeholder = 'Type a command...',
    prompt = 'C:\\>',
    showRecent = true,
    maxRecentCommands = 5,
    fuzzySearch = false,
    closeOnExecute = true,
    closeOnClickOutside = true,
    open: initialOpen = false,
    className,
    id,
    onOpen,
    onClose,
    onExecute,
    onSearch,
  } = props;

  // Track commands (mutable)
  let commands = [...initialCommands];

  // State - always start closed, openPalette() will handle initial open
  const state: CommandPaletteState = {
    isOpen: false,
    query: '',
    highlightedIndex: 0,
    filteredCommands: [],
    recentCommandIds: [],
  };

  // Create container
  const container = document.createElement('div') as CommandPaletteElement;
  container.className = buildContainerClasses();

  if (id) {
    container.id = id;
  }

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'dos-commandpalette__overlay';

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'dos-commandpalette__modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Command palette');

  // Create input container
  const inputContainer = document.createElement('div');
  inputContainer.className = 'dos-commandpalette__input-container';

  // Create prompt
  const promptEl = document.createElement('span');
  promptEl.className = 'dos-commandpalette__prompt';
  promptEl.textContent = prompt;
  promptEl.setAttribute('aria-hidden', 'true');

  // Create input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'dos-commandpalette__input';
  input.placeholder = placeholder;
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', `${id || 'cmdpalette'}-results`);
  input.setAttribute('aria-haspopup', 'listbox');

  inputContainer.appendChild(promptEl);
  inputContainer.appendChild(input);

  // Create results container
  const results = document.createElement('div');
  results.className = 'dos-commandpalette__results';
  results.id = `${id || 'cmdpalette'}-results`;
  results.setAttribute('role', 'listbox');

  // Create empty state
  const emptyState = document.createElement('div');
  emptyState.className = 'dos-commandpalette__empty';
  emptyState.textContent = 'No commands found';

  // Assemble modal
  modal.appendChild(inputContainer);
  modal.appendChild(results);
  modal.appendChild(emptyState);

  // Assemble container
  container.appendChild(overlay);
  container.appendChild(modal);

  // Initialize DOS block cursor overlay
  let cursor: DOSCursorInstance | null = null;
  cursor = createDOSCursor({
    input,
    wrapper: inputContainer,
    readonly: false,
    disabled: false,
  });

  /**
   * Build container class string
   */
  function buildContainerClasses(): string {
    const classes = ['dos-commandpalette'];
    if (className) {
      classes.push(className);
    }
    return classes.join(' ');
  }

  /**
   * Filter commands based on query
   */
  function filterCommands(query: string): CommandItem[] {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      // Return all commands, with recent ones first if enabled
      if (showRecent && state.recentCommandIds.length > 0) {
        const recent = state.recentCommandIds
          .map((id) => commands.find((c) => c.id === id))
          .filter((c): c is CommandItem => c !== undefined)
          .slice(0, maxRecentCommands);

        const others = commands.filter((c) => !state.recentCommandIds.includes(c.id));
        return [...recent, ...others];
      }
      return [...commands];
    }

    const filtered = commands.filter((command) => {
      if (fuzzySearch) {
        return fuzzyMatch(normalizedQuery, command);
      } else {
        return substringMatch(normalizedQuery, command);
      }
    });

    // Sort by relevance (label starts with query first)
    return filtered.sort((a, b) => {
      const aStarts = a.label.toLowerCase().startsWith(normalizedQuery);
      const bStarts = b.label.toLowerCase().startsWith(normalizedQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });
  }

  /**
   * Simple substring matching
   */
  function substringMatch(query: string, command: CommandItem): boolean {
    const searchText = [
      command.label,
      command.description,
      command.category,
      ...(command.keywords || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchText.includes(query);
  }

  /**
   * Basic fuzzy matching
   */
  function fuzzyMatch(query: string, command: CommandItem): boolean {
    const searchText = [
      command.label,
      command.description,
      command.category,
      ...(command.keywords || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    let queryIndex = 0;
    for (let i = 0; i < searchText.length && queryIndex < query.length; i++) {
      if (searchText[i] === query[queryIndex]) {
        queryIndex++;
      }
    }
    return queryIndex === query.length;
  }

  /**
   * Render the results list
   */
  function renderResults(): void {
    results.innerHTML = '';

    if (state.filteredCommands.length === 0) {
      emptyState.hidden = false;
      results.hidden = true;
      input.setAttribute('aria-activedescendant', '');
      return;
    }

    emptyState.hidden = true;
    results.hidden = false;

    // Group by category if categories exist
    const categoryMap = new Map<string, CommandCategory>();
    categories.forEach((cat) => categoryMap.set(cat.id, cat));

    if (categories.length > 0) {
      renderGroupedResults(categoryMap);
    } else {
      renderFlatResults();
    }

    // Update aria-activedescendant
    const activeId = `${id || 'cmdpalette'}-item-${state.highlightedIndex}`;
    input.setAttribute('aria-activedescendant', activeId);
  }

  /**
   * Render results grouped by category
   */
  function renderGroupedResults(categoryMap: Map<string, CommandCategory>): void {
    const grouped = new Map<string, CommandItem[]>();

    state.filteredCommands.forEach((cmd) => {
      const categoryId = cmd.category || 'uncategorized';
      if (!grouped.has(categoryId)) {
        grouped.set(categoryId, []);
      }
      grouped.get(categoryId)!.push(cmd);
    });

    // Sort categories
    const sortedCategories = Array.from(grouped.keys()).sort((a, b) => {
      const catA = categoryMap.get(a);
      const catB = categoryMap.get(b);
      return (catA?.order || 999) - (catB?.order || 999);
    });

    let globalIndex = 0;

    sortedCategories.forEach((categoryId) => {
      const category = categoryMap.get(categoryId);
      const categoryCommands = grouped.get(categoryId)!;

      // Category header
      if (category) {
        const header = document.createElement('div');
        header.className = 'dos-commandpalette__category';
        header.textContent = category.icon ? `${category.icon} ${category.label}` : category.label;
        header.setAttribute('role', 'presentation');
        results.appendChild(header);
      }

      // Commands
      categoryCommands.forEach((cmd) => {
        const item = createCommandItem(cmd, globalIndex);
        results.appendChild(item);
        globalIndex++;
      });
    });
  }

  /**
   * Render flat results list
   */
  function renderFlatResults(): void {
    // Check if we should show "Recent" section
    const hasRecentSection =
      showRecent &&
      state.recentCommandIds.length > 0 &&
      !state.query;

    if (hasRecentSection) {
      const recentCount = Math.min(maxRecentCommands, state.recentCommandIds.length);
      let index = 0;

      // Recent header
      const recentHeader = document.createElement('div');
      recentHeader.className = 'dos-commandpalette__category';
      recentHeader.textContent = '► Recent';
      recentHeader.setAttribute('role', 'presentation');
      results.appendChild(recentHeader);

      // Recent commands
      state.filteredCommands.slice(0, recentCount).forEach((cmd) => {
        const item = createCommandItem(cmd, index);
        results.appendChild(item);
        index++;
      });

      // Other commands header (if there are more)
      if (state.filteredCommands.length > recentCount) {
        const otherHeader = document.createElement('div');
        otherHeader.className = 'dos-commandpalette__category';
        otherHeader.textContent = '► All Commands';
        otherHeader.setAttribute('role', 'presentation');
        results.appendChild(otherHeader);

        state.filteredCommands.slice(recentCount).forEach((cmd) => {
          const item = createCommandItem(cmd, index);
          results.appendChild(item);
          index++;
        });
      }
    } else {
      state.filteredCommands.forEach((cmd, index) => {
        const item = createCommandItem(cmd, index);
        results.appendChild(item);
      });
    }
  }

  /**
   * Create a command item element
   */
  function createCommandItem(command: CommandItem, index: number): HTMLDivElement {
    const item = document.createElement('div');
    item.className = 'dos-commandpalette__item';
    item.id = `${id || 'cmdpalette'}-item-${index}`;
    item.setAttribute('role', 'option');
    item.setAttribute('data-command-id', command.id);
    item.setAttribute('data-index', String(index));

    if (command.disabled) {
      item.classList.add('dos-commandpalette__item--disabled');
      item.setAttribute('aria-disabled', 'true');
    }

    if (index === state.highlightedIndex) {
      item.classList.add('dos-commandpalette__item--highlighted');
      item.setAttribute('aria-selected', 'true');
    }

    // Icon
    if (command.icon) {
      const icon = document.createElement('span');
      icon.className = 'dos-commandpalette__item-icon';
      icon.textContent = command.icon;
      icon.setAttribute('aria-hidden', 'true');
      item.appendChild(icon);
    }

    // Label container
    const labelContainer = document.createElement('div');
    labelContainer.className = 'dos-commandpalette__item-content';

    // Label
    const label = document.createElement('span');
    label.className = 'dos-commandpalette__item-label';
    label.innerHTML = highlightMatches(command.label, state.query);
    labelContainer.appendChild(label);

    // Description
    if (command.description) {
      const desc = document.createElement('span');
      desc.className = 'dos-commandpalette__item-description';
      desc.textContent = command.description;
      labelContainer.appendChild(desc);
    }

    item.appendChild(labelContainer);

    // Shortcut
    if (command.shortcut) {
      const shortcut = document.createElement('span');
      shortcut.className = 'dos-commandpalette__item-shortcut';
      shortcut.textContent = command.shortcut;
      item.appendChild(shortcut);
    }

    // Click handler
    item.addEventListener('click', () => {
      if (!command.disabled) {
        executeCommandInternal(command);
      }
    });

    // Hover handler
    item.addEventListener('mouseenter', () => {
      state.highlightedIndex = index;
      updateHighlight();
    });

    return item;
  }

  /**
   * Highlight matching text
   */
  function highlightMatches(text: string, query: string): string {
    if (!query) return escapeHtml(text);

    const normalizedQuery = query.toLowerCase();
    const normalizedText = text.toLowerCase();
    const index = normalizedText.indexOf(normalizedQuery);

    if (index === -1) return escapeHtml(text);

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    return `${escapeHtml(before)}<mark class="dos-commandpalette__highlight">${escapeHtml(match)}</mark>${escapeHtml(after)}`;
  }

  /**
   * Escape HTML special characters
   */
  function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Update highlight state
   */
  function updateHighlight(): void {
    const items = results.querySelectorAll('.dos-commandpalette__item');
    items.forEach((item, index) => {
      if (index === state.highlightedIndex) {
        item.classList.add('dos-commandpalette__item--highlighted');
        item.setAttribute('aria-selected', 'true');
        // scrollIntoView may not exist in jsdom test environment
        if (typeof item.scrollIntoView === 'function') {
          item.scrollIntoView({ block: 'nearest' });
        }
      } else {
        item.classList.remove('dos-commandpalette__item--highlighted');
        item.setAttribute('aria-selected', 'false');
      }
    });

    // Update aria-activedescendant
    const activeId = `${id || 'cmdpalette'}-item-${state.highlightedIndex}`;
    input.setAttribute('aria-activedescendant', activeId);
  }

  /**
   * Execute a command
   */
  function executeCommandInternal(command: CommandItem): void {
    // Add to recent
    if (showRecent) {
      state.recentCommandIds = [
        command.id,
        ...state.recentCommandIds.filter((id) => id !== command.id),
      ].slice(0, maxRecentCommands);
    }

    // Dispatch event
    const event = new CustomEvent<CommandPaletteExecuteEventDetail>('dos:commandpalette:execute', {
      bubbles: true,
      detail: {
        command,
        query: state.query,
      },
    });
    container.dispatchEvent(event);

    // Callback
    if (onExecute) {
      onExecute(command);
    }

    // Execute action
    const result = command.action();

    // Close if configured
    if (closeOnExecute && result !== false) {
      closePalette();
    }
  }

  /**
   * Handle input changes
   */
  function handleInput(): void {
    state.query = input.value;
    state.filteredCommands = filterCommands(state.query);
    state.highlightedIndex = 0;

    renderResults();

    if (onSearch) {
      onSearch(state.query);
    }
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (state.filteredCommands.length > 0) {
          state.highlightedIndex = (state.highlightedIndex + 1) % state.filteredCommands.length;
          updateHighlight();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (state.filteredCommands.length > 0) {
          state.highlightedIndex =
            (state.highlightedIndex - 1 + state.filteredCommands.length) %
            state.filteredCommands.length;
          updateHighlight();
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (state.filteredCommands.length > 0 && state.highlightedIndex >= 0) {
          const command = state.filteredCommands[state.highlightedIndex];
          if (command && !command.disabled) {
            executeCommandInternal(command);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        closePalette();
        break;

      case 'Home':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          state.highlightedIndex = 0;
          updateHighlight();
        }
        break;

      case 'End':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          state.highlightedIndex = Math.max(0, state.filteredCommands.length - 1);
          updateHighlight();
        }
        break;
    }
  }

  /**
   * Handle clicks outside the modal
   */
  function handleOverlayClick(event: MouseEvent): void {
    if (closeOnClickOutside && event.target === overlay) {
      closePalette();
    }
  }

  /**
   * Open the palette
   */
  function openPalette(): void {
    if (state.isOpen) return;

    state.isOpen = true;
    state.query = '';
    state.highlightedIndex = 0;
    state.filteredCommands = filterCommands('');

    container.classList.add('dos-commandpalette--open');
    input.value = '';
    input.setAttribute('aria-expanded', 'true');

    renderResults();

    // Focus input after render
    requestAnimationFrame(() => {
      input.focus();
    });

    // Dispatch event
    const event = new CustomEvent<CommandPaletteOpenEventDetail>('dos:commandpalette:open', {
      bubbles: true,
      detail: { open: true },
    });
    container.dispatchEvent(event);

    if (onOpen) {
      onOpen();
    }
  }

  /**
   * Close the palette
   */
  function closePalette(): void {
    if (!state.isOpen) return;

    state.isOpen = false;
    container.classList.remove('dos-commandpalette--open');
    input.setAttribute('aria-expanded', 'false');

    // Dispatch event
    const event = new CustomEvent<CommandPaletteOpenEventDetail>('dos:commandpalette:close', {
      bubbles: true,
      detail: { open: false },
    });
    container.dispatchEvent(event);

    if (onClose) {
      onClose();
    }
  }

  // Set up event listeners
  input.addEventListener('input', handleInput);
  input.addEventListener('keydown', handleKeyDown);
  overlay.addEventListener('click', handleOverlayClick);

  // Initial state
  if (initialOpen) {
    openPalette();
  }

  // Public API methods
  container.open = () => openPalette();
  container.close = () => closePalette();
  container.toggle = () => (state.isOpen ? closePalette() : openPalette());
  container.isOpen = () => state.isOpen;

  container.getQuery = () => state.query;

  container.setQuery = (query: string) => {
    input.value = query;
    handleInput();
  };

  container.clearQuery = () => {
    input.value = '';
    handleInput();
  };

  container.executeCommand = (commandId: string) => {
    const command = commands.find((c) => c.id === commandId);
    if (command && !command.disabled) {
      executeCommandInternal(command);
    }
  };

  container.getFilteredCommands = () => [...state.filteredCommands];

  container.getHighlightedCommand = (): CommandItem | null => {
    if (state.highlightedIndex >= 0 && state.highlightedIndex < state.filteredCommands.length) {
      return state.filteredCommands[state.highlightedIndex] ?? null;
    }
    return null;
  };

  container.getRecentCommands = () => {
    return state.recentCommandIds
      .map((id) => commands.find((c) => c.id === id))
      .filter((c): c is CommandItem => c !== undefined);
  };

  container.registerCommand = (command: CommandItem) => {
    if (!commands.find((c) => c.id === command.id)) {
      commands.push(command);
      if (state.isOpen) {
        state.filteredCommands = filterCommands(state.query);
        renderResults();
      }
    }
  };

  container.unregisterCommand = (commandId: string) => {
    commands = commands.filter((c) => c.id !== commandId);
    state.recentCommandIds = state.recentCommandIds.filter((id) => id !== commandId);
    if (state.isOpen) {
      state.filteredCommands = filterCommands(state.query);
      renderResults();
    }
  };

  container.setCommands = (newCommands: CommandItem[]) => {
    commands = [...newCommands];
    if (state.isOpen) {
      state.filteredCommands = filterCommands(state.query);
      state.highlightedIndex = 0;
      renderResults();
    }
  };

  container.focus = () => {
    if (state.isOpen) {
      input.focus();
    }
  };

  container.destroy = () => {
    input.removeEventListener('input', handleInput);
    input.removeEventListener('keydown', handleKeyDown);
    overlay.removeEventListener('click', handleOverlayClick);
    // Clean up cursor
    cursor?.destroy();
    cursor = null;
  };

  return container;
}
