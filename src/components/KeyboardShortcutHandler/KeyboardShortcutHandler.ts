/**
 * KeyboardShortcutHandler Component
 *
 * A utility for managing keyboard shortcuts with support for:
 * - Single key shortcuts (e.g., 'Escape')
 * - Modifier combinations (e.g., 'Ctrl+Shift+P')
 * - Key sequences (e.g., 'Ctrl+K Ctrl+C')
 * - Platform differences (Ctrl vs Cmd on Mac)
 * - Scoped shortcuts (global or element-specific)
 */

import type {
  KeyboardShortcutHandlerProps,
  KeyboardShortcutHandlerInstance,
  ShortcutDefinition,
  ShortcutSequence,
  ParsedShortcut,
  ShortcutHintProps,
} from './KeyboardShortcutHandler.types';
import './KeyboardShortcutHandler.css';

/** Detect if running on Mac */
const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

/** Map of key aliases for normalization */
const KEY_ALIASES: Record<string, string> = {
  'esc': 'Escape',
  'escape': 'Escape',
  'return': 'Enter',
  'enter': 'Enter',
  'space': ' ',
  'spacebar': ' ',
  'up': 'ArrowUp',
  'down': 'ArrowDown',
  'left': 'ArrowLeft',
  'right': 'ArrowRight',
  'pageup': 'PageUp',
  'pagedown': 'PageDown',
  'del': 'Delete',
  'delete': 'Delete',
  'ins': 'Insert',
  'insert': 'Insert',
  'plus': '+',
  'minus': '-',
};

/** Map of modifier key names to their property names */
const MODIFIER_MAP: Record<string, 'ctrl' | 'alt' | 'shift' | 'meta'> = {
  'ctrl': 'ctrl',
  'control': 'ctrl',
  'alt': 'alt',
  'option': 'alt',
  'shift': 'shift',
  'meta': 'meta',
  'cmd': 'meta',
  'command': 'meta',
  'win': 'meta',
  'windows': 'meta',
};

/**
 * Parses a shortcut string into a structured format.
 * Supports formats like: 'Ctrl+Shift+P', 'Alt+F4', 'Escape'
 */
export function parseShortcut(shortcutString: string): ParsedShortcut {
  const parts = shortcutString.toLowerCase().split('+').map(p => p.trim());
  
  const result: ParsedShortcut = {
    key: '',
    ctrl: false,
    alt: false,
    shift: false,
    meta: false,
  };

  for (const part of parts) {
    if (MODIFIER_MAP[part]) {
      result[MODIFIER_MAP[part]] = true;
    } else {
      // This is the key
      result.key = KEY_ALIASES[part] || part;
    }
  }

  // Normalize key case for letters
  if (result.key.length === 1) {
    result.key = result.key.toLowerCase();
  } else {
    // Capitalize first letter for special keys
    result.key = result.key.charAt(0).toUpperCase() + result.key.slice(1);
  }

  return result;
}

/**
 * Formats a parsed shortcut or shortcut definition for display.
 */
export function formatShortcutString(shortcut: ParsedShortcut | ShortcutDefinition | string): string {
  let parsed: ParsedShortcut;

  if (typeof shortcut === 'string') {
    parsed = parseShortcut(shortcut);
  } else if ('callback' in shortcut) {
    // It's a ShortcutDefinition
    return formatShortcutString({
      key: shortcut.key,
      ctrl: shortcut.modifiers?.ctrl || false,
      alt: shortcut.modifiers?.alt || false,
      shift: shortcut.modifiers?.shift || false,
      meta: shortcut.modifiers?.meta || false,
    });
  } else {
    parsed = shortcut;
  }

  const parts: string[] = [];

  if (parsed.ctrl) parts.push(isMac ? '⌘' : 'Ctrl');
  if (parsed.alt) parts.push(isMac ? '⌥' : 'Alt');
  if (parsed.shift) parts.push(isMac ? '⇧' : 'Shift');
  if (parsed.meta && !isMac) parts.push('Win');

  // Format the key
  let keyDisplay = parsed.key;
  if (keyDisplay === ' ') keyDisplay = 'Space';
  if (keyDisplay === 'ArrowUp') keyDisplay = '↑';
  if (keyDisplay === 'ArrowDown') keyDisplay = '↓';
  if (keyDisplay === 'ArrowLeft') keyDisplay = '←';
  if (keyDisplay === 'ArrowRight') keyDisplay = '→';
  if (keyDisplay.length === 1) keyDisplay = keyDisplay.toUpperCase();

  parts.push(keyDisplay);

  return parts.join('+');
}

