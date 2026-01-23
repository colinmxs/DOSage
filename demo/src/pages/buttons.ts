/**
 * Button Components Page
 *
 * Demonstrates Button, ButtonGroup, IconButton, and Link components.
 */

import { createDemoSection } from '../components/DemoSection';
import {
  createButton,
  setButtonLoading,
  createButtonGroup,
  addButtonsToGroup,
  createIconButton,
  createLink,
} from 'dosage';

/**
 * Renders the Button demo page
 */
export function renderButtonPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Button';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style buttons with variants, sizes, and loading states.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic Button',
    description: 'Default button with secondary variant.',
    code: `import { createButton } from 'dosage';

const button = createButton({
  label: 'Click Me',
  onClick: () => alert('Clicked!')
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const btn = createButton({
      label: 'Click Me',
      onClick: () => alert('Clicked!'),
    });
    basicExample.appendChild(btn);
  }
  content.appendChild(basicSection);

  // Variants
  const variantsSection = createDemoSection({
    title: 'Button Variants',
    description: 'Different visual styles for different purposes.',
    code: `createButton({ label: 'Primary', variant: 'primary' });
createButton({ label: 'Secondary', variant: 'secondary' });
createButton({ label: 'Danger', variant: 'danger' });
createButton({ label: 'Ghost', variant: 'ghost' });`,
  });

  const variantsExample = variantsSection.querySelector('.dos-demo-section___examples');
  if (variantsExample) {
    variantsExample.style.display = 'flex';
    variantsExample.style.flexWrap = 'wrap';
    variantsExample.style.gap = 'var(--dos-space-sm)';

    const variants = ['primary', 'secondary', 'danger', 'ghost'] as const;
    variants.forEach((variant) => {
      const btn = createButton({
        label: variant.charAt(0).toUpperCase() + variant.slice(1),
        variant,
      });
      variantsExample.appendChild(btn);
    });
  }
  content.appendChild(variantsSection);

  // Sizes
  const sizesSection = createDemoSection({
    title: 'Button Sizes',
    description: 'Small, medium, and large button sizes.',
    code: `createButton({ label: 'Small', size: 'small' });
createButton({ label: 'Medium', size: 'medium' });
createButton({ label: 'Large', size: 'large' });`,
  });

  const sizesExample = sizesSection.querySelector('.dos-demo-section___examples');
  if (sizesExample) {
    sizesExample.style.display = 'flex';
    sizesExample.style.alignItems = 'center';
    sizesExample.style.gap = 'var(--dos-space-sm)';

    const sizes = ['small', 'medium', 'large'] as const;
    sizes.forEach((size) => {
      const btn = createButton({
        label: size.charAt(0).toUpperCase() + size.slice(1),
        size,
        variant: 'primary',
      });
      sizesExample.appendChild(btn);
    });
  }
  content.appendChild(sizesSection);

  // With Icon
  const iconSection = createDemoSection({
    title: 'Buttons with Icons',
    description: 'Buttons can include an ASCII icon character.',
    code: `createButton({ label: 'Save', icon: '■', iconPosition: 'left' });
createButton({ label: 'Next', icon: '►', iconPosition: 'right' });`,
  });

  const iconExample = iconSection.querySelector('.dos-demo-section___examples');
  if (iconExample) {
    iconExample.style.display = 'flex';
    iconExample.style.gap = 'var(--dos-space-sm)';

    const saveBtn = createButton({
      label: 'Save',
      icon: '■',
      iconPosition: 'left',
      variant: 'primary',
    });
    const nextBtn = createButton({
      label: 'Next',
      icon: '►',
      iconPosition: 'right',
      variant: 'secondary',
    });
    iconExample.appendChild(saveBtn);
    iconExample.appendChild(nextBtn);
  }
  content.appendChild(iconSection);

  // States
  const statesSection = createDemoSection({
    title: 'Button States',
    description: 'Disabled and loading states.',
    code: `createButton({ label: 'Disabled', disabled: true });
