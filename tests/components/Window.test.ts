/**
 * Window Component Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createWindow } from '../../src/components/Window';

describe('Window', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.body.innerHTML = '';
  });

  describe('rendering', () => {
    it('creates a window element', () => {
      const window = createWindow({ title: 'Test Window' });
      expect(window.element).toBeDefined();
      expect(window.element.classList.contains('dos-window')).toBe(true);
    });

    it('renders with title', () => {
      const window = createWindow({ title: 'My Window' });
      container.appendChild(window.element);

      const title = window.element.querySelector('.dos-window__title');
      expect(title?.textContent).toBe('My Window');
    });

    it('renders with string content', () => {
      const window = createWindow({
        title: 'Test',
        content: 'Hello World',
      });
      container.appendChild(window.element);

      const content = window.element.querySelector('.dos-window__content');
      expect(content?.textContent).toBe('Hello World');
    });

    it('renders with element content', () => {
      const span = document.createElement('span');
      span.textContent = 'Custom Content';

      const window = createWindow({
        title: 'Test',
        content: span,
      });
      container.appendChild(window.element);

      const content = window.element.querySelector('.dos-window__content');
      expect(content?.querySelector('span')?.textContent).toBe('Custom Content');
    });

    it('renders minimize button when showMinimize is true', () => {
      const window = createWindow({
        title: 'Test',
        showMinimize: true,
      });
      container.appendChild(window.element);

      const minimizeBtn = window.element.querySelector('.dos-window__control--minimize');
      expect(minimizeBtn).toBeDefined();
    });

    it('does not render minimize button when showMinimize is false', () => {
      const window = createWindow({
        title: 'Test',
        showMinimize: false,
      });
      container.appendChild(window.element);

      const minimizeBtn = window.element.querySelector('.dos-window__control--minimize');
      expect(minimizeBtn).toBeNull();
    });

    it('renders maximize button when showMaximize is true', () => {
      const window = createWindow({
        title: 'Test',
        showMaximize: true,
      });
      container.appendChild(window.element);

      const maximizeBtn = window.element.querySelector('.dos-window__control--maximize');
      expect(maximizeBtn).toBeDefined();
    });

    it('does not render maximize button when showMaximize is false', () => {
      const window = createWindow({
        title: 'Test',
        showMaximize: false,
      });
      container.appendChild(window.element);

      const maximizeBtn = window.element.querySelector('.dos-window__control--maximize');
      expect(maximizeBtn).toBeNull();
    });

    it('renders close button when showClose is true', () => {
      const window = createWindow({
        title: 'Test',
        showClose: true,
      });
      container.appendChild(window.element);

      const closeBtn = window.element.querySelector('.dos-window__control--close');
      expect(closeBtn).toBeDefined();
    });

    it('does not render close button when showClose is false', () => {
      const window = createWindow({
        title: 'Test',
        showClose: false,
      });
      container.appendChild(window.element);

      const closeBtn = window.element.querySelector('.dos-window__control--close');
      expect(closeBtn).toBeNull();
    });

    it('renders resize handles when resizable is true', () => {
      const window = createWindow({
        title: 'Test',
        resizable: true,
      });
      container.appendChild(window.element);

      const handles = window.element.querySelectorAll('.dos-window__resize-handle');
      expect(handles.length).toBe(8); // n, s, e, w, ne, nw, se, sw
    });

    it('applies custom className', () => {
      const window = createWindow({
        title: 'Test',
        className: 'my-custom-class',
      });
      expect(window.element.classList.contains('my-custom-class')).toBe(true);
    });

    it('applies custom id', () => {
      const window = createWindow({
        title: 'Test',
        id: 'my-window-id',
      });
      expect(window.element.id).toBe('my-window-id');
    });

    it('sets initial position', () => {
      const window = createWindow({
        title: 'Test',
        x: 100,
        y: 200,
      });
      expect(window.element.style.left).toBe('100px');
      expect(window.element.style.top).toBe('200px');
    });

    it('sets initial size', () => {
      const window = createWindow({
        title: 'Test',
        width: 500,
        height: 400,
      });
      expect(window.element.style.width).toBe('500px');
      expect(window.element.style.height).toBe('400px');
    });
  });

  describe('open/close behavior', () => {
    it('starts hidden by default', () => {
      const window = createWindow({ title: 'Test' });
      container.appendChild(window.element);
      expect(window.element.classList.contains('dos-window--hidden')).toBe(true);
      expect(window.isVisible()).toBe(false);
    });

    it('shows when open() is called', () => {
      const window = createWindow({ title: 'Test' });
      container.appendChild(window.element);

      window.open();
      expect(window.element.classList.contains('dos-window--hidden')).toBe(false);
      expect(window.isVisible()).toBe(true);
    });

    it('hides when close() is called', () => {
      const window = createWindow({ title: 'Test' });
      container.appendChild(window.element);

      window.open();
      window.close();
      expect(window.element.classList.contains('dos-window--hidden')).toBe(true);
      expect(window.isVisible()).toBe(false);
    });

    it('calls onClose callback when closed', () => {
      const onClose = vi.fn();
      const window = createWindow({
        title: 'Test',
        onClose,
      });
      container.appendChild(window.element);

      window.open();
      window.close();
      expect(onClose).toHaveBeenCalled();
    });

    it('closes when close button is clicked', () => {
      const onClose = vi.fn();
      const window = createWindow({
        title: 'Test',
        onClose,
      });
      container.appendChild(window.element);
      window.open();

      const closeBtn = window.element.querySelector('.dos-window__control--close') as HTMLButtonElement;
      closeBtn.click();

      expect(window.isVisible()).toBe(false);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('minimize/maximize/restore', () => {
    it('minimizes when minimize() is called', () => {
      const onMinimize = vi.fn();
      const window = createWindow({
        title: 'Test',
        onMinimize,
      });
      container.appendChild(window.element);
      window.open();

      window.minimize();
      expect(window.element.classList.contains('dos-window--minimized')).toBe(true);
      expect(window.getState()).toBe('minimized');
      expect(onMinimize).toHaveBeenCalled();
    });

    it('maximizes when maximize() is called', () => {
      const onMaximize = vi.fn();
      const window = createWindow({
        title: 'Test',
        onMaximize,
      });
      container.appendChild(window.element);
      window.open();

      window.maximize();
      expect(window.element.classList.contains('dos-window--maximized')).toBe(true);
      expect(window.getState()).toBe('maximized');
      expect(onMaximize).toHaveBeenCalled();
    });

    it('restores when restore() is called from minimized', () => {
      const onRestore = vi.fn();
      const window = createWindow({
        title: 'Test',
        onRestore,
      });
      container.appendChild(window.element);
      window.open();
      window.minimize();

      window.restore();
      expect(window.element.classList.contains('dos-window--minimized')).toBe(false);
      expect(window.getState()).toBe('normal');
      expect(onRestore).toHaveBeenCalled();
    });

    it('restores when restore() is called from maximized', () => {
      const onRestore = vi.fn();
      const window = createWindow({
        title: 'Test',
        x: 100,
        y: 200,
        width: 300,
        height: 250,
        onRestore,
      });
      container.appendChild(window.element);
      window.open();
      window.maximize();

      window.restore();
      expect(window.element.classList.contains('dos-window--maximized')).toBe(false);
      expect(window.getState()).toBe('normal');
      // Should restore original position and size
      expect(window.getPosition()).toEqual({ x: 100, y: 200 });
      expect(window.getSize()).toEqual({ width: 300, height: 250 });
      expect(onRestore).toHaveBeenCalled();
    });

    it('minimizes when minimize button is clicked', () => {
      const window = createWindow({ title: 'Test' });
      container.appendChild(window.element);
      window.open();

      const minimizeBtn = window.element.querySelector('.dos-window__control--minimize') as HTMLButtonElement;
      minimizeBtn.click();

      expect(window.getState()).toBe('minimized');
    });

    it('maximizes when maximize button is clicked', () => {
      const window = createWindow({ title: 'Test' });
      container.appendChild(window.element);
      window.open();

      const maximizeBtn = window.element.querySelector('.dos-window__control--maximize') as HTMLButtonElement;
      maximizeBtn.click();

      expect(window.getState()).toBe('maximized');
    });

    it('restores when minimize button is clicked while minimized', () => {
      const window = createWindow({ title: 'Test' });
      container.appendChild(window.element);
      window.open();
      window.minimize();

      const minimizeBtn = window.element.querySelector('.dos-window__control--minimize') as HTMLButtonElement;
      minimizeBtn.click();

      expect(window.getState()).toBe('normal');
    });

    it('restores when maximize button is clicked while maximized', () => {
      const window = createWindow({ title: 'Test' });
      container.appendChild(window.element);
      window.open();
      window.maximize();

      const maximizeBtn = window.element.querySelector('.dos-window__control--maximize') as HTMLButtonElement;
      maximizeBtn.click();

      expect(window.getState()).toBe('normal');
    });
  });

  describe('instance methods', () => {
    it('setTitle updates the title', () => {
      const window = createWindow({ title: 'Original' });
      container.appendChild(window.element);

      window.setTitle('New Title');
      const title = window.element.querySelector('.dos-window__title');
      expect(title?.textContent).toBe('New Title');
    });

    it('setContent updates content with string', () => {
      const window = createWindow({
        title: 'Test',
        content: 'Original',
      });
      container.appendChild(window.element);

      window.setContent('New Content');
      const content = window.element.querySelector('.dos-window__content');
      expect(content?.textContent).toBe('New Content');
    });

    it('setContent updates content with element', () => {
      const window = createWindow({
        title: 'Test',
        content: 'Original',
      });
      container.appendChild(window.element);

      const newEl = document.createElement('span');
      newEl.textContent = 'Element Content';
      window.setContent(newEl);

      const content = window.element.querySelector('.dos-window__content');
      expect(content?.querySelector('span')?.textContent).toBe('Element Content');
    });

    it('setPosition updates the window position', () => {
      const onMove = vi.fn();
      const window = createWindow({
        title: 'Test',
        x: 0,
        y: 0,
        onMove,
      });
      container.appendChild(window.element);

      window.setPosition(150, 250);
      expect(window.element.style.left).toBe('150px');
      expect(window.element.style.top).toBe('250px');
      expect(window.getPosition()).toEqual({ x: 150, y: 250 });
      expect(onMove).toHaveBeenCalledWith({ x: 150, y: 250 });
    });

    it('setSize updates the window size', () => {
      const onResize = vi.fn();
      const window = createWindow({
        title: 'Test',
        width: 300,
        height: 200,
        onResize,
      });
      container.appendChild(window.element);

      window.setSize(500, 400);
      expect(window.element.style.width).toBe('500px');
      expect(window.element.style.height).toBe('400px');
      expect(window.getSize()).toEqual({ width: 500, height: 400 });
      expect(onResize).toHaveBeenCalledWith({ width: 500, height: 400 });
    });

    it('setSize respects minWidth and minHeight', () => {
      const window = createWindow({
        title: 'Test',
        minWidth: 200,
        minHeight: 150,
      });
      container.appendChild(window.element);

      window.setSize(100, 50); // Below minimums
      expect(window.getSize()).toEqual({ width: 200, height: 150 });
    });

    it('destroy removes the window from DOM', () => {
      const window = createWindow({ title: 'Test' });
      container.appendChild(window.element);

      expect(container.querySelector('.dos-window')).not.toBeNull();
      window.destroy();
      expect(container.querySelector('.dos-window')).toBeNull();
    });

    it('focus brings window to front', () => {
      const onFocus = vi.fn();
      const window = createWindow({
        title: 'Test',
        onFocus,
      });
      container.appendChild(window.element);
      window.open();

      window.focus();
      expect(window.element.classList.contains('dos-window--focused')).toBe(true);
      expect(window.isFocused()).toBe(true);
      expect(onFocus).toHaveBeenCalled();
    });
  });

  describe('keyboard navigation', () => {
    it('closes on Escape key when close button is shown', () => {
      const onClose = vi.fn();
      const window = createWindow({
        title: 'Test',
        showClose: true,
        onClose,
      });
      container.appendChild(window.element);
      window.open();
      window.focus();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.element.dispatchEvent(event);

      expect(window.isVisible()).toBe(false);
      expect(onClose).toHaveBeenCalled();
    });

    it('does not close on Escape when close button is hidden', () => {
      const onClose = vi.fn();
      const window = createWindow({
        title: 'Test',
        showClose: false,
        onClose,
      });
      container.appendChild(window.element);
      window.open();
      window.focus();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.element.dispatchEvent(event);

      expect(window.isVisible()).toBe(true);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('control buttons are keyboard accessible', () => {
      const window = createWindow({ title: 'Test' });
      container.appendChild(window.element);

      const closeBtn = window.element.querySelector('.dos-window__control--close') as HTMLButtonElement;
      const minimizeBtn = window.element.querySelector('.dos-window__control--minimize') as HTMLButtonElement;
      const maximizeBtn = window.element.querySelector('.dos-window__control--maximize') as HTMLButtonElement;

      expect(closeBtn.tagName).toBe('BUTTON');
      expect(minimizeBtn.tagName).toBe('BUTTON');
      expect(maximizeBtn.tagName).toBe('BUTTON');
    });
  });

  describe('accessibility', () => {
    it('has role="dialog"', () => {
      const window = createWindow({ title: 'Test' });
      expect(window.element.getAttribute('role')).toBe('dialog');
    });

    it('has aria-labelledby pointing to title', () => {
      const window = createWindow({ title: 'Test', id: 'test-window' });
      expect(window.element.getAttribute('aria-labelledby')).toBe('test-window-title');
    });

    it('is focusable', () => {
      const window = createWindow({ title: 'Test' });
      expect(window.element.getAttribute('tabindex')).toBe('-1');
    });

    it('control buttons have aria-labels', () => {
      const window = createWindow({ title: 'Test' });
      container.appendChild(window.element);

      const closeBtn = window.element.querySelector('.dos-window__control--close');
      const minimizeBtn = window.element.querySelector('.dos-window__control--minimize');
      const maximizeBtn = window.element.querySelector('.dos-window__control--maximize');

      expect(closeBtn?.getAttribute('aria-label')).toBe('Close window');
      expect(minimizeBtn?.getAttribute('aria-label')).toBe('Minimize window');
      expect(maximizeBtn?.getAttribute('aria-label')).toBe('Maximize window');
    });
  });

  describe('initial state', () => {
    it('starts minimized when state is "minimized"', () => {
      const window = createWindow({
        title: 'Test',
        state: 'minimized',
      });
      container.appendChild(window.element);

      expect(window.getState()).toBe('minimized');
      expect(window.element.classList.contains('dos-window--minimized')).toBe(true);
    });

    it('starts maximized when state is "maximized"', () => {
      const window = createWindow({
        title: 'Test',
        state: 'maximized',
      });
      container.appendChild(window.element);

      expect(window.getState()).toBe('maximized');
      expect(window.element.classList.contains('dos-window--maximized')).toBe(true);
    });
  });
});