/**
 * Checks if a keyboard event matches a parsed shortcut.
 */
function matchesShortcut(event: KeyboardEvent, parsed: ParsedShortcut, handlePlatform: boolean): boolean {
  // Check modifiers
  const ctrlMatch = handlePlatform && isMac
    ? (parsed.ctrl ? event.metaKey : !event.metaKey)
    : (parsed.ctrl === event.ctrlKey);
  
  if (!ctrlMatch) return false;
  if (parsed.alt !== event.altKey) return false;
  if (parsed.shift !== event.shiftKey) return false;
  
  // On non-Mac, check meta separately
  if (!isMac && parsed.meta !== event.metaKey) return false;

  // Check key
  const eventKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  const shortcutKey = parsed.key.length === 1 ? parsed.key.toLowerCase() : parsed.key;

  return eventKey === shortcutKey;
}

/**
 * Creates a keyboard shortcut handler instance.
 *
 * @example
 * ```typescript
 * const shortcuts = createKeyboardShortcutHandler({
 *   shortcuts: [
 *     {
 *       id: 'save',
 *       key: 's',
 *       modifiers: { ctrl: true },
 *       description: 'Save document',
 *       callback: () => save(),
 *     },
 *     {
 *       id: 'close',
 *       key: 'Escape',
 *       description: 'Close dialog',
 *       callback: () => close(),
 *     },
 *   ],
 * });
 *
 * // Later: register more shortcuts
 * shortcuts.register({
 *   id: 'undo',
 *   key: 'z',
 *   modifiers: { ctrl: true },
 *   callback: () => undo(),
 * });
 *
 * // Cleanup
 * shortcuts.destroy();
 * ```
 */
