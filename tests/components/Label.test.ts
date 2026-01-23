import { describe, it, expect } from 'vitest';
import { createLabel } from '../../src/components/Label/Label';

describe('Label', () => {
  it('renders label element', () => {
    const label = createLabel({ text: 'Username' });
    expect(label.tagName).toBe('LABEL');
    expect(label.textContent).toContain('Username');
  });

  it('for attribute is set', () => {
    const label = createLabel({ text: 'Email', for: 'email-input' });
    expect(label.htmlFor).toBe('email-input');
  });

  it('required indicator shows', () => {
    const label = createLabel({ text: 'Name', required: true });
    const indicator = label.querySelector('.dos-label___required-indicator');
    expect(indicator).toBeTruthy();
    expect(indicator?.textContent).toContain('*');
  });

  it('disabled styling applies', () => {
    const label = createLabel({ text: 'Disabled', disabled: true });
    expect(label.className).toContain('dos-label--disabled');
  });
});
