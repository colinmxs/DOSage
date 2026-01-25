/**
 * Panel Component
 *
 * A DOS-style panel with box-drawing borders and optional title.
 * Provides authentic DOS look with single, double, or thick borders.
 */

import type { PanelProps } from './Panel.types';
import type { SpacingValue } from '../../types/common';
import './Panel.css';

/**
 * Valid spacing preset names
 */
const SPACING_PRESETS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * Check if a value is a spacing preset string
 */
function isSpacingPreset(value: SpacingValue): value is (typeof SPACING_PRESETS)[number] {
  return typeof value === 'string' && SPACING_PRESETS.includes(value as (typeof SPACING_PRESETS)[number]);
}

/**
 * Convert spacing value to CSS value
 */
function spacingToCss(value: SpacingValue): string {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return value;
}

/** Counter for generating unique IDs */
let panelIdCounter = 0;

/**
 * Creates a DOS-style panel element with box-drawing borders.
 *
 * @param props - Panel configuration options
 * @returns The panel DOM element
 *
 * @example
 * ```typescript
 * import { createPanel } from 'dosage';
 *
 * const panel = createPanel({
 *   title: 'System Information',
 *   borderStyle: 'double',
 *   shadow: true,
 * });
 *
 * panel.querySelector('.dos-panel__content').innerHTML = '<p>Content</p>';
 * document.body.appendChild(panel);
 * ```
 */
export function createPanel(props: PanelProps = {}): HTMLElement {
  const {
    title,
    borderStyle = 'single',
    padding = 'md',
    shadow = false,
    className,
    id,
  } = props;

  // Create panel element
  const element = document.createElement('div');

  // Build class list
  const classes = ['dos-panel', `dos-panel--${borderStyle}`];

  // Add padding class
  if (isSpacingPreset(padding)) {
    classes.push(`dos-panel--padding-${padding}`);
  }

  if (shadow) {
    classes.push('dos-panel--shadow');
  }

  if (className) {
    classes.push(className);
  }

  element.className = classes.join(' ');

  // Apply ID if provided
  if (id) {
    element.id = id;
  }

  // Generate unique ID for accessibility
  const panelId = id ?? `dos-panel-${++panelIdCounter}`;
  let titleId: string | undefined;

  // Add title if provided
  if (title) {
    titleId = `${panelId}-title`;

    const titleElement = document.createElement('h2');
    titleElement.className = 'dos-panel__title';
    titleElement.id = titleId;
    titleElement.textContent = title;
    element.appendChild(titleElement);

    // Add ARIA attributes for accessibility
    element.setAttribute('role', 'region');
    element.setAttribute('aria-labelledby', titleId);
  }

  // Create content area
  const content = document.createElement('div');
  content.className = 'dos-panel__content';

  // Apply custom padding if not a preset
  if (!isSpacingPreset(padding)) {
    content.style.padding = spacingToCss(padding);
  }

  element.appendChild(content);

  return element;
}

/**
 * Get the content element from a panel.
 *
 * @param panel - The panel element
 * @returns The content element or null if not found
 */
export function getPanelContent(panel: HTMLElement): HTMLElement | null {
  return panel.querySelector('.dos-panel__content');
}
