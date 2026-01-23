import { DemoSection } from '../components/DemoSection';
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
} from '../../../src';

export function createTypographyPage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'page-typography';

  // Heading Component Section
  const headingSection = DemoSection({
    id: 'heading',
    title: 'Heading',
    description: 'DOS-style semantic headings (H1-H6) with optional decoration and alignment options.',
  });

  const headingExamples = document.createElement('div');
  headingExamples.className = 'demo-examples';
  
  // H1-H6 examples
  const headingLevelsDiv = document.createElement('div');
  headingLevelsDiv.className = 'demo-row';
  
  const h1 = createHeading({ level: 1, text: 'Heading Level 1' });
  const h2 = createHeading({ level: 2, text: 'Heading Level 2' });
  const h3 = createHeading({ level: 3, text: 'Heading Level 3' });
  const h4 = createHeading({ level: 4, text: 'Heading Level 4' });
  const h5 = createHeading({ level: 5, text: 'Heading Level 5' });
  const h6 = createHeading({ level: 6, text: 'Heading Level 6' });
  
  headingLevelsDiv.append(h1, h2, h3, h4, h5, h6);

  // Decorated heading example
  const decoratedDiv = document.createElement('div');
  decoratedDiv.className = 'demo-row';
  
  const decoratedHeading = createHeading({
    level: 2,
    text: 'Decorated Heading',
    decorated: true,
  });
  
  decoratedDiv.appendChild(decoratedHeading);

  // Aligned headings
  const alignedDiv = document.createElement('div');
  alignedDiv.className = 'demo-row';
  
  const centerHeading = createHeading({
    level: 3,
    text: 'Centered Heading',
    align: 'center',
  });
  
  const rightHeading = createHeading({
    level: 3,
    text: 'Right-Aligned Heading',
    align: 'right',
  });
  
  alignedDiv.append(centerHeading, rightHeading);

  headingExamples.append(headingLevelsDiv, decoratedDiv, alignedDiv);

  const headingCode = `import { createHeading } from 'dosage';

// Basic heading
const h1 = createHeading({ level: 1, text: 'Main Title' });

// Decorated heading
const h2 = createHeading({
  level: 2,
  text: 'Section Header',
  decorated: true
});

// Centered heading
const h3 = createHeading({
  level: 3,
  text: 'Centered',
  align: 'center'
});

document.body.appendChild(h1);`;

  headingSection.appendChild(headingExamples);
  const headingCodeBlock = createCodeBlock({ code: headingCode });
  headingSection.appendChild(headingCodeBlock);

  // Text Component Section
  const textSection = DemoSection({
    id: 'text',
    title: 'Text',
    description: 'Flexible text component supporting paragraphs, spans, or divs with size, weight, and alignment options.',
  });

  const textExamples = document.createElement('div');
  textExamples.className = 'demo-examples';

  // Size variants
  const sizeDiv = document.createElement('div');
  sizeDiv.className = 'demo-row';
  
  const smallText = createText({ content: 'Small text (14px)', size: 'sm' });
  const baseText = createText({ content: 'Base text (16px)', size: 'base' });
  const largeText = createText({ content: 'Large text (18px)', size: 'lg' });
  
  sizeDiv.append(smallText, baseText, largeText);

  // Bold text
  const boldDiv = document.createElement('div');
  boldDiv.className = 'demo-row';
  
  const boldText = createText({ content: 'Bold text (simulated with color)', bold: true });
  boldDiv.appendChild(boldText);

  // Truncated text
  const truncateDiv = document.createElement('div');
  truncateDiv.className = 'demo-row';
  truncateDiv.style.maxWidth = '300px';
  
  const truncatedText = createText({
    content: 'This is a very long text that will be truncated with an ellipsis when it exceeds the container width',
    truncate: true,
  });
  truncateDiv.appendChild(truncatedText);

  textExamples.append(sizeDiv, boldDiv, truncateDiv);

  const textCode = `import { createText } from 'dosage';

// Different sizes
const small = createText({ content: 'Small text', size: 'sm' });
const base = createText({ content: 'Base text', size: 'base' });
const large = createText({ content: 'Large text', size: 'lg' });

// Bold text
const bold = createText({ content: 'Bold text', bold: true });

// Truncated text
const truncated = createText({
  content: 'Very long text...',
  truncate: true
});

// Custom element type
const span = createText({ content: 'Inline text', as: 'span' });`;

  textSection.appendChild(textExamples);
  const textCodeBlock = createCodeBlock({ code: textCode });
  textSection.appendChild(textCodeBlock);

  // Code Component Section
  const codeSection = DemoSection({
    id: 'code',
    title: 'Code',
    description: 'Inline code snippets with optional highlighting.',
  });

  const codeExamples = document.createElement('div');
  codeExamples.className = 'demo-examples';

  const codeDiv = document.createElement('div');
  codeDiv.className = 'demo-row';
  
  const textBefore = createText({ content: 'Use the ', as: 'span' });
  const inlineCode = createCode({ code: 'createButton()' });
  const textAfter = createText({ content: ' function to create a button.', as: 'span' });
  
  const highlightedText = createText({ content: 'Important: ', as: 'span' });
  const highlightedCode = createCode({ code: 'config.json', highlighted: true });
  
  codeDiv.append(textBefore, inlineCode, textAfter);
  
  const highlightedDiv = document.createElement('div');
  highlightedDiv.className = 'demo-row';
  highlightedDiv.append(highlightedText, highlightedCode);

  codeExamples.append(codeDiv, highlightedDiv);

  const codeCodeBlock = `import { createCode, createText } from 'dosage';

// Inline code
const text = createText({ content: 'Use ', as: 'span' });
const code = createCode({ code: 'createButton()' });
const text2 = createText({ content: ' to create buttons.', as: 'span' });

// Highlighted code
const highlighted = createCode({
  code: 'config.json',
  highlighted: true
});`;

  codeSection.appendChild(codeExamples);
  const codeCodeCodeBlock = createCodeBlock({ code: codeCodeBlock });
  codeSection.appendChild(codeCodeCodeBlock);

  // CodeBlock Component Section
  const codeBlockSection = DemoSection({
    id: 'codeblock',
    title: 'CodeBlock',
    description: 'Multi-line code display with line numbers, syntax highlighting, and copy functionality.',
  });

  const codeBlockExamples = document.createElement('div');
  codeBlockExamples.className = 'demo-examples';

  // Basic code block
  const basicCodeBlockDiv = document.createElement('div');
  basicCodeBlockDiv.className = 'demo-row';
  
  const basicCodeBlock = createCodeBlock({
    code: `function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return name;
}

greet('World');`,
    language: 'javascript',
  });
  
  basicCodeBlockDiv.appendChild(basicCodeBlock);

  // With line numbers
  const lineNumbersDiv = document.createElement('div');
  lineNumbersDiv.className = 'demo-row';
  
  const lineNumbersBlock = createCodeBlock({
    code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`,
    language: 'python',
    showLineNumbers: true,
  });
  
  lineNumbersDiv.appendChild(lineNumbersBlock);

  // With highlighting
  const highlightDiv = document.createElement('div');
  highlightDiv.className = 'demo-row';
  
  const highlightBlock = createCodeBlock({
    code: `const config = {
  host: 'localhost',
  port: 3000,
  debug: true
};`,
    language: 'javascript',
    showLineNumbers: true,
    highlightLines: [3],
  });
  
  highlightDiv.appendChild(highlightBlock);

  codeBlockExamples.append(basicCodeBlockDiv, lineNumbersDiv, highlightDiv);

  const codeBlockCode = `import { createCodeBlock } from 'dosage';

// Basic code block
const basic = createCodeBlock({
  code: \`function greet(name) {
  console.log(\\\`Hello, \\\${name}!\\\`);
}\`,
  language: 'javascript'
});

// With line numbers
const numbered = createCodeBlock({
  code: 'def factorial(n):\\n    return 1 if n <= 1 else n * factorial(n-1)',
  language: 'python',
  showLineNumbers: true
});

// With highlighted lines
const highlighted = createCodeBlock({
  code: 'const config = {\\n  debug: true\\n};',
  showLineNumbers: true,
  highlightLines: [2]  // Highlight line 2
});`;

  codeBlockSection.appendChild(codeBlockExamples);
  const codeBlockCodeBlock = createCodeBlock({ code: codeBlockCode });
  codeBlockSection.appendChild(codeBlockCodeBlock);

  // Blockquote Component Section
  const blockquoteSection = DemoSection({
    id: 'blockquote',
    title: 'Blockquote',
    description: 'Quotation display with visual indicator and optional citation.',
  });

  const blockquoteExamples = document.createElement('div');
  blockquoteExamples.className = 'demo-examples';

  const basicQuoteDiv = document.createElement('div');
  basicQuoteDiv.className = 'demo-row';
  
  const basicQuote = createBlockquote({
    content: 'The best way to predict the future is to invent it.',
  });
  
  basicQuoteDiv.appendChild(basicQuote);

  const citedQuoteDiv = document.createElement('div');
  citedQuoteDiv.className = 'demo-row';
  
  const citedQuote = createBlockquote({
    content: 'Talk is cheap. Show me the code.',
    cite: 'Linus Torvalds',
  });
  
  citedQuoteDiv.appendChild(citedQuote);

  const customIndicatorDiv = document.createElement('div');
  customIndicatorDiv.className = 'demo-row';
  
  const customQuote = createBlockquote({
    content: 'Any sufficiently advanced technology is indistinguishable from magic.',
    cite: 'Arthur C. Clarke',
    indicator: '»',
  });
  
  customIndicatorDiv.appendChild(customQuote);

  blockquoteExamples.append(basicQuoteDiv, citedQuoteDiv, customIndicatorDiv);

  const blockquoteCode = `import { createBlockquote } from 'dosage';

// Basic quote
const quote1 = createBlockquote({
  content: 'The best way to predict the future is to invent it.'
});

// With citation
const quote2 = createBlockquote({
  content: 'Talk is cheap. Show me the code.',
  cite: 'Linus Torvalds'
});

// Custom indicator
const quote3 = createBlockquote({
  content: 'Any sufficiently advanced technology...',
  cite: 'Arthur C. Clarke',
  indicator: '»'
});`;

  blockquoteSection.appendChild(blockquoteExamples);
  const blockquoteCodeBlock = createCodeBlock({ code: blockquoteCode });
  blockquoteSection.appendChild(blockquoteCodeBlock);

  // List Component Section
  const listSection = DemoSection({
    id: 'list',
    title: 'List',
    description: 'Unordered and ordered lists with custom bullets and nested support.',
  });

  const listExamples = document.createElement('div');
  listExamples.className = 'demo-examples';

  const unorderedDiv = document.createElement('div');
  unorderedDiv.className = 'demo-row';
  
  const unorderedList = createList({
    items: [
      { content: 'First item' },
      { content: 'Second item' },
      { content: 'Third item' },
    ],
    ordered: false,
  });
  
  unorderedDiv.appendChild(unorderedList);

  const orderedDiv = document.createElement('div');
  orderedDiv.className = 'demo-row';
  
  const orderedList = createList({
    items: [
      { content: 'Initialize project' },
      { content: 'Install dependencies' },
      { content: 'Run development server' },
    ],
    ordered: true,
  });
  
  orderedDiv.appendChild(orderedList);

  const nestedDiv = document.createElement('div');
  nestedDiv.className = 'demo-row';
  
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
    ordered: false,
  });
  
  nestedDiv.appendChild(nestedList);

  const customBulletDiv = document.createElement('div');
  customBulletDiv.className = 'demo-row';
  
  const customBulletList = createList({
    items: [
      { content: 'Arrow bullet item 1' },
      { content: 'Arrow bullet item 2' },
      { content: 'Arrow bullet item 3' },
    ],
    ordered: false,
    bullet: '►',
  });
  
  customBulletDiv.appendChild(customBulletList);

  listExamples.append(unorderedDiv, orderedDiv, nestedDiv, customBulletDiv);

  const listCode = `import { createList } from 'dosage';

// Unordered list
const ul = createList({
  items: [
    { content: 'First item' },
    { content: 'Second item' }
  ],
  ordered: false
});

// Ordered list
const ol = createList({
  items: [
    { content: 'Step 1' },
    { content: 'Step 2' }
  ],
  ordered: true
});

// Nested list
const nested = createList({
  items: [
    { content: 'Parent' },
    {
      content: 'Parent with children',
      children: [
        { content: 'Child 1' },
        { content: 'Child 2' }
      ]
    }
  ]
});

// Custom bullet
const custom = createList({
  items: [{ content: 'Item' }],
  bullet: '►'
});`;

  listSection.appendChild(listExamples);
  const listCodeBlock = createCodeBlock({ code: listCode });
  listSection.appendChild(listCodeBlock);

  // DefinitionList Component Section
  const defListSection = DemoSection({
    id: 'definition-list',
    title: 'DefinitionList',
    description: 'Term and definition pairs with stacked or inline layout options.',
  });

  const defListExamples = document.createElement('div');
  defListExamples.className = 'demo-examples';

  const stackedDiv = document.createElement('div');
  stackedDiv.className = 'demo-row';
  
  const stackedList = createDefinitionList({
    items: [
      { term: 'HTML', definition: 'HyperText Markup Language' },
      { term: 'CSS', definition: 'Cascading Style Sheets' },
      { term: 'JS', definition: 'JavaScript' },
    ],
    layout: 'stacked',
  });
  
  stackedDiv.appendChild(stackedList);

  const inlineDiv = document.createElement('div');
  inlineDiv.className = 'demo-row';
  
  const inlineList = createDefinitionList({
    items: [
      { term: 'Width', definition: '100%' },
      { term: 'Height', definition: '50px' },
      { term: 'Margin', definition: '0 auto' },
    ],
    layout: 'inline',
  });
  
  inlineDiv.appendChild(inlineList);

  defListExamples.append(stackedDiv, inlineDiv);

  const defListCode = `import { createDefinitionList } from 'dosage';

// Stacked layout (default)
const stacked = createDefinitionList({
  items: [
    { term: 'HTML', definition: 'HyperText Markup Language' },
    { term: 'CSS', definition: 'Cascading Style Sheets' },
    { term: 'JS', definition: 'JavaScript' }
  ],
  layout: 'stacked'
});

// Inline layout
const inline = createDefinitionList({
  items: [
    { term: 'Width', definition: '100%' },
    { term: 'Height', definition: '50px' }
  ],
  layout: 'inline'
});`;

  defListSection.appendChild(defListExamples);
  const defListCodeBlock = createCodeBlock({ code: defListCode });
  defListSection.appendChild(defListCodeBlock);

  // Label Component Section
  const labelSection = DemoSection({
    id: 'label',
    title: 'Label',
    description: 'Form labels with required indicators and disabled states.',
  });

  const labelExamples = document.createElement('div');
  labelExamples.className = 'demo-examples';

  const basicLabelDiv = document.createElement('div');
  basicLabelDiv.className = 'demo-row';
  
  const basicLabel = createLabel({
    text: 'Username',
    htmlFor: 'username-input',
  });
  
  basicLabelDiv.appendChild(basicLabel);

  const requiredLabelDiv = document.createElement('div');
  requiredLabelDiv.className = 'demo-row';
  
  const requiredLabel = createLabel({
    text: 'Email Address',
    htmlFor: 'email-input',
    required: true,
  });
  
  requiredLabelDiv.appendChild(requiredLabel);

  const disabledLabelDiv = document.createElement('div');
  disabledLabelDiv.className = 'demo-row';
  
  const disabledLabel = createLabel({
    text: 'Disabled Field',
    htmlFor: 'disabled-input',
    disabled: true,
  });
  
  disabledLabelDiv.appendChild(disabledLabel);

  labelExamples.append(basicLabelDiv, requiredLabelDiv, disabledLabelDiv);

  const labelCode = `import { createLabel } from 'dosage';

// Basic label
const label1 = createLabel({
  text: 'Username',
  htmlFor: 'username-input'
});

// Required field label
const label2 = createLabel({
  text: 'Email Address',
  htmlFor: 'email-input',
  required: true  // Adds asterisk indicator
});

// Disabled label
const label3 = createLabel({
  text: 'Disabled Field',
  htmlFor: 'disabled-input',
  disabled: true
});`;

  labelSection.appendChild(labelExamples);
  const labelCodeBlock = createCodeBlock({ code: labelCode });
  labelSection.appendChild(labelCodeBlock);

  // ASCIIArt Component Section
  const asciiSection = DemoSection({
    id: 'ascii-art',
    title: 'ASCIIArt',
    description: 'Display pre-formatted ASCII art or convert text to block ASCII letters.',
  });

  const asciiExamples = document.createElement('div');
  asciiExamples.className = 'demo-examples';

  const preformattedDiv = document.createElement('div');
  preformattedDiv.className = 'demo-row';
  
  const preformattedArt = createASCIIArt({
    art: `   ╔═══╗
   ║DOS║
   ╚═══╝`,
    altText: 'DOS logo in ASCII art',
  });
  
  preformattedDiv.appendChild(preformattedArt);

  const convertedDiv = document.createElement('div');
  convertedDiv.className = 'demo-row';
  
  const convertedArt = createASCIIArt({
    text: 'HELLO',
    altText: 'HELLO in block ASCII letters',
  });
  
  convertedDiv.appendChild(convertedArt);

  asciiExamples.append(preformattedDiv, convertedDiv);

  const asciiCode = `import { createASCIIArt } from 'dosage';

// Pre-formatted ASCII art
const art1 = createASCIIArt({
  art: \`   ╔═══╗
   ║DOS║
   ╚═══╝\`,
  altText: 'DOS logo'
});

// Convert text to ASCII
const art2 = createASCIIArt({
  text: 'HELLO',
  altText: 'HELLO in block letters'
});

// Colored ASCII art
const art3 = createASCIIArt({
  art: '⚠ WARNING ⚠',
  altText: 'Warning icon',
  color: 'var(--dos-color-error)'
});`;

  asciiSection.appendChild(asciiExamples);
  const asciiCodeBlock = createCodeBlock({ code: asciiCode });
  asciiSection.appendChild(asciiCodeBlock);

  // Append all sections to container
  container.append(
    headingSection,
    textSection,
    codeSection,
    codeBlockSection,
    blockquoteSection,
    listSection,
    defListSection,
    labelSection,
    asciiSection
  );

  return container;
}