export function createKeyboardShortcutHandler(
  props: KeyboardShortcutHandlerProps = {}
): KeyboardShortcutHandlerInstance {
  const {
    shortcuts: initialShortcuts = [],
    sequences: initialSequences = [],
    scope = 'global',
    enabled: initialEnabled = true,
    handlePlatformDifferences = true,
    onShortcut,
    onConflict,
  } = props;

  // State
  let isEnabled = initialEnabled;
  const shortcuts = new Map<string, ShortcutDefinition>();
  const sequences = new Map<string, ShortcutSequence>();
  const parsedShortcuts = new Map<string, ParsedShortcut>();

  // Sequence tracking
  let currentSequence: string[] = [];
  let sequenceTimeoutId: ReturnType<typeof setTimeout> | null = null;

  // Resolve scope element
  const scopeElement: HTMLElement | Document = scope === 'global'
    ? document
    : scope;

  /**
   * Generates a unique key for a shortcut based on its modifiers and key.
   */
  function getShortcutKey(shortcut: ShortcutDefinition): string {
    const mods = shortcut.modifiers || {};
    return [
      mods.ctrl ? 'ctrl' : '',
      mods.alt ? 'alt' : '',
      mods.shift ? 'shift' : '',
      mods.meta ? 'meta' : '',
      shortcut.key.toLowerCase(),
    ].filter(Boolean).join('+');
  }

  /**
   * Registers a shortcut.
   */
  function register(shortcut: ShortcutDefinition): void {
    const key = getShortcutKey(shortcut);

    // Check for conflicts
    if (shortcuts.has(shortcut.id)) {
      console.warn(`KeyboardShortcutHandler: Shortcut with id "${shortcut.id}" already exists, replacing.`);
    }

    // Check if another shortcut has the same key combination
    for (const [existingId, existing] of shortcuts) {
      if (existingId !== shortcut.id && getShortcutKey(existing) === key) {
        onConflict?.(existing, shortcut);
      }
    }

    // Store shortcut
    shortcuts.set(shortcut.id, {
      ...shortcut,
      enabled: shortcut.enabled !== false,
      preventDefault: shortcut.preventDefault !== false,
      stopPropagation: shortcut.stopPropagation || false,
      allowRepeat: shortcut.allowRepeat || false,
      priority: shortcut.priority || 0,
    });

    // Parse and cache
    parsedShortcuts.set(shortcut.id, parseShortcut(
      [
        shortcut.modifiers?.ctrl ? 'ctrl' : '',
        shortcut.modifiers?.alt ? 'alt' : '',
        shortcut.modifiers?.shift ? 'shift' : '',
        shortcut.modifiers?.meta ? 'meta' : '',
        shortcut.key,
      ].filter(Boolean).join('+')
    ));
  }

  /**
   * Registers multiple shortcuts.
   */
  function registerAll(shortcutList: ShortcutDefinition[]): void {
    shortcutList.forEach(register);
  }

  /**
   * Registers a shortcut sequence.
   */
  function registerSequence(sequence: ShortcutSequence): void {
    sequences.set(sequence.id, {
      ...sequence,
      enabled: sequence.enabled !== false,
      timeout: sequence.timeout || 1000,
    });
  }

  /**
   * Unregisters a shortcut.
   */
  function unregister(id: string): void {
    shortcuts.delete(id);
    parsedShortcuts.delete(id);
  }

  /**
   * Unregisters a sequence.
   */
  function unregisterSequence(id: string): void {
    sequences.delete(id);
  }

  /**
   * Resets the sequence tracking state.
   */
  function resetSequence(): void {
    currentSequence = [];
    if (sequenceTimeoutId) {
      clearTimeout(sequenceTimeoutId);
      sequenceTimeoutId = null;
    }
  }

  /**
   * Handles keydown events.
   */
  function handleKeyDown(event: KeyboardEvent): void {
    if (!isEnabled) return;

    // Note: We could check if target is an input element and skip shortcuts,
    // but for now we handle all shortcuts globally
    // const target = event.target as HTMLElement;

    // Build current key string for sequence matching
    const currentKey = formatShortcutString({
      key: event.key,
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: event.metaKey,
    });

    // Check sequences first
    if (sequences.size > 0) {
      currentSequence.push(currentKey);

      // Reset timeout
      if (sequenceTimeoutId) {
        clearTimeout(sequenceTimeoutId);
      }

      // Check if any sequence matches
      for (const [, seq] of sequences) {
        if (!seq.enabled) continue;

        const seqKeys = seq.sequence;
        const matches = currentSequence.length <= seqKeys.length &&
          currentSequence.every((key, i) => {
            const expectedKey = seqKeys[i];
            if (!expectedKey) return false;
            const expectedParsed = parseShortcut(expectedKey);
            const actualParsed = parseShortcut(key);
            return expectedParsed.key === actualParsed.key &&
                   expectedParsed.ctrl === actualParsed.ctrl &&
                   expectedParsed.alt === actualParsed.alt &&
                   expectedParsed.shift === actualParsed.shift &&
                   expectedParsed.meta === actualParsed.meta;
          });

        if (matches && currentSequence.length === seqKeys.length) {
          // Complete sequence match!
          event.preventDefault();
          resetSequence();
          seq.callback(event, seq as unknown as ShortcutDefinition);
          return;
        } else if (matches) {
          // Partial match, set timeout
          sequenceTimeoutId = setTimeout(resetSequence, seq.timeout);
        }
      }

      // If no partial matches, reset
      let hasPartialMatch = false;
      for (const [, seq] of sequences) {
        if (!seq.enabled) continue;
        const seqKeys = seq.sequence;
        if (currentSequence.length <= seqKeys.length) {
          const partialMatch = currentSequence.every((key, i) => {
            const expectedKey = seqKeys[i];
            if (!expectedKey) return false;
            const expectedParsed = parseShortcut(expectedKey);
            const actualParsed = parseShortcut(key);
            return expectedParsed.key === actualParsed.key &&
                   expectedParsed.ctrl === actualParsed.ctrl &&
                   expectedParsed.alt === actualParsed.alt &&
                   expectedParsed.shift === actualParsed.shift;
          });
          if (partialMatch) {
            hasPartialMatch = true;
            break;
          }
        }
      }
      if (!hasPartialMatch) {
        resetSequence();
      }
    }

    // Check regular shortcuts
    // Sort by priority (higher first)
    const sortedShortcuts = Array.from(shortcuts.values())
      .filter(s => s.enabled !== false)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    for (const shortcut of sortedShortcuts) {
      const parsed = parsedShortcuts.get(shortcut.id);
      if (!parsed) continue;

      // Skip if repeating and not allowed
      if (event.repeat && !shortcut.allowRepeat) continue;

      if (matchesShortcut(event, parsed, handlePlatformDifferences)) {
        // Found a match!
        if (shortcut.preventDefault) {
          event.preventDefault();
        }
        if (shortcut.stopPropagation) {
          event.stopPropagation();
        }

        // Fire callbacks
        onShortcut?.(shortcut, event);
        const result = shortcut.callback(event, shortcut);

        // If callback returns false, don't process further shortcuts
        if (result === false) {
          break;
        }

        // Only process one shortcut per keystroke
        break;
      }
    }
  }

  /**
   * Enables the handler.
   */
  function enable(): void {
    isEnabled = true;
  }

  /**
   * Disables the handler.
   */
  function disable(): void {
    isEnabled = false;
    resetSequence();
  }

  /**
   * Enables a specific shortcut.
   */
  function enableShortcut(id: string): void {
    const shortcut = shortcuts.get(id);
    if (shortcut) {
      shortcut.enabled = true;
    }
  }

  /**
   * Disables a specific shortcut.
   */
  function disableShortcut(id: string): void {
    const shortcut = shortcuts.get(id);
    if (shortcut) {
      shortcut.enabled = false;
    }
  }

  /**
   * Gets all registered shortcuts.
   */
  function getShortcuts(): ShortcutDefinition[] {
    return Array.from(shortcuts.values());
  }

  /**
   * Gets all registered sequences.
   */
  function getSequences(): ShortcutSequence[] {
    return Array.from(sequences.values());
  }

  /**
   * Gets a shortcut by ID.
   */
  function getShortcut(id: string): ShortcutDefinition | undefined {
    return shortcuts.get(id);
  }

  /**
   * Gets shortcuts by category.
   */
  function getShortcutsByCategory(category: string): ShortcutDefinition[] {
    return Array.from(shortcuts.values()).filter(s => s.category === category);
  }

  /**
   * Checks if a shortcut string is valid.
   */
  function isValidShortcut(shortcutString: string): boolean {
    try {
      const parsed = parseShortcut(shortcutString);
      return parsed.key !== '';
    } catch {
      return false;
    }
  }

  /**
   * Destroys the handler.
   */
  function destroy(): void {
    disable();
    scopeElement.removeEventListener('keydown', handleKeyDown as EventListener);
    shortcuts.clear();
    sequences.clear();
    parsedShortcuts.clear();
  }

  // Initialize
  registerAll(initialShortcuts);
  initialSequences.forEach(registerSequence);
  scopeElement.addEventListener('keydown', handleKeyDown as EventListener);

  // Return instance
  return {
    register,
    registerAll,
    registerSequence,
    unregister,
    unregisterSequence,
    enable,
    disable,
    isEnabled: () => isEnabled,
    enableShortcut,
    disableShortcut,
    getShortcuts,
    getSequences,
    getShortcut,
    getShortcutsByCategory,
    formatShortcut: formatShortcutString,
    isValidShortcut,
    destroy,
  };
}

