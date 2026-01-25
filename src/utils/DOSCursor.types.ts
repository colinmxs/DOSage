/**
 * DOSCursor Types
 *
 * TypeScript interfaces for the DOS block cursor overlay utility.
 */

/**
 * Configuration options for DOSCursor
 */
export interface DOSCursorOptions {
  /**
   * The input element to attach the cursor to
   */
  input: HTMLInputElement | HTMLTextAreaElement;

  /**
   * The wrapper element that will contain the cursor overlay.
   * Must have position: relative.
   */
  wrapper: HTMLElement;

  /**
   * Custom cursor character. Defaults to '█' (full block)
   */
  cursorChar?: string;

  /**
   * Whether the input is readonly (shows dimmed cursor without blink)
   */
  readonly?: boolean;

  /**
   * Whether the cursor is disabled (hidden)
   */
  disabled?: boolean;

  /**
   * Callback fired when cursor position updates
   */
  onPositionUpdate?: (position: DOSCursorPosition) => void;
}

/**
 * Cursor position information
 */
export interface DOSCursorPosition {
  /**
   * Left offset in pixels from wrapper
   */
  left: number;

  /**
   * Top offset in pixels from wrapper
   */
  top: number;

  /**
   * The character index in the input
   */
  index: number;

  /**
   * Height of the cursor in pixels
   */
  height: number;
}

/**
 * DOSCursor instance methods
 */
export interface DOSCursorInstance {
  /**
   * Shows the cursor overlay (called on focus)
   */
  show: () => void;

  /**
   * Hides the cursor overlay (called on blur)
   */
  hide: () => void;

  /**
   * Updates the cursor position based on current selection
   */
  updatePosition: () => void;

  /**
   * Sets the readonly state of the cursor
   */
  setReadonly: (readonly: boolean) => void;

  /**
   * Sets the disabled state of the cursor
   */
  setDisabled: (disabled: boolean) => void;

  /**
   * Gets the cursor overlay element
   */
  getElement: () => HTMLSpanElement;

  /**
   * Gets the current cursor position
   */
  getPosition: () => DOSCursorPosition;

  /**
   * Destroys the cursor and cleans up event listeners
   */
  destroy: () => void;

  /**
   * Whether the cursor is currently visible
   */
  isVisible: () => boolean;
}

/**
 * Character measurement cache entry
 */
export interface CharMeasurement {
  width: number;
  height: number;
}

/**
 * Input measurement context for cursor positioning
 */
export interface InputMeasurementContext {
  /**
   * Computed style of the input element
   */
  style: CSSStyleDeclaration;

  /**
   * Input's padding left value
   */
  paddingLeft: number;

  /**
   * Input's padding top value
   */
  paddingTop: number;

  /**
   * Input's border left width
   */
  borderLeft: number;

  /**
   * Input's border top width
   */
  borderTop: number;

  /**
   * Input's left offset from wrapper
   */
  inputOffsetLeft: number;

  /**
   * Input's top offset from wrapper
   */
  inputOffsetTop: number;

  /**
   * Character width for monospace font
   */
  charWidth: number;

  /**
   * Line height for cursor height
   */
  lineHeight: number;

  /**
   * Font properties string for canvas measurement
   */
  font: string;
}
