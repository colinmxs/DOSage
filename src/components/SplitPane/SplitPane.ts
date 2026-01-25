/**
 * SplitPane Component
 *
 * A DOS-style resizable split pane with drag-to-resize and keyboard navigation.
 * Supports horizontal and vertical orientations with min/max constraints.
 */

import type {
  SplitPaneProps,
  SplitPanePaneProps,
  SplitPaneState,
  SplitPaneElement,
  SplitPaneSize,
  SplitPaneResizeEventDetail,
  SplitPaneCollapseEventDetail,
} from './SplitPane.types';
import './SplitPane.css';

/**
 * Creates a DOS-style split pane component with resizable divider.
 *
 * @param props - SplitPane configuration options
 * @returns The split pane container element with attached methods
 *
 * @example
 * ```typescript
 * import { createSplitPane } from 'dosage';
 *
 * const splitPane = createSplitPane({
 *   orientation: 'horizontal',
 *   firstPane: {
 *     initialSize: '30%',
 *     minSize: 100,
 *     content: 'Left pane content'
 *   },
 *   secondPane: {
 *     content: 'Right pane content'
 *   },
 *   onResize: (first, second) => console.log(`Sizes: ${first}px | ${second}px`)
 * });
 *
 * document.body.appendChild(splitPane);
 * ```
 */