/**
 * Creates a visual hint element for a keyboard shortcut.
 *
 * @example
 * ```typescript
 * const hint = createShortcutHint({
 *   shortcut: 'Ctrl+S',
 *   variant: 'badge',
 * });
 * button.appendChild(hint);
 * ```
 */
export function createShortcutHint(props: ShortcutHintProps): HTMLElement {
  const { shortcut, variant = 'inline', className } = props;

  const formatted = typeof shortcut === 'string'
    ? shortcut
    : formatShortcutString(shortcut);

  const container = document.createElement('span');
  container.className = `dos-shortcut-hint dos-shortcut-hint--${variant}`;
  if (className) {
    container.classList.add(className);
  }
  container.setAttribute('aria-label', `Keyboard shortcut: ${formatted}`);

  // Split by + but handle the case where + is the actual key
  const parts = formatted.split('+').filter(Boolean);

  parts.forEach((part, index) => {
    // Create key element
    const keyEl = document.createElement('span');
    keyEl.className = 'dos-shortcut-hint___key';
    keyEl.textContent = part.trim();
    container.appendChild(keyEl);

    // Add separator (except after last key)
    if (index < parts.length - 1) {
      const separator = document.createElement('span');
      separator.className = 'dos-shortcut-hint___separator';
      separator.textContent = '+';
      separator.setAttribute('aria-hidden', 'true');
      container.appendChild(separator);
    }
  });

  return container;
}
