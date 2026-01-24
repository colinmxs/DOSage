/**
 * Form Controls Page
 *
 * Demonstrates TextInput, Textarea, PasswordInput, Checkbox,
 * RadioButton, FormGroup, and FormValidation components.
 */

import { createDemoSection } from '../components/DemoSection';
import {
  createTextInput,
  createTextarea,
  createPasswordInput,
  createCheckbox,
  createRadioButton,
  createRadioGroup,
  createFormGroup,
  createFormValidation,
} from 'dosage';

/**
 * Renders the TextInput demo page
 */
export function renderTextInputPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'TextInput';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style single-line text input with label and validation.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic TextInput',
    description: 'Simple text input with label.',
    code: `import { createTextInput } from 'dosage';

const input = createTextInput({
  label: 'Username',
  name: 'username',
  placeholder: 'Enter username...'
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const input = createTextInput({
      label: 'Username',
      name: 'username',
      placeholder: 'Enter username...',
    });
    basicExample.appendChild(input);
  }
  content.appendChild(basicSection);

  // Required Input
  const requiredSection = createDemoSection({
    title: 'Required Field',
    description: 'Input with required indicator.',
    code: `createTextInput({
  label: 'Email',
  name: 'email',
  required: true,
  placeholder: 'user@example.com'
});`,
  });

  const requiredExample = requiredSection.querySelector('.dos-demo-section___examples');
  if (requiredExample) {
    const input = createTextInput({
      label: 'Email',
      name: 'email',
      required: true,
      placeholder: 'user@example.com',
    });
    requiredExample.appendChild(input);
  }
  content.appendChild(requiredSection);

  // Error State
  const errorSection = createDemoSection({
    title: 'Error State',
    description: 'Input with error message.',
    code: `createTextInput({
  label: 'Email',
  name: 'email',
  error: 'Please enter a valid email address'
});`,
  });

  const errorExample = errorSection.querySelector('.dos-demo-section___examples');
  if (errorExample) {
    const input = createTextInput({
      label: 'Email',
      name: 'email',
      value: 'invalid-email',
      error: 'Please enter a valid email address',
    });
    errorExample.appendChild(input);
  }
  content.appendChild(errorSection);

  // Disabled State
  const disabledSection = createDemoSection({
    title: 'Disabled State',
    description: 'Disabled text input.',
    code: `createTextInput({
  label: 'Locked Field',
  name: 'locked',
  value: 'Cannot edit',
  disabled: true
});`,
  });

  const disabledExample = disabledSection.querySelector('.dos-demo-section___examples');
  if (disabledExample) {
    const input = createTextInput({
      label: 'Locked Field',
      name: 'locked',
      value: 'Cannot edit',
      disabled: true,
    });
    disabledExample.appendChild(input);
  }
  content.appendChild(disabledSection);

  // Max Length
  const maxLengthSection = createDemoSection({
    title: 'Max Length',
    description: 'Input with maximum character limit.',
    code: `createTextInput({
  label: 'Short Code',
  name: 'code',
  maxLength: 8,
  placeholder: '8 chars max'
});`,
  });

  const maxLengthExample = maxLengthSection.querySelector('.dos-demo-section___examples');
  if (maxLengthExample) {
    const input = createTextInput({
      label: 'Short Code',
      name: 'code',
      maxLength: 8,
      placeholder: '8 chars max',
    });
    maxLengthExample.appendChild(input);
  }
  content.appendChild(maxLengthSection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Textarea demo page
 */
export function renderTextareaPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Textarea';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style multi-line text input with character count and resize options.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic Textarea',
    description: 'Simple multi-line text input.',
    code: `import { createTextarea } from 'dosage';

