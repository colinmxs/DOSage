/**
 * @file LoadingSpinner component
 * @description DOS-style ASCII loading spinner with multiple animation styles
 */

import type {
  LoadingSpinnerProps,
  LoadingSpinnerInstance,
  LoadingSpinnerSize,
  LoadingSpinnerStyle,
} from './LoadingSpinner.types';
import './LoadingSpinner.css';

/**
 * Animation frame sequences for different styles
 */
const ANIMATION_FRAMES: Record<LoadingSpinnerStyle, string[]> = {
  ascii: ['|', '/', '-', '\\'],
  block: ['▖', '▘', '▝', '▗'],
  dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
};

/**
 * Creates a DOS-style loading spinner element
 *
 * @param props - Loading spinner configuration
 * @returns Loading spinner instance with element and control methods
 *
 * @example
 * ```ts
 * const spinner = createLoadingSpinner({
 *   size: 'large',
 *   style: 'dots',
 *   label: 'Loading data...'
 * });
 *
 * document.body.appendChild(spinner.element);
 *
 * // Stop when done
 * spinner.stop();
 * spinner.destroy();
 * ```
 */
export function createLoadingSpinner(props: LoadingSpinnerProps = {}): LoadingSpinnerInstance {
  const {
    size = 'medium',
    style = 'ascii',
    label: initialLabel = 'Loading',
    speed = 100,
    id,
    className,
    color,
  } = props;

  // State
  let animationId: ReturnType<typeof setInterval> | null = null;
  let currentFrame = 0;
  let currentLabel = initialLabel;
  const frames = ANIMATION_FRAMES[style];

  // Create DOM elements
  const element = document.createElement('span');
  const spinnerId = id ?? `dos-loading-spinner-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  element.id = spinnerId;
  element.className = buildClassName(size, style, false, className);

  // ARIA attributes for accessibility
  element.setAttribute('role', 'status');
  element.setAttribute('aria-live', 'polite');
  element.setAttribute('aria-label', currentLabel);

  // Apply color if specified
  if (color) {
    element.style.color = color;
  }

  // Character display element
  const character = document.createElement('span');
  character.className = 'dos-loading-spinner__character';
  character.setAttribute('aria-hidden', 'true');
  character.textContent = frames[0] ?? '|';
  element.appendChild(character);

  // Visually hidden label for screen readers
  const labelElement = document.createElement('span');
  labelElement.className = 'dos-loading-spinner__label';
  labelElement.textContent = currentLabel;
  element.appendChild(labelElement);

  /**
   * Build the class name string
   */
  function buildClassName(
    sz: LoadingSpinnerSize,
    st: LoadingSpinnerStyle,
    stopped: boolean,
    extra?: string
  ): string {
    const classes = [
      'dos-loading-spinner',
      `dos-loading-spinner--${sz}`,
      `dos-loading-spinner--${st}`,
    ];

    if (stopped) {
      classes.push('dos-loading-spinner--stopped');
    }

    if (extra) {
      classes.push(extra);
    }

    return classes.join(' ');
  }

  /**
   * Update the displayed character
   */
  function updateFrame(): void {
    currentFrame = (currentFrame + 1) % frames.length;
    character.textContent = frames[currentFrame] ?? '|';
  }

  /**
   * Start the animation
   */
  function start(): void {
    if (animationId !== null) {
      return; // Already running
    }

    // Check if user prefers reduced motion (with fallback for test environments)
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;
    
    element.className = buildClassName(size, style, false, className);
    
    if (prefersReducedMotion) {
      // Don't start animation if user prefers reduced motion
      return;
    }

    animationId = setInterval(updateFrame, speed);
  }

  /**
   * Stop the animation
   */
  function stop(): void {
    if (animationId !== null) {
      clearInterval(animationId);
      animationId = null;
    }
    element.className = buildClassName(size, style, true, className);
  }

  // Start animation automatically
  start();

  // Instance methods
  const instance: LoadingSpinnerInstance = {
    get element() {
      return element;
    },

    start,
    stop,

    isAnimating(): boolean {
      return animationId !== null;
    },

    setLabel(label: string): void {
      currentLabel = label;
      element.setAttribute('aria-label', label);
      labelElement.textContent = label;
    },

    destroy(): void {
      stop();
      element.remove();
    },
  };

  return instance;
}
