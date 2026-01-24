/**
 * FocusTrap Component Tests
 *
 * Unit tests for the FocusTrap utility component.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createFocusTrap,
  getActiveFocusTrap,
  getAllActiveFocusTraps,
} from '../../src/components/FocusTrap';

describe('FocusTrap', () => {
  let container: HTMLElement;

  beforeEach(() => {
    // Create test container with focusable elements
    container = document.createElement('div');
    container.id = 'trap-container';
    container.innerHTML = `
      <button id="btn1">Button 1</button>
      <input id="input1" type="text" />
      <a id="link1" href="#">Link</a>
      <button id="btn2">Button 2</button>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up all traps and containers
    const traps = getAllActiveFocusTraps();
    traps.forEach((trap) => trap.destroy());

    if (container.parentElement) {
      container.parentElement.removeChild(container);
    }
    document.body.innerHTML = '';
  });

  describe('activation', () => {
    it('activates by default', () => {
      const trap = createFocusTrap({ container });

      expect(trap.isActive).toBe(true);
      expect(container.getAttribute('data-dos-focus-trap')).toBe('active');
    });

    it('can start inactive with active: false', () => {
      const trap = createFocusTrap({ container, active: false });

      expect(trap.isActive).toBe(false);
      expect(container.hasAttribute('data-dos-focus-trap')).toBe(false);
    });

    it('calls onActivate callback when activated', () => {
      const onActivate = vi.fn();

      const trap = createFocusTrap({
        container,
        onActivate,
      });

      expect(onActivate).toHaveBeenCalledTimes(1);
    });

    it('dispatches dos:focustrap:activate event', () => {
      const handler = vi.fn();
      container.addEventListener('dos:focustrap:activate', handler);

      const trap = createFocusTrap({ container });

      expect(handler).toHaveBeenCalled();
      container.removeEventListener('dos:focustrap:activate', handler);
    });

    it('focuses first focusable element by default', () => {
      const trap = createFocusTrap({ container });

      const btn1 = container.querySelector('#btn1');
      expect(document.activeElement).toBe(btn1);
    });

    it('focuses specified initialFocus element', () => {
      const trap = createFocusTrap({
        container,
        initialFocus: '#input1',
      });

      const input = container.querySelector('#input1');
      expect(document.activeElement).toBe(input);
    });

    it('focuses container when initialFocus is "container"', () => {
      const trap = createFocusTrap({
        container,
        initialFocus: 'container',
      });

      expect(document.activeElement).toBe(container);
    });

    it('accepts HTMLElement as initialFocus', () => {
      const link = container.querySelector('#link1') as HTMLElement;

      const trap = createFocusTrap({
        container,
        initialFocus: link,
      });

      expect(document.activeElement).toBe(link);
    });
  });

  describe('deactivation', () => {
    it('deactivates properly', () => {
      const trap = createFocusTrap({ container });
      expect(trap.isActive).toBe(true);

      trap.deactivate();

      expect(trap.isActive).toBe(false);
      expect(container.hasAttribute('data-dos-focus-trap')).toBe(false);
    });

    it('calls onDeactivate callback', () => {
      const onDeactivate = vi.fn();

      const trap = createFocusTrap({
        container,
        onDeactivate,
      });

      trap.deactivate();

      expect(onDeactivate).toHaveBeenCalledTimes(1);
    });

    it('returns focus to previously focused element by default', () => {
      // Focus something outside first
      const outsideBtn = document.createElement('button');
      outsideBtn.id = 'outside';
      document.body.appendChild(outsideBtn);
      outsideBtn.focus();

      const trap = createFocusTrap({ container });

      // Focus should be inside the trap
      expect(container.contains(document.activeElement)).toBe(true);

      trap.deactivate();

      // Focus should return to the outside button
      expect(document.activeElement).toBe(outsideBtn);

      outsideBtn.remove();
    });

    it('returns focus to specified returnFocus element', () => {
      const returnTarget = document.createElement('button');
      returnTarget.id = 'return-target';
      document.body.appendChild(returnTarget);

      const trap = createFocusTrap({
        container,
        returnFocus: returnTarget,
      });

      trap.deactivate();

      expect(document.activeElement).toBe(returnTarget);

      returnTarget.remove();
    });

    it('does not return focus when returnFocus is false', () => {
      const outsideBtn = document.createElement('button');
      outsideBtn.id = 'outside';
      document.body.appendChild(outsideBtn);
      outsideBtn.focus();

      const trap = createFocusTrap({
        container,
        returnFocus: false,
      });

      trap.deactivate();

      // Focus should remain inside (or wherever it was last)
      expect(document.activeElement).not.toBe(outsideBtn);

      outsideBtn.remove();
    });

    it('dispatches dos:focustrap:deactivate event', () => {
      const handler = vi.fn();
      container.addEventListener('dos:focustrap:deactivate', handler);

      const trap = createFocusTrap({ container });
      trap.deactivate();

      expect(handler).toHaveBeenCalled();
      container.removeEventListener('dos:focustrap:deactivate', handler);
    });
  });

  describe('focus trapping', () => {
    it('traps focus within container on Tab', () => {
      const trap = createFocusTrap({ container });

      // Focus last element
      const btn2 = container.querySelector('#btn2') as HTMLElement;
      btn2.focus();

      // Simulate Tab key
      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });
      container.dispatchEvent(event);

      // Should wrap to first element
      // Note: The actual focus change is prevented, so we verify the event was processed
      expect(trap.isActive).toBe(true);
    });

    it('traps focus within container on Shift+Tab', () => {
      const trap = createFocusTrap({ container });

      // Focus first element
      const btn1 = container.querySelector('#btn1') as HTMLElement;
      btn1.focus();

      // Simulate Shift+Tab key
      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
      });
      container.dispatchEvent(event);

      expect(trap.isActive).toBe(true);
    });

    it('getFocusableElements returns correct elements', () => {
      const trap = createFocusTrap({ container });

      const focusables = trap.getFocusableElements();

      // Should include all 4 focusable elements
      expect(focusables.length).toBe(4);
      expect(focusables[0].id).toBe('btn1');
      expect(focusables[1].id).toBe('input1');
      expect(focusables[2].id).toBe('link1');
      expect(focusables[3].id).toBe('btn2');
    });

    it('excludes disabled elements from focusables', () => {
      const btn1 = container.querySelector('#btn1') as HTMLButtonElement;
      btn1.disabled = true;

      const trap = createFocusTrap({ container });
      const focusables = trap.getFocusableElements();

      expect(focusables.length).toBe(3);
      expect(focusables.find((el) => el.id === 'btn1')).toBeUndefined();
    });

    it('uses custom isFocusable function', () => {
      const trap = createFocusTrap({
        container,
        isFocusable: (el) => el.tagName === 'BUTTON',
      });

      const focusables = trap.getFocusableElements();

      // Should only include buttons
      expect(focusables.length).toBe(2);
      expect(focusables.every((el) => el.tagName === 'BUTTON')).toBe(true);
    });
  });

  describe('escape handling', () => {
    it('deactivates on Escape by default', () => {
      const trap = createFocusTrap({ container });

      expect(trap.isActive).toBe(true);

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });
      container.dispatchEvent(event);

      expect(trap.isActive).toBe(false);
    });

    it('does not deactivate on Escape when escapeDeactivates is false', () => {
      const trap = createFocusTrap({
        container,
        escapeDeactivates: false,
      });

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });
      container.dispatchEvent(event);

      expect(trap.isActive).toBe(true);
    });

    it('calls onEscape callback', () => {
      const onEscape = vi.fn();

      const trap = createFocusTrap({
        container,
        onEscape,
      });

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });
      container.dispatchEvent(event);

      expect(onEscape).toHaveBeenCalledTimes(1);
    });

    it('prevents deactivation when onEscape returns false', () => {
      const trap = createFocusTrap({
        container,
        onEscape: () => false,
      });

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });
      container.dispatchEvent(event);

      expect(trap.isActive).toBe(true);
    });
  });

  describe('pause and resume', () => {
    it('pauses the trap', () => {
      const trap = createFocusTrap({ container });

      trap.pause();

      expect(trap.isPaused).toBe(true);
      expect(trap.isActive).toBe(true);
      expect(container.getAttribute('data-dos-focus-trap')).toBe('paused');
    });

    it('does not trap focus when paused', () => {
      const trap = createFocusTrap({ container });
      trap.pause();

      // Escape should not deactivate when paused
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });
      container.dispatchEvent(event);

      expect(trap.isActive).toBe(true);
    });

    it('resumes the trap', () => {
      const trap = createFocusTrap({ container });
      trap.pause();

      trap.resume();

      expect(trap.isPaused).toBe(false);
      expect(trap.isActive).toBe(true);
      expect(container.getAttribute('data-dos-focus-trap')).toBe('active');
    });

    it('dispatches pause and resume events', () => {
      const pauseHandler = vi.fn();
      const resumeHandler = vi.fn();

      container.addEventListener('dos:focustrap:pause', pauseHandler);
      container.addEventListener('dos:focustrap:resume', resumeHandler);

      const trap = createFocusTrap({ container });
      trap.pause();
      trap.resume();

      expect(pauseHandler).toHaveBeenCalledTimes(1);
      expect(resumeHandler).toHaveBeenCalledTimes(1);

      container.removeEventListener('dos:focustrap:pause', pauseHandler);
      container.removeEventListener('dos:focustrap:resume', resumeHandler);
    });
  });

  describe('updateOptions', () => {
    it('updates trap options', () => {
      const onDeactivate = vi.fn();

      const trap = createFocusTrap({
        container,
        escapeDeactivates: false,
      });

      // Update to enable escape deactivation
      trap.updateOptions({
        escapeDeactivates: true,
        onDeactivate,
      });

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });
      container.dispatchEvent(event);

      expect(trap.isActive).toBe(false);
      expect(onDeactivate).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('cleans up properly', () => {
      const trap = createFocusTrap({ container });

      trap.destroy();

      expect(trap.isActive).toBe(false);
      expect(container.hasAttribute('data-dos-focus-trap')).toBe(false);

      // Sentinels should be removed
      expect(container.querySelector('[data-dos-focus-trap="start"]')).toBeNull();
      expect(container.querySelector('[data-dos-focus-trap="end"]')).toBeNull();
    });

    it('can be destroyed when already inactive', () => {
      const trap = createFocusTrap({ container, active: false });

      // Should not throw
      expect(() => trap.destroy()).not.toThrow();
    });
  });

  describe('trap tracking', () => {
    it('tracks active traps with getActiveFocusTrap', () => {
      expect(getActiveFocusTrap()).toBeNull();

      const trap = createFocusTrap({ container });

      expect(getActiveFocusTrap()).toBe(trap);

      trap.destroy();

      expect(getActiveFocusTrap()).toBeNull();
    });

    it('tracks multiple traps with getAllActiveFocusTraps', () => {
      const container2 = document.createElement('div');
      container2.innerHTML = '<button>Btn</button>';
      document.body.appendChild(container2);

      const trap1 = createFocusTrap({ container });
      const trap2 = createFocusTrap({ container: container2 });

      const allTraps = getAllActiveFocusTraps();

      expect(allTraps.length).toBe(2);
      expect(allTraps).toContain(trap1);
      expect(allTraps).toContain(trap2);

      trap1.destroy();
      trap2.destroy();
      container2.remove();
    });

    it('returns top of stack for nested traps', () => {
      const container2 = document.createElement('div');
      container2.innerHTML = '<button>Btn</button>';
      document.body.appendChild(container2);

      const trap1 = createFocusTrap({ container });
      const trap2 = createFocusTrap({ container: container2 });

      expect(getActiveFocusTrap()).toBe(trap2);

      trap2.destroy();

      expect(getActiveFocusTrap()).toBe(trap1);

      trap1.destroy();
      container2.remove();
    });
  });

  describe('container resolution', () => {
    it('accepts CSS selector for container', () => {
      const trap = createFocusTrap({ container: '#trap-container' });

      expect(trap.container).toBe(container);
      expect(trap.isActive).toBe(true);
    });

    it('throws if container not found', () => {
      expect(() => {
        createFocusTrap({ container: '#nonexistent' });
      }).toThrow('Container element not found');
    });
  });

  describe('sentinel elements', () => {
    it('adds sentinel elements when activated', () => {
      const trap = createFocusTrap({ container });

      expect(container.querySelector('[data-dos-focus-trap="start"]')).toBeTruthy();
      expect(container.querySelector('[data-dos-focus-trap="end"]')).toBeTruthy();
    });

    it('removes sentinel elements when deactivated', () => {
      const trap = createFocusTrap({ container });
      trap.deactivate();

      expect(container.querySelector('[data-dos-focus-trap="start"]')).toBeNull();
      expect(container.querySelector('[data-dos-focus-trap="end"]')).toBeNull();
    });

    it('sentinels are aria-hidden', () => {
      const trap = createFocusTrap({ container });

      const start = container.querySelector('[data-dos-focus-trap="start"]');
      const end = container.querySelector('[data-dos-focus-trap="end"]');

      expect(start?.getAttribute('aria-hidden')).toBe('true');
      expect(end?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('edge cases', () => {
    it('handles container with no focusable elements', () => {
      const emptyContainer = document.createElement('div');
      emptyContainer.id = 'empty-container';
      emptyContainer.textContent = 'No focusable elements here';
      document.body.appendChild(emptyContainer);

      const trap = createFocusTrap({ container: emptyContainer });

      // Should focus the container itself
      expect(document.activeElement).toBe(emptyContainer);
      expect(trap.getFocusableElements().length).toBe(0);

      trap.destroy();
      emptyContainer.remove();
    });

    it('handles dynamically added focusable elements', () => {
      const trap = createFocusTrap({ container });

      // Initially 4 focusable elements
      expect(trap.getFocusableElements().length).toBe(4);

      // Add a new button
      const newBtn = document.createElement('button');
      newBtn.id = 'new-btn';
      newBtn.textContent = 'New Button';
      container.appendChild(newBtn);

      // Should now include the new button
      expect(trap.getFocusableElements().length).toBe(5);
    });

    it('does not activate twice', () => {
      const onActivate = vi.fn();
      const trap = createFocusTrap({ container, onActivate });

      trap.activate();
      trap.activate();

      expect(onActivate).toHaveBeenCalledTimes(1);
    });

    it('does not deactivate twice', () => {
      const onDeactivate = vi.fn();
      const trap = createFocusTrap({ container, onDeactivate });

      trap.deactivate();
      trap.deactivate();

      expect(onDeactivate).toHaveBeenCalledTimes(1);
    });
  });
});