const textarea = createTextarea({
  label: 'Description',
  name: 'description',
  placeholder: 'Enter your text here...',
  rows: 4
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const textarea = createTextarea({
      label: 'Description',
      name: 'description',
      placeholder: 'Enter your text here...',
      rows: 4,
    });
    basicExample.appendChild(textarea);
  }
  content.appendChild(basicSection);

  // Character Count
  const countSection = createDemoSection({
    title: 'Character Count',
    description: 'Textarea with character count display.',
    code: `createTextarea({
  label: 'Tweet',
  name: 'tweet',
  maxLength: 280,
  showCount: true,
  rows: 3,
  placeholder: "What's happening?"
});`,
  });

  const countExample = countSection.querySelector('.dos-demo-section___examples');
  if (countExample) {
    const textarea = createTextarea({
      label: 'Tweet',
      name: 'tweet',
      maxLength: 280,
      showCount: true,
      rows: 3,
      placeholder: "What's happening?",
    });
    countExample.appendChild(textarea);
  }
  content.appendChild(countSection);

  // Resize Options
  const resizeSection = createDemoSection({
    title: 'Resize Options',
    description: 'Different resize behaviors.',
    code: `createTextarea({ label: 'No Resize', resizable: 'none' });
createTextarea({ label: 'Vertical', resizable: 'vertical' });
createTextarea({ label: 'Horizontal', resizable: 'horizontal' });
createTextarea({ label: 'Both', resizable: 'both' });`,
  });

  const resizeExample = resizeSection.querySelector('.dos-demo-section___examples');
  if (resizeExample) {
    resizeExample.style.display = 'grid';
    resizeExample.style.gridTemplateColumns = 'repeat(2, 1fr)';
    resizeExample.style.gap = 'var(--dos-space-md)';

    const options: Array<{ label: string; resize: 'none' | 'vertical' | 'horizontal' | 'both' }> = [
      { label: 'No Resize', resize: 'none' },
      { label: 'Vertical', resize: 'vertical' },
      { label: 'Horizontal', resize: 'horizontal' },
      { label: 'Both', resize: 'both' },
    ];

    options.forEach(({ label, resize }) => {
      const textarea = createTextarea({
        label,
        name: `resize-${resize}`,
        rows: 2,
        resizable: resize,
        placeholder: `resizable: '${resize}'`,
      });
      resizeExample.appendChild(textarea);
    });
  }
  content.appendChild(resizeSection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the PasswordInput demo page
 */
export function renderPasswordInputPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'PasswordInput';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style password input with visibility toggle.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic PasswordInput',
    description: 'Password input with toggle button.',
    code: `import { createPasswordInput } from 'dosage';

const password = createPasswordInput({
  label: 'Password',
  name: 'password',
  placeholder: 'Enter password...'
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const password = createPasswordInput({
      label: 'Password',
      name: 'password',
      placeholder: 'Enter password...',
    });
    basicExample.appendChild(password);
  }
  content.appendChild(basicSection);

  // Mask Character Options
  const maskSection = createDemoSection({
    title: 'Mask Characters',
    description: 'Different masking character styles.',
    code: `createPasswordInput({
  label: 'Asterisks',
  maskChar: '*'
});
createPasswordInput({
  label: 'Bullets',
  maskChar: '●'
});
createPasswordInput({
  label: 'Blocks',
  maskChar: '█'
});`,
  });

  const maskExample = maskSection.querySelector('.dos-demo-section___examples');
  if (maskExample) {
    maskExample.style.display = 'flex';
    maskExample.style.flexDirection = 'column';
    maskExample.style.gap = 'var(--dos-space-md)';

    const masks: Array<{ label: string; char: '*' | '●' | '█' }> = [
      { label: 'Asterisks (*)', char: '*' },
      { label: 'Bullets (●)', char: '●' },
      { label: 'Blocks (█)', char: '█' },
    ];

    masks.forEach(({ label, char }) => {
      const password = createPasswordInput({
        label,
        name: `mask-${char}`,
        maskChar: char,
        value: 'password',
      });
      maskExample.appendChild(password);
    });
  }
  content.appendChild(maskSection);

  // Error State
  const errorSection = createDemoSection({
    title: 'Error State',
    description: 'Password input with validation error.',
    code: `createPasswordInput({
  label: 'Password',
  name: 'password',
  error: 'Password must be at least 8 characters'
});`,
  });

  const errorExample = errorSection.querySelector('.dos-demo-section___examples');
  if (errorExample) {
    const password = createPasswordInput({
      label: 'Password',
      name: 'password',
      value: 'short',
      error: 'Password must be at least 8 characters',
    });
    errorExample.appendChild(password);
  }
  content.appendChild(errorSection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Checkbox demo page
 */
export function renderCheckboxPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Checkbox';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style checkbox with [ ], [X], and [-] states.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic Checkbox',
    description: 'Simple checkbox with label.',
    code: `import { createCheckbox } from 'dosage';

const checkbox = createCheckbox({
  label: 'Enable feature',
  name: 'feature',
  onChange: (checked) => console.log('Checked:', checked)
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const checkbox = createCheckbox({
      label: 'Enable feature',
      name: 'feature',
    });
    basicExample.appendChild(checkbox);
  }
  content.appendChild(basicSection);

  // States
  const statesSection = createDemoSection({
    title: 'Checkbox States',
    description: 'Unchecked, checked, and indeterminate states.',
    code: `createCheckbox({ label: 'Unchecked', checked: false });
createCheckbox({ label: 'Checked', checked: true });
createCheckbox({ label: 'Indeterminate', indeterminate: true });
createCheckbox({ label: 'Disabled', disabled: true });
createCheckbox({ label: 'Checked + Disabled', checked: true, disabled: true });`,
  });

  const statesExample = statesSection.querySelector('.dos-demo-section___examples');
  if (statesExample) {
    statesExample.style.display = 'flex';
    statesExample.style.flexDirection = 'column';
    statesExample.style.gap = 'var(--dos-space-sm)';

    const states: Array<{
      label: string;
      checked?: boolean;
      indeterminate?: boolean;
      disabled?: boolean;
    }> = [
      { label: 'Unchecked', checked: false },
      { label: 'Checked', checked: true },
      { label: 'Indeterminate', indeterminate: true },
      { label: 'Disabled', disabled: true },
      { label: 'Checked + Disabled', checked: true, disabled: true },
    ];

    states.forEach(({ label, checked, indeterminate, disabled }) => {
      const checkbox = createCheckbox({
        label,
        name: `state-${label.toLowerCase().replace(/\s/g, '-')}`,
        checked,
        indeterminate,
        disabled,
      });
      statesExample.appendChild(checkbox);
    });
  }
  content.appendChild(statesSection);

  // Checkmark Characters
  const charSection = createDemoSection({
    title: 'Checkmark Characters',
    description: 'Different visual styles for the checkmark.',
    code: `createCheckbox({ label: 'X mark', checkChar: 'X', checked: true });
createCheckbox({ label: 'Check mark', checkChar: '✓', checked: true });
createCheckbox({ label: 'Asterisk', checkChar: '*', checked: true });`,
  });

  const charExample = charSection.querySelector('.dos-demo-section___examples');
  if (charExample) {
    charExample.style.display = 'flex';
    charExample.style.flexDirection = 'column';
    charExample.style.gap = 'var(--dos-space-sm)';

    const chars: Array<{ label: string; char: 'X' | '✓' | '*' }> = [
      { label: 'X mark', char: 'X' },
      { label: 'Check mark', char: '✓' },
      { label: 'Asterisk', char: '*' },
    ];

    chars.forEach(({ label, char }) => {
      const checkbox = createCheckbox({
        label,
        name: `char-${char}`,
        checkChar: char,
        checked: true,
      });
      charExample.appendChild(checkbox);
    });
  }
  content.appendChild(charSection);

  // Label Positions
  const positionSection = createDemoSection({
    title: 'Label Position',
    description: 'Label can be placed on either side.',
    code: `createCheckbox({ label: 'Label after', labelPosition: 'after' });
createCheckbox({ label: 'Label before', labelPosition: 'before' });`,
  });

  const positionExample = positionSection.querySelector('.dos-demo-section___examples');
  if (positionExample) {
    positionExample.style.display = 'flex';
    positionExample.style.flexDirection = 'column';
    positionExample.style.gap = 'var(--dos-space-sm)';

    const checkbox1 = createCheckbox({
      label: 'Label after (default)',
      name: 'pos-after',
      labelPosition: 'after',
      checked: true,
    });
    positionExample.appendChild(checkbox1);

    const checkbox2 = createCheckbox({
      label: 'Label before',
      name: 'pos-before',
      labelPosition: 'before',
      checked: true,
    });
    positionExample.appendChild(checkbox2);
  }
  content.appendChild(positionSection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the RadioButton demo page
 */
export function renderRadioButtonPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'RadioButton';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style radio buttons with ( ) and (•) states, plus RadioGroup container.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic RadioGroup
  const basicSection = createDemoSection({
    title: 'Basic RadioGroup',
    description: 'Group of radio buttons with vertical layout.',
    code: `import { createRadioGroup } from 'dosage';

const group = createRadioGroup({
  name: 'color',
  label: 'Select Color',
  options: [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' }
  ],
  onChange: (value) => console.log('Selected:', value)
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const group = createRadioGroup({
      name: 'color',
      label: 'Select Color',
      options: [
        { value: 'red', label: 'Red' },
        { value: 'green', label: 'Green' },
        { value: 'blue', label: 'Blue' },
      ],
    });
    basicExample.appendChild(group);
  }
  content.appendChild(basicSection);

  // Horizontal Layout
  const horizontalSection = createDemoSection({
    title: 'Horizontal Layout',
    description: 'Radio buttons arranged horizontally.',
    code: `createRadioGroup({
  name: 'size',
  label: 'Select Size',
  orientation: 'horizontal',
  options: [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ]
});`,
  });

  const horizontalExample = horizontalSection.querySelector('.dos-demo-section___examples');
  if (horizontalExample) {
    const group = createRadioGroup({
      name: 'size',
      label: 'Select Size',
      orientation: 'horizontal',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
    });
    horizontalExample.appendChild(group);
  }
  content.appendChild(horizontalSection);

  // Pre-selected Value
  const preselectedSection = createDemoSection({
    title: 'Pre-selected Value',
    description: 'RadioGroup with initial selection.',
    code: `createRadioGroup({
  name: 'priority',
  label: 'Priority Level',
  value: 'normal',
  options: [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' }
  ]
});`,
  });

  const preselectedExample = preselectedSection.querySelector('.dos-demo-section___examples');
  if (preselectedExample) {
    const group = createRadioGroup({
      name: 'priority',
      label: 'Priority Level',
      value: 'normal',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
      ],
    });
    preselectedExample.appendChild(group);
  }
  content.appendChild(preselectedSection);

  // Required with Error
  const errorSection = createDemoSection({
    title: 'Required with Error',
    description: 'RadioGroup with required indicator and error state.',
    code: `createRadioGroup({
  name: 'terms',
  label: 'Accept Terms',
  required: true,
  error: 'Please select an option',
  options: [
    { value: 'yes', label: 'I accept' },
    { value: 'no', label: 'I decline' }
  ]
});`,
  });

  const errorExample = errorSection.querySelector('.dos-demo-section___examples');
  if (errorExample) {
    const group = createRadioGroup({
      name: 'terms',
      label: 'Accept Terms',
      required: true,
      error: 'Please select an option',
      options: [
        { value: 'yes', label: 'I accept' },
        { value: 'no', label: 'I decline' },
      ],
    });
    errorExample.appendChild(group);
  }
  content.appendChild(errorSection);

  // Disabled Options
  const disabledSection = createDemoSection({
    title: 'Disabled Options',
    description: 'Individual options can be disabled.',
    code: `createRadioGroup({
  name: 'plan',
  label: 'Select Plan',
  options: [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro (Coming Soon)', disabled: true },
    { value: 'enterprise', label: 'Enterprise' }
  ]
});`,
  });

  const disabledExample = disabledSection.querySelector('.dos-demo-section___examples');
  if (disabledExample) {
    const group = createRadioGroup({
      name: 'plan',
      label: 'Select Plan',
      options: [
        { value: 'free', label: 'Free' },
        { value: 'pro', label: 'Pro (Coming Soon)', disabled: true },
        { value: 'enterprise', label: 'Enterprise' },
      ],
    });
    disabledExample.appendChild(group);
  }
  content.appendChild(disabledSection);

  // Single RadioButton
  const singleSection = createDemoSection({
    title: 'Single RadioButton',
    description: 'Individual radio button (typically used within custom groups).',
    code: `import { createRadioButton } from 'dosage';

const radio = createRadioButton({
  name: 'option',
  value: 'opt1',
  label: 'Option 1'
});`,
  });

  const singleExample = singleSection.querySelector('.dos-demo-section___examples');
  if (singleExample) {
    singleExample.style.display = 'flex';
    singleExample.style.flexDirection = 'column';
    singleExample.style.gap = 'var(--dos-space-sm)';

    const radio1 = createRadioButton({
      name: 'single',
      value: 'opt1',
      label: 'Unselected radio',
    });
    singleExample.appendChild(radio1);

    const radio2 = createRadioButton({
      name: 'single2',
      value: 'opt2',
      label: 'Selected radio',
      checked: true,
    });
    singleExample.appendChild(radio2);

    const radio3 = createRadioButton({
      name: 'single3',
      value: 'opt3',
      label: 'Disabled radio',
      disabled: true,
    });
    singleExample.appendChild(radio3);
  }
  content.appendChild(singleSection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the FormGroup demo page
 */
export function renderFormGroupPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'FormGroup';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style fieldset for grouping related form controls with legend.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic FormGroup',
    description: 'Group of form controls with legend.',
    code: `import { createFormGroup, createTextInput } from 'dosage';

const group = createFormGroup({
  legend: 'Personal Information',
  children: [
    createTextInput({ label: 'First Name', name: 'firstName' }),
    createTextInput({ label: 'Last Name', name: 'lastName' }),
    createTextInput({ label: 'Email', name: 'email' })
  ]
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const group = createFormGroup({
      legend: 'Personal Information',
      children: [
        createTextInput({ label: 'First Name', name: 'firstName' }),
        createTextInput({ label: 'Last Name', name: 'lastName' }),
        createTextInput({ label: 'Email', name: 'email' }),
      ],
    });
    basicExample.appendChild(group);
  }
  content.appendChild(basicSection);

  // With Description
  const descSection = createDemoSection({
    title: 'With Description',
    description: 'FormGroup with helper text.',
    code: `createFormGroup({
  legend: 'Account Settings',
  description: 'Configure your account preferences.',
  children: [
    createCheckbox({ label: 'Enable notifications', name: 'notifications' }),
    createCheckbox({ label: 'Enable dark mode', name: 'darkMode' })
  ]
});`,
  });

  const descExample = descSection.querySelector('.dos-demo-section___examples');
  if (descExample) {
    const group = createFormGroup({
      legend: 'Account Settings',
      description: 'Configure your account preferences.',
      children: [
        createCheckbox({ label: 'Enable notifications', name: 'notifications' }),
        createCheckbox({ label: 'Enable dark mode', name: 'darkMode' }),
      ],
    });
    descExample.appendChild(group);
  }
  content.appendChild(descSection);

  // Required with Error
  const errorSection = createDemoSection({
    title: 'Required with Error',
    description: 'FormGroup with required indicator and error state.',
    code: `createFormGroup({
  legend: 'Required Fields',
  required: true,
  error: 'Please fill in all required fields',
  children: [
    createTextInput({ label: 'Username', name: 'username', required: true }),
    createPasswordInput({ label: 'Password', name: 'password', required: true })
  ]
});`,
  });

  const errorExample = errorSection.querySelector('.dos-demo-section___examples');
  if (errorExample) {
    const group = createFormGroup({
      legend: 'Required Fields',
      required: true,
      error: 'Please fill in all required fields',
      children: [
        createTextInput({ label: 'Username', name: 'username', required: true }),
        createPasswordInput({ label: 'Password', name: 'password', required: true }),
      ],
    });
    errorExample.appendChild(group);
  }
  content.appendChild(errorSection);

  // Disabled
  const disabledSection = createDemoSection({
    title: 'Disabled FormGroup',
    description: 'All form controls inside are disabled.',
    code: `createFormGroup({
  legend: 'Locked Section',
  disabled: true,
  children: [
    createTextInput({ label: 'Name', name: 'name', value: 'John Doe' }),
    createTextInput({ label: 'Email', name: 'email', value: 'john@example.com' })
  ]
});`,
  });

  const disabledExample = disabledSection.querySelector('.dos-demo-section___examples');
  if (disabledExample) {
    const group = createFormGroup({
      legend: 'Locked Section',
      disabled: true,
      children: [
        createTextInput({ label: 'Name', name: 'name', value: 'John Doe' }),
        createTextInput({ label: 'Email', name: 'email', value: 'john@example.com' }),
      ],
    });
    disabledExample.appendChild(group);
  }
  content.appendChild(disabledSection);

  // Without Legend
  const noLegendSection = createDemoSection({
    title: 'Without Legend',
    description: 'FormGroup without a visible legend (border-only grouping).',
    code: `createFormGroup({
  description: 'Optional fields',
  children: [
    createTextInput({ label: 'Phone', name: 'phone' }),
    createTextarea({ label: 'Notes', name: 'notes', rows: 2 })
  ]
});`,
  });

  const noLegendExample = noLegendSection.querySelector('.dos-demo-section___examples');
  if (noLegendExample) {
    const group = createFormGroup({
      description: 'Optional fields',
      children: [
        createTextInput({ label: 'Phone', name: 'phone' }),
        createTextarea({ label: 'Notes', name: 'notes', rows: 2 }),
      ],
    });
    noLegendExample.appendChild(group);
  }
  content.appendChild(noLegendSection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the FormValidation demo page
 */
export function renderFormValidationPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'FormValidation';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style validation messages with type-specific icons and styling.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // All Types
  const typesSection = createDemoSection({
    title: 'Message Types',
    description: 'Error, warning, success, and info message types.',
    code: `import { createFormValidation } from 'dosage';

createFormValidation({
  message: 'This field is required',
  type: 'error'
});
createFormValidation({
  message: 'Weak password',
  type: 'warning'
});
createFormValidation({
  message: 'Email verified',
  type: 'success'
});
createFormValidation({
  message: 'Tip: Use a strong password',
  type: 'info'
});`,
  });

  const typesExample = typesSection.querySelector('.dos-demo-section___examples');
  if (typesExample) {
    typesExample.style.display = 'flex';
    typesExample.style.flexDirection = 'column';
    typesExample.style.gap = 'var(--dos-space-sm)';

    const types: Array<{
      message: string;
      type: 'error' | 'warning' | 'success' | 'info';
    }> = [
      { message: 'This field is required', type: 'error' },
      { message: 'Weak password', type: 'warning' },
      { message: 'Email verified', type: 'success' },
      { message: 'Tip: Use a strong password', type: 'info' },
    ];

    types.forEach(({ message, type }) => {
      const validation = createFormValidation({ message, type });
      typesExample.appendChild(validation);
    });
  }
  content.appendChild(typesSection);

  // Custom Icons
  const iconsSection = createDemoSection({
    title: 'Custom Icons',
    description: 'Use custom icons or hide them entirely.',
    code: `createFormValidation({
  message: 'Custom arrow icon',
  type: 'info',
  icon: '>>>'
});
createFormValidation({
  message: 'No icon',
  type: 'info',
  icon: false
});`,
  });

  const iconsExample = iconsSection.querySelector('.dos-demo-section___examples');
  if (iconsExample) {
    iconsExample.style.display = 'flex';
    iconsExample.style.flexDirection = 'column';
    iconsExample.style.gap = 'var(--dos-space-sm)';

    const customIcon = createFormValidation({
      message: 'Custom arrow icon',
      type: 'info',
      icon: '>>>',
    });
    iconsExample.appendChild(customIcon);

    const noIcon = createFormValidation({
      message: 'No icon',
      type: 'info',
      icon: false,
    });
    iconsExample.appendChild(noIcon);
  }
  content.appendChild(iconsSection);

  // With Form Field
  const fieldSection = createDemoSection({
    title: 'With Form Field',
    description: 'FormValidation used alongside a form field.',
    code: `const input = createTextInput({
  label: 'Email',
  name: 'email',
  value: 'invalid',
  id: 'email-input'
});
input.setAttribute('aria-describedby', 'email-error');

const error = createFormValidation({
  message: 'Please enter a valid email address',
  type: 'error',
  id: 'email-error'
});`,
  });

  const fieldExample = fieldSection.querySelector('.dos-demo-section___examples');
  if (fieldExample) {
    fieldExample.style.display = 'flex';
    fieldExample.style.flexDirection = 'column';
    fieldExample.style.gap = 'var(--dos-space-xs)';

    const input = createTextInput({
      label: 'Email',
      name: 'email',
      value: 'invalid-email',
      id: 'email-input',
    });
    input.querySelector('input')?.setAttribute('aria-describedby', 'email-error');
    fieldExample.appendChild(input);

    const error = createFormValidation({
      message: 'Please enter a valid email address',
      type: 'error',
      id: 'email-error',
    });
    fieldExample.appendChild(error);
  }
  content.appendChild(fieldSection);

  // Visibility Toggle
  const visibilitySection = createDemoSection({
    title: 'Visibility Toggle',
    description: 'Messages can be shown or hidden programmatically.',
    code: `const validation = createFormValidation({
  message: 'Toggle me!',
  type: 'info'
});

// Hide/show
validation.setVisible(false);
validation.setVisible(true);`,
  });

  const visibilityExample = visibilitySection.querySelector('.dos-demo-section___examples');
  if (visibilityExample) {
    visibilityExample.style.display = 'flex';
    visibilityExample.style.flexDirection = 'column';
    visibilityExample.style.gap = 'var(--dos-space-sm)';

    const validation = createFormValidation({
      message: 'Click the button to toggle visibility',
      type: 'info',
    });
    visibilityExample.appendChild(validation);

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'dos-button dos-button--secondary dos-button--small';
    toggleBtn.textContent = '[Toggle Visibility]';
    toggleBtn.addEventListener('click', () => {
      validation.setVisible(!validation.isVisible());
    });
    visibilityExample.appendChild(toggleBtn);
  }
  content.appendChild(visibilitySection);

  // Real-time Validation Demo Section
  const realtimeSection = createDemoSection({
    title: 'Real-time Validation',
    description:
      'Interactive form demonstrating validation on blur with visual feedback.',
    code: `import {
  createTextInput,
  createPasswordInput,
  createFormValidation
} from 'dosage';

// Create form fields
const usernameInput = createTextInput({
  label: 'Username',
  name: 'username',
  required: true,
  onBlur: (value) => {
    if (!value.trim()) {
      usernameInput.setError('Username is required');
    } else if (value.length < 3) {
      usernameInput.setError('Username must be at least 3 characters');
    } else {
      usernameInput.setError(undefined);
    }
  }
});

const emailInput = createTextInput({
  label: 'Email',
  name: 'email',
  type: 'email',
  required: true,
  onBlur: (value) => {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!value.trim()) {
      emailInput.setError('Email is required');
    } else if (!emailRegex.test(value)) {
      emailInput.setError('Please enter a valid email');
    } else {
      emailInput.setError(undefined);
    }
  }
});

const passwordInput = createPasswordInput({
  label: 'Password',
  name: 'password',
  required: true,
  onBlur: (value) => {
    if (!value) {
      passwordInput.setError('Password is required');
    } else if (value.length < 8) {
      passwordInput.setError('Password must be at least 8 characters');
    } else {
      passwordInput.setError(undefined);
    }
  }
});`,
  });

  const realtimeExample = realtimeSection.querySelector('.dos-demo-section___examples');
  if (realtimeExample) {
    realtimeExample.style.display = 'flex';
    realtimeExample.style.flexDirection = 'column';
    realtimeExample.style.gap = 'var(--dos-space-md)';
    realtimeExample.style.maxWidth = '400px';

    // Track validation states for overall form validity
    const validationState = {
      username: false,
      email: false,
      password: false,
      confirmPassword: false,
    };

    // Overall form status display
    const formStatus = createFormValidation({
      message: 'Fill in all fields to continue',
      type: 'info',
    });

    const updateFormStatus = () => {
      const allValid = Object.values(validationState).every((v) => v);
      if (allValid) {
        formStatus.setType('success');
        formStatus.setMessage('All fields valid! Form ready to submit.');
      } else {
        formStatus.setType('info');
        formStatus.setMessage('Fill in all fields to continue');
      }
    };

    // Username field
    const usernameInput = createTextInput({
      label: 'Username',
      name: 'demo-username',
      required: true,
      placeholder: 'Enter username (min 3 chars)',
      onBlur: (value) => {
        if (!value.trim()) {
          usernameInput.setError('Username is required');
          validationState.username = false;
        } else if (value.length < 3) {
          usernameInput.setError('Username must be at least 3 characters');
          validationState.username = false;
        } else {
          usernameInput.setError(undefined);
          validationState.username = true;
        }
        updateFormStatus();
      },
    });
    realtimeExample.appendChild(usernameInput);

    // Email field
    const emailInput = createTextInput({
      label: 'Email',
      name: 'demo-email',
      type: 'email',
      required: true,
      placeholder: 'user@example.com',
      onBlur: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          emailInput.setError('Email is required');
          validationState.email = false;
        } else if (!emailRegex.test(value)) {
          emailInput.setError('Please enter a valid email address');
          validationState.email = false;
        } else {
          emailInput.setError(undefined);
          validationState.email = true;
        }
        updateFormStatus();
      },
    });
    realtimeExample.appendChild(emailInput);

    // Password field
    let currentPassword = '';
    const passwordInput = createPasswordInput({
      label: 'Password',
      name: 'demo-password',
      required: true,
      placeholder: 'Min 8 characters',
      onChange: (value) => {
        currentPassword = value;
      },
      onBlur: (value) => {
        if (!value) {
          passwordInput.setError('Password is required');
          validationState.password = false;
        } else if (value.length < 8) {
          passwordInput.setError('Password must be at least 8 characters');
          validationState.password = false;
        } else {
          passwordInput.setError(undefined);
          validationState.password = true;
        }
        updateFormStatus();
      },
    });
    realtimeExample.appendChild(passwordInput);

    // Confirm password field
    const confirmPasswordInput = createPasswordInput({
      label: 'Confirm Password',
      name: 'demo-confirm-password',
      required: true,
      placeholder: 'Re-enter your password',
      onBlur: (value) => {
        if (!value) {
          confirmPasswordInput.setError('Please confirm your password');
          validationState.confirmPassword = false;
        } else if (value !== currentPassword) {
          confirmPasswordInput.setError('Passwords do not match');
          validationState.confirmPassword = false;
        } else {
          confirmPasswordInput.setError(undefined);
          validationState.confirmPassword = true;
        }
        updateFormStatus();
      },
    });
    realtimeExample.appendChild(confirmPasswordInput);

    // Form status display
    const statusWrapper = document.createElement('div');
    statusWrapper.style.marginTop = 'var(--dos-space-md)';
    statusWrapper.style.paddingTop = 'var(--dos-space-md)';
    statusWrapper.style.borderTop = '1px dashed var(--dos-color-border)';
    statusWrapper.appendChild(formStatus);
    realtimeExample.appendChild(statusWrapper);

    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'dos-button dos-button--primary';
    submitBtn.textContent = '[Submit Form]';
    submitBtn.style.marginTop = 'var(--dos-space-sm)';
    submitBtn.addEventListener('click', () => {
      // Trigger validation on all fields by focusing and blurring
      const inputs = [usernameInput, emailInput, passwordInput, confirmPasswordInput];
      inputs.forEach((input) => {
        const inputEl = input.querySelector('input');
        if (inputEl) {
          inputEl.focus();
          inputEl.blur();
        }
      });

      // Check if form is valid
      const allValid = Object.values(validationState).every((v) => v);
      if (allValid) {
        formStatus.setType('success');
        formStatus.setMessage('Form submitted successfully!');
      } else {
        formStatus.setType('error');
        formStatus.setMessage('Please fix the errors above');
      }
    });
    realtimeExample.appendChild(submitBtn);
  }
  content.appendChild(realtimeSection);

  page.appendChild(content);
  return page;
}