createButton({ label: 'Loading', loading: true });`,
  });

  const statesExample = statesSection.querySelector('.dos-demo-section___examples');
  if (statesExample) {
    statesExample.style.display = 'flex';
    statesExample.style.gap = 'var(--dos-space-sm)';

    const disabledBtn = createButton({
      label: 'Disabled',
      disabled: true,
      variant: 'primary',
    });
    const loadingBtn = createButton({
      label: 'Loading...',
      loading: true,
      variant: 'secondary',
    });
    statesExample.appendChild(disabledBtn);
    statesExample.appendChild(loadingBtn);
  }
  content.appendChild(statesSection);

  // Full Width
  const fullWidthSection = createDemoSection({
    title: 'Full Width Button',
    description: 'Button that expands to fill container width.',
    code: `createButton({
  label: 'Full Width Button',
  fullWidth: true,
  variant: 'primary'
});`,
  });

  const fullWidthExample = fullWidthSection.querySelector('.dos-demo-section___examples');
  if (fullWidthExample) {
    const btn = createButton({
      label: 'Full Width Button',
      fullWidth: true,
      variant: 'primary',
    });
    fullWidthExample.appendChild(btn);
  }
  content.appendChild(fullWidthSection);

  // Interactive loading demo
  const loadingDemoSection = createDemoSection({
    title: 'Loading State Demo',
    description: 'Click to simulate a loading operation.',
    code: `const btn = createButton({ label: 'Submit', variant: 'primary' });
btn.addEventListener('click', () => {
  setButtonLoading(btn, true);
  setTimeout(() => setButtonLoading(btn, false), 2000);
});`,
  });

  const loadingDemoExample = loadingDemoSection.querySelector('.dos-demo-section___examples');
  if (loadingDemoExample) {
    const btn = createButton({
      label: 'Submit',
      variant: 'primary',
      onClick: () => {
        setButtonLoading(btn, true);
        setTimeout(() => {
          setButtonLoading(btn, false);
        }, 2000);
      },
    });
    loadingDemoExample.appendChild(btn);
  }
  content.appendChild(loadingDemoSection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the ButtonGroup demo page
 */
export function renderButtonGroupPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'ButtonGroup';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'Group buttons together with horizontal or vertical orientation.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Horizontal Connected
  const horizontalSection = createDemoSection({
    title: 'Horizontal Connected',
    description: 'Buttons grouped horizontally with shared borders.',
    code: `import { createButtonGroup, addButtonsToGroup, createButton } from 'dosage';

const group = createButtonGroup({
  orientation: 'horizontal',
  connected: true,
  ariaLabel: 'Text alignment'
});

addButtonsToGroup(group, [
  createButton({ label: '◄' }),
  createButton({ label: '═' }),
  createButton({ label: '►' }),
]);`,
  });

  const horizontalExample = horizontalSection.querySelector('.dos-demo-section___examples');
  if (horizontalExample) {
    const group = createButtonGroup({
      orientation: 'horizontal',
      connected: true,
      ariaLabel: 'Text alignment',
    });

    const buttons = [
      createButton({ label: '◄' }),
      createButton({ label: '═' }),
      createButton({ label: '►' }),
    ];

    addButtonsToGroup(group, buttons);
    horizontalExample.appendChild(group);
  }
  content.appendChild(horizontalSection);

  // Vertical Connected
  const verticalSection = createDemoSection({
    title: 'Vertical Connected',
    description: 'Buttons grouped vertically with shared borders.',
    code: `const group = createButtonGroup({
  orientation: 'vertical',
  connected: true,
  ariaLabel: 'Zoom controls'
});

