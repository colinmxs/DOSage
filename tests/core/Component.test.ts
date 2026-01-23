/**
 * Placeholder for Component base class tests
 */

import { describe, it, expect, afterEach } from 'vitest';
import { DosComponent } from '../../src/core/Component';
import { cleanup, render } from '../utils/render';

// Concrete test implementation
class TestComponent extends DosComponent<{ label: string; className?: string; id?: string }> {
  constructor(props: { label: string; className?: string; id?: string }) {
    super(props, 'div');
    this.render();
  }

  protected render(): void {
    this._element.textContent = this.props.label;
    this._element.classList.add('test-component');
  }
}

describe('DosComponent', () => {
  afterEach(() => {
    cleanup();
  });

  describe('constructor', () => {
    it('creates element with correct tag', () => {
      const component = new TestComponent({ label: 'Test' });
      expect(component.element.tagName.toLowerCase()).toBe('div');
    });

    it('applies className from props', () => {
      const component = new TestComponent({ label: 'Test', className: 'custom-class' });
      expect(component.element.classList.contains('custom-class')).toBe(true);
    });

    it('applies id from props', () => {
      const component = new TestComponent({ label: 'Test', id: 'test-id' });
      expect(component.element.id).toBe('test-id');
    });
  });

  describe('render', () => {
    it('renders content correctly', () => {
      const component = new TestComponent({ label: 'Hello' });
      expect(component.element.textContent).toBe('Hello');
    });

    it('applies component class', () => {
      const component = new TestComponent({ label: 'Test' });
      expect(component.element.classList.contains('test-component')).toBe(true);
    });
  });

  describe('update', () => {
    it('updates props and re-renders', () => {
      const component = new TestComponent({ label: 'Initial' });
      expect(component.element.textContent).toBe('Initial');

      component.update({ label: 'Updated' });
      expect(component.element.textContent).toBe('Updated');
    });
  });

  describe('destroy', () => {
    it('removes element from DOM', () => {
      const component = new TestComponent({ label: 'Test' });
      render(component.element);

      expect(document.body.contains(component.element)).toBe(true);

      component.destroy();
      expect(document.body.contains(component.element)).toBe(false);
    });
  });
});
