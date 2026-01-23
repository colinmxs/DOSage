/**
 * CodeBlock Component Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createCodeBlock } from '../../src/components/CodeBlock/CodeBlock';

describe('CodeBlock', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('rendering', () => {
    it('renders code content', () => {
      const code = 'const x = 42;';
      const codeBlock = createCodeBlock({ code });

      container.appendChild(codeBlock);

      expect(codeBlock.textContent).toContain('const x = 42;');
      expect(codeBlock.className).toContain('dos-codeblock');
    });

    it('renders with ARIA attributes', () => {
      const codeBlock = createCodeBlock({ code: 'test' });

      expect(codeBlock.getAttribute('role')).toBe('region');
      expect(codeBlock.getAttribute('aria-label')).toBe('Code block');
    });

    it('line numbers display correctly when enabled', () => {
      const code = 'line 1\nline 2\nline 3';
      const codeBlock = createCodeBlock({
        code,
        lineNumbers: true,
      });

      container.appendChild(codeBlock);

      const lineNumbers = codeBlock.querySelectorAll('.dos-codeblock___line-number');
      expect(lineNumbers.length).toBe(3);
      expect(lineNumbers[0].textContent).toContain('1');
      expect(lineNumbers[1].textContent).toContain('2');
      expect(lineNumbers[2].textContent).toContain('3');
    });

    it('line numbers start from custom startLine', () => {
      const code = 'line 1\nline 2';
      const codeBlock = createCodeBlock({
        code,
        lineNumbers: true,
        startLine: 10,
      });

      container.appendChild(codeBlock);

      const lineNumbers = codeBlock.querySelectorAll('.dos-codeblock___line-number');
      expect(lineNumbers[0].textContent).toContain('10');
      expect(lineNumbers[1].textContent).toContain('11');
    });

    it('no line numbers when lineNumbers is false', () => {
      const codeBlock = createCodeBlock({
        code: 'test',
        lineNumbers: false,
      });

      const lineNumbers = codeBlock.querySelectorAll('.dos-codeblock___line-number');
      expect(lineNumbers.length).toBe(0);
    });

    it('highlighted lines have correct class', () => {
      const code = 'line 1\nline 2\nline 3';
      const codeBlock = createCodeBlock({
        code,
        highlightLines: [2],
      });

      const lines = codeBlock.querySelectorAll('.dos-codeblock___line');
      expect(lines[1].className).toContain('dos-codeblock___line--highlighted');
      expect(lines[0].className).not.toContain('dos-codeblock___line--highlighted');
      expect(lines[2].className).not.toContain('dos-codeblock___line--highlighted');
    });

    it('copy button renders when copyButton is true', () => {
      const codeBlock = createCodeBlock({
        code: 'test',
        copyButton: true,
      });

      const copyBtn = codeBlock.querySelector('.dos-codeblock___copy-btn');
      expect(copyBtn).toBeTruthy();
      expect(copyBtn?.textContent).toBe('Copy');
      expect(copyBtn?.getAttribute('aria-label')).toBe('Copy code to clipboard');
    });

    it('no copy button when copyButton is false', () => {
      const codeBlock = createCodeBlock({
        code: 'test',
        copyButton: false,
      });

      const copyBtn = codeBlock.querySelector('.dos-codeblock___copy-btn');
      expect(copyBtn).toBeFalsy();
    });

    it('applies maxHeight style', () => {
      const codeBlock = createCodeBlock({
        code: 'test',
        maxHeight: '200px',
      });

      const pre = codeBlock.querySelector('.dos-codeblock___pre') as HTMLElement;
      expect(pre.style.maxHeight).toBe('200px');
      expect(pre.style.overflowY).toBe('auto');
    });

    it('applies maxHeight as number', () => {
      const codeBlock = createCodeBlock({
        code: 'test',
        maxHeight: 300,
      });

      const pre = codeBlock.querySelector('.dos-codeblock___pre') as HTMLElement;
      expect(pre.style.maxHeight).toBe('300px');
    });

    it('applies language data attribute', () => {
      const codeBlock = createCodeBlock({
        code: 'const x = 1;',
        language: 'javascript',
      });

      const code = codeBlock.querySelector('.dos-codeblock___code');
      expect(code?.getAttribute('data-language')).toBe('javascript');
    });

    it('applies custom className', () => {
      const codeBlock = createCodeBlock({
        code: 'test',
        className: 'custom-class',
      });

      expect(codeBlock.className).toContain('custom-class');
      expect(codeBlock.className).toContain('dos-codeblock');
    });

    it('applies id attribute', () => {
      const codeBlock = createCodeBlock({
        code: 'test',
        id: 'test-codeblock',
      });

      expect(codeBlock.id).toBe('test-codeblock');
    });
  });

  describe('copy functionality', () => {
    it('copy button copies to clipboard', async () => {
      const code = 'test code';
      const codeBlock = createCodeBlock({
        code,
        copyButton: true,
      });

      container.appendChild(codeBlock);

      const copyBtn = codeBlock.querySelector('.dos-codeblock___copy-btn') as HTMLButtonElement;
      copyBtn.click();

      await vi.waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(code);
      });
    });

    it('copy button shows feedback on success', async () => {
      const codeBlock = createCodeBlock({
        code: 'test',
        copyButton: true,
      });

      const copyBtn = codeBlock.querySelector('.dos-codeblock___copy-btn') as HTMLButtonElement;
      expect(copyBtn.textContent).toBe('Copy');

      copyBtn.click();

      await vi.waitFor(() => {
        expect(copyBtn.textContent).toBe('Copied!');
      });
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      const codeBlock = createCodeBlock({ code: 'test' });

      expect(codeBlock.getAttribute('role')).toBe('region');
      expect(codeBlock.getAttribute('aria-label')).toBe('Code block');
    });

    it('line numbers are aria-hidden', () => {
      const codeBlock = createCodeBlock({
        code: 'test',
        lineNumbers: true,
      });

      const lineNumber = codeBlock.querySelector('.dos-codeblock___line-number');
      expect(lineNumber?.getAttribute('aria-hidden')).toBe('true');
    });

    it('copy button has aria-label', () => {
      const codeBlock = createCodeBlock({
        code: 'test',
        copyButton: true,
      });

      const copyBtn = codeBlock.querySelector('.dos-codeblock___copy-btn');
      expect(copyBtn?.getAttribute('aria-label')).toBe('Copy code to clipboard');
    });
  });
});
