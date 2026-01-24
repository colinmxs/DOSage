/**
 * Tooltip Component Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTooltip } from '../../src/components/Tooltip';

describe('Tooltip', () => {
  let target: HTMLElement;
  let tooltip: ReturnType<typeof createTooltip>;

  beforeEach(() => {
    // Create a target element
    target = document.createElement('button');
    target.textContent = 'Hover me';
    document.body.appendChild(target);
  });

  afterEach(() => {
    // Clean up
    if (tooltip) {
      tooltip.destroy();
    }
    target.remove();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('createTooltip', () => {
    describe('rendering', () => {
      it('creates a tooltip element', () => {
        tooltip = createTooltip({
          content: 'Test tooltip',
          target,
        });

        expect(tooltip.element).toBeDefined();
        expect(tooltip.element.classList.contains('dos-tooltip')).toBe(true);
      });

      it('renders content', () => {
        tooltip = createTooltip({
          content: 'Test content',
          target,
        });

        expect(tooltip.element.textContent).toContain('Test content');
      });

      it('generates unique ID', () => {
        const tooltip1 = createTooltip({ content: 'Tooltip 1', target });
        const target2 = document.createElement('button');
        document.body.appendChild(target2);
        const tooltip2 = createTooltip({ content: 'Tooltip 2', target: target2 });

        expect(tooltip1.element.id).not.toBe(tooltip2.element.id);

        tooltip1.destroy();
        tooltip2.destroy();
        target2.remove();
      });

      it('uses custom ID if provided', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
          id: 'my-custom-tooltip',
        });

        expect(tooltip.element.id).toBe('my-custom-tooltip');
      });

      it('applies custom className', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
          className: 'my-custom-class',
        });

        expect(tooltip.element.classList.contains('my-custom-class')).toBe(true);
      });

      it('renders arrow by default', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
        });

        const arrow = tooltip.element.querySelector('.dos-tooltip__arrow');
        expect(arrow).not.toBeNull();
      });

      it('does not render arrow when disabled', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
          arrow: false,
        });

        const arrow = tooltip.element.querySelector('.dos-tooltip__arrow');
        expect(arrow).toBeNull();
      });

      it('starts hidden', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
        });

        expect(tooltip.element.classList.contains('dos-tooltip--visible')).toBe(false);
        expect(tooltip.isVisible()).toBe(false);
      });

      it('appends to document body', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
        });

        expect(document.body.contains(tooltip.element)).toBe(true);
      });
    });

    describe('positions', () => {
      it('applies top position by default', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
        });

        expect(tooltip.element.classList.contains('dos-tooltip--top')).toBe(true);
      });

      it('applies top position', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
          position: 'top',
        });

        expect(tooltip.element.classList.contains('dos-tooltip--top')).toBe(true);
      });

      it('applies bottom position', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
          position: 'bottom',
        });

        expect(tooltip.element.classList.contains('dos-tooltip--bottom')).toBe(true);
      });

      it('applies left position', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
          position: 'left',
        });

        expect(tooltip.element.classList.contains('dos-tooltip--left')).toBe(true);
      });

      it('applies right position', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
          position: 'right',
        });

        expect(tooltip.element.classList.contains('dos-tooltip--right')).toBe(true);
      });
    });

    describe('triggers', () => {
      it('shows on hover with hover trigger', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          trigger: 'hover',
          delay: 0,
        });

        target.dispatchEvent(new MouseEvent('mouseenter'));
        vi.runAllTimers();

        expect(tooltip.isVisible()).toBe(true);
        vi.useRealTimers();
      });

      it('hides on mouse leave with hover trigger', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          trigger: 'hover',
          delay: 0,
        });

        target.dispatchEvent(new MouseEvent('mouseenter'));
        vi.runAllTimers();
        target.dispatchEvent(new MouseEvent('mouseleave'));

        expect(tooltip.isVisible()).toBe(false);
        vi.useRealTimers();
      });

      it('shows on focus with focus trigger', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          trigger: 'focus',
          delay: 0,
        });

        target.dispatchEvent(new FocusEvent('focus'));
        vi.runAllTimers();

        expect(tooltip.isVisible()).toBe(true);
        vi.useRealTimers();
      });

      it('hides on blur with focus trigger', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          trigger: 'focus',
          delay: 0,
        });

        target.dispatchEvent(new FocusEvent('focus'));
        vi.runAllTimers();
        target.dispatchEvent(new FocusEvent('blur'));

        expect(tooltip.isVisible()).toBe(false);
        vi.useRealTimers();
      });

      it('shows on both hover and focus with both trigger', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          trigger: 'both',
          delay: 0,
        });

        // Test hover
        target.dispatchEvent(new MouseEvent('mouseenter'));
        vi.runAllTimers();
        expect(tooltip.isVisible()).toBe(true);

        target.dispatchEvent(new MouseEvent('mouseleave'));
        expect(tooltip.isVisible()).toBe(false);

        // Test focus
        target.dispatchEvent(new FocusEvent('focus'));
        vi.runAllTimers();
        expect(tooltip.isVisible()).toBe(true);

        vi.useRealTimers();
      });

      it('does not show on hover when trigger is focus only', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          trigger: 'focus',
          delay: 0,
        });

        target.dispatchEvent(new MouseEvent('mouseenter'));
        vi.runAllTimers();

        expect(tooltip.isVisible()).toBe(false);
        vi.useRealTimers();
      });

      it('does not show on focus when trigger is hover only', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          trigger: 'hover',
          delay: 0,
        });

        target.dispatchEvent(new FocusEvent('focus'));
        vi.runAllTimers();

        expect(tooltip.isVisible()).toBe(false);
        vi.useRealTimers();
      });
    });

    describe('delay', () => {
      it('applies default delay', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          trigger: 'hover',
        });

        target.dispatchEvent(new MouseEvent('mouseenter'));
        vi.advanceTimersByTime(100);

        expect(tooltip.isVisible()).toBe(false);

        vi.advanceTimersByTime(100);
        expect(tooltip.isVisible()).toBe(true);

        vi.useRealTimers();
      });

      it('applies custom delay', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          trigger: 'hover',
          delay: 500,
        });

        target.dispatchEvent(new MouseEvent('mouseenter'));
        vi.advanceTimersByTime(400);

        expect(tooltip.isVisible()).toBe(false);

        vi.advanceTimersByTime(100);
        expect(tooltip.isVisible()).toBe(true);

        vi.useRealTimers();
      });

      it('cancels show on mouse leave during delay', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          trigger: 'hover',
          delay: 200,
        });

        target.dispatchEvent(new MouseEvent('mouseenter'));
        vi.advanceTimersByTime(100);
        target.dispatchEvent(new MouseEvent('mouseleave'));
        vi.advanceTimersByTime(200);

        expect(tooltip.isVisible()).toBe(false);
        vi.useRealTimers();
      });
    });

    describe('keyboard', () => {
      it('hides on Escape key', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          trigger: 'hover',
          delay: 0,
        });

        target.dispatchEvent(new MouseEvent('mouseenter'));
        vi.runAllTimers();
        expect(tooltip.isVisible()).toBe(true);

        target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(tooltip.isVisible()).toBe(false);

        vi.useRealTimers();
      });

      it('does not hide on other keys', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          trigger: 'hover',
          delay: 0,
        });

        target.dispatchEvent(new MouseEvent('mouseenter'));
        vi.runAllTimers();

        target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(tooltip.isVisible()).toBe(true);

        vi.useRealTimers();
      });
    });

    describe('instance methods', () => {
      it('show() displays tooltip', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          delay: 0,
        });

        tooltip.show();
        vi.runAllTimers();

        expect(tooltip.isVisible()).toBe(true);
        expect(tooltip.element.classList.contains('dos-tooltip--visible')).toBe(true);
        vi.useRealTimers();
      });

      it('hide() hides tooltip', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          delay: 0,
        });

        tooltip.show();
        vi.runAllTimers();
        tooltip.hide();

        expect(tooltip.isVisible()).toBe(false);
        expect(tooltip.element.classList.contains('dos-tooltip--visible')).toBe(false);
        vi.useRealTimers();
      });

      it('setContent() updates content', () => {
        tooltip = createTooltip({
          content: 'Initial',
          target,
        });

        tooltip.setContent('Updated');

        const content = tooltip.element.querySelector('.dos-tooltip__content');
        expect(content?.textContent).toBe('Updated');
      });

      it('setPosition() updates position', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
          position: 'top',
        });

        tooltip.setPosition('bottom');

        expect(tooltip.element.classList.contains('dos-tooltip--bottom')).toBe(true);
        expect(tooltip.element.classList.contains('dos-tooltip--top')).toBe(false);
      });

      it('isVisible() returns visibility state', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          delay: 0,
        });

        expect(tooltip.isVisible()).toBe(false);

        tooltip.show();
        vi.runAllTimers();
        expect(tooltip.isVisible()).toBe(true);

        tooltip.hide();
        expect(tooltip.isVisible()).toBe(false);
        vi.useRealTimers();
      });

      it('destroy() removes element from DOM', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
        });

        const element = tooltip.element;
        tooltip.destroy();

        expect(document.body.contains(element)).toBe(false);
      });

      it('destroy() removes aria-describedby from target', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
        });

        expect(target.hasAttribute('aria-describedby')).toBe(true);

        tooltip.destroy();

        expect(target.hasAttribute('aria-describedby')).toBe(false);
      });
    });

    describe('accessibility', () => {
      it('has role="tooltip"', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
        });

        expect(tooltip.element.getAttribute('role')).toBe('tooltip');
      });

      it('sets aria-describedby on target', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
          id: 'test-tooltip',
        });

        expect(target.getAttribute('aria-describedby')).toBe('test-tooltip');
      });

      it('makes target focusable if needed', () => {
        const div = document.createElement('div');
        div.textContent = 'Not focusable';
        document.body.appendChild(div);

        tooltip = createTooltip({
          content: 'Test',
          target: div,
        });

        expect(div.hasAttribute('tabindex')).toBe(true);

        tooltip.destroy();
        div.remove();
      });

      it('does not override existing tabindex', () => {
        target.setAttribute('tabindex', '5');

        tooltip = createTooltip({
          content: 'Test',
          target,
        });

        expect(target.getAttribute('tabindex')).toBe('5');
      });

      it('arrow has aria-hidden="true"', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
          arrow: true,
        });

        const arrow = tooltip.element.querySelector('.dos-tooltip__arrow');
        expect(arrow?.getAttribute('aria-hidden')).toBe('true');
      });
    });

    describe('edge cases', () => {
      it('handles empty content', () => {
        tooltip = createTooltip({
          content: '',
          target,
        });

        const content = tooltip.element.querySelector('.dos-tooltip__content');
        expect(content?.textContent).toBe('');
      });

      it('handles long content', () => {
        const longContent = 'This is a very long tooltip content that should wrap properly within the max-width constraint of the tooltip element.';
        tooltip = createTooltip({
          content: longContent,
          target,
        });

        expect(tooltip.element.textContent).toContain(longContent);
      });

      it('does not show twice when already visible', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          delay: 0,
        });

        tooltip.show();
        vi.runAllTimers();
        tooltip.show(); // Should not throw or cause issues
        vi.runAllTimers();

        expect(tooltip.isVisible()).toBe(true);
        vi.useRealTimers();
      });

      it('does not hide twice when already hidden', () => {
        tooltip = createTooltip({
          content: 'Test',
          target,
        });

        tooltip.hide(); // Should not throw
        tooltip.hide(); // Should not throw

        expect(tooltip.isVisible()).toBe(false);
      });

      it('clears timeouts on destroy', () => {
        vi.useFakeTimers();
        tooltip = createTooltip({
          content: 'Test',
          target,
          delay: 200,
        });

        target.dispatchEvent(new MouseEvent('mouseenter'));
        tooltip.destroy();
        vi.runAllTimers();

        // Should not throw or cause issues
        vi.useRealTimers();
      });
    });
  });
});
