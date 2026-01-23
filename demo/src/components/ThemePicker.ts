/**
 * ThemePicker Component
 *
 * Dropdown for selecting themes in the Kitchen Sink demo.
 */

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

  // Set initial value from document
  const currentTheme = document.documentElement.getAttribute('data-dos-theme') ?? 'dos-blue';
  select.value = currentTheme;

  // Handle theme change
  select.addEventListener('change', () => {
    const theme = select.value;
    document.documentElement.setAttribute('data-dos-theme', theme);

    // Persist to localStorage
    try {
      localStorage.setItem('dos-theme', theme);
    } catch {
      // localStorage may not be available
    }

    // Dispatch custom event
    const event = new CustomEvent('dos:theme:change', {
      detail: { theme },
      bubbles: true,
    });
    document.dispatchEvent(event);
  });

  container.appendChild(label);
  container.appendChild(select);

  return container;
}
