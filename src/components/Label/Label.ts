import type { LabelProps } from './Label.types';
import './Label.css';

export function createLabel(props: LabelProps): HTMLLabelElement {
  const {
    text,
    for: htmlFor,
    required = false,
    requiredIndicator = '*',
    disabled = false,
    className = '',
    id,
  } = props;

  const label = document.createElement('label');
  const classes = ['dos-label'];
  
  if (required) classes.push('dos-label--required');
  if (disabled) classes.push('dos-label--disabled');
  if (className) classes.push(className);

  label.className = classes.join(' ');
  if (id) label.id = id;
  if (htmlFor) label.htmlFor = htmlFor;

  label.textContent = text;

  if (required) {
    const indicator = document.createElement('span');
    indicator.className = 'dos-label___required-indicator';
    indicator.textContent = ` ${requiredIndicator}`;
    label.appendChild(indicator);
  }

  return label;
}
