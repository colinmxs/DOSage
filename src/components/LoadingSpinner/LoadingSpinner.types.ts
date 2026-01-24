/**
 * @file LoadingSpinner type definitions
 * @description TypeScript interfaces for the DOS-style loading spinner component
 */

/**
 * Loading spinner size options
 */
export type LoadingSpinnerSize = 'small' | 'medium' | 'large';

/**
 * Loading spinner animation style options
 */
export type LoadingSpinnerStyle = 'ascii' | 'block' | 'dots';

/**
 * Loading spinner component props
 */
export interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default 'medium'
   */
  size?: LoadingSpinnerSize;

  /**
   * Animation style
   * - 'ascii': Classic rotating line |/-\
   * - 'block': Rotating block characters ▖▘▝▗
   * - 'dots': Braille dot pattern animation
   * @default 'ascii'
   */
  style?: LoadingSpinnerStyle;

  /**
   * Accessible label for screen readers
   * @default 'Loading'
   */
  label?: string;

  /**
   * Animation speed in milliseconds per frame
   * @default 100
   */
  speed?: number;

  /**
   * Optional unique identifier
   */
  id?: string;

  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * Loading spinner instance methods
 */
export interface LoadingSpinnerInstance {
  /**
   * The spinner DOM element
   */
  readonly element: HTMLElement;

  /**
   * Start the animation (starts automatically by default)
   */
  start(): void;

  /**
   * Stop the animation
   */
  stop(): void;

  /**
   * Check if the spinner is currently animating
   */
  isAnimating(): boolean;

  /**
   * Update the label
   */
  setLabel(label: string): void;

  /**
   * Clean up resources and stop animation
   */
  destroy(): void;
}
