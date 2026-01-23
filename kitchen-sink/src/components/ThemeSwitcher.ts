/**
 * Kitchen Sink Theme Switcher Component
 */

import { presetThemes } from '../../../src/theme';

export function renderThemeSwitcher(currentTheme: string): string {
  const themeButtons = Object.keys(presetThemes).map(themeName => {
    const isActive = themeName === currentTheme;
    return `
      <button 
        class="theme-button ${isActive ? 'active' : ''}"
        data-theme="${themeName}"
      >
        ${isActive ? '◆ ' : ''}${themeName}
      </button>
    `;
  }).join('');

  return `
    <div class="theme-switcher">
      <h2>▼ THEME SWITCHER</h2>
      <div class="theme-buttons">
        ${themeButtons}
      </div>
    </div>
  `;
}
