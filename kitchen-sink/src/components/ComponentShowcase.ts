/**
 * Kitchen Sink Component Showcase
 */

export function renderComponentShowcase(section: string): string {
  switch (section) {
    case 'welcome':
      return renderWelcome();
    case 'themes':
      return renderThemesPage();
    case 'layout':
      return renderLayoutComponents();
    case 'typography':
      return renderTypographyComponents();
    case 'buttons':
      return renderButtonComponents();
    case 'forms':
      return renderFormComponents();
    case 'navigation':
      return renderNavigationComponents();
    case 'feedback':
      return renderFeedbackComponents();
    case 'data':
      return renderDataComponents();
    case 'utilities':
      return renderUtilityComponents();
    default:
      return renderWelcome();
  }
}

function renderWelcome(): string {
  return `
    <div class="welcome-content">
      <pre class="ascii-logo">
██████╗  ██████╗ ███████╗ █████╗  ██████╗ ███████╗
██╔══██╗██╔═══██╗██╔════╝██╔══██╗██╔════╝ ██╔════╝
██║  ██║██║   ██║███████╗███████║██║  ███╗█████╗  
██║  ██║██║   ██║╚════██║██╔══██║██║   ██║██╔══╝  
██████╔╝╚██████╔╝███████║██║  ██║╚██████╔╝███████╗
╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
      </pre>
      
      <h1>Welcome to DOSage</h1>
      <p>
        A TypeScript component library that recreates the aesthetic of classic 
        DOS-era computer interfaces for modern web applications.
      </p>
      
      <h2>Features</h2>
      <ul>
        <li>Blocky, pixelated typography reminiscent of CGA/EGA-era text rendering</li>
        <li>Thick, blinking block cursor as a signature UI element</li>
        <li>High-contrast color schemes with multiple preset themes</li>
        <li>Sharp edges, no rounded corners - everything grid-aligned</li>
        <li>Monospace fonts exclusively - terminal-style UI</li>
        <li>Pure TypeScript with minimal dependencies</li>
        <li>Framework-agnostic core</li>
        <li>Accessible despite retro aesthetic</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>
        Use the navigation on the left to explore different component categories.
        Use the theme switcher above to try different color schemes.
      </p>
      
      <p>
        This Kitchen Sink application serves as a live showcase and testing ground
        for all DOSage components as they are developed.
      </p>
      
      <div class="component-demo">
        <p>The blinking cursor is one of our signature elements: <span class="dosage-cursor"></span></p>
      </div>
    </div>
  `;
}

function renderThemesPage(): string {
  return `
    <div class="component-section">
      <h2>Themes</h2>
      <p>DOSage comes with several preset themes inspired by classic computer terminals:</p>
      
      <h3>DOS Blue (Default)</h3>
      <div class="component-demo">
        <p>The classic DOS blue background with white text. This is the default theme that most people remember from MS-DOS.</p>
      </div>
      
      <h3>Amber Monochrome</h3>
      <div class="component-demo">
        <p>Inspired by amber monochrome monitors popular in the 1980s. Features optional scanline effects.</p>
      </div>
      
      <h3>Green Phosphor</h3>
      <div class="component-demo">
        <p>Classic green phosphor terminal look, reminiscent of early mainframe terminals.</p>
      </div>
      
      <h3>Black & White</h3>
      <div class="component-demo">
        <p>Pure monochrome aesthetic for maximum contrast and readability.</p>
      </div>
      
      <h3>Custom Themes</h3>
      <p>You can create custom themes by providing a theme configuration object with your own colors and effects.</p>
      
      <div class="component-code">
        <pre><code>import { applyTheme } from 'dosage';

const customTheme = {
  name: 'My Custom Theme',
  colors: {
    background: '#1a1a1a',
    foreground: '#00ff00',
    // ... more colors
  },
  fonts: {
    mono: '"Courier New", monospace'
  }
};

applyTheme(customTheme);</code></pre>
      </div>
    </div>
  `;
}

function renderLayoutComponents(): string {
  return `
    <div class="component-section">
      <h2>Layout Components</h2>
      <p>Layout components will be implemented in Phase 2.</p>
      <p>Coming soon: Container, Panel, Box, Grid, Dividers, Window frames, Tabs, Accordion, Cards, Split panes</p>
    </div>
  `;
}

function renderTypographyComponents(): string {
  return `
    <div class="component-section">
      <h2>Typography Components</h2>
      <p>Typography components will be implemented in Phase 3.</p>
      <p>Coming soon: Headings, Paragraphs, Code blocks, Lists, Labels, ASCII art renderer</p>
    </div>
  `;
}

function renderButtonComponents(): string {
  return `
    <div class="component-section">
      <h2>Button Components</h2>
      <p>Button components will be implemented in Phase 4.</p>
      <p>Coming soon: Buttons (all variants), Button groups, Icon buttons, Links</p>
    </div>
  `;
}

function renderFormComponents(): string {
  return `
    <div class="component-section">
      <h2>Form Components</h2>
      <p>Form components will be implemented in Phases 5-6.</p>
      <p>Coming soon: Text inputs, Textareas, Checkboxes, Radio buttons, Selects, Sliders, Date/Time pickers</p>
    </div>
  `;
}

function renderNavigationComponents(): string {
  return `
    <div class="component-section">
      <h2>Navigation Components</h2>
      <p>Navigation components will be implemented in Phase 7.</p>
      <p>Coming soon: Menu bars, Dropdowns, Context menus, Sidebars, Breadcrumbs, Pagination</p>
    </div>
  `;
}

function renderFeedbackComponents(): string {
  return `
    <div class="component-section">
      <h2>Feedback Components</h2>
      <p>Feedback components will be implemented in Phase 8.</p>
      <p>Coming soon: Modals, Alerts, Toasts, Tooltips, Progress bars, Loading spinners</p>
    </div>
  `;
}

function renderDataComponents(): string {
  return `
    <div class="component-section">
      <h2>Data Display Components</h2>
      <p>Data display components will be implemented in Phase 9.</p>
      <p>Coming soon: Tables, Lists, Tree views, Badges, Avatars, Timelines</p>
    </div>
  `;
}

function renderUtilityComponents(): string {
  return `
    <div class="component-section">
      <h2>Utility Components</h2>
      <p>Utility components will be implemented in Phase 11.</p>
      <p>Coming soon: Portal, Focus trap, Keyboard handlers, Scroll areas, Resizable, Draggable</p>
    </div>
  `;
}
