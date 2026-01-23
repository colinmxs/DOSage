/**
 * Setup Tests
 *
 * Verify the test setup is working correctly.
 */

import { describe, it, expect } from 'vitest';
import { render, cleanup, query } from './utils/render';

describe('Test Setup', () => {
  it('should have a working test environment', () => {
    expect(true).toBe(true);
  });

  it('should have access to DOM APIs', () => {
    expect(typeof document).toBe('object');
    expect(typeof window).toBe('object');
  });

  it('should render elements to the DOM', () => {
    const div = document.createElement('div');
    div.id = 'test-element';
    div.textContent = 'Hello, Test!';

    render(div);

    const found = query('#test-element');
    expect(found).not.toBeNull();
    expect(found?.textContent).toBe('Hello, Test!');

    cleanup();
  });

  it('should cleanup after tests', () => {
    const div = document.createElement('div');
    div.id = 'cleanup-test';
    render(div);

    expect(query('#cleanup-test')).not.toBeNull();

    cleanup();

    expect(query('#cleanup-test')).toBeNull();
  });

  it('should support custom matchers', () => {
    const div = document.createElement('div');
    div.className = 'test-class another-class';
    div.setAttribute('data-test', 'value');

    render(div);

    expect(div).toHaveClass('test-class');
    expect(div).toHaveAttribute('data-test');
    expect(div).toHaveAttribute('data-test', 'value');

    cleanup();
  });
});
