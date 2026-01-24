/**
 * CommandPalette Component Tests
 *
 * Comprehensive tests for the DOS-style command palette component.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCommandPalette, type CommandPaletteProps, type CommandItem } from '../../src/components/CommandPalette';

describe('CommandPalette', () => {
  let container: HTMLElement;

  const defaultCommands: CommandItem[] = [
    { id: 'cmd1', label: 'Save File', shortcut: 'Ctrl+S', action: vi.fn() },
    { id: 'cmd2', label: 'Open File', shortcut: 'Ctrl+O', action: vi.fn() },
    { id: 'cmd3', label: 'Close File', shortcut: 'Ctrl+W', action: vi.fn() },
    { id: 'cmd4', label: 'Help', action: vi.fn() },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  function createTestPalette(props: Partial<CommandPaletteProps> = {}) {
    const palette = createCommandPalette({
      commands: defaultCommands.map(cmd => ({ ...cmd, action: vi.fn() })),
      id: 'test-palette',
      ...props,
    });
    container.appendChild(palette);
    return palette;
  }

  describe('rendering', () => {
    it('renders with default props', () => {
      const palette = createTestPalette();

      expect(palette).toBeInstanceOf(HTMLElement);
      expect(palette.classList.contains('dos-commandpalette')).toBe(true);
    });

    it('renders with custom id', () => {
      const palette = createTestPalette({ id: 'my-palette' });

      expect(palette.id).toBe('my-palette');
    });

    it('renders with custom className', () => {
      const palette = createTestPalette({ className: 'custom-class' });

      expect(palette.classList.contains('custom-class')).toBe(true);
    });

    it('is hidden by default', () => {
      const palette = createTestPalette();

      expect(palette.classList.contains('dos-commandpalette--open')).toBe(false);
    });

    it('can start open', () => {
      const palette = createTestPalette({ open: true });

      expect(palette.classList.contains('dos-commandpalette--open')).toBe(true);
    });

    it('renders overlay', () => {
      const palette = createTestPalette();

      const overlay = palette.querySelector('.dos-commandpalette__overlay');
      expect(overlay).not.toBeNull();
    });

    it('renders modal', () => {
      const palette = createTestPalette();

      const modal = palette.querySelector('.dos-commandpalette__modal');
      expect(modal).not.toBeNull();
    });

    it('renders input', () => {
      const palette = createTestPalette();

      const input = palette.querySelector('.dos-commandpalette__input');
      expect(input).not.toBeNull();
    });

    it('renders prompt with default value', () => {
      const palette = createTestPalette();

      const prompt = palette.querySelector('.dos-commandpalette__prompt');
      expect(prompt?.textContent).toBe('C:\\>');
    });

    it('renders custom prompt', () => {
      const palette = createTestPalette({ prompt: 'A:\\>' });

      const prompt = palette.querySelector('.dos-commandpalette__prompt');
      expect(prompt?.textContent).toBe('A:\\>');
    });

    it('renders placeholder', () => {
      const palette = createTestPalette({ placeholder: 'Search commands...' });

      const input = palette.querySelector('.dos-commandpalette__input') as HTMLInputElement;
      expect(input.placeholder).toBe('Search commands...');
    });
  });

  describe('open/close', () => {
    it('opens when open() is called', () => {
      const palette = createTestPalette();

      palette.open();

      expect(palette.classList.contains('dos-commandpalette--open')).toBe(true);
      expect(palette.isOpen()).toBe(true);
    });

    it('closes when close() is called', () => {
      const palette = createTestPalette({ open: true });

      palette.close();

      expect(palette.classList.contains('dos-commandpalette--open')).toBe(false);
      expect(palette.isOpen()).toBe(false);
    });

    it('toggles with toggle()', () => {
      const palette = createTestPalette();

      palette.toggle();
      expect(palette.isOpen()).toBe(true);

      palette.toggle();
      expect(palette.isOpen()).toBe(false);
    });

    it('focuses input when opened', async () => {
      const palette = createTestPalette();

      palette.open();

      // Wait for requestAnimationFrame
      await new Promise(resolve => requestAnimationFrame(resolve));

      const input = palette.querySelector('.dos-commandpalette__input');
      expect(document.activeElement).toBe(input);
    });

    it('closes on Escape key', () => {
      const palette = createTestPalette({ open: true });
      const input = palette.querySelector('.dos-commandpalette__input') as HTMLInputElement;

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      input.dispatchEvent(event);

      expect(palette.isOpen()).toBe(false);
    });

    it('closes on overlay click when closeOnClickOutside is true', () => {
      const palette = createTestPalette({ open: true, closeOnClickOutside: true });
      const overlay = palette.querySelector('.dos-commandpalette__overlay') as HTMLElement;

      overlay.click();

      expect(palette.isOpen()).toBe(false);
    });

    it('does not close on overlay click when closeOnClickOutside is false', () => {
      const palette = createTestPalette({ open: true, closeOnClickOutside: false });
      const overlay = palette.querySelector('.dos-commandpalette__overlay') as HTMLElement;

      overlay.click();

      expect(palette.isOpen()).toBe(true);
    });
  });

  describe('search filtering', () => {
    it('shows all commands when query is empty', () => {
      const palette = createTestPalette({ open: true });

      expect(palette.getFilteredCommands().length).toBe(4);
    });

    it('filters commands by label', () => {
      const palette = createTestPalette({ open: true });

      palette.setQuery('Save');

      const filtered = palette.getFilteredCommands();
      expect(filtered.length).toBe(1);
      expect(filtered[0].label).toBe('Save File');
    });

    it('filters commands case-insensitively', () => {
      const palette = createTestPalette({ open: true });

      palette.setQuery('save');

      expect(palette.getFilteredCommands().length).toBe(1);
    });

    it('clears query with clearQuery()', () => {
      const palette = createTestPalette({ open: true });

      palette.setQuery('test');
      palette.clearQuery();

      expect(palette.getQuery()).toBe('');
    });

    it('filters by keywords', () => {
      const palette = createTestPalette({
        open: true,
        commands: [
          { id: 'cmd1', label: 'Save File', keywords: ['disk', 'write'], action: vi.fn() },
          { id: 'cmd2', label: 'Open File', action: vi.fn() },
        ],
      });

      palette.setQuery('disk');

      const filtered = palette.getFilteredCommands();
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('cmd1');
    });

    it('filters by description', () => {
      const palette = createTestPalette({
        open: true,
        commands: [
          { id: 'cmd1', label: 'Save', description: 'Write to disk', action: vi.fn() },
          { id: 'cmd2', label: 'Open', description: 'Read from disk', action: vi.fn() },
        ],
      });

      palette.setQuery('Write');

      const filtered = palette.getFilteredCommands();
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('cmd1');
    });

    it('supports fuzzy search when enabled', () => {
      const palette = createTestPalette({
        open: true,
        fuzzySearch: true,
        commands: [
          { id: 'cmd1', label: 'Save File', action: vi.fn() },
          { id: 'cmd2', label: 'Open File', action: vi.fn() },
        ],
      });

      palette.setQuery('svfl'); // S-a-v-e F-i-l-e

      const filtered = palette.getFilteredCommands();
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('cmd1');
    });
  });

  describe('keyboard navigation', () => {
    it('highlights first item by default', () => {
      const palette = createTestPalette({ open: true });

      const highlighted = palette.getHighlightedCommand();
      expect(highlighted?.id).toBe('cmd1');
    });

    it('moves down with ArrowDown', () => {
      const palette = createTestPalette({ open: true });
      const input = palette.querySelector('.dos-commandpalette__input') as HTMLInputElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      input.dispatchEvent(event);

      expect(palette.getHighlightedCommand()?.id).toBe('cmd2');
    });

    it('moves up with ArrowUp', () => {
      const palette = createTestPalette({ open: true });
      const input = palette.querySelector('.dos-commandpalette__input') as HTMLInputElement;

      // Move down first
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      // Then up
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

      expect(palette.getHighlightedCommand()?.id).toBe('cmd1');
    });

    it('wraps around at bottom', () => {
      const palette = createTestPalette({ open: true });
      const input = palette.querySelector('.dos-commandpalette__input') as HTMLInputElement;

      // Move to last item and then one more
      for (let i = 0; i < 5; i++) {
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      }

      expect(palette.getHighlightedCommand()?.id).toBe('cmd2');
    });

    it('wraps around at top', () => {
      const palette = createTestPalette({ open: true });
      const input = palette.querySelector('.dos-commandpalette__input') as HTMLInputElement;

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

      expect(palette.getHighlightedCommand()?.id).toBe('cmd4');
    });

    it('executes on Enter', () => {
      const action = vi.fn();
      const palette = createTestPalette({
        open: true,
        commands: [{ id: 'cmd1', label: 'Test', action }],
      });
      const input = palette.querySelector('.dos-commandpalette__input') as HTMLInputElement;

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(action).toHaveBeenCalled();
    });

    it('prevents default on navigation keys', () => {
      const palette = createTestPalette({ open: true });
      const input = palette.querySelector('.dos-commandpalette__input') as HTMLInputElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
      input.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('command execution', () => {
    it('executes command action', () => {
      const action = vi.fn();
      const palette = createTestPalette({
        open: true,
        commands: [{ id: 'cmd1', label: 'Test', action }],
      });

      palette.executeCommand('cmd1');

      expect(action).toHaveBeenCalled();
    });

    it('closes after execution by default', () => {
      const palette = createTestPalette({ open: true });

      palette.executeCommand('cmd1');

      expect(palette.isOpen()).toBe(false);
    });

    it('stays open when action returns false', () => {
      const palette = createTestPalette({
        open: true,
        commands: [{ id: 'cmd1', label: 'Test', action: () => false }],
      });

      palette.executeCommand('cmd1');

      expect(palette.isOpen()).toBe(true);
    });

    it('stays open when closeOnExecute is false', () => {
      const palette = createTestPalette({
        open: true,
        closeOnExecute: false,
      });

      palette.executeCommand('cmd1');

      expect(palette.isOpen()).toBe(true);
    });

    it('does not execute disabled commands', () => {
      const action = vi.fn();
      const palette = createTestPalette({
        open: true,
        commands: [{ id: 'cmd1', label: 'Test', action, disabled: true }],
      });

      palette.executeCommand('cmd1');

      expect(action).not.toHaveBeenCalled();
    });

    it('executes on item click', () => {
      const action = vi.fn();
      const palette = createTestPalette({
        open: true,
        commands: [{ id: 'cmd1', label: 'Test', action }],
      });

      const item = palette.querySelector('.dos-commandpalette__item') as HTMLElement;
      item.click();

      expect(action).toHaveBeenCalled();
    });
  });

  describe('recent commands', () => {
    it('tracks recently used commands', () => {
      const palette = createTestPalette({ open: true, showRecent: true });

      palette.executeCommand('cmd2');
      palette.open();

      const recent = palette.getRecentCommands();
      expect(recent[0].id).toBe('cmd2');
    });

    it('limits recent commands to maxRecentCommands', () => {
      const palette = createTestPalette({ open: true, showRecent: true, maxRecentCommands: 2 });

      palette.executeCommand('cmd1');
      palette.open();
      palette.executeCommand('cmd2');
      palette.open();
      palette.executeCommand('cmd3');
      palette.open();

      const recent = palette.getRecentCommands();
      expect(recent.length).toBe(2);
    });

    it('does not duplicate recent commands', () => {
      const palette = createTestPalette({ open: true, showRecent: true });

      palette.executeCommand('cmd1');
      palette.open();
      palette.executeCommand('cmd1');
      palette.open();

      const recent = palette.getRecentCommands();
      expect(recent.filter(c => c.id === 'cmd1').length).toBe(1);
    });
  });

  describe('command management', () => {
    it('registers new commands', () => {
      const palette = createTestPalette({ open: true });

      palette.registerCommand({ id: 'new', label: 'New Command', action: vi.fn() });

      const filtered = palette.getFilteredCommands();
      expect(filtered.find(c => c.id === 'new')).toBeDefined();
    });

    it('does not duplicate registered commands', () => {
      const palette = createTestPalette({ open: true });

      palette.registerCommand({ id: 'cmd1', label: 'Duplicate', action: vi.fn() });

      const filtered = palette.getFilteredCommands();
      expect(filtered.filter(c => c.id === 'cmd1').length).toBe(1);
    });

    it('unregisters commands', () => {
      const palette = createTestPalette({ open: true });

      palette.unregisterCommand('cmd1');

      const filtered = palette.getFilteredCommands();
      expect(filtered.find(c => c.id === 'cmd1')).toBeUndefined();
    });

    it('updates commands with setCommands', () => {
      const palette = createTestPalette({ open: true });

      palette.setCommands([{ id: 'new1', label: 'New 1', action: vi.fn() }]);

      const filtered = palette.getFilteredCommands();
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('new1');
    });
  });

  describe('callbacks', () => {
    it('calls onOpen when opened', () => {
      const onOpen = vi.fn();
      const palette = createTestPalette({ onOpen });

      palette.open();

      expect(onOpen).toHaveBeenCalled();
    });

    it('calls onClose when closed', () => {
      const onClose = vi.fn();
      const palette = createTestPalette({ open: true, onClose });

      palette.close();

      expect(onClose).toHaveBeenCalled();
    });

    it('calls onExecute when command is executed', () => {
      const onExecute = vi.fn();
      const palette = createTestPalette({ open: true, onExecute });

      palette.executeCommand('cmd1');

      expect(onExecute).toHaveBeenCalled();
      expect(onExecute.mock.calls[0][0].id).toBe('cmd1');
    });

    it('calls onSearch when query changes', () => {
      const onSearch = vi.fn();
      const palette = createTestPalette({ open: true, onSearch });

      palette.setQuery('test');

      expect(onSearch).toHaveBeenCalledWith('test');
    });
  });

  describe('custom events', () => {
    it('dispatches dos:commandpalette:open when opened', () => {
      const palette = createTestPalette();
      const handler = vi.fn();
      palette.addEventListener('dos:commandpalette:open', handler);

      palette.open();

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail.open).toBe(true);
    });

    it('dispatches dos:commandpalette:close when closed', () => {
      const palette = createTestPalette({ open: true });
      const handler = vi.fn();
      palette.addEventListener('dos:commandpalette:close', handler);

      palette.close();

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail.open).toBe(false);
    });

    it('dispatches dos:commandpalette:execute when command executed', () => {
      const palette = createTestPalette({ open: true });
      const handler = vi.fn();
      palette.addEventListener('dos:commandpalette:execute', handler);

      palette.executeCommand('cmd1');

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail.command.id).toBe('cmd1');
    });
  });

  describe('ARIA attributes', () => {
    it('has role="dialog" on modal', () => {
      const palette = createTestPalette();

      const modal = palette.querySelector('.dos-commandpalette__modal');
      expect(modal?.getAttribute('role')).toBe('dialog');
    });

    it('has aria-modal="true" on modal', () => {
      const palette = createTestPalette();

      const modal = palette.querySelector('.dos-commandpalette__modal');
      expect(modal?.getAttribute('aria-modal')).toBe('true');
    });

    it('has role="combobox" on input', () => {
      const palette = createTestPalette();

      const input = palette.querySelector('.dos-commandpalette__input');
      expect(input?.getAttribute('role')).toBe('combobox');
    });

    it('has aria-autocomplete on input', () => {
      const palette = createTestPalette();

      const input = palette.querySelector('.dos-commandpalette__input');
      expect(input?.getAttribute('aria-autocomplete')).toBe('list');
    });

    it('has role="listbox" on results', () => {
      const palette = createTestPalette();

      const results = palette.querySelector('.dos-commandpalette__results');
      expect(results?.getAttribute('role')).toBe('listbox');
    });

    it('has role="option" on items', () => {
      const palette = createTestPalette({ open: true });

      const item = palette.querySelector('.dos-commandpalette__item');
      expect(item?.getAttribute('role')).toBe('option');
    });

    it('updates aria-expanded on open/close', () => {
      const palette = createTestPalette();
      const input = palette.querySelector('.dos-commandpalette__input');

      expect(input?.getAttribute('aria-expanded')).toBe('false');

      palette.open();
      expect(input?.getAttribute('aria-expanded')).toBe('true');

      palette.close();
      expect(input?.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('categories', () => {
    it('groups commands by category', () => {
      const palette = createTestPalette({
        open: true,
        commands: [
          { id: 'cmd1', label: 'Save', category: 'file', action: vi.fn() },
          { id: 'cmd2', label: 'Copy', category: 'edit', action: vi.fn() },
        ],
        categories: [
          { id: 'file', label: 'File' },
          { id: 'edit', label: 'Edit' },
        ],
      });

      const categoryHeaders = palette.querySelectorAll('.dos-commandpalette__category');
      expect(categoryHeaders.length).toBeGreaterThan(0);
    });
  });

  describe('public API', () => {
    describe('focus()', () => {
      it('focuses input when palette is open', () => {
        const palette = createTestPalette({ open: true });

        palette.focus();

        const input = palette.querySelector('.dos-commandpalette__input');
        expect(document.activeElement).toBe(input);
      });
    });

    describe('destroy()', () => {
      it('cleans up event listeners', () => {
        const palette = createTestPalette();

        expect(() => palette.destroy()).not.toThrow();
      });
    });
  });

  describe('edge cases', () => {
    it('handles empty commands array', () => {
      const palette = createTestPalette({ open: true, commands: [] });

      expect(palette.getFilteredCommands().length).toBe(0);
    });

    it('handles no matching results', () => {
      const palette = createTestPalette({ open: true });

      palette.setQuery('nonexistent');

      expect(palette.getFilteredCommands().length).toBe(0);
    });

    it('handles rapid open/close', () => {
      const palette = createTestPalette();

      palette.open();
      palette.close();
      palette.open();
      palette.close();

      expect(palette.isOpen()).toBe(false);
    });
  });
});
