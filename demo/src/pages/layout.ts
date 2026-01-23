/**
 * Layout Components Page
 *
 * Demonstrates all layout components: Container, Panel, Box, Grid, Divider, Separator
 */

import { createDemoSection } from '../components/DemoSection';
import {
  createContainer,
  createPanel,
  getPanelContent,
  createBox,
  createGrid,
  createGridItem,
  createDivider,
  createSeparator,
} from 'dosage';

/**
 * Renders the Container demo page
 */
export function renderContainerPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Container';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'A layout container for wrapping content with consistent spacing and max-width constraints.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic Container',
    description: 'Default container with medium padding.',
    code: `import { createContainer } from 'dosage';

const container = createContainer();
container.innerHTML = 'Content inside container';`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const demo = createContainer();
    demo.style.border = '1px dashed var(--dos-color-border)';
    demo.innerHTML = '<p>Content inside a basic container with default (md) padding</p>';
    basicExample.appendChild(demo);
  }
  content.appendChild(basicSection);

  // Padding Variants
  const paddingSection = createDemoSection({
    title: 'Padding Variants',
    description: 'Containers with different padding sizes.',
    code: `createContainer({ padding: 'xs' });
createContainer({ padding: 'sm' });
createContainer({ padding: 'md' });
createContainer({ padding: 'lg' });
createContainer({ padding: 'xl' });`,
  });

  const paddingExample = paddingSection.querySelector('.dos-demo-section___examples');
  if (paddingExample) {
    const paddings = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    paddings.forEach((p) => {
      const container = createContainer({ padding: p });
      container.style.border = '1px dashed var(--dos-color-border)';
      container.style.marginBottom = 'var(--dos-space-sm)';
      container.innerHTML = `<p>Padding: ${p}</p>`;
      paddingExample.appendChild(container);
    });
  }
  content.appendChild(paddingSection);

  // Centered with Max Width
  const centeredSection = createDemoSection({
    title: 'Centered with Max Width',
    description: 'Container centered with a maximum width constraint.',
    code: `createContainer({
  centered: true,
  maxWidth: 400,
  padding: 'md',
});`,
  });

  const centeredExample = centeredSection.querySelector('.dos-demo-section___examples');
  if (centeredExample) {
    const container = createContainer({
      centered: true,
      maxWidth: 400,
      padding: 'md',
    });
    container.style.border = '1px dashed var(--dos-color-border)';
    container.innerHTML = '<p>This container is centered with max-width: 400px</p>';
    centeredExample.appendChild(container);
  }
  content.appendChild(centeredSection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Panel demo page
 */
export function renderPanelPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Panel';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'A bordered panel with optional title and DOS-style box-drawing borders.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Panel
  const basicSection = createDemoSection({
    title: 'Basic Panel',
    description: 'Simple panel with single border.',
    code: `import { createPanel, getPanelContent } from 'dosage';

const panel = createPanel();
const content = getPanelContent(panel);
content.innerHTML = 'Panel content here';`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const panel = createPanel();
    const panelContent = getPanelContent(panel);
    if (panelContent) {
      panelContent.innerHTML = '<p>This is a basic panel with single border</p>';
    }
    basicExample.appendChild(panel);
  }
  content.appendChild(basicSection);

  // Panel with Title
  const titleSection = createDemoSection({
    title: 'Panel with Title',
    description: 'Panel with a title in the border.',
    code: `createPanel({
  title: 'System Information',
});`,
  });

  const titleExample = titleSection.querySelector('.dos-demo-section___examples');
  if (titleExample) {
    const panel = createPanel({ title: 'System Information' });
    const panelContent = getPanelContent(panel);
    if (panelContent) {
      panelContent.innerHTML = `
        <p>CPU: 486DX2-66MHz</p>
        <p>RAM: 8MB</p>
        <p>HDD: 540MB</p>
      `;
    }
    titleExample.appendChild(panel);
  }
  content.appendChild(titleSection);

  // Border Styles
  const borderSection = createDemoSection({
    title: 'Border Styles',
    description: 'Different border style variants.',
    code: `createPanel({ borderStyle: 'single' });
createPanel({ borderStyle: 'double' });
createPanel({ borderStyle: 'thick' });
createPanel({ borderStyle: 'none' });`,
  });

  const borderExample = borderSection.querySelector('.dos-demo-section___examples');
  if (borderExample) {
    const styles = ['single', 'double', 'thick', 'none'] as const;
    styles.forEach((style) => {
      const panel = createPanel({ borderStyle: style, title: style.toUpperCase() });
      panel.style.marginBottom = 'var(--dos-space-md)';
      const panelContent = getPanelContent(panel);
      if (panelContent) {
        panelContent.innerHTML = `<p>Border style: ${style}</p>`;
      }
      borderExample.appendChild(panel);
    });
  }
  content.appendChild(borderSection);

  // Panel with Shadow
  const shadowSection = createDemoSection({
    title: 'Panel with Shadow',
    description: 'Panel with DOS-style drop shadow.',
    code: `createPanel({
  title: 'Shadowed Panel',
  shadow: true,
});`,
  });

  const shadowExample = shadowSection.querySelector('.dos-demo-section___examples');
  if (shadowExample) {
    const panel = createPanel({ title: 'Shadowed Panel', shadow: true });
    panel.style.marginBottom = 'var(--dos-space-lg)';
    const panelContent = getPanelContent(panel);
    if (panelContent) {
      panelContent.innerHTML = '<p>This panel has a DOS-style drop shadow effect</p>';
    }
    shadowExample.appendChild(panel);
  }
  content.appendChild(shadowSection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Box demo page
 */
export function renderBoxPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Box';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'A flexible container with border, padding, margin, and display options.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Box
  const basicSection = createDemoSection({
    title: 'Basic Box',
    description: 'Simple box with border.',
    code: `import { createBox } from 'dosage';

const box = createBox({
  border: true,
  padding: 'md',
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const box = createBox({ border: true, padding: 'md' });
    box.innerHTML = '<p>Basic bordered box with medium padding</p>';
    basicExample.appendChild(box);
  }
  content.appendChild(basicSection);

  // Border Configuration
  const borderSection = createDemoSection({
    title: 'Border Configuration',
    description: 'Custom border width, style, and color.',
    code: `createBox({
  border: {
    width: 2,
    style: 'dashed',
    color: 'var(--dos-color-primary)',
  },
  padding: 'md',
});`,
  });

  const borderExample = borderSection.querySelector('.dos-demo-section___examples');
  if (borderExample) {
    const box = createBox({
      border: {
        width: 2,
        style: 'dashed',
        color: 'var(--dos-color-primary)',
      },
      padding: 'md',
    });
    box.innerHTML = '<p>Custom dashed border in primary color</p>';
    basicExample?.parentNode?.appendChild(box);
    borderExample.appendChild(box);
  }
  content.appendChild(borderSection);

  // Display Modes
  const displaySection = createDemoSection({
    title: 'Display Modes',
    description: 'Different display mode options.',
    code: `createBox({ display: 'flex', border: true });
createBox({ display: 'inline-block', border: true });`,
  });

  const displayExample = displaySection.querySelector('.dos-demo-section___examples');
  if (displayExample) {
    const flexBox = createBox({ display: 'flex', border: true, padding: 'sm' });
    flexBox.style.gap = 'var(--dos-space-sm)';
    flexBox.style.marginBottom = 'var(--dos-space-md)';
    for (let i = 1; i <= 3; i++) {
      const child = document.createElement('span');
      child.textContent = `Item ${i}`;
      child.style.padding = 'var(--dos-space-xs)';
      child.style.border = '1px solid var(--dos-color-border)';
      flexBox.appendChild(child);
    }
    displayExample.appendChild(flexBox);

    const inlineBox1 = createBox({ display: 'inline-block', border: true, padding: 'sm' });
    inlineBox1.textContent = 'Inline 1';
    inlineBox1.style.marginRight = 'var(--dos-space-sm)';
    displayExample.appendChild(inlineBox1);

    const inlineBox2 = createBox({ display: 'inline-block', border: true, padding: 'sm' });
    inlineBox2.textContent = 'Inline 2';
    displayExample.appendChild(inlineBox2);
  }
  content.appendChild(displaySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Grid demo page
 */
export function renderGridPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Grid';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'A CSS Grid-based layout component for creating grid layouts.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Grid
  const basicSection = createDemoSection({
    title: 'Basic Grid',
    description: '3-column grid with equal-width columns.',
    code: `import { createGrid, createGridItem } from 'dosage';

const grid = createGrid({ columns: 3, gap: 'md' });

for (let i = 1; i <= 6; i++) {
  const item = createGridItem();
  item.textContent = \`Item \${i}\`;
  grid.appendChild(item);
}`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const grid = createGrid({ columns: 3, gap: 'md' });
    for (let i = 1; i <= 6; i++) {
      const item = createGridItem();
      item.style.padding = 'var(--dos-space-md)';
      item.style.border = '1px solid var(--dos-color-border)';
      item.style.textAlign = 'center';
      item.textContent = `Item ${i}`;
      grid.appendChild(item);
    }
    basicExample.appendChild(grid);
  }
  content.appendChild(basicSection);

  // Grid with Spanning
  const spanSection = createDemoSection({
    title: 'Grid with Spanning',
    description: 'Grid items that span multiple columns or rows.',
    code: `const grid = createGrid({ columns: 3, gap: 'sm' });

const wideItem = createGridItem({ colSpan: 2 });
const tallItem = createGridItem({ rowSpan: 2 });`,
  });

  const spanExample = spanSection.querySelector('.dos-demo-section___examples');
  if (spanExample) {
    const grid = createGrid({ columns: 3, gap: 'sm' });

    const item1 = createGridItem({ colSpan: 2 });
    item1.style.padding = 'var(--dos-space-md)';
    item1.style.border = '1px solid var(--dos-color-primary)';
    item1.style.backgroundColor = 'var(--dos-color-shadow)';
    item1.textContent = 'Spans 2 columns';
    grid.appendChild(item1);

    const item2 = createGridItem({ rowSpan: 2 });
    item2.style.padding = 'var(--dos-space-md)';
    item2.style.border = '1px solid var(--dos-color-secondary)';
    item2.style.backgroundColor = 'var(--dos-color-shadow)';
    item2.textContent = 'Spans 2 rows';
    grid.appendChild(item2);

    for (let i = 1; i <= 3; i++) {
      const item = createGridItem();
      item.style.padding = 'var(--dos-space-md)';
      item.style.border = '1px solid var(--dos-color-border)';
      item.textContent = `Item ${i}`;
      grid.appendChild(item);
    }

    spanExample.appendChild(grid);
  }
  content.appendChild(spanSection);

  // Custom Column Template
  const customSection = createDemoSection({
    title: 'Custom Column Template',
    description: 'Grid with custom column widths.',
    code: `createGrid({
  columns: '1fr 2fr 1fr',
  gap: 'md',
});`,
  });

  const customExample = customSection.querySelector('.dos-demo-section___examples');
  if (customExample) {
    const grid = createGrid({ columns: '1fr 2fr 1fr', gap: 'md' });

    const labels = ['Sidebar', 'Main Content', 'Sidebar'];
    labels.forEach((label) => {
      const item = createGridItem();
      item.style.padding = 'var(--dos-space-md)';
      item.style.border = '1px solid var(--dos-color-border)';
      item.style.textAlign = 'center';
      item.textContent = label;
      grid.appendChild(item);
    });

    customExample.appendChild(grid);
  }
  content.appendChild(customSection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Divider demo page
 */
export function renderDividerPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Divider';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'A visual separator using DOS box-drawing characters.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Divider
  const basicSection = createDemoSection({
    title: 'Basic Divider',
    description: 'Simple horizontal divider with single line.',
    code: `import { createDivider } from 'dosage';

const divider = createDivider();`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const text1 = document.createElement('p');
    text1.textContent = 'Content above the divider';
    basicExample.appendChild(text1);

    basicExample.appendChild(createDivider({ margin: 'md' }));

    const text2 = document.createElement('p');
    text2.textContent = 'Content below the divider';
    basicExample.appendChild(text2);
  }
  content.appendChild(basicSection);

  // Divider Variants
  const variantSection = createDemoSection({
    title: 'Divider Variants',
    description: 'Different line styles using box-drawing characters.',
    code: `createDivider({ variant: 'single' });  // ─
createDivider({ variant: 'double' });  // ═
createDivider({ variant: 'thick' });   // █
createDivider({ variant: 'dashed' });  // ┄`,
  });

  const variantExample = variantSection.querySelector('.dos-demo-section___examples');
  if (variantExample) {
    const variants = ['single', 'double', 'thick', 'dashed'] as const;
    variants.forEach((variant) => {
      const label = document.createElement('p');
      label.textContent = `Variant: ${variant}`;
      label.style.marginBottom = 'var(--dos-space-xs)';
      variantExample.appendChild(label);

      variantExample.appendChild(createDivider({ variant, margin: 'sm' }));
    });
  }
  content.appendChild(variantSection);

  // Custom Character
  const customSection = createDemoSection({
    title: 'Custom Character',
    description: 'Divider with a custom character.',
    code: `createDivider({ character: '═' });
createDivider({ character: '★' });
createDivider({ character: '•' });`,
  });

  const customExample = customSection.querySelector('.dos-demo-section___examples');
  if (customExample) {
    const chars = ['═', '★', '•', '~'];
    chars.forEach((char) => {
      const label = document.createElement('p');
      label.textContent = `Character: ${char}`;
      label.style.marginBottom = 'var(--dos-space-xs)';
      customExample.appendChild(label);

      customExample.appendChild(createDivider({ character: char, margin: 'sm' }));
    });
  }
  content.appendChild(customSection);

  // Fixed Length
  const lengthSection = createDemoSection({
    title: 'Fixed Length',
    description: 'Divider with a specific number of characters.',
    code: `createDivider({ length: 20 });`,
  });

  const lengthExample = lengthSection.querySelector('.dos-demo-section___examples');
  if (lengthExample) {
    const divider = createDivider({ variant: 'double', length: 30, margin: 'md' });
    lengthExample.appendChild(divider);
  }
  content.appendChild(lengthSection);

  // Separator Component
  const separatorSection = createDemoSection({
    title: 'Separator (Spacing)',
    description: 'Use Separator for vertical spacing with optional visible line.',
    code: `import { createSeparator } from 'dosage';

// Invisible spacer
createSeparator({ spacing: 'lg' });

// Visible separator
createSeparator({ spacing: 'md', visible: true });`,
  });

  const separatorExample = separatorSection.querySelector('.dos-demo-section___examples');
  if (separatorExample) {
    const text1 = document.createElement('p');
    text1.textContent = 'Content with large spacing below';
    separatorExample.appendChild(text1);

    separatorExample.appendChild(createSeparator({ spacing: 'lg' }));

    const text2 = document.createElement('p');
    text2.textContent = 'Content after invisible separator';
    separatorExample.appendChild(text2);

    separatorExample.appendChild(createSeparator({ spacing: 'md', visible: true }));

    const text3 = document.createElement('p');
    text3.textContent = 'Content after visible separator';
    separatorExample.appendChild(text3);
  }
  content.appendChild(separatorSection);

  page.appendChild(content);
  return page;
}
