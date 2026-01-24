/**
 * Advanced Components Demo Pages
 *
 * Phase 10 components: Tabs, Accordion, SplitPane, CommandPalette, SearchInput, Combobox, MultiSelect, TagInput
 */

import {
  createTabs,
  createAccordion,
  createSplitPane,
  createCommandPalette,
  createSearchInput,
  createCombobox,
  createMultiSelect,
  createTagInput,
  createContainer,
  createButton,
  createCodeBlock,
} from 'dosage';
import { createDemoSection } from '../components/DemoSection';

// =============================================================================
// TABS PAGE
// =============================================================================

export function renderTabsPage(): HTMLElement {
  const content = createContainer({ padding: 'lg' });

  // Header
  const header = document.createElement('header');
  header.innerHTML = `
    <h1 class="dos-page-title">Tabs</h1>
    <p class="dos-page-description">Tabbed interface component for organizing content into switchable panels.</p>
  `;
  content.appendChild(header);

  // Basic Tabs
  const basicSection = createDemoSection({
    title: 'Basic Tabs',
    description: 'Simple horizontal tabs with content panels.',
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const tabs = createTabs({
      tabs: [
        { id: 'tab1', label: 'Overview', content: 'This is the overview content panel.' },
        { id: 'tab2', label: 'Details', content: 'Here are the detailed specifications.' },
        { id: 'tab3', label: 'Settings', content: 'Configure your preferences here.' },
      ],
    });
    basicExample.appendChild(tabs);
  }
  content.appendChild(basicSection);

  // Vertical Tabs
  const verticalSection = createDemoSection({
    title: 'Vertical Tabs',
    description: 'Tabs arranged vertically for sidebar-style navigation.',
  });

  const verticalExample = verticalSection.querySelector('.dos-demo-section___examples');
  if (verticalExample) {
    const tabs = createTabs({
      orientation: 'vertical',
      tabs: [
        { id: 'v1', label: 'Files', content: 'Browse your files here.' },
        { id: 'v2', label: 'Search', content: 'Search for content.' },
        { id: 'v3', label: 'Extensions', content: 'Manage extensions.' },
      ],
    });
    verticalExample.appendChild(tabs);
  }
  content.appendChild(verticalSection);

  // Code Example
  const codeSection = createDemoSection({
    title: 'Usage',
    description: 'How to create tabs programmatically.',
  });
  const codeExample = codeSection.querySelector('.dos-demo-section___examples');
  if (codeExample) {
    const code = createCodeBlock({
      code: `import { createTabs } from 'dosage';

const tabs = createTabs({
  tabs: [
    { id: 'tab1', label: 'Overview', content: 'Overview content.' },
    { id: 'tab2', label: 'Details', content: 'Details content.' },
  ],
  activeTab: 'tab1',
  orientation: 'horizontal', // or 'vertical'
  onChange: (tabId) => console.log('Tab changed:', tabId),
});

document.body.appendChild(tabs);`,
      language: 'typescript',
    });
    codeExample.appendChild(code);
  }
  content.appendChild(codeSection);

  return content;
}

// =============================================================================
// ACCORDION PAGE
// =============================================================================

export function renderAccordionPage(): HTMLElement {
  const content = createContainer({ padding: 'lg' });

  // Header
  const header = document.createElement('header');
  header.innerHTML = `
    <h1 class="dos-page-title">Accordion</h1>
    <p class="dos-page-description">Expandable/collapsible content sections with DOS-style indicators.</p>
  `;
  content.appendChild(header);

  // Single Expand Mode
  const singleSection = createDemoSection({
    title: 'Single Expand Mode',
    description: 'Only one section can be open at a time.',
  });

  const singleExample = singleSection.querySelector('.dos-demo-section___examples');
  if (singleExample) {
    const accordion = createAccordion({
      mode: 'single',
      items: [
        { id: '1', header: 'Section 1: Getting Started', content: 'Welcome to DOSage! This section covers the basics of installation and setup.' },
        { id: '2', header: 'Section 2: Components', content: 'DOSage provides a variety of DOS-styled components for building retro interfaces.' },
        { id: '3', header: 'Section 3: Theming', content: 'Customize colors and styles using our theming system.' },
      ],
    });
    singleExample.appendChild(accordion);
  }
  content.appendChild(singleSection);

  // Multiple Expand Mode
  const multipleSection = createDemoSection({
    title: 'Multiple Expand Mode',
    description: 'Multiple sections can be open simultaneously.',
  });

  const multipleExample = multipleSection.querySelector('.dos-demo-section___examples');
  if (multipleExample) {
    const accordion = createAccordion({
      mode: 'multiple',
      items: [
        { id: 'm1', header: 'FAQ: Installation', content: 'npm install dosage' },
        { id: 'm2', header: 'FAQ: Browser Support', content: 'All modern browsers are supported.' },
        { id: 'm3', header: 'FAQ: License', content: 'MIT License - free for personal and commercial use.' },
      ],
      expanded: ['m1'],
    });
    multipleExample.appendChild(accordion);
  }
  content.appendChild(multipleSection);

  // Code Example
  const codeSection = createDemoSection({
    title: 'Usage',
    description: 'How to create an accordion.',
  });
  const codeExample = codeSection.querySelector('.dos-demo-section___examples');
  if (codeExample) {
    const code = createCodeBlock({
      code: `import { createAccordion } from 'dosage';

const accordion = createAccordion({
  mode: 'single', // or 'multiple'
  items: [
    { id: '1', header: 'Section Title', content: 'Section content...' },
    { id: '2', header: 'Another Section', content: 'More content...' },
  ],
  expanded: ['1'], // Initially expanded items
  onToggle: (id, isExpanded) => console.log(id, isExpanded),
});

document.body.appendChild(accordion);`,
      language: 'typescript',
    });
    codeExample.appendChild(code);
  }
  content.appendChild(codeSection);

  return content;
}

// =============================================================================
// SPLIT PANE PAGE
// =============================================================================

export function renderSplitPanePage(): HTMLElement {
  const content = createContainer({ padding: 'lg' });

  // Header
  const header = document.createElement('header');
  header.innerHTML = `
    <h1 class="dos-page-title">SplitPane</h1>
    <p class="dos-page-description">Resizable split panel layout with draggable divider.</p>
  `;
  content.appendChild(header);

  // Horizontal Split
  const horizontalSection = createDemoSection({
    title: 'Horizontal Split',
    description: 'Two panels side by side with adjustable widths.',
  });

  const horizontalExample = horizontalSection.querySelector('.dos-demo-section___examples');
  if (horizontalExample) {
    const leftContent = document.createElement('div');
    leftContent.innerHTML = '<p style="padding: 1rem;">Left Panel - Drag the divider to resize</p>';
    
    const rightContent = document.createElement('div');
    rightContent.innerHTML = '<p style="padding: 1rem;">Right Panel</p>';

    const splitPane = createSplitPane({
      orientation: 'horizontal',
      firstPane: {
        content: leftContent,
        initialSize: '50%',
        minSize: 100,
      },
      secondPane: {
        content: rightContent,
        minSize: 100,
      },
    });
    
    // Set a fixed height for the demo
    splitPane.style.height = '200px';
    horizontalExample.appendChild(splitPane);
  }
  content.appendChild(horizontalSection);

  // Vertical Split
  const verticalSection = createDemoSection({
    title: 'Vertical Split',
    description: 'Two panels stacked vertically.',
  });

  const verticalExample = verticalSection.querySelector('.dos-demo-section___examples');
  if (verticalExample) {
    const topContent = document.createElement('div');
    topContent.innerHTML = '<p style="padding: 1rem;">Top Panel</p>';
    
    const bottomContent = document.createElement('div');
    bottomContent.innerHTML = '<p style="padding: 1rem;">Bottom Panel</p>';

    const splitPane = createSplitPane({
      orientation: 'vertical',
      firstPane: {
        content: topContent,
        initialSize: '40%',
      },
      secondPane: {
        content: bottomContent,
      },
    });
    
    splitPane.style.height = '300px';
    verticalExample.appendChild(splitPane);
  }
  content.appendChild(verticalSection);

  // Code Example
  const codeSection = createDemoSection({
    title: 'Usage',
    description: 'How to create a split pane.',
  });
  const codeExample = codeSection.querySelector('.dos-demo-section___examples');
  if (codeExample) {
    const code = createCodeBlock({
      code: `import { createSplitPane } from 'dosage';

const splitPane = createSplitPane({
  orientation: 'horizontal', // or 'vertical'
  firstPane: {
    content: leftElement, // HTMLElement, string, or () => HTMLElement
    initialSize: '50%',   // pixels, percentage, or 'auto'
    minSize: 100,         // minimum size in pixels
    maxSize: 500,         // maximum size in pixels
  },
  secondPane: {
    content: rightElement,
    minSize: 100,
  },
  onResize: (firstSize, secondSize) => {
    console.log('Resized:', firstSize, secondSize);
  },
});

document.body.appendChild(splitPane);`,
      language: 'typescript',
    });
    codeExample.appendChild(code);
  }
  content.appendChild(codeSection);

  return content;
}

// =============================================================================
// COMMAND PALETTE PAGE
// =============================================================================

export function renderCommandPalettePage(): HTMLElement {
  const content = createContainer({ padding: 'lg' });

  // Header
  const header = document.createElement('header');
  header.innerHTML = `
    <h1 class="dos-page-title">CommandPalette</h1>
    <p class="dos-page-description">Quick command search and execution with keyboard shortcuts.</p>
  `;
  content.appendChild(header);

  // Demo
  const demoSection = createDemoSection({
    title: 'Command Palette Demo',
    description: 'Click the button or press Ctrl+Shift+P to open the command palette.',
  });

  const demoExample = demoSection.querySelector('.dos-demo-section___examples');
  if (demoExample) {
    const palette = createCommandPalette({
      commands: [
        { id: 'new-file', label: 'New File', shortcut: 'Ctrl+N', category: 'File', action: () => alert('New File') },
        { id: 'open-file', label: 'Open File...', shortcut: 'Ctrl+O', category: 'File', action: () => alert('Open File') },
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S', category: 'File', action: () => alert('Save') },
        { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', category: 'Edit', action: () => alert('Undo') },
        { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y', category: 'Edit', action: () => alert('Redo') },
        { id: 'find', label: 'Find', shortcut: 'Ctrl+F', category: 'Edit', action: () => alert('Find') },
        { id: 'theme-light', label: 'Switch to Light Theme', category: 'View', action: () => alert('Light Theme') },
        { id: 'theme-dark', label: 'Switch to Dark Theme', category: 'View', action: () => alert('Dark Theme') },
      ],
      placeholder: 'Type a command...',
    });

    const openButton = createButton({
      label: 'Open Command Palette (Ctrl+Shift+P)',
      onClick: () => {
        palette.open();
      },
    });

    demoExample.appendChild(openButton);
    demoExample.appendChild(palette);
  }
  content.appendChild(demoSection);

  // Code Example
  const codeSection = createDemoSection({
    title: 'Usage',
    description: 'How to create a command palette.',
  });
  const codeExample = codeSection.querySelector('.dos-demo-section___examples');
  if (codeExample) {
    const code = createCodeBlock({
      code: `import { createCommandPalette } from 'dosage';

const palette = createCommandPalette({
  commands: [
    { 
      id: 'save', 
      label: 'Save File', 
      shortcut: 'Ctrl+S',
      category: 'File',
      action: () => saveFile(),
    },
  ],
  placeholder: 'Type a command...',
  onExecute: (command) => console.log('Executed:', command.id),
});

// Open programmatically
palette.open();`,
      language: 'typescript',
    });
    codeExample.appendChild(code);
  }
  content.appendChild(codeSection);

  return content;
}

// =============================================================================
// SEARCH INPUT PAGE
// =============================================================================

export function renderSearchInputPage(): HTMLElement {
  const content = createContainer({ padding: 'lg' });

  // Header
  const header = document.createElement('header');
  header.innerHTML = `
    <h1 class="dos-page-title">SearchInput</h1>
    <p class="dos-page-description">Search input with autocomplete suggestions and async loading.</p>
  `;
  content.appendChild(header);

  // Basic Search
  const basicSection = createDemoSection({
    title: 'Basic Search',
    description: 'Simple search input with static suggestions.',
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const searchInput = createSearchInput({
      placeholder: 'Search...',
      suggestions: [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'python', label: 'Python' },
        { value: 'rust', label: 'Rust' },
        { value: 'go', label: 'Go' },
      ],
      onSearch: (query) => console.log('Search:', query),
    });
    basicExample.appendChild(searchInput);
  }
  content.appendChild(basicSection);

  // Async Search
  const asyncSection = createDemoSection({
    title: 'Async Search',
    description: 'Search with simulated API call for suggestions.',
  });

  const asyncExample = asyncSection.querySelector('.dos-demo-section___examples');
  if (asyncExample) {
    const searchInput = createSearchInput({
      placeholder: 'Search files...',
      loadSuggestions: async (query) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const files = ['README.md', 'package.json', 'tsconfig.json', 'index.ts', 'main.ts', 'styles.css'];
        return files
          .filter(f => f.toLowerCase().includes(query.toLowerCase()))
          .map(f => ({ value: f, label: f }));
      },
      onSelect: (suggestion) => alert(`Selected: ${suggestion.value}`),
    });
    asyncExample.appendChild(searchInput);
  }
  content.appendChild(asyncSection);

  // Code Example
  const codeSection = createDemoSection({
    title: 'Usage',
    description: 'How to create a search input.',
  });
  const codeExample = codeSection.querySelector('.dos-demo-section___examples');
  if (codeExample) {
    const code = createCodeBlock({
      code: `import { createSearchInput } from 'dosage';

// With static suggestions
const search = createSearchInput({
  placeholder: 'Search...',
  suggestions: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ],
  onSearch: (query) => console.log('Searching:', query),
  onSelect: (suggestion) => console.log('Selected:', suggestion),
});

// With async loading
const asyncSearch = createSearchInput({
  placeholder: 'Search files...',
  loadSuggestions: async (query) => {
    const results = await fetch(\`/api/search?q=\${query}\`);
    return results.json();
  },
  debounceMs: 300,
});`,
      language: 'typescript',
    });
    codeExample.appendChild(code);
  }
  content.appendChild(codeSection);

  return content;
}

// =============================================================================
// COMBOBOX PAGE
// =============================================================================

export function renderComboboxPage(): HTMLElement {
  const content = createContainer({ padding: 'lg' });

  // Header
  const header = document.createElement('header');
  header.innerHTML = `
    <h1 class="dos-page-title">Combobox</h1>
    <p class="dos-page-description">Searchable dropdown with type-ahead filtering.</p>
  `;
  content.appendChild(header);

  // Basic Combobox
  const basicSection = createDemoSection({
    title: 'Basic Combobox',
    description: 'Type to filter options or select from the dropdown.',
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const combobox = createCombobox({
      options: [
        { value: 'red', label: 'Red' },
        { value: 'green', label: 'Green' },
        { value: 'blue', label: 'Blue' },
        { value: 'yellow', label: 'Yellow' },
        { value: 'purple', label: 'Purple' },
      ],
      placeholder: 'Select a color...',
      onChange: (value) => console.log('Selected:', value),
    });
    basicExample.appendChild(combobox);
  }
  content.appendChild(basicSection);

  // Grouped Options
  const groupedSection = createDemoSection({
    title: 'Grouped Options',
    description: 'Options organized into categories.',
  });

  const groupedExample = groupedSection.querySelector('.dos-demo-section___examples');
  if (groupedExample) {
    const combobox = createCombobox({
      options: [
        { value: 'js', label: 'JavaScript', group: 'Web' },
        { value: 'ts', label: 'TypeScript', group: 'Web' },
        { value: 'css', label: 'CSS', group: 'Web' },
        { value: 'python', label: 'Python', group: 'Backend' },
        { value: 'java', label: 'Java', group: 'Backend' },
        { value: 'go', label: 'Go', group: 'Backend' },
      ],
      placeholder: 'Select a language...',
    });
    groupedExample.appendChild(combobox);
  }
  content.appendChild(groupedSection);

  // Code Example
  const codeSection = createDemoSection({
    title: 'Usage',
    description: 'How to create a combobox.',
  });
  const codeExample = codeSection.querySelector('.dos-demo-section___examples');
  if (codeExample) {
    const code = createCodeBlock({
      code: `import { createCombobox } from 'dosage';

const combobox = createCombobox({
  options: [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2', disabled: true },
    { value: 'opt3', label: 'Option 3', group: 'Group A' },
  ],
  placeholder: 'Select an option...',
  value: 'opt1', // Initial value
  allowFreeform: true, // Allow custom values
  onChange: (value) => console.log('Selected:', value),
});

document.body.appendChild(combobox);`,
      language: 'typescript',
    });
    codeExample.appendChild(code);
  }
  content.appendChild(codeSection);

  return content;
}

// =============================================================================
// MULTI SELECT PAGE
// =============================================================================

export function renderMultiSelectPage(): HTMLElement {
  const content = createContainer({ padding: 'lg' });

  // Header
  const header = document.createElement('header');
  header.innerHTML = `
    <h1 class="dos-page-title">MultiSelect</h1>
    <p class="dos-page-description">Select multiple options with tags display.</p>
  `;
  content.appendChild(header);

  // Basic MultiSelect
  const basicSection = createDemoSection({
    title: 'Basic MultiSelect',
    description: 'Select multiple items from the dropdown.',
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const multiSelect = createMultiSelect({
      options: [
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue' },
        { value: 'angular', label: 'Angular' },
        { value: 'svelte', label: 'Svelte' },
        { value: 'solid', label: 'Solid' },
      ],
      placeholder: 'Select frameworks...',
      onChange: (values) => console.log('Selected:', values),
    });
    basicExample.appendChild(multiSelect);
  }
  content.appendChild(basicSection);

  // With Initial Values
  const initialSection = createDemoSection({
    title: 'With Initial Selection',
    description: 'MultiSelect with pre-selected values.',
  });

  const initialExample = initialSection.querySelector('.dos-demo-section___examples');
  if (initialExample) {
    const multiSelect = createMultiSelect({
      options: [
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
      ],
      value: ['monday', 'wednesday', 'friday'],
      placeholder: 'Select days...',
    });
    initialExample.appendChild(multiSelect);
  }
  content.appendChild(initialSection);

  // Code Example
  const codeSection = createDemoSection({
    title: 'Usage',
    description: 'How to create a multi-select.',
  });
  const codeExample = codeSection.querySelector('.dos-demo-section___examples');
  if (codeExample) {
    const code = createCodeBlock({
      code: `import { createMultiSelect } from 'dosage';

const multiSelect = createMultiSelect({
  options: [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
  ],
  value: ['opt1'], // Initial selection
  placeholder: 'Select options...',
  maxSelections: 3, // Optional limit
  onChange: (values) => console.log('Selected:', values),
});

// Public API
multiSelect.getValue(); // Get selected values
multiSelect.setValue(['opt1', 'opt2']);
multiSelect.clear();`,
      language: 'typescript',
    });
    codeExample.appendChild(code);
  }
  content.appendChild(codeSection);

  return content;
}

// =============================================================================
// TAG INPUT PAGE
// =============================================================================

export function renderTagInputPage(): HTMLElement {
  const content = createContainer({ padding: 'lg' });

  // Header
  const header = document.createElement('header');
  header.innerHTML = `
    <h1 class="dos-page-title">TagInput</h1>
    <p class="dos-page-description">Free-form tag entry with validation and autocomplete.</p>
  `;
  content.appendChild(header);

  // Basic TagInput
  const basicSection = createDemoSection({
    title: 'Basic TagInput',
    description: 'Type and press Enter to add tags. Click × to remove.',
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const tagInput = createTagInput({
      placeholder: 'Add tags...',
      onChange: (tags) => console.log('Tags:', tags),
    });
    basicExample.appendChild(tagInput);
  }
  content.appendChild(basicSection);

  // With Initial Tags
  const initialSection = createDemoSection({
    title: 'With Initial Tags',
    description: 'TagInput with pre-populated tags.',
  });

  const initialExample = initialSection.querySelector('.dos-demo-section___examples');
  if (initialExample) {
    const tagInput = createTagInput({
      value: [
        { id: '1', label: 'JavaScript' },
        { id: '2', label: 'TypeScript' },
        { id: '3', label: 'CSS' },
      ],
      placeholder: 'Add more tags...',
    });
    initialExample.appendChild(tagInput);
  }
  content.appendChild(initialSection);

  // With Suggestions
  const suggestionsSection = createDemoSection({
    title: 'With Suggestions',
    description: 'TagInput with autocomplete suggestions.',
  });

  const suggestionsExample = suggestionsSection.querySelector('.dos-demo-section___examples');
  if (suggestionsExample) {
    const tagInput = createTagInput({
      placeholder: 'Start typing for suggestions...',
      suggestions: [
        { value: 'React' },
        { value: 'Vue' },
        { value: 'Angular' },
        { value: 'Svelte' },
        { value: 'Next.js' },
        { value: 'Nuxt' },
        { value: 'Remix' },
      ],
    });
    suggestionsExample.appendChild(tagInput);
  }
  content.appendChild(suggestionsSection);

  // With Validation
  const validationSection = createDemoSection({
    title: 'With Validation',
    description: 'Tags must be at least 2 characters. Max 5 tags allowed.',
  });

  const validationExample = validationSection.querySelector('.dos-demo-section___examples');
  if (validationExample) {
    const tagInput = createTagInput({
      placeholder: 'Add tags (min 2 chars, max 5 tags)...',
      minTagLength: 2,
      maxTags: 5,
      allowDuplicates: false,
    });
    validationExample.appendChild(tagInput);
  }
  content.appendChild(validationSection);

  // Code Example
  const codeSection = createDemoSection({
    title: 'Usage',
    description: 'How to create a tag input.',
  });
  const codeExample = codeSection.querySelector('.dos-demo-section___examples');
  if (codeExample) {
    const code = createCodeBlock({
      code: `import { createTagInput } from 'dosage';

const tagInput = createTagInput({
  value: [{ id: '1', label: 'Initial Tag' }],
  placeholder: 'Add tags...',
  delimiters: ['Enter', ','], // Keys that create tags
  minTagLength: 2,
  maxTags: 10,
  allowDuplicates: false,
  suggestions: [
    { value: 'Suggestion 1' },
    { value: 'Suggestion 2' },
  ],
  validate: async (value) => {
    // Custom validation
    if (value.includes('bad')) {
      return { valid: false, message: 'Invalid tag' };
    }
    return { valid: true };
  },
  onAdd: (tag) => console.log('Added:', tag),
  onRemove: (tag) => console.log('Removed:', tag),
  onChange: (tags) => console.log('All tags:', tags),
});

// Public API
tagInput.getTags();
tagInput.addTag('New Tag');
tagInput.removeTag('tag-id');
tagInput.clearTags();`,
      language: 'typescript',
    });
    codeExample.appendChild(code);
  }
  content.appendChild(codeSection);

  return content;
}
