/**
 * Validation Utilities
 *
 * Optional helper functions for form validation in DOSage.
 * These utilities provide common validation patterns but developers
 * can use any validation library they prefer.
 *
 * @example
 * ```typescript
 * import { validators } from 'dosage';
 *
 * const validateUsername = validators.compose(
 *   validators.required(),
 *   validators.minLength(3)
 * );
 *
 * const result = validateUsername('ab');
 * // { valid: false, message: 'Must be at least 3 characters' }
 * ```
 */

import type {
  ValidationResult,
  ValidatorFn,
  RequiredValidatorOptions,
  EmailValidatorOptions,
  MinLengthValidatorOptions,
  MaxLengthValidatorOptions,
  PatternValidatorOptions,
  MatchesValidatorOptions,
  RangeValidatorOptions,
  Validators,
} from './validators.types';

/**
 * Creates a successful validation result.
 */
function validResult(): ValidationResult {
  return { valid: true };
}

/**
 * Creates a failed validation result with a message.
 */
function invalidResult(message: string): ValidationResult {
  return { valid: false, message };
}

/**
 * Standard email validation regex.
 * Covers most common email formats without being overly strict.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Creates a validator that checks for non-empty values.
 *
 * @param options - Validation options
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const validate = validators.required();
 * validate(''); // { valid: false, message: 'This field is required' }
 * validate('hello'); // { valid: true }
 * ```
 */
function required(options: RequiredValidatorOptions = {}): ValidatorFn {
  const { message = 'This field is required', trim = true } = options;

  return (value: string): ValidationResult => {
    const testValue = trim ? value.trim() : value;
    if (!testValue) {
      return invalidResult(message);
    }
    return validResult();
  };
}

/**
 * Creates a validator that checks for valid email format.
 *
 * @param options - Validation options
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const validate = validators.email();
 * validate('invalid'); // { valid: false, message: 'Please enter a valid email address' }
 * validate('user@example.com'); // { valid: true }
 * ```
 */
function email(options: EmailValidatorOptions = {}): ValidatorFn {
  const { message = 'Please enter a valid email address' } = options;

  return (value: string): ValidationResult => {
    // Allow empty values - use required() for that check
    if (!value) {
      return validResult();
    }
    if (!EMAIL_REGEX.test(value)) {
      return invalidResult(message);
    }
    return validResult();
  };
}

/**
 * Creates a validator that checks minimum character length.
 *
 * @param min - Minimum length required
 * @param options - Validation options
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const validate = validators.minLength(3);
 * validate('ab'); // { valid: false, message: 'Must be at least 3 characters' }
 * validate('abc'); // { valid: true }
 * ```
 */
function minLength(min: number, options: MinLengthValidatorOptions = {}): ValidatorFn {
  const { message = `Must be at least ${min} characters` } = options;
  const finalMessage = message.replace('{min}', String(min));

  return (value: string): ValidationResult => {
    // Allow empty values - use required() for that check
    if (!value) {
      return validResult();
    }
    if (value.length < min) {
      return invalidResult(finalMessage);
    }
    return validResult();
  };
}

/**
 * Creates a validator that checks maximum character length.
 *
 * @param max - Maximum length allowed
 * @param options - Validation options
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const validate = validators.maxLength(10);
 * validate('12345678901'); // { valid: false, message: 'Must be no more than 10 characters' }
 * validate('1234567890'); // { valid: true }
 * ```
 */
function maxLength(max: number, options: MaxLengthValidatorOptions = {}): ValidatorFn {
  const { message = `Must be no more than ${max} characters` } = options;
  const finalMessage = message.replace('{max}', String(max));

  return (value: string): ValidationResult => {
    if (value.length > max) {
      return invalidResult(finalMessage);
    }
    return validResult();
  };
}

/**
 * Creates a validator that checks against a regex pattern.
 *
 * @param regex - Regular expression to match
 * @param options - Validation options
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const validate = validators.pattern(/^[A-Z]+$/, { message: 'Must be uppercase letters only' });
 * validate('abc'); // { valid: false, message: 'Must be uppercase letters only' }
 * validate('ABC'); // { valid: true }
 * ```
 */
function pattern(regex: RegExp, options: PatternValidatorOptions = {}): ValidatorFn {
  const { message = 'Invalid format' } = options;

  return (value: string): ValidationResult => {
    // Allow empty values - use required() for that check
    if (!value) {
      return validResult();
    }
    if (!regex.test(value)) {
      return invalidResult(message);
    }
    return validResult();
  };
}

