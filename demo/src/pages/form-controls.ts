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
  createSelect,
  createToggle,
  createSlider,
  createFileInput,
  createDatePicker,
  createTimePicker,
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

/**
 * Renders the Select demo page
 */
export function renderSelectPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Select';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style dropdown select with single/multiple selection, search, and keyboard navigation.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic Select',
    description: 'Simple dropdown select with options.',
    code: `import { createSelect } from 'dosage';

const select = createSelect({
  label: 'Choose an option',
  name: 'basic',
  placeholder: 'Select...',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  onChange: (value) => console.log('Selected:', value)
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const select = createSelect({
      label: 'Choose an option',
      name: 'basic',
      placeholder: 'Select...',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    });
    basicExample.appendChild(select);
  }
  content.appendChild(basicSection);

  // With Default Value
  const defaultValueSection = createDemoSection({
    title: 'Default Value',
    description: 'Select with a pre-selected value.',
    code: `createSelect({
  label: 'Operating System',
  name: 'os',
  value: 'dos',
  options: [
    { value: 'dos', label: 'MS-DOS 6.22' },
    { value: 'win31', label: 'Windows 3.1' },
    { value: 'win95', label: 'Windows 95' },
    { value: 'os2', label: 'OS/2 Warp' },
  ]
});`,
  });

  const defaultValueExample = defaultValueSection.querySelector('.dos-demo-section___examples');
  if (defaultValueExample) {
    const select = createSelect({
      label: 'Operating System',
      name: 'os',
      value: 'dos',
      options: [
        { value: 'dos', label: 'MS-DOS 6.22' },
        { value: 'win31', label: 'Windows 3.1' },
        { value: 'win95', label: 'Windows 95' },
        { value: 'os2', label: 'OS/2 Warp' },
      ],
    });
    defaultValueExample.appendChild(select);
  }
  content.appendChild(defaultValueSection);

  // Multiple Selection
  const multipleSection = createDemoSection({
    title: 'Multiple Selection',
    description: 'Allow selecting multiple values with tag pills.',
    code: `createSelect({
  label: 'Select Languages',
  name: 'languages',
  multiple: true,
  placeholder: 'Choose languages...',
  options: [
    { value: 'basic', label: 'BASIC' },
    { value: 'pascal', label: 'Pascal' },
    { value: 'c', label: 'C' },
    { value: 'assembly', label: 'Assembly' },
    { value: 'fortran', label: 'FORTRAN' },
    { value: 'cobol', label: 'COBOL' },
  ],
  onChange: (values) => console.log('Selected:', values)
});`,
  });

  const multipleExample = multipleSection.querySelector('.dos-demo-section___examples');
  if (multipleExample) {
    const select = createSelect({
      label: 'Select Languages',
      name: 'languages',
      multiple: true,
      placeholder: 'Choose languages...',
      options: [
        { value: 'basic', label: 'BASIC' },
        { value: 'pascal', label: 'Pascal' },
        { value: 'c', label: 'C' },
        { value: 'assembly', label: 'Assembly' },
        { value: 'fortran', label: 'FORTRAN' },
        { value: 'cobol', label: 'COBOL' },
      ],
    });
    multipleExample.appendChild(select);
  }
  content.appendChild(multipleSection);

  // Searchable Select
  const searchableSection = createDemoSection({
    title: 'Searchable Select',
    description: 'Filter options by typing. Great for long lists.',
    code: `createSelect({
  label: 'DOS Commands',
  name: 'commands',
  searchable: true,
  placeholder: 'Type to search...',
  options: [
    { value: 'dir', label: 'DIR - List directory' },
    { value: 'cd', label: 'CD - Change directory' },
    { value: 'copy', label: 'COPY - Copy files' },
    { value: 'del', label: 'DEL - Delete files' },
    { value: 'md', label: 'MD - Make directory' },
    { value: 'rd', label: 'RD - Remove directory' },
    { value: 'ren', label: 'REN - Rename files' },
    { value: 'type', label: 'TYPE - Display file contents' },
    { value: 'cls', label: 'CLS - Clear screen' },
    { value: 'echo', label: 'ECHO - Display message' },
  ]
});`,
  });

  const searchableExample = searchableSection.querySelector('.dos-demo-section___examples');
  if (searchableExample) {
    const select = createSelect({
      label: 'DOS Commands',
      name: 'commands',
      searchable: true,
      placeholder: 'Type to search...',
      options: [
        { value: 'dir', label: 'DIR - List directory' },
        { value: 'cd', label: 'CD - Change directory' },
        { value: 'copy', label: 'COPY - Copy files' },
        { value: 'del', label: 'DEL - Delete files' },
        { value: 'md', label: 'MD - Make directory' },
        { value: 'rd', label: 'RD - Remove directory' },
        { value: 'ren', label: 'REN - Rename files' },
        { value: 'type', label: 'TYPE - Display file contents' },
        { value: 'cls', label: 'CLS - Clear screen' },
        { value: 'echo', label: 'ECHO - Display message' },
      ],
    });
    searchableExample.appendChild(select);
  }
  content.appendChild(searchableSection);

  // Option Groups
  const groupsSection = createDemoSection({
    title: 'Option Groups',
    description: 'Organize options into logical groups.',
    code: `createSelect({
  label: 'File Type',
  name: 'filetype',
  placeholder: 'Choose file type...',
  options: [
    {
      label: 'Executables',
      options: [
        { value: 'exe', label: '.EXE - Executable' },
        { value: 'com', label: '.COM - Command' },
        { value: 'bat', label: '.BAT - Batch file' },
      ]
    },
    {
      label: 'Documents',
      options: [
        { value: 'txt', label: '.TXT - Text file' },
        { value: 'doc', label: '.DOC - Document' },
        { value: 'wri', label: '.WRI - Write file' },
      ]
    },
    {
      label: 'Data',
      options: [
        { value: 'dat', label: '.DAT - Data file' },
        { value: 'cfg', label: '.CFG - Config file' },
        { value: 'ini', label: '.INI - INI file' },
      ]
    },
  ]
});`,
  });

  const groupsExample = groupsSection.querySelector('.dos-demo-section___examples');
  if (groupsExample) {
    const select = createSelect({
      label: 'File Type',
      name: 'filetype',
      placeholder: 'Choose file type...',
      options: [
        {
          label: 'Executables',
          options: [
            { value: 'exe', label: '.EXE - Executable' },
            { value: 'com', label: '.COM - Command' },
            { value: 'bat', label: '.BAT - Batch file' },
          ],
        },
        {
          label: 'Documents',
          options: [
            { value: 'txt', label: '.TXT - Text file' },
            { value: 'doc', label: '.DOC - Document' },
            { value: 'wri', label: '.WRI - Write file' },
          ],
        },
        {
          label: 'Data',
          options: [
            { value: 'dat', label: '.DAT - Data file' },
            { value: 'cfg', label: '.CFG - Config file' },
            { value: 'ini', label: '.INI - INI file' },
          ],
        },
      ],
    });
    groupsExample.appendChild(select);
  }
  content.appendChild(groupsSection);

  // Size Variants
  const sizesSection = createDemoSection({
    title: 'Size Variants',
    description: 'Small, medium, and large sizes.',
    code: `createSelect({ label: 'Small', size: 'sm', options: [...] });
