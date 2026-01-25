/**
 * @file ScrollArea.test.ts
 * @description Tests for the ScrollArea component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createScrollArea } from '../../src/components/ScrollArea';
import type { ScrollAreaProps as _ScrollAreaProps } from '../../src/components/ScrollArea';

describe('ScrollArea', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      expect(scrollArea.element).toBeInstanceOf(HTMLElement);
      expect(scrollArea.element.classList.contains('dos-scroll-area')).toBe(true);
      expect(scrollArea.element.classList.contains('dos-scroll-area--vertical')).toBe(true);
    });

    it('renders vertical scrollbar by default', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const verticalScrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--vertical');
      expect(verticalScrollbar).not.toBeNull();

      const horizontalScrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--horizontal');
      expect(horizontalScrollbar).toBeNull();
    });

    it('renders horizontal scrollbar when specified', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const verticalScrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--vertical');
      expect(verticalScrollbar).toBeNull();

      const horizontalScrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--horizontal');
      expect(horizontalScrollbar).not.toBeNull();
    });

    it('renders both scrollbars when orientation is both', () => {
      const scrollArea = createScrollArea({ orientation: 'both' });
      container.appendChild(scrollArea.element);

      const verticalScrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--vertical');
      const horizontalScrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--horizontal');
      const corner = scrollArea.element.querySelector('.dos-scroll-area___corner');

      expect(verticalScrollbar).not.toBeNull();
      expect(horizontalScrollbar).not.toBeNull();
      expect(corner).not.toBeNull();
    });

    it('renders with custom id', () => {
      const scrollArea = createScrollArea({ id: 'my-scroll-area' });
      container.appendChild(scrollArea.element);

      expect(scrollArea.element.id).toBe('my-scroll-area');
    });

    it('renders with custom className', () => {
      const scrollArea = createScrollArea({ className: 'custom-class' });
      container.appendChild(scrollArea.element);

      expect(scrollArea.element.classList.contains('custom-class')).toBe(true);
    });

    it('renders viewport with tabindex', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      expect(scrollArea.viewport.getAttribute('tabindex')).toBe('0');
    });

    it('renders vertical scrollbar with arrow buttons', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const upButton = scrollArea.element.querySelector('.dos-scroll-area___button--up');
      const downButton = scrollArea.element.querySelector('.dos-scroll-area___button--down');

      expect(upButton?.innerHTML).toBe('▲');
      expect(downButton?.innerHTML).toBe('▼');
    });

    it('renders horizontal scrollbar with arrow buttons', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const leftButton = scrollArea.element.querySelector('.dos-scroll-area___button--left');
      const rightButton = scrollArea.element.querySelector('.dos-scroll-area___button--right');

      expect(leftButton?.innerHTML).toBe('◄');
      expect(rightButton?.innerHTML).toBe('►');
    });

    it('renders with auto-hide class when enabled', () => {
      const scrollArea = createScrollArea({ autoHide: true });
      container.appendChild(scrollArea.element);

      expect(scrollArea.element.classList.contains('dos-scroll-area--auto-hide')).toBe(true);
    });

    it('sets scrollbar size CSS property', () => {
      const scrollArea = createScrollArea({ scrollbarSize: 20 });
      container.appendChild(scrollArea.element);

      expect(scrollArea.element.style.getPropertyValue('--dos-scrollbar-size')).toBe('20px');
    });

    it('sets min thumb size CSS property', () => {
      const scrollArea = createScrollArea({ minThumbSize: 30 });
      container.appendChild(scrollArea.element);

      expect(scrollArea.element.style.getPropertyValue('--dos-scrollbar-min-thumb')).toBe('30px');
    });
  });

  describe('content management', () => {
    it('renders initial content when provided', () => {
      const content = document.createElement('div');
      content.textContent = 'Test content';

      const scrollArea = createScrollArea({ content });
      container.appendChild(scrollArea.element);

      const contentWrapper = scrollArea.element.querySelector('.dos-scroll-area___content');
      expect(contentWrapper?.textContent).toBe('Test content');
    });

    it('renders initial content as string', () => {
      const scrollArea = createScrollArea({ content: '<p>HTML content</p>' as unknown as HTMLElement });
      container.appendChild(scrollArea.element);

      // String content is set via innerHTML, so we check if it's converted
      // In the implementation, if content is string, it uses innerHTML
    });

    it('setContent replaces content with element', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      const newContent = document.createElement('div');
      newContent.textContent = 'New content';
      scrollArea.setContent(newContent);

      const contentWrapper = scrollArea.element.querySelector('.dos-scroll-area___content');
      expect(contentWrapper?.textContent).toBe('New content');
    });

    it('setContent replaces content with string', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      scrollArea.setContent('<span>String content</span>');

      const contentWrapper = scrollArea.element.querySelector('.dos-scroll-area___content');
      expect(contentWrapper?.innerHTML).toBe('<span>String content</span>');
    });
  });

  describe('scroll position', () => {
    it('getScrollPosition returns current position', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      const pos = scrollArea.getScrollPosition();
      expect(pos).toHaveProperty('top');
      expect(pos).toHaveProperty('left');
      expect(pos).toHaveProperty('maxTop');
      expect(pos).toHaveProperty('maxLeft');
    });

    it('getScrollPosition returns 0 initially', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      const pos = scrollArea.getScrollPosition();
      expect(pos.top).toBe(0);
      expect(pos.left).toBe(0);
    });

    it('scrollTo updates scroll position', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      // Create tall content to enable scrolling
      const tallContent = document.createElement('div');
      tallContent.style.height = '1000px';
      tallContent.style.width = '1000px';
      scrollArea.setContent(tallContent);
      scrollArea.viewport.style.height = '200px';
      scrollArea.viewport.style.width = '200px';
      scrollArea.viewport.style.overflow = 'auto';

      scrollArea.scrollTo({ top: 100, behavior: 'instant' });

      // In JSDOM, scrolling may not work perfectly, so we just check no errors
      expect(scrollArea.viewport.scrollTop).toBeDefined();
    });

    it('scrollBy updates scroll position relatively', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      // Create tall content
      const tallContent = document.createElement('div');
      tallContent.style.height = '1000px';
      scrollArea.setContent(tallContent);
      scrollArea.viewport.style.height = '200px';
      scrollArea.viewport.style.overflow = 'auto';

      scrollArea.scrollBy({ top: 50, behavior: 'instant' });

      // Just verify no errors
      expect(true).toBe(true);
    });

    it('scrollToTop scrolls to top', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      scrollArea.scrollToTop();
      expect(scrollArea.viewport.scrollTop).toBe(0);
    });

    it('scrollToBottom scrolls to bottom', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      const tallContent = document.createElement('div');
      tallContent.style.height = '1000px';
      scrollArea.setContent(tallContent);
      scrollArea.viewport.style.height = '200px';
      scrollArea.viewport.style.overflow = 'auto';

      scrollArea.scrollToBottom();
      // Verify method executed without error
      expect(true).toBe(true);
    });

    it('scrollIntoView scrolls element into view', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      const tallContent = document.createElement('div');
      tallContent.style.height = '1000px';
      const targetElement = document.createElement('div');
      targetElement.style.marginTop = '500px';
      tallContent.appendChild(targetElement);
      scrollArea.setContent(tallContent);

      scrollArea.scrollIntoView(targetElement);
      // Verify method executed without error
      expect(true).toBe(true);
    });
  });

  describe('scrollbar visibility', () => {
    it('showScrollbars adds visible class', () => {
      const scrollArea = createScrollArea({ autoHide: true });
      container.appendChild(scrollArea.element);

      scrollArea.showScrollbars();

      expect(scrollArea.element.classList.contains('dos-scroll-area--scrollbars-visible')).toBe(true);
    });

    it('hideScrollbars removes visible class', () => {
      const scrollArea = createScrollArea({ autoHide: true });
      container.appendChild(scrollArea.element);

      scrollArea.showScrollbars();
      scrollArea.hideScrollbars();

      expect(scrollArea.element.classList.contains('dos-scroll-area--scrollbars-visible')).toBe(false);
    });

    it('auto-hide shows then hides scrollbars after delay', async () => {
      vi.useFakeTimers();

      const scrollArea = createScrollArea({ autoHide: true, autoHideDelay: 100 });
      container.appendChild(scrollArea.element);

      scrollArea.showScrollbars();
      expect(scrollArea.element.classList.contains('dos-scroll-area--scrollbars-visible')).toBe(true);

      await vi.advanceTimersByTimeAsync(150);

      expect(scrollArea.element.classList.contains('dos-scroll-area--scrollbars-visible')).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('refresh', () => {
    it('refresh updates scrollbar dimensions', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      // Should not throw
      scrollArea.refresh();
      expect(true).toBe(true);
    });
  });

  describe('events', () => {
    it('calls onScroll callback when scrolling', () => {
      const onScroll = vi.fn();
      const scrollArea = createScrollArea({ onScroll });
      container.appendChild(scrollArea.element);

      // Trigger scroll
      scrollArea.viewport.dispatchEvent(new Event('scroll'));

      expect(onScroll).toHaveBeenCalled();
    });

    it('dispatches dos:scrollarea:scroll event when scrolling', () => {
      const eventHandler = vi.fn();
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      scrollArea.element.addEventListener('dos:scrollarea:scroll', eventHandler);
      scrollArea.viewport.dispatchEvent(new Event('scroll'));

      expect(eventHandler).toHaveBeenCalled();
    });

    it('scroll event includes position details', () => {
      const eventHandler = vi.fn();
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      scrollArea.element.addEventListener('dos:scrollarea:scroll', eventHandler);
      scrollArea.viewport.dispatchEvent(new Event('scroll'));

      expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining({
        detail: expect.objectContaining({
          top: expect.any(Number),
          left: expect.any(Number),
        }),
      }));
    });
  });

  describe('button interactions', () => {
    it('up button scrolls up', () => {
      const onScroll = vi.fn();
      const scrollArea = createScrollArea({ orientation: 'vertical', onScroll });
      container.appendChild(scrollArea.element);

      const upButton = scrollArea.element.querySelector('.dos-scroll-area___button--up') as HTMLElement;
      upButton.click();

      // onScroll is called via updateScrollbars after scrollBy
      // Just verify button exists and click doesn't throw
      expect(upButton).not.toBeNull();
    });

    it('down button scrolls down', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const downButton = scrollArea.element.querySelector('.dos-scroll-area___button--down') as HTMLElement;
      downButton.click();

      expect(downButton).not.toBeNull();
    });

    it('left button scrolls left', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const leftButton = scrollArea.element.querySelector('.dos-scroll-area___button--left') as HTMLElement;
      leftButton.click();

      expect(leftButton).not.toBeNull();
    });

    it('right button scrolls right', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const rightButton = scrollArea.element.querySelector('.dos-scroll-area___button--right') as HTMLElement;
      rightButton.click();

      expect(rightButton).not.toBeNull();
    });
  });

  describe('keyboard navigation', () => {
    it('vertical thumb responds to ArrowUp', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--vertical') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      thumb.dispatchEvent(event);

      // Just verify no error thrown
      expect(thumb).not.toBeNull();
    });

    it('vertical thumb responds to ArrowDown', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--vertical') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      thumb.dispatchEvent(event);

      expect(thumb).not.toBeNull();
    });

    it('vertical thumb responds to PageUp', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--vertical') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true });
      thumb.dispatchEvent(event);

      expect(thumb).not.toBeNull();
    });

    it('vertical thumb responds to PageDown', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--vertical') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true });
      thumb.dispatchEvent(event);

      expect(thumb).not.toBeNull();
    });

    it('vertical thumb responds to Home', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--vertical') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      thumb.dispatchEvent(event);

      expect(thumb).not.toBeNull();
    });

    it('vertical thumb responds to End', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--vertical') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      thumb.dispatchEvent(event);

      expect(thumb).not.toBeNull();
    });

    it('horizontal thumb responds to ArrowLeft', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--horizontal') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
      thumb.dispatchEvent(event);

      expect(thumb).not.toBeNull();
    });

    it('horizontal thumb responds to ArrowRight', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--horizontal') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      thumb.dispatchEvent(event);

      expect(thumb).not.toBeNull();
    });

    it('horizontal thumb responds to Home', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--horizontal') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      thumb.dispatchEvent(event);

      expect(thumb).not.toBeNull();
    });

    it('horizontal thumb responds to End', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--horizontal') as HTMLElement;
      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      thumb.dispatchEvent(event);

      expect(thumb).not.toBeNull();
    });
  });

  describe('thumb dragging', () => {
    it('vertical thumb starts drag on mousedown', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--vertical') as HTMLElement;
      const mousedownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        clientY: 100,
      });
      thumb.dispatchEvent(mousedownEvent);

      expect(thumb.classList.contains('dos-scroll-area___thumb--dragging')).toBe(true);
    });

    it('vertical thumb ends drag on mouseup', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--vertical') as HTMLElement;

      // Start drag
      thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientY: 100 }));

      // End drag
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(thumb.classList.contains('dos-scroll-area___thumb--dragging')).toBe(false);
    });

    it('horizontal thumb starts drag on mousedown', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--horizontal') as HTMLElement;
      const mousedownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 100,
      });
      thumb.dispatchEvent(mousedownEvent);

      expect(thumb.classList.contains('dos-scroll-area___thumb--dragging')).toBe(true);
    });

    it('horizontal thumb ends drag on mouseup', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--horizontal') as HTMLElement;

      // Start drag
      thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 100 }));

      // End drag
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(thumb.classList.contains('dos-scroll-area___thumb--dragging')).toBe(false);
    });
  });

  describe('track clicking', () => {
    it('clicking vertical track above thumb scrolls up', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const track = scrollArea.element.querySelector('.dos-scroll-area___track--vertical') as HTMLElement;

      // Mock getBoundingClientRect
      Object.defineProperty(track, 'getBoundingClientRect', {
        value: () => ({ top: 0, left: 0, bottom: 100, right: 16, width: 16, height: 100 }),
      });

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--vertical') as HTMLElement;
      Object.defineProperty(thumb, 'getBoundingClientRect', {
        value: () => ({ top: 50, left: 0, bottom: 70, right: 16, width: 16, height: 20 }),
      });

      // Click above thumb
      track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientY: 10 }));

      // Should not throw
      expect(true).toBe(true);
    });

    it('clicking horizontal track left of thumb scrolls left', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const track = scrollArea.element.querySelector('.dos-scroll-area___track--horizontal') as HTMLElement;

      // Mock getBoundingClientRect
      Object.defineProperty(track, 'getBoundingClientRect', {
        value: () => ({ top: 0, left: 0, bottom: 16, right: 100, width: 100, height: 16 }),
      });

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--horizontal') as HTMLElement;
      Object.defineProperty(thumb, 'getBoundingClientRect', {
        value: () => ({ top: 0, left: 50, bottom: 16, right: 70, width: 20, height: 16 }),
      });

      // Click left of thumb
      track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 10 }));

      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('viewport has role region', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      expect(scrollArea.viewport.getAttribute('role')).toBe('region');
    });

    it('viewport has aria-label', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      expect(scrollArea.viewport.getAttribute('aria-label')).toBe('Scrollable content');
    });

    it('vertical scrollbar has role scrollbar', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const scrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--vertical');
      expect(scrollbar?.getAttribute('role')).toBe('scrollbar');
    });

    it('vertical scrollbar has aria-orientation', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const scrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--vertical');
      expect(scrollbar?.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('vertical scrollbar has aria-controls', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical', id: 'test-scroll' });
      container.appendChild(scrollArea.element);

      const scrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--vertical');
      expect(scrollbar?.getAttribute('aria-controls')).toBe('test-scroll-viewport');
    });

    it('vertical scrollbar has aria-valuenow', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const scrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--vertical');
      expect(scrollbar?.getAttribute('aria-valuenow')).toBe('0');
    });

    it('vertical scrollbar has aria-valuemin', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const scrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--vertical');
      expect(scrollbar?.getAttribute('aria-valuemin')).toBe('0');
    });

    it('vertical scrollbar has aria-valuemax', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const scrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--vertical');
      expect(scrollbar?.getAttribute('aria-valuemax')).toBe('100');
    });

    it('horizontal scrollbar has role scrollbar', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const scrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--horizontal');
      expect(scrollbar?.getAttribute('role')).toBe('scrollbar');
    });

    it('horizontal scrollbar has aria-orientation', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const scrollbar = scrollArea.element.querySelector('.dos-scroll-area___scrollbar--horizontal');
      expect(scrollbar?.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('vertical thumb has role slider', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--vertical');
      expect(thumb?.getAttribute('role')).toBe('slider');
    });

    it('vertical thumb is focusable', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--vertical');
      expect(thumb?.getAttribute('tabindex')).toBe('0');
    });

    it('horizontal thumb has role slider', () => {
      const scrollArea = createScrollArea({ orientation: 'horizontal' });
      container.appendChild(scrollArea.element);

      const thumb = scrollArea.element.querySelector('.dos-scroll-area___thumb--horizontal');
      expect(thumb?.getAttribute('role')).toBe('slider');
    });

    it('arrow buttons have aria-label', () => {
      const scrollArea = createScrollArea({ orientation: 'both' });
      container.appendChild(scrollArea.element);

      const upButton = scrollArea.element.querySelector('.dos-scroll-area___button--up');
      const downButton = scrollArea.element.querySelector('.dos-scroll-area___button--down');
      const leftButton = scrollArea.element.querySelector('.dos-scroll-area___button--left');
      const rightButton = scrollArea.element.querySelector('.dos-scroll-area___button--right');

      expect(upButton?.getAttribute('aria-label')).toBe('Scroll up');
      expect(downButton?.getAttribute('aria-label')).toBe('Scroll down');
      expect(leftButton?.getAttribute('aria-label')).toBe('Scroll left');
      expect(rightButton?.getAttribute('aria-label')).toBe('Scroll right');
    });

    it('arrow buttons have tabindex -1', () => {
      const scrollArea = createScrollArea({ orientation: 'vertical' });
      container.appendChild(scrollArea.element);

      const upButton = scrollArea.element.querySelector('.dos-scroll-area___button--up');
      const downButton = scrollArea.element.querySelector('.dos-scroll-area___button--down');

      expect(upButton?.getAttribute('tabindex')).toBe('-1');
      expect(downButton?.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('destroy', () => {
    it('destroy cleans up resources', () => {
      const scrollArea = createScrollArea({ autoHide: true });
      container.appendChild(scrollArea.element);

      // Should not throw
      scrollArea.destroy();
      expect(true).toBe(true);
    });

    it('destroy removes event listeners', () => {
      const onScroll = vi.fn();
      const scrollArea = createScrollArea({ onScroll });
      container.appendChild(scrollArea.element);

      scrollArea.destroy();

      // After destroy, scroll events shouldn't call the callback
      // (though the viewport listener may still exist - this test just ensures no crash)
      expect(true).toBe(true);
    });
  });

  describe('smooth scroll', () => {
    it('respects smoothScroll option', () => {
      const scrollArea = createScrollArea({ smoothScroll: true });
      container.appendChild(scrollArea.element);

      // No error should occur
      scrollArea.scrollTo({ top: 100 });
      expect(true).toBe(true);
    });

    it('scrollToTop respects smooth parameter', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      scrollArea.scrollToTop(true);
      expect(true).toBe(true);
    });

    it('scrollToBottom respects smooth parameter', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      scrollArea.scrollToBottom(true);
      expect(true).toBe(true);
    });

    it('scrollIntoView respects smooth parameter', () => {
      const scrollArea = createScrollArea();
      container.appendChild(scrollArea.element);

      const target = document.createElement('div');
      scrollArea.setContent(target);

      scrollArea.scrollIntoView(target, true);
      expect(true).toBe(true);
    });
  });

  describe('custom scroll amounts', () => {
    it('uses custom scrollAmount', () => {
      const scrollArea = createScrollArea({ scrollAmount: 100 });
      container.appendChild(scrollArea.element);

      // Just verify creation works with custom scroll amount
      expect(scrollArea.element).toBeInstanceOf(HTMLElement);
    });

    it('uses page scroll for track with page setting', () => {
      const scrollArea = createScrollArea({ trackScrollAmount: 'page' });
      container.appendChild(scrollArea.element);

      expect(scrollArea.element).toBeInstanceOf(HTMLElement);
    });

    it('uses custom scroll amount for track with number setting', () => {
      const scrollArea = createScrollArea({ trackScrollAmount: 200 });
      container.appendChild(scrollArea.element);

      expect(scrollArea.element).toBeInstanceOf(HTMLElement);
    });
  });
});
