/**
 * Link Component
 *
 * A DOS-style hyperlink with various underline styles.
 * Uses semantic <a> element for proper accessibility.
 */

import type { LinkProps } from './Link.types';
import './Link.css';

/**
 * Creates a DOS-style link element.
 *
 * @param props - Link configuration options
 * @returns The anchor DOM element
 *
 * @example
 * ```typescript
 * import { createLink } from 'dosage';
 *
 * const link = createLink({
 *   href: 'https://example.com',
 *   label: 'Visit Example',
 *   external: true
 * });
 *
 * document.body.appendChild(link);
 * ```
 */
export function createLink(props: LinkProps): HTMLAnchorElement {
  const {
    href,
    label,
    target = '_self',
    external = false,
    underline = 'always',
    disabled = false,
    onClick,
    className,
    id,
  } = props;

  // Create anchor element
  const element = document.createElement('a');

  // Set href
  if (!disabled) {
    element.href = href;
  }

  // Build class list
  const classes = ['dos-link', `dos-link--underline-${underline}`];

  if (external) {
    classes.push('dos-link--external');
  }

  if (disabled) {
    classes.push('dos-link--disabled');
  }

  if (className) {
    classes.push(className);
  }

  element.className = classes.join(' ');

  // Apply ID if provided
  if (id) {
    element.id = id;
  }

  // Set target
  if (external || target === '_blank') {
    element.target = '_blank';
    // Security: add rel attributes for external links
    element.rel = 'noopener noreferrer';
  } else {
    element.target = target;
  }

  // Set ARIA attributes
  if (disabled) {
    element.setAttribute('aria-disabled', 'true');
    element.tabIndex = -1;
  }

  // Create label text
  const textElement = document.createElement('span');
  textElement.className = 'dos-link__text';
  textElement.textContent = label;
  element.appendChild(textElement);

  // Add external indicator
  if (external) {
    const externalIcon = document.createElement('span');
    externalIcon.className = 'dos-link__external-icon';
    externalIcon.textContent = '↗';
    externalIcon.setAttribute('aria-hidden', 'true');
    element.appendChild(externalIcon);

    // Screen reader hint for new window
    const srHint = document.createElement('span');
    srHint.className = 'dos-sr-only';
    srHint.textContent = ' (opens in new window)';
    srHint.style.cssText =
      'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
    element.appendChild(srHint);
  }

  // Event handlers
  if (!disabled && onClick) {
    element.addEventListener('click', onClick);
  }

  // Prevent navigation when disabled
  if (disabled) {
    element.addEventListener('click', (event) => {
      event.preventDefault();
    });
  }

  // Keyboard handler - Enter to activate (native behavior)
  element.addEventListener('keydown', (event: KeyboardEvent) => {
    if (disabled && event.key === 'Enter') {
      event.preventDefault();
    }
  });

  return element;
}

/**
 * Updates a link's disabled state.
 *
 * @param link - The link element
 * @param disabled - Whether the link should be disabled
 */
export function setLinkDisabled(link: HTMLAnchorElement, disabled: boolean): void {
  if (disabled) {
    link.classList.add('dos-link--disabled');
    link.setAttribute('aria-disabled', 'true');
    link.tabIndex = -1;
    link.removeAttribute('href');
  } else {
    link.classList.remove('dos-link--disabled');
    link.removeAttribute('aria-disabled');
    link.tabIndex = 0;
    // Note: href needs to be restored separately if it was removed
  }
}

/**
 * Updates a link's label text.
 *
 * @param link - The link element
 * @param label - The new label text
 */
export function setLinkLabel(link: HTMLAnchorElement, label: string): void {
  const textElement = link.querySelector('.dos-link__text');
  if (textElement) {
    textElement.textContent = label;
  }
}

/**
 * Updates a link's href.
 *
 * @param link - The link element
 * @param href - The new href
 */
export function setLinkHref(link: HTMLAnchorElement, href: string): void {
  if (!link.classList.contains('dos-link--disabled')) {
    link.href = href;
  }
}
