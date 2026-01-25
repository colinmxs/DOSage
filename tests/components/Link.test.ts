/**
 * Link Component Tests
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { createLink, setLinkDisabled, setLinkLabel, setLinkHref } from '../../src/components/Link';

describe('Link', () => {
  let link: HTMLAnchorElement | null = null;

  afterEach(() => {
    if (link && link.parentNode) {
      link.remove();
    }
    link = null;
  });

  describe('rendering', () => {
    it('renders anchor element', () => {
      link = createLink({ href: '/test', label: 'Test Link' });

      expect(link).toBeInstanceOf(HTMLAnchorElement);
      expect(link.tagName).toBe('A');
    });

    it('sets href attribute', () => {
      link = createLink({ href: 'https://example.com', label: 'Example' });

      expect(link.href).toContain('example.com');
    });

    it('displays label text', () => {
      link = createLink({ href: '/test', label: 'Click Here' });
      const textEl = link.querySelector('.dos-link__text');

      expect(textEl).not.toBeNull();
      expect(textEl?.textContent).toBe('Click Here');
    });

    it('applies default classes', () => {
      link = createLink({ href: '/test', label: 'Test' });

      expect(link.classList.contains('dos-link')).toBe(true);
      expect(link.classList.contains('dos-link--underline-always')).toBe(true);
    });

    it('applies custom className', () => {
      link = createLink({ href: '/test', label: 'Test', className: 'my-link' });

      expect(link.classList.contains('dos-link')).toBe(true);
      expect(link.classList.contains('my-link')).toBe(true);
    });

    it('applies custom id', () => {
      link = createLink({ href: '/test', label: 'Test', id: 'my-link' });

      expect(link.id).toBe('my-link');
    });
  });

  describe('target', () => {
    it('defaults to _self', () => {
      link = createLink({ href: '/test', label: 'Test' });

      expect(link.target).toBe('_self');
    });

    it('applies custom target', () => {
      link = createLink({ href: '/test', label: 'Test', target: '_parent' });

      expect(link.target).toBe('_parent');
    });
  });

  describe('external links', () => {
    it('opens in new tab when external', () => {
      link = createLink({ href: 'https://example.com', label: 'External', external: true });

      expect(link.target).toBe('_blank');
    });

    it('adds rel="noopener noreferrer" for external links', () => {
      link = createLink({ href: 'https://example.com', label: 'External', external: true });

      expect(link.rel).toBe('noopener noreferrer');
    });

    it('shows external indicator', () => {
      link = createLink({ href: 'https://example.com', label: 'External', external: true });
      const icon = link.querySelector('.dos-link__external-icon');

      expect(icon).not.toBeNull();
      expect(icon?.textContent).toBe('↗');
    });

    it('hides external icon from screen readers', () => {
      link = createLink({ href: 'https://example.com', label: 'External', external: true });
      const icon = link.querySelector('.dos-link__external-icon');

      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('includes screen reader hint for new window', () => {
      link = createLink({ href: 'https://example.com', label: 'External', external: true });

      expect(link.textContent).toContain('opens in new window');
    });

    it('applies external class', () => {
      link = createLink({ href: 'https://example.com', label: 'External', external: true });

      expect(link.classList.contains('dos-link--external')).toBe(true);
    });
  });

  describe('underline styles', () => {
    it('applies always underline by default', () => {
      link = createLink({ href: '/test', label: 'Test' });

      expect(link.classList.contains('dos-link--underline-always')).toBe(true);
    });

    it('applies hover underline', () => {
      link = createLink({ href: '/test', label: 'Test', underline: 'hover' });

      expect(link.classList.contains('dos-link--underline-hover')).toBe(true);
    });

    it('applies no underline', () => {
      link = createLink({ href: '/test', label: 'Test', underline: 'none' });

      expect(link.classList.contains('dos-link--underline-none')).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('applies disabled class', () => {
      link = createLink({ href: '/test', label: 'Test', disabled: true });

      expect(link.classList.contains('dos-link--disabled')).toBe(true);
    });

    it('sets aria-disabled', () => {
      link = createLink({ href: '/test', label: 'Test', disabled: true });

      expect(link.getAttribute('aria-disabled')).toBe('true');
    });

    it('removes from tab order', () => {
      link = createLink({ href: '/test', label: 'Test', disabled: true });

      expect(link.tabIndex).toBe(-1);
    });

    it('does not set href when disabled', () => {
      link = createLink({ href: '/test', label: 'Test', disabled: true });

      expect(link.hasAttribute('href')).toBe(false);
    });

    it('prevents click events when disabled', () => {
      const onClick = vi.fn();
      link = createLink({ href: '/test', label: 'Test', disabled: true, onClick });

      link.click();

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('click handling', () => {
    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      link = createLink({ href: '/test', label: 'Test', onClick });

      link.click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('passes MouseEvent to onClick', () => {
      const onClick = vi.fn();
      link = createLink({ href: '/test', label: 'Test', onClick });

      link.click();

      expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent));
    });
  });

  describe('keyboard navigation', () => {
    it('is focusable by default', () => {
      link = createLink({ href: '/test', label: 'Test' });

      // Anchor elements with href are focusable by default
      expect(link.tabIndex).toBe(0);
    });

    it('prevents Enter when disabled', () => {
      link = createLink({ href: '/test', label: 'Test', disabled: true });
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });

      const _prevented = !link.dispatchEvent(event);
      // The event should be prevented
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('uses semantic anchor element', () => {
      link = createLink({ href: '/test', label: 'Test' });

      expect(link.tagName).toBe('A');
    });

    it('has accessible text content', () => {
      link = createLink({ href: '/test', label: 'Learn More' });

      expect(link.textContent).toContain('Learn More');
    });
  });

  describe('helper functions', () => {
    describe('setLinkDisabled', () => {
      it('disables a link', () => {
        link = createLink({ href: '/test', label: 'Test' });

        setLinkDisabled(link, true);

        expect(link.classList.contains('dos-link--disabled')).toBe(true);
        expect(link.getAttribute('aria-disabled')).toBe('true');
        expect(link.tabIndex).toBe(-1);
      });

      it('enables a disabled link', () => {
        link = createLink({ href: '/test', label: 'Test', disabled: true });

        setLinkDisabled(link, false);

        expect(link.classList.contains('dos-link--disabled')).toBe(false);
        expect(link.getAttribute('aria-disabled')).toBeNull();
        expect(link.tabIndex).toBe(0);
      });
    });

    describe('setLinkLabel', () => {
      it('updates the label text', () => {
        link = createLink({ href: '/test', label: 'Old Label' });

        setLinkLabel(link, 'New Label');

        const textEl = link.querySelector('.dos-link__text');
        expect(textEl?.textContent).toBe('New Label');
      });
    });

    describe('setLinkHref', () => {
      it('updates the href', () => {
        link = createLink({ href: '/old', label: 'Test' });

        setLinkHref(link, '/new');

        expect(link.href).toContain('/new');
      });

      it('does not update href when disabled', () => {
        link = createLink({ href: '/old', label: 'Test', disabled: true });

        setLinkHref(link, '/new');

        // Link should not have href when disabled
        expect(link.hasAttribute('href')).toBe(false);
      });
    });
  });
});
