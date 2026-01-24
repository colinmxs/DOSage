/**
 * @file VisuallyHidden.test.ts
 * @description Tests for the VisuallyHidden component
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createVisuallyHidden } from '../../src/components/VisuallyHidden';

describe('VisuallyHidden', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const hidden = createVisuallyHidden();
      container.appendChild(hidden.element);

      expect(hidden.element).toBeInstanceOf(HTMLElement);
      expect(hidden.element.classList.contains('dos-visually-hidden')).toBe(true);
    });

    it('renders as span by default', () => {
      const hidden = createVisuallyHidden();
      container.appendChild(hidden.element);

      expect(hidden.element.tagName).toBe('SPAN');
    });

    it('renders as div when specified', () => {
      const hidden = createVisuallyHidden({ as: 'div' });
      container.appendChild(hidden.element);

      expect(hidden.element.tagName).toBe('DIV');
    });

    it('renders as p when specified', () => {
      const hidden = createVisuallyHidden({ as: 'p' });
      container.appendChild(hidden.element);

      expect(hidden.element.tagName).toBe('P');
    });

    it('renders as label when specified', () => {
      const hidden = createVisuallyHidden({ as: 'label' });
      container.appendChild(hidden.element);

      expect(hidden.element.tagName).toBe('LABEL');
    });

    it('renders with custom id', () => {
      const hidden = createVisuallyHidden({ id: 'my-hidden' });
      container.appendChild(hidden.element);

      expect(hidden.element.id).toBe('my-hidden');
    });

    it('renders with custom className', () => {
      const hidden = createVisuallyHidden({ className: 'custom-class' });
      container.appendChild(hidden.element);

      expect(hidden.element.classList.contains('custom-class')).toBe(true);
      expect(hidden.element.classList.contains('dos-visually-hidden')).toBe(true);
    });

    it('renders with focusable class when focusable is true', () => {
      const hidden = createVisuallyHidden({ focusable: true });
      container.appendChild(hidden.element);

      expect(hidden.element.classList.contains('dos-visually-hidden--focusable')).toBe(true);
    });

    it('sets htmlFor on label elements', () => {
      const hidden = createVisuallyHidden({
        as: 'label',
        htmlFor: 'my-input',
      });
      container.appendChild(hidden.element);

      expect((hidden.element as HTMLLabelElement).htmlFor).toBe('my-input');
    });
  });

  describe('content management', () => {
    it('renders string content', () => {
      const hidden = createVisuallyHidden({
        content: 'Screen reader only text',
      });
      container.appendChild(hidden.element);

      expect(hidden.element.textContent).toBe('Screen reader only text');
    });

    it('renders element content', () => {
      const content = document.createElement('span');
      content.textContent = 'Element content';

      const hidden = createVisuallyHidden({ content });
      container.appendChild(hidden.element);

      expect(hidden.element.textContent).toBe('Element content');
      expect(hidden.element.contains(content)).toBe(true);
    });

    it('setContent updates with string', () => {
      const hidden = createVisuallyHidden({ content: 'Initial' });
      container.appendChild(hidden.element);

      hidden.setContent('Updated content');

      expect(hidden.element.textContent).toBe('Updated content');
    });

    it('setContent updates with element', () => {
      const hidden = createVisuallyHidden({ content: 'Initial' });
      container.appendChild(hidden.element);

      const newContent = document.createElement('strong');
      newContent.textContent = 'New element';
      hidden.setContent(newContent);

      expect(hidden.element.textContent).toBe('New element');
      expect(hidden.element.contains(newContent)).toBe(true);
    });

    it('setContent replaces previous content', () => {
      const hidden = createVisuallyHidden({ content: 'Initial' });
      container.appendChild(hidden.element);

      hidden.setContent('First update');
      hidden.setContent('Second update');

      expect(hidden.element.textContent).toBe('Second update');
    });
  });

  describe('visibility control', () => {
    it('isHidden returns true initially', () => {
      const hidden = createVisuallyHidden();
      container.appendChild(hidden.element);

      expect(hidden.isHidden()).toBe(true);
    });

    it('show makes element visible', () => {
      const hidden = createVisuallyHidden();
      container.appendChild(hidden.element);

      hidden.show();

      expect(hidden.element.classList.contains('dos-visually-hidden--visible')).toBe(true);
      expect(hidden.isHidden()).toBe(false);
    });

    it('hide makes element hidden again', () => {
      const hidden = createVisuallyHidden();
      container.appendChild(hidden.element);

      hidden.show();
      hidden.hide();

      expect(hidden.element.classList.contains('dos-visually-hidden--visible')).toBe(false);
      expect(hidden.isHidden()).toBe(true);
    });

    it('show/hide can be toggled multiple times', () => {
      const hidden = createVisuallyHidden();
      container.appendChild(hidden.element);

      hidden.show();
      expect(hidden.isHidden()).toBe(false);

      hidden.hide();
      expect(hidden.isHidden()).toBe(true);

      hidden.show();
      expect(hidden.isHidden()).toBe(false);
    });
  });

  describe('CSS properties', () => {
    it('has visually hidden class applied', () => {
      const hidden = createVisuallyHidden();
      container.appendChild(hidden.element);

      // In JSDOM, we can only verify class presence, not computed styles
      // The actual CSS rules are defined in VisuallyHidden.css and work in real browsers
      expect(hidden.element.classList.contains('dos-visually-hidden')).toBe(true);
    });

    it('visible state adds visible class', () => {
      const hidden = createVisuallyHidden();
      container.appendChild(hidden.element);

      hidden.show();

      expect(hidden.element.classList.contains('dos-visually-hidden--visible')).toBe(true);
    });
  });

  describe('focusable behavior', () => {
    it('has tabindex when focusable is true', () => {
      const hidden = createVisuallyHidden({ focusable: true });
      container.appendChild(hidden.element);

      expect(hidden.element.getAttribute('tabindex')).toBe('0');
    });

    it('has tabindex when isFocusable is true', () => {
      const hidden = createVisuallyHidden({ isFocusable: true });
      container.appendChild(hidden.element);

      expect(hidden.element.getAttribute('tabindex')).toBe('0');
    });

    it('does not have tabindex when not focusable', () => {
      const hidden = createVisuallyHidden();
      container.appendChild(hidden.element);

      expect(hidden.element.hasAttribute('tabindex')).toBe(false);
    });

    it('element with focusable content does not add extra tabindex', () => {
      const focusableContent = document.createElement('button');
      focusableContent.textContent = 'Click me';

      const hidden = createVisuallyHidden({
        content: focusableContent,
        focusable: true,
      });
      container.appendChild(hidden.element);

      // The wrapper should not have tabindex when it contains focusable content
      // since the child element handles focus
      expect(hidden.element.hasAttribute('tabindex')).toBe(false);
    });
  });

  describe('use cases', () => {
    it('can be used for skip links', () => {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.textContent = 'Skip to main content';

      const hidden = createVisuallyHidden({
        content: skipLink,
        focusable: true,
      });
      container.appendChild(hidden.element);

      expect(hidden.element.querySelector('a')).toBe(skipLink);
      expect(hidden.element.classList.contains('dos-visually-hidden--focusable')).toBe(true);
    });

    it('can be used for accessible labels', () => {
      const input = document.createElement('input');
      input.id = 'my-input';
      input.type = 'text';
      container.appendChild(input);

      const hidden = createVisuallyHidden({
        as: 'label',
        htmlFor: 'my-input',
        content: 'Accessible label text',
      });
      container.appendChild(hidden.element);

      expect((hidden.element as HTMLLabelElement).htmlFor).toBe('my-input');
      expect(hidden.element.textContent).toBe('Accessible label text');
    });

    it('can be used for icon button descriptions', () => {
      const hidden = createVisuallyHidden({
        content: 'Close dialog',
      });
      container.appendChild(hidden.element);

      expect(hidden.element.textContent).toBe('Close dialog');
      expect(hidden.isHidden()).toBe(true);
    });

    it('can be used for additional context', () => {
      const link = document.createElement('a');
      link.href = 'https://example.com';
      link.textContent = 'Example';

      const hidden = createVisuallyHidden({
        content: ', opens in new tab',
      });
      link.appendChild(hidden.element);
      container.appendChild(link);

      // Screen readers will read "Example, opens in new tab"
      expect(link.textContent).toBe('Example, opens in new tab');
    });
  });

  describe('destroy', () => {
    it('removes element from DOM', () => {
      const hidden = createVisuallyHidden();
      container.appendChild(hidden.element);

      expect(container.contains(hidden.element)).toBe(true);

      hidden.destroy();

      expect(container.contains(hidden.element)).toBe(false);
    });

    it('destroy is safe to call multiple times', () => {
      const hidden = createVisuallyHidden();
      container.appendChild(hidden.element);

      hidden.destroy();
      hidden.destroy(); // Should not throw

      expect(container.contains(hidden.element)).toBe(false);
    });
  });

  describe('integration', () => {
    it('works with ARIA live regions', () => {
      const hidden = createVisuallyHidden({
        id: 'announcer',
        content: '',
      });
      hidden.element.setAttribute('aria-live', 'polite');
      hidden.element.setAttribute('aria-atomic', 'true');
      container.appendChild(hidden.element);

      // Simulate announcing something
      hidden.setContent('Item added to cart');

      expect(hidden.element.getAttribute('aria-live')).toBe('polite');
      expect(hidden.element.textContent).toBe('Item added to cart');
    });

    it('can be used with form validation', () => {
      const input = document.createElement('input');
      input.id = 'email';
      input.type = 'email';
      input.setAttribute('aria-describedby', 'email-error');
      container.appendChild(input);

      const hidden = createVisuallyHidden({
        id: 'email-error',
        content: 'Please enter a valid email address',
      });
      container.appendChild(hidden.element);

      expect(input.getAttribute('aria-describedby')).toBe('email-error');
      expect(document.getElementById('email-error')).toBe(hidden.element);
    });
  });
});
