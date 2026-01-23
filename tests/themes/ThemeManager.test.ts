/**
 * Placeholder for ThemeManager tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeManager, initTheme } from '../../src/themes/ThemeManager';

describe('ThemeManager', () => {
  beforeEach(() => {
    // Reset theme before each test
    document.documentElement.removeAttribute('data-dos-theme');
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-dos-theme');
    localStorage.clear();
  });

  describe('setTheme', () => {
    it('applies data attribute to document root', () => {
      ThemeManager.setTheme('amber');
      expect(document.documentElement.getAttribute('data-dos-theme')).toBe('amber');
    });

    it('applies data attribute to specific scope', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      ThemeManager.setTheme('green-phosphor', element);
      expect(element.getAttribute('data-dos-theme')).toBe('green-phosphor');

      element.remove();
    });

    it('persists theme to localStorage', () => {
      ThemeManager.setTheme('cga');
      expect(localStorage.getItem('dos-theme')).toBe('cga');
    });

    it('dispatches theme change event', () => {
      let eventDetail: { theme: string } | null = null;

      document.addEventListener('dos:theme:change', ((e: CustomEvent) => {
        eventDetail = e.detail;
      }) as EventListener, { once: true });

      ThemeManager.setTheme('amber');
      expect(eventDetail).toEqual({ theme: 'amber', scope: document.documentElement });
    });
  });

  describe('getTheme', () => {
    it('returns current theme', () => {
      ThemeManager.setTheme('dos-blue');
      expect(ThemeManager.getTheme()).toBe('dos-blue');
    });

    it('returns default theme when none set', () => {
      expect(ThemeManager.getTheme()).toBe('dos-blue');
    });

    it('returns theme from specific scope', () => {
      const element = document.createElement('div');
      element.setAttribute('data-dos-theme', 'amber');

      expect(ThemeManager.getTheme(element)).toBe('amber');
    });
  });

  describe('hasTheme', () => {
    it('returns true for preset themes', () => {
      expect(ThemeManager.hasTheme('dos-blue')).toBe(true);
      expect(ThemeManager.hasTheme('amber')).toBe(true);
      expect(ThemeManager.hasTheme('green-phosphor')).toBe(true);
      expect(ThemeManager.hasTheme('cga')).toBe(true);
    });

    it('returns false for unknown themes', () => {
      expect(ThemeManager.hasTheme('unknown')).toBe(false);
    });
  });

  describe('getAvailableThemes', () => {
    it('returns list of preset themes', () => {
      const themes = ThemeManager.getAvailableThemes();
      expect(themes).toContain('dos-blue');
      expect(themes).toContain('amber');
      expect(themes).toContain('green-phosphor');
      expect(themes).toContain('cga');
    });
  });

  describe('initTheme', () => {
    it('applies default theme when no preference', () => {
      const theme = initTheme();
      expect(theme).toBe('dos-blue');
      expect(document.documentElement.getAttribute('data-dos-theme')).toBe('dos-blue');
    });

    it('restores saved theme from localStorage', () => {
      localStorage.setItem('dos-theme', 'amber');
      const theme = initTheme();
      expect(theme).toBe('amber');
    });
  });
});
