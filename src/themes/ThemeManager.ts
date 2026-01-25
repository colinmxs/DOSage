/**
 * ThemeManager - Runtime theme switching for DOSage
 *
 * Manages theme application, persistence, and custom theme registration.
 */

import type { ThemePreset, ThemeConfig, PartialThemeConfig } from '../types/theme';

/** Storage key for theme persistence */
const STORAGE_KEY = 'dos-theme';

/** Default theme to use when no preference is set */
const DEFAULT_THEME: ThemePreset = 'dos-blue';

/** Registry of custom themes */
const customThemes = new Map<string, ThemeConfig>();

/**
 * ThemeManager provides static methods for managing DOSage themes.
 *
 * @example
 * ```typescript
 * // Set a preset theme
 * ThemeManager.setTheme('amber');
 *
 * // Get current theme
 * const current = ThemeManager.getTheme();
 *
 * // Register a custom theme
 * ThemeManager.registerTheme('my-theme', { ... });
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ThemeManager {
  /**
   * Set the active theme
   *
   * @param theme - Theme name (preset or custom)
   * @param scope - Element to apply theme to (defaults to document root)
   */
  static setTheme(theme: ThemePreset | string, scope?: HTMLElement): void {
    const target = scope ?? document.documentElement;
    target.setAttribute('data-dos-theme', theme);

    // Persist to localStorage if applying to root
    if (!scope) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // localStorage may not be available (e.g., private browsing)
      }
    }

    // Dispatch theme change event
    const event = new CustomEvent('dos:theme:change', {
      detail: { theme, scope: target },
      bubbles: true,
    });
    target.dispatchEvent(event);
  }

  /**
   * Get the current active theme
   *
   * @param scope - Element to read theme from (defaults to document root)
   * @returns Current theme name
   */
  static getTheme(scope?: HTMLElement): string {
    const target = scope ?? document.documentElement;
    return target.getAttribute('data-dos-theme') ?? DEFAULT_THEME;
  }

  /**
   * Register a custom theme
   *
   * @param name - Unique theme name
   * @param config - Theme configuration
   */
  static registerTheme(name: string, config: ThemeConfig): void {
    customThemes.set(name, config);

    // Generate and inject CSS custom properties
    const css = ThemeManager.generateThemeCSS(name, config);
    ThemeManager.injectStyles(name, css);
  }

  /**
   * Apply individual CSS custom properties to a scope
   *
   * @param config - Partial theme configuration
   * @param scope - Element to apply properties to (defaults to document root)
   */
  static applyCustomProperties(
    config: PartialThemeConfig,
    scope?: HTMLElement
  ): void {
    const target = scope ?? document.documentElement;

    if (config.colors) {
      const colorMap: Record<string, string> = {
        bg: '--dos-color-bg',
        fg: '--dos-color-fg',
        primary: '--dos-color-primary',
        secondary: '--dos-color-secondary',
        border: '--dos-color-border',
        highlight: '--dos-color-highlight',
        shadow: '--dos-color-shadow',
        disabled: '--dos-color-disabled',
        error: '--dos-color-error',
        success: '--dos-color-success',
      };

      Object.entries(config.colors).forEach(([key, value]) => {
        const prop = colorMap[key];
        if (prop && value) {
          target.style.setProperty(prop, value);
        }
      });
    }

    if (config.spacing) {
      const spacingMap: Record<string, string> = {
        unit: '--dos-space-unit',
        xs: '--dos-space-xs',
        sm: '--dos-space-sm',
        md: '--dos-space-md',
        lg: '--dos-space-lg',
        xl: '--dos-space-xl',
      };

      Object.entries(config.spacing).forEach(([key, value]) => {
        const prop = spacingMap[key];
        if (prop && value) {
          target.style.setProperty(prop, value);
        }
      });
    }

    if (config.typography) {
      const typoMap: Record<string, string> = {
        fontFamily: '--dos-font-family',
        fontSize: '--dos-font-size',
        fontSizeSm: '--dos-font-size-sm',
        fontSizeLg: '--dos-font-size-lg',
        lineHeight: '--dos-line-height',
      };

      Object.entries(config.typography).forEach(([key, value]) => {
        const prop = typoMap[key];
        if (prop && value) {
          target.style.setProperty(prop, value);
        }
      });
    }
  }

  /**
   * Check if a theme is registered (preset or custom)
   *
   * @param name - Theme name to check
   * @returns True if theme exists
   */
  static hasTheme(name: string): boolean {
    const presets: ThemePreset[] = ['dos-blue', 'amber', 'green-phosphor', 'cga'];
    return presets.includes(name as ThemePreset) || customThemes.has(name);
  }

  /**
   * Get a list of all available theme names
   *
   * @returns Array of theme names
   */
  static getAvailableThemes(): string[] {
    const presets: ThemePreset[] = ['dos-blue', 'amber', 'green-phosphor', 'cga'];
    return [...presets, ...customThemes.keys()];
  }

  /**
   * Generate CSS for a custom theme
   */
  private static generateThemeCSS(name: string, config: ThemeConfig): string {
    const { colors, spacing, typography } = config;

    return `
[data-dos-theme="${name}"] {
  --dos-color-bg: ${colors.bg};
  --dos-color-fg: ${colors.fg};
  --dos-color-primary: ${colors.primary};
  --dos-color-secondary: ${colors.secondary};
  --dos-color-border: ${colors.border};
  --dos-color-highlight: ${colors.highlight};
  --dos-color-shadow: ${colors.shadow};
  --dos-color-disabled: ${colors.disabled};
  --dos-color-error: ${colors.error};
  --dos-color-success: ${colors.success};
  --dos-space-unit: ${spacing.unit};
  --dos-space-xs: ${spacing.xs};
  --dos-space-sm: ${spacing.sm};
  --dos-space-md: ${spacing.md};
  --dos-space-lg: ${spacing.lg};
  --dos-space-xl: ${spacing.xl};
  --dos-font-family: ${typography.fontFamily};
  --dos-font-size: ${typography.fontSize};
  --dos-font-size-sm: ${typography.fontSizeSm};
  --dos-font-size-lg: ${typography.fontSizeLg};
  --dos-line-height: ${typography.lineHeight};
}
    `.trim();
  }

  /**
   * Inject styles into the document
   */
  private static injectStyles(id: string, css: string): void {
    // Remove existing style if present
    const existingStyle = document.getElementById(`dos-theme-${id}`);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and inject new style element
    const style = document.createElement('style');
    style.id = `dos-theme-${id}`;
    style.textContent = css;
    document.head.appendChild(style);
  }
}

/**
 * Initialize the theme system
 *
 * Checks for saved preference, then system preference, then applies default.
 * Should be called on application startup.
 *
 * @returns The theme that was applied
 */
export function initTheme(): string {
  // Check for saved preference
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ThemeManager.hasTheme(saved)) {
      ThemeManager.setTheme(saved);
      return saved;
    }
  } catch {
    // localStorage may not be available
  }

  // Check for system dark mode preference
  // For DOS aesthetic, we always use dark themes, so this is less relevant
  // but we could map to different presets if desired

  // Apply default theme
  ThemeManager.setTheme(DEFAULT_THEME);
  return DEFAULT_THEME;
}