createSelect({ label: 'Medium (default)', size: 'md', options: [...] });
createSelect({ label: 'Large', size: 'lg', options: [...] });`,
  });

  const sizesExample = sizesSection.querySelector('.dos-demo-section___examples');
  if (sizesExample) {
    sizesExample.style.display = 'flex';
    sizesExample.style.flexDirection = 'column';
    sizesExample.style.gap = 'var(--dos-space-md)';

    const sizes: Array<{ label: string; size: 'sm' | 'md' | 'lg' }> = [
      { label: 'Small', size: 'sm' },
      { label: 'Medium (default)', size: 'md' },
      { label: 'Large', size: 'lg' },
    ];

    const sampleOptions = [
      { value: '1', label: 'Option A' },
      { value: '2', label: 'Option B' },
      { value: '3', label: 'Option C' },
    ];

    sizes.forEach(({ label, size }) => {
      const select = createSelect({
        label,
        name: `size-${size}`,
        size,
        placeholder: 'Select...',
        options: sampleOptions,
      });
      sizesExample.appendChild(select);
    });
  }
  content.appendChild(sizesSection);

  // States
  const statesSection = createDemoSection({
    title: 'States',
    description: 'Disabled and error states.',
    code: `// Disabled
createSelect({
  label: 'Disabled Select',
  disabled: true,
  value: 'locked',
  options: [{ value: 'locked', label: 'Locked value' }]
});

// Error state
createSelect({
  label: 'Select with Error',
  error: 'Please select an option',
  options: [...]
});`,
  });

  const statesExample = statesSection.querySelector('.dos-demo-section___examples');
  if (statesExample) {
    statesExample.style.display = 'flex';
    statesExample.style.flexDirection = 'column';
    statesExample.style.gap = 'var(--dos-space-md)';

    const disabledSelect = createSelect({
      label: 'Disabled Select',
      name: 'disabled',
      disabled: true,
      value: 'locked',
      options: [{ value: 'locked', label: 'Locked value' }],
    });
    statesExample.appendChild(disabledSelect);

    const errorSelect = createSelect({
      label: 'Select with Error',
      name: 'error',
      error: 'Please select an option',
      placeholder: 'Select...',
      options: [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
      ],
    });
    statesExample.appendChild(errorSelect);
  }
  content.appendChild(statesSection);

  // Programmatic API
  const apiSection = createDemoSection({
    title: 'Programmatic API',
    description: 'Control the select via methods.',
    code: `const select = createSelect({ ... });

// Get/set value
const value = select.getValue();
select.setValue('newValue');

// Set error
select.setError('Error message');
select.setError(undefined); // Clear error

// Disable/enable
select.setDisabled(true);
select.setDisabled(false);

// Open/close dropdown
select.open();
select.close();

// Destroy
select.destroy();`,
  });

  const apiExample = apiSection.querySelector('.dos-demo-section___examples');
  if (apiExample) {
    apiExample.style.display = 'flex';
    apiExample.style.flexDirection = 'column';
    apiExample.style.gap = 'var(--dos-space-md)';

    const apiSelect = createSelect({
      label: 'API Demo',
      name: 'api-demo',
      placeholder: 'Select...',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    });
    apiExample.appendChild(apiSelect);

    // Buttons for API demo
    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.gap = 'var(--dos-space-sm)';
    buttonRow.style.flexWrap = 'wrap';

    const btn = (text: string, onClick: () => void) => {
      const button = document.createElement('button');
      button.className = 'dos-button dos-button--secondary dos-button--sm';
      button.textContent = text;
      button.addEventListener('click', onClick);
      return button;
    };

    buttonRow.appendChild(btn('[Set Option 2]', () => apiSelect.setValue('option2')));
    buttonRow.appendChild(btn('[Clear]', () => apiSelect.setValue('')));
    buttonRow.appendChild(btn('[Show Error]', () => apiSelect.setError('This is an error')));
    buttonRow.appendChild(btn('[Clear Error]', () => apiSelect.setError(undefined)));
    buttonRow.appendChild(btn('[Disable]', () => apiSelect.setDisabled(true)));
    buttonRow.appendChild(btn('[Enable]', () => apiSelect.setDisabled(false)));

    apiExample.appendChild(buttonRow);
  }
  content.appendChild(apiSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'Full keyboard navigation and ARIA support.',
    code: `// Keyboard navigation:
// - Tab: Focus the select trigger
// - Enter/Space: Open dropdown
// - Arrow Up/Down: Navigate options
// - Home/End: Jump to first/last option
// - Enter/Space: Select highlighted option
// - Escape: Close dropdown
// - Type characters: Jump to matching option

// ARIA attributes are automatically applied:
// role="combobox", role="listbox", role="option"
// aria-expanded, aria-selected, aria-activedescendant`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const note = document.createElement('p');
    note.style.color = 'var(--dos-color-text-muted)';
    note.textContent = '↑ Try using only your keyboard to interact with any of the selects above.';
    a11yExample.appendChild(note);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Toggle demo page
 */
export function renderTogglePage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Toggle';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style toggle switch with ON/OFF states and keyboard navigation.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic Toggle',
    description: 'Simple on/off toggle switch.',
    code: `import { createToggle } from 'dosage';

const toggle = createToggle({
  label: 'Enable feature',
  onChange: (checked) => console.log('Toggled:', checked)
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const toggle = createToggle({
      label: 'Enable feature',
    });
    basicExample.appendChild(toggle);
  }
  content.appendChild(basicSection);

  // Checked State
  const checkedSection = createDemoSection({
    title: 'Checked State',
    description: 'Toggle initialized in the on state.',
    code: `createToggle({
  label: 'Dark Mode',
  checked: true,
  onChange: (checked) => console.log('Dark mode:', checked)
});`,
  });

  const checkedExample = checkedSection.querySelector('.dos-demo-section___examples');
  if (checkedExample) {
    const toggle = createToggle({
      label: 'Dark Mode',
      checked: true,
    });
    checkedExample.appendChild(toggle);
  }
  content.appendChild(checkedSection);

  // Visual Styles
  const stylesSection = createDemoSection({
    title: 'Visual Styles',
    description: 'Text style [ON]/[OFF] and slider style [■──]/[──■].',
    code: `// Text style (default)
createToggle({
  label: 'Text Style',
  style: 'text',
  onLabel: 'ON',
  offLabel: 'OFF'
});

// Slider style
createToggle({
  label: 'Slider Style',
  style: 'slider'
});`,
  });

  const stylesExample = stylesSection.querySelector('.dos-demo-section___examples');
  if (stylesExample) {
    stylesExample.style.display = 'flex';
    stylesExample.style.flexDirection = 'column';
    stylesExample.style.gap = 'var(--dos-space-md)';

    const textToggle = createToggle({
      label: 'Text Style',
      style: 'text',
    });
    stylesExample.appendChild(textToggle);

    const sliderToggle = createToggle({
      label: 'Slider Style',
      style: 'slider',
    });
    stylesExample.appendChild(sliderToggle);
  }
  content.appendChild(stylesSection);

  // Custom Labels
  const labelsSection = createDemoSection({
    title: 'Custom Labels',
    description: 'Customize the ON/OFF text.',
    code: `createToggle({
  label: 'Sound',
  onLabel: 'YES',
  offLabel: 'NO'
});

