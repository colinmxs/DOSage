/**
 * Stepper / Wizard Component
 *
 * DOS-style step progress indicator with horizontal/vertical layouts,
 * clickable steps, and full keyboard navigation.
 *
 * Visual patterns:
 * - Horizontal: [1]───[2]───(3)───[ ]───[ ]
 * - Completed: [✓]
 * - Current: (●) or highlighted
 * - Upcoming: [ ]
 * - Error: [✗]
 *
 * @example
 * ```ts
 * const stepper = createStepper({
 *   steps: [
 *     { label: 'Account', completed: true },
 *     { label: 'Profile' },
 *     { label: 'Review' }
 *   ],
 *   currentStep: 1,
 *   allowStepClick: true,
 *   onChange: (index) => console.log('Step:', index)
 * });
 * ```
 */

import type { StepperProps, StepperElement, Step } from './Stepper.types';
import './Stepper.css';

/**
 * Creates a DOS-style stepper/wizard component
 *
 * @param props - Stepper configuration options
 * @returns Extended HTMLElement with stepper methods
 */
export function createStepper(props: StepperProps): StepperElement {
  const {
    steps: initialSteps,
    currentStep: initialCurrentStep = 0,
    orientation = 'horizontal',
    allowStepClick = false,
    showStepNumbers = true,
    onChange,
    className = '',
    id,
    ...restProps
  } = props;

  // Internal state
  let steps = [...initialSteps];
  let currentStep = Math.max(0, Math.min(initialCurrentStep, steps.length - 1));
  const eventListeners: Array<{ element: Element; event: string; handler: EventListener }> = [];

  // Create container
  const container = document.createElement('div') as unknown as StepperElement;
  container.className = `dos-stepper dos-stepper--${orientation}${className ? ` ${className}` : ''}`;

  if (id) {
    container.id = id;
  }

  // Set ARIA attributes
  container.setAttribute('role', 'list');
  container.setAttribute('aria-label', 'Progress');

  // Apply any additional props
  Object.entries(restProps).forEach(([key, value]) => {
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      container.setAttribute(key, String(value));
    }
  });

  /**
   * Creates the indicator content (number, checkmark, or error symbol)
   */
  function getIndicatorContent(step: Step, index: number): string {
    if (step.completed) {
      return '✓';
    }
    if (step.error) {
      return '✗';
    }
    if (showStepNumbers) {
      return String(index + 1);
    }
    if (index === currentStep) {
      return '●';
    }
    return ' ';
  }

  /**
   * Gets CSS class modifiers for a step based on its state
   */
  function getStepClasses(step: Step, index: number): string {
    const classes = ['dos-stepper___step'];

    if (index === currentStep) {
      classes.push('dos-stepper___step--current');
    }
    if (step.completed) {
      classes.push('dos-stepper___step--completed');
    }
    if (step.error) {
      classes.push('dos-stepper___step--error');
    }
    if (step.disabled) {
      classes.push('dos-stepper___step--disabled');
    }

    return classes.join(' ');
  }

  /**
   * Handles step click/activation
   */
  function handleStepActivate(index: number): void {
    const step = steps[index];
    if (!step || step.disabled || !allowStepClick) {
      return;
    }

    currentStep = index;
    render();

    if (onChange) {
      onChange(currentStep);
    }
  }

  /**
   * Handles keyboard navigation within the stepper
   */
  function handleKeyDown(event: KeyboardEvent, index: number): void {
    if (!allowStepClick) {
      return;
    }

    const focusableIndicators = Array.from(
      container.querySelectorAll<HTMLButtonElement>('.dos-stepper___step-indicator:not(:disabled)')
    );

    const currentIndex = focusableIndicators.findIndex(
      (el) => el === (event.target as HTMLElement)
    );

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableIndicators.length;
        const nextElement = focusableIndicators[nextIndex];
        if (nextElement) {
          nextElement.focus();
        }
        break;
      }

      case 'ArrowLeft':
      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = currentIndex === 0 ? focusableIndicators.length - 1 : currentIndex - 1;
        const prevElement = focusableIndicators[prevIndex];
        if (prevElement) {
          prevElement.focus();
        }
        break;
      }

      case 'Home': {
        event.preventDefault();
        const firstElement = focusableIndicators[0];
        if (firstElement) {
          firstElement.focus();
        }
        break;
      }

      case 'End': {
        event.preventDefault();
        const lastElement = focusableIndicators[focusableIndicators.length - 1];
        if (lastElement) {
          lastElement.focus();
        }
        break;
      }

      case 'Enter':
      case ' ': {
        event.preventDefault();
        handleStepActivate(index);
        break;
      }
    }
  }

  /**
   * Renders the stepper content
   */
  function render(): void {
    // Clean up existing event listeners
    eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    eventListeners.length = 0;

    // Clear container
    container.innerHTML = '';

    steps.forEach((step, index) => {
      // Step wrapper
      const stepElement = document.createElement('div');
      stepElement.className = getStepClasses(step, index);
      stepElement.setAttribute('role', 'listitem');

      // Indicator
      let indicator: HTMLElement;

      if (allowStepClick) {
        indicator = document.createElement('button');
        indicator.setAttribute('type', 'button');
        if (step.disabled) {
          (indicator as HTMLButtonElement).disabled = true;
        }
      } else {
        indicator = document.createElement('div');
        indicator.setAttribute('aria-hidden', 'true');
      }

      indicator.className = 'dos-stepper___step-indicator';
      indicator.textContent = getIndicatorContent(step, index);

      // ARIA attributes for indicator
      if (allowStepClick) {
        indicator.setAttribute('aria-label', `${step.label}${step.completed ? ', completed' : ''}${step.error ? ', has error' : ''}${index === currentStep ? ', current step' : ''}`);

        // Event listeners for clickable indicator
        if (!step.disabled) {
          const clickHandler = () => handleStepActivate(index);
          indicator.addEventListener('click', clickHandler);
          eventListeners.push({ element: indicator, event: 'click', handler: clickHandler });

          const keydownHandler = (e: Event) => handleKeyDown(e as KeyboardEvent, index);
          indicator.addEventListener('keydown', keydownHandler);
          eventListeners.push({ element: indicator, event: 'keydown', handler: keydownHandler });
        }
      }

      stepElement.appendChild(indicator);

      // Content (label and description)
      const content = document.createElement('div');
      content.className = 'dos-stepper___step-content';

      const label = document.createElement('div');
      label.className = 'dos-stepper___step-label';
      label.textContent = step.label;

      // ARIA current step
      if (index === currentStep) {
        stepElement.setAttribute('aria-current', 'step');
      }

      content.appendChild(label);

      if (step.description) {
        const description = document.createElement('div');
        description.className = 'dos-stepper___step-description';
        description.textContent = step.description;
        content.appendChild(description);
      }

      stepElement.appendChild(content);

      // Connector line (except for last step)
      if (index < steps.length - 1) {
        const connector = document.createElement('div');
        connector.className = 'dos-stepper___connector';
        connector.setAttribute('aria-hidden', 'true');
        stepElement.appendChild(connector);
      }

      container.appendChild(stepElement);
    });
  }

  // Initial render
  render();

  // Public API
  container.setStep = (index: number): void => {
    const clampedIndex = Math.max(0, Math.min(index, steps.length - 1));
    if (clampedIndex !== currentStep) {
      currentStep = clampedIndex;
      render();

      if (onChange) {
        onChange(currentStep);
      }
    }
  };

  container.getStep = (): number => {
    return currentStep;
  };

  container.setStepCompleted = (index: number, completed: boolean): void => {
    const step = steps[index];
    if (index >= 0 && index < steps.length && step) {
      steps[index] = { ...step, completed };
      render();
    }
  };

  container.setStepError = (index: number, hasError: boolean): void => {
    const step = steps[index];
    if (index >= 0 && index < steps.length && step) {
      steps[index] = { ...step, error: hasError };
      render();
    }
  };

  container.setStepDisabled = (index: number, disabled: boolean): void => {
    const step = steps[index];
    if (index >= 0 && index < steps.length && step) {
      steps[index] = { ...step, disabled };
      render();
    }
  };

  container.getStepState = (index: number): Step | undefined => {
    return steps[index] ? { ...steps[index] } : undefined;
  };

  container.setSteps = (newSteps: Step[]): void => {
    steps = [...newSteps];
    currentStep = Math.max(0, Math.min(currentStep, steps.length - 1));
    render();
  };

  container.nextStep = (): void => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      render();

      if (onChange) {
        onChange(currentStep);
      }
    }
  };

  container.previousStep = (): void => {
    if (currentStep > 0) {
      currentStep--;
      render();

      if (onChange) {
        onChange(currentStep);
      }
    }
  };

  container.destroy = (): void => {
    eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    eventListeners.length = 0;
    container.innerHTML = '';
  };

  return container;
}
