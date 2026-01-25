/**
 * @file SkeletonLoader component
 * @description DOS-style content placeholder using ASCII block characters
 */

import type {
  SkeletonLoaderProps,
  SkeletonLoaderInstance,
  SkeletonVariant,
} from './SkeletonLoader.types';
import './SkeletonLoader.css';

/**
 * Block characters for skeleton loading effect
 * Light shade: ░ (U+2591)
 * Medium shade: ▒ (U+2592)
 */
const BLOCK_CHAR = '░';

/**
 * Line width percentages for multi-line text skeletons
 * Creates a more natural, varied appearance
 */
const LINE_WIDTHS = [100, 95, 85, 90, 70];

/** Flag to track if keyframes have been injected */
let keyframesInjected = false;

/**
 * Injects skeleton animation keyframes into the document
 * This ensures animations work even if CSS file isn't loaded
 */
function injectKeyframes(): void {
  if (keyframesInjected || typeof document === 'undefined') return;
  
  const styleId = 'dos-skeleton-keyframes';
  if (document.getElementById(styleId)) {
    keyframesInjected = true;
    return;
  }
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes dos-skeleton-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    @keyframes dos-skeleton-shimmer {
      0%, 100% { color: var(--dos-color-text-disabled, #555555); }
      33% { color: var(--dos-color-border, #AAAAAA); }
      66% { color: var(--dos-color-text-secondary, #888888); }
    }
  `;
  document.head.appendChild(style);
  keyframesInjected = true;
}

/**
 * Creates a DOS-style skeleton loader element
 *
 * @param props - Skeleton loader configuration
 * @returns Skeleton loader instance with element and control methods
 *
 * @example
 * ```ts
 * // Text skeleton (single line)
 * const textSkeleton = createSkeletonLoader({
 *   variant: 'text',
 *   width: 20
 * });
 *
 * // Multi-line text skeleton
 * const multiLine = createSkeletonLoader({
 *   variant: 'text',
 *   lines: 3,
 *   width: '100%'
 * });
 *
 * // Avatar skeleton
 * const avatar = createSkeletonLoader({
 *   variant: 'circle',
 *   width: '3em',
 *   height: '3em'
 * });
 *
 * // Card skeleton
 * const card = createSkeletonLoader({
 *   variant: 'rectangle',
 *   width: '200px',
 *   height: '150px'
 * });
 * ```
 */
export function createSkeletonLoader(props: SkeletonLoaderProps = {}): SkeletonLoaderInstance {
  // Inject keyframes on first use
  injectKeyframes();
  
  const {
    variant = 'text',
    width,
    height,
    lines = 1,
    animate = true,
    label = 'Loading content',
    id,
    className,
  } = props;

  // State
  let visible = true;

  // Create main element
  const element = document.createElement('div');
  const skeletonId = id || `dos-skeleton-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  element.id = skeletonId;
  element.className = buildClassName(variant, animate, !visible, className);

  // ARIA attributes
  element.setAttribute('role', 'status');
  element.setAttribute('aria-busy', 'true');
  element.setAttribute('aria-label', label);

  // Build content based on variant
  if (variant === 'text') {
    buildTextSkeleton(element, lines, width);
  } else {
    buildBlockSkeleton(element, variant, width, height);
  }

  /**
   * Build class name string
   */
  function buildClassName(
    v: SkeletonVariant,
    animated: boolean,
    hidden: boolean,
    extra?: string
  ): string {
    const classes = ['dos-skeleton', `dos-skeleton--${v}`];

    if (animated) {
      classes.push('dos-skeleton--animated');
    }

    if (hidden) {
      classes.push('dos-skeleton--hidden');
    }

    if (extra) {
      classes.push(extra);
    }

    return classes.join(' ');
  }

  /**
   * Build text skeleton with lines
   */
  function buildTextSkeleton(
    container: HTMLElement,
    numLines: number,
    w?: string | number
  ): void {
    for (let i = 0; i < numLines; i++) {
      const line = document.createElement('span');
      line.className = 'dos-skeleton__line';
      line.setAttribute('aria-hidden', 'true');
      
      // Apply inline styles for animation (fallback if CSS not loaded)
      if (animate) {
        line.style.animation = 'dos-skeleton-pulse 1.2s ease-in-out infinite';
      }

      // Calculate width for this line
      let lineWidth: string;
      if (w !== undefined) {
        if (typeof w === 'number') {
          // Number = character count
          const widthPercent = LINE_WIDTHS[i % LINE_WIDTHS.length] ?? 100;
          const charCount = Math.round((w * widthPercent) / 100);
          lineWidth = `${charCount}ch`;
          line.textContent = BLOCK_CHAR.repeat(charCount);
        } else {
          // String = CSS value
          const widthPercent = LINE_WIDTHS[i % LINE_WIDTHS.length] ?? 100;
          lineWidth = numLines > 1 ? `calc(${w} * ${widthPercent / 100})` : w;
          // Fill with enough characters
          line.textContent = BLOCK_CHAR.repeat(50);
        }
      } else {
        // Default width
        const widthPercent = LINE_WIDTHS[i % LINE_WIDTHS.length] ?? 100;
        lineWidth = `${widthPercent}%`;
        line.textContent = BLOCK_CHAR.repeat(50);
      }

      line.style.width = lineWidth;
      container.appendChild(line);
    }
  }

  /**
   * Build block skeleton (rectangle or circle)
   */
  function buildBlockSkeleton(
    container: HTMLElement,
    v: SkeletonVariant,
    w?: string | number,
    h?: string | number
  ): void {
    const block = document.createElement('div');
    block.className = 'dos-skeleton__block';
    block.setAttribute('aria-hidden', 'true');
    
    // Apply inline styles for animation (fallback if CSS not loaded)
    if (animate) {
      block.style.animation = 'dos-skeleton-pulse 1.2s ease-in-out infinite';
    }

    // Set dimensions
    if (v === 'circle') {
      const size = w !== undefined ? (typeof w === 'number' ? `${w}ch` : w) : '3em';
      container.style.width = size;
      container.style.height = size;
    } else {
      // Rectangle
      const blockWidth = w !== undefined ? (typeof w === 'number' ? `${w}ch` : w) : '100%';
      const blockHeight = h !== undefined ? (typeof h === 'number' ? `${h}em` : h) : '100px';
      container.style.width = blockWidth;
      container.style.height = blockHeight;
    }

    // Fill with block characters
    const fill = document.createElement('span');
    fill.className = 'dos-skeleton__fill';
    
    // Apply shimmer animation to fill (fallback if CSS not loaded)
    if (animate) {
      fill.style.animation = 'dos-skeleton-shimmer 1.5s ease-in-out infinite';
    }

    if (v === 'circle') {
      // Simple block representation for circle
      fill.textContent = BLOCK_CHAR.repeat(6);
    } else {
      // Fill rectangle with block characters
      fill.textContent = BLOCK_CHAR.repeat(30);
    }

    block.appendChild(fill);
    container.appendChild(block);
  }

  // Instance methods
  const instance: SkeletonLoaderInstance = {
    get element() {
      return element;
    },

    show(): void {
      visible = true;
      element.classList.remove('dos-skeleton--hidden');
    },

    hide(): void {
      visible = false;
      element.classList.add('dos-skeleton--hidden');
    },

    isVisible(): boolean {
      return visible;
    },

    destroy(): void {
      element.remove();
    },
  };

  return instance;
}
