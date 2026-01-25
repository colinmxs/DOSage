/**
 * FileInput Component
 *
 * DOS-style file input with drag and drop support.
 */

import type { FileInputProps, FileInputElement } from './FileInput.types';
import './FileInput.css';

let fileInputIdCounter = 0;

/**
 * Generates a unique ID for file input elements.
 */
function generateFileInputId(): string {
  return `dos-file-input-${++fileInputIdCounter}`;
}

/**
 * Formats file size to human-readable string.
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Creates a DOS-style file input component.
 *
 * @param props - FileInput configuration options
 * @returns FileInput DOM element with control methods
 *
 * @example
 * ```typescript
 * const fileInput = createFileInput({
 *   label: 'Upload File',
 *   accept: '.txt,.pdf',
 *   dragDrop: true,
 *   onChange: (files) => console.log('Selected:', files)
 * });
 * document.body.appendChild(fileInput);
 * ```
 */
export function createFileInput(props: FileInputProps = {}): FileInputElement {
  const {
    accept,
    multiple = false,
    label,
    buttonLabel = 'Browse...',
    dragDrop = false,
    dropzoneText = 'Drop files here or click to browse',
    showFileList = true,
    maxSize,
    maxFiles,
    size = 'md',
    name,
    disabled = false,
    error,
    onChange,
    onReject,
    onRemove,
    className,
    id,
  } = props;

  // State
  let selectedFiles: File[] = [];
  let isDisabled = disabled;
  let isDragOver = false;
  // Handle error: can be string, boolean, or undefined
  let currentError: string | boolean | undefined = error;

  // Generate unique ID
  const fileInputId = id ?? generateFileInputId();
  const inputId = `${fileInputId}-input`;
  const labelId = `${fileInputId}-label`;
  const errorId = `${fileInputId}-error`;

  // Create wrapper element
  const wrapper = document.createElement('div') as unknown as FileInputElement;
  wrapper.id = fileInputId;
  wrapper.className = buildWrapperClasses();

  // Create label if provided
  if (label) {
    const labelEl = document.createElement('label');
    labelEl.id = labelId;
    labelEl.className = 'dos-file-input__label';
    labelEl.htmlFor = inputId;
    labelEl.textContent = label;
    wrapper.appendChild(labelEl);
  }

  // Create native file input (hidden)
  const input = document.createElement('input');
  input.type = 'file';
  input.id = inputId;
  input.className = 'dos-file-input__input';
  input.setAttribute('aria-hidden', 'true');
  input.tabIndex = -1;
  if (accept) input.accept = accept;
  if (multiple) input.multiple = true;
  if (name) input.name = name;
  if (isDisabled) input.disabled = true;
  wrapper.appendChild(input);

  // Create UI based on mode
  let filenameDisplay: HTMLSpanElement | null = null;
  let dropzone: HTMLDivElement | null = null;
  let fileList: HTMLDivElement | null = null;

  if (dragDrop) {
    // Drag and drop mode
    dropzone = document.createElement('div');
    dropzone.className = 'dos-file-input__dropzone';
    dropzone.setAttribute('role', 'button');
    dropzone.setAttribute('tabindex', isDisabled ? '-1' : '0');
    dropzone.setAttribute('aria-describedby', accept ? `${fileInputId}-accept-desc` : '');

    const icon = document.createElement('div');
    icon.className = 'dos-file-input__dropzone-icon';
    icon.textContent = '📁';
    icon.setAttribute('aria-hidden', 'true');
    dropzone.appendChild(icon);

    const text = document.createElement('div');
    text.className = 'dos-file-input__dropzone-text';
    text.textContent = dropzoneText;
    dropzone.appendChild(text);

    if (accept) {
      const hint = document.createElement('div');
      hint.id = `${fileInputId}-accept-desc`;
      hint.className = 'dos-file-input__dropzone-hint';
      hint.textContent = `Accepts: ${accept}`;
      dropzone.appendChild(hint);
    }

    // Dropzone event listeners
    dropzone.addEventListener('click', handleBrowseClick);
    dropzone.addEventListener('keydown', handleDropzoneKeydown);
    dropzone.addEventListener('dragenter', handleDragEnter);
    dropzone.addEventListener('dragover', handleDragOver);
    dropzone.addEventListener('dragleave', handleDragLeave);
    dropzone.addEventListener('drop', handleDrop);

    wrapper.appendChild(dropzone);
  } else {
    // Classic button + filename mode
    const row = document.createElement('div');
    row.className = 'dos-file-input__row';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dos-file-input__button';
    button.textContent = `[${buttonLabel}]`;
    button.disabled = isDisabled;
    button.addEventListener('click', handleBrowseClick);
    row.appendChild(button);

    filenameDisplay = document.createElement('span');
    filenameDisplay.className = 'dos-file-input__filename';
    filenameDisplay.textContent = 'No file selected';
    row.appendChild(filenameDisplay);

    wrapper.appendChild(row);
  }

  // Create file list container
  if (showFileList) {
    fileList = document.createElement('div');
    fileList.className = 'dos-file-input__file-list';
    fileList.setAttribute('role', 'list');
    fileList.setAttribute('aria-label', 'Selected files');
    wrapper.appendChild(fileList);
  }

  // Create error message element
  let errorEl: HTMLDivElement | null = null;
  if (currentError) {
    errorEl = createErrorElement();
    wrapper.appendChild(errorEl);
  }

  // Input change handler
  input.addEventListener('change', handleFileChange);

  /**
   * Builds the wrapper class string.
   */
  function buildWrapperClasses(): string {
    const classes = ['dos-file-input'];
    classes.push(`dos-file-input--${size}`);
    if (dragDrop) classes.push('dos-file-input--dropzone');
    if (isDragOver) classes.push('dos-file-input--dragover');
    if (isDisabled) classes.push('dos-file-input--disabled');
    if (currentError) classes.push('dos-file-input--error');
    if (className) classes.push(className);
    return classes.join(' ');
  }

  /**
   * Creates an error message element.
   */
  function createErrorElement(): HTMLDivElement {
    const el = document.createElement('div');
    el.id = errorId;
    el.className = 'dos-file-input__error';
    // Only show text for string errors, not boolean true
    el.textContent = typeof currentError === 'string' ? currentError : '';
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'polite');
    return el;
  }

  /**
   * Updates the wrapper classes.
   */
  function updateClasses(): void {
    wrapper.className = buildWrapperClasses();
  }

  /**
   * Updates the filename display.
   */
  function updateFilenameDisplay(): void {
    if (!filenameDisplay) return;

    if (selectedFiles.length === 0) {
      filenameDisplay.textContent = 'No file selected';
      filenameDisplay.classList.remove('dos-file-input__filename--has-files');
    } else if (selectedFiles.length === 1) {
      const firstFile = selectedFiles[0];
      if (firstFile) {
        filenameDisplay.textContent = firstFile.name;
      }
      filenameDisplay.classList.add('dos-file-input__filename--has-files');
    } else {
      filenameDisplay.textContent = `${selectedFiles.length} files selected`;
      filenameDisplay.classList.add('dos-file-input__filename--has-files');
    }
  }

  /**
   * Updates the file list display.
   */
  function updateFileList(): void {
    if (!fileList) return;

    fileList.innerHTML = '';

    selectedFiles.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'dos-file-input__file-item';
      item.setAttribute('role', 'listitem');

      const info = document.createElement('div');
      info.className = 'dos-file-input__file-info';

      const fileName = document.createElement('span');
      fileName.className = 'dos-file-input__file-name';
      fileName.textContent = file.name;
      info.appendChild(fileName);

      const fileSize = document.createElement('span');
      fileSize.className = 'dos-file-input__file-size';
      fileSize.textContent = formatFileSize(file.size);
      info.appendChild(fileSize);

      item.appendChild(info);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'dos-file-input__file-remove';
      removeBtn.textContent = '[X]';
      removeBtn.title = 'Remove file';
      removeBtn.disabled = isDisabled;
      removeBtn.addEventListener('click', () => removeFile(index));
      item.appendChild(removeBtn);

      fileList.appendChild(item);
    });
  }

  /**
   * Validates a file against constraints.
   */
  function validateFile(file: File): string | null {
    // Check file size
    if (maxSize && file.size > maxSize) {
      return `File too large (max ${formatFileSize(maxSize)})`;
    }

    // Check accept pattern (basic validation)
    if (accept) {
      const patterns = accept.split(',').map((p) => p.trim().toLowerCase());
      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();

      const matches = patterns.some((pattern) => {
        if (pattern.startsWith('.')) {
          // Extension match
          return fileName.endsWith(pattern);
        } else if (pattern.endsWith('/*')) {
          // MIME type wildcard (e.g., image/*)
          const prefix = pattern.slice(0, -2);
          return fileType.startsWith(prefix);
        } else {
          // Exact MIME type
          return fileType === pattern;
        }
      });

      if (!matches) {
        return `Invalid file type (accepts: ${accept})`;
      }
    }

    return null;
  }

  /**
   * Processes files from input or drop.
   */
  function processFiles(files: FileList | File[]): void {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        onReject?.(file, error);
      } else {
        validFiles.push(file);
      }
    }

    // Apply maxFiles limit
    let filesToAdd = validFiles;
    if (maxFiles) {
      const remaining = maxFiles - selectedFiles.length;
      if (remaining <= 0) {
        validFiles.forEach((file) => onReject?.(file, 'Maximum files reached'));
        return;
      }
      if (validFiles.length > remaining) {
        filesToAdd = validFiles.slice(0, remaining);
        validFiles.slice(remaining).forEach((file) => onReject?.(file, 'Maximum files reached'));
      }
    }

    if (multiple) {
      selectedFiles = [...selectedFiles, ...filesToAdd];
    } else {
      selectedFiles = filesToAdd.slice(0, 1);
    }

    updateFilenameDisplay();
    updateFileList();
    onChange?.(selectedFiles);
  }

  /**
   * Removes a file by index.
   */
  function removeFile(index: number): void {
    if (isDisabled) return;

    const removed = selectedFiles[index];
    selectedFiles = selectedFiles.filter((_, i) => i !== index);

    updateFilenameDisplay();
    updateFileList();
    if (removed) {
      onRemove?.(removed);
    }
    onChange?.(selectedFiles);
  }

  /**
   * Handles browse button click.
   */
  function handleBrowseClick(): void {
    if (isDisabled) return;
    input.click();
  }

  /**
   * Handles dropzone keyboard events.
   */
  function handleDropzoneKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBrowseClick();
    }
  }

  /**
   * Handles file input change.
   */
  function handleFileChange(): void {
    if (input.files && input.files.length > 0) {
      processFiles(input.files);
    }
    // Reset input so same file can be selected again
    input.value = '';
  }

  /**
   * Handles drag enter.
   */
  function handleDragEnter(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled) return;
    isDragOver = true;
    updateClasses();
  }

  /**
   * Handles drag over.
   */
  function handleDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * Handles drag leave.
   */
  function handleDragLeave(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled) return;

    // Only set dragOver to false if we're leaving the dropzone entirely
    const rect = dropzone?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX;
      const y = e.clientY;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        isDragOver = false;
        updateClasses();
      }
    }
  }

  /**
   * Handles drop event.
   */
  function handleDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();

    isDragOver = false;
    updateClasses();

    if (isDisabled) return;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }

  // Public API methods
  wrapper.getFiles = (): File[] => [...selectedFiles];

  wrapper.clear = (): void => {
    selectedFiles = [];
    updateFilenameDisplay();
    updateFileList();
    onChange?.([]);
  };

  wrapper.browse = (): void => {
    handleBrowseClick();
  };

  wrapper.setDisabled = (newDisabled: boolean): void => {
    isDisabled = newDisabled;
    input.disabled = isDisabled;

    // Update button if exists
    const button = wrapper.querySelector('.dos-file-input__button') as HTMLButtonElement | null;
    if (button) button.disabled = isDisabled;

    // Update dropzone if exists
    if (dropzone) {
      dropzone.setAttribute('tabindex', isDisabled ? '-1' : '0');
    }

    // Update remove buttons
    wrapper.querySelectorAll('.dos-file-input__file-remove').forEach((btn) => {
      (btn as HTMLButtonElement).disabled = isDisabled;
    });

    updateClasses();
  };

  wrapper.setError = (newError: string | undefined): void => {
    currentError = newError;

    // Remove existing error
    const existingError = wrapper.querySelector('.dos-file-input__error');
    if (existingError) existingError.remove();

    // Add new error if needed
    if (currentError) {
      const newErrorEl = createErrorElement();
      wrapper.appendChild(newErrorEl);
    }

    updateClasses();
  };

  wrapper.destroy = (): void => {
    input.removeEventListener('change', handleFileChange);
    if (dropzone) {
      dropzone.removeEventListener('click', handleBrowseClick);
      dropzone.removeEventListener('keydown', handleDropzoneKeydown);
      dropzone.removeEventListener('dragenter', handleDragEnter);
      dropzone.removeEventListener('dragover', handleDragOver);
      dropzone.removeEventListener('dragleave', handleDragLeave);
      dropzone.removeEventListener('drop', handleDrop);
    }
    wrapper.remove();
  };

  return wrapper;
}
