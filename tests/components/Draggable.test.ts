/**
 * @file Draggable.test.ts
 * @description Tests for the Draggable component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createDraggable } from '../../src/components/Draggable';

describe('Draggable', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    container.style.position = 'relative';
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.body.className = '';
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      expect(draggable.element).toBeInstanceOf(HTMLElement);
      expect(draggable.element.classList.contains('dos-draggable')).toBe(true);
    });

    it('renders with custom id', () => {
      const draggable = createDraggable({ id: 'my-draggable' });
      container.appendChild(draggable.element);

      expect(draggable.element.id).toBe('my-draggable');
    });

    it('renders with custom className', () => {
      const draggable = createDraggable({ className: 'custom-class' });
      container.appendChild(draggable.element);

      expect(draggable.element.classList.contains('custom-class')).toBe(true);
    });

    it('renders with initial position', () => {
      const draggable = createDraggable({
        initialX: 100,
        initialY: 50,
      });
      container.appendChild(draggable.element);

      expect(draggable.element.style.transform).toBe('translate(100px, 50px)');
    });

    it('renders with axis-x class when axis is x', () => {
      const draggable = createDraggable({ axis: 'x' });
      container.appendChild(draggable.element);

      expect(draggable.element.classList.contains('dos-draggable--axis-x')).toBe(true);
    });

    it('renders with axis-y class when axis is y', () => {
      const draggable = createDraggable({ axis: 'y' });
      container.appendChild(draggable.element);

      expect(draggable.element.classList.contains('dos-draggable--axis-y')).toBe(true);
    });

    it('renders with disabled class when disabled', () => {
      const draggable = createDraggable({ disabled: true });
      container.appendChild(draggable.element);

      expect(draggable.element.classList.contains('dos-draggable--disabled')).toBe(true);
    });

    it('uses left/top positioning when useTransform is false', () => {
      const draggable = createDraggable({
        initialX: 100,
        initialY: 50,
        useTransform: false,
      });
      container.appendChild(draggable.element);

      expect(draggable.element.style.left).toBe('100px');
      expect(draggable.element.style.top).toBe('50px');
    });
  });

  describe('content management', () => {
    it('renders initial content when provided as element', () => {
      const content = document.createElement('div');
      content.textContent = 'Drag me';

      const draggable = createDraggable({ content });
      container.appendChild(draggable.element);

      expect(draggable.element.textContent).toBe('Drag me');
    });

    it('renders initial content when provided as string', () => {
      const draggable = createDraggable({ content: '<p>Drag content</p>' });
      container.appendChild(draggable.element);

      expect(draggable.element.innerHTML).toBe('<p>Drag content</p>');
    });

    it('setContent replaces content with element', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      const newContent = document.createElement('span');
      newContent.textContent = 'New content';
      draggable.setContent(newContent);

      expect(draggable.element.textContent).toBe('New content');
    });

    it('setContent replaces content with string', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      draggable.setContent('<strong>Strong text</strong>');

      expect(draggable.element.innerHTML).toBe('<strong>Strong text</strong>');
    });
  });

  describe('position management', () => {
    it('getPosition returns current position', () => {
      const draggable = createDraggable({
        initialX: 100,
        initialY: 50,
      });
      container.appendChild(draggable.element);

      const pos = draggable.getPosition();
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(50);
    });

    it('setPosition updates position', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      draggable.setPosition(200, 150);

      const pos = draggable.getPosition();
      expect(pos.x).toBe(200);
      expect(pos.y).toBe(150);
    });

    it('reset returns to initial position', () => {
      const draggable = createDraggable({
        initialX: 100,
        initialY: 50,
      });
      container.appendChild(draggable.element);

      draggable.setPosition(300, 200);
      draggable.reset();

      const pos = draggable.getPosition();
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(50);
    });
  });

  describe('enable/disable', () => {
    it('enable removes disabled class', () => {
      const draggable = createDraggable({ disabled: true });
      container.appendChild(draggable.element);

      draggable.enable();

      expect(draggable.element.classList.contains('dos-draggable--disabled')).toBe(false);
      expect(draggable.isDisabled()).toBe(false);
    });

    it('disable adds disabled class', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      draggable.disable();

      expect(draggable.element.classList.contains('dos-draggable--disabled')).toBe(true);
      expect(draggable.isDisabled()).toBe(true);
    });

    it('isDisabled returns correct state', () => {
      const draggable = createDraggable({ disabled: true });
      expect(draggable.isDisabled()).toBe(true);

      draggable.enable();
      expect(draggable.isDisabled()).toBe(false);

      draggable.disable();
      expect(draggable.isDisabled()).toBe(true);
    });
  });

  describe('drag interactions', () => {
    it('isDragging returns false initially', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      expect(draggable.isDragging()).toBe(false);
    });

    it('mousedown starts drag', () => {
      const onDragStart = vi.fn();
      const draggable = createDraggable({ onDragStart });
      container.appendChild(draggable.element);

      draggable.element.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      }));

      expect(draggable.isDragging()).toBe(true);
      expect(draggable.element.classList.contains('dos-draggable--dragging')).toBe(true);
      expect(onDragStart).toHaveBeenCalled();
    });

    it('mouseup ends drag', () => {
      const onDragEnd = vi.fn();
      const draggable = createDraggable({ onDragEnd });
      container.appendChild(draggable.element);

      // Start drag
      draggable.element.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      }));

      // End drag
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(draggable.isDragging()).toBe(false);
      expect(draggable.element.classList.contains('dos-draggable--dragging')).toBe(false);
      expect(onDragEnd).toHaveBeenCalled();
    });

    it('drag does not start when disabled', () => {
      const onDragStart = vi.fn();
      const draggable = createDraggable({
        disabled: true,
        onDragStart,
      });
      container.appendChild(draggable.element);

      draggable.element.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      }));

      expect(draggable.isDragging()).toBe(false);
      expect(onDragStart).not.toHaveBeenCalled();
    });

    it('mousemove during drag updates position', () => {
      const onDrag = vi.fn();
      const draggable = createDraggable({
        initialX: 0,
        initialY: 0,
        onDrag,
      });
      container.appendChild(draggable.element);

      // Start drag at (100, 100)
      draggable.element.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      }));

      // Move to (150, 120)
      document.dispatchEvent(new MouseEvent('mousemove', {
        bubbles: true,
        clientX: 150,
        clientY: 120,
      }));

      const pos = draggable.getPosition();
      expect(pos.x).toBe(50); // 150 - 100
      expect(pos.y).toBe(20); // 120 - 100
      expect(onDrag).toHaveBeenCalled();
    });
  });

  describe('axis constraints', () => {
    it('axis x constrains movement to horizontal only', () => {
      const draggable = createDraggable({
        initialX: 0,
        initialY: 0,
        axis: 'x',
      });
      container.appendChild(draggable.element);

      // Start drag
      draggable.element.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 0,
        clientY: 0,
      }));

      // Move diagonally
      document.dispatchEvent(new MouseEvent('mousemove', {
        bubbles: true,
        clientX: 50,
        clientY: 50,
      }));

      const pos = draggable.getPosition();
      expect(pos.x).toBe(50);
      expect(pos.y).toBe(0); // Y should not change
    });

    it('axis y constrains movement to vertical only', () => {
      const draggable = createDraggable({
        initialX: 0,
        initialY: 0,
        axis: 'y',
      });
      container.appendChild(draggable.element);

      // Start drag
      draggable.element.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 0,
        clientY: 0,
      }));

      // Move diagonally
      document.dispatchEvent(new MouseEvent('mousemove', {
        bubbles: true,
        clientX: 50,
        clientY: 50,
      }));

      const pos = draggable.getPosition();
      expect(pos.x).toBe(0); // X should not change
      expect(pos.y).toBe(50);
    });
  });

  describe('grid snapping', () => {
    it('snaps position to grid', () => {
      const draggable = createDraggable({
        initialX: 0,
        initialY: 0,
        grid: [20, 20],
      });
      container.appendChild(draggable.element);

      draggable.setPosition(35, 42);

      const pos = draggable.getPosition();
      expect(pos.x).toBe(40); // Snapped to nearest 20
      expect(pos.y).toBe(40); // Snapped to nearest 20
    });

    it('grid can have different x and y values', () => {
      const draggable = createDraggable({
        initialX: 0,
        initialY: 0,
        grid: [10, 25],
      });
      container.appendChild(draggable.element);

      draggable.setPosition(17, 38);

      const pos = draggable.getPosition();
      expect(pos.x).toBe(20); // Snapped to nearest 10
      expect(pos.y).toBe(50); // Snapped to nearest 25
    });
  });

  describe('bounds constraints', () => {
    it('constrains position within custom bounds', () => {
      const draggable = createDraggable({
        initialX: 0,
        initialY: 0,
        bounds: {
          left: 0,
          right: 100,
          top: 0,
          bottom: 100,
        },
      });
      container.appendChild(draggable.element);

      draggable.setPosition(150, 150);

      const pos = draggable.getPosition();
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(100);
    });

    it('constrains negative positions to bounds', () => {
      const draggable = createDraggable({
        initialX: 50,
        initialY: 50,
        bounds: {
          left: 0,
          top: 0,
        },
      });
      container.appendChild(draggable.element);

      draggable.setPosition(-50, -50);

      const pos = draggable.getPosition();
      expect(pos.x).toBe(0);
      expect(pos.y).toBe(0);
    });
  });

  describe('events', () => {
    it('dispatches dos:draggable:start event', () => {
      const eventHandler = vi.fn();
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      draggable.element.addEventListener('dos:draggable:start', eventHandler);

      draggable.element.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      }));

      expect(eventHandler).toHaveBeenCalled();
    });

    it('dispatches dos:draggable:end event', () => {
      const eventHandler = vi.fn();
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      draggable.element.addEventListener('dos:draggable:end', eventHandler);

      // Start drag
      draggable.element.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      }));

      // End drag
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(eventHandler).toHaveBeenCalled();
    });

    it('dispatches dos:draggable:drag event during drag', () => {
      const eventHandler = vi.fn();
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      draggable.element.addEventListener('dos:draggable:drag', eventHandler);

      // Start drag
      draggable.element.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      }));

      // Move
      document.dispatchEvent(new MouseEvent('mousemove', {
        bubbles: true,
        clientX: 150,
        clientY: 150,
      }));

      expect(eventHandler).toHaveBeenCalled();
    });

    it('event includes position and delta', () => {
      const eventHandler = vi.fn();
      const draggable = createDraggable({ initialX: 0, initialY: 0 });
      container.appendChild(draggable.element);

      draggable.element.addEventListener('dos:draggable:drag', eventHandler);

      // Start drag
      draggable.element.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 0,
        clientY: 0,
      }));

      // Move
      document.dispatchEvent(new MouseEvent('mousemove', {
        bubbles: true,
        clientX: 50,
        clientY: 30,
      }));

      expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining({
        detail: expect.objectContaining({
          position: { x: 50, y: 30 },
          delta: { deltaX: 50, deltaY: 30 },
        }),
      }));
    });
  });

  describe('keyboard navigation', () => {
    it('ArrowRight moves element right', () => {
      const draggable = createDraggable({ initialX: 100, initialY: 100 });
      container.appendChild(draggable.element);

      draggable.element.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
      }));

      expect(draggable.getPosition().x).toBe(101);
    });

    it('ArrowLeft moves element left', () => {
      const draggable = createDraggable({ initialX: 100, initialY: 100 });
      container.appendChild(draggable.element);

      draggable.element.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
      }));

      expect(draggable.getPosition().x).toBe(99);
    });

    it('ArrowDown moves element down', () => {
      const draggable = createDraggable({ initialX: 100, initialY: 100 });
      container.appendChild(draggable.element);

      draggable.element.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      }));

      expect(draggable.getPosition().y).toBe(101);
    });

    it('ArrowUp moves element up', () => {
      const draggable = createDraggable({ initialX: 100, initialY: 100 });
      container.appendChild(draggable.element);

      draggable.element.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
      }));

      expect(draggable.getPosition().y).toBe(99);
    });

    it('Shift+Arrow moves by 10 pixels', () => {
      const draggable = createDraggable({ initialX: 100, initialY: 100 });
      container.appendChild(draggable.element);

      draggable.element.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        shiftKey: true,
        bubbles: true,
      }));

      expect(draggable.getPosition().x).toBe(110);
    });

    it('keyboard navigation respects axis constraint', () => {
      const draggable = createDraggable({
        initialX: 100,
        initialY: 100,
        axis: 'x',
      });
      container.appendChild(draggable.element);

      draggable.element.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      }));

      expect(draggable.getPosition().y).toBe(100); // Should not change
    });

    it('keyboard navigation does not work when disabled', () => {
      const draggable = createDraggable({
        initialX: 100,
        initialY: 100,
        disabled: true,
      });
      container.appendChild(draggable.element);

      draggable.element.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
      }));

      expect(draggable.getPosition().x).toBe(100); // Should not change
    });
  });

  describe('cancel selector', () => {
    it('does not start drag when clicking cancel element', () => {
      const draggable = createDraggable({ cancel: '.no-drag' });
      container.appendChild(draggable.element);

      const cancelEl = document.createElement('button');
      cancelEl.className = 'no-drag';
      cancelEl.textContent = 'Click me';
      draggable.element.appendChild(cancelEl);

      cancelEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(draggable.isDragging()).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has tabindex for keyboard focus', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      expect(draggable.element.getAttribute('tabindex')).toBe('0');
    });

    it('has role application', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      expect(draggable.element.getAttribute('role')).toBe('application');
    });

    it('has aria-label', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      expect(draggable.element.getAttribute('aria-label')).toContain('Draggable');
    });

    it('has aria-grabbed false initially', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      expect(draggable.element.getAttribute('aria-grabbed')).toBe('false');
    });

    it('has aria-grabbed true when dragging', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      draggable.element.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      }));

      expect(draggable.element.getAttribute('aria-grabbed')).toBe('true');
    });

    it('has aria-grabbed false after drag ends', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      draggable.element.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      }));
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(draggable.element.getAttribute('aria-grabbed')).toBe('false');
    });
  });

  describe('destroy', () => {
    it('destroy cleans up resources', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      draggable.destroy();
      expect(true).toBe(true); // No errors
    });

    it('destroy stops active drag', () => {
      const draggable = createDraggable();
      container.appendChild(draggable.element);

      // Start drag
      draggable.element.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      }));

      expect(draggable.isDragging()).toBe(true);

      draggable.destroy();

      expect(draggable.isDragging()).toBe(false);
    });
  });
});
