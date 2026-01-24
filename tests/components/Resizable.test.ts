/**
 * @file Resizable.test.ts
 * @description Tests for the Resizable component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createResizable } from '../../src/components/Resizable';
import type { ResizableProps, ResizeHandle } from '../../src/components/Resizable';

describe('Resizable', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    // Clean up any body classes
    document.body.className = '';
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const resizable = createResizable();
      container.appendChild(resizable.element);

      expect(resizable.element).toBeInstanceOf(HTMLElement);
      expect(resizable.element.classList.contains('dos-resizable')).toBe(true);
    });

    it('renders with custom id', () => {
      const resizable = createResizable({ id: 'my-resizable' });
      container.appendChild(resizable.element);

      expect(resizable.element.id).toBe('my-resizable');
    });

    it('renders with custom className', () => {
      const resizable = createResizable({ className: 'custom-class' });
      container.appendChild(resizable.element);

      expect(resizable.element.classList.contains('custom-class')).toBe(true);
    });

    it('renders with initial dimensions', () => {
      const resizable = createResizable({
        initialWidth: 300,
        initialHeight: 200,
      });
      container.appendChild(resizable.element);

      expect(resizable.element.style.width).toBe('300px');
      expect(resizable.element.style.height).toBe('200px');
    });

    it('renders default handles (right, bottom, bottom-right)', () => {
      const resizable = createResizable();
      container.appendChild(resizable.element);

      const rightHandle = resizable.element.querySelector('.dos-resizable___handle--right');
      const bottomHandle = resizable.element.querySelector('.dos-resizable___handle--bottom');
      const bottomRightHandle = resizable.element.querySelector('.dos-resizable___handle--bottom-right');

      expect(rightHandle).not.toBeNull();
      expect(bottomHandle).not.toBeNull();
      expect(bottomRightHandle).not.toBeNull();
    });

    it('renders only specified handles', () => {
      const resizable = createResizable({
        handles: ['top', 'left'],
      });
      container.appendChild(resizable.element);

      const topHandle = resizable.element.querySelector('.dos-resizable___handle--top');
      const leftHandle = resizable.element.querySelector('.dos-resizable___handle--left');
      const rightHandle = resizable.element.querySelector('.dos-resizable___handle--right');

      expect(topHandle).not.toBeNull();
      expect(leftHandle).not.toBeNull();
      expect(rightHandle).toBeNull();
    });

    it('renders all handles when specified', () => {
      const handles: ResizeHandle[] = [
        'top', 'right', 'bottom', 'left',
        'top-left', 'top-right', 'bottom-left', 'bottom-right',
      ];
      const resizable = createResizable({ handles });
      container.appendChild(resizable.element);

      handles.forEach((handle) => {
        const el = resizable.element.querySelector(`.dos-resizable___handle--${handle}`);
        expect(el).not.toBeNull();
      });
    });

    it('renders content wrapper', () => {
      const resizable = createResizable();
      container.appendChild(resizable.element);

      const content = resizable.element.querySelector('.dos-resizable___content');
      expect(content).not.toBeNull();
    });

    it('renders with showHandlesOnHover class', () => {
      const resizable = createResizable({ showHandlesOnHover: true });
      container.appendChild(resizable.element);

      expect(resizable.element.classList.contains('dos-resizable--hover-handles')).toBe(true);
    });

    it('renders with disabled class', () => {
      const resizable = createResizable({ disabled: true });
      container.appendChild(resizable.element);

      expect(resizable.element.classList.contains('dos-resizable--disabled')).toBe(true);
    });
  });

  describe('content management', () => {
    it('renders initial content when provided as element', () => {
      const content = document.createElement('div');
      content.textContent = 'Test content';

      const resizable = createResizable({ content });
      container.appendChild(resizable.element);

      expect(resizable.contentElement.textContent).toBe('Test content');
    });

    it('renders initial content when provided as string', () => {
      const resizable = createResizable({ content: '<p>HTML content</p>' });
      container.appendChild(resizable.element);

      expect(resizable.contentElement.innerHTML).toBe('<p>HTML content</p>');
    });

    it('setContent replaces content with element', () => {
      const resizable = createResizable();
      container.appendChild(resizable.element);

      const newContent = document.createElement('span');
      newContent.textContent = 'New content';
      resizable.setContent(newContent);

      expect(resizable.contentElement.textContent).toBe('New content');
    });

    it('setContent replaces content with string', () => {
      const resizable = createResizable();
      container.appendChild(resizable.element);

      resizable.setContent('<strong>Strong text</strong>');

      expect(resizable.contentElement.innerHTML).toBe('<strong>Strong text</strong>');
    });
  });

  describe('size management', () => {
    it('getSize returns current dimensions', () => {
      const resizable = createResizable({
        initialWidth: 300,
        initialHeight: 200,
      });
      container.appendChild(resizable.element);

      const size = resizable.getSize();
      expect(size.width).toBe(300);
      expect(size.height).toBe(200);
    });

    it('setSize updates dimensions', () => {
      const resizable = createResizable();
      container.appendChild(resizable.element);

      resizable.setSize(400, 300);

      const size = resizable.getSize();
      expect(size.width).toBe(400);
      expect(size.height).toBe(300);
      expect(resizable.element.style.width).toBe('400px');
      expect(resizable.element.style.height).toBe('300px');
    });

    it('setSize respects constraints', () => {
      const resizable = createResizable({
        constraints: {
          minWidth: 100,
          maxWidth: 500,
          minHeight: 100,
          maxHeight: 400,
        },
      });
      container.appendChild(resizable.element);

      resizable.setSize(50, 50);
      expect(resizable.getSize().width).toBe(100);
      expect(resizable.getSize().height).toBe(100);

      resizable.setSize(600, 500);
      expect(resizable.getSize().width).toBe(500);
      expect(resizable.getSize().height).toBe(400);
    });

    it('reset returns to initial dimensions', () => {
      const resizable = createResizable({
        initialWidth: 300,
        initialHeight: 200,
      });
      container.appendChild(resizable.element);

      resizable.setSize(400, 300);
      resizable.reset();

      const size = resizable.getSize();
      expect(size.width).toBe(300);
      expect(size.height).toBe(200);
    });
  });

  describe('enable/disable', () => {
    it('enable removes disabled class', () => {
      const resizable = createResizable({ disabled: true });
      container.appendChild(resizable.element);

      resizable.enable();

      expect(resizable.element.classList.contains('dos-resizable--disabled')).toBe(false);
      expect(resizable.isDisabled()).toBe(false);
    });

    it('disable adds disabled class', () => {
      const resizable = createResizable();
      container.appendChild(resizable.element);

      resizable.disable();

      expect(resizable.element.classList.contains('dos-resizable--disabled')).toBe(true);
      expect(resizable.isDisabled()).toBe(true);
    });

    it('isDisabled returns correct state', () => {
      const resizable = createResizable({ disabled: true });
      expect(resizable.isDisabled()).toBe(true);

      resizable.enable();
      expect(resizable.isDisabled()).toBe(false);

      resizable.disable();
      expect(resizable.isDisabled()).toBe(true);
    });
  });

  describe('resize interactions', () => {
    it('isResizing returns false initially', () => {
      const resizable = createResizable();
      container.appendChild(resizable.element);

      expect(resizable.isResizing()).toBe(false);
    });

    it('mousedown on handle starts resize', () => {
      const onResizeStart = vi.fn();
      const resizable = createResizable({
        handles: ['right'],
        onResizeStart,
      });
      container.appendChild(resizable.element);

      const handle = resizable.element.querySelector('.dos-resizable___handle--right') as HTMLElement;
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 100 }));

      expect(resizable.isResizing()).toBe(true);
      expect(resizable.element.classList.contains('dos-resizable--resizing')).toBe(true);
      expect(onResizeStart).toHaveBeenCalled();
    });

    it('mouseup ends resize', () => {
      const onResizeEnd = vi.fn();
      const resizable = createResizable({
        handles: ['right'],
        onResizeEnd,
      });
      container.appendChild(resizable.element);

      const handle = resizable.element.querySelector('.dos-resizable___handle--right') as HTMLElement;
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 100 }));

      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(resizable.isResizing()).toBe(false);
      expect(resizable.element.classList.contains('dos-resizable--resizing')).toBe(false);
      expect(onResizeEnd).toHaveBeenCalled();
    });

    it('resize does not start when disabled', () => {
      const onResizeStart = vi.fn();
      const resizable = createResizable({
        handles: ['right'],
        disabled: true,
        onResizeStart,
      });
      container.appendChild(resizable.element);

      const handle = resizable.element.querySelector('.dos-resizable___handle--right') as HTMLElement;
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 100 }));

      expect(resizable.isResizing()).toBe(false);
      expect(onResizeStart).not.toHaveBeenCalled();
    });
  });

  describe('events', () => {
    it('dispatches dos:resizable:start event', () => {
      const eventHandler = vi.fn();
      const resizable = createResizable({ handles: ['right'] });
      container.appendChild(resizable.element);

      resizable.element.addEventListener('dos:resizable:start', eventHandler);

      const handle = resizable.element.querySelector('.dos-resizable___handle--right') as HTMLElement;
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 100 }));

      expect(eventHandler).toHaveBeenCalled();
    });

    it('dispatches dos:resizable:end event', () => {
      const eventHandler = vi.fn();
      const resizable = createResizable({ handles: ['right'] });
      container.appendChild(resizable.element);

      resizable.element.addEventListener('dos:resizable:end', eventHandler);

      const handle = resizable.element.querySelector('.dos-resizable___handle--right') as HTMLElement;
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 100 }));
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(eventHandler).toHaveBeenCalled();
    });

    it('start event includes size and handle', () => {
      const eventHandler = vi.fn();
      const resizable = createResizable({
        handles: ['right'],
        initialWidth: 200,
        initialHeight: 150,
      });
      container.appendChild(resizable.element);

      resizable.element.addEventListener('dos:resizable:start', eventHandler);

      const handle = resizable.element.querySelector('.dos-resizable___handle--right') as HTMLElement;
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 100 }));

      expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining({
        detail: expect.objectContaining({
          size: { width: 200, height: 150 },
          handle: 'right',
        }),
      }));
    });
  });

  describe('keyboard navigation', () => {
    it('ArrowRight increases width on right handle', () => {
      const onResize = vi.fn();
      const resizable = createResizable({
        handles: ['right'],
        initialWidth: 200,
        step: 10,
        onResize,
      });
      container.appendChild(resizable.element);

      const handle = resizable.element.querySelector('.dos-resizable___handle--right') as HTMLElement;
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

      expect(resizable.getSize().width).toBe(210);
      expect(onResize).toHaveBeenCalled();
    });

    it('ArrowLeft decreases width on right handle', () => {
      const resizable = createResizable({
        handles: ['right'],
        initialWidth: 200,
        step: 10,
      });
      container.appendChild(resizable.element);

      const handle = resizable.element.querySelector('.dos-resizable___handle--right') as HTMLElement;
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));

      expect(resizable.getSize().width).toBe(190);
    });

    it('ArrowDown increases height on bottom handle', () => {
      const resizable = createResizable({
        handles: ['bottom'],
        initialHeight: 150,
        step: 10,
      });
      container.appendChild(resizable.element);

      const handle = resizable.element.querySelector('.dos-resizable___handle--bottom') as HTMLElement;
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(resizable.getSize().height).toBe(160);
    });

    it('ArrowUp decreases height on bottom handle', () => {
      const resizable = createResizable({
        handles: ['bottom'],
        initialHeight: 150,
        step: 10,
      });
      container.appendChild(resizable.element);

      const handle = resizable.element.querySelector('.dos-resizable___handle--bottom') as HTMLElement;
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

      expect(resizable.getSize().height).toBe(140);
    });

    it('Shift+Arrow increases step size', () => {
      const resizable = createResizable({
        handles: ['right'],
        initialWidth: 200,
        step: 10,
      });
      container.appendChild(resizable.element);

      const handle = resizable.element.querySelector('.dos-resizable___handle--right') as HTMLElement;
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true, bubbles: true }));

      expect(resizable.getSize().width).toBe(300); // 200 + (10 * 10)
    });

    it('keyboard resize respects constraints', () => {
      const resizable = createResizable({
        handles: ['right'],
        initialWidth: 200,
        step: 10,
        constraints: { maxWidth: 205 },
      });
      container.appendChild(resizable.element);

      const handle = resizable.element.querySelector('.dos-resizable___handle--right') as HTMLElement;
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

      expect(resizable.getSize().width).toBe(205);
    });

    it('keyboard resize does not work when disabled', () => {
      const resizable = createResizable({
        handles: ['right'],
        initialWidth: 200,
        disabled: true,
      });
      container.appendChild(resizable.element);

      const handle = resizable.element.querySelector('.dos-resizable___handle--right') as HTMLElement;
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

      expect(resizable.getSize().width).toBe(200);
    });
  });

  describe('accessibility', () => {
    it('handles have tabindex', () => {
      const resizable = createResizable({ handles: ['right', 'bottom'] });
      container.appendChild(resizable.element);

      const handles = resizable.element.querySelectorAll('.dos-resizable___handle');
      handles.forEach((handle) => {
        expect(handle.getAttribute('tabindex')).toBe('0');
      });
    });

    it('handles have role separator', () => {
      const resizable = createResizable({ handles: ['right'] });
      container.appendChild(resizable.element);

      const handle = resizable.element.querySelector('.dos-resizable___handle--right');
      expect(handle?.getAttribute('role')).toBe('separator');
    });

    it('handles have aria-label', () => {
      const resizable = createResizable({ handles: ['right', 'bottom-right'] });
      container.appendChild(resizable.element);

      const rightHandle = resizable.element.querySelector('.dos-resizable___handle--right');
      const cornerHandle = resizable.element.querySelector('.dos-resizable___handle--bottom-right');

      expect(rightHandle?.getAttribute('aria-label')).toBe('Resize right');
      expect(cornerHandle?.getAttribute('aria-label')).toBe('Resize bottom right');
    });

    it('handles have aria-orientation', () => {
      const resizable = createResizable({ handles: ['right', 'bottom'] });
      container.appendChild(resizable.element);

      const rightHandle = resizable.element.querySelector('.dos-resizable___handle--right');
      const bottomHandle = resizable.element.querySelector('.dos-resizable___handle--bottom');

      expect(rightHandle?.getAttribute('aria-orientation')).toBe('vertical');
      expect(bottomHandle?.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('handles have aria-valuenow', () => {
      const resizable = createResizable({
        handles: ['right', 'bottom'],
        initialWidth: 200,
        initialHeight: 150,
      });
      container.appendChild(resizable.element);

      const rightHandle = resizable.element.querySelector('.dos-resizable___handle--right');
      const bottomHandle = resizable.element.querySelector('.dos-resizable___handle--bottom');

      expect(rightHandle?.getAttribute('aria-valuenow')).toBe('200');
      expect(bottomHandle?.getAttribute('aria-valuenow')).toBe('150');
    });

    it('aria-valuenow updates on resize', () => {
      const resizable = createResizable({
        handles: ['right'],
        initialWidth: 200,
        step: 10,
      });
      container.appendChild(resizable.element);

      const handle = resizable.element.querySelector('.dos-resizable___handle--right') as HTMLElement;
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

      expect(handle.getAttribute('aria-valuenow')).toBe('210');
    });
  });

  describe('aspect ratio', () => {
    it('maintains aspect ratio with aspectRatio: true', () => {
      const resizable = createResizable({
        handles: ['right'],
        initialWidth: 200,
        initialHeight: 100,
        aspectRatio: true,
        step: 10,
      });
      container.appendChild(resizable.element);

      resizable.setSize(300, 100);

      // Aspect ratio is 2:1, so height should be 150
      expect(resizable.getSize().width).toBe(300);
      expect(resizable.getSize().height).toBe(150);
    });

    it('maintains custom aspect ratio', () => {
      const resizable = createResizable({
        handles: ['right'],
        initialWidth: 200,
        initialHeight: 200,
        aspectRatio: 4 / 3, // 4:3 ratio
      });
      container.appendChild(resizable.element);

      resizable.setSize(400, 200);

      // Width is 400, height should be 400 / (4/3) = 300
      expect(resizable.getSize().width).toBe(400);
      expect(resizable.getSize().height).toBe(300);
    });
  });

  describe('destroy', () => {
    it('destroy cleans up resources', () => {
      const resizable = createResizable();
      container.appendChild(resizable.element);

      resizable.destroy();
      expect(true).toBe(true); // No errors
    });

    it('destroy stops active resize', () => {
      const resizable = createResizable({ handles: ['right'] });
      container.appendChild(resizable.element);

      // Start resize
      const handle = resizable.element.querySelector('.dos-resizable___handle--right') as HTMLElement;
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 100 }));

      expect(resizable.isResizing()).toBe(true);

      resizable.destroy();

      expect(resizable.isResizing()).toBe(false);
    });
  });
});
