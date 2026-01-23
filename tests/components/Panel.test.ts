/**
 * Panel Component Tests
 */

import { describe, it, expect, afterEach } from 'vitest';
import { createPanel, getPanelContent } from '../../src/components/Panel';

describe('Panel', () => {
  let panel: HTMLElement | null = null;

  afterEach(() => {
    if (panel && panel.parentNode) {
      panel.remove();
    }
    panel = null;
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      panel = createPanel();

      expect(panel).toBeInstanceOf(HTMLElement);
      expect(panel.tagName).toBe('DIV');
      expect(panel.classList.contains('dos-panel')).toBe(true);
    });

    it('renders with default single border', () => {
      panel = createPanel();

      expect(panel.classList.contains('dos-panel--single')).toBe(true);
    });

    it('applies custom className', () => {
      panel = createPanel({ className: 'my-panel' });

      expect(panel.classList.contains('dos-panel')).toBe(true);
      expect(panel.classList.contains('my-panel')).toBe(true);
    });

    it('applies custom id', () => {
      panel = createPanel({ id: 'my-panel' });

      expect(panel.id).toBe('my-panel');
    });

    it('creates content area', () => {
      panel = createPanel();
      const content = getPanelContent(panel);

      expect(content).not.toBeNull();
      expect(content?.classList.contains('dos-panel__content')).toBe(true);
    });
  });

  describe('title', () => {
    it('renders without title by default', () => {
      panel = createPanel();
      const title = panel.querySelector('.dos-panel__title');

      expect(title).toBeNull();
    });

    it('renders title when provided', () => {
      panel = createPanel({ title: 'System Info' });
      const title = panel.querySelector('.dos-panel__title');

      expect(title).not.toBeNull();
      expect(title?.textContent).toBe('System Info');
    });

    it('sets ARIA attributes when title present', () => {
      panel = createPanel({ title: 'Test Panel' });

      expect(panel.getAttribute('role')).toBe('region');
      expect(panel.hasAttribute('aria-labelledby')).toBe(true);

      const titleId = panel.getAttribute('aria-labelledby');
      const title = panel.querySelector(`#${titleId}`);
      expect(title?.textContent).toBe('Test Panel');
    });
  });

  describe('border styles', () => {
    it('applies single border style', () => {
      panel = createPanel({ borderStyle: 'single' });

      expect(panel.classList.contains('dos-panel--single')).toBe(true);
    });

    it('applies double border style', () => {
      panel = createPanel({ borderStyle: 'double' });

      expect(panel.classList.contains('dos-panel--double')).toBe(true);
    });

    it('applies thick border style', () => {
      panel = createPanel({ borderStyle: 'thick' });

      expect(panel.classList.contains('dos-panel--thick')).toBe(true);
    });

    it('applies no border style', () => {
      panel = createPanel({ borderStyle: 'none' });

      expect(panel.classList.contains('dos-panel--none')).toBe(true);
    });
  });

  describe('shadow', () => {
    it('has no shadow by default', () => {
      panel = createPanel();

      expect(panel.classList.contains('dos-panel--shadow')).toBe(false);
    });

    it('applies shadow class when enabled', () => {
      panel = createPanel({ shadow: true });

      expect(panel.classList.contains('dos-panel--shadow')).toBe(true);
    });
  });

  describe('padding', () => {
    it('applies default padding (md)', () => {
      panel = createPanel();

      expect(panel.classList.contains('dos-panel--padding-md')).toBe(true);
    });

    it('applies preset padding values', () => {
      const presets = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

      presets.forEach((preset) => {
        panel = createPanel({ padding: preset });
        expect(panel.classList.contains(`dos-panel--padding-${preset}`)).toBe(true);
      });
    });

    it('applies custom padding to content area', () => {
      panel = createPanel({ padding: 32 });
      const content = getPanelContent(panel);

      expect(content?.style.padding).toBe('32px');
    });
  });

  describe('getPanelContent helper', () => {
    it('returns content element from panel', () => {
      panel = createPanel();
      const content = getPanelContent(panel);

      expect(content).toBeInstanceOf(HTMLElement);
      expect(content?.classList.contains('dos-panel__content')).toBe(true);
    });

    it('returns null for non-panel element', () => {
      const div = document.createElement('div');
      const content = getPanelContent(div);

      expect(content).toBeNull();
    });
  });
});
