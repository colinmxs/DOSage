/**
 * Stepper Component Tests
 *
 * Comprehensive tests for the DOS-style stepper/wizard component.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createStepper } from '../../src/components/Stepper';
import type { Step } from '../../src/components/Stepper';

describe('Stepper', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  const defaultSteps: Step[] = [
    { label: 'Step 1' },
    { label: 'Step 2' },
    { label: 'Step 3' },
  ];

  describe('rendering', () => {
    it('renders with basic props', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      expect(stepper).toBeInstanceOf(HTMLElement);
      expect(stepper.classList.contains('dos-stepper')).toBe(true);
    });

    it('renders all steps', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      const stepElements = stepper.querySelectorAll('.dos-stepper___step');
      expect(stepElements.length).toBe(3);
    });

    it('renders step numbers by default', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      const indicators = stepper.querySelectorAll('.dos-stepper___step-indicator');
      expect(indicators[0]?.textContent).toBe('1');
      expect(indicators[1]?.textContent).toBe('2');
      expect(indicators[2]?.textContent).toBe('3');
    });

    it('hides step numbers when showStepNumbers is false', () => {
      const stepper = createStepper({ steps: defaultSteps, showStepNumbers: false });
      container.appendChild(stepper);

      const indicators = stepper.querySelectorAll('.dos-stepper___step-indicator');
      expect(indicators[0]?.textContent).toBe('●'); // Current step shows bullet
      expect(indicators[1]?.textContent).toBe(' ');
      expect(indicators[2]?.textContent).toBe(' ');
    });

    it('renders step labels', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      const labels = stepper.querySelectorAll('.dos-stepper___step-label');
      expect(labels[0]?.textContent).toBe('Step 1');
      expect(labels[1]?.textContent).toBe('Step 2');
      expect(labels[2]?.textContent).toBe('Step 3');
    });

    it('renders step descriptions', () => {
      const steps: Step[] = [
        { label: 'Step 1', description: 'First step' },
        { label: 'Step 2', description: 'Second step' },
      ];
      const stepper = createStepper({ steps });
      container.appendChild(stepper);

      const descriptions = stepper.querySelectorAll('.dos-stepper___step-description');
      expect(descriptions.length).toBe(2);
      expect(descriptions[0]?.textContent).toBe('First step');
      expect(descriptions[1]?.textContent).toBe('Second step');
    });

    it('applies custom className', () => {
      const stepper = createStepper({ steps: defaultSteps, className: 'custom-class' });
      container.appendChild(stepper);

      expect(stepper.classList.contains('custom-class')).toBe(true);
    });

    it('applies custom id', () => {
      const stepper = createStepper({ steps: defaultSteps, id: 'my-stepper' });
      container.appendChild(stepper);

      expect(stepper.id).toBe('my-stepper');
    });

    it('renders connector lines between steps', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      const connectors = stepper.querySelectorAll('.dos-stepper___connector');
      expect(connectors.length).toBe(2); // n-1 connectors
    });
  });

  describe('orientations', () => {
    it('renders horizontal orientation by default', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      expect(stepper.classList.contains('dos-stepper--horizontal')).toBe(true);
    });

    it('renders vertical orientation', () => {
      const stepper = createStepper({ steps: defaultSteps, orientation: 'vertical' });
      container.appendChild(stepper);

      expect(stepper.classList.contains('dos-stepper--vertical')).toBe(true);
    });
  });

  describe('current step', () => {
    it('highlights current step', () => {
      const stepper = createStepper({ steps: defaultSteps, currentStep: 1 });
      container.appendChild(stepper);

      const stepElements = stepper.querySelectorAll('.dos-stepper___step');
      expect(stepElements[1]?.classList.contains('dos-stepper___step--current')).toBe(true);
    });

    it('defaults to first step', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      const stepElements = stepper.querySelectorAll('.dos-stepper___step');
      expect(stepElements[0]?.classList.contains('dos-stepper___step--current')).toBe(true);
    });

    it('sets aria-current on current step', () => {
      const stepper = createStepper({ steps: defaultSteps, currentStep: 1 });
      container.appendChild(stepper);

      const stepElements = stepper.querySelectorAll('.dos-stepper___step');
      expect(stepElements[1]?.getAttribute('aria-current')).toBe('step');
      expect(stepElements[0]?.getAttribute('aria-current')).toBeNull();
    });

    it('clamps currentStep to valid range', () => {
      const stepper = createStepper({ steps: defaultSteps, currentStep: 10 });
      container.appendChild(stepper);

      expect(stepper.getStep()).toBe(2); // Clamped to last step
    });

    it('clamps negative currentStep to 0', () => {
      const stepper = createStepper({ steps: defaultSteps, currentStep: -5 });
      container.appendChild(stepper);

      expect(stepper.getStep()).toBe(0);
    });
  });

  describe('step states', () => {
    it('renders completed step with checkmark', () => {
      const steps: Step[] = [
        { label: 'Step 1', completed: true },
        { label: 'Step 2' },
      ];
      const stepper = createStepper({ steps });
      container.appendChild(stepper);

      const indicators = stepper.querySelectorAll('.dos-stepper___step-indicator');
      expect(indicators[0]?.textContent).toBe('✓');
    });

    it('applies completed class to completed step', () => {
      const steps: Step[] = [
        { label: 'Step 1', completed: true },
        { label: 'Step 2' },
      ];
      const stepper = createStepper({ steps });
      container.appendChild(stepper);

      const stepElements = stepper.querySelectorAll('.dos-stepper___step');
      expect(stepElements[0]?.classList.contains('dos-stepper___step--completed')).toBe(true);
    });

    it('renders error step with error symbol', () => {
      const steps: Step[] = [
        { label: 'Step 1', error: true },
        { label: 'Step 2' },
      ];
      const stepper = createStepper({ steps });
      container.appendChild(stepper);

      const indicators = stepper.querySelectorAll('.dos-stepper___step-indicator');
      expect(indicators[0]?.textContent).toBe('✗');
    });

    it('applies error class to error step', () => {
      const steps: Step[] = [
        { label: 'Step 1', error: true },
        { label: 'Step 2' },
      ];
      const stepper = createStepper({ steps });
      container.appendChild(stepper);

      const stepElements = stepper.querySelectorAll('.dos-stepper___step');
      expect(stepElements[0]?.classList.contains('dos-stepper___step--error')).toBe(true);
    });

    it('applies disabled class to disabled step', () => {
      const steps: Step[] = [
        { label: 'Step 1' },
        { label: 'Step 2', disabled: true },
      ];
      const stepper = createStepper({ steps });
      container.appendChild(stepper);

      const stepElements = stepper.querySelectorAll('.dos-stepper___step');
      expect(stepElements[1]?.classList.contains('dos-stepper___step--disabled')).toBe(true);
    });
  });

  describe('clickable steps', () => {
    it('renders buttons when allowStepClick is true', () => {
      const stepper = createStepper({ steps: defaultSteps, allowStepClick: true });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll('button.dos-stepper___step-indicator');
      expect(buttons.length).toBe(3);
    });

    it('renders divs when allowStepClick is false', () => {
      const stepper = createStepper({ steps: defaultSteps, allowStepClick: false });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll('button.dos-stepper___step-indicator');
      expect(buttons.length).toBe(0);
    });

    it('calls onChange when step is clicked', () => {
      const onChange = vi.fn();
      const stepper = createStepper({ steps: defaultSteps, allowStepClick: true, onChange });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll<HTMLButtonElement>('.dos-stepper___step-indicator');
      buttons[2]?.click();

      expect(onChange).toHaveBeenCalledWith(2);
    });

    it('does not call onChange when disabled step is clicked', () => {
      const onChange = vi.fn();
      const steps: Step[] = [
        { label: 'Step 1' },
        { label: 'Step 2', disabled: true },
      ];
      const stepper = createStepper({ steps, allowStepClick: true, onChange });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll<HTMLButtonElement>('.dos-stepper___step-indicator');
      buttons[1]?.click();

      expect(onChange).not.toHaveBeenCalled();
    });

    it('disabled steps have disabled button', () => {
      const steps: Step[] = [
        { label: 'Step 1' },
        { label: 'Step 2', disabled: true },
      ];
      const stepper = createStepper({ steps, allowStepClick: true });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll<HTMLButtonElement>('.dos-stepper___step-indicator');
      expect(buttons[1]?.disabled).toBe(true);
    });
  });

  describe('keyboard navigation', () => {
    it('navigates with ArrowRight', () => {
      const onChange = vi.fn();
      const stepper = createStepper({ steps: defaultSteps, allowStepClick: true, onChange });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll<HTMLButtonElement>('.dos-stepper___step-indicator');
      buttons[0]?.focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      buttons[0]?.dispatchEvent(event);

      expect(document.activeElement).toBe(buttons[1]);
    });

    it('navigates with ArrowLeft', () => {
      const stepper = createStepper({ steps: defaultSteps, allowStepClick: true });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll<HTMLButtonElement>('.dos-stepper___step-indicator');
      buttons[1]?.focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
      buttons[1]?.dispatchEvent(event);

      expect(document.activeElement).toBe(buttons[0]);
    });

    it('navigates with ArrowDown (vertical)', () => {
      const stepper = createStepper({ steps: defaultSteps, allowStepClick: true, orientation: 'vertical' });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll<HTMLButtonElement>('.dos-stepper___step-indicator');
      buttons[0]?.focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      buttons[0]?.dispatchEvent(event);

      expect(document.activeElement).toBe(buttons[1]);
    });

    it('navigates with ArrowUp (vertical)', () => {
      const stepper = createStepper({ steps: defaultSteps, allowStepClick: true, orientation: 'vertical' });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll<HTMLButtonElement>('.dos-stepper___step-indicator');
      buttons[1]?.focus();

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      buttons[1]?.dispatchEvent(event);

      expect(document.activeElement).toBe(buttons[0]);
    });

    it('navigates to first step with Home', () => {
      const stepper = createStepper({ steps: defaultSteps, allowStepClick: true });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll<HTMLButtonElement>('.dos-stepper___step-indicator');
      buttons[2]?.focus();

      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      buttons[2]?.dispatchEvent(event);

      expect(document.activeElement).toBe(buttons[0]);
    });

    it('navigates to last step with End', () => {
      const stepper = createStepper({ steps: defaultSteps, allowStepClick: true });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll<HTMLButtonElement>('.dos-stepper___step-indicator');
      buttons[0]?.focus();

      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      buttons[0]?.dispatchEvent(event);

      expect(document.activeElement).toBe(buttons[2]);
    });

    it('activates step with Enter', () => {
      const onChange = vi.fn();
      const stepper = createStepper({ steps: defaultSteps, allowStepClick: true, onChange });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll<HTMLButtonElement>('.dos-stepper___step-indicator');
      buttons[1]?.focus();

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      buttons[1]?.dispatchEvent(event);

      expect(onChange).toHaveBeenCalledWith(1);
    });

    it('activates step with Space', () => {
      const onChange = vi.fn();
      const stepper = createStepper({ steps: defaultSteps, allowStepClick: true, onChange });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll<HTMLButtonElement>('.dos-stepper___step-indicator');
      buttons[2]?.focus();

      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      buttons[2]?.dispatchEvent(event);

      expect(onChange).toHaveBeenCalledWith(2);
    });
  });

  describe('public API', () => {
    it('setStep changes current step', () => {
      const onChange = vi.fn();
      const stepper = createStepper({ steps: defaultSteps, onChange });
      container.appendChild(stepper);

      stepper.setStep(2);

      expect(stepper.getStep()).toBe(2);
      expect(onChange).toHaveBeenCalledWith(2);
    });

    it('setStep clamps to valid range', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      stepper.setStep(10);
      expect(stepper.getStep()).toBe(2);

      stepper.setStep(-5);
      expect(stepper.getStep()).toBe(0);
    });

    it('getStep returns current step', () => {
      const stepper = createStepper({ steps: defaultSteps, currentStep: 1 });
      container.appendChild(stepper);

      expect(stepper.getStep()).toBe(1);
    });

    it('setStepCompleted marks step as completed', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      stepper.setStepCompleted(0, true);

      const stepElements = stepper.querySelectorAll('.dos-stepper___step');
      expect(stepElements[0]?.classList.contains('dos-stepper___step--completed')).toBe(true);
    });

    it('setStepError marks step as having error', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      stepper.setStepError(1, true);

      const stepElements = stepper.querySelectorAll('.dos-stepper___step');
      expect(stepElements[1]?.classList.contains('dos-stepper___step--error')).toBe(true);
    });

    it('setStepDisabled disables a step', () => {
      const stepper = createStepper({ steps: defaultSteps, allowStepClick: true });
      container.appendChild(stepper);

      stepper.setStepDisabled(2, true);

      const stepElements = stepper.querySelectorAll('.dos-stepper___step');
      expect(stepElements[2]?.classList.contains('dos-stepper___step--disabled')).toBe(true);
    });

    it('getStepState returns step state', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      stepper.setStepCompleted(0, true);
      const state = stepper.getStepState(0);

      expect(state?.completed).toBe(true);
      expect(state?.label).toBe('Step 1');
    });

    it('getStepState returns undefined for invalid index', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      expect(stepper.getStepState(10)).toBeUndefined();
    });

    it('setSteps replaces all steps', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      stepper.setSteps([{ label: 'New 1' }, { label: 'New 2' }]);

      const labels = stepper.querySelectorAll('.dos-stepper___step-label');
      expect(labels.length).toBe(2);
      expect(labels[0]?.textContent).toBe('New 1');
    });

    it('nextStep goes to next step', () => {
      const onChange = vi.fn();
      const stepper = createStepper({ steps: defaultSteps, onChange });
      container.appendChild(stepper);

      stepper.nextStep();

      expect(stepper.getStep()).toBe(1);
      expect(onChange).toHaveBeenCalledWith(1);
    });

    it('nextStep does not go past last step', () => {
      const onChange = vi.fn();
      const stepper = createStepper({ steps: defaultSteps, currentStep: 2, onChange });
      container.appendChild(stepper);

      stepper.nextStep();

      expect(stepper.getStep()).toBe(2);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('previousStep goes to previous step', () => {
      const onChange = vi.fn();
      const stepper = createStepper({ steps: defaultSteps, currentStep: 2, onChange });
      container.appendChild(stepper);

      stepper.previousStep();

      expect(stepper.getStep()).toBe(1);
      expect(onChange).toHaveBeenCalledWith(1);
    });

    it('previousStep does not go before first step', () => {
      const onChange = vi.fn();
      const stepper = createStepper({ steps: defaultSteps, currentStep: 0, onChange });
      container.appendChild(stepper);

      stepper.previousStep();

      expect(stepper.getStep()).toBe(0);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('destroy cleans up the stepper', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      stepper.destroy();

      expect(stepper.innerHTML).toBe('');
    });
  });

  describe('accessibility', () => {
    it('has list role', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      expect(stepper.getAttribute('role')).toBe('list');
    });

    it('has aria-label', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      expect(stepper.getAttribute('aria-label')).toBe('Progress');
    });

    it('steps have listitem role', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      const stepElements = stepper.querySelectorAll('.dos-stepper___step');
      stepElements.forEach((step) => {
        expect(step.getAttribute('role')).toBe('listitem');
      });
    });

    it('clickable indicators have aria-label', () => {
      const steps: Step[] = [
        { label: 'Step 1', completed: true },
        { label: 'Step 2' },
        { label: 'Step 3', error: true },
      ];
      const stepper = createStepper({ steps, allowStepClick: true, currentStep: 1 });
      container.appendChild(stepper);

      const buttons = stepper.querySelectorAll<HTMLButtonElement>('.dos-stepper___step-indicator');
      expect(buttons[0]?.getAttribute('aria-label')).toContain('Step 1');
      expect(buttons[0]?.getAttribute('aria-label')).toContain('completed');
      expect(buttons[1]?.getAttribute('aria-label')).toContain('current step');
      expect(buttons[2]?.getAttribute('aria-label')).toContain('has error');
    });

    it('connectors are hidden from screen readers', () => {
      const stepper = createStepper({ steps: defaultSteps });
      container.appendChild(stepper);

      const connectors = stepper.querySelectorAll('.dos-stepper___connector');
      connectors.forEach((connector) => {
        expect(connector.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });

  describe('edge cases', () => {
    it('handles empty steps array', () => {
      const stepper = createStepper({ steps: [] });
      container.appendChild(stepper);

      expect(stepper.querySelectorAll('.dos-stepper___step').length).toBe(0);
    });

    it('handles single step', () => {
      const stepper = createStepper({ steps: [{ label: 'Only Step' }] });
      container.appendChild(stepper);

      const stepElements = stepper.querySelectorAll('.dos-stepper___step');
      expect(stepElements.length).toBe(1);

      const connectors = stepper.querySelectorAll('.dos-stepper___connector');
      expect(connectors.length).toBe(0);
    });

    it('handles data attributes', () => {
      const stepper = createStepper({
        steps: defaultSteps,
        'data-testid': 'my-stepper',
      } as Record<string, unknown>);
      container.appendChild(stepper);

      expect(stepper.getAttribute('data-testid')).toBe('my-stepper');
    });

    it('setSteps clamps currentStep if needed', () => {
      const stepper = createStepper({ steps: defaultSteps, currentStep: 2 });
      container.appendChild(stepper);

      stepper.setSteps([{ label: 'Only' }]);

      expect(stepper.getStep()).toBe(0);
    });
  });
});
