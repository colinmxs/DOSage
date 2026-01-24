/**
 * TagInput Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTagInput } from '../../src/components/TagInput';
import type { Tag, TagSuggestion } from '../../src/components/TagInput';

describe('TagInput', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.useRealTimers();
  });

  const getInput = (el: HTMLElement) => el.querySelector('.dos-taginput__input') as HTMLInputElement;
  const getTags = (el: HTMLElement) => el.querySelectorAll('.dos-taginput__tag');
  const getTagLabels = (el: HTMLElement) => 
    Array.from(el.querySelectorAll('.dos-taginput__tag-label')).map(t => t.textContent);
  const getSuggestions = (el: HTMLElement) => {
    const dropdown = el.querySelector('.dos-taginput__suggestions') as HTMLElement;
    return dropdown && !dropdown.hidden ? dropdown : null;
  };
  const getSuggestionItems = (el: HTMLElement) => el.querySelectorAll('.dos-taginput__suggestion');
  const getErrorMessage = (el: HTMLElement) => {
    const error = el.querySelector('.dos-taginput__error') as HTMLElement;
    return error && !error.hidden ? error : null;
  };

  describe('Rendering', () => {
    it('renders with default props', () => {
      const tagInput = createTagInput({});
      container.appendChild(tagInput);

      expect(tagInput.classList.contains('dos-taginput')).toBe(true);
      expect(getInput(tagInput)).toBeTruthy();
    });

    it('renders with initial tags', () => {
      const value: Tag[] = [
        { id: '1', label: 'JavaScript' },
        { id: '2', label: 'TypeScript' },
      ];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      const renderedTags = getTags(tagInput);
      expect(renderedTags.length).toBe(2);
      expect(getTagLabels(tagInput)).toEqual(['JavaScript', 'TypeScript']);
    });

    it('renders with placeholder', () => {
      const tagInput = createTagInput({ placeholder: 'Add tags...' });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      expect(input.placeholder).toBe('Add tags...');
    });

    it('renders as disabled', () => {
      const tagInput = createTagInput({ disabled: true });
      container.appendChild(tagInput);

      expect(tagInput.classList.contains('dos-taginput--disabled')).toBe(true);
      expect(getInput(tagInput).disabled).toBe(true);
    });

    it('applies custom className', () => {
      const tagInput = createTagInput({ className: 'custom-class' });
      container.appendChild(tagInput);

      expect(tagInput.classList.contains('custom-class')).toBe(true);
    });
  });

  describe('Tag Creation', () => {
    it('creates tag on Enter key', async () => {
      const tagInput = createTagInput({});
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'NewTag';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      await vi.runAllTimersAsync();

      expect(getTagLabels(tagInput)).toContain('NewTag');
      expect(input.value).toBe('');
    });

    it('creates tag on comma delimiter', async () => {
      const tagInput = createTagInput({ delimiters: [','] });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'Tag1';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: ',', bubbles: true }));

      await vi.runAllTimersAsync();

      // Should create Tag1
      expect(getTagLabels(tagInput)).toContain('Tag1');
    });

    it('calls onChange when tag is added', async () => {
      const onChange = vi.fn();
      const tagInput = createTagInput({ onChange });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'NewTag';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      await vi.runAllTimersAsync();

      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls[0][0].some((t: Tag) => t.label === 'NewTag')).toBe(true);
    });

    it('calls onAdd when tag is added', async () => {
      const onAdd = vi.fn();
      const tagInput = createTagInput({ onAdd });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'NewTag';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      await vi.runAllTimersAsync();

      expect(onAdd).toHaveBeenCalled();
      expect(onAdd.mock.calls[0][0].label).toBe('NewTag');
    });

    it('respects maxTags limit', async () => {
      const value: Tag[] = [
        { id: '1', label: 'Tag1' },
        { id: '2', label: 'Tag2' },
      ];
      const tagInput = createTagInput({ value, maxTags: 2 });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'Tag3';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      await vi.runAllTimersAsync();

      expect(getTags(tagInput).length).toBe(2);
      expect(getTagLabels(tagInput)).not.toContain('Tag3');
    });

    it('trims whitespace from tag labels', async () => {
      const tagInput = createTagInput({});
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = '  SpacedTag  ';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      await vi.runAllTimersAsync();

      expect(getTagLabels(tagInput)).toContain('SpacedTag');
    });

    it('does not create empty tags', async () => {
      const tagInput = createTagInput({});
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = '   ';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(getTags(tagInput).length).toBe(0);
    });
  });

  describe('Tag Removal', () => {
    it('removes tag on remove button click', () => {
      const value: Tag[] = [
        { id: '1', label: 'Tag1' },
        { id: '2', label: 'Tag2' },
      ];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      const removeBtn = tagInput.querySelector('.dos-taginput__tag-remove') as HTMLButtonElement;
      removeBtn.click();

      expect(getTags(tagInput).length).toBe(1);
      expect(getTagLabels(tagInput)).not.toContain('Tag1');
    });

    it('does not show remove button for non-removable tags', () => {
      const value: Tag[] = [
        { id: '1', label: 'Fixed', removable: false },
        { id: '2', label: 'Removable' },
      ];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      const removeBtns = tagInput.querySelectorAll('.dos-taginput__tag-remove');
      expect(removeBtns.length).toBe(1);
    });

    it('removes last tag on Backspace when input is empty', () => {
      const value: Tag[] = [
        { id: '1', label: 'Tag1' },
        { id: '2', label: 'Tag2' },
      ];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.focus();
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));

      expect(getTags(tagInput).length).toBe(1);
      expect(getTagLabels(tagInput)).toEqual(['Tag1']);
    });

    it('does not remove tag on Backspace when input has content', () => {
      const value: Tag[] = [{ id: '1', label: 'Tag1' }];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'typing';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));

      expect(getTags(tagInput).length).toBe(1);
    });

    it('calls onChange when tag is removed', () => {
      const onChange = vi.fn();
      const value: Tag[] = [{ id: '1', label: 'Tag1' }];
      const tagInput = createTagInput({ value, onChange });
      container.appendChild(tagInput);

      const removeBtn = tagInput.querySelector('.dos-taginput__tag-remove') as HTMLButtonElement;
      removeBtn.click();

      expect(onChange).toHaveBeenCalledWith([]);
    });

    it('calls onRemove when tag is removed', () => {
      const onRemove = vi.fn();
      const value: Tag[] = [{ id: '1', label: 'Tag1' }];
      const tagInput = createTagInput({ value, onRemove });
      container.appendChild(tagInput);

      const removeBtn = tagInput.querySelector('.dos-taginput__tag-remove') as HTMLButtonElement;
      removeBtn.click();

      expect(onRemove).toHaveBeenCalled();
      expect(onRemove.mock.calls[0][0].label).toBe('Tag1');
    });
  });

  describe('Tag Navigation', () => {
    it('navigates to last tag with ArrowLeft when at start of input', () => {
      const value: Tag[] = [
        { id: '1', label: 'Tag1' },
        { id: '2', label: 'Tag2' },
      ];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.focus();
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));

      const lastTag = getTags(tagInput)[1];
      expect(lastTag.classList.contains('dos-taginput__tag--focused')).toBe(true);
    });

    it('navigates between tags with ArrowLeft/ArrowRight', () => {
      const value: Tag[] = [
        { id: '1', label: 'Tag1' },
        { id: '2', label: 'Tag2' },
      ];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.focus();
      
      // Navigate to last tag
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      expect(getTags(tagInput)[1].classList.contains('dos-taginput__tag--focused')).toBe(true);

      // Navigate to first tag
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      expect(getTags(tagInput)[0].classList.contains('dos-taginput__tag--focused')).toBe(true);

      // Navigate back to second tag
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(getTags(tagInput)[1].classList.contains('dos-taginput__tag--focused')).toBe(true);
    });

    it('returns to input with ArrowRight from last tag', () => {
      const value: Tag[] = [{ id: '1', label: 'Tag1' }];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.focus();
      
      // Navigate to tag
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      
      // Navigate back to input
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      
      expect(getTags(tagInput)[0].classList.contains('dos-taginput__tag--focused')).toBe(false);
      expect(document.activeElement).toBe(input);
    });

    it('removes focused tag with Delete key', () => {
      const value: Tag[] = [
        { id: '1', label: 'Tag1' },
        { id: '2', label: 'Tag2' },
      ];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.focus();
      
      // Navigate to last tag
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      
      // Delete it
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

      expect(getTags(tagInput).length).toBe(1);
      expect(getTagLabels(tagInput)).toEqual(['Tag1']);
    });

    it('removes focused tag with Backspace key', () => {
      const value: Tag[] = [
        { id: '1', label: 'Tag1' },
        { id: '2', label: 'Tag2' },
      ];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.focus();
      
      // Navigate to last tag
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      
      // Backspace to remove it
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));

      expect(getTags(tagInput).length).toBe(1);
    });
  });

  describe('Validation', () => {
    it('prevents duplicate tags when allowDuplicates is false', async () => {
      const value: Tag[] = [{ id: '1', label: 'Existing' }];
      const tagInput = createTagInput({ value, allowDuplicates: false });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'Existing';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      await vi.runAllTimersAsync();

      expect(getTags(tagInput).length).toBe(1);
    });

    it('allows duplicate tags when allowDuplicates is true', async () => {
      const value: Tag[] = [{ id: '1', label: 'Existing' }];
      const tagInput = createTagInput({ value, allowDuplicates: true });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'Existing';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      await vi.runAllTimersAsync();

      expect(getTags(tagInput).length).toBe(2);
    });

    it('validates minimum tag length', async () => {
      const tagInput = createTagInput({ minTagLength: 3 });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'ab';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      // Only advance timers enough for the validation, not the error auto-clear
      await vi.advanceTimersByTimeAsync(100);

      expect(getTags(tagInput).length).toBe(0);
      expect(getErrorMessage(tagInput)).toBeTruthy();
    });

    it('validates maximum tag length', async () => {
      const tagInput = createTagInput({ maxTagLength: 5 });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'toolongvalue';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      // Only advance timers enough for the validation, not the error auto-clear
      await vi.advanceTimersByTimeAsync(100);

      expect(getTags(tagInput).length).toBe(0);
      expect(getErrorMessage(tagInput)).toBeTruthy();
    });

    it('uses custom validate function', async () => {
      const validate = vi.fn().mockReturnValue({ valid: false, message: 'Custom error' });
      const tagInput = createTagInput({ validate });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      // Only advance timers enough for the validation, not the error auto-clear
      await vi.advanceTimersByTimeAsync(100);

      expect(validate).toHaveBeenCalled();
      expect(getTags(tagInput).length).toBe(0);
      expect(getErrorMessage(tagInput)?.textContent).toContain('Custom error');
    });

    it('displays error message', async () => {
      const tagInput = createTagInput({ minTagLength: 5 });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'ab';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      // Only advance timers enough for the validation, not the error auto-clear
      await vi.advanceTimersByTimeAsync(100);

      const error = getErrorMessage(tagInput);
      expect(error).toBeTruthy();
      expect(tagInput.classList.contains('dos-taginput--error')).toBe(true);
    });

    it('clears error on successful tag addition', async () => {
      const tagInput = createTagInput({ minTagLength: 2 });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      
      // First trigger an error
      input.value = 'a';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await vi.advanceTimersByTimeAsync(100);
      expect(getErrorMessage(tagInput)).toBeTruthy();

      // Then add a valid tag
      input.value = 'valid';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await vi.advanceTimersByTimeAsync(100);
      
      expect(getErrorMessage(tagInput)).toBeFalsy();
      expect(tagInput.classList.contains('dos-taginput--error')).toBe(false);
    });
  });

  describe('Suggestions', () => {
    it('shows suggestions when typing', async () => {
      const suggestions: TagSuggestion[] = [
        { value: 'JavaScript' },
        { value: 'TypeScript' },
      ];
      const loadSuggestions = vi.fn().mockResolvedValue(suggestions);
      const tagInput = createTagInput({ loadSuggestions });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'script';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await vi.advanceTimersByTimeAsync(300); // debounce delay
      await vi.runAllTimersAsync();

      expect(loadSuggestions).toHaveBeenCalledWith('script');
      expect(getSuggestions(tagInput)).toBeTruthy();
      expect(getSuggestionItems(tagInput).length).toBe(2);
    });

    it('selects suggestion on click', async () => {
      const suggestions: TagSuggestion[] = [
        { value: 'JavaScript' },
      ];
      const loadSuggestions = vi.fn().mockResolvedValue(suggestions);
      const tagInput = createTagInput({ loadSuggestions });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'java';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await vi.advanceTimersByTimeAsync(300);
      await vi.runAllTimersAsync();

      const suggestionItem = getSuggestionItems(tagInput)[0] as HTMLElement;
      suggestionItem.click();

      await vi.runAllTimersAsync();

      expect(getTagLabels(tagInput)).toContain('JavaScript');
      expect(input.value).toBe('');
    });

    it('navigates suggestions with ArrowDown/ArrowUp', async () => {
      const suggestions: TagSuggestion[] = [
        { value: 'Option1' },
        { value: 'Option2' },
      ];
      const loadSuggestions = vi.fn().mockResolvedValue(suggestions);
      const tagInput = createTagInput({ loadSuggestions });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'opt';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await vi.advanceTimersByTimeAsync(300);
      await vi.runAllTimersAsync();

      // Navigate down
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(getSuggestionItems(tagInput)[0].classList.contains('dos-taginput__suggestion--highlighted')).toBe(true);

      // Navigate down again
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(getSuggestionItems(tagInput)[1].classList.contains('dos-taginput__suggestion--highlighted')).toBe(true);

      // Navigate up
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(getSuggestionItems(tagInput)[0].classList.contains('dos-taginput__suggestion--highlighted')).toBe(true);
    });

    it('selects highlighted suggestion on Enter', async () => {
      const suggestions: TagSuggestion[] = [
        { value: 'JavaScript' },
      ];
      const loadSuggestions = vi.fn().mockResolvedValue(suggestions);
      const tagInput = createTagInput({ loadSuggestions });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'java';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await vi.advanceTimersByTimeAsync(300);
      await vi.runAllTimersAsync();

      // Navigate to suggestion
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      
      // Select it
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      await vi.runAllTimersAsync();

      expect(getTagLabels(tagInput)).toContain('JavaScript');
    });

    it('closes suggestions on Escape', async () => {
      const suggestions: TagSuggestion[] = [
        { value: 'JavaScript' },
      ];
      const loadSuggestions = vi.fn().mockResolvedValue(suggestions);
      const tagInput = createTagInput({ loadSuggestions });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'java';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await vi.advanceTimersByTimeAsync(300);
      await vi.runAllTimersAsync();

      expect(getSuggestions(tagInput)).toBeTruthy();

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      expect(getSuggestions(tagInput)).toBeFalsy();
    });

    it('shows loading state while fetching suggestions', async () => {
      let resolvePromise: (value: TagSuggestion[]) => void;
      const slowPromise = new Promise<TagSuggestion[]>((resolve) => {
        resolvePromise = resolve;
      });
      const loadSuggestions = vi.fn().mockReturnValue(slowPromise);
      const tagInput = createTagInput({ loadSuggestions });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await vi.advanceTimersByTimeAsync(300);

      // Loading should be visible
      expect(tagInput.querySelector('.dos-taginput__loading')).toBeTruthy();

      // Resolve and check loading is gone
      resolvePromise!([{ value: 'Test' }]);
      await vi.runAllTimersAsync();

      expect(tagInput.querySelector('.dos-taginput__loading')).toBeFalsy();
    });

    it('uses static suggestions when provided', () => {
      const suggestions: TagSuggestion[] = [
        { value: 'JavaScript' },
        { value: 'TypeScript' },
      ];
      const tagInput = createTagInput({ suggestions, showSuggestionsOnFocus: true });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.focus();
      input.dispatchEvent(new Event('focus', { bubbles: true }));

      expect(getSuggestions(tagInput)).toBeTruthy();
      expect(getSuggestionItems(tagInput).length).toBe(2);
    });
  });

  describe('Public API', () => {
    it('getTags returns current tags', () => {
      const value: Tag[] = [
        { id: '1', label: 'Tag1' },
        { id: '2', label: 'Tag2' },
      ];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      const result = tagInput.getTags();
      expect(result.length).toBe(2);
      expect(result[0].label).toBe('Tag1');
    });

    it('setTags replaces all tags', () => {
      const tagInput = createTagInput({ value: [{ id: '1', label: 'Old' }] });
      container.appendChild(tagInput);

      tagInput.setTags([
        { id: '2', label: 'New1' },
        { id: '3', label: 'New2' },
      ]);

      expect(getTagLabels(tagInput)).toEqual(['New1', 'New2']);
    });

    it('addTag adds a new tag', async () => {
      const tagInput = createTagInput({});
      container.appendChild(tagInput);

      const result = await tagInput.addTag('NewTag');

      expect(result).toBe(true);
      expect(getTagLabels(tagInput)).toContain('NewTag');
    });

    it('addTag returns false when validation fails', async () => {
      const tagInput = createTagInput({ minTagLength: 5 });
      container.appendChild(tagInput);

      const result = await tagInput.addTag('ab');

      expect(result).toBe(false);
      expect(getTags(tagInput).length).toBe(0);
    });

    it('removeTag removes a tag by id', () => {
      const value: Tag[] = [
        { id: 'a', label: 'Tag1' },
        { id: 'b', label: 'Tag2' },
      ];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      tagInput.removeTag('a');

      expect(getTagLabels(tagInput)).toEqual(['Tag2']);
    });

    it('clearTags removes all tags', () => {
      const value: Tag[] = [
        { id: '1', label: 'Tag1' },
        { id: '2', label: 'Tag2' },
      ];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      tagInput.clearTags();

      expect(getTags(tagInput).length).toBe(0);
    });

    it('getInputValue returns current input value', () => {
      const tagInput = createTagInput({});
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'typing';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(tagInput.getInputValue()).toBe('typing');
    });

    it('setInputValue sets the input value', () => {
      const tagInput = createTagInput({});
      container.appendChild(tagInput);

      tagInput.setInputValue('preset');

      expect(getInput(tagInput).value).toBe('preset');
    });

    it('focus puts focus on the input', () => {
      const tagInput = createTagInput({});
      container.appendChild(tagInput);

      tagInput.focus();

      expect(document.activeElement).toBe(getInput(tagInput));
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA role on wrapper', () => {
      const tagInput = createTagInput({});
      container.appendChild(tagInput);

      const tagsContainer = tagInput.querySelector('.dos-taginput__tags');
      expect(tagsContainer?.getAttribute('role')).toBe('list');
    });

    it('tags have correct ARIA attributes', () => {
      const value: Tag[] = [{ id: '1', label: 'Tag1' }];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      const tag = getTags(tagInput)[0];
      expect(tag.getAttribute('role')).toBe('listitem');
    });

    it('remove button is labeled for screen readers', () => {
      const value: Tag[] = [{ id: '1', label: 'JavaScript' }];
      const tagInput = createTagInput({ value });
      container.appendChild(tagInput);

      const removeBtn = tagInput.querySelector('.dos-taginput__tag-remove');
      expect(removeBtn?.getAttribute('aria-label')).toContain('JavaScript');
    });

    it('suggestions have correct ARIA role', async () => {
      const suggestions: TagSuggestion[] = [{ value: 'Test' }];
      const loadSuggestions = vi.fn().mockResolvedValue(suggestions);
      const tagInput = createTagInput({ loadSuggestions });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await vi.advanceTimersByTimeAsync(300);
      await vi.runAllTimersAsync();

      const suggestionsList = tagInput.querySelector('.dos-taginput__suggestions');
      expect(suggestionsList?.getAttribute('role')).toBe('listbox');
    });

    it('input has correct aria-expanded state', async () => {
      const suggestions: TagSuggestion[] = [{ value: 'Test' }];
      const loadSuggestions = vi.fn().mockResolvedValue(suggestions);
      const tagInput = createTagInput({ loadSuggestions });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      expect(input.getAttribute('aria-expanded')).toBe('false');

      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await vi.advanceTimersByTimeAsync(300);
      await vi.runAllTimersAsync();

      expect(input.getAttribute('aria-expanded')).toBe('true');
    });

    it('highlighted suggestion has aria-selected', async () => {
      const suggestions: TagSuggestion[] = [{ value: 'Test' }];
      const loadSuggestions = vi.fn().mockResolvedValue(suggestions);
      const tagInput = createTagInput({ loadSuggestions });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await vi.advanceTimersByTimeAsync(300);
      await vi.runAllTimersAsync();

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      const suggestion = getSuggestionItems(tagInput)[0];
      expect(suggestion.getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty suggestions array', async () => {
      const loadSuggestions = vi.fn().mockResolvedValue([]);
      const tagInput = createTagInput({ loadSuggestions });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await vi.advanceTimersByTimeAsync(300);
      await vi.runAllTimersAsync();

      expect(getSuggestions(tagInput)).toBeFalsy();
    });

    it('handles rapid typing with debounce', async () => {
      const loadSuggestions = vi.fn().mockResolvedValue([]);
      const tagInput = createTagInput({ loadSuggestions, suggestionsDebounce: 300 });
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      
      // Type rapidly
      input.value = 't';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await vi.advanceTimersByTimeAsync(100);
      
      input.value = 'te';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await vi.advanceTimersByTimeAsync(100);
      
      input.value = 'tes';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await vi.advanceTimersByTimeAsync(100);
      
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await vi.advanceTimersByTimeAsync(300);

      // Should only be called once due to debounce
      expect(loadSuggestions).toHaveBeenCalledTimes(1);
      expect(loadSuggestions).toHaveBeenCalledWith('test');
    });

    it('handles special characters in tags', async () => {
      const tagInput = createTagInput({});
      container.appendChild(tagInput);

      const input = getInput(tagInput);
      input.value = 'C++';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      await vi.runAllTimersAsync();

      expect(getTagLabels(tagInput)).toContain('C++');
    });

    it('handles very long tag labels', () => {
      const longLabel = 'A'.repeat(100);
      const tagInput = createTagInput({ value: [{ id: '1', label: longLabel }] });
      container.appendChild(tagInput);

      const tagLabel = tagInput.querySelector('.dos-taginput__tag-label');
      expect(tagLabel?.textContent).toBe(longLabel);
    });
  });
});
