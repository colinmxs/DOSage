/**
 * Validation Utilities Types
 *
 * Type definitions for the DOSage validation utilities.
 * These are optional helpers for form validation - developers
 * can use any validation library they prefer.
 */

/**
 * Result of a validation operation.
 */
export interface ValidationResult {
  /**
   * Whether the value passes validation.
   */
  valid: boolean;

  /**
   * Error message if validation failed.
   * Undefined when valid is true.
   */
  message?: string;
}

/**
 * A function that validates a string value.
 */
export type ValidatorFn = (value: string) => ValidationResult;

/**
 * Options for the required validator.
 */
export interface RequiredValidatorOptions {
  /**
   * Custom error message.
   * @default 'This field is required'
   */
  message?: string;

  /**
   * Whether to trim whitespace before checking.
   * @default true
   */
  trim?: boolean;
}

/**
 * Options for the email validator.
 */
export interface EmailValidatorOptions {
  /**
   * Custom error message.
   * @default 'Please enter a valid email address'
   */
  message?: string;
}

/**
 * Options for the minLength validator.
 */
export interface MinLengthValidatorOptions {
  /**
   * Custom error message.
   * Can include {min} placeholder for the minimum length.
   * @default 'Must be at least {min} characters'
   */
  message?: string;
}

/**
 * Options for the maxLength validator.
 */
export interface MaxLengthValidatorOptions {
  /**
   * Custom error message.
   * Can include {max} placeholder for the maximum length.
   * @default 'Must be no more than {max} characters'
   */
  message?: string;
}

/**
 * Options for the pattern validator.
 */
export interface PatternValidatorOptions {
  /**
   * Custom error message.
   * @default 'Invalid format'
   */
  message?: string;
}

/**
 * Options for the matches validator.
 */
export interface MatchesValidatorOptions {
  /**
   * Custom error message.
   * Can include {fieldName} placeholder.
   * @default 'Must match {fieldName}'
   */
  message?: string;
}

/**
 * Options for the number range validator.
 */
export interface RangeValidatorOptions {
  /**
   * Custom error message.
   * Can include {min} and {max} placeholders.
   * @default 'Must be between {min} and {max}'
   */
  message?: string;
}

/**
 * Collection of validator functions.
 */
export interface Validators {
  /**
   * Creates a validator that checks for non-empty values.
   */
  required: (options?: RequiredValidatorOptions) => ValidatorFn;

  /**
   * Creates a validator that checks for valid email format.
   */
  email: (options?: EmailValidatorOptions) => ValidatorFn;

  /**
   * Creates a validator that checks minimum character length.
   */
  minLength: (min: number, options?: MinLengthValidatorOptions) => ValidatorFn;

  /**
   * Creates a validator that checks maximum character length.
   */
  maxLength: (max: number, options?: MaxLengthValidatorOptions) => ValidatorFn;

  /**
   * Creates a validator that checks against a regex pattern.
   */
  pattern: (regex: RegExp, options?: PatternValidatorOptions) => ValidatorFn;

  /**
   * Creates a validator that checks if value matches another field's value.
   * Requires a getter function to retrieve the other field's current value.
   */
  matches: (
    getFieldValue: () => string,
    fieldName: string,
    options?: MatchesValidatorOptions
  ) => ValidatorFn;

  /**
   * Creates a validator that checks if a numeric value is within a range.
   */
  range: (min: number, max: number, options?: RangeValidatorOptions) => ValidatorFn;

  /**
   * Composes multiple validators into a single validator.
   * Returns the first error encountered, or valid if all pass.
   */
  compose: (...validators: ValidatorFn[]) => ValidatorFn;

  /**
   * Creates a custom validator from a function and message.
   */
  custom: (fn: (value: string) => boolean, message: string) => ValidatorFn;
}