addButtonsToGroup(group, [
  createButton({ label: '+' }),
  createButton({ label: '○' }),
  createButton({ label: '-' }),
]);`,
  });

  const verticalExample = verticalSection.querySelector('.dos-demo-section___examples');
  if (verticalExample) {
    const group = createButtonGroup({
      orientation: 'vertical',
      connected: true,
      ariaLabel: 'Zoom controls',
    });

    const buttons = [
      createButton({ label: '+' }),
      createButton({ label: '○' }),
      createButton({ label: '-' }),
    ];

    addButtonsToGroup(group, buttons);
    verticalExample.appendChild(group);
  }
  content.appendChild(verticalSection);

  // Separated
  const separatedSection = createDemoSection({
    title: 'Separated Buttons',
    description: 'Buttons grouped with gaps between them.',
    code: `const group = createButtonGroup({
  orientation: 'horizontal',
  connected: false,
  ariaLabel: 'Actions'
});

addButtonsToGroup(group, [
  createButton({ label: 'New', variant: 'primary' }),
  createButton({ label: 'Open' }),
  createButton({ label: 'Save' }),
]);`,
  });

  const separatedExample = separatedSection.querySelector('.dos-demo-section___examples');
  if (separatedExample) {
    const group = createButtonGroup({
      orientation: 'horizontal',
      connected: false,
      ariaLabel: 'File actions',
    });

    const buttons = [
      createButton({ label: 'New', variant: 'primary' }),
      createButton({ label: 'Open' }),
      createButton({ label: 'Save' }),
    ];

    addButtonsToGroup(group, buttons);
    separatedExample.appendChild(group);
  }
  content.appendChild(separatedSection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the IconButton demo page
 */
export function renderIconButtonPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'IconButton';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'Square buttons with a single icon character. Requires accessible label.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Common Icons
  const iconsSection = createDemoSection({
    title: 'Common Icons',
    description: 'Typical icon buttons for common actions.',
    code: `import { createIconButton } from 'dosage';

createIconButton({ icon: 'X', label: 'Close' });
createIconButton({ icon: '?', label: 'Help' });
createIconButton({ icon: 'i', label: 'Info' });
createIconButton({ icon: '▲', label: 'Move up' });
createIconButton({ icon: '▼', label: 'Move down' });`,
  });

  const iconsExample = iconsSection.querySelector('.dos-demo-section___examples');
  if (iconsExample) {
    iconsExample.style.display = 'flex';
    iconsExample.style.gap = 'var(--dos-space-sm)';

    const icons = [
      { icon: 'X', label: 'Close' },
      { icon: '?', label: 'Help' },
      { icon: 'i', label: 'Info' },
      { icon: '▲', label: 'Move up' },
      { icon: '▼', label: 'Move down' },
      { icon: '►', label: 'Play' },
      { icon: '■', label: 'Stop' },
    ];

    icons.forEach(({ icon, label }) => {
      const btn = createIconButton({ icon, label });
      iconsExample.appendChild(btn);
    });
  }
  content.appendChild(iconsSection);

  // Variants
  const variantsSection = createDemoSection({
    title: 'Icon Button Variants',
    description: 'Different visual styles.',
    code: `createIconButton({ icon: '✓', label: 'Confirm', variant: 'primary' });
createIconButton({ icon: 'X', label: 'Cancel', variant: 'danger' });
createIconButton({ icon: '?', label: 'Help', variant: 'ghost' });`,
  });

  const variantsExample = variantsSection.querySelector('.dos-demo-section___examples');
  if (variantsExample) {
    variantsExample.style.display = 'flex';
    variantsExample.style.gap = 'var(--dos-space-sm)';

    const btns = [
      createIconButton({ icon: '✓', label: 'Confirm', variant: 'primary' }),
      createIconButton({ icon: '○', label: 'Default', variant: 'secondary' }),
      createIconButton({ icon: 'X', label: 'Cancel', variant: 'danger' }),
      createIconButton({ icon: '?', label: 'Help', variant: 'ghost' }),
    ];

    btns.forEach((btn) => variantsExample.appendChild(btn));
  }
  content.appendChild(variantsSection);

  // Sizes
  const sizesSection = createDemoSection({
    title: 'Icon Button Sizes',
    description: 'Small, medium, and large sizes.',
    code: `createIconButton({ icon: '►', label: 'Play', size: 'small' });
