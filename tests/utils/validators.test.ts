/**
 * Validators Utilities Tests
 *
 * Tests for the DOSage validation utility functions.
 */

import { describe, it, expect } from 'vitest';
import {
  validators,
  required,
  email,
  minLength,
  maxLength,
  pattern,
  matches,
  range,
  compose,
  custom,
} from '../../src/utils/validators';

describe('Validators', () => {
  describe('required', () => {
    it('returns invalid for empty string', () => {
      const validate = validators.required();
      const result = validate('');

      expect(result.valid).toBe(false);
      expect(result.message).toBe('This field is required');
    });

    it('returns invalid for whitespace-only string (trimmed by default)', () => {
      const validate = validators.required();
      const result = validate('   ');

      expect(result.valid).toBe(false);
    });

    it('returns valid for non-empty string', () => {
      const validate = validators.required();
      const result = validate('hello');

      expect(result.valid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('respects trim option when false', () => {
      const validate = validators.required({ trim: false });
      const result = validate('   ');

      expect(result.valid).toBe(true);
    });

    it('uses custom message when provided', () => {
      const validate = validators.required({ message: 'Username is required' });
      const result = validate('');

      expect(result.message).toBe('Username is required');
    });
  });

  describe('email', () => {
    it('returns invalid for invalid email formats', () => {
      const validate = validators.email();

      expect(validate('notanemail').valid).toBe(false);
      expect(validate('missing@domain').valid).toBe(false);
      expect(validate('@nodomain.com').valid).toBe(false);
      expect(validate('spaces in@email.com').valid).toBe(false);
    });

    it('returns valid for valid email formats', () => {
      const validate = validators.email();

      expect(validate('user@example.com').valid).toBe(true);
      expect(validate('user.name@example.co.uk').valid).toBe(true);
      expect(validate('user+tag@example.com').valid).toBe(true);
    });

    it('returns valid for empty string (use required for that)', () => {
      const validate = validators.email();
      const result = validate('');

      expect(result.valid).toBe(true);
    });

    it('uses custom message when provided', () => {
      const validate = validators.email({ message: 'Invalid email format' });
      const result = validate('invalid');

      expect(result.message).toBe('Invalid email format');
    });
  });

  describe('minLength', () => {
    it('returns invalid when value is shorter than minimum', () => {
      const validate = validators.minLength(3);
      const result = validate('ab');

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Must be at least 3 characters');
    });

    it('returns valid when value meets minimum length', () => {
      const validate = validators.minLength(3);

      expect(validate('abc').valid).toBe(true);
      expect(validate('abcd').valid).toBe(true);
    });

    it('returns valid for empty string (use required for that)', () => {
      const validate = validators.minLength(3);
      const result = validate('');

      expect(result.valid).toBe(true);
    });

    it('uses custom message with placeholder', () => {
      const validate = validators.minLength(5, { message: 'Needs at least {min} chars' });
      const result = validate('ab');

      expect(result.message).toBe('Needs at least 5 chars');
    });
  });

  describe('maxLength', () => {
    it('returns invalid when value exceeds maximum', () => {
      const validate = validators.maxLength(5);
      const result = validate('123456');

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Must be no more than 5 characters');
    });

    it('returns valid when value is within maximum', () => {
      const validate = validators.maxLength(5);

      expect(validate('12345').valid).toBe(true);
      expect(validate('1234').valid).toBe(true);
      expect(validate('').valid).toBe(true);
    });

    it('uses custom message with placeholder', () => {
      const validate = validators.maxLength(10, { message: 'Max {max} characters allowed' });
      const result = validate('12345678901');

      expect(result.message).toBe('Max 10 characters allowed');
    });
  });

  describe('pattern', () => {
    it('returns invalid when value does not match pattern', () => {
      const validate = validators.pattern(/^[A-Z]+$/);
      const result = validate('abc');

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Invalid format');
    });

    it('returns valid when value matches pattern', () => {
      const validate = validators.pattern(/^[A-Z]+$/);
      const result = validate('ABC');

      expect(result.valid).toBe(true);
    });

    it('returns valid for empty string (use required for that)', () => {
      const validate = validators.pattern(/^[A-Z]+$/);
      const result = validate('');

      expect(result.valid).toBe(true);
    });

    it('uses custom message', () => {
      const validate = validators.pattern(/^\d+$/, { message: 'Numbers only' });
      const result = validate('abc');

      expect(result.message).toBe('Numbers only');
    });
  });

  describe('matches', () => {
    it('returns invalid when values do not match', () => {
      let password = 'secret123';
      const validate = validators.matches(() => password, 'password');
      const result = validate('different');

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Must match password');
    });

    it('returns valid when values match', () => {
      let password = 'secret123';
      const validate = validators.matches(() => password, 'password');
      const result = validate('secret123');

      expect(result.valid).toBe(true);
    });

    it('uses getter function for dynamic comparison', () => {
      let password = 'initial';
      const validate = validators.matches(() => password, 'password');

      expect(validate('initial').valid).toBe(true);

      password = 'changed';
      expect(validate('initial').valid).toBe(false);
      expect(validate('changed').valid).toBe(true);
    });

    it('uses custom message with placeholder', () => {
      const validate = validators.matches(() => 'value', 'confirm', {
        message: 'Does not match {fieldName}',
      });
      const result = validate('other');

      expect(result.message).toBe('Does not match confirm');
    });
  });

  describe('range', () => {
    it('returns invalid when value is below minimum', () => {
      const validate = validators.range(1, 100);
      const result = validate('0');

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Must be between 1 and 100');
    });

    it('returns invalid when value is above maximum', () => {
      const validate = validators.range(1, 100);
      const result = validate('101');

      expect(result.valid).toBe(false);
    });

    it('returns valid when value is within range (inclusive)', () => {
      const validate = validators.range(1, 100);

      expect(validate('1').valid).toBe(true);
      expect(validate('50').valid).toBe(true);
      expect(validate('100').valid).toBe(true);
    });

    it('returns invalid for non-numeric values', () => {
      const validate = validators.range(1, 100);
      const result = validate('abc');

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Must be a valid number');
    });

    it('returns valid for empty string (use required for that)', () => {
      const validate = validators.range(1, 100);
      const result = validate('');

      expect(result.valid).toBe(true);
    });

    it('uses custom message with placeholders', () => {
      const validate = validators.range(0, 10, { message: 'Value must be {min} to {max}' });
      const result = validate('20');

      expect(result.message).toBe('Value must be 0 to 10');
    });
  });

  describe('compose', () => {
    it('returns valid when all validators pass', () => {
      const validate = validators.compose(
        validators.required(),
        validators.minLength(3),
        validators.maxLength(10)
      );

      const result = validate('hello');
      expect(result.valid).toBe(true);
    });

    it('returns first error when a validator fails', () => {
      const validate = validators.compose(
        validators.required(),
        validators.minLength(3),
        validators.maxLength(10)
      );

      const result = validate('');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('This field is required');
    });

    it('runs validators in order', () => {
      const validate = validators.compose(
        validators.required(),
        validators.minLength(5),
        validators.pattern(/^\d+$/, { message: 'Numbers only' })
      );

      // Fails required first
      expect(validate('').message).toBe('This field is required');

      // Fails minLength second
      expect(validate('ab').message).toBe('Must be at least 5 characters');

      // Fails pattern third
      expect(validate('hello').message).toBe('Numbers only');

      // Passes all
      expect(validate('12345').valid).toBe(true);
    });

    it('handles empty validators array', () => {
      const validate = validators.compose();
      const result = validate('anything');

      expect(result.valid).toBe(true);
    });
  });

  describe('custom', () => {
    it('returns valid when predicate returns true', () => {
      const isEven = validators.custom(
        (value) => parseInt(value, 10) % 2 === 0,
        'Must be even'
      );

      expect(isEven('4').valid).toBe(true);
    });

    it('returns invalid when predicate returns false', () => {
      const isEven = validators.custom(
        (value) => parseInt(value, 10) % 2 === 0,
        'Must be even'
      );

      const result = isEven('3');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Must be even');
    });

    it('allows complex custom validation', () => {
      const hasUpperAndLower = validators.custom(
        (value) => /[A-Z]/.test(value) && /[a-z]/.test(value),
        'Must contain uppercase and lowercase letters'
      );

      expect(hasUpperAndLower('abc').valid).toBe(false);
      expect(hasUpperAndLower('ABC').valid).toBe(false);
      expect(hasUpperAndLower('AbC').valid).toBe(true);
    });
  });

  describe('individual exports', () => {
    it('exports individual validator functions', () => {
      expect(typeof required).toBe('function');
      expect(typeof email).toBe('function');
      expect(typeof minLength).toBe('function');
      expect(typeof maxLength).toBe('function');
      expect(typeof pattern).toBe('function');
      expect(typeof matches).toBe('function');
      expect(typeof range).toBe('function');
      expect(typeof compose).toBe('function');
      expect(typeof custom).toBe('function');
    });

    it('individual exports work the same as validators object', () => {
      const fromObject = validators.required();
      const fromExport = required();

      expect(fromObject('').valid).toBe(fromExport('').valid);
      expect(fromObject('').message).toBe(fromExport('').message);
      expect(fromObject('hello').valid).toBe(fromExport('hello').valid);
    });
  });

  describe('real-world usage patterns', () => {
    it('validates a registration form username', () => {
      const validateUsername = validators.compose(
        validators.required({ message: 'Username is required' }),
        validators.minLength(3, { message: 'Username must be at least 3 characters' }),
        validators.maxLength(20, { message: 'Username cannot exceed 20 characters' }),
        validators.pattern(/^[a-zA-Z0-9_]+$/, {
          message: 'Username can only contain letters, numbers, and underscores',
        })
      );

      expect(validateUsername('').message).toBe('Username is required');
      expect(validateUsername('ab').message).toBe('Username must be at least 3 characters');
      expect(validateUsername('a'.repeat(21)).message).toBe(
        'Username cannot exceed 20 characters'
      );
      expect(validateUsername('user@name').message).toBe(
        'Username can only contain letters, numbers, and underscores'
      );
      expect(validateUsername('valid_user123').valid).toBe(true);
    });

    it('validates password with confirmation', () => {
      let password = '';

      const validatePassword = validators.compose(
        validators.required({ message: 'Password is required' }),
        validators.minLength(8, { message: 'Password must be at least 8 characters' })
      );

      const validateConfirmPassword = validators.compose(
        validators.required({ message: 'Please confirm your password' }),
        validators.matches(() => password, 'password', {
          message: 'Passwords do not match',
        })
      );

      // Test password
      expect(validatePassword('').message).toBe('Password is required');
      expect(validatePassword('short').message).toBe('Password must be at least 8 characters');
      expect(validatePassword('longenoughpassword').valid).toBe(true);

      // Test confirmation
      password = 'mypassword123';
      expect(validateConfirmPassword('').message).toBe('Please confirm your password');
      expect(validateConfirmPassword('different').message).toBe('Passwords do not match');
      expect(validateConfirmPassword('mypassword123').valid).toBe(true);
    });
  });
});
