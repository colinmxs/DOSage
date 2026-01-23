/**
 * Kitchen Sink Navigation Component
 */

interface NavSection {
  title: string;
  items: { id: string; label: string }[];
}

const navSections: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { id: 'welcome', label: 'Welcome' },
      { id: 'themes', label: 'Themes' },
    ],
  },
  {
    title: 'Components',
    items: [
      { id: 'layout', label: 'Layout' },
      { id: 'typography', label: 'Typography' },
      { id: 'buttons', label: 'Buttons' },
      { id: 'forms', label: 'Forms' },
      { id: 'navigation', label: 'Navigation' },
      { id: 'feedback', label: 'Feedback' },
      { id: 'data', label: 'Data Display' },
      { id: 'utilities', label: 'Utilities' },
    ],
  },
];

export function renderNavigation(currentSection: string): string {
  const sections = navSections.map(section => {
    const items = section.items.map(item => {
      const isActive = item.id === currentSection;
      return `
        <li class="kitchen-sink-nav-item">
          <a 
            href="#${item.id}" 
            class="kitchen-sink-nav-link ${isActive ? 'active' : ''}"
            data-nav-link="${item.id}"
          >
            ${isActive ? '▶ ' : '  '}${item.label}
          </a>
        </li>
      `;
    }).join('');

    return `
      <div class="kitchen-sink-nav-section">
        <h2>${section.title}</h2>
        <ul class="kitchen-sink-nav-list">
          ${items}
        </ul>
      </div>
    `;
  }).join('');

  return `
    <nav class="kitchen-sink-nav">
      ${sections}
    </nav>
  `;
}
