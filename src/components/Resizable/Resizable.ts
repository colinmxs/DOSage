/**
 * Resizable Component
 *
 * A DOS-style resizable container with draggable handles.
 * Supports edge and corner resizing with constraints.
 */

import type {
  ResizableProps,
  ResizableInstance,
  ResizeHandle,
  ResizeSize,
  ResizeDelta,
} from './Resizable.types';
import './Resizable.css';

/** Counter for unique IDs */
let resizableIdCounter = 0;

/** Map handle to cursor direction class */
const handleCursorMap: Record<ResizeHandle, string> = {
  'top': 'n',
  'right': 'e',
  'bottom': 's',
  'left': 'w',
  'top-left': 'nw',
  'top-right': 'ne',
  'bottom-left': 'sw',
  'bottom-right': 'se',
};

/**
 * Creates a DOS-style resizable container.
 *
 * @example
 * ```typescript
 * const resizable = createResizable({
 *   handles: ['right', 'bottom', 'bottom-right'],
 *   initialWidth: 300,
 *   initialHeight: 200,
 *   constraints: { minWidth: 100, minHeight: 100 },
 *   onResize: (size) => console.log('Size:', size),
 * });
 *
 * document.body.appendChild(resizable.element);
 * ```
 */
export function createResizable(props: ResizableProps = {}): ResizableInstance {
  const {
    handles = ['right', 'bottom', 'bottom-right'],
    initialWidth = 200,
    initialHeight = 150,
    constraints = {},
    step = 1,
    showHandlesOnHover = false,
    aspectRatio,
    content,
    onResizeStart,
    onResize,
    onResizeEnd,
    id,
    className,
    disabled = false,
  } = props;

  const resizableId = id || `dos-resizable-${++resizableIdCounter}`;

  // Normalize constraints
  const minWidth = constraints.minWidth ?? 50;
  const maxWidth = constraints.maxWidth ?? Infinity;
  const minHeight = constraints.minHeight ?? 50;
  const maxHeight = constraints.maxHeight ?? Infinity;

  // Calculate aspect ratio
  let aspectRatioValue: number | null = null;
  if (aspectRatio === true) {
    aspectRatioValue = initialWidth / initialHeight;
  } else if (typeof aspectRatio === 'number') {
    aspectRatioValue = aspectRatio;
  }

  // State
  let currentWidth = initialWidth;
  let currentHeight = initialHeight;
  let isResizing = false;
  let isDisabled = disabled;
  let activeHandle: ResizeHandle | null = null;
  let startX = 0;
  let startY = 0;
  let startWidth = 0;
  let startHeight = 0;

  // Create root element
  const root = document.createElement('div');
  root.id = resizableId;
  root.className = 'dos-resizable';
  if (showHandlesOnHover) root.classList.add('dos-resizable--hover-handles');
  if (disabled) root.classList.add('dos-resizable--disabled');
  if (className) root.classList.add(className);

  root.style.width = `${currentWidth}px`;
  root.style.height = `${currentHeight}px`;

  // Create content wrapper
  const contentElement = document.createElement('div');
  contentElement.className = 'dos-resizable___content';
  root.appendChild(contentElement);

  // Create handles
  const handleElements = new Map<ResizeHandle, HTMLElement>();

  handles.forEach((handle) => {
    const handleEl = document.createElement('div');
    handleEl.className = `dos-resizable___handle dos-resizable___handle--${handle}`;
    handleEl.setAttribute('tabindex', '0');
    handleEl.setAttribute('role', 'separator');
    handleEl.setAttribute('aria-label', `Resize ${handle.replace('-', ' ')}`);
    handleEl.setAttribute('aria-orientation', getHandleOrientation(handle));
    handleEl.setAttribute('aria-valuenow', getHandleValue(handle));

    // Mouse events
    handleEl.addEventListener('mousedown', (e) => startResize(e, handle));

    // Keyboard events
    handleEl.addEventListener('keydown', (e) => handleKeydown(e, handle));

    handleElements.set(handle, handleEl);
    root.appendChild(handleEl);
  });

  /**
   * Gets ARIA orientation for a handle.
   */
  function getHandleOrientation(handle: ResizeHandle): string {
    if (handle === 'top' || handle === 'bottom') return 'horizontal';
    if (handle === 'left' || handle === 'right') return 'vertical';
    return 'horizontal'; // Corners default to horizontal
  }

  /**
   * Gets ARIA value for a handle (current dimension).
   */
  function getHandleValue(handle: ResizeHandle): string {
    if (handle === 'top' || handle === 'bottom') return String(currentHeight);
    if (handle === 'left' || handle === 'right') return String(currentWidth);
    return String(currentWidth); // Corners use width
  }

  /**
   * Updates ARIA values on all handles.
   */
  function updateAriaValues(): void {
    handleElements.forEach((el, handle) => {
      el.setAttribute('aria-valuenow', getHandleValue(handle));
    });
  }

  /**
   * Starts the resize operation.
   */
  function startResize(e: MouseEvent, handle: ResizeHandle): void {
    if (isDisabled) return;

    e.preventDefault();
    e.stopPropagation();

    isResizing = true;
    activeHandle = handle;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = currentWidth;
    startHeight = currentHeight;

    root.classList.add('dos-resizable--resizing');
    handleElements.get(handle)?.classList.add('dos-resizable___handle--active');

    // Add cursor class to body
    document.body.classList.add(`dos-resizing-${handleCursorMap[handle]}`);

    // Add global listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResize);

    // Fire callback
    onResizeStart?.(getSize(), handle);

    // Dispatch event
    root.dispatchEvent(new CustomEvent('dos:resizable:start', {
      bubbles: true,
      detail: { size: getSize(), handle },
    }));
  }

  /**
   * Handles mouse move during resize.
   */
  function handleMouseMove(e: MouseEvent): void {
    if (!isResizing || !activeHandle) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;

    // Calculate new dimensions based on handle
    switch (activeHandle) {
      case 'right':
        newWidth = startWidth + deltaX;
        break;
      case 'left':
        newWidth = startWidth - deltaX;
        break;
      case 'bottom':
        newHeight = startHeight + deltaY;
        break;
      case 'top':
        newHeight = startHeight - deltaY;
        break;
      case 'bottom-right':
        newWidth = startWidth + deltaX;
        newHeight = startHeight + deltaY;
        break;
      case 'bottom-left':
        newWidth = startWidth - deltaX;
        newHeight = startHeight + deltaY;
        break;
      case 'top-right':
        newWidth = startWidth + deltaX;
        newHeight = startHeight - deltaY;
        break;
      case 'top-left':
        newWidth = startWidth - deltaX;
        newHeight = startHeight - deltaY;
        break;
    }

    // Apply step (snap to grid)
    if (step > 1) {
      newWidth = Math.round(newWidth / step) * step;
      newHeight = Math.round(newHeight / step) * step;
    }

    // Apply constraints
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

    // Apply aspect ratio
    if (aspectRatioValue !== null) {
      const widthBased = activeHandle.includes('left') || activeHandle.includes('right');
      if (widthBased) {
        newHeight = newWidth / aspectRatioValue;
        newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
        newWidth = newHeight * aspectRatioValue;
      } else {
        newWidth = newHeight * aspectRatioValue;
        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        newHeight = newWidth / aspectRatioValue;
      }
    }

    // Calculate delta
    const delta: ResizeDelta = {
      deltaWidth: newWidth - currentWidth,
      deltaHeight: newHeight - currentHeight,
    };

    // Apply size
    currentWidth = newWidth;
    currentHeight = newHeight;
    root.style.width = `${currentWidth}px`;
    root.style.height = `${currentHeight}px`;

    // Update ARIA
    updateAriaValues();

    // Fire callback
    onResize?.(getSize(), delta);

    // Dispatch event
    root.dispatchEvent(new CustomEvent('dos:resizable:resize', {
      bubbles: true,
      detail: { size: getSize(), delta },
    }));
  }

  /**
   * Stops the resize operation.
   */
  function stopResize(): void {
    if (!isResizing) return;

    isResizing = false;

    // Remove cursor class from body
    if (activeHandle) {
      document.body.classList.remove(`dos-resizing-${handleCursorMap[activeHandle]}`);
      handleElements.get(activeHandle)?.classList.remove('dos-resizable___handle--active');
    }

    root.classList.remove('dos-resizable--resizing');

    // Remove global listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);

    // Fire callback
    onResizeEnd?.(getSize());

    // Dispatch event
    root.dispatchEvent(new CustomEvent('dos:resizable:end', {
      bubbles: true,
      detail: { size: getSize() },
    }));

    activeHandle = null;
  }

  /**
   * Handles keyboard resize.
   */
  function handleKeydown(e: KeyboardEvent, handle: ResizeHandle): void {
    if (isDisabled) return;

    const stepSize = e.shiftKey ? step * 10 : step;
    let deltaWidth = 0;
    let deltaHeight = 0;

    switch (e.key) {
      case 'ArrowRight':
        if (handle.includes('right') || handle === 'left') {
          deltaWidth = handle === 'left' ? -stepSize : stepSize;
        }
        break;
      case 'ArrowLeft':
        if (handle.includes('left') || handle === 'right') {
          deltaWidth = handle === 'right' ? -stepSize : stepSize;
        }
        break;
      case 'ArrowDown':
        if (handle.includes('bottom') || handle === 'top') {
          deltaHeight = handle === 'top' ? -stepSize : stepSize;
        }
        break;
      case 'ArrowUp':
        if (handle.includes('top') || handle === 'bottom') {
          deltaHeight = handle === 'bottom' ? -stepSize : stepSize;
        }
        break;
      default:
        return;
    }

    if (deltaWidth === 0 && deltaHeight === 0) return;

    e.preventDefault();

    let newWidth = currentWidth + deltaWidth;
    let newHeight = currentHeight + deltaHeight;

    // Apply constraints
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

    // Apply aspect ratio
    if (aspectRatioValue !== null) {
      if (deltaWidth !== 0) {
        newHeight = newWidth / aspectRatioValue;
      } else {
        newWidth = newHeight * aspectRatioValue;
      }
    }

    const delta: ResizeDelta = {
      deltaWidth: newWidth - currentWidth,
      deltaHeight: newHeight - currentHeight,
    };

    currentWidth = newWidth;
    currentHeight = newHeight;
    root.style.width = `${currentWidth}px`;
    root.style.height = `${currentHeight}px`;

    updateAriaValues();

    onResize?.(getSize(), delta);

    root.dispatchEvent(new CustomEvent('dos:resizable:resize', {
      bubbles: true,
      detail: { size: getSize(), delta },
    }));
  }

  /**
   * Gets current size.
   */
  function getSize(): ResizeSize {
    return {
      width: currentWidth,
      height: currentHeight,
    };
  }

  /**
   * Sets size programmatically.
   */
  function setSize(width: number, height: number): void {
    let newWidth = Math.max(minWidth, Math.min(maxWidth, width));
    let newHeight = Math.max(minHeight, Math.min(maxHeight, height));

    if (aspectRatioValue !== null) {
      newHeight = newWidth / aspectRatioValue;
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
      newWidth = newHeight * aspectRatioValue;
    }

    currentWidth = newWidth;
    currentHeight = newHeight;
    root.style.width = `${currentWidth}px`;
    root.style.height = `${currentHeight}px`;
    updateAriaValues();
  }

  /**
   * Resets to initial size.
   */
  function reset(): void {
    setSize(initialWidth, initialHeight);
  }

  /**
   * Sets new content.
   */
  function setContent(newContent: HTMLElement | string): void {
    contentElement.innerHTML = '';
    if (typeof newContent === 'string') {
      contentElement.innerHTML = newContent;
    } else {
      contentElement.appendChild(newContent);
    }
  }

  /**
   * Enables resizing.
   */
  function enable(): void {
    isDisabled = false;
    root.classList.remove('dos-resizable--disabled');
  }

  /**
   * Disables resizing.
   */
  function disable(): void {
    isDisabled = true;
    root.classList.add('dos-resizable--disabled');
    if (isResizing) {
      stopResize();
    }
  }

  /**
   * Checks if resizing is disabled.
   */
  function getIsDisabled(): boolean {
    return isDisabled;
  }

  /**
   * Checks if currently resizing.
   */
  function getIsResizing(): boolean {
    return isResizing;
  }

  /**
   * Destroys the component.
   */
  function destroy(): void {
    stopResize();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);
    handleElements.clear();
  }

  // Set initial content
  if (content) {
    setContent(content);
  }

  return {
    element: root,
    contentElement,
    getSize,
    setSize,
    reset,
    setContent,
    enable,
    disable,
    isDisabled: getIsDisabled,
    isResizing: getIsResizing,
    destroy,
  };
}
