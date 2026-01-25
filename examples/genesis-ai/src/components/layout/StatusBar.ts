/**
 * Genesis AI - Status Bar Component
 * Bottom status bar with status, tokens, model info
 */

import {
  createBox,
  createText,
  createBadge,
  createProgressBar,
  createTooltip,
} from 'dosage';
import { formatTokens } from '../../utils/formatters';
import { SHORTCUTS } from '../../config';

export interface StatusBarState {
  status: 'Ready' | 'Sending...' | 'Receiving...' | 'Error';
  tokenCount: number;
  model: string;
  contextUsage: number; // 0-100
}

export interface StatusBarInstance {
  element: HTMLElement;
  updateStatus: (status: StatusBarState['status']) => void;
  updateTokens: (count: number) => void;
  updateModel: (model: string) => void;
  updateContextUsage: (percentage: number) => void;
  destroy: () => void;
}

export function createStatusBar(
  initialState: Partial<StatusBarState> = {}
): StatusBarInstance {
  const state: StatusBarState = {
    status: 'Ready',
    tokenCount: 0,
    model: 'Genesis-1',
    contextUsage: 0,
    ...initialState,
  };

  // Create main container
  const container = createBox({
    display: 'flex',
    className: 'genesis-statusbar',
  });

  container.style.cssText = `
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.25rem 0.5rem;
    border-top: 1px solid currentColor;
    font-size: 0.85rem;
  `;

  // Status indicator
  const statusText = createText({
    children: state.status,
    size: 'sm',
  });
  const statusWrapper = createBox({});
  statusWrapper.appendChild(statusText);
  statusWrapper.style.minWidth = '80px';

  // Divider helper
  const createDivider = () => {
    const divider = createText({ children: '│', size: 'sm' });
    return divider;
  };

  // Token count
  const tokenText = createText({
    children: `Tokens: ${formatTokens(state.tokenCount)}`,
    size: 'sm',
  });
  const tokenWrapper = createBox({});
  tokenWrapper.appendChild(tokenText);

  // Create tooltip for token details
  createTooltip({
    target: tokenWrapper,
    content: 'Total tokens used in current session',
    position: 'top',
  });

  // Model badge
  const modelBadge = createBadge({
    label: state.model,
    variant: 'info',
    size: 'small',
  });

  // Context usage progress bar
  const progressWrapper = createBox({});
  progressWrapper.style.cssText = 'display: flex; align-items: center; gap: 0.5rem;';

  const progressBar = createProgressBar({
    value: state.contextUsage,
    max: 100,
    size: 'small',
    showValue: false,
  });
  progressBar.element.style.width = '80px';

  const progressText = createText({
    children: `${state.contextUsage}%`,
    size: 'sm',
  });

  progressWrapper.appendChild(progressBar.element);
  progressWrapper.appendChild(progressText);

  createTooltip({
    target: progressWrapper,
    content: 'Context window usage',
    position: 'top',
  });

  // Keyboard shortcut hint
  const shortcutText = createText({
    children: `Press ${SHORTCUTS.commandPalette} for commands`,
    size: 'sm',
  });
  const shortcutWrapper = createBox({});
  shortcutWrapper.appendChild(shortcutText);
  shortcutWrapper.style.marginLeft = 'auto';

  // Assemble status bar
  container.appendChild(statusWrapper);
  container.appendChild(createDivider());
  container.appendChild(tokenWrapper);
  container.appendChild(createDivider());
  container.appendChild(modelBadge.element);
  container.appendChild(createDivider());
  container.appendChild(progressWrapper);
  container.appendChild(shortcutWrapper);

  return {
    element: container,

    updateStatus(status) {
      state.status = status;
      statusText.textContent = status;
    },

    updateTokens(count) {
      state.tokenCount = count;
      tokenText.textContent = `Tokens: ${formatTokens(count)}`;
    },

    updateModel(model) {
      state.model = model;
      modelBadge.setLabel(model);
    },

    updateContextUsage(percentage) {
      state.contextUsage = Math.min(100, Math.max(0, percentage));
      progressBar.setValue(state.contextUsage);
      progressText.textContent = `${state.contextUsage}%`;
    },

    destroy() {
      progressBar.destroy();
      modelBadge.destroy();
    },
  };
}
