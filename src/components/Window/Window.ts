/**
 * Window Component
 *
 * A DOS-style draggable, resizable window with title bar controls.
 */

import type { WindowProps, WindowInstance, WindowState, WindowPosition, WindowSize } from './Window.types';
import './Window.css';

/** Counter for generating unique window IDs */
let windowIdCounter = 0;

/** Z-index counter for window stacking */
let zIndexCounter = 100;

/**
 * Creates a DOS-style draggable, resizable window.
 *
 * @param props - Window configuration options
 * @returns Window instance with methods for control
 *
 * @example
 * ```typescript
 * import { createWindow } from 'dosage';
 *
 * const window = createWindow({
 *   title: 'My Window',
 *   content: 'Hello, World!',
 *   width: 400,
 *   height: 300,
 *   draggable: true,
 *   resizable: true
 * });
 *
 * document.body.appendChild(window.element);
 * window.open();
 * ```
 */
export function createWindow(props: WindowProps): WindowInstance {
  const {
    title,
    content,
    width = 400,
    height = 300,
    x = 50,
    y = 50,
    state: initialState = 'normal',
    draggable = true,
    resizable = true,
    showMinimize = true,
    showMaximize = true,
    showClose = true,
    minWidth = 200,
    minHeight = 100,
    className,
    id,
    onClose,
    onMinimize,
    onMaximize,
    onRestore,
    onMove,
    onResize,
    onFocus,
    onBlur,
  } = props;

  // Generate unique ID
  const windowId = id ?? `dos-window-${++windowIdCounter}`;
  const titleId = `${windowId}-title`;

  // State - always start as 'normal', initial state applied after creation
  let currentState: WindowState = 'normal';
  let isVisible = false;
  let focused = false;

  // Position and size state
  let posX = x;
  let posY = y;
  let currentWidth = typeof width === 'number' ? width : parseInt(width, 10) || 400;
  let currentHeight = typeof height === 'number' ? height : parseInt(height, 10) || 300;

  // Store pre-maximize state for restoration
  let preMaximizeState: { x: number; y: number; width: number; height: number } | null = null;

  // Create window element
  const windowEl = document.createElement('div');
  windowEl.className = 'dos-window dos-window--hidden';
  if (className) {
    windowEl.classList.add(className);
  }
  windowEl.id = windowId;
  windowEl.setAttribute('role', 'dialog');
  windowEl.setAttribute('aria-labelledby', titleId);
  windowEl.setAttribute('tabindex', '-1');
  windowEl.dataset.draggable = String(draggable);
  windowEl.dataset.resizable = String(resizable);

  // Set initial position and size
  windowEl.style.left = `${posX}px`;
  windowEl.style.top = `${posY}px`;
  windowEl.style.width = typeof width === 'number' ? `${width}px` : width;
  windowEl.style.height = typeof height === 'number' ? `${height}px` : height;
  windowEl.style.minWidth = `${minWidth}px`;
  windowEl.style.minHeight = `${minHeight}px`;

  // Create title bar
  const titleBar = document.createElement('div');
  titleBar.className = 'dos-window__title-bar';

  // Create title
  const titleEl = document.createElement('h3');
  titleEl.className = 'dos-window__title';
  titleEl.id = titleId;
  titleEl.textContent = title;

  // Create controls container
  const controls = document.createElement('div');
  controls.className = 'dos-window__controls';

  // Create minimize button
  let minimizeBtn: HTMLButtonElement | null = null;
  if (showMinimize) {
    minimizeBtn = document.createElement('button');
    minimizeBtn.className = 'dos-window__control dos-window__control--minimize';
    minimizeBtn.type = 'button';
    minimizeBtn.innerHTML = '─';
    minimizeBtn.setAttribute('aria-label', 'Minimize window');
    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentState === 'minimized') {
        restoreWindow();
      } else {
        minimizeWindow();
      }
    });
    controls.appendChild(minimizeBtn);
  }

  // Create maximize button
  let maximizeBtn: HTMLButtonElement | null = null;
  if (showMaximize) {
    maximizeBtn = document.createElement('button');
    maximizeBtn.className = 'dos-window__control dos-window__control--maximize';
    maximizeBtn.type = 'button';
    maximizeBtn.innerHTML = '□';
    maximizeBtn.setAttribute('aria-label', 'Maximize window');
    maximizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentState === 'maximized') {
        restoreWindow();
      } else {
        maximizeWindow();
      }
    });
    controls.appendChild(maximizeBtn);
  }

  // Create close button
  let closeBtn: HTMLButtonElement | null = null;
  if (showClose) {
    closeBtn = document.createElement('button');
    closeBtn.className = 'dos-window__control dos-window__control--close';
    closeBtn.type = 'button';
    closeBtn.innerHTML = 'X';
    closeBtn.setAttribute('aria-label', 'Close window');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeWindow();
    });
    controls.appendChild(closeBtn);
  }

  titleBar.appendChild(titleEl);
  titleBar.appendChild(controls);

  // Create content area
  const contentEl = document.createElement('div');
  contentEl.className = 'dos-window__content';
  if (content) {
    if (typeof content === 'string') {
      contentEl.textContent = content;
    } else {
      contentEl.appendChild(content);
    }
  }

  // Create resize handles
  const resizeDirections = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
  resizeDirections.forEach((dir) => {
    const handle = document.createElement('div');
    handle.className = `dos-window__resize-handle dos-window__resize-handle--${dir}`;
    handle.dataset.direction = dir;
    windowEl.appendChild(handle);
  });

  // Assemble window
  windowEl.appendChild(titleBar);
  windowEl.appendChild(contentEl);

  // Drag state
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  // Resize state
  let isResizing = false;
  let resizeDirection = '';
  let resizeStartX = 0;
  let resizeStartY = 0;
  let resizeStartWidth = 0;
  let resizeStartHeight = 0;
  let resizeStartPosX = 0;
  let resizeStartPosY = 0;

  // Drag handlers
  function handleDragStart(e: MouseEvent): void {
    if (!draggable || currentState === 'maximized' || currentState === 'minimized') return;
    if ((e.target as HTMLElement).closest('.dos-window__controls')) return;
    if ((e.target as HTMLElement).closest('.dos-window__resize-handle')) return;

    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragOffsetX = posX;
    dragOffsetY = posY;

    windowEl.classList.add('dos-window--dragging');
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  }

  function handleDragMove(e: MouseEvent): void {
    if (!isDragging) return;

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    posX = dragOffsetX + dx;
    posY = dragOffsetY + dy;

    // Constrain to viewport
    posX = Math.max(0, Math.min(posX, window.innerWidth - 50));
    posY = Math.max(0, Math.min(posY, window.innerHeight - 50));

    windowEl.style.left = `${posX}px`;
    windowEl.style.top = `${posY}px`;

    onMove?.({ x: posX, y: posY });
  }

  function handleDragEnd(): void {
    isDragging = false;
    windowEl.classList.remove('dos-window--dragging');
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  }

  // Resize handlers
  function handleResizeStart(e: MouseEvent): void {
    if (!resizable || currentState === 'maximized' || currentState === 'minimized') return;

    const target = e.target as HTMLElement;
    if (!target.classList.contains('dos-window__resize-handle')) return;

    e.preventDefault();
    isResizing = true;
    resizeDirection = target.dataset.direction ?? '';
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    resizeStartWidth = currentWidth;
    resizeStartHeight = currentHeight;
    resizeStartPosX = posX;
    resizeStartPosY = posY;

    windowEl.classList.add('dos-window--resizing');
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }

  function handleResizeMove(e: MouseEvent): void {
    if (!isResizing) return;

    const dx = e.clientX - resizeStartX;
    const dy = e.clientY - resizeStartY;

    let newWidth = resizeStartWidth;
    let newHeight = resizeStartHeight;
    let newX = resizeStartPosX;
    let newY = resizeStartPosY;

    // Handle horizontal resize
    if (resizeDirection.includes('e')) {
      newWidth = Math.max(minWidth, resizeStartWidth + dx);
    }
    if (resizeDirection.includes('w')) {
      const widthChange = Math.min(dx, resizeStartWidth - minWidth);
      newWidth = resizeStartWidth - widthChange;
      newX = resizeStartPosX + widthChange;
    }

    // Handle vertical resize
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(minHeight, resizeStartHeight + dy);
    }
    if (resizeDirection.includes('n')) {
      const heightChange = Math.min(dy, resizeStartHeight - minHeight);
      newHeight = resizeStartHeight - heightChange;
      newY = resizeStartPosY + heightChange;
    }

    // Apply changes
    currentWidth = newWidth;
    currentHeight = newHeight;
    posX = newX;
    posY = newY;

    windowEl.style.width = `${newWidth}px`;
    windowEl.style.height = `${newHeight}px`;
    windowEl.style.left = `${newX}px`;
    windowEl.style.top = `${newY}px`;

    onResize?.({ width: newWidth, height: newHeight });
  }

  function handleResizeEnd(): void {
    isResizing = false;
    windowEl.classList.remove('dos-window--resizing');
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  }

  // Focus handlers
  function handleFocus(): void {
    if (focused) return;
    focused = true;

    // Bring to front
    zIndexCounter++;
    windowEl.style.zIndex = String(zIndexCounter);
    windowEl.classList.add('dos-window--focused');

    // Blur other windows
    document.querySelectorAll('.dos-window--focused').forEach((win) => {
      if (win !== windowEl) {
        win.classList.remove('dos-window--focused');
      }
    });

    onFocus?.();
  }

  function handleBlur(): void {
    // Blur is handled by focus on another window
    focused = false;
    windowEl.classList.remove('dos-window--focused');
    onBlur?.();
  }

  // Keyboard handler
  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && showClose) {
      closeWindow();
    }
  }

  // Event listeners
  titleBar.addEventListener('mousedown', handleDragStart);
  windowEl.addEventListener('mousedown', handleResizeStart);
  windowEl.addEventListener('mousedown', handleFocus);
  windowEl.addEventListener('focusout', (e: FocusEvent) => {
    // Only trigger blur if focus is leaving the window entirely
    if (!windowEl.contains(e.relatedTarget as Node)) {
      handleBlur();
    }
  });
  windowEl.addEventListener('keydown', handleKeyDown);

  // Double-click title bar to maximize/restore
  titleBar.addEventListener('dblclick', (e) => {
    if ((e.target as HTMLElement).closest('.dos-window__controls')) return;
    if (showMaximize) {
      if (currentState === 'maximized') {
        restoreWindow();
      } else {
        maximizeWindow();
      }
    }
  });

  /**
   * Opens/shows the window
   */
  function openWindow(): void {
    if (isVisible) return;
    isVisible = true;
    windowEl.classList.remove('dos-window--hidden');
    handleFocus();
  }

  /**
   * Closes/hides the window
   */
  function closeWindow(): void {
    if (!isVisible) return;
    isVisible = false;
    windowEl.classList.add('dos-window--hidden');
    onClose?.();
  }

  /**
   * Minimizes the window
   */
  function minimizeWindow(): void {
    if (currentState === 'minimized') return;
    currentState = 'minimized';
    windowEl.classList.add('dos-window--minimized');
    windowEl.classList.remove('dos-window--maximized');

    if (minimizeBtn) {
      minimizeBtn.innerHTML = '□';
      minimizeBtn.setAttribute('aria-label', 'Restore window');
    }

    onMinimize?.();
  }

  /**
   * Maximizes the window
   */
  function maximizeWindow(): void {
    if (currentState === 'maximized') return;

    // Store current state for restoration
    preMaximizeState = {
      x: posX,
      y: posY,
      width: currentWidth,
      height: currentHeight,
    };

    currentState = 'maximized';
    windowEl.classList.add('dos-window--maximized');
    windowEl.classList.remove('dos-window--minimized');

    if (maximizeBtn) {
      maximizeBtn.innerHTML = '❐';
      maximizeBtn.setAttribute('aria-label', 'Restore window');
    }

    onMaximize?.();
  }

  /**
   * Restores the window to normal state
   */
  function restoreWindow(): void {
    if (currentState === 'normal') return;

    const wasMaximized = currentState === 'maximized';
    currentState = 'normal';
    windowEl.classList.remove('dos-window--minimized', 'dos-window--maximized');

    // Restore size and position if was maximized
    if (wasMaximized && preMaximizeState) {
      posX = preMaximizeState.x;
      posY = preMaximizeState.y;
      currentWidth = preMaximizeState.width;
      currentHeight = preMaximizeState.height;

      windowEl.style.left = `${posX}px`;
      windowEl.style.top = `${posY}px`;
      windowEl.style.width = `${currentWidth}px`;
      windowEl.style.height = `${currentHeight}px`;

      preMaximizeState = null;
    }

    if (minimizeBtn) {
      minimizeBtn.innerHTML = '─';
      minimizeBtn.setAttribute('aria-label', 'Minimize window');
    }
    if (maximizeBtn) {
      maximizeBtn.innerHTML = '□';
      maximizeBtn.setAttribute('aria-label', 'Maximize window');
    }

    onRestore?.();
  }

  /**
   * Brings the window to the front
   */
  function focusWindow(): void {
    handleFocus();
    windowEl.focus();
  }

  /**
   * Gets the current window state
   */
  function getState(): WindowState {
    return currentState;
  }

  /**
   * Gets the current position
   */
  function getPosition(): WindowPosition {
    return { x: posX, y: posY };
  }

  /**
   * Sets the window position
   */
  function setPosition(newX: number, newY: number): void {
    posX = newX;
    posY = newY;
    windowEl.style.left = `${newX}px`;
    windowEl.style.top = `${newY}px`;
    onMove?.({ x: newX, y: newY });
  }

  /**
   * Gets the current size
   */
  function getSize(): WindowSize {
    return { width: currentWidth, height: currentHeight };
  }

  /**
   * Sets the window size
   */
  function setSize(newWidth: number, newHeight: number): void {
    currentWidth = Math.max(minWidth, newWidth);
    currentHeight = Math.max(minHeight, newHeight);
    windowEl.style.width = `${currentWidth}px`;
    windowEl.style.height = `${currentHeight}px`;
    onResize?.({ width: currentWidth, height: currentHeight });
  }

  /**
   * Sets the window title
   */
  function setTitle(newTitle: string): void {
    titleEl.textContent = newTitle;
  }

  /**
   * Sets the window content
   */
  function setContent(newContent: string | HTMLElement): void {
    contentEl.innerHTML = '';
    if (typeof newContent === 'string') {
      contentEl.textContent = newContent;
    } else {
      contentEl.appendChild(newContent);
    }
  }

  /**
   * Destroys the window and cleans up
   */
  function destroy(): void {
    // Remove event listeners
    titleBar.removeEventListener('mousedown', handleDragStart);
    windowEl.removeEventListener('mousedown', handleResizeStart);
    windowEl.removeEventListener('mousedown', handleFocus);
    windowEl.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);

    // Remove from DOM
    windowEl.remove();
  }

  /**
   * Whether the window is currently visible
   */
  function getIsVisible(): boolean {
    return isVisible;
  }

  /**
   * Whether the window is currently focused
   */
  function getIsFocused(): boolean {
    return focused;
  }

  // Apply initial state if not normal
  if (initialState === 'minimized') {
    minimizeWindow();
  } else if (initialState === 'maximized') {
    maximizeWindow();
  }

  return {
    element: windowEl,
    open: openWindow,
    close: closeWindow,
    minimize: minimizeWindow,
    maximize: maximizeWindow,
    restore: restoreWindow,
    focus: focusWindow,
    getState,
    getPosition,
    setPosition,
    getSize,
    setSize,
    setTitle,
    setContent,
    destroy,
    isVisible: getIsVisible,
    isFocused: getIsFocused,
  };
}