createToggle({
  label: 'Mode',
  onLabel: '■',
  offLabel: '□'
});`,
  });

  const labelsExample = labelsSection.querySelector('.dos-demo-section___examples');
  if (labelsExample) {
    labelsExample.style.display = 'flex';
    labelsExample.style.flexDirection = 'column';
    labelsExample.style.gap = 'var(--dos-space-md)';

    const yesNoToggle = createToggle({
      label: 'Sound',
      onLabel: 'YES',
      offLabel: 'NO',
    });
    labelsExample.appendChild(yesNoToggle);

    const symbolToggle = createToggle({
      label: 'Mode',
      onLabel: '■',
      offLabel: '□',
    });
    labelsExample.appendChild(symbolToggle);
  }
  content.appendChild(labelsSection);

  // Label Position
  const positionSection = createDemoSection({
    title: 'Label Position',
    description: 'Label can be on left or right side.',
    code: `createToggle({
  label: 'Label on Right',
  labelPosition: 'right'
});

createToggle({
  label: 'Label on Left',
  labelPosition: 'left'
});`,
  });

  const positionExample = positionSection.querySelector('.dos-demo-section___examples');
  if (positionExample) {
    positionExample.style.display = 'flex';
    positionExample.style.flexDirection = 'column';
    positionExample.style.gap = 'var(--dos-space-md)';

    const rightLabel = createToggle({
      label: 'Label on Right',
      labelPosition: 'right',
    });
    positionExample.appendChild(rightLabel);

    const leftLabel = createToggle({
      label: 'Label on Left',
      labelPosition: 'left',
    });
    positionExample.appendChild(leftLabel);
  }
  content.appendChild(positionSection);

  // Size Variants
  const sizesSection = createDemoSection({
    title: 'Size Variants',
    description: 'Small, medium, and large sizes.',
    code: `createToggle({ label: 'Small', size: 'sm' });
createToggle({ label: 'Medium', size: 'md' });
createToggle({ label: 'Large', size: 'lg' });`,
  });

  const sizesExample = sizesSection.querySelector('.dos-demo-section___examples');
  if (sizesExample) {
    sizesExample.style.display = 'flex';
    sizesExample.style.flexDirection = 'column';
    sizesExample.style.gap = 'var(--dos-space-md)';

    const sizes: Array<{ label: string; size: 'sm' | 'md' | 'lg' }> = [
      { label: 'Small', size: 'sm' },
      { label: 'Medium (default)', size: 'md' },
      { label: 'Large', size: 'lg' },
    ];

    sizes.forEach(({ label, size }) => {
      const toggle = createToggle({ label, size });
      sizesExample.appendChild(toggle);
    });
  }
  content.appendChild(sizesSection);

  // Disabled State
  const disabledSection = createDemoSection({
    title: 'Disabled State',
    description: 'Toggle can be disabled.',
    code: `createToggle({
  label: 'Disabled Off',
  disabled: true,
  checked: false
});

createToggle({
  label: 'Disabled On',
  disabled: true,
  checked: true
});`,
  });

  const disabledExample = disabledSection.querySelector('.dos-demo-section___examples');
  if (disabledExample) {
    disabledExample.style.display = 'flex';
    disabledExample.style.flexDirection = 'column';
    disabledExample.style.gap = 'var(--dos-space-md)';

    const disabledOff = createToggle({
      label: 'Disabled Off',
      disabled: true,
      checked: false,
    });
    disabledExample.appendChild(disabledOff);

    const disabledOn = createToggle({
      label: 'Disabled On',
      disabled: true,
      checked: true,
    });
    disabledExample.appendChild(disabledOn);
  }
  content.appendChild(disabledSection);

  // Programmatic API
  const apiSection = createDemoSection({
    title: 'Programmatic API',
    description: 'Control the toggle via methods.',
    code: `const toggle = createToggle({ label: 'API Demo' });

// Get/set state
const checked = toggle.getChecked();
toggle.setChecked(true);

// Toggle
toggle.toggle();

// Disable/enable
toggle.setDisabled(true);
toggle.setDisabled(false);

// Destroy
toggle.destroy();`,
  });

  const apiExample = apiSection.querySelector('.dos-demo-section___examples');
  if (apiExample) {
    apiExample.style.display = 'flex';
    apiExample.style.flexDirection = 'column';
    apiExample.style.gap = 'var(--dos-space-md)';

    const apiToggle = createToggle({
      label: 'API Demo',
    });
    apiExample.appendChild(apiToggle);

    // Buttons for API demo
    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.gap = 'var(--dos-space-sm)';
    buttonRow.style.flexWrap = 'wrap';

    const btn = (text: string, onClick: () => void) => {
      const button = document.createElement('button');
      button.className = 'dos-button dos-button--secondary dos-button--sm';
      button.textContent = text;
      button.addEventListener('click', onClick);
      return button;
    };

    buttonRow.appendChild(btn('[Set On]', () => apiToggle.setChecked(true)));
    buttonRow.appendChild(btn('[Set Off]', () => apiToggle.setChecked(false)));
    buttonRow.appendChild(btn('[Toggle]', () => apiToggle.toggle()));
    buttonRow.appendChild(btn('[Disable]', () => apiToggle.setDisabled(true)));
    buttonRow.appendChild(btn('[Enable]', () => apiToggle.setDisabled(false)));

    apiExample.appendChild(buttonRow);
  }
  content.appendChild(apiSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'Full keyboard navigation and ARIA support.',
    code: `// Keyboard navigation:
// - Tab: Focus the toggle
// - Space/Enter: Toggle state

// ARIA attributes are automatically applied:
// role="switch", aria-checked`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const note = document.createElement('p');
    note.style.color = 'var(--dos-color-text-muted)';
    note.textContent = '↑ Try using Tab to focus and Space/Enter to toggle.';
    a11yExample.appendChild(note);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the Slider demo page
 */
