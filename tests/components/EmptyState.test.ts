/**
 * @file EmptyState component tests
 * @description Comprehensive tests for the DOS-style EmptyState component
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createEmptyState, getPresetIcon, getPresetIconNames } from '../../src/components/EmptyState';

describe('EmptyState', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('renders an empty state element', () => {
      const emptyState = createEmptyState({ title: 'No data' });
      expect(emptyState.element).toBeInstanceOf(HTMLElement);
      expect(emptyState.element.classList.contains('dos-empty-state')).toBe(true);
    });

    it('renders with title', () => {
      const emptyState = createEmptyState({ title: 'No files found' });
      const title = emptyState.element.querySelector('.dos-empty-state__title');
      expect(title?.textContent).toBe('No files found');
    });

    it('renders with description', () => {
      const emptyState = createEmptyState({
        title: 'No data',
        description: 'Try adjusting your filters.'
      });
      const desc = emptyState.element.querySelector('.dos-empty-state__description');
      expect(desc?.textContent).toBe('Try adjusting your filters.');
    });

    it('renders without description when not provided', () => {
      const emptyState = createEmptyState({ title: 'No data' });
      const desc = emptyState.element.querySelector('.dos-empty-state__description');
      expect(desc).toBeNull();
    });

    it('renders with custom id', () => {
      const emptyState = createEmptyState({ title: 'No data', id: 'empty-1' });
      expect(emptyState.element.id).toBe('empty-1');
    });

    it('renders with custom className', () => {
      const emptyState = createEmptyState({ title: 'No data', className: 'custom-empty' });
      expect(emptyState.element.classList.contains('custom-empty')).toBe(true);
    });
  });

  describe('sizes', () => {
    it('renders with medium size by default', () => {
      const emptyState = createEmptyState({ title: 'No data' });
      expect(emptyState.element.classList.contains('dos-empty-state--medium')).toBe(true);
    });

    it('renders with small size', () => {
      const emptyState = createEmptyState({ title: 'No data', size: 'small' });
      expect(emptyState.element.classList.contains('dos-empty-state--small')).toBe(true);
    });

    it('renders with large size', () => {
      const emptyState = createEmptyState({ title: 'No data', size: 'large' });
      expect(emptyState.element.classList.contains('dos-empty-state--large')).toBe(true);
    });
  });

  describe('icons', () => {
    it('renders with preset folder icon', () => {
      const emptyState = createEmptyState({ title: 'No files', icon: 'folder' });
      const icon = emptyState.element.querySelector('.dos-empty-state__icon');
      expect(icon).not.toBeNull();
      expect(icon?.textContent).toContain('/');
    });

    it('renders with preset search icon', () => {
      const emptyState = createEmptyState({ title: 'No results', icon: 'search' });
      const icon = emptyState.element.querySelector('.dos-empty-state__icon');
      expect(icon).not.toBeNull();
    });

    it('renders with preset error icon', () => {
      const emptyState = createEmptyState({ title: 'Error', icon: 'error' });
      const icon = emptyState.element.querySelector('.dos-empty-state__icon');
      expect(icon).not.toBeNull();
      expect(icon?.textContent).toContain('X');
    });

    it('renders with preset data icon', () => {
      const emptyState = createEmptyState({ title: 'No data', icon: 'data' });
      const icon = emptyState.element.querySelector('.dos-empty-state__icon');
      expect(icon).not.toBeNull();
    });

    it('renders with preset file icon', () => {
      const emptyState = createEmptyState({ title: 'No file', icon: 'file' });
      const icon = emptyState.element.querySelector('.dos-empty-state__icon');
      expect(icon).not.toBeNull();
      expect(icon?.textContent).toContain('?');
    });

    it('renders with custom ASCII art string', () => {
      const customArt = `
  [X]
 /   \\
`;
      const emptyState = createEmptyState({ title: 'Custom', icon: customArt });
      const icon = emptyState.element.querySelector('.dos-empty-state__icon');
      expect(icon?.textContent).toContain('[X]');
    });

    it('renders with custom HTML element icon', () => {
      const customIcon = document.createElement('div');
      customIcon.className = 'custom-icon';
      customIcon.textContent = '★★★';
      
      const emptyState = createEmptyState({ title: 'Custom', icon: customIcon });
      const icon = emptyState.element.querySelector('.dos-empty-state__icon');
      expect(icon?.querySelector('.custom-icon')).not.toBeNull();
    });

    it('icon is hidden from screen readers', () => {
      const emptyState = createEmptyState({ title: 'No data', icon: 'folder' });
      const icon = emptyState.element.querySelector('.dos-empty-state__icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders without icon when not provided', () => {
      const emptyState = createEmptyState({ title: 'No data' });
      const icon = emptyState.element.querySelector('.dos-empty-state__icon');
      expect(icon).toBeNull();
    });
  });

  describe('action', () => {
    it('renders with action button', () => {
      const button = document.createElement('button');
      button.textContent = '[ Try Again ]';
      
      const emptyState = createEmptyState({
        title: 'Error',
        action: button
      });
      
      const actionContainer = emptyState.element.querySelector('.dos-empty-state__action');
      expect(actionContainer).not.toBeNull();
      expect(actionContainer?.querySelector('button')).not.toBeNull();
    });

    it('renders without action when not provided', () => {
      const emptyState = createEmptyState({ title: 'No data' });
      const actionContainer = emptyState.element.querySelector('.dos-empty-state__action');
      expect(actionContainer).toBeNull();
    });

    it('renders action after description', () => {
      const button = document.createElement('button');
      button.textContent = 'Action';
      
      const emptyState = createEmptyState({
        title: 'Title',
        description: 'Description',
        action: button
      });
      
      const children = Array.from(emptyState.element.children);
      const descIndex = children.findIndex(c => c.classList.contains('dos-empty-state__description'));
      const actionIndex = children.findIndex(c => c.classList.contains('dos-empty-state__action'));
      
      expect(actionIndex).toBeGreaterThan(descIndex);
    });
  });

  describe('dynamic mode', () => {
    it('adds role="status" when dynamic', () => {
      const emptyState = createEmptyState({ title: 'No data', dynamic: true });
      expect(emptyState.element.getAttribute('role')).toBe('status');
    });

    it('adds aria-live when dynamic', () => {
      const emptyState = createEmptyState({ title: 'No data', dynamic: true });
      expect(emptyState.element.getAttribute('aria-live')).toBe('polite');
    });

    it('adds dynamic class when dynamic', () => {
      const emptyState = createEmptyState({ title: 'No data', dynamic: true });
      expect(emptyState.element.classList.contains('dos-empty-state--dynamic')).toBe(true);
    });

    it('does not add role when not dynamic', () => {
      const emptyState = createEmptyState({ title: 'No data', dynamic: false });
      expect(emptyState.element.getAttribute('role')).toBeNull();
    });
  });

  describe('accessibility', () => {
    it('sets custom aria-label', () => {
      const emptyState = createEmptyState({
        title: 'No data',
        'aria-label': 'Empty search results'
      });
      expect(emptyState.element.getAttribute('aria-label')).toBe('Empty search results');
    });

    it('action button is focusable', () => {
      const button = document.createElement('button');
      button.textContent = 'Action';
      
      const emptyState = createEmptyState({
        title: 'No data',
        action: button
      });
      container.appendChild(emptyState.element);
      
      emptyState.focusAction();
      expect(document.activeElement).toBe(button);
    });
  });

  describe('instance methods', () => {
    describe('setTitle / getTitle', () => {
      it('updates title', () => {
        const emptyState = createEmptyState({ title: 'Initial' });
        emptyState.setTitle('Updated');
        
        const title = emptyState.element.querySelector('.dos-empty-state__title');
        expect(title?.textContent).toBe('Updated');
        expect(emptyState.getTitle()).toBe('Updated');
      });
    });

    describe('setDescription / getDescription', () => {
      it('updates description', () => {
        const emptyState = createEmptyState({ title: 'Title', description: 'Initial' });
        emptyState.setDescription('Updated description');
        
        const desc = emptyState.element.querySelector('.dos-empty-state__description');
        expect(desc?.textContent).toBe('Updated description');
        expect(emptyState.getDescription()).toBe('Updated description');
      });

      it('adds description when previously absent', () => {
        const emptyState = createEmptyState({ title: 'Title' });
        emptyState.setDescription('New description');
        
        const desc = emptyState.element.querySelector('.dos-empty-state__description');
        expect(desc).not.toBeNull();
      });

      it('removes description when set to undefined', () => {
        const emptyState = createEmptyState({ title: 'Title', description: 'Initial' });
        emptyState.setDescription(undefined);
        
        const desc = emptyState.element.querySelector('.dos-empty-state__description');
        expect(desc).toBeNull();
        expect(emptyState.getDescription()).toBeUndefined();
      });
    });

    describe('setIcon', () => {
      it('updates icon to preset', () => {
        const emptyState = createEmptyState({ title: 'Title', icon: 'folder' });
        emptyState.setIcon('error');
        
        const icon = emptyState.element.querySelector('.dos-empty-state__icon');
        expect(icon?.textContent).toContain('X');
      });

      it('adds icon when previously absent', () => {
        const emptyState = createEmptyState({ title: 'Title' });
        emptyState.setIcon('search');
        
        const icon = emptyState.element.querySelector('.dos-empty-state__icon');
        expect(icon).not.toBeNull();
      });

      it('removes icon when set to undefined', () => {
        const emptyState = createEmptyState({ title: 'Title', icon: 'folder' });
        emptyState.setIcon(undefined);
        
        const icon = emptyState.element.querySelector('.dos-empty-state__icon');
        expect(icon).toBeNull();
      });

      it('icon is inserted at the beginning', () => {
        const emptyState = createEmptyState({ title: 'Title' });
        emptyState.setIcon('folder');
        
        const firstChild = emptyState.element.firstElementChild;
        expect(firstChild?.classList.contains('dos-empty-state__icon')).toBe(true);
      });
    });

    describe('setAction / getAction', () => {
      it('updates action', () => {
        const button1 = document.createElement('button');
        button1.textContent = 'Action 1';
        
        const emptyState = createEmptyState({ title: 'Title', action: button1 });
        
        const button2 = document.createElement('button');
        button2.textContent = 'Action 2';
        emptyState.setAction(button2);
        
        const actionContainer = emptyState.element.querySelector('.dos-empty-state__action');
        expect(actionContainer?.querySelector('button')?.textContent).toBe('Action 2');
        expect(emptyState.getAction()).toBe(button2);
      });

      it('adds action when previously absent', () => {
        const emptyState = createEmptyState({ title: 'Title' });
        
        const button = document.createElement('button');
        button.textContent = 'New Action';
        emptyState.setAction(button);
        
        const actionContainer = emptyState.element.querySelector('.dos-empty-state__action');
        expect(actionContainer).not.toBeNull();
      });

      it('removes action when set to undefined', () => {
        const button = document.createElement('button');
        button.textContent = 'Action';
        
        const emptyState = createEmptyState({ title: 'Title', action: button });
        emptyState.setAction(undefined);
        
        const actionContainer = emptyState.element.querySelector('.dos-empty-state__action');
        expect(actionContainer).toBeNull();
        expect(emptyState.getAction()).toBeNull();
      });
    });

    describe('setSize / getSize', () => {
      it('updates size', () => {
        const emptyState = createEmptyState({ title: 'Title', size: 'small' });
        emptyState.setSize('large');
        
        expect(emptyState.element.classList.contains('dos-empty-state--large')).toBe(true);
        expect(emptyState.element.classList.contains('dos-empty-state--small')).toBe(false);
        expect(emptyState.getSize()).toBe('large');
      });
    });

    describe('focusAction', () => {
      it('focuses the action button', () => {
        const button = document.createElement('button');
        button.textContent = 'Action';
        
        const emptyState = createEmptyState({ title: 'Title', action: button });
        container.appendChild(emptyState.element);
        
        emptyState.focusAction();
        expect(document.activeElement).toBe(button);
      });

      it('focuses first focusable child of action', () => {
        const div = document.createElement('div');
        const button = document.createElement('button');
        button.textContent = 'Nested Button';
        div.appendChild(button);
        
        const emptyState = createEmptyState({ title: 'Title', action: div });
        container.appendChild(emptyState.element);
        
        emptyState.focusAction();
        expect(document.activeElement).toBe(button);
      });

      it('does not throw when no action', () => {
        const emptyState = createEmptyState({ title: 'Title' });
        expect(() => emptyState.focusAction()).not.toThrow();
      });
    });

    describe('destroy', () => {
      it('clears element content', () => {
        const emptyState = createEmptyState({
          title: 'Title',
          description: 'Desc',
          icon: 'folder'
        });
        
        emptyState.destroy();
        expect(emptyState.element.innerHTML).toBe('');
      });
    });
  });

  describe('getPresetIcon utility', () => {
    it('returns folder icon', () => {
      const icon = getPresetIcon('folder');
      expect(icon).toBeDefined();
      expect(icon).toContain('/');
    });

    it('returns search icon', () => {
      const icon = getPresetIcon('search');
      expect(icon).toBeDefined();
    });

    it('returns error icon', () => {
      const icon = getPresetIcon('error');
      expect(icon).toBeDefined();
      expect(icon).toContain('X');
    });

    it('returns data icon', () => {
      const icon = getPresetIcon('data');
      expect(icon).toBeDefined();
    });

    it('returns file icon', () => {
      const icon = getPresetIcon('file');
      expect(icon).toBeDefined();
    });
  });

  describe('getPresetIconNames utility', () => {
    it('returns all preset names', () => {
      const names = getPresetIconNames();
      expect(names).toContain('folder');
      expect(names).toContain('search');
      expect(names).toContain('error');
      expect(names).toContain('data');
      expect(names).toContain('file');
      expect(names.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('complete scenarios', () => {
    it('renders a no search results state', () => {
      const button = document.createElement('button');
      button.textContent = '[ Clear Filters ]';
      
      const emptyState = createEmptyState({
        title: 'No results found',
        description: 'Try adjusting your search terms or clearing filters.',
        icon: 'search',
        action: button,
        size: 'large'
      });
      
      container.appendChild(emptyState.element);
      
      expect(emptyState.element.querySelector('.dos-empty-state__icon')).not.toBeNull();
      expect(emptyState.element.querySelector('.dos-empty-state__title')?.textContent).toBe('No results found');
      expect(emptyState.element.querySelector('.dos-empty-state__description')).not.toBeNull();
      expect(emptyState.element.querySelector('button')).not.toBeNull();
    });

    it('renders an error state', () => {
      const emptyState = createEmptyState({
        title: 'Something went wrong',
        description: 'Unable to load data. Please try again later.',
        icon: 'error',
        dynamic: true
      });
      
      expect(emptyState.element.getAttribute('role')).toBe('status');
      expect(emptyState.element.querySelector('.dos-empty-state__icon')?.textContent).toContain('X');
    });

    it('renders a minimal empty state', () => {
      const emptyState = createEmptyState({
        title: 'Nothing here',
        size: 'small'
      });
      
      expect(emptyState.element.classList.contains('dos-empty-state--small')).toBe(true);
      expect(emptyState.element.querySelector('.dos-empty-state__icon')).toBeNull();
      expect(emptyState.element.querySelector('.dos-empty-state__description')).toBeNull();
    });
  });
});
