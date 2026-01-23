/**
 * Vitest Setup
 *
 * Global test configuration and utilities.
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from './utils/render';
import * as matchers from 'vitest-axe/matchers';

// Extend Vitest expect with axe matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Add custom matchers for DOM testing
expect.extend({
  toHaveClass(received: HTMLElement, className: string) {
    const hasClass = received.classList.contains(className);
    return {
      pass: hasClass,
      message: () =>
        hasClass
          ? `Expected element not to have class "${className}"`
          : `Expected element to have class "${className}"`,
    };
  },
  toHaveAttribute(received: HTMLElement, attribute: string, value?: string) {
    const hasAttribute = received.hasAttribute(attribute);
    const attributeValue = received.getAttribute(attribute);
    const matchesValue = value === undefined || attributeValue === value;

    return {
      pass: hasAttribute && matchesValue,
      message: () => {
        if (!hasAttribute) {
          return `Expected element to have attribute "${attribute}"`;
        }
        if (!matchesValue) {
          return `Expected attribute "${attribute}" to have value "${value}", but got "${attributeValue}"`;
        }
        return `Expected element not to have attribute "${attribute}"${value ? ` with value "${value}"` : ''}`;
      },
    };
  },
});

// Extend Vitest's expect interface
declare module 'vitest' {
  interface Assertion<T> {
    toHaveClass(className: string): T;
    toHaveAttribute(attribute: string, value?: string): T;
    toHaveNoViolations(): Promise<T>;
  }
  interface AsymmetricMatchersContaining {
    toHaveClass(className: string): void;
    toHaveAttribute(attribute: string, value?: string): void;
    toHaveNoViolations(): void;
  }
}
