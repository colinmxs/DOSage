/**
 * Draggable Component
 *
 * A DOS-style draggable element that can be moved around the screen.
 * Supports axis constraints, bounds, grid snapping, and custom handles.
 */

import type {
  DraggableProps,
  DraggableInstance,
  DragPosition,
  DragDelta,
  DragBounds,
} from './Draggable.types';
import './Draggable.css';

/** Counter for unique IDs */
let draggableIdCounter = 0;

/**
 * Creates a DOS-style draggable element.
 *
 * @example
 * ```typescript
 * const draggable = createDraggable({
 *   initialX: 100,
 *   initialY: 100,
 *   bounds: 'parent',
 *   onDrag: (pos) => console.log('Position:', pos),
 * });
 *
 * document.body.appendChild(draggable.element);
 * ```
 */
export function createDraggable(props: DraggableProps = {}): DraggableInstance {
  const {
    initialX = 0,
    initialY = 0,
    axis = 'both',
    bounds,
    grid,
    handle,
    cancel,
    content,
    useTransform = true,
    onDragStart,
    onDrag,
    onDragEnd,
    id,
    className,
    disabled = false,
  } = props;

  const draggableId = id ?? `dos-draggable-${++draggableIdCounter}`;

  // State
  let currentX = initialX;
  let currentY = initialY;
  let isDraggingState = false;
  let isDisabledState = disabled;
  let startX = 0;
  let startY = 0;
  let startPosX = 0;
  let startPosY = 0;

  // Create root element
  const root = document.createElement('div');
  root.id = draggableId;
  root.className = 'dos-draggable';
  if (axis === 'x') root.classList.add('dos-draggable--axis-x');
  if (axis === 'y') root.classList.add('dos-draggable--axis-y');
  if (disabled) root.classList.add('dos-draggable--disabled');
  if (className) root.classList.add(className);

  // Set tabindex for keyboard support
  root.setAttribute('tabindex', '0');
  root.setAttribute('role', 'application');
  root.setAttribute('aria-label', 'Draggable element. Use arrow keys to move.');
  root.setAttribute('aria-grabbed', 'false');

  // Apply initial position
  applyPosition(currentX, currentY);

  /**
   * Applies position to the element.
   */
  function applyPosition(x: number, y: number): void {
    if (useTransform) {
      root.style.transform = `translate(${x}px, ${y}px)`;
    } else {
      root.style.left = `${x}px`;
      root.style.top = `${y}px`;
    }
  }

  /**
   * Gets the handle element (the drag trigger area).
   */
  function getHandleElement(): HTMLElement {
    if (handle) {
      if (typeof handle === 'string') {
        const found = root.querySelector(handle);
        if (found instanceof HTMLElement) {
          return found;
        }
      } else if (handle instanceof HTMLElement) {
        return handle;
      }
    }
    return root;
  }

  /**
   * Checks if an element matches the cancel selector.
   */
  function isCancelled(target: EventTarget | null): boolean {
    if (!cancel || !target || !(target instanceof HTMLElement)) return false;
    return target.matches(cancel) || target.closest(cancel) !== null;
  }

  /**
   * Calculates bounds based on configuration.
   */
  function calculateBounds(): DragBounds | null {
    if (!bounds) return null;

    if (bounds === 'window') {
      return {
        left: 0,
        top: 0,
        right: window.innerWidth - root.offsetWidth,
        bottom: window.innerHeight - root.offsetHeight,
      };
    }

    if (bounds === 'parent') {
      const parent = root.parentElement;
      if (!parent) return null;
      return {
        left: 0,
        top: 0,
        right: parent.clientWidth - root.offsetWidth,
        bottom: parent.clientHeight - root.offsetHeight,
      };
    }

    return bounds;
  }

  /**
   * Constrains position within bounds.
   */
  function constrainPosition(x: number, y: number): DragPosition {
    const b = calculateBounds();
    let constrainedX = x;
    let constrainedY = y;

    if (b) {
      if (b.left !== undefined) constrainedX = Math.max(b.left, constrainedX);
      if (b.right !== undefined) constrainedX = Math.min(b.right, constrainedX);
      if (b.top !== undefined) constrainedY = Math.max(b.top, constrainedY);
      if (b.bottom !== undefined) constrainedY = Math.min(b.bottom, constrainedY);
    }

    // Apply grid snapping
    if (grid) {
      constrainedX = Math.round(constrainedX / grid[0]) * grid[0];
      constrainedY = Math.round(constrainedY / grid[1]) * grid[1];
    }

    return { x: constrainedX, y: constrainedY };
  }

  /**
   * Starts dragging.
   */
  function startDrag(e: MouseEvent): void {
    if (isDisabledState) return;
    if (isCancelled(e.target)) return;

    // Check if click is on handle
    const handleEl = getHandleElement();
    if (handleEl !== root) {
      const clickedElement = e.target as HTMLElement;
      if (!handleEl.contains(clickedElement)) return;
    }

    e.preventDefault();

    isDraggingState = true;
    startX = e.clientX;
    startY = e.clientY;
    startPosX = currentX;
    startPosY = currentY;

    root.classList.add('dos-draggable--dragging');
    root.setAttribute('aria-grabbed', 'true');
    document.body.classList.add('dos-dragging');

    // Add global listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopDrag);

    // Fire callback
    onDragStart?.(getPosition());

    // Dispatch event
    root.dispatchEvent(new CustomEvent('dos:draggable:start', {
      bubbles: true,
      detail: { position: getPosition() },
    }));
  }

  /**
   * Handles mouse move during drag.
   */
  function handleMouseMove(e: MouseEvent): void {
    if (!isDraggingState) return;

    let deltaX = e.clientX - startX;
    let deltaY = e.clientY - startY;

    // Apply axis constraint
    if (axis === 'x') deltaY = 0;
    if (axis === 'y') deltaX = 0;

    let newX = startPosX + deltaX;
    let newY = startPosY + deltaY;

    // Constrain position
    const constrained = constrainPosition(newX, newY);
    newX = constrained.x;
    newY = constrained.y;

    // Calculate actual delta (may differ due to constraints)
    const delta: DragDelta = {
      deltaX: newX - currentX,
      deltaY: newY - currentY,
    };

    currentX = newX;
    currentY = newY;
    applyPosition(currentX, currentY);

    // Fire callback
    onDrag?.(getPosition(), delta);

    // Dispatch event
    root.dispatchEvent(new CustomEvent('dos:draggable:drag', {
      bubbles: true,
      detail: { position: getPosition(), delta },
    }));
  }

  /**
   * Stops dragging.
   */
  function stopDrag(): void {
    if (!isDraggingState) return;

    isDraggingState = false;

    root.classList.remove('dos-draggable--dragging');
    root.setAttribute('aria-grabbed', 'false');
    document.body.classList.remove('dos-dragging');

    // Remove global listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopDrag);

    // Fire callback
    onDragEnd?.(getPosition());

    // Dispatch event
    root.dispatchEvent(new CustomEvent('dos:draggable:end', {
      bubbles: true,
      detail: { position: getPosition() },
    }));
  }

  /**
   * Handles keyboard navigation.
   */
  function handleKeydown(e: KeyboardEvent): void {
    if (isDisabledState) return;

    const step = e.shiftKey ? 10 : 1;
    let deltaX = 0;
    let deltaY = 0;

    switch (e.key) {
      case 'ArrowRight':
        if (axis !== 'y') deltaX = step;
        break;
      case 'ArrowLeft':
        if (axis !== 'y') deltaX = -step;
        break;
      case 'ArrowDown':
        if (axis !== 'x') deltaY = step;
        break;
      case 'ArrowUp':
        if (axis !== 'x') deltaY = -step;
        break;
      default:
        return;
    }

    if (deltaX === 0 && deltaY === 0) return;

    e.preventDefault();

    let newX = currentX + deltaX;
    let newY = currentY + deltaY;

    const constrained = constrainPosition(newX, newY);
    newX = constrained.x;
    newY = constrained.y;

    const delta: DragDelta = {
      deltaX: newX - currentX,
      deltaY: newY - currentY,
    };

    currentX = newX;
    currentY = newY;
    applyPosition(currentX, currentY);

    onDrag?.(getPosition(), delta);

    root.dispatchEvent(new CustomEvent('dos:draggable:drag', {
      bubbles: true,
      detail: { position: getPosition(), delta },
    }));
  }

  /**
   * Gets current position.
   */
  function getPosition(): DragPosition {
    return { x: currentX, y: currentY };
  }

  /**
   * Sets position programmatically.
   */
  function setPosition(x: number, y: number): void {
    const constrained = constrainPosition(x, y);
    currentX = constrained.x;
    currentY = constrained.y;
    applyPosition(currentX, currentY);
  }

  /**
   * Resets to initial position.
   */
  function reset(): void {
    setPosition(initialX, initialY);
  }

  /**
   * Sets new content.
   */
  function setContent(newContent: HTMLElement | string): void {
    // Clear existing content (but preserve handle class if needed)
    root.innerHTML = '';
    if (typeof newContent === 'string') {
      root.innerHTML = newContent;
    } else {
      root.appendChild(newContent);
    }
  }

  /**
   * Enables dragging.
   */
  function enable(): void {
    isDisabledState = false;
    root.classList.remove('dos-draggable--disabled');
  }

  /**
   * Disables dragging.
   */
  function disable(): void {
    isDisabledState = true;
    root.classList.add('dos-draggable--disabled');
    if (isDraggingState) {
      stopDrag();
    }
  }

  /**
   * Checks if dragging is disabled.
   */
  function getIsDisabled(): boolean {
    return isDisabledState;
  }

  /**
   * Checks if currently dragging.
   */
  function getIsDragging(): boolean {
    return isDraggingState;
  }

  /**
   * Destroys the component.
   */
  function destroy(): void {
    stopDrag();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopDrag);
    root.removeEventListener('mousedown', startDrag);
    root.removeEventListener('keydown', handleKeydown);
  }

  // Set initial content
  if (content) {
    setContent(content);
  }

  // Add event listeners
  root.addEventListener('mousedown', startDrag);
  root.addEventListener('keydown', handleKeydown);

  return {
    element: root,
    getPosition,
    setPosition,
    reset,
    setContent,
    enable,
    disable,
    isDisabled: getIsDisabled,
    isDragging: getIsDragging,
    destroy,
  };
}
