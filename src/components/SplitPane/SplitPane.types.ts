/**
 * SplitPane Component Types
 *
 * Type definitions for the DOS-style resizable split pane component.
 */

/**
 * Split pane orientation
 */
export type SplitPaneOrientation = 'horizontal' | 'vertical';

/**
 * Split pane variant styling
 */
export type SplitPaneVariant = 'default' | 'subtle' | 'prominent';

/**
 * Size value - can be pixels, percentage, or 'auto'
 */
export type SplitPaneSize = number | string;

/**
 * Props for configuring an individual pane
 */
export interface SplitPanePaneProps {
  /** Unique identifier for the pane */
  id?: string;

  /** Initial size (pixels, percentage string like '50%', or 'auto') */
  initialSize?: SplitPaneSize;

  /** Minimum size in pixels */
  minSize?: number;

  /** Maximum size in pixels */
  maxSize?: number;

  /** Content to render in the pane (string, HTMLElement, or factory function) */
  content: string | HTMLElement | (() => HTMLElement);

  /** Whether the pane can be collapsed */
  collapsible?: boolean;

  /** Whether the pane is currently collapsed */
  collapsed?: boolean;
}

/**
 * Props for configuring the SplitPane component
 */
export interface SplitPaneProps {
  /** Configuration for the first pane (left or top) */
  firstPane: SplitPanePaneProps;

  /** Configuration for the second pane (right or bottom) */
  secondPane: SplitPanePaneProps;

  /**
   * Orientation of the split
   * @default 'horizontal'
   */
  orientation?: SplitPaneOrientation;

  /**
   * Visual variant of the divider
   * @default 'default'
   */
  variant?: SplitPaneVariant;

  /**
   * Size of the divider/splitter in pixels
   * @default 8
   */
  dividerSize?: number;

  /**
   * Whether double-clicking the divider resets to initial sizes
   * @default true
   */
  resetOnDoubleClick?: boolean;

  /**
   * Step size for keyboard resizing in pixels
   * @default 10
   */
  keyboardStep?: number;

  /** Custom CSS class name */
  className?: string;

  /** Custom id attribute */
  id?: string;

  /**
   * Callback fired when the split ratio changes during dragging
   * @param firstPaneSize - Current size of the first pane in pixels
   * @param secondPaneSize - Current size of the second pane in pixels
   */
  onResize?: (firstPaneSize: number, secondPaneSize: number) => void;

  /**
   * Callback fired when resizing ends
   * @param firstPaneSize - Final size of the first pane in pixels
   * @param secondPaneSize - Final size of the second pane in pixels
   */
  onResizeEnd?: (firstPaneSize: number, secondPaneSize: number) => void;

  /**
   * Callback fired when a pane is collapsed
   * @param paneId - ID of the collapsed pane ('first' or 'second')
   */
  onCollapse?: (paneId: 'first' | 'second') => void;

  /**
   * Callback fired when a pane is expanded
   * @param paneId - ID of the expanded pane ('first' or 'second')
   */
  onExpand?: (paneId: 'first' | 'second') => void;
}

/**
 * Internal state for the SplitPane component
 */
export interface SplitPaneState {
  /** Current size of the first pane in pixels */
  firstPaneSize: number;

  /** Current size of the second pane in pixels */
  secondPaneSize: number;

  /** Whether currently dragging */
  isDragging: boolean;

  /** Whether the first pane is collapsed */
  firstPaneCollapsed: boolean;

  /** Whether the second pane is collapsed */
  secondPaneCollapsed: boolean;

  /** Size before collapse (for restoration) */
  sizeBeforeCollapse: number | null;
}

/**
 * Extended HTMLElement with SplitPane-specific methods
 */
export interface SplitPaneElement extends HTMLDivElement {
  /**
   * Get the current size of the first pane in pixels
   */
  getFirstPaneSize(): number;

  /**
   * Get the current size of the second pane in pixels
   */
  getSecondPaneSize(): number;

  /**
   * Set the size of the first pane
   * @param size - Size in pixels or percentage string
   */
  setFirstPaneSize(size: SplitPaneSize): void;

  /**
   * Set the size of the second pane
   * @param size - Size in pixels or percentage string
   */
  setSecondPaneSize(size: SplitPaneSize): void;

  /**
   * Reset to initial sizes
   */
  reset(): void;

  /**
   * Collapse a pane
   * @param paneId - 'first' or 'second'
   */
  collapse(paneId: 'first' | 'second'): void;

  /**
   * Expand a collapsed pane
   * @param paneId - 'first' or 'second'
   */
  expand(paneId: 'first' | 'second'): void;

  /**
   * Toggle collapse state of a pane
   * @param paneId - 'first' or 'second'
   */
  toggleCollapse(paneId: 'first' | 'second'): void;

  /**
   * Check if a pane is collapsed
   * @param paneId - 'first' or 'second'
   */
  isCollapsed(paneId: 'first' | 'second'): boolean;

  /**
   * Get the split ratio (first pane size / total available size)
   */
  getRatio(): number;

  /**
   * Set the split ratio
   * @param ratio - Number between 0 and 1
   */
  setRatio(ratio: number): void;

  /**
   * Focus the divider for keyboard navigation
   */
  focusDivider(): void;

  /**
   * Set the content of a pane
   * @param paneId - 'first' or 'second'
   * @param content - New content
   */
  setContent(paneId: 'first' | 'second', content: string | HTMLElement | (() => HTMLElement)): void;

  /**
   * Clean up event listeners
   */
  destroy(): void;
}

/**
 * Event detail for split pane resize events
 */
export interface SplitPaneResizeEventDetail {
  /** Size of the first pane in pixels */
  firstPaneSize: number;

  /** Size of the second pane in pixels */
  secondPaneSize: number;

  /** Ratio of first pane to total (0-1) */
  ratio: number;

  /** Orientation of the split */
  orientation: SplitPaneOrientation;
}

/**
 * Event detail for split pane collapse/expand events
 */
export interface SplitPaneCollapseEventDetail {
  /** Which pane was collapsed/expanded */
  paneId: 'first' | 'second';

  /** Whether the pane is now collapsed */
  collapsed: boolean;
}
