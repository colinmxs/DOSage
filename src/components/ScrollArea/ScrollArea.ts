/**
 * ScrollArea Component
 *
 * A DOS-style scrollable container with custom ASCII scrollbars.
 * Features arrow buttons (▲▼◄►), track, and draggable thumb.
 */

import type {
  ScrollAreaProps,
  ScrollAreaInstance,
  ScrollPosition,
} from './ScrollArea.types';
import './ScrollArea.css';

/** Counter for unique IDs */
let scrollAreaIdCounter = 0;

/**
 * Creates a DOS-style scroll area with custom scrollbars.
 *
 * @example
 * ```typescript
 * const scrollArea = createScrollArea({
 *   orientation: 'vertical',
 *   content: longContentElement,
 *   onScroll: (top, left) => console.log('Scrolled:', top, left),
 * });
 *
 * document.body.appendChild(scrollArea.element);
 * ```
 */
export function createScrollArea(props: ScrollAreaProps = {}): ScrollAreaInstance {
  const {
    orientation = 'vertical',
    autoHide = false,
    autoHideDelay = 1000,
    scrollAmount = 40,
    trackScrollAmount = 'page',
    smoothScroll = false,
    // alwaysShowScrollbars is reserved for future use
    // alwaysShowScrollbars = false,
    scrollbarSize = 16,
    minThumbSize = 20,
    content,
    onScroll,
    id,
    className,
  } = props;

  const scrollAreaId = id || `dos-scroll-area-${++scrollAreaIdCounter}`;

  // State
  let isDraggingVertical = false;
  let isDraggingHorizontal = false;
  let dragStartY = 0;
  let dragStartX = 0;
  let dragStartScrollTop = 0;
  let dragStartScrollLeft = 0;
  let hideTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let resizeObserver: ResizeObserver | null = null;

  // Create root container
  const root = document.createElement('div');
  root.id = scrollAreaId;
  root.className = `dos-scroll-area dos-scroll-area--${orientation}`;
  if (autoHide) root.classList.add('dos-scroll-area--auto-hide');
  if (className) root.classList.add(className);

  // Set CSS custom properties
  root.style.setProperty('--dos-scrollbar-size', `${scrollbarSize}px`);
  root.style.setProperty('--dos-scrollbar-min-thumb', `${minThumbSize}px`);

  // Create viewport (the scrollable container)
  const viewport = document.createElement('div');
  viewport.className = 'dos-scroll-area___viewport';
  viewport.setAttribute('tabindex', '0');
  viewport.setAttribute('role', 'region');
  viewport.setAttribute('aria-label', 'Scrollable content');

  // Create content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'dos-scroll-area___content';
  viewport.appendChild(contentWrapper);

  root.appendChild(viewport);

  // Variables to hold scrollbar elements
  let verticalScrollbar: HTMLElement | null = null;
  let verticalTrack: HTMLElement | null = null;
  let verticalThumb: HTMLElement | null = null;
  let horizontalScrollbar: HTMLElement | null = null;
  let horizontalTrack: HTMLElement | null = null;
  let horizontalThumb: HTMLElement | null = null;
  let corner: HTMLElement | null = null;

  /**
   * Creates the vertical scrollbar.
   */
  function createVerticalScrollbar(): void {
    verticalScrollbar = document.createElement('div');
    verticalScrollbar.className = 'dos-scroll-area___scrollbar--vertical';
    verticalScrollbar.setAttribute('role', 'scrollbar');
    verticalScrollbar.setAttribute('aria-orientation', 'vertical');
    verticalScrollbar.setAttribute('aria-controls', `${scrollAreaId}-viewport`);
    verticalScrollbar.setAttribute('aria-valuenow', '0');
    verticalScrollbar.setAttribute('aria-valuemin', '0');
    verticalScrollbar.setAttribute('aria-valuemax', '100');

    // Up button
    const upButton = document.createElement('button');
    upButton.className = 'dos-scroll-area___button--up';
    upButton.innerHTML = '▲';
    upButton.setAttribute('aria-label', 'Scroll up');
    upButton.setAttribute('tabindex', '-1');
    upButton.addEventListener('click', () => scrollByAmount(-scrollAmount, 0));
    upButton.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startContinuousScroll(-scrollAmount, 0);
    });
    upButton.addEventListener('mouseup', stopContinuousScroll);
    upButton.addEventListener('mouseleave', stopContinuousScroll);

    // Track
    verticalTrack = document.createElement('div');
    verticalTrack.className = 'dos-scroll-area___track--vertical';
    verticalTrack.addEventListener('click', handleVerticalTrackClick);

    // Thumb
    verticalThumb = document.createElement('div');
    verticalThumb.className = 'dos-scroll-area___thumb--vertical';
    verticalThumb.innerHTML = '║';
    verticalThumb.setAttribute('tabindex', '0');
    verticalThumb.setAttribute('role', 'slider');
    verticalThumb.setAttribute('aria-label', 'Vertical scroll');
    verticalThumb.addEventListener('mousedown', startVerticalDrag);
    verticalThumb.addEventListener('keydown', handleVerticalThumbKeydown);

    verticalTrack.appendChild(verticalThumb);

    // Down button
    const downButton = document.createElement('button');
    downButton.className = 'dos-scroll-area___button--down';
    downButton.innerHTML = '▼';
    downButton.setAttribute('aria-label', 'Scroll down');
    downButton.setAttribute('tabindex', '-1');
    downButton.addEventListener('click', () => scrollByAmount(scrollAmount, 0));
    downButton.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startContinuousScroll(scrollAmount, 0);
    });
    downButton.addEventListener('mouseup', stopContinuousScroll);
    downButton.addEventListener('mouseleave', stopContinuousScroll);

    verticalScrollbar.appendChild(upButton);
    verticalScrollbar.appendChild(verticalTrack);
    verticalScrollbar.appendChild(downButton);

    root.appendChild(verticalScrollbar);
  }

  /**
   * Creates the horizontal scrollbar.
   */
  function createHorizontalScrollbar(): void {
    horizontalScrollbar = document.createElement('div');
    horizontalScrollbar.className = 'dos-scroll-area___scrollbar--horizontal';
    horizontalScrollbar.setAttribute('role', 'scrollbar');
    horizontalScrollbar.setAttribute('aria-orientation', 'horizontal');
    horizontalScrollbar.setAttribute('aria-controls', `${scrollAreaId}-viewport`);

    // Left button
    const leftButton = document.createElement('button');
    leftButton.className = 'dos-scroll-area___button--left';
    leftButton.innerHTML = '◄';
    leftButton.setAttribute('aria-label', 'Scroll left');
    leftButton.setAttribute('tabindex', '-1');
    leftButton.addEventListener('click', () => scrollByAmount(0, -scrollAmount));
    leftButton.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startContinuousScroll(0, -scrollAmount);
    });
    leftButton.addEventListener('mouseup', stopContinuousScroll);
    leftButton.addEventListener('mouseleave', stopContinuousScroll);

    // Track
    horizontalTrack = document.createElement('div');
    horizontalTrack.className = 'dos-scroll-area___track--horizontal';
    horizontalTrack.addEventListener('click', handleHorizontalTrackClick);

    // Thumb
    horizontalThumb = document.createElement('div');
    horizontalThumb.className = 'dos-scroll-area___thumb--horizontal';
    horizontalThumb.innerHTML = '═';
    horizontalThumb.setAttribute('tabindex', '0');
    horizontalThumb.setAttribute('role', 'slider');
    horizontalThumb.setAttribute('aria-label', 'Horizontal scroll');
    horizontalThumb.addEventListener('mousedown', startHorizontalDrag);
    horizontalThumb.addEventListener('keydown', handleHorizontalThumbKeydown);

    horizontalTrack.appendChild(horizontalThumb);

    // Right button
    const rightButton = document.createElement('button');
    rightButton.className = 'dos-scroll-area___button--right';
    rightButton.innerHTML = '►';
    rightButton.setAttribute('aria-label', 'Scroll right');
    rightButton.setAttribute('tabindex', '-1');
    rightButton.addEventListener('click', () => scrollByAmount(0, scrollAmount));
    rightButton.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startContinuousScroll(0, scrollAmount);
    });
    rightButton.addEventListener('mouseup', stopContinuousScroll);
    rightButton.addEventListener('mouseleave', stopContinuousScroll);

    horizontalScrollbar.appendChild(leftButton);
    horizontalScrollbar.appendChild(horizontalTrack);
    horizontalScrollbar.appendChild(rightButton);

    root.appendChild(horizontalScrollbar);
  }

  /**
   * Creates the corner element (when both scrollbars are visible).
   */
  function createCorner(): void {
    corner = document.createElement('div');
    corner.className = 'dos-scroll-area___corner';
    root.appendChild(corner);
  }

  // Continuous scroll handling
  let continuousScrollInterval: ReturnType<typeof setInterval> | null = null;

  function startContinuousScroll(deltaY: number, deltaX: number): void {
    scrollByAmount(deltaY, deltaX);
    continuousScrollInterval = setInterval(() => {
      scrollByAmount(deltaY, deltaX);
    }, 50);
  }

  function stopContinuousScroll(): void {
    if (continuousScrollInterval) {
      clearInterval(continuousScrollInterval);
      continuousScrollInterval = null;
    }
  }

  /**
   * Scrolls by a relative amount.
   * Uses fallback for environments that don't support scrollBy (like JSDOM).
   */
  function scrollByAmount(deltaY: number, deltaX: number): void {
    if (typeof viewport.scrollBy === 'function') {
      const behavior = smoothScroll ? 'smooth' : 'instant';
      viewport.scrollBy({ top: deltaY, left: deltaX, behavior: behavior as ScrollBehavior });
    } else {
      // Fallback for JSDOM and other environments
      viewport.scrollTop += deltaY;
      viewport.scrollLeft += deltaX;
    }
    updateScrollbars();
  }

  /**
   * Handles clicks on the vertical track.
   */
  function handleVerticalTrackClick(e: MouseEvent): void {
    if (e.target === verticalThumb) return;

    const trackRect = verticalTrack!.getBoundingClientRect();
    const thumbRect = verticalThumb!.getBoundingClientRect();
    const clickY = e.clientY - trackRect.top;
    const thumbCenter = thumbRect.top - trackRect.top + thumbRect.height / 2;

    let delta: number;
    if (trackScrollAmount === 'page') {
      delta = clickY < thumbCenter ? -viewport.clientHeight : viewport.clientHeight;
    } else {
      delta = clickY < thumbCenter ? -trackScrollAmount : trackScrollAmount;
    }

    scrollByAmount(delta, 0);
  }

  /**
   * Handles clicks on the horizontal track.
   */
  function handleHorizontalTrackClick(e: MouseEvent): void {
    if (e.target === horizontalThumb) return;

    const trackRect = horizontalTrack!.getBoundingClientRect();
    const thumbRect = horizontalThumb!.getBoundingClientRect();
    const clickX = e.clientX - trackRect.left;
    const thumbCenter = thumbRect.left - trackRect.left + thumbRect.width / 2;

    let delta: number;
    if (trackScrollAmount === 'page') {
      delta = clickX < thumbCenter ? -viewport.clientWidth : viewport.clientWidth;
    } else {
      delta = clickX < thumbCenter ? -trackScrollAmount : trackScrollAmount;
    }

    scrollByAmount(0, delta);
  }

  /**
   * Starts vertical thumb dragging.
   */
  function startVerticalDrag(e: MouseEvent): void {
    e.preventDefault();
    isDraggingVertical = true;
    dragStartY = e.clientY;
    dragStartScrollTop = viewport.scrollTop;
    verticalThumb!.classList.add('dos-scroll-area___thumb--dragging');

    document.addEventListener('mousemove', handleVerticalDrag);
    document.addEventListener('mouseup', stopVerticalDrag);
  }

  function handleVerticalDrag(e: MouseEvent): void {
    if (!isDraggingVertical) return;

    const trackHeight = verticalTrack!.clientHeight - verticalThumb!.offsetHeight;
    const deltaY = e.clientY - dragStartY;
    const scrollRatio = deltaY / trackHeight;
    const maxScroll = viewport.scrollHeight - viewport.clientHeight;

    viewport.scrollTop = dragStartScrollTop + scrollRatio * maxScroll;
  }

  function stopVerticalDrag(): void {
    isDraggingVertical = false;
    verticalThumb!.classList.remove('dos-scroll-area___thumb--dragging');
    document.removeEventListener('mousemove', handleVerticalDrag);
    document.removeEventListener('mouseup', stopVerticalDrag);
  }

  /**
   * Starts horizontal thumb dragging.
   */
  function startHorizontalDrag(e: MouseEvent): void {
    e.preventDefault();
    isDraggingHorizontal = true;
    dragStartX = e.clientX;
    dragStartScrollLeft = viewport.scrollLeft;
    horizontalThumb!.classList.add('dos-scroll-area___thumb--dragging');

    document.addEventListener('mousemove', handleHorizontalDrag);
    document.addEventListener('mouseup', stopHorizontalDrag);
  }

  function handleHorizontalDrag(e: MouseEvent): void {
    if (!isDraggingHorizontal) return;

    const trackWidth = horizontalTrack!.clientWidth - horizontalThumb!.offsetWidth;
    const deltaX = e.clientX - dragStartX;
    const scrollRatio = deltaX / trackWidth;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;

    viewport.scrollLeft = dragStartScrollLeft + scrollRatio * maxScroll;
  }

  function stopHorizontalDrag(): void {
    isDraggingHorizontal = false;
    horizontalThumb!.classList.remove('dos-scroll-area___thumb--dragging');
    document.removeEventListener('mousemove', handleHorizontalDrag);
    document.removeEventListener('mouseup', stopHorizontalDrag);
  }

  /**
   * Handles keyboard navigation on vertical thumb.
   */
  function handleVerticalThumbKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        scrollByAmount(-scrollAmount, 0);
        break;
      case 'ArrowDown':
        e.preventDefault();
        scrollByAmount(scrollAmount, 0);
        break;
      case 'PageUp':
        e.preventDefault();
        scrollByAmount(-viewport.clientHeight, 0);
        break;
      case 'PageDown':
        e.preventDefault();
        scrollByAmount(viewport.clientHeight, 0);
        break;
      case 'Home':
        e.preventDefault();
        scrollToTop();
        break;
      case 'End':
        e.preventDefault();
        scrollToBottom();
        break;
    }
  }

  /**
   * Handles keyboard navigation on horizontal thumb.
   */
  function handleHorizontalThumbKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        scrollByAmount(0, -scrollAmount);
        break;
      case 'ArrowRight':
        e.preventDefault();
        scrollByAmount(0, scrollAmount);
        break;
      case 'Home':
        e.preventDefault();
        scrollTo({ left: 0 });
        break;
      case 'End':
        e.preventDefault();
        scrollTo({ left: viewport.scrollWidth - viewport.clientWidth });
        break;
    }
  }

  /**
   * Updates scrollbar thumb positions and sizes.
   */
  function updateScrollbars(): void {
    // Vertical
    if (verticalThumb && verticalTrack) {
      const viewportHeight = viewport.clientHeight;
      const contentHeight = viewport.scrollHeight;
      const trackHeight = verticalTrack.clientHeight;

      if (contentHeight <= viewportHeight) {
        // Content fits, hide thumb
        verticalThumb.style.display = 'none';
      } else {
        verticalThumb.style.display = '';
        const thumbHeight = Math.max(
          minThumbSize,
          (viewportHeight / contentHeight) * trackHeight
        );
        const maxThumbTop = trackHeight - thumbHeight;
        const scrollRatio = viewport.scrollTop / (contentHeight - viewportHeight);
        const thumbTop = scrollRatio * maxThumbTop;

        verticalThumb.style.height = `${thumbHeight}px`;
        verticalThumb.style.top = `${thumbTop}px`;

        // Update ARIA
        const percent = Math.round(scrollRatio * 100);
        verticalScrollbar!.setAttribute('aria-valuenow', String(percent));
      }
    }

    // Horizontal
    if (horizontalThumb && horizontalTrack) {
      const viewportWidth = viewport.clientWidth;
      const contentWidth = viewport.scrollWidth;
      const trackWidth = horizontalTrack.clientWidth;

      if (contentWidth <= viewportWidth) {
        horizontalThumb.style.display = 'none';
      } else {
        horizontalThumb.style.display = '';
        const thumbWidth = Math.max(
          minThumbSize,
          (viewportWidth / contentWidth) * trackWidth
        );
        const maxThumbLeft = trackWidth - thumbWidth;
        const scrollRatio = viewport.scrollLeft / (contentWidth - viewportWidth);
        const thumbLeft = scrollRatio * maxThumbLeft;

        horizontalThumb.style.width = `${thumbWidth}px`;
        horizontalThumb.style.left = `${thumbLeft}px`;

        // Update ARIA
        const percent = Math.round(scrollRatio * 100);
        horizontalScrollbar!.setAttribute('aria-valuenow', String(percent));
      }
    }

    // Fire callback
    onScroll?.(viewport.scrollTop, viewport.scrollLeft);

    // Dispatch custom event
    root.dispatchEvent(new CustomEvent('dos:scrollarea:scroll', {
      bubbles: true,
      detail: {
        top: viewport.scrollTop,
        left: viewport.scrollLeft,
      },
    }));
  }

  /**
   * Shows scrollbars (for auto-hide mode).
   */
  function showScrollbars(): void {
    root.classList.add('dos-scroll-area--scrollbars-visible');
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
    }
    if (autoHide) {
      hideTimeoutId = setTimeout(hideScrollbars, autoHideDelay);
    }
  }

  /**
   * Hides scrollbars (for auto-hide mode).
   */
  function hideScrollbars(): void {
    root.classList.remove('dos-scroll-area--scrollbars-visible');
  }

  /**
   * Gets current scroll position.
   */
  function getScrollPosition(): ScrollPosition {
    return {
      top: viewport.scrollTop,
      left: viewport.scrollLeft,
      maxTop: viewport.scrollHeight - viewport.clientHeight,
      maxLeft: viewport.scrollWidth - viewport.clientWidth,
    };
  }

  /**
   * Internal helper to scroll to a position with fallback for JSDOM.
   */
  function scrollToPosition(top?: number, left?: number, _smooth?: boolean): void {
    if (typeof viewport.scrollTo === 'function') {
      const options: ScrollToOptions = {
        behavior: _smooth ? 'smooth' : 'instant',
      };
      if (top !== undefined) options.top = top;
      if (left !== undefined) options.left = left;
      viewport.scrollTo(options);
    } else {
      // Fallback for JSDOM and other environments
      if (top !== undefined) viewport.scrollTop = top;
      if (left !== undefined) viewport.scrollLeft = left;
    }
    updateScrollbars();
  }

  /**
   * Scrolls to a specific position.
   */
  function scrollTo(options: { top?: number; left?: number; behavior?: 'smooth' | 'instant' }): void {
    const useSmooth = options.behavior === 'smooth' || (options.behavior === undefined && smoothScroll);
    scrollToPosition(options.top, options.left, useSmooth);
  }

  /**
   * Scrolls to top.
   */
  function scrollToTop(smooth = smoothScroll): void {
    scrollToPosition(0, undefined, smooth);
  }

  /**
   * Scrolls to bottom.
   */
  function scrollToBottom(smooth = smoothScroll): void {
    scrollToPosition(viewport.scrollHeight - viewport.clientHeight, undefined, smooth);
  }

  /**
   * Scrolls element into view.
   * Uses fallback for environments that don't support scrollIntoView options (like JSDOM).
   */
  function scrollIntoView(element: HTMLElement, _smooth = smoothScroll): void {
    // Check if scrollIntoView exists and supports options
    if (typeof element.scrollIntoView === 'function') {
      try {
        element.scrollIntoView({
          behavior: _smooth ? 'smooth' : 'instant',
          block: 'nearest',
          inline: 'nearest',
        });
      } catch {
        // Fallback for browsers that don't support options
        element.scrollIntoView(false);
      }
    } else {
      // Fallback: Calculate position and scroll manually
      const elementRect = element.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      const offsetTop = elementRect.top - viewportRect.top + viewport.scrollTop;
      const offsetLeft = elementRect.left - viewportRect.left + viewport.scrollLeft;
      scrollToPosition(offsetTop, offsetLeft, _smooth);
    }
  }

  /**
   * Refreshes scrollbar dimensions.
   */
  function refresh(): void {
    updateScrollbars();
  }

  /**
   * Sets new content.
   */
  function setContent(newContent: HTMLElement | string): void {
    contentWrapper.innerHTML = '';
    if (typeof newContent === 'string') {
      contentWrapper.innerHTML = newContent;
    } else {
      contentWrapper.appendChild(newContent);
    }
    refresh();
  }

  /**
   * Destroys the component.
   */
  function destroy(): void {
    stopContinuousScroll();
    if (hideTimeoutId) clearTimeout(hideTimeoutId);
    if (resizeObserver) resizeObserver.disconnect();
    viewport.removeEventListener('scroll', handleScroll);
    document.removeEventListener('mousemove', handleVerticalDrag);
    document.removeEventListener('mouseup', stopVerticalDrag);
    document.removeEventListener('mousemove', handleHorizontalDrag);
    document.removeEventListener('mouseup', stopHorizontalDrag);
  }

  /**
   * Handles scroll events.
   */
  function handleScroll(): void {
    updateScrollbars();
    if (autoHide) {
      showScrollbars();
    }
  }

  // Create scrollbars based on orientation
  if (orientation === 'vertical' || orientation === 'both') {
    createVerticalScrollbar();
  }
  if (orientation === 'horizontal' || orientation === 'both') {
    createHorizontalScrollbar();
  }
  if (orientation === 'both') {
    createCorner();
  }

  // Set up viewport ID for ARIA
  viewport.id = `${scrollAreaId}-viewport`;

  // Set initial content
  if (content) {
    setContent(content);
  }

  // Listen for scroll events
  viewport.addEventListener('scroll', handleScroll);

  // Listen for resize
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      refresh();
    });
    resizeObserver.observe(viewport);
    resizeObserver.observe(contentWrapper);
  }

  // Initial update
  requestAnimationFrame(updateScrollbars);

  return {
    element: root,
    viewport,
    getScrollPosition,
    scrollTo,
    scrollBy: (opts: { top?: number; left?: number; behavior?: 'smooth' | 'instant' }) => {
      const deltaY = opts.top ?? 0;
      const deltaX = opts.left ?? 0;
      if (typeof viewport.scrollBy === 'function') {
        viewport.scrollBy({
          ...opts,
          behavior: (opts.behavior || (smoothScroll ? 'smooth' : 'instant')) as ScrollBehavior,
        });
      } else {
        // Fallback for JSDOM
        viewport.scrollTop += deltaY;
        viewport.scrollLeft += deltaX;
      }
      updateScrollbars();
    },
    scrollToTop,
    scrollToBottom,
    scrollIntoView,
    refresh,
    setContent,
    showScrollbars,
    hideScrollbars,
    destroy,
  };
}
