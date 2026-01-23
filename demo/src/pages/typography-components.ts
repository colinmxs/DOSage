/**
 * Typography Component Pages
 *
 * Individual page renderers for each typography component
 */

import { createDemoSection } from '../components/DemoSection';
import {
  createHeading,
  createText,
  createCode,
  createCodeBlock,
  createBlockquote,
  createList,
  createDefinitionList,
  createLabel,
  createASCIIArt,
} from 'dosage';

/**
 * Creates a page wrapper with header
 */
function createPage(title: string, description: string): { page: HTMLElement; content: HTMLElement } {
  const page = document.createElement('div');

  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = title;

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = description;

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';
  page.appendChild(content);

  return { page, content };
}

/**
 * Renders the Heading component page
 */
export function renderHeadingPage(): HTMLElement {
  const { page, content } = createPage(
    'Heading',
    'DOS-style semantic headings (H1-H6) with optional decoration and alignment.'
  );

  // Basic example
  const basicSection = createDemoSection({
    title: 'All Heading Levels',
    description: 'Semantic headings from H1 to H6.',
    code: `import { createHeading } from 'dosage';

const h1 = createHeading({ level: 1, children: 'Heading Level 1' });
const h2 = createHeading({ level: 2, children: 'Heading Level 2' });
const h3 = createHeading({ level: 3, children: 'Heading Level 3' });`,
  });

  const h1 = createHeading({ level: 1, children: 'Heading Level 1' });
  const h2 = createHeading({ level: 2, children: 'Heading Level 2' });
  const h3 = createHeading({ level: 3, children: 'Heading Level 3' });
  const h4 = createHeading({ level: 4, children: 'Heading Level 4' });
  const h5 = createHeading({ level: 5, children: 'Heading Level 5' });
  const h6 = createHeading({ level: 6, children: 'Heading Level 6' });

  const examples = basicSection.querySelector('.dos-demo-section___examples');
  examples?.append(h1, h2, h3, h4, h5, h6);

  // Decorated heading
  const decoratedSection = createDemoSection({
    title: 'Decorated Heading',
    description: 'Headings with underline decoration.',
    code: `const decorated = createHeading({
  level: 2,
  children: 'Decorated Heading',
  decorated: true
});`,
  });

  const decorated = createHeading({ level: 2, children: 'Decorated Heading', decorated: true });
  decoratedSection.querySelector('.dos-demo-section___examples')?.appendChild(decorated);

  // Aligned headings
  const alignedSection = createDemoSection({
    title: 'Alignment',
    description: 'Headings can be aligned left (default), center, or right.',
    code: `const center = createHeading({
  level: 3,
  children: 'Centered',
  align: 'center'
});

const right = createHeading({
  level: 3,
  children: 'Right-Aligned',
  align: 'right'
});`,
  });

  const left = createHeading({ level: 3, children: 'Left-Aligned (default)' });
  const center = createHeading({ level: 3, children: 'Centered', align: 'center' });
  const right = createHeading({ level: 3, children: 'Right-Aligned', align: 'right' });
  alignedSection.querySelector('.dos-demo-section___examples')?.append(left, center, right);

  content.append(basicSection, decoratedSection, alignedSection);
  return page;
}

/**
 * Renders the Text component page
 */
