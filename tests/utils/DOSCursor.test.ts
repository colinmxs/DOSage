/**
 * DOSCursor Utility Tests
 *
 * Tests for the DOS block cursor overlay utility.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createDOSCursor, attachDOSCursor } from '../../src/utils/DOSCursor';

describe('DOSCursor', () => {
  let input: HTMLInputElement;
  let wrapper: HTMLDivElement;

  beforeEach(() => {
    // Create a wrapper and input
    wrapper = document.createElement('div');
    wrapper.style.position = 'relative';

    input = document.createElement('input');
    input.type = 'text';
    input.style.fontFamily = 'monospace';
    input.style.fontSize = '16px';
    
    wrapper.appendChild(input);
    document.body.appendChild(wrapper);
  });

  afterEach(() => {
    wrapper.remove();
  });

  describe('createDOSCursor', () => {
    it('should create a cursor overlay element', () => {
      const cursor = createDOSCursor({ input, wrapper });
      const overlay = cursor.getElement();

      expect(overlay).toBeTruthy();
      expect(overlay.tagName).toBe('SPAN');
      expect(overlay.textContent).toBe('█');
      expect(overlay.classList.contains('dos-cursor-overlay')).toBe(true);

      cursor.destroy();
    });

    it('should append cursor element to wrapper', () => {
      const cursor = createDOSCursor({ input, wrapper });
      const overlay = cursor.getElement();

      expect(wrapper.contains(overlay)).toBe(true);

      cursor.destroy();
    });

    it('should have aria-hidden attribute', () => {
      const cursor = createDOSCursor({ input, wrapper });
      const overlay = cursor.getElement();

      expect(overlay.getAttribute('aria-hidden')).toBe('true');

      cursor.destroy();
    });

    it('should start hidden', () => {
      const cursor = createDOSCursor({ input, wrapper });
      const overlay = cursor.getElement();

      expect(overlay.classList.contains('dos-cursor-overlay--hidden')).toBe(true);
      expect(cursor.isVisible()).toBe(false);

      cursor.destroy();
    });

    it('should use custom cursor character when provided', () => {
      const cursor = createDOSCursor({ input, wrapper, cursorChar: '_' });
      const overlay = cursor.getElement();

      expect(overlay.textContent).toBe('_');

      cursor.destroy();
    });

    it('should add readonly class when readonly option is true', () => {
      const cursor = createDOSCursor({ input, wrapper, readonly: true });
      const overlay = cursor.getElement();

      expect(overlay.classList.contains('dos-cursor-overlay--readonly')).toBe(true);

      cursor.destroy();
    });
  });

  describe('show/hide', () => {
    it('should show cursor on focus', () => {
      const cursor = createDOSCursor({ input, wrapper });

      input.focus();

      expect(cursor.isVisible()).toBe(true);
      expect(cursor.getElement().classList.contains('dos-cursor-overlay--visible')).toBe(true);
      expect(cursor.getElement().classList.contains('dos-cursor-overlay--hidden')).toBe(false);

      cursor.destroy();
    });

    it('should hide cursor on blur', () => {
      const cursor = createDOSCursor({ input, wrapper });

      input.focus();
      input.blur();

      expect(cursor.isVisible()).toBe(false);
      expect(cursor.getElement().classList.contains('dos-cursor-overlay--hidden')).toBe(true);

      cursor.destroy();
    });

    it('should show cursor manually', () => {
      const cursor = createDOSCursor({ input, wrapper });

      cursor.show();

      expect(cursor.isVisible()).toBe(true);

      cursor.destroy();
    });

    it('should hide cursor manually', () => {
      const cursor = createDOSCursor({ input, wrapper });

      cursor.show();
      cursor.hide();

      expect(cursor.isVisible()).toBe(false);

      cursor.destroy();
    });

    it('should not show cursor when disabled', () => {
      const cursor = createDOSCursor({ input, wrapper, disabled: true });

      cursor.show();

      expect(cursor.isVisible()).toBe(false);

      cursor.destroy();
    });
  });

  describe('position', () => {
    it('should return position object', () => {
      const cursor = createDOSCursor({ input, wrapper });
      const position = cursor.getPosition();

      expect(position).toHaveProperty('left');
      expect(position).toHaveProperty('top');
      expect(position).toHaveProperty('index');
      expect(position).toHaveProperty('height');

      cursor.destroy();
    });

    it('should update position when requested', () => {
      const cursor = createDOSCursor({ input, wrapper });
      
      cursor.show();
      const initialPosition = cursor.getPosition();
      
      // Change input value
      input.value = 'Hello';
      input.selectionStart = input.selectionEnd = 5;
      cursor.updatePosition();
      
      // Wait for animation frame
      return new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          // Position should have been updated
          const newPosition = cursor.getPosition();
          expect(newPosition.index).toBe(5);
          cursor.destroy();
          resolve();
        });
      });
    });

    it('should call onPositionUpdate callback', () => {
      const onPositionUpdate = vi.fn();
      const cursor = createDOSCursor({ input, wrapper, onPositionUpdate });
      
      cursor.show();

      expect(onPositionUpdate).toHaveBeenCalled();

      cursor.destroy();
    });
  });

  describe('state management', () => {
    it('should set readonly state', () => {
      const cursor = createDOSCursor({ input, wrapper });
      
      cursor.setReadonly(true);
      expect(cursor.getElement().classList.contains('dos-cursor-overlay--readonly')).toBe(true);
      
      cursor.setReadonly(false);
      expect(cursor.getElement().classList.contains('dos-cursor-overlay--readonly')).toBe(false);

      cursor.destroy();
    });

    it('should set disabled state', () => {
      const cursor = createDOSCursor({ input, wrapper });
      
      cursor.show();
      expect(cursor.isVisible()).toBe(true);
      
      cursor.setDisabled(true);
      expect(cursor.isVisible()).toBe(false);

      cursor.destroy();
    });

    it('should not show when disabled after being enabled', () => {
      const cursor = createDOSCursor({ input, wrapper });
      
      cursor.setDisabled(true);
      cursor.show();
      
      expect(cursor.isVisible()).toBe(false);

      cursor.destroy();
    });
  });

  describe('destroy', () => {
    it('should remove cursor element from DOM', () => {
      const cursor = createDOSCursor({ input, wrapper });
      const overlay = cursor.getElement();

      expect(wrapper.contains(overlay)).toBe(true);
      
      cursor.destroy();
      
      expect(wrapper.contains(overlay)).toBe(false);
    });

    it('should not throw when destroyed multiple times', () => {
      const cursor = createDOSCursor({ input, wrapper });
      
      cursor.destroy();
      
      expect(() => cursor.destroy()).not.toThrow();
    });

    it('should not respond to events after destruction', () => {
      const cursor = createDOSCursor({ input, wrapper });
      
      cursor.destroy();
      
      input.focus();
      
      expect(cursor.isVisible()).toBe(false);
    });
  });

  describe('attachDOSCursor helper', () => {
    it('should create and attach cursor to input', () => {
      const cursor = attachDOSCursor(input, wrapper);
      
      expect(cursor.getElement()).toBeTruthy();
      expect(wrapper.contains(cursor.getElement())).toBe(true);

      cursor.destroy();
    });

    it('should accept additional options', () => {
      const cursor = attachDOSCursor(input, wrapper, { cursorChar: '▋' });
      
      expect(cursor.getElement().textContent).toBe('▋');

      cursor.destroy();
    });
  });

  describe('textarea support', () => {
    let textarea: HTMLTextAreaElement;

    beforeEach(() => {
      textarea = document.createElement('textarea');
      textarea.style.fontFamily = 'monospace';
      textarea.style.fontSize = '16px';
      wrapper.innerHTML = '';
      wrapper.appendChild(textarea);
    });

    it('should work with textarea elements', () => {
      const cursor = createDOSCursor({ input: textarea, wrapper });
      
      expect(cursor.getElement()).toBeTruthy();

      cursor.destroy();
    });

    it('should show cursor on textarea focus', () => {
      const cursor = createDOSCursor({ input: textarea, wrapper });

      textarea.focus();

      expect(cursor.isVisible()).toBe(true);

      cursor.destroy();
    });
  });

  describe('event handling', () => {
    it('should update position on input event', async () => {
      const cursor = createDOSCursor({ input, wrapper });
      
      cursor.show();
      
      // Simulate input
      input.value = 'Test';
      input.dispatchEvent(new Event('input'));

      // Wait for position update
      await new Promise((resolve) => setTimeout(resolve, 50));

      cursor.destroy();
    });

    it('should update position on click', () => {
      const cursor = createDOSCursor({ input, wrapper });
      
      cursor.show();
      
      input.dispatchEvent(new MouseEvent('click'));

      cursor.destroy();
    });

    it('should update position on keydown (arrow keys)', () => {
      const cursor = createDOSCursor({ input, wrapper });
      
      cursor.show();
      input.value = 'Hello World';
      
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      cursor.destroy();
    });
  });
});
