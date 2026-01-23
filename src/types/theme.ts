/**
 * Theme type definitions for DOSage
 */

/**
 * Available preset theme names
 */
export type ThemePreset = 'dos-blue' | 'amber' | 'green-phosphor' | 'cga';

/**
 * Theme color configuration
 */
export interface ThemeColors {
  /** Main background color */
  bg: string;
  /** Main foreground/text color */
  fg: string;
  /** Primary accent color (highlights, links) */
  primary: string;
  /** Secondary accent color */
  secondary: string;
  /** Border color */
  border: string;
  /** Highlight/selection color */
  highlight: string;
  /** Shadow color */
  shadow: string;
  /** Disabled element color */
  disabled: string;
  /** Error/danger color */
  error: string;
  /** Success color */
  success: string;
}

/**
 * Theme spacing configuration
 */
export interface ThemeSpacing {
  /** Base spacing unit (typically 8px) */
  unit: string;
  /** Extra small spacing */
  xs: string;
  /** Small spacing */
  sm: string;
  /** Medium spacing (default) */
  md: string;
  /** Large spacing */
  lg: string;
  /** Extra large spacing */
  xl: string;
}

/**
 * Theme typography configuration
 */
export interface ThemeTypography {
  /** Primary font family */
  fontFamily: string;
  /** Base font size */
  fontSize: string;
  /** Small font size */
  fontSizeSm: string;
  /** Large font size */
  fontSizeLg: string;
  /** Base line height */
  lineHeight: string;
}

/**
 * Complete theme configuration
 */
export interface ThemeConfig {
  /** Theme name identifier */
  name: string;
  /** Color palette */
  colors: ThemeColors;
  /** Spacing scale */
  spacing: ThemeSpacing;
  /** Typography settings */
  typography: ThemeTypography;
}

/**
 * Partial theme configuration for customization
 */
export type PartialThemeConfig = {
  name?: string;
  colors?: Partial<ThemeColors>;
  spacing?: Partial<ThemeSpacing>;
  typography?: Partial<ThemeTypography>;
};
