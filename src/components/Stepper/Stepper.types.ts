/**
 * Stepper / Wizard Component Types
 *
 * Type definitions for the DOS-style step progress indicator.
 */

import type { BaseComponentProps } from '../../types';

/**
 * Step definition for the stepper
 */
export interface Step {
  /** Step label */
  label: string;

  /** Optional step description */
  description?: string;

  /** Whether this step is completed */
  completed?: boolean;

  /** Whether this step has an error */
  error?: boolean;

  /** Whether this step is disabled */
  disabled?: boolean;
}

/**
 * Stepper orientation
 */
export type StepperOrientation = 'horizontal' | 'vertical';

/**
 * Stepper properties
 */
export interface StepperProps extends BaseComponentProps {
  /** Step definitions */
  steps: Step[];

  /** Current active step (0-indexed) */
  currentStep?: number;

  /** Stepper layout orientation (default: 'horizontal') */
  orientation?: StepperOrientation;

  /** Allow clicking steps to navigate (default: false) */
  allowStepClick?: boolean;

  /** Show step numbers (default: true) */
  showStepNumbers?: boolean;

  /** Callback when step changes */
  onChange?: (stepIndex: number) => void;
}

/**
 * Extended stepper element with public methods
 */
export interface StepperElement extends HTMLElement {
  /** Navigate to a specific step */
  setStep: (index: number) => void;

  /** Get current step index */
  getStep: () => number;

  /** Mark a step as completed */
  setStepCompleted: (index: number, completed: boolean) => void;

  /** Mark a step as having an error */
  setStepError: (index: number, hasError: boolean) => void;

  /** Enable/disable a specific step */
  setStepDisabled: (index: number, disabled: boolean) => void;

  /** Get step state by index */
  getStepState: (index: number) => Step | undefined;

  /** Update all steps */
  setSteps: (steps: Step[]) => void;

  /** Go to next step */
  nextStep: () => void;

  /** Go to previous step */
  previousStep: () => void;

  /** Clean up event listeners */
  destroy: () => void;
}
