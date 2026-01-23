/**
 * Home Page
 *
 * Welcome page for the DOSage Kitchen Sink demo.
 */

/**
 * Renders the home page content
 */
export function renderHomePage(): HTMLElement {
  const page = document.createElement('div');

  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Welcome to DOSage';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'A TypeScript component library recreating DOS-era interfaces';

  header.appendChild(h1);
  header.appendChild(desc);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // ASCII Art Banner
  const banner = document.createElement('pre');
  banner.style.color = 'var(--dos-color-primary)';
  banner.style.marginBottom = 'var(--dos-space-lg)';
  banner.textContent = `
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   ██████╗  ██████╗ ███████╗ █████╗  ██████╗ ███████╗             ║
║   ██╔══██╗██╔═══██╗██╔════╝██╔══██╗██╔════╝ ██╔════╝             ║
║   ██║  ██║██║   ██║███████╗███████║██║  ███╗█████╗               ║
║   ██║  ██║██║   ██║╚════██║██╔══██║██║   ██║██╔══╝               ║
║   ██████╔╝╚██████╔╝███████║██║  ██║╚██████╔╝███████╗             ║
║   ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝             ║
║                                                                   ║
║   Bringing the nostalgic DOS aesthetic to modern web apps         ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
`;
  content.appendChild(banner);

  // Features section
  const features = document.createElement('div');
  features.innerHTML = `
    <h2 style="color: var(--dos-color-secondary); margin-bottom: var(--dos-space-md);">
      ═══ Features ═══
    </h2>
    <ul style="list-style: none; margin-bottom: var(--dos-space-lg);">
      <li style="margin-bottom: var(--dos-space-sm);">■ Pure TypeScript with comprehensive types</li>
      <li style="margin-bottom: var(--dos-space-sm);">■ Zero runtime dependencies</li>
      <li style="margin-bottom: var(--dos-space-sm);">■ Framework-agnostic (vanilla TS/JS)</li>
      <li style="margin-bottom: var(--dos-space-sm);">■ Full ARIA accessibility support</li>
      <li style="margin-bottom: var(--dos-space-sm);">■ Complete keyboard navigation</li>
      <li style="margin-bottom: var(--dos-space-sm);">■ Multiple theme presets</li>
      <li style="margin-bottom: var(--dos-space-sm);">■ ESM and CommonJS support</li>
    </ul>
  `;
  content.appendChild(features);

  // Quick start section
  const quickStart = document.createElement('div');
  quickStart.innerHTML = `
    <h2 style="color: var(--dos-color-secondary); margin-bottom: var(--dos-space-md);">
      ═══ Quick Start ═══
    </h2>
    <div style="background: var(--dos-color-shadow); padding: var(--dos-space-md); border: 1px solid var(--dos-color-border); margin-bottom: var(--dos-space-lg);">
      <pre style="color: var(--dos-color-primary);"><code>npm install dosage

import { createButton, ThemeManager } from 'dosage';
import 'dosage/css';

// Set theme
ThemeManager.setTheme('dos-blue');

// Create a button
const button = createButton({
  label: 'Click Me!',
  onClick: () => alert('Hello, DOS!')
});

document.body.appendChild(button);</code></pre>
    </div>
  `;
  content.appendChild(quickStart);

  // Theme showcase
  const themeShowcase = document.createElement('div');
  themeShowcase.innerHTML = `
    <h2 style="color: var(--dos-color-secondary); margin-bottom: var(--dos-space-md);">
      ═══ Theme Preview ═══
    </h2>
    <p style="color: var(--dos-color-border); margin-bottom: var(--dos-space-md);">
      Use the theme picker in the header to switch between themes.
    </p>
    <div style="display: flex; gap: var(--dos-space-md); flex-wrap: wrap;">
      <div style="padding: var(--dos-space-sm); border: 1px solid var(--dos-color-border);">
        <span style="color: #FFFF55;">●</span> DOS Blue (Default)
      </div>
      <div style="padding: var(--dos-space-sm); border: 1px solid var(--dos-color-border);">
        <span style="color: #FFB000;">●</span> Amber Monochrome
      </div>
      <div style="padding: var(--dos-space-sm); border: 1px solid var(--dos-color-border);">
        <span style="color: #00FF00;">●</span> Green Phosphor
      </div>
      <div style="padding: var(--dos-space-sm); border: 1px solid var(--dos-color-border);">
        <span style="color: #FF55FF;">●</span> CGA
      </div>
    </div>
  `;
  content.appendChild(themeShowcase);

  page.appendChild(header);
  page.appendChild(content);

  return page;
}