export function renderSliderPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'Slider';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style slider with ASCII track and keyboard navigation.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic Slider',
    description: 'Simple value slider with default settings.',
    code: `import { createSlider } from 'dosage';

const slider = createSlider({
  label: 'Volume',
  min: 0,
  max: 100,
  value: 50,
  showValue: true,
  onChange: (value) => console.log('Value:', value)
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const slider = createSlider({
      label: 'Volume',
      min: 0,
      max: 100,
      value: 50,
      showValue: true,
    });
    basicExample.appendChild(slider);
  }
  content.appendChild(basicSection);

  // With Ticks
  const ticksSection = createDemoSection({
    title: 'With Tick Marks',
    description: 'Display tick marks and labels along the track.',
    code: `createSlider({
  label: 'Brightness',
  min: 0,
  max: 100,
  value: 75,
  showValue: true,
  showTicks: true,
  tickCount: 5
});`,
  });

  const ticksExample = ticksSection.querySelector('.dos-demo-section___examples');
  if (ticksExample) {
    const slider = createSlider({
      label: 'Brightness',
      min: 0,
      max: 100,
      value: 75,
      showValue: true,
      showTicks: true,
      tickCount: 5,
    });
    ticksExample.appendChild(slider);
  }
  content.appendChild(ticksSection);

  // Custom Step
  const stepSection = createDemoSection({
    title: 'Custom Step',
    description: 'Slider with custom step increment.',
    code: `createSlider({
  label: 'Quality',
  min: 0,
  max: 100,
  step: 10,
  value: 50,
  showValue: true,
  showTicks: true,
  tickCount: 11
});`,
  });

  const stepExample = stepSection.querySelector('.dos-demo-section___examples');
  if (stepExample) {
    const slider = createSlider({
      label: 'Quality',
      min: 0,
      max: 100,
      step: 10,
      value: 50,
      showValue: true,
      showTicks: true,
      tickCount: 11,
    });
    stepExample.appendChild(slider);
  }
  content.appendChild(stepSection);

  // Range Slider
  const rangeSection = createDemoSection({
    title: 'Range Slider',
    description: 'Select a range with two thumbs.',
    code: `createSlider({
  label: 'Price Range',
  min: 0,
  max: 1000,
  value: [200, 800],
  range: true,
  showValue: true,
  formatValue: (v) => '$' + v
});`,
  });

  const rangeExample = rangeSection.querySelector('.dos-demo-section___examples');
  if (rangeExample) {
    const slider = createSlider({
      label: 'Price Range',
      min: 0,
      max: 1000,
      value: [200, 800],
      range: true,
      showValue: true,
      formatValue: (v) => '$' + v,
    });
    rangeExample.appendChild(slider);
  }
  content.appendChild(rangeSection);

  // Custom Format
  const formatSection = createDemoSection({
    title: 'Custom Value Format',
    description: 'Format the displayed value with a custom function.',
    code: `createSlider({
  label: 'Temperature',
  min: -20,
  max: 40,
  value: 22,
  showValue: true,
  formatValue: (v) => v + '°C'
});`,
  });

  const formatExample = formatSection.querySelector('.dos-demo-section___examples');
  if (formatExample) {
    const slider = createSlider({
      label: 'Temperature',
      min: -20,
      max: 40,
      value: 22,
      showValue: true,
      formatValue: (v) => v + '°C',
    });
    formatExample.appendChild(slider);
  }
  content.appendChild(formatSection);

  // Size Variants
  const sizesSection = createDemoSection({
    title: 'Size Variants',
    description: 'Small, medium, and large sizes.',
    code: `createSlider({ label: 'Small', size: 'sm', showValue: true });
createSlider({ label: 'Medium', size: 'md', showValue: true });
createSlider({ label: 'Large', size: 'lg', showValue: true });`,
  });

  const sizesExample = sizesSection.querySelector('.dos-demo-section___examples');
  if (sizesExample) {
    sizesExample.style.display = 'flex';
    sizesExample.style.flexDirection = 'column';
    sizesExample.style.gap = 'var(--dos-space-lg)';

    const sizes: Array<{ label: string; size: 'sm' | 'md' | 'lg' }> = [
      { label: 'Small', size: 'sm' },
      { label: 'Medium (default)', size: 'md' },
      { label: 'Large', size: 'lg' },
    ];

    sizes.forEach(({ label, size }) => {
      const slider = createSlider({
        label,
        size,
        value: 50,
        showValue: true,
      });
      sizesExample.appendChild(slider);
    });
  }
  content.appendChild(sizesSection);

  // Disabled State
  const disabledSection = createDemoSection({
    title: 'Disabled State',
    description: 'Slider can be disabled.',
    code: `createSlider({
  label: 'Disabled',
  value: 50,
  showValue: true,
  disabled: true
});`,
  });

  const disabledExample = disabledSection.querySelector('.dos-demo-section___examples');
  if (disabledExample) {
    const slider = createSlider({
      label: 'Disabled',
      value: 50,
      showValue: true,
      disabled: true,
    });
    disabledExample.appendChild(slider);
  }
  content.appendChild(disabledSection);

  // Programmatic API
  const apiSection = createDemoSection({
    title: 'Programmatic API',
    description: 'Control the slider via methods.',
    code: `const slider = createSlider({ label: 'API Demo', showValue: true });

// Get/set value
const value = slider.getValue();
slider.setValue(75);

// Update bounds
slider.setMin(10);
slider.setMax(90);

// Disable/enable
slider.setDisabled(true);
slider.setDisabled(false);

// Destroy
slider.destroy();`,
  });

  const apiExample = apiSection.querySelector('.dos-demo-section___examples');
  if (apiExample) {
    apiExample.style.display = 'flex';
    apiExample.style.flexDirection = 'column';
    apiExample.style.gap = 'var(--dos-space-md)';

    const apiSlider = createSlider({
      label: 'API Demo',
      value: 50,
      showValue: true,
    });
    apiExample.appendChild(apiSlider);

    // Buttons for API demo
    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.gap = 'var(--dos-space-sm)';
    buttonRow.style.flexWrap = 'wrap';

    const btn = (text: string, onClick: () => void) => {
      const button = document.createElement('button');
      button.className = 'dos-button dos-button--secondary dos-button--sm';
      button.textContent = text;
      button.addEventListener('click', onClick);
      return button;
    };

    buttonRow.appendChild(btn('[Set 0]', () => apiSlider.setValue(0)));
    buttonRow.appendChild(btn('[Set 50]', () => apiSlider.setValue(50)));
    buttonRow.appendChild(btn('[Set 100]', () => apiSlider.setValue(100)));
    buttonRow.appendChild(btn('[Disable]', () => apiSlider.setDisabled(true)));
    buttonRow.appendChild(btn('[Enable]', () => apiSlider.setDisabled(false)));

    apiExample.appendChild(buttonRow);
  }
  content.appendChild(apiSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'Full keyboard navigation and ARIA support.',
    code: `// Keyboard navigation:
// - Tab: Focus the slider thumb
// - Arrow Left/Down: Decrease value
// - Arrow Right/Up: Increase value
// - Home: Jump to minimum
// - End: Jump to maximum
// - Page Up/Down: Larger increments

// ARIA attributes are automatically applied:
// role="slider", aria-valuemin, aria-valuemax,
// aria-valuenow, aria-valuetext`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const note = document.createElement('p');
    note.style.color = 'var(--dos-color-text-muted)';
    note.textContent = '↑ Try using arrow keys to adjust values on any slider above.';
    a11yExample.appendChild(note);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the FileInput demo page
 */
