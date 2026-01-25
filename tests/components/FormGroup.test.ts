import { describe, it, expect, vi as _vi } from 'vitest';
import { createFormGroup } from '../../src/components/FormGroup';

describe('FormGroup', () => {
  describe('rendering', () => {
    it('creates a fieldset element', () => {
      const group = createFormGroup({});

      expect(group.tagName).toBe('FIELDSET');
      expect(group.classList.contains('dos-form-group')).toBe(true);
    });

    it('renders legend when provided', () => {
      const group = createFormGroup({
        legend: 'User Information',
      });

      const legend = group.querySelector('legend');
      expect(legend).toBeTruthy();
      expect(legend?.textContent).toContain('User Information');
    });

    it('renders legend with box-drawing characters', () => {
      const group = createFormGroup({
        legend: 'Settings',
      });

      const startChar = group.querySelector('.dos-form-group__legend-start');
      const endChar = group.querySelector('.dos-form-group__legend-end');

      expect(startChar?.textContent).toBe('┤');
      expect(endChar?.textContent).toBe('├');
    });

    it('does not render legend when not provided', () => {
      const group = createFormGroup({});

      const legend = group.querySelector('legend');
      expect(legend).toBeNull();
      expect(group.classList.contains('dos-form-group--no-legend')).toBe(true);
    });

    it('renders required indicator', () => {
      const group = createFormGroup({
        legend: 'Required Group',
        required: true,
      });

      const required = group.querySelector('.dos-form-group__required');
      expect(required).toBeTruthy();
      expect(required?.textContent).toBe('*');
      expect(required?.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders description text', () => {
      const group = createFormGroup({
        legend: 'Settings',
        description: 'Configure your preferences below.',
      });

      const description = group.querySelector('.dos-form-group__description');
      expect(description).toBeTruthy();
      expect(description?.textContent).toBe('Configure your preferences below.');
    });

    it('creates content container', () => {
      const group = createFormGroup({});

      const content = group.querySelector('.dos-form-group__content');
      expect(content).toBeTruthy();
    });

    it('uses provided id', () => {
      const group = createFormGroup({
        id: 'custom-group-id',
      });

      expect(group.id).toBe('custom-group-id');
    });

    it('applies custom className', () => {
      const group = createFormGroup({
        className: 'custom-class',
      });

      expect(group.classList.contains('custom-class')).toBe(true);
    });
  });

  describe('children', () => {
    it('renders children in content area', () => {
      const child1 = document.createElement('div');
      child1.textContent = 'Child 1';
      child1.className = 'test-child';

      const child2 = document.createElement('div');
      child2.textContent = 'Child 2';
      child2.className = 'test-child';

      const group = createFormGroup({
        children: [child1, child2],
      });

      const children = group.querySelectorAll('.test-child');
      expect(children.length).toBe(2);
    });

    it('appendContent adds element to content area', () => {
      const group = createFormGroup({});

      const newChild = document.createElement('input');
      newChild.type = 'text';
      newChild.className = 'appended-input';

      group.appendContent(newChild);

      const appended = group.querySelector('.appended-input');
      expect(appended).toBeTruthy();
    });

    it('appendContent inserts before error element', () => {
      const group = createFormGroup({
        error: 'Some error',
      });

      const newChild = document.createElement('input');
      newChild.className = 'new-input';

      group.appendContent(newChild);

      const content = group.getContent();
      const lastChild = content.lastElementChild;
      expect(lastChild?.classList.contains('dos-form-group__error')).toBe(true);
    });

    it('clearContent removes children but keeps description and error', () => {
      const child = document.createElement('div');
      child.className = 'removable-child';

      const group = createFormGroup({
        description: 'Keep this',
        error: 'Keep this too',
        children: [child],
      });

      expect(group.querySelector('.removable-child')).toBeTruthy();

      group.clearContent();

      expect(group.querySelector('.removable-child')).toBeNull();
      expect(group.querySelector('.dos-form-group__description')).toBeTruthy();
      expect(group.querySelector('.dos-form-group__error')).toBeTruthy();
    });

    it('getContent returns the content container', () => {
      const group = createFormGroup({});

      const content = group.getContent();
      expect(content.classList.contains('dos-form-group__content')).toBe(true);
    });
  });

  describe('error state', () => {
    it('renders error message when provided', () => {
      const group = createFormGroup({
        error: 'This field has an error',
      });

      expect(group.classList.contains('dos-form-group--error')).toBe(true);

      const errorElement = group.querySelector('.dos-form-group__error');
      expect(errorElement).toBeTruthy();
      expect(errorElement?.textContent).toContain('This field has an error');
    });

    it('error element has icon', () => {
      const group = createFormGroup({
        error: 'Error message',
      });

      const icon = group.querySelector('.dos-form-group__error-icon');
      expect(icon).toBeTruthy();
      expect(icon?.textContent).toBe('[!]');
    });

    it('setError adds error message', () => {
      const group = createFormGroup({});

      group.setError('New error');

      expect(group.classList.contains('dos-form-group--error')).toBe(true);

      const errorElement = group.querySelector('.dos-form-group__error');
      expect(errorElement?.textContent).toContain('New error');
    });

    it('setError removes error when undefined', () => {
      const group = createFormGroup({
        error: 'Initial error',
      });

      group.setError(undefined);

      expect(group.classList.contains('dos-form-group--error')).toBe(false);

      const errorElement = group.querySelector('.dos-form-group__error');
      expect(errorElement).toBeNull();
    });

    it('setError updates existing error', () => {
      const group = createFormGroup({
        error: 'Old error',
      });

      group.setError('Updated error');

      const errorElements = group.querySelectorAll('.dos-form-group__error');
      expect(errorElements.length).toBe(1);
      expect(errorElements[0]?.textContent).toContain('Updated error');
    });
  });

  describe('disabled state', () => {
    it('sets disabled attribute when disabled prop is true', () => {
      const group = createFormGroup({
        disabled: true,
      });

      expect(group.disabled).toBe(true);
      expect(group.classList.contains('dos-form-group--disabled')).toBe(true);
    });

    it('setDisabled updates disabled state', () => {
      const group = createFormGroup({});

      group.setDisabled(true);

      expect(group.disabled).toBe(true);
      expect(group.classList.contains('dos-form-group--disabled')).toBe(true);
      expect(group.isDisabled()).toBe(true);

      group.setDisabled(false);

      expect(group.disabled).toBe(false);
      expect(group.classList.contains('dos-form-group--disabled')).toBe(false);
      expect(group.isDisabled()).toBe(false);
    });

    it('isDisabled returns current state', () => {
      const group = createFormGroup({
        disabled: true,
      });

      expect(group.isDisabled()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('provides semantic fieldset grouping', () => {
      const group = createFormGroup({
        legend: 'Contact Info',
      });

      expect(group.tagName).toBe('FIELDSET');
      expect(group.querySelector('legend')).toBeTruthy();
    });

    it('has aria-describedby for description', () => {
      const group = createFormGroup({
        id: 'test-group',
        description: 'Helper text',
      });

      expect(group.getAttribute('aria-describedby')).toBe('test-group-description');

      const description = group.querySelector('.dos-form-group__description');
      expect(description?.id).toBe('test-group-description');
    });

    it('has aria-describedby for error', () => {
      const group = createFormGroup({
        id: 'test-group',
        error: 'Error message',
      });

      expect(group.getAttribute('aria-describedby')).toBe('test-group-error');

      const errorElement = group.querySelector('.dos-form-group__error');
      expect(errorElement?.id).toBe('test-group-error');
    });

    it('combines aria-describedby for description and error', () => {
      const group = createFormGroup({
        id: 'test-group',
        description: 'Helper text',
        error: 'Error message',
      });

      expect(group.getAttribute('aria-describedby')).toBe(
        'test-group-description test-group-error'
      );
    });

    it('error element has proper ARIA attributes', () => {
      const group = createFormGroup({
        error: 'Error message',
      });

      const errorElement = group.querySelector('.dos-form-group__error');
      expect(errorElement?.getAttribute('role')).toBe('alert');
      expect(errorElement?.getAttribute('aria-live')).toBe('polite');
    });

    it('box-drawing characters are hidden from screen readers', () => {
      const group = createFormGroup({
        legend: 'Test Legend',
      });

      const startChar = group.querySelector('.dos-form-group__legend-start');
      const endChar = group.querySelector('.dos-form-group__legend-end');

      expect(startChar?.getAttribute('aria-hidden')).toBe('true');
      expect(endChar?.getAttribute('aria-hidden')).toBe('true');
    });

    it('updates aria-describedby when setError adds error', () => {
      const group = createFormGroup({
        id: 'test-group',
      });

      group.setError('New error');

      expect(group.getAttribute('aria-describedby')).toContain('test-group-error');
    });

    it('updates aria-describedby when setError removes error', () => {
      const group = createFormGroup({
        id: 'test-group',
        description: 'Helper text',
        error: 'Error message',
      });

      group.setError(undefined);

      expect(group.getAttribute('aria-describedby')).toBe('test-group-description');
    });

    it('removes aria-describedby when no description or error', () => {
      const group = createFormGroup({
        id: 'test-group',
        error: 'Error only',
      });

      group.setError(undefined);

      expect(group.hasAttribute('aria-describedby')).toBe(false);
    });
  });

  // Cleanup
  afterEach(() => {
    document.body.innerHTML = '';
  });
});
