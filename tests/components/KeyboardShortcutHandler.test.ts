/**
 * KeyboardShortcutHandler Component Tests
 *
 * Unit tests for the keyboard shortcut management utility.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createKeyboardShortcutHandler,
  createShortcutHint,
  parseShortcut,
  formatShortcutString,
} from '../../src/components/KeyboardShortcutHandler';

describe('KeyboardShortcutHandler', () => {
  afterEach(() => {
    // Clean up any handlers that might be attached
    document.body.innerHTML = '';
  });

  describe('parseShortcut', () => {
    it('parses simple key', () => {
      const parsed = parseShortcut('a');
      expect(parsed.key).toBe('a');
      expect(parsed.ctrl).toBe(false);
      expect(parsed.alt).toBe(false);
      expect(parsed.shift).toBe(false);
      expect(parsed.meta).toBe(false);
    });

    it('parses special key', () => {
      const parsed = parseShortcut('Escape');
      expect(parsed.key).toBe('Escape');
    });

    it('parses Ctrl modifier', () => {
      const parsed = parseShortcut('Ctrl+S');
      expect(parsed.key).toBe('s');
      expect(parsed.ctrl).toBe(true);
    });

    it('parses Alt modifier', () => {
      const parsed = parseShortcut('Alt+F4');
      expect(parsed.key).toBe('F4');
      expect(parsed.alt).toBe(true);
    });

    it('parses Shift modifier', () => {
      const parsed = parseShortcut('Shift+Tab');
      expect(parsed.key).toBe('Tab');
      expect(parsed.shift).toBe(true);
    });

    it('parses multiple modifiers', () => {
      const parsed = parseShortcut('Ctrl+Shift+P');
      expect(parsed.key).toBe('p');
      expect(parsed.ctrl).toBe(true);
      expect(parsed.shift).toBe(true);
    });

    it('handles key aliases', () => {
      expect(parseShortcut('esc').key).toBe('Escape');
      expect(parseShortcut('return').key).toBe('Enter');
      expect(parseShortcut('space').key).toBe(' ');
      expect(parseShortcut('up').key).toBe('ArrowUp');
    });

    it('handles modifier aliases', () => {
      expect(parseShortcut('control+a').ctrl).toBe(true);
      expect(parseShortcut('option+a').alt).toBe(true);
      expect(parseShortcut('cmd+a').meta).toBe(true);
    });
  });

  describe('formatShortcutString', () => {
    it('formats simple key', () => {
      const formatted = formatShortcutString({ key: 'a', ctrl: false, alt: false, shift: false, meta: false });
      expect(formatted).toBe('A');
    });

    it('formats with Ctrl modifier', () => {
      const formatted = formatShortcutString({ key: 's', ctrl: true, alt: false, shift: false, meta: false });
      expect(formatted).toContain('S');
      expect(formatted.toLowerCase()).toContain('ctrl');
    });

    it('formats with multiple modifiers', () => {
      const formatted = formatShortcutString({ key: 'p', ctrl: true, alt: false, shift: true, meta: false });
      expect(formatted).toContain('P');
      expect(formatted.toLowerCase()).toContain('ctrl');
      expect(formatted.toLowerCase()).toContain('shift');
    });

    it('formats arrow keys', () => {
      expect(formatShortcutString({ key: 'ArrowUp', ctrl: false, alt: false, shift: false, meta: false })).toBe('↑');
      expect(formatShortcutString({ key: 'ArrowDown', ctrl: false, alt: false, shift: false, meta: false })).toBe('↓');
    });

    it('formats space key', () => {
      const formatted = formatShortcutString({ key: ' ', ctrl: false, alt: false, shift: false, meta: false });
      expect(formatted).toBe('Space');
    });
  });

  describe('shortcut registration', () => {
    it('registers a shortcut', () => {
      const callback = vi.fn();
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'test', key: 'a', callback },
        ],
      });

      expect(handler.getShortcuts().length).toBe(1);
      expect(handler.getShortcut('test')).toBeTruthy();

      handler.destroy();
    });

    it('registers multiple shortcuts', () => {
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'test1', key: 'a', callback: vi.fn() },
          { id: 'test2', key: 'b', callback: vi.fn() },
        ],
      });

      expect(handler.getShortcuts().length).toBe(2);

      handler.destroy();
    });

    it('registers shortcuts via register method', () => {
      const handler = createKeyboardShortcutHandler();

      handler.register({ id: 'dynamic', key: 'x', callback: vi.fn() });

      expect(handler.getShortcut('dynamic')).toBeTruthy();

      handler.destroy();
    });

    it('unregisters a shortcut', () => {
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'test', key: 'a', callback: vi.fn() },
        ],
      });

      handler.unregister('test');

      expect(handler.getShortcut('test')).toBeUndefined();

      handler.destroy();
    });
  });

  describe('shortcut triggering', () => {
    it('triggers callback on matching keydown', () => {
      const callback = vi.fn();
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'test', key: 'a', callback },
        ],
      });

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalledTimes(1);

      handler.destroy();
    });

    it('triggers callback with modifiers', () => {
      const callback = vi.fn();
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'save', key: 's', modifiers: { ctrl: true }, callback },
        ],
      });

      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalledTimes(1);

      handler.destroy();
    });

    it('does not trigger without required modifiers', () => {
      const callback = vi.fn();
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'save', key: 's', modifiers: { ctrl: true }, callback },
        ],
      });

      // Press 's' without Ctrl
      const event = new KeyboardEvent('keydown', {
        key: 's',
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();

      handler.destroy();
    });

    it('prevents default when preventDefault is true', () => {
      const callback = vi.fn();
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'test', key: 'a', callback, preventDefault: true },
        ],
      });

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);

      handler.destroy();
    });

    it('does not prevent default when preventDefault is false', () => {
      const callback = vi.fn();
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'test', key: 'a', callback, preventDefault: false },
        ],
      });

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);

      handler.destroy();
    });
  });

  describe('enable/disable', () => {
    it('starts enabled by default', () => {
      const handler = createKeyboardShortcutHandler();
      expect(handler.isEnabled()).toBe(true);
      handler.destroy();
    });

    it('can start disabled', () => {
      const handler = createKeyboardShortcutHandler({ enabled: false });
      expect(handler.isEnabled()).toBe(false);
      handler.destroy();
    });

    it('does not trigger when disabled', () => {
      const callback = vi.fn();
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'test', key: 'a', callback },
        ],
      });

      handler.disable();

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();

      handler.destroy();
    });

    it('can enable and disable', () => {
      const handler = createKeyboardShortcutHandler();

      handler.disable();
      expect(handler.isEnabled()).toBe(false);

      handler.enable();
      expect(handler.isEnabled()).toBe(true);

      handler.destroy();
    });

    it('can enable/disable individual shortcuts', () => {
      const callback = vi.fn();
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'test', key: 'a', callback },
        ],
      });

      handler.disableShortcut('test');

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();

      // Re-enable
      handler.enableShortcut('test');
      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalledTimes(1);

      handler.destroy();
    });
  });

  describe('callbacks', () => {
    it('calls onShortcut callback', () => {
      const callback = vi.fn();
      const onShortcut = vi.fn();

      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'test', key: 'a', callback },
        ],
        onShortcut,
      });

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(onShortcut).toHaveBeenCalled();

      handler.destroy();
    });

    it('calls onConflict when registering duplicate shortcut', () => {
      const onConflict = vi.fn();

      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'first', key: 'a', callback: vi.fn() },
        ],
        onConflict,
      });

      handler.register({ id: 'second', key: 'a', callback: vi.fn() });

      expect(onConflict).toHaveBeenCalled();

      handler.destroy();
    });
  });

  describe('category filtering', () => {
    it('gets shortcuts by category', () => {
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'edit1', key: 'c', modifiers: { ctrl: true }, category: 'editing', callback: vi.fn() },
          { id: 'edit2', key: 'v', modifiers: { ctrl: true }, category: 'editing', callback: vi.fn() },
          { id: 'nav1', key: 'g', category: 'navigation', callback: vi.fn() },
        ],
      });

      const editingShortcuts = handler.getShortcutsByCategory('editing');
      expect(editingShortcuts.length).toBe(2);

      const navShortcuts = handler.getShortcutsByCategory('navigation');
      expect(navShortcuts.length).toBe(1);

      handler.destroy();
    });
  });

  describe('validation', () => {
    it('validates shortcut strings', () => {
      const handler = createKeyboardShortcutHandler();

      expect(handler.isValidShortcut('Ctrl+S')).toBe(true);
      expect(handler.isValidShortcut('Alt+F4')).toBe(true);
      expect(handler.isValidShortcut('Escape')).toBe(true);
      expect(handler.isValidShortcut('a')).toBe(true);

      handler.destroy();
    });
  });

  describe('repeat handling', () => {
    it('does not trigger on repeat by default', () => {
      const callback = vi.fn();
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'test', key: 'a', callback },
        ],
      });

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        repeat: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();

      handler.destroy();
    });

    it('triggers on repeat when allowRepeat is true', () => {
      const callback = vi.fn();
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'test', key: 'a', callback, allowRepeat: true },
        ],
      });

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        repeat: true,
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalled();

      handler.destroy();
    });
  });

  describe('priority', () => {
    it('respects shortcut priority', () => {
      const lowCallback = vi.fn();
      const highCallback = vi.fn();

      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'low', key: 'a', callback: lowCallback, priority: 0 },
          { id: 'high', key: 'a', callback: highCallback, priority: 10 },
        ],
      });

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
      });
      document.dispatchEvent(event);

      // High priority should be called, low should not
      expect(highCallback).toHaveBeenCalled();
      expect(lowCallback).not.toHaveBeenCalled();

      handler.destroy();
    });
  });

  describe('sequences', () => {
    it('registers a sequence', () => {
      const callback = vi.fn();
      const handler = createKeyboardShortcutHandler();

      handler.registerSequence({
        id: 'seq',
        sequence: ['Ctrl+K', 'Ctrl+C'],
        callback,
      });

      expect(handler.getSequences().length).toBe(1);

      handler.destroy();
    });

    it('unregisters a sequence', () => {
      const handler = createKeyboardShortcutHandler();

      handler.registerSequence({
        id: 'seq',
        sequence: ['Ctrl+K', 'Ctrl+C'],
        callback: vi.fn(),
      });

      handler.unregisterSequence('seq');

      expect(handler.getSequences().length).toBe(0);

      handler.destroy();
    });
  });

  describe('destroy', () => {
    it('cleans up properly', () => {
      const callback = vi.fn();
      const handler = createKeyboardShortcutHandler({
        shortcuts: [
          { id: 'test', key: 'a', callback },
        ],
      });

      handler.destroy();

      // Should not trigger after destroy
      const event = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
      expect(handler.getShortcuts().length).toBe(0);
    });
  });
});

describe('createShortcutHint', () => {
  it('creates hint element for simple key', () => {
    const hint = createShortcutHint({ shortcut: 'A' });

    expect(hint.classList.contains('dos-shortcut-hint')).toBe(true);
    expect(hint.querySelector('.dos-shortcut-hint___key')).toBeTruthy();
  });

  it('creates hint element for modifier combination', () => {
    const hint = createShortcutHint({ shortcut: 'Ctrl+S' });

    const keys = hint.querySelectorAll('.dos-shortcut-hint___key');
    expect(keys.length).toBe(2);
  });

  it('applies variant class', () => {
    const badge = createShortcutHint({ shortcut: 'A', variant: 'badge' });
    expect(badge.classList.contains('dos-shortcut-hint--badge')).toBe(true);

    const compact = createShortcutHint({ shortcut: 'A', variant: 'compact' });
    expect(compact.classList.contains('dos-shortcut-hint--compact')).toBe(true);
  });

  it('applies custom class', () => {
    const hint = createShortcutHint({ shortcut: 'A', className: 'my-hint' });
    expect(hint.classList.contains('my-hint')).toBe(true);
  });

  it('has aria-label for accessibility', () => {
    const hint = createShortcutHint({ shortcut: 'Ctrl+S' });
    expect(hint.getAttribute('aria-label')).toBeTruthy();
  });
});
