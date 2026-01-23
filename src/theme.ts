/**
 * DOSage Theme System
 * 
 * Core theming infrastructure for the DOSage component library.
 * Supports multiple preset themes and custom theme configurations.
 */

export interface DOSageTheme {
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    selection: string;
    focus: string;
    disabled: string;
    error: string;
    warning: string;
    success: string;
  };
  fonts: {
    mono: string;
  };
  effects?: {
    scanlines?: boolean;
    crt?: boolean;
  };
}

// Default DOS Blue theme
export const dosBlueTheme: DOSageTheme = {
  name: 'DOS Blue',
  colors: {
    background: '#0000AA',
    foreground: '#FFFFFF',
    primary: '#00AAAA',
    secondary: '#AAAAAA',
    accent: '#FFFF55',
    border: '#FFFFFF',
    selection: '#FFFFFF',
    focus: '#55FFFF',
    disabled: '#555555',
    error: '#FF5555',
    warning: '#FFAA00',
    success: '#55FF55',
  },
  fonts: {
    mono: '"Courier New", Courier, monospace',
  },
  effects: {
    scanlines: false,
    crt: false,
  },
};

// Amber Monochrome theme
export const amberTheme: DOSageTheme = {
  name: 'Amber Monochrome',
  colors: {
    background: '#000000',
    foreground: '#FFAA00',
    primary: '#FFAA00',
    secondary: '#AA7700',
    accent: '#FFDD55',
    border: '#FFAA00',
    selection: '#FFAA00',
    focus: '#FFDD55',
    disabled: '#664400',
    error: '#FF5555',
    warning: '#FFAA00',
    success: '#FFDD55',
  },
  fonts: {
    mono: '"Courier New", Courier, monospace',
  },
  effects: {
    scanlines: true,
    crt: false,
  },
};

// Green Phosphor theme
export const greenPhosphorTheme: DOSageTheme = {
  name: 'Green Phosphor',
  colors: {
    background: '#001100',
    foreground: '#00FF00',
    primary: '#00AA00',
    secondary: '#007700',
    accent: '#55FF55',
    border: '#00FF00',
    selection: '#00FF00',
    focus: '#55FF55',
    disabled: '#003300',
    error: '#FF5555',
    warning: '#FFAA00',
    success: '#00FF00',
  },
  fonts: {
    mono: '"Courier New", Courier, monospace',
  },
  effects: {
    scanlines: true,
    crt: false,
  },
};

// Black & White theme
export const blackAndWhiteTheme: DOSageTheme = {
  name: 'Black & White',
  colors: {
    background: '#000000',
    foreground: '#FFFFFF',
    primary: '#FFFFFF',
    secondary: '#AAAAAA',
    accent: '#FFFFFF',
    border: '#FFFFFF',
    selection: '#FFFFFF',
    focus: '#CCCCCC',
    disabled: '#555555',
    error: '#FFFFFF',
    warning: '#FFFFFF',
    success: '#FFFFFF',
  },
  fonts: {
    mono: '"Courier New", Courier, monospace',
  },
  effects: {
    scanlines: false,
    crt: false,
  },
};

export const presetThemes = {
  'dos-blue': dosBlueTheme,
  'amber': amberTheme,
  'green-phosphor': greenPhosphorTheme,
  'black-and-white': blackAndWhiteTheme,
};

/**
 * Apply a theme to the document
 */
export function applyTheme(theme: DOSageTheme | string): void {
  const themeObj = typeof theme === 'string' ? presetThemes[theme as keyof typeof presetThemes] : theme;
  
  if (!themeObj) {
    console.error(`Theme not found: ${theme}`);
    return;
  }

  const root = document.documentElement;
  
  // Apply color custom properties
  Object.entries(themeObj.colors).forEach(([key, value]) => {
    root.style.setProperty(`--dosage-color-${key}`, value);
  });
  
  // Apply font custom properties
  root.style.setProperty('--dosage-font-mono', themeObj.fonts.mono);
  
  // Apply effects
  if (themeObj.effects) {
    root.setAttribute('data-dosage-scanlines', themeObj.effects.scanlines ? 'true' : 'false');
    root.setAttribute('data-dosage-crt', themeObj.effects.crt ? 'true' : 'false');
  }
  
  // Store current theme name
  root.setAttribute('data-dosage-theme', themeObj.name);
}

/**
 * Get the currently active theme name
 */
export function getCurrentTheme(): string | null {
  return document.documentElement.getAttribute('data-dosage-theme');
}

/**
 * Initialize the theme system with a default theme
 */
export function initTheme(themeName: string = 'dos-blue'): void {
  applyTheme(themeName);
}