export function createSplitPane(props: SplitPaneProps): SplitPaneElement {
  const {
    firstPane,
    secondPane,
    orientation = 'horizontal',
    variant = 'default',
    dividerSize = 8,
    resetOnDoubleClick = true,
    keyboardStep = 10,
    className,
    id,
    onResize,
    onResizeEnd,
    onCollapse,
    onExpand,
  } = props;

  // State
  const state: SplitPaneState = {
    firstPaneSize: 0,
    secondPaneSize: 0,
    isDragging: false,
    firstPaneCollapsed: firstPane.collapsed ?? false,
    secondPaneCollapsed: secondPane.collapsed ?? false,
    sizeBeforeCollapse: null,
  };

  // Store initial sizes for reset
  const initialFirstSize: SplitPaneSize = firstPane.initialSize ?? '50%';
  const initialSecondSize: SplitPaneSize = secondPane.initialSize ?? 'auto';

  // Create main container
  const container = document.createElement('div') as SplitPaneElement;
  container.className = buildContainerClasses();

  if (id) {
    container.id = id;
  }

  // Create pane elements
  const firstPaneEl = document.createElement('div');
  firstPaneEl.className = 'dos-splitpane__pane dos-splitpane__pane--first';
  if (firstPane.id) {
    firstPaneEl.id = firstPane.id;
  }

  const secondPaneEl = document.createElement('div');
  secondPaneEl.className = 'dos-splitpane__pane dos-splitpane__pane--second';
  if (secondPane.id) {
    secondPaneEl.id = secondPane.id;
  }

  // Create divider
  const divider = document.createElement('div');
  divider.className = 'dos-splitpane__divider';
  divider.setAttribute('role', 'separator');
  divider.setAttribute('tabindex', '0');
  divider.setAttribute('aria-orientation', orientation);
  divider.setAttribute('aria-valuenow', '50');
  divider.setAttribute('aria-valuemin', '0');
  divider.setAttribute('aria-valuemax', '100');
  divider.setAttribute('aria-label', `Resize ${orientation === 'horizontal' ? 'left and right' : 'top and bottom'} panes`);

  // Create divider grip
  const grip = document.createElement('span');
  grip.className = 'dos-splitpane__grip';
  grip.setAttribute('aria-hidden', 'true');
  grip.textContent = orientation === 'horizontal' ? '┃' : '━';
  divider.appendChild(grip);

  // Assemble container
  container.appendChild(firstPaneEl);
  container.appendChild(divider);
  container.appendChild(secondPaneEl);

  /**
   * Build container class string
   */
  function buildContainerClasses(): string {
    const classes = [
      'dos-splitpane',
      `dos-splitpane--${orientation}`,
      `dos-splitpane--${variant}`,
    ];
    if (className) {
      classes.push(className);
    }
    return classes.join(' ');
  }

  /**
   * Render pane content
   */
  function renderPaneContent(paneEl: HTMLElement, paneProps: SplitPanePaneProps): void {
    paneEl.innerHTML = '';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'dos-splitpane__content';

    if (typeof paneProps.content === 'string') {
      contentWrapper.textContent = paneProps.content;
    } else if (typeof paneProps.content === 'function') {
      contentWrapper.appendChild(paneProps.content());
    } else {
      contentWrapper.appendChild(paneProps.content);
    }

    paneEl.appendChild(contentWrapper);
  }

  /**
   * Parse a size value to pixels
   */
  function parseSizeToPixels(size: SplitPaneSize, totalSize: number): number {
    if (typeof size === 'number') {
      return size;
    }

    if (size === 'auto') {
      return -1; // Signal to calculate automatically
    }

    if (size.endsWith('%')) {
      const percentage = parseFloat(size);
      return Math.round((percentage / 100) * totalSize);
    }

    if (size.endsWith('px')) {
      return parseInt(size, 10);
    }

    return parseInt(size, 10);
  }

  /**
   * Get the available space for panes (excluding divider)
   */
  function getAvailableSpace(): number {
    const containerRect = container.getBoundingClientRect();
    const total = orientation === 'horizontal' ? containerRect.width : containerRect.height;
    return Math.max(0, total - dividerSize);
  }

  /**
   * Calculate initial pane sizes
   */
  function calculateInitialSizes(): void {
    const available = getAvailableSpace();

    if (available <= 0) {
      // Container not yet sized, use defaults
      state.firstPaneSize = available / 2;
      state.secondPaneSize = available / 2;
      return;
    }

    const firstSize = parseSizeToPixels(initialFirstSize, available);
    const secondSize = parseSizeToPixels(initialSecondSize, available);

    if (firstSize >= 0 && secondSize >= 0) {
      // Both specified - normalize to fit
      const total = firstSize + secondSize;
      state.firstPaneSize = Math.round((firstSize / total) * available);
      state.secondPaneSize = available - state.firstPaneSize;
    } else if (firstSize >= 0) {
      state.firstPaneSize = Math.min(firstSize, available);
      state.secondPaneSize = available - state.firstPaneSize;
    } else if (secondSize >= 0) {
      state.secondPaneSize = Math.min(secondSize, available);
      state.firstPaneSize = available - state.secondPaneSize;
    } else {
      // Both auto - split evenly
      state.firstPaneSize = Math.round(available / 2);
      state.secondPaneSize = available - state.firstPaneSize;
    }

    applySizeConstraints();
  }

  /**
   * Apply min/max constraints to pane sizes
   */
  function applySizeConstraints(): void {
    const available = getAvailableSpace();
    const minFirst = firstPane.minSize ?? 0;
    const maxFirst = firstPane.maxSize ?? available;
    const minSecond = secondPane.minSize ?? 0;
    const maxSecond = secondPane.maxSize ?? available;

    // Apply first pane constraints
    state.firstPaneSize = Math.max(minFirst, Math.min(maxFirst, state.firstPaneSize));

    // Apply second pane constraints
    state.secondPaneSize = Math.max(minSecond, Math.min(maxSecond, state.secondPaneSize));

    // Ensure total doesn't exceed available
    const total = state.firstPaneSize + state.secondPaneSize;
    if (total > available) {
      const ratio = available / total;
      state.firstPaneSize = Math.round(state.firstPaneSize * ratio);
      state.secondPaneSize = available - state.firstPaneSize;
    }
  }

  /**
   * Update DOM to reflect current sizes
   */
  function updatePaneSizes(): void {
    if (state.firstPaneCollapsed) {
      firstPaneEl.style.flexBasis = '0px';
      firstPaneEl.classList.add('dos-splitpane__pane--collapsed');
    } else {
      firstPaneEl.style.flexBasis = `${state.firstPaneSize}px`;
      firstPaneEl.classList.remove('dos-splitpane__pane--collapsed');
    }

    if (state.secondPaneCollapsed) {
      secondPaneEl.style.flexBasis = '0px';
      secondPaneEl.classList.add('dos-splitpane__pane--collapsed');
    } else {
      secondPaneEl.style.flexBasis = `${state.secondPaneSize}px`;
      secondPaneEl.classList.remove('dos-splitpane__pane--collapsed');
    }

    // Update ARIA value
    const ratio = getRatioInternal();
    divider.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
  }

  /**
   * Get the current ratio (internal)
   */
  function getRatioInternal(): number {
    const available = getAvailableSpace();
    if (available <= 0) return 0.5;
    return state.firstPaneSize / available;
  }

  /**
   * Handle mouse down on divider
   */
  function handleDividerMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return; // Only left click

    event.preventDefault();
    startDrag(event.clientX, event.clientY);
  }

  /**
   * Handle touch start on divider
   */
  function handleDividerTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) return;

    event.preventDefault();
    const touch = event.touches[0];
    if (!touch) return;
    startDrag(touch.clientX, touch.clientY);
  }

  /**
   * Start drag operation
   */
  function startDrag(startX: number, startY: number): void {
    state.isDragging = true;
    container.classList.add('dos-splitpane--dragging');
    divider.classList.add('dos-splitpane__divider--active');

    const startFirstSize = state.firstPaneSize;
    const startSecondSize = state.secondPaneSize;

    function handleMouseMove(e: MouseEvent): void {
      handleDrag(e.clientX, e.clientY, startX, startY, startFirstSize, startSecondSize);
    }

    function handleTouchMove(e: TouchEvent): void {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      if (!touch) return;
      handleDrag(touch.clientX, touch.clientY, startX, startY, startFirstSize, startSecondSize);
    }

    function handleEnd(): void {
      state.isDragging = false;
      container.classList.remove('dos-splitpane--dragging');
      divider.classList.remove('dos-splitpane__divider--active');

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);

      // Dispatch resize end event
      dispatchResizeEvent(true);

      if (onResizeEnd) {
        onResizeEnd(state.firstPaneSize, state.secondPaneSize);
      }
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  }

  /**
   * Handle drag movement
   */
  function handleDrag(
    currentX: number,
    currentY: number,
    startX: number,
    startY: number,
    startFirstSize: number,
    startSecondSize: number
  ): void {
    const delta = orientation === 'horizontal'
      ? currentX - startX
      : currentY - startY;

    const available = getAvailableSpace();

    // Calculate new sizes
    let newFirstSize = startFirstSize + delta;
    let newSecondSize = startSecondSize - delta;

    // Apply constraints
    const minFirst = firstPane.minSize ?? 0;
    const maxFirst = firstPane.maxSize ?? available;
    const minSecond = secondPane.minSize ?? 0;
    const maxSecond = secondPane.maxSize ?? available;

    // Clamp to constraints
    if (newFirstSize < minFirst) {
      newFirstSize = minFirst;
      newSecondSize = available - newFirstSize;
    } else if (newFirstSize > maxFirst) {
      newFirstSize = maxFirst;
      newSecondSize = available - newFirstSize;
    }

    if (newSecondSize < minSecond) {
      newSecondSize = minSecond;
      newFirstSize = available - newSecondSize;
    } else if (newSecondSize > maxSecond) {
      newSecondSize = maxSecond;
      newFirstSize = available - newSecondSize;
    }

    state.firstPaneSize = Math.max(0, newFirstSize);
    state.secondPaneSize = Math.max(0, newSecondSize);

    updatePaneSizes();

    // Dispatch resize event
    dispatchResizeEvent(false);

    if (onResize) {
      onResize(state.firstPaneSize, state.secondPaneSize);
    }
  }

  /**
   * Handle double click on divider
   */
  function handleDividerDoubleClick(): void {
    if (!resetOnDoubleClick) return;
    resetSizes();
  }

  /**
   * Reset to initial sizes
   */
  function resetSizes(): void {
    calculateInitialSizes();
    updatePaneSizes();
    dispatchResizeEvent(true);
  }

  /**
   * Handle keyboard navigation
   */
  function handleDividerKeyDown(event: KeyboardEvent): void {
    const available = getAvailableSpace();
    let delta = 0;

    switch (event.key) {
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          event.preventDefault();
          delta = -keyboardStep;
        }
        break;

      case 'ArrowRight':
        if (orientation === 'horizontal') {
          event.preventDefault();
          delta = keyboardStep;
        }
        break;

      case 'ArrowUp':
        if (orientation === 'vertical') {
          event.preventDefault();
          delta = -keyboardStep;
        }
        break;

      case 'ArrowDown':
        if (orientation === 'vertical') {
          event.preventDefault();
          delta = keyboardStep;
        }
        break;

      case 'Home':
        event.preventDefault();
        // Collapse first pane to minimum
        state.firstPaneSize = firstPane.minSize ?? 0;
        state.secondPaneSize = available - state.firstPaneSize;
        updatePaneSizes();
        dispatchResizeEvent(true);
        return;

      case 'End': {
        event.preventDefault();
        // Expand first pane to maximum
        const maxFirst = firstPane.maxSize ?? available - (secondPane.minSize ?? 0);
        state.firstPaneSize = Math.min(maxFirst, available);
        state.secondPaneSize = available - state.firstPaneSize;
        updatePaneSizes();
        dispatchResizeEvent(true);
        return;
      }

      default:
        return;
    }

    if (delta !== 0) {
      let newFirstSize = state.firstPaneSize + delta;
      let newSecondSize = state.secondPaneSize - delta;

      // Apply constraints
      const minFirst = firstPane.minSize ?? 0;
      const maxFirst = firstPane.maxSize ?? available;
      const minSecond = secondPane.minSize ?? 0;

      newFirstSize = Math.max(minFirst, Math.min(maxFirst, newFirstSize));
      newSecondSize = available - newFirstSize;

      if (newSecondSize < minSecond) {
        newSecondSize = minSecond;
        newFirstSize = available - newSecondSize;
      }

      state.firstPaneSize = newFirstSize;
      state.secondPaneSize = newSecondSize;

      updatePaneSizes();
      dispatchResizeEvent(true);
    }
  }

  /**
   * Dispatch resize custom event
   */
  function dispatchResizeEvent(isFinal: boolean): void {
    const eventName = isFinal ? 'dos:splitpane:resizeend' : 'dos:splitpane:resize';
    const event = new CustomEvent<SplitPaneResizeEventDetail>(eventName, {
      bubbles: true,
      detail: {
        firstPaneSize: state.firstPaneSize,
        secondPaneSize: state.secondPaneSize,
        ratio: getRatioInternal(),
        orientation,
      },
    });
    container.dispatchEvent(event);
  }

  /**
   * Dispatch collapse/expand event
   */
  function dispatchCollapseEvent(paneId: 'first' | 'second', collapsed: boolean): void {
    const eventName = collapsed ? 'dos:splitpane:collapse' : 'dos:splitpane:expand';
    const event = new CustomEvent<SplitPaneCollapseEventDetail>(eventName, {
      bubbles: true,
      detail: {
        paneId,
        collapsed,
      },
    });
    container.dispatchEvent(event);
  }

  /**
   * Handle resize observer callback
   */
  function handleContainerResize(): void {
    if (state.isDragging) return;

    const available = getAvailableSpace();
    if (available <= 0) return;

    // Maintain ratio on resize
    const currentTotal = state.firstPaneSize + state.secondPaneSize;
    if (currentTotal > 0) {
      const ratio = state.firstPaneSize / currentTotal;
      state.firstPaneSize = Math.round(ratio * available);
      state.secondPaneSize = available - state.firstPaneSize;
      applySizeConstraints();
      updatePaneSizes();
    }
  }

  // Set up event listeners
  divider.addEventListener('mousedown', handleDividerMouseDown);
  divider.addEventListener('touchstart', handleDividerTouchStart, { passive: false });
  divider.addEventListener('dblclick', handleDividerDoubleClick);
  divider.addEventListener('keydown', handleDividerKeyDown);

  // Set up resize observer
  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(handleContainerResize);
    resizeObserver.observe(container);
  }

  // Initial render
  renderPaneContent(firstPaneEl, firstPane);
  renderPaneContent(secondPaneEl, secondPane);

  // Calculate initial sizes after first paint
  requestAnimationFrame(() => {
    calculateInitialSizes();
    updatePaneSizes();
  });

  // Public API methods
  container.getFirstPaneSize = (): number => state.firstPaneSize;
  container.getSecondPaneSize = (): number => state.secondPaneSize;

  container.setFirstPaneSize = (size: SplitPaneSize): void => {
    const available = getAvailableSpace();
    state.firstPaneSize = parseSizeToPixels(size, available);
    state.secondPaneSize = available - state.firstPaneSize;
    applySizeConstraints();
    updatePaneSizes();
    dispatchResizeEvent(true);
  };

  container.setSecondPaneSize = (size: SplitPaneSize): void => {
    const available = getAvailableSpace();
    state.secondPaneSize = parseSizeToPixels(size, available);
    state.firstPaneSize = available - state.secondPaneSize;
    applySizeConstraints();
    updatePaneSizes();
    dispatchResizeEvent(true);
  };

  container.reset = (): void => {
    resetSizes();
  };

  container.collapse = (paneId: 'first' | 'second'): void => {
    const available = getAvailableSpace();

    if (paneId === 'first' && !state.firstPaneCollapsed && firstPane.collapsible) {
      state.sizeBeforeCollapse = state.firstPaneSize;
      state.firstPaneCollapsed = true;
      state.firstPaneSize = 0;
      state.secondPaneSize = available;
      updatePaneSizes();
      dispatchCollapseEvent('first', true);
      if (onCollapse) onCollapse('first');
    } else if (paneId === 'second' && !state.secondPaneCollapsed && secondPane.collapsible) {
      state.sizeBeforeCollapse = state.secondPaneSize;
      state.secondPaneCollapsed = true;
      state.secondPaneSize = 0;
      state.firstPaneSize = available;
      updatePaneSizes();
      dispatchCollapseEvent('second', true);
      if (onCollapse) onCollapse('second');
    }
  };

  container.expand = (paneId: 'first' | 'second'): void => {
    const available = getAvailableSpace();

    if (paneId === 'first' && state.firstPaneCollapsed) {
      state.firstPaneCollapsed = false;
      state.firstPaneSize = state.sizeBeforeCollapse ?? Math.round(available / 2);
      state.secondPaneSize = available - state.firstPaneSize;
      state.sizeBeforeCollapse = null;
      applySizeConstraints();
      updatePaneSizes();
      dispatchCollapseEvent('first', false);
      if (onExpand) onExpand('first');
    } else if (paneId === 'second' && state.secondPaneCollapsed) {
      state.secondPaneCollapsed = false;
      state.secondPaneSize = state.sizeBeforeCollapse ?? Math.round(available / 2);
      state.firstPaneSize = available - state.secondPaneSize;
      state.sizeBeforeCollapse = null;
      applySizeConstraints();
      updatePaneSizes();
      dispatchCollapseEvent('second', false);
      if (onExpand) onExpand('second');
    }
  };

  container.toggleCollapse = (paneId: 'first' | 'second'): void => {
    if (paneId === 'first') {
      if (state.firstPaneCollapsed) {
        container.expand('first');
      } else {
        container.collapse('first');
      }
    } else {
      if (state.secondPaneCollapsed) {
        container.expand('second');
      } else {
        container.collapse('second');
      }
    }
  };

  container.isCollapsed = (paneId: 'first' | 'second'): boolean => {
    return paneId === 'first' ? state.firstPaneCollapsed : state.secondPaneCollapsed;
  };

  container.getRatio = (): number => getRatioInternal();

  container.setRatio = (ratio: number): void => {
    const available = getAvailableSpace();
    const clamped = Math.max(0, Math.min(1, ratio));
    state.firstPaneSize = Math.round(clamped * available);
    state.secondPaneSize = available - state.firstPaneSize;
    applySizeConstraints();
    updatePaneSizes();
    dispatchResizeEvent(true);
  };

  container.focusDivider = (): void => {
    divider.focus();
  };

  container.setContent = (
    paneId: 'first' | 'second',
    content: string | HTMLElement | (() => HTMLElement)
  ): void => {
    const paneEl = paneId === 'first' ? firstPaneEl : secondPaneEl;
    const paneProps = paneId === 'first' ? firstPane : secondPane;
    (paneProps as { content: string | HTMLElement | (() => HTMLElement) }).content = content;
    renderPaneContent(paneEl, paneProps);
  };

  container.destroy = (): void => {
    divider.removeEventListener('mousedown', handleDividerMouseDown);
    divider.removeEventListener('touchstart', handleDividerTouchStart);
    divider.removeEventListener('dblclick', handleDividerDoubleClick);
    divider.removeEventListener('keydown', handleDividerKeyDown);

    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  };

  return container;
}
