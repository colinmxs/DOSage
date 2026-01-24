/**
 * FileInput Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createFileInput } from '../../src/components/FileInput';

describe('FileInput', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  // Helper to create a mock File
  function createMockFile(name: string, size: number, type: string): File {
    const blob = new Blob(['x'.repeat(size)], { type });
    return new File([blob], name, { type });
  }

  // Helper to simulate file selection using a mock FileList
  function selectFilesWithMockList(input: HTMLInputElement, files: File[]): void {
    // Create a mock FileList-like object
    const fileList = {
      length: files.length,
      item: (index: number) => files[index] || null,
      [Symbol.iterator]: function* () {
        for (let i = 0; i < files.length; i++) {
          yield files[i];
        }
      },
    } as unknown as FileList;

    // Assign numeric indices
    files.forEach((file, index) => {
      (fileList as Record<number, File>)[index] = file;
    });

    Object.defineProperty(input, 'files', { value: fileList, configurable: true });
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  describe('rendering', () => {
    it('creates file input with default props', () => {
      const fileInput = createFileInput();
      expect(fileInput).toBeDefined();
      expect(fileInput.classList.contains('dos-file-input')).toBe(true);
    });

    it('creates file input with label', () => {
      const fileInput = createFileInput({ label: 'Upload File' });
      const label = fileInput.querySelector('.dos-file-input__label');
      expect(label).toBeDefined();
      expect(label?.textContent).toBe('Upload File');
    });

    it('creates file input with custom button label', () => {
      const fileInput = createFileInput({ buttonLabel: 'Choose' });
      const button = fileInput.querySelector('.dos-file-input__button');
      expect(button?.textContent).toBe('[Choose]');
    });

    it('creates file input with hidden native input', () => {
      const fileInput = createFileInput();
      const input = fileInput.querySelector('input[type="file"]');
      expect(input).toBeDefined();
      expect(input?.getAttribute('aria-hidden')).toBe('true');
      expect(input?.tabIndex).toBe(-1);
    });

    it('applies size variants', () => {
      const sm = createFileInput({ size: 'sm' });
      const md = createFileInput({ size: 'md' });
      const lg = createFileInput({ size: 'lg' });

      expect(sm.classList.contains('dos-file-input--sm')).toBe(true);
      expect(md.classList.contains('dos-file-input--md')).toBe(true);
      expect(lg.classList.contains('dos-file-input--lg')).toBe(true);
    });

    it('applies custom className', () => {
      const fileInput = createFileInput({ className: 'custom-class' });
      expect(fileInput.classList.contains('custom-class')).toBe(true);
    });

    it('applies custom id', () => {
      const fileInput = createFileInput({ id: 'my-file-input' });
      expect(fileInput.id).toBe('my-file-input');
    });

    it('generates unique id when not provided', () => {
      const fileInput1 = createFileInput();
      const fileInput2 = createFileInput();
      expect(fileInput1.id).not.toBe(fileInput2.id);
    });

    it('shows "No file selected" by default', () => {
      const fileInput = createFileInput();
      const filename = fileInput.querySelector('.dos-file-input__filename');
      expect(filename?.textContent).toBe('No file selected');
    });
  });

  describe('drag and drop mode', () => {
    it('creates dropzone when dragDrop is true', () => {
      const fileInput = createFileInput({ dragDrop: true });
      const dropzone = fileInput.querySelector('.dos-file-input__dropzone');
      expect(dropzone).toBeDefined();
      expect(fileInput.classList.contains('dos-file-input--dropzone')).toBe(true);
    });

    it('shows dropzone text', () => {
      const fileInput = createFileInput({
        dragDrop: true,
        dropzoneText: 'Drag files here',
      });
      const text = fileInput.querySelector('.dos-file-input__dropzone-text');
      expect(text?.textContent).toBe('Drag files here');
    });

    it('shows accept hint in dropzone', () => {
      const fileInput = createFileInput({
        dragDrop: true,
        accept: '.txt,.pdf',
      });
      const hint = fileInput.querySelector('.dos-file-input__dropzone-hint');
      expect(hint?.textContent).toContain('.txt,.pdf');
    });

    it('has dropzone icon', () => {
      const fileInput = createFileInput({ dragDrop: true });
      const icon = fileInput.querySelector('.dos-file-input__dropzone-icon');
      expect(icon).toBeDefined();
    });

    it('dropzone has correct role', () => {
      const fileInput = createFileInput({ dragDrop: true });
      const dropzone = fileInput.querySelector('.dos-file-input__dropzone');
      expect(dropzone?.getAttribute('role')).toBe('button');
    });

    it('dropzone is focusable', () => {
      const fileInput = createFileInput({ dragDrop: true });
      const dropzone = fileInput.querySelector('.dos-file-input__dropzone');
      expect(dropzone?.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('classic mode', () => {
    it('creates browse button', () => {
      const fileInput = createFileInput();
      const button = fileInput.querySelector('.dos-file-input__button');
      expect(button).toBeDefined();
      expect(button?.textContent).toBe('[Browse...]');
    });

    it('creates filename display', () => {
      const fileInput = createFileInput();
      const filename = fileInput.querySelector('.dos-file-input__filename');
      expect(filename).toBeDefined();
    });

    it('opens file dialog on button click', () => {
      const fileInput = createFileInput();
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = vi.spyOn(input, 'click');

      const button = fileInput.querySelector('.dos-file-input__button') as HTMLButtonElement;
      button.click();

      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('file selection', () => {
    it('updates filename display on file selection', () => {
      const fileInput = createFileInput();
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = createMockFile('test.txt', 1024, 'text/plain');
      selectFilesWithMockList(input, [testFile]);

      const filename = fileInput.querySelector('.dos-file-input__filename');
      expect(filename?.textContent).toBe('test.txt');
    });

    it('shows file count for multiple files', () => {
      const fileInput = createFileInput({ multiple: true });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const files = [
        createMockFile('file1.txt', 1024, 'text/plain'),
        createMockFile('file2.txt', 1024, 'text/plain'),
        createMockFile('file3.txt', 1024, 'text/plain'),
      ];
      selectFilesWithMockList(input, files);

      const filename = fileInput.querySelector('.dos-file-input__filename');
      expect(filename?.textContent).toBe('3 files selected');
    });

    it('calls onChange with selected files', () => {
      const onChange = vi.fn();
      const fileInput = createFileInput({ onChange });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = createMockFile('test.txt', 1024, 'text/plain');
      selectFilesWithMockList(input, [testFile]);

      expect(onChange).toHaveBeenCalledWith([testFile]);
    });

    it('sets multiple attribute when multiple is true', () => {
      const fileInput = createFileInput({ multiple: true });
      const input = fileInput.querySelector('input[type="file"]');
      expect(input?.hasAttribute('multiple')).toBe(true);
    });

    it('sets accept attribute', () => {
      const fileInput = createFileInput({ accept: '.txt,.pdf' });
      const input = fileInput.querySelector('input[type="file"]');
      expect(input?.getAttribute('accept')).toBe('.txt,.pdf');
    });

    it('sets name attribute', () => {
      const fileInput = createFileInput({ name: 'myFile' });
      const input = fileInput.querySelector('input[type="file"]');
      expect(input?.getAttribute('name')).toBe('myFile');
    });
  });

  describe('file list', () => {
    it('shows file list when showFileList is true', () => {
      const fileInput = createFileInput({ showFileList: true });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = createMockFile('test.txt', 1024, 'text/plain');
      selectFilesWithMockList(input, [testFile]);

      const fileList = fileInput.querySelector('.dos-file-input__file-list');
      const fileItem = fileList?.querySelector('.dos-file-input__file-item');
      expect(fileItem).toBeDefined();
    });

    it('displays file name in list', () => {
      const fileInput = createFileInput({ showFileList: true });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = createMockFile('document.pdf', 1024, 'application/pdf');
      selectFilesWithMockList(input, [testFile]);

      const fileName = fileInput.querySelector('.dos-file-input__file-name');
      expect(fileName?.textContent).toBe('document.pdf');
    });

    it('displays file size in list', () => {
      const fileInput = createFileInput({ showFileList: true });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = createMockFile('test.txt', 2048, 'text/plain');
      selectFilesWithMockList(input, [testFile]);

      const fileSize = fileInput.querySelector('.dos-file-input__file-size');
      expect(fileSize?.textContent).toBe('2 KB');
    });

    it('has remove button for each file', () => {
      const fileInput = createFileInput({ showFileList: true });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = createMockFile('test.txt', 1024, 'text/plain');
      selectFilesWithMockList(input, [testFile]);

      const removeBtn = fileInput.querySelector('.dos-file-input__file-remove');
      expect(removeBtn).toBeDefined();
      expect(removeBtn?.textContent).toBe('[X]');
    });

    it('removes file when remove button clicked', () => {
      const onChange = vi.fn();
      const fileInput = createFileInput({ showFileList: true, onChange });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = createMockFile('test.txt', 1024, 'text/plain');
      selectFilesWithMockList(input, [testFile]);

      const removeBtn = fileInput.querySelector('.dos-file-input__file-remove') as HTMLButtonElement;
      removeBtn.click();

      expect(fileInput.getFiles()).toHaveLength(0);
      expect(onChange).toHaveBeenLastCalledWith([]);
    });

    it('calls onRemove when file removed', () => {
      const onRemove = vi.fn();
      const fileInput = createFileInput({ showFileList: true, onRemove });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = createMockFile('test.txt', 1024, 'text/plain');
      selectFilesWithMockList(input, [testFile]);

      const removeBtn = fileInput.querySelector('.dos-file-input__file-remove') as HTMLButtonElement;
      removeBtn.click();

      expect(onRemove).toHaveBeenCalledWith(testFile);
    });

    it('file list has correct ARIA attributes', () => {
      const fileInput = createFileInput({ showFileList: true });
      const fileList = fileInput.querySelector('.dos-file-input__file-list');
      expect(fileList?.getAttribute('role')).toBe('list');
      expect(fileList?.getAttribute('aria-label')).toBe('Selected files');
    });
  });

  describe('validation', () => {
    it('validates file type by extension', () => {
      const onReject = vi.fn();
      const fileInput = createFileInput({
        accept: '.txt',
        onReject,
      });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const pdfFile = createMockFile('document.pdf', 1024, 'application/pdf');
      selectFilesWithMockList(input, [pdfFile]);

      expect(onReject).toHaveBeenCalledWith(pdfFile, expect.stringContaining('Invalid file type'));
      expect(fileInput.getFiles()).toHaveLength(0);
    });

    it('accepts valid file type by extension', () => {
      const onReject = vi.fn();
      const fileInput = createFileInput({
        accept: '.txt',
        onReject,
      });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const txtFile = createMockFile('document.txt', 1024, 'text/plain');
      selectFilesWithMockList(input, [txtFile]);

      expect(onReject).not.toHaveBeenCalled();
      expect(fileInput.getFiles()).toHaveLength(1);
    });

    it('validates file type by MIME type', () => {
      const onReject = vi.fn();
      const fileInput = createFileInput({
        accept: 'image/*',
        onReject,
      });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const txtFile = createMockFile('document.txt', 1024, 'text/plain');
      selectFilesWithMockList(input, [txtFile]);

      expect(onReject).toHaveBeenCalledWith(txtFile, expect.stringContaining('Invalid file type'));
    });

    it('validates file size', () => {
      const onReject = vi.fn();
      const fileInput = createFileInput({
        maxSize: 1024, // 1KB
        onReject,
      });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const largeFile = createMockFile('large.txt', 2048, 'text/plain');
      selectFilesWithMockList(input, [largeFile]);

      expect(onReject).toHaveBeenCalledWith(largeFile, expect.stringContaining('too large'));
      expect(fileInput.getFiles()).toHaveLength(0);
    });

    it('enforces maxFiles limit', () => {
      const onReject = vi.fn();
      const fileInput = createFileInput({
        multiple: true,
        maxFiles: 2,
        onReject,
      });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const files = [
        createMockFile('file1.txt', 100, 'text/plain'),
        createMockFile('file2.txt', 100, 'text/plain'),
        createMockFile('file3.txt', 100, 'text/plain'),
      ];
      selectFilesWithMockList(input, files);

      expect(fileInput.getFiles()).toHaveLength(2);
      expect(onReject).toHaveBeenCalledWith(files[2], expect.stringContaining('Maximum files'));
    });

    it('enforces maxFiles across multiple selections', () => {
      const onReject = vi.fn();
      const fileInput = createFileInput({
        multiple: true,
        maxFiles: 2,
        onReject,
      });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      selectFilesWithMockList(input, [createMockFile('file1.txt', 100, 'text/plain')]);
      selectFilesWithMockList(input, [createMockFile('file2.txt', 100, 'text/plain')]);
      selectFilesWithMockList(input, [createMockFile('file3.txt', 100, 'text/plain')]);

      expect(fileInput.getFiles()).toHaveLength(2);
      expect(onReject).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('applies disabled class', () => {
      const fileInput = createFileInput({ disabled: true });
      expect(fileInput.classList.contains('dos-file-input--disabled')).toBe(true);
    });

    it('disables native input', () => {
      const fileInput = createFileInput({ disabled: true });
      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('disables browse button', () => {
      const fileInput = createFileInput({ disabled: true });
      const button = fileInput.querySelector('.dos-file-input__button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('disables dropzone tabindex', () => {
      const fileInput = createFileInput({ disabled: true, dragDrop: true });
      const dropzone = fileInput.querySelector('.dos-file-input__dropzone');
      expect(dropzone?.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('error state', () => {
    it('applies error class', () => {
      const fileInput = createFileInput({ error: 'Please select a file' });
      expect(fileInput.classList.contains('dos-file-input--error')).toBe(true);
    });

    it('shows error message', () => {
      const fileInput = createFileInput({ error: 'Please select a file' });
      const errorEl = fileInput.querySelector('.dos-file-input__error');
      expect(errorEl?.textContent).toBe('Please select a file');
    });

    it('error has alert role', () => {
      const fileInput = createFileInput({ error: 'Error message' });
      const errorEl = fileInput.querySelector('.dos-file-input__error');
      expect(errorEl?.getAttribute('role')).toBe('alert');
    });

    it('applies error class when error is true (boolean)', () => {
      // Note: error=true without string should still show error styling
      const fileInput = createFileInput({ error: true });
      expect(fileInput.classList.contains('dos-file-input--error')).toBe(true);
    });
  });

  describe('public API methods', () => {
    describe('getFiles()', () => {
      it('returns empty array initially', () => {
        const fileInput = createFileInput();
        expect(fileInput.getFiles()).toEqual([]);
      });

      it('returns selected files', () => {
        const fileInput = createFileInput();
        container.appendChild(fileInput);

        const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
        const testFile = createMockFile('test.txt', 1024, 'text/plain');
        selectFilesWithMockList(input, [testFile]);

        expect(fileInput.getFiles()).toHaveLength(1);
        expect(fileInput.getFiles()[0].name).toBe('test.txt');
      });

      it('returns a copy of files array', () => {
        const fileInput = createFileInput();
        container.appendChild(fileInput);

        const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
        const testFile = createMockFile('test.txt', 1024, 'text/plain');
        selectFilesWithMockList(input, [testFile]);

        const files1 = fileInput.getFiles();
        const files2 = fileInput.getFiles();
        expect(files1).not.toBe(files2);
      });
    });

    describe('clear()', () => {
      it('clears selected files', () => {
        const fileInput = createFileInput();
        container.appendChild(fileInput);

        const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
        const testFile = createMockFile('test.txt', 1024, 'text/plain');
        selectFilesWithMockList(input, [testFile]);

        fileInput.clear();

        expect(fileInput.getFiles()).toHaveLength(0);
      });

      it('updates filename display', () => {
        const fileInput = createFileInput();
        container.appendChild(fileInput);

        const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
        const testFile = createMockFile('test.txt', 1024, 'text/plain');
        selectFilesWithMockList(input, [testFile]);

        fileInput.clear();

        const filename = fileInput.querySelector('.dos-file-input__filename');
        expect(filename?.textContent).toBe('No file selected');
      });

      it('clears file list', () => {
        const fileInput = createFileInput({ showFileList: true });
        container.appendChild(fileInput);

        const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
        const testFile = createMockFile('test.txt', 1024, 'text/plain');
        selectFilesWithMockList(input, [testFile]);

        fileInput.clear();

        const fileItems = fileInput.querySelectorAll('.dos-file-input__file-item');
        expect(fileItems).toHaveLength(0);
      });

      it('calls onChange with empty array', () => {
        const onChange = vi.fn();
        const fileInput = createFileInput({ onChange });
        container.appendChild(fileInput);

        const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
        const testFile = createMockFile('test.txt', 1024, 'text/plain');
        selectFilesWithMockList(input, [testFile]);

        fileInput.clear();

        expect(onChange).toHaveBeenLastCalledWith([]);
      });
    });

    describe('browse()', () => {
      it('opens file dialog', () => {
        const fileInput = createFileInput();
        container.appendChild(fileInput);

        const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
        const clickSpy = vi.spyOn(input, 'click');

        fileInput.browse();

        expect(clickSpy).toHaveBeenCalled();
      });

      it('does nothing when disabled', () => {
        const fileInput = createFileInput({ disabled: true });
        container.appendChild(fileInput);

        const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
        const clickSpy = vi.spyOn(input, 'click');

        fileInput.browse();

        expect(clickSpy).not.toHaveBeenCalled();
      });
    });

    describe('setDisabled()', () => {
      it('enables the file input', () => {
        const fileInput = createFileInput({ disabled: true });
        container.appendChild(fileInput);

        fileInput.setDisabled(false);

        expect(fileInput.classList.contains('dos-file-input--disabled')).toBe(false);
        const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
        expect(input.disabled).toBe(false);
      });

      it('disables the file input', () => {
        const fileInput = createFileInput();
        container.appendChild(fileInput);

        fileInput.setDisabled(true);

        expect(fileInput.classList.contains('dos-file-input--disabled')).toBe(true);
        const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
        expect(input.disabled).toBe(true);
      });

      it('updates browse button', () => {
        const fileInput = createFileInput();
        container.appendChild(fileInput);

        fileInput.setDisabled(true);

        const button = fileInput.querySelector('.dos-file-input__button') as HTMLButtonElement;
        expect(button.disabled).toBe(true);
      });

      it('updates dropzone tabindex', () => {
        const fileInput = createFileInput({ dragDrop: true });
        container.appendChild(fileInput);

        fileInput.setDisabled(true);

        const dropzone = fileInput.querySelector('.dos-file-input__dropzone');
        expect(dropzone?.getAttribute('tabindex')).toBe('-1');
      });

      it('disables remove buttons', () => {
        const fileInput = createFileInput({ showFileList: true });
        container.appendChild(fileInput);

        const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
        const testFile = createMockFile('test.txt', 1024, 'text/plain');
        selectFilesWithMockList(input, [testFile]);

        fileInput.setDisabled(true);

        const removeBtn = fileInput.querySelector('.dos-file-input__file-remove') as HTMLButtonElement;
        expect(removeBtn.disabled).toBe(true);
      });
    });

    describe('setError()', () => {
      it('sets error state', () => {
        const fileInput = createFileInput();
        container.appendChild(fileInput);

        fileInput.setError('Error message');

        expect(fileInput.classList.contains('dos-file-input--error')).toBe(true);
        const errorEl = fileInput.querySelector('.dos-file-input__error');
        expect(errorEl?.textContent).toBe('Error message');
      });

      it('clears error state', () => {
        const fileInput = createFileInput({ error: 'Initial error' });
        container.appendChild(fileInput);

        fileInput.setError(undefined);

        expect(fileInput.classList.contains('dos-file-input--error')).toBe(false);
        const errorEl = fileInput.querySelector('.dos-file-input__error');
        expect(errorEl).toBeNull();
      });

      it('updates error message', () => {
        const fileInput = createFileInput({ error: 'Initial error' });
        container.appendChild(fileInput);

        fileInput.setError('New error');

        const errorEl = fileInput.querySelector('.dos-file-input__error');
        expect(errorEl?.textContent).toBe('New error');
      });
    });

    describe('destroy()', () => {
      it('removes element from DOM', () => {
        const fileInput = createFileInput();
        container.appendChild(fileInput);

        fileInput.destroy();

        expect(container.contains(fileInput)).toBe(false);
      });
    });
  });

  describe('keyboard navigation', () => {
    it('opens dialog on Enter key in dropzone', () => {
      const fileInput = createFileInput({ dragDrop: true });
      container.appendChild(fileInput);

      const dropzone = fileInput.querySelector('.dos-file-input__dropzone') as HTMLElement;
      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = vi.spyOn(input, 'click');

      dropzone.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(clickSpy).toHaveBeenCalled();
    });

    it('opens dialog on Space key in dropzone', () => {
      const fileInput = createFileInput({ dragDrop: true });
      container.appendChild(fileInput);

      const dropzone = fileInput.querySelector('.dos-file-input__dropzone') as HTMLElement;
      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = vi.spyOn(input, 'click');

      dropzone.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('single vs multiple selection', () => {
    it('replaces file in single mode', () => {
      const fileInput = createFileInput({ multiple: false });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;

      selectFilesWithMockList(input, [createMockFile('file1.txt', 100, 'text/plain')]);
      expect(fileInput.getFiles()).toHaveLength(1);
      expect(fileInput.getFiles()[0].name).toBe('file1.txt');

      selectFilesWithMockList(input, [createMockFile('file2.txt', 100, 'text/plain')]);
      expect(fileInput.getFiles()).toHaveLength(1);
      expect(fileInput.getFiles()[0].name).toBe('file2.txt');
    });

    it('accumulates files in multiple mode', () => {
      const fileInput = createFileInput({ multiple: true });
      container.appendChild(fileInput);

      const input = fileInput.querySelector('input[type="file"]') as HTMLInputElement;

      selectFilesWithMockList(input, [createMockFile('file1.txt', 100, 'text/plain')]);
      expect(fileInput.getFiles()).toHaveLength(1);

      selectFilesWithMockList(input, [createMockFile('file2.txt', 100, 'text/plain')]);
      expect(fileInput.getFiles()).toHaveLength(2);
    });
  });
});