export function renderFileInputPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'FileInput';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style file input with browse button, drag-and-drop, and file list.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic FileInput
  const basicSection = createDemoSection({
    title: 'Basic FileInput',
    description: 'Simple file input with browse button and filename display.',
    codeExample: `const fileInput = createFileInput({
  label: 'Select a file',
  onChange: (files) => console.log('Selected:', files)
});`,
  });

  const basicExamples = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExamples) {
    const basicFileInput = createFileInput({
      label: 'Select a file',
      onChange: (files) => console.log('Files selected:', files),
    });
    basicExamples.appendChild(basicFileInput);

    const withButtonLabel = createFileInput({
      label: 'Choose file',
      buttonLabel: 'Open...',
    });
    basicExamples.appendChild(withButtonLabel);
  }
  content.appendChild(basicSection);

  // Multiple Files
  const multipleSection = createDemoSection({
    title: 'Multiple Files',
    description: 'Allow selecting multiple files at once.',
    codeExample: `const multiFileInput = createFileInput({
  label: 'Select files',
  multiple: true,
  showFileList: true,
  onChange: (files) => console.log(\`\${files.length} files selected\`)
});`,
  });

  const multiExamples = multipleSection.querySelector('.dos-demo-section___examples');
  if (multiExamples) {
    const multiFileInput = createFileInput({
      label: 'Select multiple files',
      multiple: true,
      showFileList: true,
      onChange: (files) => console.log(`${files.length} files selected`),
    });
    multiExamples.appendChild(multiFileInput);
  }
  content.appendChild(multipleSection);

  // File Type Restrictions
  const acceptSection = createDemoSection({
    title: 'File Type Restrictions',
    description: 'Restrict file selection to specific types using the accept prop.',
    codeExample: `// Accept only images
const imageInput = createFileInput({
  label: 'Select image',
  accept: 'image/*',
  onReject: (file, reason) => console.log(\`Rejected: \${file.name} - \${reason}\`)
});

// Accept specific extensions
const docInput = createFileInput({
  label: 'Select document',
  accept: '.txt,.pdf,.doc,.docx'
});`,
  });

  const acceptExamples = acceptSection.querySelector('.dos-demo-section___examples');
  if (acceptExamples) {
    const imageInput = createFileInput({
      label: 'Images only (image/*)',
      accept: 'image/*',
      onReject: (file, reason) => console.log(`Rejected: ${file.name} - ${reason}`),
    });
    acceptExamples.appendChild(imageInput);

    const docInput = createFileInput({
      label: 'Documents (.txt, .pdf)',
      accept: '.txt,.pdf',
    });
    acceptExamples.appendChild(docInput);
  }
  content.appendChild(acceptSection);

  // Drag and Drop Mode
  const dragDropSection = createDemoSection({
    title: 'Drag and Drop',
    description: 'Enable a dropzone for drag-and-drop file uploads.',
    codeExample: `const dropzone = createFileInput({
  label: 'Upload files',
  dragDrop: true,
  dropzoneText: 'Drag files here or click to browse',
  multiple: true,
  showFileList: true
});`,
  });

  const dragDropExamples = dragDropSection.querySelector('.dos-demo-section___examples');
  if (dragDropExamples) {
    const dropzone = createFileInput({
      label: 'Upload files',
      dragDrop: true,
      dropzoneText: 'Drag files here or click to browse',
      multiple: true,
      showFileList: true,
      onChange: (files) => console.log('Files dropped:', files),
    });
    dragDropExamples.appendChild(dropzone);

    const dropzoneWithAccept = createFileInput({
      label: 'Upload images',
      dragDrop: true,
      dropzoneText: 'Drop images here',
      accept: 'image/*',
      multiple: true,
      showFileList: true,
    });
    dragDropExamples.appendChild(dropzoneWithAccept);
  }
  content.appendChild(dragDropSection);

  // Size Variants
  const sizeSection = createDemoSection({
    title: 'Size Variants',
    description: 'FileInput supports sm, md, and lg sizes.',
    codeExample: `const small = createFileInput({ label: 'Small', size: 'sm' });
const medium = createFileInput({ label: 'Medium', size: 'md' });
const large = createFileInput({ label: 'Large', size: 'lg' });`,
  });

  const sizeExamples = sizeSection.querySelector('.dos-demo-section___examples');
  if (sizeExamples) {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
    sizes.forEach((size) => {
      const fileInput = createFileInput({
        label: `Size: ${size}`,
        size,
      });
      sizeExamples.appendChild(fileInput);
    });
  }
  content.appendChild(sizeSection);

  // Validation
  const validationSection = createDemoSection({
    title: 'Validation',
    description: 'Validate file size and count with maxSize and maxFiles.',
    codeExample: `const validated = createFileInput({
  label: 'Upload (max 1MB, max 3 files)',
  multiple: true,
  maxSize: 1024 * 1024, // 1MB
  maxFiles: 3,
  showFileList: true,
  onReject: (file, reason) => alert(\`\${file.name}: \${reason}\`)
});`,
  });

  const validationExamples = validationSection.querySelector('.dos-demo-section___examples');
  if (validationExamples) {
    const validated = createFileInput({
      label: 'Upload (max 1MB, max 3 files)',
      multiple: true,
      maxSize: 1024 * 1024,
      maxFiles: 3,
      showFileList: true,
      onReject: (file, reason) => {
        console.log(`Rejected: ${file.name} - ${reason}`);
        alert(`${file.name}: ${reason}`);
      },
    });
    validationExamples.appendChild(validated);
  }
  content.appendChild(validationSection);

  // States
  const statesSection = createDemoSection({
    title: 'States',
    description: 'FileInput can be disabled or show error state.',
    codeExample: `// Disabled
const disabled = createFileInput({
  label: 'Disabled',
  disabled: true
});

// Error state
const withError = createFileInput({
  label: 'With error',
  error: 'Please select a file'
});`,
  });

  const statesExamples = statesSection.querySelector('.dos-demo-section___examples');
  if (statesExamples) {
    const disabled = createFileInput({
      label: 'Disabled',
      disabled: true,
    });
    statesExamples.appendChild(disabled);

    const disabledDragDrop = createFileInput({
      label: 'Disabled dropzone',
      dragDrop: true,
      disabled: true,
    });
    statesExamples.appendChild(disabledDragDrop);

    const withError = createFileInput({
      label: 'With error',
      error: 'Please select a file',
    });
    statesExamples.appendChild(withError);
  }
  content.appendChild(statesSection);

  // API Methods
  const apiSection = createDemoSection({
    title: 'API Methods',
    description: 'FileInput provides methods to interact with the component programmatically.',
    codeExample: `const fileInput = createFileInput({
  label: 'Upload',
  showFileList: true
});

// Get selected files
const files = fileInput.getFiles();

// Clear selection
fileInput.clear();

// Open file dialog
fileInput.browse();

// Toggle disabled state
fileInput.setDisabled(true);

// Set error message
fileInput.setError('File required');

// Clean up
fileInput.destroy();`,
  });

  const apiExamples = apiSection.querySelector('.dos-demo-section___examples');
  if (apiExamples) {
    const apiDemo = createFileInput({
      label: 'Try the API',
      multiple: true,
      showFileList: true,
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = 'var(--dos-spacing-md)';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexWrap = 'wrap';
    buttonContainer.style.gap = 'var(--dos-spacing-sm)';

    const createButton = (text: string, onClick: () => void) => {
      const btn = document.createElement('button');
      btn.className = 'dos-button dos-button--sm';
      btn.textContent = text;
      btn.onclick = onClick;
      return btn;
    };

    buttonContainer.appendChild(
      createButton('[Browse]', () => apiDemo.browse())
    );
    buttonContainer.appendChild(
      createButton('[Clear]', () => apiDemo.clear())
    );
    buttonContainer.appendChild(
      createButton('[Disable]', () => apiDemo.setDisabled(true))
    );
    buttonContainer.appendChild(
      createButton('[Enable]', () => apiDemo.setDisabled(false))
    );
    buttonContainer.appendChild(
      createButton('[Set Error]', () => apiDemo.setError('This is an error'))
    );
    buttonContainer.appendChild(
      createButton('[Clear Error]', () => apiDemo.setError(undefined))
    );
    buttonContainer.appendChild(
      createButton('[Log Files]', () => console.log('Files:', apiDemo.getFiles()))
    );

    apiExamples.appendChild(apiDemo);
    apiExamples.appendChild(buttonContainer);
  }
  content.appendChild(apiSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'FileInput is fully keyboard accessible and supports screen readers.',
    codeExample: `// Keyboard navigation:
// - Tab: Focus the browse button or dropzone
// - Enter/Space: Open file dialog (in dropzone mode)

// Dropzone has role="button" and is focusable
// File list has role="list" with proper ARIA labels
// Error messages use role="alert" for announcements`,
  });

  const a11yExamples = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExamples) {
    const note = document.createElement('p');
    note.style.color = 'var(--dos-color-text-muted)';
    note.textContent = '↑ Try using Tab to focus the dropzone above, then press Enter to open the file dialog.';
    a11yExamples.appendChild(note);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the DatePicker demo page
 */
export function renderDatePickerPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'DatePicker';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style date picker with calendar popup and keyboard navigation.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example
  const basicSection = createDemoSection({
    title: 'Basic DatePicker',
    description: 'Simple date picker with label. Click the input or toggle button to open the calendar.',
    code: `import { createDatePicker } from 'dosage';

const picker = createDatePicker({
  label: 'Select Date',
  placeholder: 'Choose a date...'
});`,
  });

  const basicExample = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExample) {
    const picker = createDatePicker({
      label: 'Select Date',
      placeholder: 'Choose a date...',
    });
    basicExample.appendChild(picker);
  }
  content.appendChild(basicSection);

  // Pre-selected Date
  const preselectedSection = createDemoSection({
    title: 'Pre-selected Date',
    description: 'DatePicker with an initial value.',
    code: `createDatePicker({
  label: 'Birth Date',
  value: new Date(1990, 5, 15), // June 15, 1990
  format: 'MM/DD/YYYY'
});`,
  });

  const preselectedExample = preselectedSection.querySelector('.dos-demo-section___examples');
  if (preselectedExample) {
    const picker = createDatePicker({
      label: 'Birth Date',
      value: new Date(1990, 5, 15),
      format: 'MM/DD/YYYY',
    });
    preselectedExample.appendChild(picker);
  }
  content.appendChild(preselectedSection);

  // Min/Max Constraints
  const constraintsSection = createDemoSection({
    title: 'Min/Max Date Constraints',
    description: 'Limit selectable dates to a range. Dates outside the range are disabled.',
    code: `const today = new Date();
const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);

createDatePicker({
  label: 'Appointment Date',
  min: today,        // Can't select past dates
  max: nextMonth,    // Can't select beyond next month
  placeholder: 'Select a date within range...'
});`,
  });

  const constraintsExample = constraintsSection.querySelector('.dos-demo-section___examples');
  if (constraintsExample) {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const picker = createDatePicker({
      label: 'Appointment Date',
      min: today,
      max: nextMonth,
      placeholder: 'Select a date within range...',
    });
    constraintsExample.appendChild(picker);
  }
  content.appendChild(constraintsSection);

  // Disabled Dates
  const disabledDatesSection = createDemoSection({
    title: 'Disabled Dates',
    description: 'Disable specific dates or patterns (like weekends).',
    code: `// Disable weekends
createDatePicker({
  label: 'Business Day',
  disabledDates: (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }
});

// Or disable specific dates
createDatePicker({
  label: 'Available Dates',
  disabledDates: [
    new Date(2026, 0, 1),  // New Year
    new Date(2026, 11, 25) // Christmas
  ]
});`,
  });

  const disabledDatesExample = disabledDatesSection.querySelector('.dos-demo-section___examples');
  if (disabledDatesExample) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '1rem';

    // Weekends disabled
    const weekendPicker = createDatePicker({
      label: 'Business Day (no weekends)',
      disabledDates: (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
      },
    });
    container.appendChild(weekendPicker);

    // Specific dates disabled
    const specificPicker = createDatePicker({
      label: 'Holidays Blocked',
      disabledDates: [
        new Date(2026, 0, 1),
        new Date(2026, 11, 25),
      ],
    });
    container.appendChild(specificPicker);

    disabledDatesExample.appendChild(container);
  }
  content.appendChild(disabledDatesSection);

  // Date Formats
  const formatsSection = createDemoSection({
    title: 'Date Formats',
    description: 'Customize the display format. Supported tokens: YYYY, MM, DD.',
    code: `// ISO format (default)
createDatePicker({ format: 'YYYY-MM-DD' }); // 2026-01-15

// US format  
createDatePicker({ format: 'MM/DD/YYYY' }); // 01/15/2026

// European format
createDatePicker({ format: 'DD/MM/YYYY' }); // 15/01/2026`,
  });

  const formatsExample = formatsSection.querySelector('.dos-demo-section___examples');
  if (formatsExample) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '1rem';

    const isoFormatPicker = createDatePicker({
      label: 'ISO Format',
      value: new Date(),
      format: 'YYYY-MM-DD',
    });
    container.appendChild(isoFormatPicker);

    const usFormatPicker = createDatePicker({
      label: 'US Format',
      value: new Date(),
      format: 'MM/DD/YYYY',
    });
    container.appendChild(usFormatPicker);

    const euFormatPicker = createDatePicker({
      label: 'European Format',
      value: new Date(),
      format: 'DD/MM/YYYY',
    });
    container.appendChild(euFormatPicker);

    formatsExample.appendChild(container);
  }
  content.appendChild(formatsSection);

  // Required Field
  const requiredSection = createDemoSection({
    title: 'Required Field',
    description: 'DatePicker with required indicator.',
    code: `createDatePicker({
  label: 'Start Date',
  required: true,
  placeholder: 'Required'
});`,
  });

  const requiredExample = requiredSection.querySelector('.dos-demo-section___examples');
  if (requiredExample) {
    const picker = createDatePicker({
      label: 'Start Date',
      required: true,
      placeholder: 'Required',
    });
    requiredExample.appendChild(picker);
  }
  content.appendChild(requiredSection);

  // States
  const statesSection = createDemoSection({
    title: 'States',
    description: 'Disabled and error states.',
    code: `// Disabled
createDatePicker({
  label: 'Locked Date',
  value: new Date(),
  disabled: true
});

// Error state
createDatePicker({
  label: 'Invalid Date',
  error: 'Please select a valid date'
});`,
  });

  const statesExample = statesSection.querySelector('.dos-demo-section___examples');
  if (statesExample) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '1rem';

    const disabledPicker = createDatePicker({
      label: 'Locked Date',
      value: new Date(),
      disabled: true,
    });
    container.appendChild(disabledPicker);

    const errorPicker = createDatePicker({
      label: 'Invalid Date',
      error: 'Please select a valid date',
    });
    container.appendChild(errorPicker);

    statesExample.appendChild(container);
  }
  content.appendChild(statesSection);

  // API Methods
  const apiSection = createDemoSection({
    title: 'API Methods',
    description: 'Programmatically control the DatePicker.',
    code: `const picker = createDatePicker({ label: 'API Demo' });

// Get/set value
picker.getValue();                    // Date | null
picker.setValue(new Date());          // Set date
picker.setValue('2026-06-15');        // Set from string
picker.getFormattedValue();           // Formatted string

// Control calendar
picker.open();                        // Open calendar
picker.close();                       // Close calendar
picker.toggle();                      // Toggle open/close
picker.isOpen();                      // Check if open
picker.navigateTo(6, 2026);           // Go to July 2026

// State management
picker.setDisabled(true);             // Disable picker
picker.setError('Invalid date');      // Set error
picker.clear();                       // Clear selection

// Cleanup
picker.destroy();                     // Remove listeners`,
  });

  const apiExample = apiSection.querySelector('.dos-demo-section___examples');
  if (apiExample) {
    const apiDemo = createDatePicker({
      label: 'API Demo',
      onChange: (date, formatted) => {
        console.log('Date changed:', date, formatted);
      },
    });

    // Helper to create buttons
    const createButton = (text: string, onClick: () => void) => {
      const btn = document.createElement('button');
      btn.className = 'dos-button dos-button--sm';
      btn.textContent = text;
      btn.onclick = onClick;
      return btn;
    };

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexWrap = 'wrap';
    buttonContainer.style.gap = '0.5rem';
    buttonContainer.style.marginTop = '1rem';

    buttonContainer.appendChild(
      createButton('[Set Today]', () => apiDemo.setValue(new Date()))
    );
    buttonContainer.appendChild(
      createButton('[Clear]', () => apiDemo.clear())
    );
    buttonContainer.appendChild(
      createButton('[Open]', () => apiDemo.open())
    );
    buttonContainer.appendChild(
      createButton('[Close]', () => apiDemo.close())
    );
    buttonContainer.appendChild(
      createButton('[Go to Dec 2025]', () => apiDemo.navigateTo(11, 2025))
    );
    buttonContainer.appendChild(
      createButton('[Disable]', () => apiDemo.setDisabled(true))
    );
    buttonContainer.appendChild(
      createButton('[Enable]', () => apiDemo.setDisabled(false))
    );
    buttonContainer.appendChild(
      createButton('[Set Error]', () => apiDemo.setError('Invalid date selected'))
    );
    buttonContainer.appendChild(
      createButton('[Clear Error]', () => apiDemo.setError(false))
    );
    buttonContainer.appendChild(
      createButton('[Log Value]', () => console.log('Value:', apiDemo.getValue(), 'Formatted:', apiDemo.getFormattedValue()))
    );

    apiExample.appendChild(apiDemo);
    apiExample.appendChild(buttonContainer);
  }
  content.appendChild(apiSection);

  // Keyboard Navigation
  const keyboardSection = createDemoSection({
    title: 'Keyboard Navigation',
    description: 'Full keyboard support for accessibility.',
    codeExample: `// Input field:
// Enter/Space: Open calendar
// ArrowDown: Open calendar
// Escape: Close calendar

// Calendar navigation:
// Arrow keys: Move focus between days
// Page Up: Previous month
// Page Down: Next month
// Home: First day of month
// End: Last day of month
// Enter/Space: Select focused date
// Escape: Close calendar`,
  });

  const keyboardExample = keyboardSection.querySelector('.dos-demo-section___examples');
  if (keyboardExample) {
    const picker = createDatePicker({
      label: 'Try Keyboard Navigation',
      placeholder: 'Press Enter to open, arrows to navigate...',
    });
    keyboardExample.appendChild(picker);

    const note = document.createElement('p');
    note.style.color = 'var(--dos-color-text-muted)';
    note.style.marginTop = '0.5rem';
    note.textContent = '↑ Tab to focus, Enter to open, then use arrow keys to navigate days.';
    keyboardExample.appendChild(note);
  }
  content.appendChild(keyboardSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'DatePicker follows ARIA date picker patterns.',
    codeExample: `// ARIA attributes applied:
// - Input: role="combobox", aria-haspopup="dialog"
// - Input: aria-expanded (true/false based on state)
// - Input: aria-controls (linked to calendar)
// - Calendar: role="dialog", aria-modal="true"
// - Grid: role="grid" with role="gridcell" for days
// - Today: aria-current="date"
// - Selected: aria-selected="true"
// - Disabled: aria-disabled="true"
// - Navigation: aria-label on buttons`,
  });

  const a11yExample = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExample) {
    const note = document.createElement('p');
    note.style.color = 'var(--dos-color-text-muted)';
    note.textContent = 'Screen readers announce the month, year, and date context. Navigation is announced as buttons.';
    a11yExample.appendChild(note);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}

