/**
 * Popover Component Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPopover } from '../../src/components/Popover';

describe('Popover', () => {
  let target: HTMLElement;
  let popover: ReturnType<typeof createPopover>;

  beforeEach(() => {
    // Create a target element
    target = document.createElement('button');
    target.textContent = 'Click me';
    document.body.appendChild(target);
  });

  afterEach(() => {
    // Clean up
    if (popover) {
      popover.destroy();
    }
    target.remove();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('createPopover', () => {
    describe('rendering', () => {
      it('creates a popover element', () => {
        popover = createPopover({
          content: 'Test content',
          target,
        });

        expect(popover.element).toBeDefined();
        expect(popover.element.classList.contains('dos-popover')).toBe(true);
      });

      it('renders string content', () => {
        popover = createPopover({
          content: 'Test content',
          target,
        });

        const contentEl = popover.element.querySelector('.dos-popover__content');
        expect(contentEl?.textContent).toBe('Test content');
      });

      it('renders element content', () => {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'custom-content';
        contentDiv.textContent = 'Element content';

        popover = createPopover({
          content: contentDiv,
          target,
        });

        const contentEl = popover.element.querySelector('.dos-popover__content');
        expect(contentEl?.querySelector('.custom-content')).not.toBeNull();
      });

      it('renders title when provided', () => {
        popover = createPopover({
          content: 'Test',
          target,
          title: 'My Title',
        });

        const titleEl = popover.element.querySelector('.dos-popover__title');
        expect(titleEl?.textContent).toBe('My Title');
      });

      it('does not render header when no title', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        const headerEl = popover.element.querySelector('.dos-popover__header');
        expect(headerEl).toBeNull();
      });

      it('generates unique ID', () => {
        const popover1 = createPopover({ content: 'Pop 1', target });
        const target2 = document.createElement('button');
        document.body.appendChild(target2);
        const popover2 = createPopover({ content: 'Pop 2', target: target2 });

        expect(popover1.element.id).not.toBe(popover2.element.id);

        popover1.destroy();
        popover2.destroy();
        target2.remove();
      });

      it('uses custom ID if provided', () => {
        popover = createPopover({
          content: 'Test',
          target,
          id: 'my-custom-popover',
        });

        expect(popover.element.id).toBe('my-custom-popover');
      });

      it('applies custom className', () => {
        popover = createPopover({
          content: 'Test',
          target,
          className: 'my-custom-class',
        });

        expect(popover.element.classList.contains('my-custom-class')).toBe(true);
      });

      it('renders arrow by default', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        const arrow = popover.element.querySelector('.dos-popover__arrow');
        expect(arrow).not.toBeNull();
      });

      it('does not render arrow when disabled', () => {
        popover = createPopover({
          content: 'Test',
          target,
          arrow: false,
        });

        const arrow = popover.element.querySelector('.dos-popover__arrow');
        expect(arrow).toBeNull();
      });

      it('starts closed', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        expect(popover.element.classList.contains('dos-popover--open')).toBe(false);
        expect(popover.isOpen()).toBe(false);
      });

      it('appends to document body', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        expect(document.body.contains(popover.element)).toBe(true);
      });
    });

    describe('positions', () => {
      it('applies bottom position by default', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        expect(popover.element.classList.contains('dos-popover--bottom')).toBe(true);
      });

      it('applies top position', () => {
        popover = createPopover({
          content: 'Test',
          target,
          position: 'top',
        });

        expect(popover.element.classList.contains('dos-popover--top')).toBe(true);
      });

      it('applies bottom position', () => {
        popover = createPopover({
          content: 'Test',
          target,
          position: 'bottom',
        });

        expect(popover.element.classList.contains('dos-popover--bottom')).toBe(true);
      });

      it('applies left position', () => {
        popover = createPopover({
          content: 'Test',
          target,
          position: 'left',
        });

        expect(popover.element.classList.contains('dos-popover--left')).toBe(true);
      });

      it('applies right position', () => {
        popover = createPopover({
          content: 'Test',
          target,
          position: 'right',
        });

        expect(popover.element.classList.contains('dos-popover--right')).toBe(true);
      });
    });

    describe('triggers', () => {
      it('opens on click with click trigger (default)', () => {
        popover = createPopover({
          content: 'Test',
          target,
          trigger: 'click',
        });

        target.click();

        expect(popover.isOpen()).toBe(true);
      });

      it('toggles on click', () => {
        popover = createPopover({
          content: 'Test',
          target,
          trigger: 'click',
        });

        target.click();
        expect(popover.isOpen()).toBe(true);

        target.click();
        expect(popover.isOpen()).toBe(false);
      });

      it('opens on Enter key with click trigger', () => {
        popover = createPopover({
          content: 'Test',
          target,
          trigger: 'click',
        });

        target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(popover.isOpen()).toBe(true);
      });

      it('opens on Space key with click trigger', () => {
        popover = createPopover({
          content: 'Test',
          target,
          trigger: 'click',
        });

        target.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

        expect(popover.isOpen()).toBe(true);
      });

      it('opens on hover with hover trigger', () => {
        popover = createPopover({
          content: 'Test',
          target,
          trigger: 'hover',
        });

        target.dispatchEvent(new MouseEvent('mouseenter'));

        expect(popover.isOpen()).toBe(true);
      });

      it('closes on mouse leave with hover trigger', () => {
        popover = createPopover({
          content: 'Test',
          target,
          trigger: 'hover',
        });

        target.dispatchEvent(new MouseEvent('mouseenter'));
        expect(popover.isOpen()).toBe(true);

        target.dispatchEvent(new MouseEvent('mouseleave'));
        expect(popover.isOpen()).toBe(false);
      });

      it('opens on focus with focus trigger', () => {
        popover = createPopover({
          content: 'Test',
          target,
          trigger: 'focus',
        });

        target.dispatchEvent(new FocusEvent('focus'));

        expect(popover.isOpen()).toBe(true);
      });

      it('does not close on blur if focus moves into popover', () => {
        popover = createPopover({
          content: 'Test',
          target,
          trigger: 'focus',
        });

        target.dispatchEvent(new FocusEvent('focus'));
        expect(popover.isOpen()).toBe(true);

        // Simulate blur to an element inside the popover - should stay open
        const popoverContent = popover.element.querySelector('.dos-popover__content') as HTMLElement;
        target.dispatchEvent(new FocusEvent('blur', { relatedTarget: popoverContent }));

        expect(popover.isOpen()).toBe(true);
      });
    });

    describe('close on click outside', () => {
      it('closes when clicking outside by default', () => {
        popover = createPopover({
          content: 'Test',
          target,
          trigger: 'click',
        });

        popover.open();
        expect(popover.isOpen()).toBe(true);

        // Click outside
        document.body.click();
        expect(popover.isOpen()).toBe(false);
      });

      it('does not close on outside click when disabled', () => {
        popover = createPopover({
          content: 'Test',
          target,
          trigger: 'click',
          closeOnClickOutside: false,
        });

        popover.open();
        document.body.click();

        expect(popover.isOpen()).toBe(true);
      });

      it('does not close when clicking inside popover', () => {
        popover = createPopover({
          content: 'Test',
          target,
          trigger: 'click',
        });

        popover.open();

        // Click inside popover
        popover.element.click();
        expect(popover.isOpen()).toBe(true);
      });
    });

    describe('close on Escape', () => {
      it('closes on Escape key by default', () => {
        popover = createPopover({
          content: 'Test',
          target,
          trigger: 'click',
        });

        popover.open();
        expect(popover.isOpen()).toBe(true);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(popover.isOpen()).toBe(false);
      });

      it('does not close on Escape when disabled', () => {
        popover = createPopover({
          content: 'Test',
          target,
          trigger: 'click',
          closeOnEscape: false,
        });

        popover.open();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        expect(popover.isOpen()).toBe(true);
      });
    });

    describe('callbacks', () => {
      it('calls onOpen when opened', () => {
        const onOpen = vi.fn();
        popover = createPopover({
          content: 'Test',
          target,
          onOpen,
        });

        popover.open();

        expect(onOpen).toHaveBeenCalledTimes(1);
      });

      it('calls onClose when closed', () => {
        const onClose = vi.fn();
        popover = createPopover({
          content: 'Test',
          target,
          onClose,
        });

        popover.open();
        popover.close();

        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });

    describe('instance methods', () => {
      it('open() opens popover', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        popover.open();

        expect(popover.isOpen()).toBe(true);
        expect(popover.element.classList.contains('dos-popover--open')).toBe(true);
      });

      it('close() closes popover', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        popover.open();
        popover.close();

        expect(popover.isOpen()).toBe(false);
        expect(popover.element.classList.contains('dos-popover--open')).toBe(false);
      });

      it('toggle() toggles popover', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        popover.toggle();
        expect(popover.isOpen()).toBe(true);

        popover.toggle();
        expect(popover.isOpen()).toBe(false);
      });

      it('setContent() updates string content', () => {
        popover = createPopover({
          content: 'Initial',
          target,
        });

        popover.setContent('Updated');

        const contentEl = popover.element.querySelector('.dos-popover__content');
        expect(contentEl?.textContent).toBe('Updated');
      });

      it('setContent() updates element content', () => {
        popover = createPopover({
          content: 'Initial',
          target,
        });

        const newContent = document.createElement('span');
        newContent.textContent = 'New element';
        popover.setContent(newContent);

        const contentEl = popover.element.querySelector('.dos-popover__content');
        expect(contentEl?.querySelector('span')?.textContent).toBe('New element');
      });

      it('setTitle() updates title', () => {
        popover = createPopover({
          content: 'Test',
          target,
          title: 'Initial',
        });

        popover.setTitle('Updated Title');

        const titleEl = popover.element.querySelector('.dos-popover__title');
        expect(titleEl?.textContent).toBe('Updated Title');
      });

      it('setTitle() can add title to popover without initial title', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        popover.setTitle('New Title');

        const titleEl = popover.element.querySelector('.dos-popover__title');
        expect(titleEl?.textContent).toBe('New Title');
      });

      it('setTitle(null) hides title', () => {
        popover = createPopover({
          content: 'Test',
          target,
          title: 'Initial',
        });

        popover.setTitle(null);

        const headerEl = popover.element.querySelector('.dos-popover__header') as HTMLElement;
        expect(headerEl?.style.display).toBe('none');
      });

      it('setPosition() updates position', () => {
        popover = createPopover({
          content: 'Test',
          target,
          position: 'top',
        });

        popover.setPosition('bottom');
        popover.open();

        // Should have bottom position class when opened
        expect(popover.element.classList.contains('dos-popover--bottom')).toBe(true);
      });

      it('isOpen() returns open state', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        expect(popover.isOpen()).toBe(false);
        popover.open();
        expect(popover.isOpen()).toBe(true);
        popover.close();
        expect(popover.isOpen()).toBe(false);
      });

      it('destroy() removes element from DOM', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        const element = popover.element;
        popover.destroy();

        expect(document.body.contains(element)).toBe(false);
      });

      it('destroy() removes ARIA attributes from target', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        expect(target.hasAttribute('aria-haspopup')).toBe(true);
        expect(target.hasAttribute('aria-expanded')).toBe(true);

        popover.destroy();

        expect(target.hasAttribute('aria-haspopup')).toBe(false);
        expect(target.hasAttribute('aria-expanded')).toBe(false);
      });
    });

    describe('accessibility', () => {
      it('has role="dialog"', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        expect(popover.element.getAttribute('role')).toBe('dialog');
      });

      it('sets aria-haspopup on target', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        expect(target.getAttribute('aria-haspopup')).toBe('dialog');
      });

      it('sets aria-expanded on target', () => {
        popover = createPopover({
          content: 'Test',
          target,
        });

        expect(target.getAttribute('aria-expanded')).toBe('false');

        popover.open();
        expect(target.getAttribute('aria-expanded')).toBe('true');

        popover.close();
        expect(target.getAttribute('aria-expanded')).toBe('false');
      });

      it('sets aria-controls on target', () => {
        popover = createPopover({
          content: 'Test',
          target,
          id: 'test-popover',
        });

        expect(target.getAttribute('aria-controls')).toBe('test-popover');
      });

      it('sets aria-labelledby when title is provided', () => {
        popover = createPopover({
          content: 'Test',
          target,
          title: 'My Title',
          id: 'test-popover',
        });

        expect(popover.element.getAttribute('aria-labelledby')).toBe('test-popover-title');
      });

      it('makes target focusable if needed', () => {
        const div = document.createElement('div');
        div.textContent = 'Not focusable';
        document.body.appendChild(div);

        popover = createPopover({
          content: 'Test',
          target: div,
        });

        expect(div.hasAttribute('tabindex')).toBe(true);

        popover.destroy();
        div.remove();
      });

      it('does not override button tabindex', () => {
        // Button is naturally focusable
        popover = createPopover({
          content: 'Test',
          target,
        });

        expect(target.hasAttribute('tabindex')).toBe(false);
      });

      it('close button has aria-label', () => {
        popover = createPopover({
          content: 'Test',
          target,
          title: 'Title',
        });

        const closeBtn = popover.element.querySelector('.dos-popover__close');
        expect(closeBtn?.getAttribute('aria-label')).toBe('Close popover');
      });

      it('arrow has aria-hidden="true"', () => {
        popover = createPopover({
          content: 'Test',
          target,
          arrow: true,
        });

        const arrow = popover.element.querySelector('.dos-popover__arrow');
        expect(arrow?.getAttribute('aria-hidden')).toBe('true');
      });
    });

    describe('edge cases', () => {
      it('handles empty string content', () => {
        popover = createPopover({
          content: '',
          target,
        });

        const contentEl = popover.element.querySelector('.dos-popover__content');
        expect(contentEl?.textContent).toBe('');
      });

      it('does not open twice when already open', () => {
        const onOpen = vi.fn();
        popover = createPopover({
          content: 'Test',
          target,
          onOpen,
        });

        popover.open();
        popover.open();

        expect(onOpen).toHaveBeenCalledTimes(1);
      });

      it('does not close twice when already closed', () => {
        const onClose = vi.fn();
        popover = createPopover({
          content: 'Test',
          target,
          onClose,
        });

        popover.close();

        expect(onClose).not.toHaveBeenCalled();
      });

      it('closes header close button', () => {
        popover = createPopover({
          content: 'Test',
          target,
          title: 'Title',
        });

        popover.open();
        expect(popover.isOpen()).toBe(true);

        const closeBtn = popover.element.querySelector('.dos-popover__close') as HTMLElement;
        closeBtn?.click();

        expect(popover.isOpen()).toBe(false);
      });
    });
  });
});
