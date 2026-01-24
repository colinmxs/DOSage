/**
 * FileInput Component Types
 *
 * DOS-style file input with drag and drop support.
 */

/**
 * Size variants for the file input component.
 */
export type FileInputSize = 'sm' | 'md' | 'lg';

/**
 * Props for the FileInput component.
 */
export interface FileInputProps {
  /**
   * Accepted file types (MIME types or extensions).
   * E.g., "image/*", ".txt,.pdf", "application/json"
   */
  accept?: string;

  /**
   * Allow multiple file selection.
   * @default false
   */
  multiple?: boolean;

  /**
   * Label text for the input.
   */
  label?: string;

  /**
   * Text for the browse button.
   * @default 'Browse...'
   */
  buttonLabel?: string;

  /**
   * Enable drag and drop zone.
   * @default false
   */
  dragDrop?: boolean;

  /**
   * Text shown in the drop zone.
   * @default 'Drop files here or click to browse'
   */
  dropzoneText?: string;

  /**
   * Show list of selected files.
   * @default true
   */
  showFileList?: boolean;

  /**
   * Maximum file size in bytes.
   */
  maxSize?: number;

  /**
   * Maximum number of files allowed.
   */
  maxFiles?: number;

  /**
   * Size variant.
   * @default 'md'
   */
  size?: FileInputSize;

  /**
   * Name attribute for form submission.
   */
  name?: string;

  /**
   * Whether the input is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Error state or message.
   */
  error?: string | boolean;

  /**
   * Callback fired when files are selected.
   */
  onChange?: (files: File[]) => void;

  /**
   * Callback fired when a file is rejected (invalid type/size).
   */
  onReject?: (file: File, reason: string) => void;

  /**
   * Callback fired when a file is removed.
   */
  onRemove?: (file: File) => void;

  /**
   * Additional CSS class names.
   */
  className?: string;

  /**
   * HTML id attribute.
   */
  id?: string;
}

/**
 * Extended HTMLElement with FileInput-specific methods.
 */
export interface FileInputElement extends HTMLElement {
  /**
   * Gets the currently selected files.
   */
  getFiles: () => File[];

  /**
   * Clears all selected files.
   */
  clear: () => void;

  /**
   * Opens the file dialog programmatically.
   */
  browse: () => void;

  /**
   * Sets the disabled state.
   */
  setDisabled: (disabled: boolean) => void;

  /**
   * Sets or clears the error state.
   */
  setError: (error: string | undefined) => void;

  /**
   * Cleans up event listeners and DOM.
   */
  destroy: () => void;
}