/**
 * Renders the TimePicker demo page
 */
export function renderTimePickerPage(): HTMLElement {
  const page = document.createElement('div');

  // Page header
  const header = document.createElement('header');
  header.className = 'dos-main___header';

  const h1 = document.createElement('h1');
  h1.className = 'dos-main___title';
  h1.textContent = 'TimePicker';

  const desc = document.createElement('p');
  desc.className = 'dos-main___description';
  desc.textContent = 'DOS-style time picker with spinbox inputs for hours and minutes.';

  header.appendChild(h1);
  header.appendChild(desc);
  page.appendChild(header);

  const content = document.createElement('div');
  content.className = 'dos-main___content';

  // Basic Example (12h format - default)
  const basicSection = createDemoSection({
    title: 'Basic Usage',
    description: 'Basic time picker with 12-hour format (default).',
    codeExample: `import { createTimePicker } from 'dosage';

const timePicker = createTimePicker({
  label: 'Select Time',
  onChange: (time, parsed) => {
    console.log('Selected:', time, parsed);
  }
});

document.body.appendChild(timePicker);`,
  });
  const basicExamples = basicSection.querySelector('.dos-demo-section___examples');
  if (basicExamples) {
    const picker = createTimePicker({
      label: 'Select Time',
      onChange: (time, parsed) => {
        console.log('12h Time selected:', time, parsed);
      },
    });
    basicExamples.appendChild(picker);
  }
  content.appendChild(basicSection);

  // 24-hour Format
  const format24Section = createDemoSection({
    title: '24-Hour Format',
    description: 'Time picker with 24-hour format (no AM/PM).',
    codeExample: `const timePicker24 = createTimePicker({
  label: 'Time (24h)',
  format: '24h',
  onChange: (time) => console.log(time)
});`,
  });
  const format24Examples = format24Section.querySelector('.dos-demo-section___examples');
  if (format24Examples) {
    const picker24 = createTimePicker({
      label: 'Time (24h)',
      format: '24h',
      onChange: (time, parsed) => {
        console.log('24h Time selected:', time, parsed);
      },
    });
    format24Examples.appendChild(picker24);
  }
  content.appendChild(format24Section);

  // Pre-selected Value
  const valueSection = createDemoSection({
    title: 'Pre-selected Value',
    description: 'Time picker with an initial value set.',
    codeExample: `// 12-hour format with AM/PM
const morning = createTimePicker({
  label: 'Morning Meeting',
  value: '09:30 AM'
});

// 24-hour format
const afternoon = createTimePicker({
  label: 'Afternoon Deadline',
  format: '24h',
  value: '14:45'
});`,
  });
  const valueExamples = valueSection.querySelector('.dos-demo-section___examples');
  if (valueExamples) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '2rem';
    row.style.flexWrap = 'wrap';

    const morning = createTimePicker({
      label: 'Morning Meeting',
      value: '09:30 AM',
    });
    row.appendChild(morning);

    const afternoon = createTimePicker({
      label: 'Afternoon Deadline',
      format: '24h',
      value: '14:45',
    });
    row.appendChild(afternoon);

    valueExamples.appendChild(row);
  }
  content.appendChild(valueSection);

  // Step Increment
  const stepSection = createDemoSection({
    title: 'Minute Step',
    description: 'Control minute increments with the step property.',
    codeExample: `// 5-minute increments
const picker5 = createTimePicker({
  label: '5-Minute Steps',
  step: 5
});

// 15-minute increments  
const picker15 = createTimePicker({
  label: '15-Minute Steps',
  step: 15
});`,
  });
  const stepExamples = stepSection.querySelector('.dos-demo-section___examples');
  if (stepExamples) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '2rem';
    row.style.flexWrap = 'wrap';

    const picker5 = createTimePicker({
      label: '5-Minute Steps',
      step: 5,
    });
    row.appendChild(picker5);

    const picker15 = createTimePicker({
      label: '15-Minute Steps',
      step: 15,
    });
    row.appendChild(picker15);

    valueExamples.appendChild(row);
    stepExamples.appendChild(row);
  }
  content.appendChild(stepSection);

  // Required Field
  const requiredSection = createDemoSection({
    title: 'Required Field',
    description: 'Time picker marked as required shows an asterisk on the label.',
    codeExample: `const required = createTimePicker({
  label: 'Appointment Time',
  required: true,
  name: 'appointment_time'
});`,
  });
  const requiredExamples = requiredSection.querySelector('.dos-demo-section___examples');
  if (requiredExamples) {
    const required = createTimePicker({
      label: 'Appointment Time',
      required: true,
      name: 'appointment_time',
    });
    requiredExamples.appendChild(required);
  }
  content.appendChild(requiredSection);

  // States
  const statesSection = createDemoSection({
    title: 'States',
    description: 'Disabled and error states for validation feedback.',
    codeExample: `// Disabled state
const disabled = createTimePicker({
  label: 'Disabled',
  value: '10:00 AM',
  disabled: true
});

// Error state with message
const error = createTimePicker({
  label: 'With Error',
  error: 'Please select a valid time'
});`,
  });
  const statesExamples = statesSection.querySelector('.dos-demo-section___examples');
  if (statesExamples) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '2rem';
    row.style.flexWrap = 'wrap';

    const disabled = createTimePicker({
      label: 'Disabled',
      value: '10:00 AM',
      disabled: true,
    });
    row.appendChild(disabled);

    const error = createTimePicker({
      label: 'With Error',
      error: 'Please select a valid time',
    });
    row.appendChild(error);

    statesExamples.appendChild(row);
  }
  content.appendChild(statesSection);

  // API Methods
  const apiSection = createDemoSection({
    title: 'API Methods',
    description: 'Programmatic control via public methods.',
    codeExample: `const picker = createTimePicker({ label: 'Time' });

// Get current value
const value = picker.getValue();       // "3:45 PM" or ""
const parsed = picker.getParsedValue(); // { hours: 3, minutes: 45, period: 'PM' }

// Set time programmatically
picker.setValue('14:30');              // From 24h string
picker.setValue(new Date());           // From Date object
picker.setHours(10);
picker.setMinutes(30);
picker.setPeriod('AM');
picker.togglePeriod();

// State control
picker.setDisabled(true);
picker.setError('Invalid time');
picker.clear();
picker.focus();`,
  });
  const apiExamples = apiSection.querySelector('.dos-demo-section___examples');
  if (apiExamples) {
    const picker = createTimePicker({
      label: 'API Demo',
    });
    apiExamples.appendChild(picker);

    // Button row
    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.gap = '0.5rem';
    buttonRow.style.flexWrap = 'wrap';
    buttonRow.style.marginTop = '1rem';

    const createBtn = (text: string, onClick: () => void) => {
      const btn = document.createElement('button');
      btn.className = 'dos-button dos-button--secondary';
      btn.textContent = text;
      btn.addEventListener('click', onClick);
      return btn;
    };

    buttonRow.appendChild(createBtn('Set 9:00 AM', () => picker.setValue('09:00 AM')));
    buttonRow.appendChild(createBtn('Set 14:30', () => picker.setValue('14:30')));
    buttonRow.appendChild(createBtn('Set Now', () => picker.setValue(new Date())));
    buttonRow.appendChild(createBtn('Toggle Period', () => picker.togglePeriod()));
    buttonRow.appendChild(createBtn('Clear', () => picker.clear()));
    buttonRow.appendChild(createBtn('Get Value', () => alert(`Value: ${picker.getValue()}\nParsed: ${JSON.stringify(picker.getParsedValue())}`)));

    apiExamples.appendChild(buttonRow);
  }
  content.appendChild(apiSection);

  // Keyboard Navigation
  const keyboardSection = createDemoSection({
    title: 'Keyboard Navigation',
    description: 'Full keyboard support for accessibility.',
    codeExample: `// Keyboard controls:
// Tab         - Move between hours, minutes, AM/PM
// Arrow Up    - Increment value
// Arrow Down  - Decrement value
// Enter/Space - Activate AM/PM buttons
// Home        - Set to minimum (0 or 1)
// End         - Set to maximum (23/12 or 59)`,
  });
  const keyboardExamples = keyboardSection.querySelector('.dos-demo-section___examples');
  if (keyboardExamples) {
    const picker = createTimePicker({
      label: 'Try Keyboard Navigation',
    });
    keyboardExamples.appendChild(picker);

    const note = document.createElement('p');
    note.style.color = 'var(--dos-color-text-muted)';
    note.style.marginTop = '1rem';
    note.innerHTML = `
      <strong>Try it:</strong> Focus the hours field, then use ↑/↓ arrows to change the value. 
      Tab to minutes and use arrows again. Tab to AM/PM and press Enter or Space to toggle.
    `;
    keyboardExamples.appendChild(note);
  }
  content.appendChild(keyboardSection);

  // Form Integration
  const formSection = createDemoSection({
    title: 'Form Integration',
    description: 'TimePicker includes a hidden input for form submission.',
    codeExample: `<form id="schedule-form">
  <!-- TimePicker adds a hidden input automatically -->
  const startTime = createTimePicker({
    label: 'Start Time',
    name: 'start_time',
    required: true
  });
  
  const endTime = createTimePicker({
    label: 'End Time', 
    name: 'end_time',
    required: true
  });
</form>

// Form data will include:
// start_time: "09:00 AM"
// end_time: "05:00 PM"`,
  });
  const formExamples = formSection.querySelector('.dos-demo-section___examples');
  if (formExamples) {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.gap = '2rem';
    form.style.flexWrap = 'wrap';
    form.style.alignItems = 'flex-end';

    const startTime = createTimePicker({
      label: 'Start Time',
      name: 'start_time',
      required: true,
      value: '09:00 AM',
    });
    form.appendChild(startTime);

    const endTime = createTimePicker({
      label: 'End Time',
      name: 'end_time',
      required: true,
      value: '05:00 PM',
    });
    form.appendChild(endTime);

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'dos-button';
    submitBtn.textContent = 'Submit';
    form.appendChild(submitBtn);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      alert('Form Data:\\n' + JSON.stringify(data, null, 2));
    });

    formExamples.appendChild(form);
  }
  content.appendChild(formSection);

  // Accessibility
  const a11ySection = createDemoSection({
    title: 'Accessibility',
    description: 'Fully accessible with ARIA attributes and keyboard support.',
    codeExample: `// Accessibility features:
// - role="spinbutton" on hour/minute inputs
// - aria-valuemin, aria-valuemax, aria-valuenow
// - aria-label on all interactive elements
// - aria-pressed on AM/PM toggle buttons
// - Visible focus indicators
// - High contrast for readability`,
  });
  const a11yExamples = a11ySection.querySelector('.dos-demo-section___examples');
  if (a11yExamples) {
    const picker = createTimePicker({
      label: 'Accessible Time Picker',
      value: '10:30 AM',
    });
    a11yExamples.appendChild(picker);

    const note = document.createElement('p');
    note.style.color = 'var(--dos-color-text-muted)';
    note.style.marginTop = '1rem';
    note.textContent = 'Screen readers announce "Hours spinbutton" and "Minutes spinbutton" with current values.';
    a11yExamples.appendChild(note);
  }
  content.appendChild(a11ySection);

  page.appendChild(content);
  return page;
}