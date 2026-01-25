/**
 * DOSCursor Utility
 *
 * Creates and manages a DOS-style block cursor (█) overlay for text inputs.
 * Since CSS caret-shape: block has no browser support, this utility provides
 * a JavaScript-based solution that positions a blinking block character
 * at the text insertion point.
 *
 * @author DOSage
 * @since 1.0.0
 */

import type {
  DOSCursorOptions,
  DOSCursorInstance,
  DOSCursorPosition,
  InputMeasurementContext,
} from './DOSCursor.types';

/** Default block cursor character */
const DEFAULT_CURSOR_CHAR = '█';

/** CSS class names */
const CSS_CLASSES = {
  overlay: 'dos-cursor-overlay',
  visible: 'dos-cursor-overlay--visible',
  hidden: 'dos-cursor-overlay--hidden',
  readonly: 'dos-cursor-overlay--readonly',
} as const;

/** Flag to track if keyframes have been injected */
let keyframesInjected = false;

/**
 * Injects the cursor blink keyframes into the document
 */
function injectKeyframes(): void {
  if (keyframesInjected) return;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes dos-cursor-blink {
      0%, 49.9% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  keyframesInjected = true;
}

/**
 * Creates a hidden measurement element for calculating text width
 */
function createMeasurementElement(): HTMLSpanElement {
  const el = document.createElement('span');
  el.style.cssText = `
    position: absolute;
    visibility: hidden;
    white-space: pre;
    pointer-events: none;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
  `;
  return el;
}

/**
 * Gets measurement context from an input element
 */
function getInputMeasurementContext(
  input: HTMLInputElement | HTMLTextAreaElement,
  wrapper: HTMLElement
): InputMeasurementContext {
  const style = window.getComputedStyle(input);
  
  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const borderLeft = parseFloat(style.borderLeftWidth) || 0;
  const borderTop = parseFloat(style.borderTopWidth) || 0;
  
  // Get input's position relative to wrapper
  const wrapperRect = wrapper.getBoundingClientRect();
  const inputRect = input.getBoundingClientRect();
  const inputOffsetLeft = inputRect.left - wrapperRect.left;
  const inputOffsetTop = inputRect.top - wrapperRect.top;
  
  // Get font properties for measurement
  const fontSize = style.fontSize;
  const fontFamily = style.fontFamily;
  const fontWeight = style.fontWeight;
  const font = `${fontWeight} ${fontSize} ${fontFamily}`;
  
  // Calculate line height
  let lineHeight = parseFloat(style.lineHeight);
  if (isNaN(lineHeight) || style.lineHeight === 'normal') {
    lineHeight = parseFloat(fontSize) * 1.2;
  }
  
  // Measure character width using a test character
  const measureEl = createMeasurementElement();
  measureEl.style.font = font;
  measureEl.textContent = 'M'; // Use 'M' as reference for monospace
  document.body.appendChild(measureEl);
  const charWidth = measureEl.getBoundingClientRect().width;
  document.body.removeChild(measureEl);
  
  return {
    style,
    paddingLeft,
    paddingTop,
    borderLeft,
    borderTop,
    inputOffsetLeft,
    inputOffsetTop,
    charWidth,
    lineHeight,
    font,
  };
}

/**
 * Measures text width for accurate cursor positioning
 */
function measureTextWidth(text: string, font: string): number {
  const measureEl = createMeasurementElement();
  measureEl.style.font = font;
  measureEl.textContent = text || '';
  document.body.appendChild(measureEl);
  const width = measureEl.getBoundingClientRect().width;
  document.body.removeChild(measureEl);
  return width;
}

/**
 * Gets the scroll offset for textarea elements
 */
function getScrollOffset(input: HTMLInputElement | HTMLTextAreaElement): { left: number; top: number } {
  return {
    left: input.scrollLeft || 0,
    top: input.scrollTop || 0,
  };
}

/**
 * Calculates cursor position for a single-line input
 */
function calculateInputCursorPosition(
  input: HTMLInputElement,
  ctx: InputMeasurementContext
): DOSCursorPosition {
  const selectionStart = input.selectionStart ?? 0;
  const textBeforeCursor = input.value.substring(0, selectionStart);
  
  // Handle password inputs - measure masked characters
  const displayText = input.type === 'password' 
    ? '•'.repeat(textBeforeCursor.length)
    : textBeforeCursor;
  
  const textWidth = measureTextWidth(displayText, ctx.font);
  const scrollOffset = getScrollOffset(input);
  
  // Position relative to wrapper: input offset + padding + border + text width - scroll
  const left = ctx.inputOffsetLeft + ctx.paddingLeft + ctx.borderLeft + textWidth - scrollOffset.left;
  const top = ctx.inputOffsetTop + ctx.paddingTop + ctx.borderTop;
  
  return {
    left: Math.max(ctx.inputOffsetLeft + ctx.paddingLeft + ctx.borderLeft, left),
    top,
    index: selectionStart,
    height: ctx.lineHeight,
  };
}

/**
 * Calculates cursor position for a multi-line textarea
 */
function calculateTextareaCursorPosition(
  textarea: HTMLTextAreaElement,
  ctx: InputMeasurementContext
): DOSCursorPosition {
  const selectionStart = textarea.selectionStart ?? 0;
  const textBeforeCursor = textarea.value.substring(0, selectionStart);
  
  // Split by lines to find current line
  const lines = textBeforeCursor.split('\n');
  const currentLineIndex = lines.length - 1;
  const currentLineText = lines[currentLineIndex] ?? '';
  
  const textWidth = measureTextWidth(currentLineText, ctx.font);
  const scrollOffset = getScrollOffset(textarea);
  
  // Position relative to wrapper: input offset + padding + border + text width - scroll
  const left = ctx.inputOffsetLeft + ctx.paddingLeft + ctx.borderLeft + textWidth - scrollOffset.left;
  const top = ctx.inputOffsetTop + ctx.paddingTop + ctx.borderTop + (currentLineIndex * ctx.lineHeight) - scrollOffset.top;
  
  return {
    left: Math.max(ctx.inputOffsetLeft + ctx.paddingLeft + ctx.borderLeft, left),
    top: Math.max(ctx.inputOffsetTop + ctx.paddingTop + ctx.borderTop, top),
    index: selectionStart,
    height: ctx.lineHeight,
  };
}

/**
 * Creates a DOS-style block cursor overlay for an input element.
 *
 * @param options - Configuration options for the cursor
 * @returns DOSCursorInstance with methods to control the cursor
 *
 * @example
 * ```typescript
 * import { createDOSCursor } from 'dosage';
 *
 * const input = document.querySelector('input');
 * const wrapper = input.parentElement;
 *
 * const cursor = createDOSCursor({
 *   input,
 *   wrapper,
 * });
 *
 * // Cursor automatically shows on focus and hides on blur
 * // Clean up when done
 * cursor.destroy();
 * ```
 */
export function createDOSCursor(options: DOSCursorOptions): DOSCursorInstance {
  const {
    input,
    wrapper,
    cursorChar = DEFAULT_CURSOR_CHAR,
    readonly = false,
    disabled = false,
    onPositionUpdate,
  } = options;

  // Ensure keyframes are available
  injectKeyframes();

  // Create cursor overlay element
  const cursorElement = document.createElement('span');
  cursorElement.className = `${CSS_CLASSES.overlay} ${CSS_CLASSES.hidden}`;
  cursorElement.textContent = cursorChar;
  cursorElement.setAttribute('aria-hidden', 'true');
  
  // Apply inline styles to guarantee animation works
  cursorElement.style.cssText = `
    position: absolute;
    pointer-events: none;
    z-index: 10;
    color: var(--dos-cursor-color, #FFFF55);
    font-family: inherit;
    font-size: inherit;
    line-height: 1;
    user-select: none;
    animation: dos-cursor-blink 530ms step-end infinite;
  `;
  
  if (readonly) {
    cursorElement.classList.add(CSS_CLASSES.readonly);
    cursorElement.style.animation = 'none';
  }

  // Track state
  let isVisible = false;
  let isDestroyed = false;
  let isDisabled = disabled;
  let currentPosition: DOSCursorPosition = { left: 0, top: 0, index: 0, height: 16 };
  let measurementContext: InputMeasurementContext | null = null;
  let animationFrameId: number | null = null;

  /**
   * Updates measurement context (call when font/size changes)
   */
  function updateMeasurementContext(): void {
    measurementContext = getInputMeasurementContext(input, wrapper);
  }

  /**
   * Calculates and updates cursor position
   */
  function updatePosition(): void {
    if (isDestroyed || !isVisible || isDisabled) return;

    // Ensure we have measurement context
    if (!measurementContext) {
      updateMeasurementContext();
    }

    if (!measurementContext) return;
    const ctx = measurementContext;
    
    // Calculate position based on input type
    if (input instanceof HTMLTextAreaElement) {
      currentPosition = calculateTextareaCursorPosition(input, ctx);
    } else {
      currentPosition = calculateInputCursorPosition(input, ctx);
    }

    // Apply position to cursor element
    cursorElement.style.left = `${currentPosition.left}px`;
    cursorElement.style.top = `${currentPosition.top}px`;
    cursorElement.style.height = `${currentPosition.height}px`;
    cursorElement.style.lineHeight = `${currentPosition.height}px`;

    // Notify callback if provided
    onPositionUpdate?.(currentPosition);
  }

  /**
   * Schedules a position update on next animation frame
   */
  function schedulePositionUpdate(): void {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(() => {
      updatePosition();
      animationFrameId = null;
    });
  }

  /**
   * Shows the cursor overlay
   */
  function show(): void {
    if (isDestroyed || isDisabled) return;
    
    isVisible = true;
    cursorElement.classList.remove(CSS_CLASSES.hidden);
    cursorElement.classList.add(CSS_CLASSES.visible);
    
    // Update measurement context and position
    updateMeasurementContext();
    updatePosition();
  }

  /**
   * Hides the cursor overlay
   */
  function hide(): void {
    if (isDestroyed) return;
    
    isVisible = false;
    cursorElement.classList.remove(CSS_CLASSES.visible);
    cursorElement.classList.add(CSS_CLASSES.hidden);
  }

  /**
   * Sets readonly state
   */
  function setReadonly(newReadonly: boolean): void {
    cursorElement.classList.toggle(CSS_CLASSES.readonly, newReadonly);
  }

  /**
   * Sets disabled state
   */
  function setDisabled(newDisabled: boolean): void {
    isDisabled = newDisabled;
    if (newDisabled) {
      hide();
    }
  }

  // Event handlers
  function handleFocus(): void {
    if (!isDisabled) {
      show();
    }
  }

  function handleBlur(): void {
    hide();
  }

  function handleInput(): void {
    schedulePositionUpdate();
  }

  function handleKeydown(event: Event): void {
    // Update on arrow keys, home, end, etc.
    const keyboardEvent = event as KeyboardEvent;
    const navigationKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (navigationKeys.includes(keyboardEvent.key)) {
      // Small delay to let selection update
      setTimeout(schedulePositionUpdate, 0);
    }
  }

  function handleKeyup(): void {
    schedulePositionUpdate();
  }

  function handleClick(): void {
    schedulePositionUpdate();
  }

  function handleSelect(): void {
    schedulePositionUpdate();
  }

  function handleScroll(): void {
    schedulePositionUpdate();
  }

  // Attach event listeners
  function attachEventListeners(): void {
    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeydown);
    input.addEventListener('keyup', handleKeyup);
    input.addEventListener('click', handleClick);
    input.addEventListener('select', handleSelect);
    input.addEventListener('scroll', handleScroll);
    
    // Also handle mouseup for drag selection
    input.addEventListener('mouseup', handleClick);
  }

  // Detach event listeners
  function detachEventListeners(): void {
    input.removeEventListener('focus', handleFocus);
    input.removeEventListener('blur', handleBlur);
    input.removeEventListener('input', handleInput);
    input.removeEventListener('keydown', handleKeydown);
    input.removeEventListener('keyup', handleKeyup);
    input.removeEventListener('click', handleClick);
    input.removeEventListener('select', handleSelect);
    input.removeEventListener('scroll', handleScroll);
    input.removeEventListener('mouseup', handleClick);
  }

  /**
   * Destroys the cursor and cleans up resources
   */
  function destroy(): void {
    if (isDestroyed) return;
    
    isDestroyed = true;
    
    // Cancel any pending animation frame
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
    
    // Remove event listeners
    detachEventListeners();
    
    // Remove cursor element from DOM
    if (cursorElement.parentNode) {
      cursorElement.parentNode.removeChild(cursorElement);
    }
  }

  // Initialize
  wrapper.appendChild(cursorElement);
  attachEventListeners();

  // If input is already focused, show cursor
  if (document.activeElement === input) {
    show();
  }

  // Return public API
  return {
    show,
    hide,
    updatePosition,
    setReadonly,
    setDisabled,
    getElement: () => cursorElement,
    getPosition: () => ({ ...currentPosition }),
    destroy,
    isVisible: () => isVisible,
  };
}

/**
 * Attaches a DOS cursor to an input element within a wrapper.
 * Convenience function that handles common setup.
 *
 * @param input - The input element
 * @param wrapper - The wrapper element (must have position: relative)
 * @param options - Additional options
 * @returns DOSCursorInstance
 */
export function attachDOSCursor(
  input: HTMLInputElement | HTMLTextAreaElement,
  wrapper: HTMLElement,
  options: Partial<Omit<DOSCursorOptions, 'input' | 'wrapper'>> = {}
): DOSCursorInstance {
  return createDOSCursor({
    input,
    wrapper,
    ...options,
  });
}

export type { DOSCursorOptions, DOSCursorInstance, DOSCursorPosition } from './DOSCursor.types';