export function renderTextPage(): HTMLElement {
  const { page, content } = createPage(
    'Text',
    'Flexible text component supporting paragraphs, spans, or divs with size, weight, and alignment options.'
  );

  // Size variants
  const sizeSection = createDemoSection({
    title: 'Text Sizes',
    description: 'Three size variants: small, base, and large.',
    code: `const small = createText({ children: 'Small text', size: 'sm' });
const base = createText({ children: 'Base text', size: 'base' });
const large = createText({ children: 'Large text', size: 'lg' });`,
  });

  const small = createText({ children: 'Small text (14px)', size: 'sm' });
  const base = createText({ children: 'Base text (16px)', size: 'base' });
  const large = createText({ children: 'Large text (18px)', size: 'lg' });
  sizeSection.querySelector('.dos-demo-section___examples')?.append(small, base, large);

  // Bold text
  const boldSection = createDemoSection({
    title: 'Bold Text',
    description: 'Bold text simulated with color (DOS fonts lack weight variations).',
    code: `const bold = createText({ children: 'Bold text', weight: 'bold' });`,
  });

  const bold = createText({ children: 'Bold text (simulated with color)', weight: 'bold' });
  boldSection.querySelector('.dos-demo-section___examples')?.appendChild(bold);

  // Truncated text
  const truncateSection = createDemoSection({
    title: 'Truncated Text',
    description: 'Text that truncates with ellipsis when it exceeds container width.',
    code: `const truncated = createText({
  children: 'Very long text that will be truncated...',
  truncate: true
});`,
  });

  const truncateContainer = document.createElement('div');
  truncateContainer.style.maxWidth = '300px';
  const truncated = createText({
    children: 'This is a very long text that will be truncated with an ellipsis when it exceeds the container width',
    truncate: true,
  });
  truncateContainer.appendChild(truncated);
  truncateSection.querySelector('.dos-demo-section___examples')?.appendChild(truncateContainer);

  content.append(sizeSection, boldSection, truncateSection);
  return page;
}

/**
 * Renders the Code component page
 */
export function renderCodePage(): HTMLElement {
  const { page, content } = createPage('Code', 'Inline code snippets with optional highlighting.');

  // Basic inline code
  const basicSection = createDemoSection({
    title: 'Inline Code',
    description: 'Code inline with surrounding text.',
    code: `import { createCode, createText } from 'dosage';

const text = createText({ children: 'Use ', as: 'span' });
const code = createCode({ children: 'createButton()' });
const text2 = createText({ children: ' to create buttons.', as: 'span' });`,
  });

  const textBefore = createText({ children: 'Use the ', as: 'span' });
  const inlineCode = createCode({ children: 'createButton()' });
  const textAfter = createText({ children: ' function to create a button.', as: 'span' });

  const paragraph = document.createElement('p');
  paragraph.append(textBefore, inlineCode, textAfter);
  basicSection.querySelector('.dos-demo-section___examples')?.appendChild(paragraph);

  // Highlighted code
  const highlightedSection = createDemoSection({
    title: 'Highlighted Code',
    description: 'Emphasized inline code with inverted colors.',
    code: `const highlighted = createCode({
  children: 'config.json',
  highlighted: true
});`,
  });

  const highlightedText = createText({ children: 'Important: ', as: 'span', weight: 'bold' });
  const highlightedCode = createCode({ children: 'config.json', highlighted: true });

  const highlightedP = document.createElement('p');
  highlightedP.append(highlightedText, highlightedCode);
  highlightedSection.querySelector('.dos-demo-section___examples')?.appendChild(highlightedP);

  content.append(basicSection, highlightedSection);
  return page;
}

/**
 * Renders the CodeBlock component page
 */