createIconButton({ icon: '►', label: 'Play', size: 'medium' });
createIconButton({ icon: '►', label: 'Play', size: 'large' });`,
  });

  const sizesExample = sizesSection.querySelector('.dos-demo-section___examples');
  if (sizesExample) {
    sizesExample.style.display = 'flex';
    sizesExample.style.alignItems = 'center';
    sizesExample.style.gap = 'var(--dos-space-sm)';

    const sizes = ['small', 'medium', 'large'] as const;
    sizes.forEach((size) => {
      const btn = createIconButton({
        icon: '►',
        label: `Play (${size})`,
        size,
        variant: 'primary',
      });
      sizesExample.appendChild(btn);
    });
  }
  content.appendChild(sizesSection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Link demo page
 */
export function renderLinkPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Link';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style hyperlinks with various underline options.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Link
  const basicSection = createDemoSection({
    title: 'Basic Link',
    description: 'Simple internal link with default underline.',
    code: `import { createLink } from 'dosage';

const link = createLink({
  href: '/about',
  label: 'About Page'
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const link = createLink({
      href: '#about',
      label: 'About Page',
    });
    basicExample.appendChild(link);
  }
  content.appendChild(basicSection);

  // External Link
  const externalSection = createDemoSection({
    title: 'External Link',
    description: 'Opens in new tab with external indicator.',
    code: `createLink({
  href: 'https://github.com',
  label: 'GitHub',
  external: true
});`,
  });

  const externalExample = externalSection.querySelector('.dos-demo-section___examples');
  if (externalExample) {
    const link = createLink({
      href: 'https://github.com',
      label: 'GitHub',
      external: true,
    });
    externalExample.appendChild(link);
  }
  content.appendChild(externalSection);

  // Underline Styles
  const underlineSection = createDemoSection({
    title: 'Underline Styles',
    description: 'Different underline options: always, hover, none.',
    code: `createLink({ href: '#', label: 'Always', underline: 'always' });
createLink({ href: '#', label: 'Hover', underline: 'hover' });
createLink({ href: '#', label: 'None', underline: 'none' });`,
  });

  const underlineExample = underlineSection.querySelector('.dos-demo-section___examples');
  if (underlineExample) {
    underlineExample.style.display = 'flex';
    underlineExample.style.gap = 'var(--dos-space-lg)';

    const underlines = ['always', 'hover', 'none'] as const;
    underlines.forEach((underline) => {
      const link = createLink({
        href: '#',
        label: `Underline: ${underline}`,
        underline,
      });
      underlineExample.appendChild(link);
    });
  }
  content.appendChild(underlineSection);

  // Disabled Link
  const disabledSection = createDemoSection({
    title: 'Disabled Link',
    description: 'Link that cannot be clicked.',
    code: `createLink({
  href: '/disabled',
  label: 'Disabled Link',
  disabled: true
});`,
  });

  const disabledExample = disabledSection.querySelector('.dos-demo-section___examples');
  if (disabledExample) {
    const link = createLink({
      href: '/disabled',
      label: 'Disabled Link',
      disabled: true,
    });
    disabledExample.appendChild(link);
  }
  content.appendChild(disabledSection);

  // Links in text
  const inTextSection = createDemoSection({
    title: 'Links in Text',
    description: 'Links can be used inline within paragraphs.',
    code: `// Links work naturally in text flow
<p>Visit our <Link href="/docs" label="documentation" /> for more info.</p>`,
  });

  const inTextExample = inTextSection.querySelector('.dos-demo-section___examples');
  if (inTextExample) {
    const p = document.createElement('p');
    p.textContent = 'Visit our ';

    const link1 = createLink({
      href: '#docs',
      label: 'documentation',
    });
    p.appendChild(link1);

    p.appendChild(document.createTextNode(' to learn more about DOSage, or check out the '));

    const link2 = createLink({
      href: 'https://github.com',
      label: 'source code',
      external: true,
    });
    p.appendChild(link2);

    p.appendChild(document.createTextNode(' on GitHub.'));

    inTextExample.appendChild(p);
  }
  content.appendChild(inTextSection);

  page.appendChild(content);
  return page;
}
