/**
 * Badge Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createBadge } from '../../src/components/Badge';
import type { BadgeVariant } from '../../src/components/Badge';

// Helper to simulate click
function click(element: HTMLElement): void {
  element.click();
}

// Helper to simulate keydown
function pressKey(element: HTMLElement, key: string): void {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
}

describe('Badge', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      const badge = createBadge({ label: 'NEW' });
      expect(badge.element).toBeDefined();
      expect(badge.element.classList.contains('dos-badge')).toBe(true);
    });

    it('renders label in brackets', () => {
      const badge = createBadge({ label: 'NEW' });
      const labelEl = badge.element.querySelector('.dos-badge___label');
      expect(labelEl?.textContent).toBe('[NEW]');
    });

    it('renders with custom id', () => {
      const badge = createBadge({ label: 'NEW', id: 'my-badge' });
      expect(badge.element.id).toBe('my-badge');
    });

    it('renders with custom class name', () => {
      const badge = createBadge({ label: 'NEW', className: 'custom-class' });
      expect(badge.element.classList.contains('custom-class')).toBe(true);
    });

    it('has role status', () => {
      const badge = createBadge({ label: 'NEW' });
      expect(badge.element.getAttribute('role')).toBe('status');
    });

    it('renders with aria-label', () => {
      const badge = createBadge({ label: 'NEW', 'aria-label': 'New item badge' });
      expect(badge.element.getAttribute('aria-label')).toBe('New item badge');
    });

    it('renders icon when provided', () => {
      const badge = createBadge({ label: 'INFO', icon: '📌' });
      const iconEl = badge.element.querySelector('.dos-badge___icon');
      expect(iconEl).toBeTruthy();
      expect(iconEl?.textContent).toBe('📌');
      expect(iconEl?.getAttribute('aria-hidden')).toBe('true');
    });

    it('does not render icon when not provided', () => {
      const badge = createBadge({ label: 'NEW' });
      const iconEl = badge.element.querySelector('.dos-badge___icon');
      expect(iconEl).toBeNull();
    });
  });

  describe('variants', () => {
    const variants: BadgeVariant[] = ['default', 'primary', 'success', 'warning', 'error', 'info'];

    variants.forEach((variant) => {
      it(`renders ${variant} variant`, () => {
        const badge = createBadge({ label: 'TEST', variant });
        expect(badge.element.classList.contains(`dos-badge--${variant}`)).toBe(true);
      });
    });

    it('applies default variant when not specified', () => {
      const badge = createBadge({ label: 'TEST' });
      expect(badge.element.classList.contains('dos-badge--default')).toBe(true);
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      const badge = createBadge({ label: 'SMALL', size: 'small' });
      expect(badge.element.classList.contains('dos-badge--small')).toBe(true);
    });

    it('renders medium size', () => {
      const badge = createBadge({ label: 'MEDIUM', size: 'medium' });
      expect(badge.element.classList.contains('dos-badge--medium')).toBe(true);
    });

    it('applies medium size by default', () => {
      const badge = createBadge({ label: 'DEFAULT' });
      expect(badge.element.classList.contains('dos-badge--medium')).toBe(true);
    });
  });

  describe('removable', () => {
    it('shows remove button when removable is true', () => {
      const badge = createBadge({ label: 'NEW', removable: true });
      const removeBtn = badge.element.querySelector('.dos-badge___remove');
      expect(removeBtn).toBeTruthy();
      expect(removeBtn?.textContent).toBe('×');
    });

    it('does not show remove button by default', () => {
      const badge = createBadge({ label: 'NEW' });
      const removeBtn = badge.element.querySelector('.dos-badge___remove');
      expect(removeBtn).toBeNull();
    });

    it('applies removable class', () => {
      const badge = createBadge({ label: 'NEW', removable: true });
      expect(badge.element.classList.contains('dos-badge--removable')).toBe(true);
    });

    it('calls onRemove when remove button is clicked', () => {
      const onRemove = vi.fn();
      const badge = createBadge({ label: 'NEW', removable: true, onRemove });
      
      const removeBtn = badge.element.querySelector('.dos-badge___remove') as HTMLButtonElement;
      click(removeBtn);
      
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('calls onRemove when Enter is pressed on remove button', () => {
      const onRemove = vi.fn();
      const badge = createBadge({ label: 'NEW', removable: true, onRemove });
      
      const removeBtn = badge.element.querySelector('.dos-badge___remove') as HTMLButtonElement;
      pressKey(removeBtn, 'Enter');
      
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('calls onRemove when Space is pressed on remove button', () => {
      const onRemove = vi.fn();
      const badge = createBadge({ label: 'NEW', removable: true, onRemove });
      
      const removeBtn = badge.element.querySelector('.dos-badge___remove') as HTMLButtonElement;
      pressKey(removeBtn, ' ');
      
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('remove button has accessible label', () => {
      const badge = createBadge({ label: 'IMPORTANT', removable: true });
      const removeBtn = badge.element.querySelector('.dos-badge___remove');
      expect(removeBtn?.getAttribute('aria-label')).toBe('Remove IMPORTANT');
    });

    it('remove button is keyboard focusable', () => {
      const badge = createBadge({ label: 'NEW', removable: true });
      const removeBtn = badge.element.querySelector('.dos-badge___remove');
      expect(removeBtn?.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('instance methods', () => {
    it('setLabel updates the label', () => {
      const badge = createBadge({ label: 'OLD' });
      
      badge.setLabel('NEW');
      
      const labelEl = badge.element.querySelector('.dos-badge___label');
      expect(labelEl?.textContent).toBe('[NEW]');
    });

    it('getLabel returns the current label', () => {
      const badge = createBadge({ label: 'TEST' });
      expect(badge.getLabel()).toBe('TEST');
      
      badge.setLabel('UPDATED');
      expect(badge.getLabel()).toBe('UPDATED');
    });

    it('setLabel updates remove button aria-label', () => {
      const badge = createBadge({ label: 'OLD', removable: true });
      
      badge.setLabel('NEW');
      
      const removeBtn = badge.element.querySelector('.dos-badge___remove');
      expect(removeBtn?.getAttribute('aria-label')).toBe('Remove NEW');
    });

    it('setVariant updates the variant', () => {
      const badge = createBadge({ label: 'TEST', variant: 'default' });
      
      badge.setVariant('success');
      
      expect(badge.element.classList.contains('dos-badge--success')).toBe(true);
      expect(badge.element.classList.contains('dos-badge--default')).toBe(false);
    });

    it('getVariant returns the current variant', () => {
      const badge = createBadge({ label: 'TEST', variant: 'warning' });
      expect(badge.getVariant()).toBe('warning');
      
      badge.setVariant('error');
      expect(badge.getVariant()).toBe('error');
    });

    it('setIcon adds icon when not present', () => {
      const badge = createBadge({ label: 'TEST' });
      
      badge.setIcon('🔥');
      
      const iconEl = badge.element.querySelector('.dos-badge___icon');
      expect(iconEl?.textContent).toBe('🔥');
    });

    it('setIcon updates existing icon', () => {
      const badge = createBadge({ label: 'TEST', icon: '📌' });
      
      badge.setIcon('🔥');
      
      const iconEl = badge.element.querySelector('.dos-badge___icon');
      expect(iconEl?.textContent).toBe('🔥');
    });

    it('setIcon removes icon when undefined', () => {
      const badge = createBadge({ label: 'TEST', icon: '📌' });
      
      badge.setIcon(undefined);
      
      const iconEl = badge.element.querySelector('.dos-badge___icon');
      expect(iconEl).toBeNull();
    });

    it('setRemovable adds remove button', () => {
      const badge = createBadge({ label: 'TEST', removable: false });
      
      badge.setRemovable(true);
      
      const removeBtn = badge.element.querySelector('.dos-badge___remove');
      expect(removeBtn).toBeTruthy();
    });

    it('setRemovable removes remove button', () => {
      const badge = createBadge({ label: 'TEST', removable: true });
      
      badge.setRemovable(false);
      
      const removeBtn = badge.element.querySelector('.dos-badge___remove');
      expect(removeBtn).toBeNull();
    });

    it('destroy removes element from DOM', () => {
      const badge = createBadge({ label: 'TEST' });
      document.body.appendChild(badge.element);
      
      badge.destroy();
      
      expect(document.body.contains(badge.element)).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has role status', () => {
      const badge = createBadge({ label: 'NEW' });
      expect(badge.element.getAttribute('role')).toBe('status');
    });

    it('remove button is a button element', () => {
      const badge = createBadge({ label: 'NEW', removable: true });
      const removeBtn = badge.element.querySelector('.dos-badge___remove');
      expect(removeBtn?.tagName.toLowerCase()).toBe('button');
    });

    it('remove button has type button', () => {
      const badge = createBadge({ label: 'NEW', removable: true });
      const removeBtn = badge.element.querySelector('.dos-badge___remove') as HTMLButtonElement;
      expect(removeBtn?.type).toBe('button');
    });

    it('icon has aria-hidden', () => {
      const badge = createBadge({ label: 'NEW', icon: '📌' });
      const iconEl = badge.element.querySelector('.dos-badge___icon');
      expect(iconEl?.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