export function renderCodeBlockPage(): HTMLElement {
  const { page, content } = createPage(
    'CodeBlock',
    'Multi-line code display with line numbers, syntax highlighting, and copy functionality.'
  );

  // Basic code block
  const basicSection = createDemoSection({
    title: 'Basic Code Block',
    description: 'Multi-line code display.',
    code: `const codeBlock = createCodeBlock({
  code: \`function greet(name) {
  console.log(\\\`Hello, \\\${name}!\\\`);
}\`,
  language: 'javascript'
});`,
  });

  const basicCodeBlock = createCodeBlock({
    code: `function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return name;
}

greet('World');`,
    language: 'javascript',
  });

  basicSection.querySelector('.dos-demo-section___examples')?.appendChild(basicCodeBlock);

  // With line numbers
  const numbersSection = createDemoSection({
    title: 'With Line Numbers',
    description: 'Code block with line numbers in the gutter.',
    code: `const numbered = createCodeBlock({
  code: 'def factorial(n):\\n    return 1 if n <= 1 else n * factorial(n-1)',
  language: 'python',
  showLineNumbers: true
});`,
  });

  const numberedBlock = createCodeBlock({
    code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`,
    language: 'python',
    showLineNumbers: true,
  });

  numbersSection.querySelector('.dos-demo-section___examples')?.appendChild(numberedBlock);

  // With highlighting
  const highlightSection = createDemoSection({
    title: 'With Line Highlighting',
    description: 'Highlight specific lines to draw attention.',
    code: `const highlighted = createCodeBlock({
  code: 'const config = {\\n  debug: true\\n};',
  showLineNumbers: true,
  highlightLines: [2]  // Highlight line 2
});`,
  });

  const highlightedBlock = createCodeBlock({
    code: `const config = {
  host: 'localhost',
  port: 3000,
  debug: true
};`,
    showLineNumbers: true,
    highlightLines: [3],
  });

  highlightSection.querySelector('.dos-demo-section___examples')?.appendChild(highlightedBlock);

  content.append(basicSection, numbersSection, highlightSection);
  return page;
}

/**
 * Renders the Blockquote component page
 */
export function renderBlockquotePage(): HTMLElement {
  const { page, content } = createPage(
    'Blockquote',
    'Quotation display with visual indicator and optional citation.'
  );

  // Basic quote
  const basicSection = createDemoSection({
    title: 'Basic Blockquote',
    description: 'Quote with default left indicator.',
    code: `const quote = createBlockquote({
  children: 'The best way to predict the future is to invent it.'
});`,
  });

  const basicQuote = createBlockquote({
    children: 'The best way to predict the future is to invent it.',
  });

  basicSection.querySelector('.dos-demo-section___examples')?.appendChild(basicQuote);

  // With citation
  const citedSection = createDemoSection({
    title: 'With Citation',
    description: 'Quote with attribution.',
    code: `const quote = createBlockquote({
  children: 'Talk is cheap. Show me the code.',
  cite: 'Linus Torvalds'
});`,
  });

  const citedQuote = createBlockquote({
    children: 'Talk is cheap. Show me the code.',
    cite: 'Linus Torvalds',
  });

  citedSection.querySelector('.dos-demo-section___examples')?.appendChild(citedQuote);

  // Custom indicator
  const customSection = createDemoSection({
    title: 'Custom Indicator',
    description: 'Use a custom character for the indicator.',
    code: `const quote = createBlockquote({
  children: 'Any sufficiently advanced technology...',
  cite: 'Arthur C. Clarke',
  indicator: '»'
});`,
  });

  const customQuote = createBlockquote({
    children: 'Any sufficiently advanced technology is indistinguishable from magic.',
    cite: 'Arthur C. Clarke',
    indicator: '»',
  });

  customSection.querySelector('.dos-demo-section___examples')?.appendChild(customQuote);

  content.append(basicSection, citedSection, customSection);
  return page;
}

/**
 * Renders the List component page
 */
export function renderListPage(): HTMLElement {
  const { page, content } = createPage(
    'List',
    'Unordered and ordered lists with custom bullets and nested support.'
  );

  // Unordered list
  const unorderedSection = createDemoSection({
    title: 'Unordered List',
    description: 'List with default bullet (■).',
    code: `const list = createList({
  items: [
    { content: 'First item' },
    { content: 'Second item' },
    { content: 'Third item' }
  ],
  ordered: false
});`,
  });

  const unorderedList = createList({
    items: [
      { content: 'First item' },
      { content: 'Second item' },
      { content: 'Third item' },
    ],
    ordered: false,
  });

  unorderedSection.querySelector('.dos-demo-section___examples')?.appendChild(unorderedList);

  // Ordered list
  const orderedSection = createDemoSection({
    title: 'Ordered List',
    description: 'Numbered list.',
    code: `const list = createList({
  items: [
    { content: 'Initialize project' },
    { content: 'Install dependencies' },
    { content: 'Run dev server' }
  ],
  ordered: true
});`,
  });

  const orderedList = createList({
    items: [
      { content: 'Initialize project' },
      { content: 'Install dependencies' },
      { content: 'Run development server' },
    ],
    ordered: true,
  });

  orderedSection.querySelector('.dos-demo-section___examples')?.appendChild(orderedList);

  // Nested list
  const nestedSection = createDemoSection({
    title: 'Nested List',
    description: 'Lists can contain child lists.',
    code: `const nested = createList({
  items: [
    { content: 'Parent 1' },
    {
      content: 'Parent 2',
      children: [
        { content: 'Child 2.1' },
        { content: 'Child 2.2' }
      ]
    }
  ]
});`,
  });

  const nestedList = createList({
    items: [
      { content: 'Parent item 1' },
      {
        content: 'Parent item 2',
        children: [
          { content: 'Child item 2.1' },
          { content: 'Child item 2.2' },
        ],
      },
      { content: 'Parent item 3' },
    ],
  });

  nestedSection.querySelector('.dos-demo-section___examples')?.appendChild(nestedList);

  // Custom bullet
  const customSection = createDemoSection({
    title: 'Custom Bullet',
    description: 'Use custom bullet characters (►, •, →, etc.).',
    code: `const custom = createList({
  items: [
    { content: 'Arrow bullet 1' },
    { content: 'Arrow bullet 2' }
  ],
  bullet: '►'
});`,
  });

  const customList = createList({
    items: [
      { content: 'Arrow bullet item 1' },
      { content: 'Arrow bullet item 2' },
      { content: 'Arrow bullet item 3' },
    ],
    bullet: '►',
  });

  customSection.querySelector('.dos-demo-section___examples')?.appendChild(customList);

  content.append(unorderedSection, orderedSection, nestedSection, customSection);
  return page;
}

/**
 * Renders the DefinitionList component page
 */
export function renderDefinitionListPage(): HTMLElement {
  const { page, content } = createPage(
    'DefinitionList',
    'Term and definition pairs with stacked or inline layout options.'
  );

  // Stacked layout
  const stackedSection = createDemoSection({
    title: 'Stacked Layout',
    description: 'Term above definition (default).',
    code: `const dl = createDefinitionList({
  items: [
    { term: 'HTML', definition: 'HyperText Markup Language' },
    { term: 'CSS', definition: 'Cascading Style Sheets' }
  ],
  layout: 'stacked'
});`,
  });

  const stackedList = createDefinitionList({
    items: [
      { term: 'HTML', definition: 'HyperText Markup Language' },
      { term: 'CSS', definition: 'Cascading Style Sheets' },
      { term: 'JS', definition: 'JavaScript' },
    ],
    layout: 'stacked',
  });

  stackedSection.querySelector('.dos-demo-section___examples')?.appendChild(stackedList);

  // Inline layout
  const inlineSection = createDemoSection({
    title: 'Inline Layout',
    description: 'Term and definition side-by-side.',
    code: `const dl = createDefinitionList({
  items: [
    { term: 'Width', definition: '100%' },
    { term: 'Height', definition: '50px' }
  ],
  layout: 'inline'
});`,
  });

  const inlineList = createDefinitionList({
    items: [
      { term: 'Width', definition: '100%' },
      { term: 'Height', definition: '50px' },
      { term: 'Margin', definition: '0 auto' },
    ],
    layout: 'inline',
  });

  inlineSection.querySelector('.dos-demo-section___examples')?.appendChild(inlineList);

  content.append(stackedSection, inlineSection);
  return page;
}

/**
 * Renders the Label component page
 */
export function renderLabelPage(): HTMLElement {
  const { page, content } = createPage('Label', 'Form labels with required indicators and disabled states.');

  // Basic label
  const basicSection = createDemoSection({
    title: 'Basic Label',
    description: 'Label associated with form control.',
    code: `const label = createLabel({
  text: 'Username',
  htmlFor: 'username-input'
});`,
  });

  const basicLabel = createLabel({
    text: 'Username',
    htmlFor: 'username-input',
  });

  basicSection.querySelector('.dos-demo-section___examples')?.appendChild(basicLabel);

  // Required field
  const requiredSection = createDemoSection({
    title: 'Required Field',
    description: 'Label with required indicator asterisk.',
    code: `const label = createLabel({
  text: 'Email Address',
  htmlFor: 'email-input',
  required: true
});`,
  });

  const requiredLabel = createLabel({
    text: 'Email Address',
    htmlFor: 'email-input',
    required: true,
  });

  requiredSection.querySelector('.dos-demo-section___examples')?.appendChild(requiredLabel);

  // Disabled label
  const disabledSection = createDemoSection({
    title: 'Disabled Label',
    description: 'Label for disabled form control.',
    code: `const label = createLabel({
  text: 'Disabled Field',
  htmlFor: 'disabled-input',
  disabled: true
});`,
  });

  const disabledLabel = createLabel({
    text: 'Disabled Field',
    htmlFor: 'disabled-input',
    disabled: true,
  });

  disabledSection.querySelector('.dos-demo-section___examples')?.appendChild(disabledLabel);

  content.append(basicSection, requiredSection, disabledSection);
  return page;
}

/**
 * Renders the ASCIIArt component page
 */
export function renderASCIIArtPage(): HTMLElement {
  const { page, content } = createPage(
    'ASCIIArt',
    'Display pre-formatted ASCII art or convert text to block ASCII letters.'
  );

  // Pre-formatted ASCII art
  const preformattedSection = createDemoSection({
    title: 'Pre-formatted ASCII Art',
    description: 'Display existing ASCII art with proper whitespace preservation.',
    code: `const art = createASCIIArt({
  art: \`   ╔═══╗
   ║DOS║
   ╚═══╝\`,
  altText: 'DOS logo'
});`,
  });

  const preformattedArt = createASCIIArt({
    art: `   ╔═══╗
   ║DOS║
   ╚═══╝`,
    altText: 'DOS logo in ASCII art',
  });

  preformattedSection.querySelector('.dos-demo-section___examples')?.appendChild(preformattedArt);

  // Text to ASCII conversion
  const convertSection = createDemoSection({
    title: 'Text to ASCII Conversion',
    description: 'Convert text to block ASCII letters (limited character set).',
    code: `const art = createASCIIArt({
  text: 'HELLO',
  altText: 'HELLO in block letters'
});`,
  });

  const convertedArt = createASCIIArt({
    text: 'HELLO',
    altText: 'HELLO in block ASCII letters',
  });

  convertSection.querySelector('.dos-demo-section___examples')?.appendChild(convertedArt);

  // Colored ASCII art
  const colorSection = createDemoSection({
    title: 'Colored ASCII Art',
    description: 'Apply custom colors to ASCII art.',
    code: `const art = createASCIIArt({
  art: '⚠ WARNING ⚠',
  altText: 'Warning icon',
  color: 'var(--dos-color-error)'
});`,
  });

  const coloredArt = createASCIIArt({
    art: '⚠ WARNING ⚠',
    altText: 'Warning icon',
    color: 'var(--dos-color-error)',
  });

  colorSection.querySelector('.dos-demo-section___examples')?.appendChild(coloredArt);

  // Animated ASCII art (typewriter effect)
  const animatedSection = createDemoSection({
    title: 'Animated ASCII Art (Typewriter Effect)',
    description: 'Animate ASCII art with a typewriter effect. Click the button to replay the animation.',
    code: `const art = createASCIIArt({
  art: \`╔════════════════════╗
║  LOADING SYSTEM... ║
║  ██████████  100%  ║
╚════════════════════╝\`,
  animate: true,
  animationSpeed: 30,
  text: 'Loading screen animation'
});`,
  });

  const animationContainer = document.createElement('div');
  animationContainer.style.marginBottom = 'var(--dos-space-md)';

  function createAnimatedArt(): HTMLPreElement {
    return createASCIIArt({
      art: `╔════════════════════╗
║  LOADING SYSTEM... ║
║  ██████████  100%  ║
╚════════════════════╝`,
      animate: true,
      animationSpeed: 30,
      text: 'Loading screen animation',
    });
  }

  animationContainer.appendChild(createAnimatedArt());

  const replayButton = document.createElement('button');
  replayButton.className = 'dos-button';
  replayButton.textContent = '▶ Replay Animation';
  replayButton.style.marginTop = 'var(--dos-space-md)';
  replayButton.addEventListener('click', () => {
    animationContainer.innerHTML = '';
    animationContainer.appendChild(createAnimatedArt());
  });

  const examplesContainer = animatedSection.querySelector('.dos-demo-section___examples');
  examplesContainer?.appendChild(animationContainer);
  examplesContainer?.appendChild(replayButton);

  content.append(preformattedSection, convertSection, colorSection, animatedSection);
  return page;
}
