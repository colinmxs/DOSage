/**
 * ButtonGroup Component Tests
 */

import { describe, it, expect, afterEach, vi as _vi } from 'vitest';
import {
  createButtonGroup,
  addButtonsToGroup,
  getGroupButtons,
} from '../../src/components/ButtonGroup';
import { createButton } from '../../src/components/Button';

describe('ButtonGroup', () => {
  let group: HTMLElement | null = null;

  afterEach(() => {
    if (group && group.parentNode) {
      group.remove();
    }
    group = null;
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      group = createButtonGroup();

      expect(group).toBeInstanceOf(HTMLElement);
      expect(group.tagName).toBe('DIV');
      expect(group.classList.contains('dos-button-group')).toBe(true);
    });

    it('renders horizontal orientation by default', () => {
      group = createButtonGroup();

      expect(group.classList.contains('dos-button-group--horizontal')).toBe(true);
    });

    it('renders separated mode by default', () => {
      group = createButtonGroup();

      expect(group.classList.contains('dos-button-group--separated')).toBe(true);
    });

    it('applies custom className', () => {
      group = createButtonGroup({ className: 'my-group' });

      expect(group.classList.contains('dos-button-group')).toBe(true);
      expect(group.classList.contains('my-group')).toBe(true);
    });

    it('applies custom id', () => {
      group = createButtonGroup({ id: 'my-group' });

      expect(group.id).toBe('my-group');
    });
  });

  describe('orientation', () => {
    it('applies horizontal orientation', () => {
      group = createButtonGroup({ orientation: 'horizontal' });

      expect(group.classList.contains('dos-button-group--horizontal')).toBe(true);
      expect(group.classList.contains('dos-button-group--vertical')).toBe(false);
    });

    it('applies vertical orientation', () => {
      group = createButtonGroup({ orientation: 'vertical' });

      expect(group.classList.contains('dos-button-group--vertical')).toBe(true);
      expect(group.classList.contains('dos-button-group--horizontal')).toBe(false);
    });
  });

  describe('connection modes', () => {
    it('applies separated mode by default', () => {
      group = createButtonGroup();

      expect(group.classList.contains('dos-button-group--separated')).toBe(true);
      expect(group.classList.contains('dos-button-group--connected')).toBe(false);
    });

    it('applies connected mode when specified', () => {
      group = createButtonGroup({ connected: true });

      expect(group.classList.contains('dos-button-group--connected')).toBe(true);
      expect(group.classList.contains('dos-button-group--separated')).toBe(false);
    });
  });

  describe('addButtonsToGroup', () => {
    it('adds buttons to the group', () => {
      group = createButtonGroup();
      const buttons = [
        createButton({ label: 'Button 1' }),
        createButton({ label: 'Button 2' }),
        createButton({ label: 'Button 3' }),
      ];

      addButtonsToGroup(group, buttons);

      expect(group.children.length).toBe(3);
      expect(group.children[0]).toBe(buttons[0]);
      expect(group.children[1]).toBe(buttons[1]);
      expect(group.children[2]).toBe(buttons[2]);
    });
  });

  describe('getGroupButtons', () => {
    it('returns all buttons in the group', () => {
      group = createButtonGroup();
      const buttons = [
        createButton({ label: 'Button 1' }),
        createButton({ label: 'Button 2' }),
      ];

      addButtonsToGroup(group, buttons);

      const retrieved = getGroupButtons(group);
      expect(retrieved.length).toBe(2);
      expect(retrieved[0]).toBe(buttons[0]);
      expect(retrieved[1]).toBe(buttons[1]);
    });

    it('returns empty array for empty group', () => {
      group = createButtonGroup();

      const retrieved = getGroupButtons(group);
      expect(retrieved.length).toBe(0);
    });
  });

  describe('keyboard navigation', () => {
    it('supports arrow navigation in horizontal connected group', () => {
      group = createButtonGroup({ orientation: 'horizontal', connected: true });
      const buttons = [
        createButton({ label: 'Button 1' }),
        createButton({ label: 'Button 2' }),
        createButton({ label: 'Button 3' }),
      ];

      addButtonsToGroup(group, buttons);
      document.body.appendChild(group);

      // Focus first button
      buttons[0].focus();

      // Press right arrow
      buttons[0].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );

      expect(document.activeElement).toBe(buttons[1]);

      // Clean up
      document.body.removeChild(group);
    });

    it('supports arrow navigation in vertical connected group', () => {
      group = createButtonGroup({ orientation: 'vertical', connected: true });
      const buttons = [
        createButton({ label: 'Button 1' }),
        createButton({ label: 'Button 2' }),
        createButton({ label: 'Button 3' }),
      ];

      addButtonsToGroup(group, buttons);
      document.body.appendChild(group);

      // Focus first button
      buttons[0].focus();

      // Press down arrow
      buttons[0].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
      );

      expect(document.activeElement).toBe(buttons[1]);

      // Clean up
      document.body.removeChild(group);
    });

    it('wraps navigation from last to first', () => {
      group = createButtonGroup({ connected: true });
      const buttons = [
        createButton({ label: 'Button 1' }),
        createButton({ label: 'Button 2' }),
      ];

      addButtonsToGroup(group, buttons);
      document.body.appendChild(group);

      // Focus last button
      buttons[1].focus();

      // Press right arrow
      buttons[1].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      );

      expect(document.activeElement).toBe(buttons[0]);

      // Clean up
      document.body.removeChild(group);
    });

    it('supports Home key to focus first button', () => {
      group = createButtonGroup({ connected: true });
      const buttons = [
        createButton({ label: 'Button 1' }),
        createButton({ label: 'Button 2' }),
        createButton({ label: 'Button 3' }),
      ];

      addButtonsToGroup(group, buttons);
      document.body.appendChild(group);

      // Focus last button
      buttons[2].focus();

      // Press Home
      buttons[2].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Home', bubbles: true })
      );

      expect(document.activeElement).toBe(buttons[0]);

      // Clean up
      document.body.removeChild(group);
    });

    it('supports End key to focus last button', () => {
      group = createButtonGroup({ connected: true });
      const buttons = [
        createButton({ label: 'Button 1' }),
        createButton({ label: 'Button 2' }),
        createButton({ label: 'Button 3' }),
      ];

      addButtonsToGroup(group, buttons);
      document.body.appendChild(group);

      // Focus first button
      buttons[0].focus();

      // Press End
      buttons[0].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'End', bubbles: true })
      );

      expect(document.activeElement).toBe(buttons[2]);

      // Clean up
      document.body.removeChild(group);
    });
  });

  describe('accessibility', () => {
    it('has role="group"', () => {
      group = createButtonGroup();

      expect(group.getAttribute('role')).toBe('group');
    });

    it('sets aria-label when provided', () => {
      group = createButtonGroup({ ariaLabel: 'File operations' });

      expect(group.getAttribute('aria-label')).toBe('File operations');
    });
  });
});
