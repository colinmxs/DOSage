/**
 * Base Component
 *
 * Abstract base class for DOSage components providing common functionality.
 */

import type { BaseComponentProps } from '../types/common';

/**
 * Base component interface that all DOSage components implement.
 */
export interface DosComponentInterface {
  /** The root DOM element */
  readonly element: HTMLElement;

  /** Destroy the component and clean up */
  destroy(): void;

  /** Update the component with new props */
  update(props: Partial<BaseComponentProps>): void;
}

/**
 * Abstract base class for DOSage components.
 *
 * Provides common functionality like element creation, event handling,
 * and cleanup.
 *
 * @example
 * ```typescript
 * class Button extends DosComponent<ButtonProps> {
 *   constructor(props: ButtonProps) {
 *     super(props);
 *     this.render();
 *   }
 *
 *   protected render(): void {
 *     // Implementation
 *   }
 * }
 * ```
 */
export abstract class DosComponent<P extends BaseComponentProps = BaseComponentProps>
  implements DosComponentInterface
{
  /** The root DOM element for this component */
  protected _element: HTMLElement;

  /** Current props */
  protected props: P;

  /** Event listener cleanup functions */
  private cleanupFns: (() => void)[] = [];

  /**
   * Create a new component instance.
   *
   * @param props - Component props
   * @param tagName - HTML tag name for root element (default: 'div')
   */
  constructor(props: P, tagName: keyof HTMLElementTagNameMap = 'div') {
    this.props = props;
    this._element = document.createElement(tagName);

    // Apply common props
    if (props.className) {
      this._element.className = props.className;
    }
    if (props.id) {
      this._element.id = props.id;
    }
  }

  /**
   * Get the root element.
   */
  get element(): HTMLElement {
    return this._element;
  }

  /**
   * Update the component with new props.
   *
   * @param props - Partial props to merge
   */
  update(props: Partial<P>): void {
    this.props = { ...this.props, ...props };
    this.render();
  }

  /**
   * Destroy the component and clean up resources.
   */
  destroy(): void {
    // Run cleanup functions
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];

    // Remove element from DOM
    this._element.remove();
  }

  /**
   * Register an event listener with automatic cleanup.
   *
   * @param element - Element to attach listener to
   * @param event - Event name
   * @param handler - Event handler
   * @param options - Event listener options
   */
  protected addEventListener<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    event: K,
    handler: (ev: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions
  ): void {
    element.addEventListener(event, handler, options);
    this.cleanupFns.push(() => element.removeEventListener(event, handler, options));
  }

  /**
   * Register a cleanup function to be called on destroy.
   *
   * @param fn - Cleanup function
   */
  protected onCleanup(fn: () => void): void {
    this.cleanupFns.push(fn);
  }

  /**
   * Render the component. Must be implemented by subclasses.
   */
  protected abstract render(): void;
}