/**
 * Creates a validator that checks if value matches another field's value.
 * Useful for confirm password or confirm email fields.
 *
 * @param getFieldValue - Function that returns the other field's current value
 * @param fieldName - Name of the field being matched (for error message)
 * @param options - Validation options
 * @returns Validator function
 *
 * @example
 * ```typescript
 * let password = '';
 * const validateConfirm = validators.matches(() => password, 'password');
 *
 * password = 'secret123';
 * validateConfirm('secret'); // { valid: false, message: 'Must match password' }
 * validateConfirm('secret123'); // { valid: true }
 * ```
 */
function matches(
  getFieldValue: () => string,
  fieldName: string,
  options: MatchesValidatorOptions = {}
): ValidatorFn {
  const { message = `Must match ${fieldName}` } = options;
  const finalMessage = message.replace('{fieldName}', fieldName);

  return (value: string): ValidationResult => {
    const otherValue = getFieldValue();
    if (value !== otherValue) {
      return invalidResult(finalMessage);
    }
    return validResult();
  };
}

/**
 * Creates a validator that checks if a numeric value is within a range.
 *
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @param options - Validation options
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const validate = validators.range(1, 100);
 * validate('0'); // { valid: false, message: 'Must be between 1 and 100' }
 * validate('50'); // { valid: true }
 * ```
 */
function range(min: number, max: number, options: RangeValidatorOptions = {}): ValidatorFn {
  const { message = `Must be between ${min} and ${max}` } = options;
  const finalMessage = message.replace('{min}', String(min)).replace('{max}', String(max));

  return (value: string): ValidationResult => {
    // Allow empty values - use required() for that check
    if (!value) {
      return validResult();
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return invalidResult('Must be a valid number');
    }

    if (numValue < min || numValue > max) {
      return invalidResult(finalMessage);
    }
    return validResult();
  };
}

/**
 * Composes multiple validators into a single validator.
 * Validators are run in order, and the first failure is returned.
 * If all validators pass, returns a valid result.
 *
 * @param validatorFns - Validator functions to compose
 * @returns Combined validator function
 *
 * @example
 * ```typescript
 * const validateUsername = validators.compose(
 *   validators.required(),
 *   validators.minLength(3),
 *   validators.maxLength(20),
 *   validators.pattern(/^[a-zA-Z0-9_]+$/, { message: 'Only letters, numbers, and underscores' })
 * );
 *
 * const result = validateUsername('ab');
 * // { valid: false, message: 'Must be at least 3 characters' }
 * ```
 */
function compose(...validatorFns: ValidatorFn[]): ValidatorFn {
  return (value: string): ValidationResult => {
    for (const validatorFn of validatorFns) {
      const result = validatorFn(value);
      if (!result.valid) {
        return result;
      }
    }
    return validResult();
  };
}

/**
 * Creates a custom validator from a predicate function and error message.
 *
 * @param fn - Function that returns true if valid, false if invalid
 * @param message - Error message when validation fails
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const isEven = validators.custom(
 *   (value) => parseInt(value, 10) % 2 === 0,
 *   'Must be an even number'
 * );
 *
 * isEven('3'); // { valid: false, message: 'Must be an even number' }
 * isEven('4'); // { valid: true }
 * ```
 */
function custom(fn: (value: string) => boolean, message: string): ValidatorFn {
  return (value: string): ValidationResult => {
    if (!fn(value)) {
      return invalidResult(message);
    }
    return validResult();
  };
}

/**
 * Collection of validator factory functions.
 *
 * @example
 * ```typescript
 * import { validators } from 'dosage';
 *
 * // Simple validation
 * const result = validators.required()('');
 * // { valid: false, message: 'This field is required' }
 *
 * // Composed validation
 * const validateEmail = validators.compose(
 *   validators.required({ message: 'Email is required' }),
 *   validators.email()
 * );
 *
 * validateEmail(''); // { valid: false, message: 'Email is required' }
 * validateEmail('invalid'); // { valid: false, message: 'Please enter a valid email address' }
 * validateEmail('user@example.com'); // { valid: true }
 * ```
 */
export const validators: Validators = {
  required,
  email,
  minLength,
  maxLength,
  pattern,
  matches,
  range,
  compose,
  custom,
};

// Also export individual functions for tree-shaking
export {
  required,
  email,
  minLength,
  maxLength,
  pattern,
  matches,
  range,
  compose,
  custom,
};

// Export types
export type {
  ValidationResult,
  ValidatorFn,
  RequiredValidatorOptions,
  EmailValidatorOptions,
  MinLengthValidatorOptions,
  MaxLengthValidatorOptions,
  PatternValidatorOptions,
  MatchesValidatorOptions,
  RangeValidatorOptions,
  Validators,
} from './validators.types';
