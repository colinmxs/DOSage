/**
 * ThemePicker Component
 *
 * Dropdown for selecting themes in the Kitchen Sink demo.
 * Uses ThemeManager from the library for proper theme switching.
 */

import { ThemeManager } from 'dosage';

// Theme options
const THEMES = [
  { id: 'dos-blue', label: 'DOS Blue (Default)' },
  { id: 'amber', label: 'Amber Monochrome' },
  { id: 'green-phosphor', label: 'Green Phosphor' },
  { id: 'cga', label: 'CGA' },
];

/**
 * Creates the theme picker element
 */
export function createThemePicker(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'dos-theme-picker';

  const label = document.createElement('label');
  label.className = 'dos-theme-picker___label';
  label.textContent = 'Theme:';
  label.setAttribute('for', 'theme-select');

  const select = document.createElement('select');
  select.className = 'dos-theme-picker___select';
  select.id = 'theme-select';

  THEMES.forEach((theme) => {
    const option = document.createElement('option');
    option.value = theme.id;
    option.textContent = theme.label;
    select.appendChild(option);
  });

  // Set initial value from ThemeManager
  const currentTheme = ThemeManager.getTheme();
  select.value = currentTheme;

  // Handle theme change using ThemeManager
  select.addEventListener('change', () => {
    const theme = select.value;
    ThemeManager.setTheme(theme);
  });

  container.appendChild(label);
  container.appendChild(select);

  return container;
}
