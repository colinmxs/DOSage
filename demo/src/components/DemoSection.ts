/**
 * DemoSection Component
 *
 * Wrapper for individual component demos in the Kitchen Sink.
 */

export interface DemoSectionOptions {
  /** Section title */
  title: string;
  /** Section description */
  description?: string;
  /** Code snippet to display */
  code?: string;
}

/**
 * Creates a demo section wrapper
 */
export function createDemoSection(options: DemoSectionOptions): HTMLElement {
  const { title, description, code } = options;

  const section = document.createElement('section');
  section.className = 'dos-demo-section';

  // Title
  const titleEl = document.createElement('h3');
  titleEl.className = 'dos-demo-section___title';
  titleEl.textContent = title;
  section.appendChild(titleEl);

  // Description
  if (description) {
    const descEl = document.createElement('p');
    descEl.className = 'dos-demo-section___description';
    descEl.textContent = description;
    section.appendChild(descEl);
  }

  // Examples container (to be populated externally)
  const examples = document.createElement('div');
  examples.className = 'dos-demo-section___examples';
  section.appendChild(examples);

  // Code snippet
  if (code) {
    const codeWrapper = document.createElement('div');
    codeWrapper.className = 'dos-demo-section___code';

    const pre = document.createElement('pre');
    const codeEl = document.createElement('code');
    codeEl.textContent = code;

    pre.appendChild(codeEl);
    codeWrapper.appendChild(pre);
    section.appendChild(codeWrapper);
  }

  return section;
}

/**
 * Gets the examples container from a demo section
 */
export function getDemoExamples(section: HTMLElement): HTMLElement | null {
  return section.querySelector('.dos-demo-section___examples');
}
