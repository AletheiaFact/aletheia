/**
 * Form Validation Utilities
 * Based on GitLab Pajamas form validation patterns
 *
 * Provides validation functions with clear, specific, actionable error messages
 * following the pattern: "What happened + What to do"
 */

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

/**
 * Validation Rules
 * Common validation patterns with user-friendly error messages
 */

/**
 * Required field validation
 */
export const required = (value: any, fieldName: string = 'This field'): ValidationResult => {
  const isEmpty = value === undefined || value === null || value === '' ||
    (Array.isArray(value) && value.length === 0);

  return {
    isValid: !isEmpty,
    error: isEmpty ? `${fieldName} is required` : undefined,
  };
};

/**
 * Email validation
 */
export const email = (value: string): ValidationResult => {
  if (!value) return { isValid: true }; // Empty is valid (use 'required' separately)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(value);

  return {
    isValid,
    error: isValid ? undefined : 'Email must include @ symbol and domain',
  };
};

/**
 * URL validation
 */
export const url = (value: string): ValidationResult => {
  if (!value) return { isValid: true };

  try {
    new URL(value);
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: 'URL must start with http:// or https://',
    };
  }
};

/**
 * Minimum length validation
 */
export const minLength = (min: number, value: string, fieldName: string = 'Input'): ValidationResult => {
  if (!value) return { isValid: true };

  const isValid = value.length >= min;

  return {
    isValid,
    error: isValid ? undefined : `${fieldName} must be at least ${min} characters`,
  };
};

/**
 * Maximum length validation
 */
export const maxLength = (max: number, value: string, fieldName: string = 'Input'): ValidationResult => {
  if (!value) return { isValid: true };

  const isValid = value.length <= max;

  return {
    isValid,
    error: isValid ? undefined : `${fieldName} must be ${max} characters or fewer`,
  };
};

/**
 * Password strength validation
 */
export const password = (value: string): ValidationResult => {
  if (!value) return { isValid: true };

  const minLength = 8;
  const hasNumber = /\d/.test(value);
  const hasLetter = /[a-zA-Z]/.test(value);

  if (value.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters`,
    };
  }

  if (!hasNumber) {
    return {
      isValid: false,
      error: 'Password must include at least one number',
    };
  }

  if (!hasLetter) {
    return {
      isValid: false,
      error: 'Password must include at least one letter',
    };
  }

  return { isValid: true };
};

/**
 * Match validation (for password confirmation)
 */
export const matches = (
  value: string,
  matchValue: string,
  fieldName: string = 'Passwords'
): ValidationResult => {
  if (!value) return { isValid: true };

  const isValid = value === matchValue;

  return {
    isValid,
    error: isValid ? undefined : `${fieldName} must match`,
  };
};

/**
 * Numeric validation
 */
export const numeric = (value: string): ValidationResult => {
  if (!value) return { isValid: true };

  const isValid = /^\d+$/.test(value);

  return {
    isValid,
    error: isValid ? undefined : 'Must contain only numbers',
  };
};

/**
 * Min value validation (for numbers)
 */
export const minValue = (min: number, value: number | string): ValidationResult => {
  if (value === '' || value === null || value === undefined) return { isValid: true };

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const isValid = numValue >= min;

  return {
    isValid,
    error: isValid ? undefined : `Must be at least ${min}`,
  };
};

/**
 * Max value validation (for numbers)
 */
export const maxValue = (max: number, value: number | string): ValidationResult => {
  if (value === '' || value === null || value === undefined) return { isValid: true };

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const isValid = numValue <= max;

  return {
    isValid,
    error: isValid ? undefined : `Must be ${max} or less`,
  };
};

/**
 * Pattern validation (custom regex)
 */
export const pattern = (
  regex: RegExp,
  errorMessage: string,
  value: string
): ValidationResult => {
  if (!value) return { isValid: true };

  const isValid = regex.test(value);

  return {
    isValid,
    error: isValid ? undefined : errorMessage,
  };
};

/**
 * Custom validation function
 */
export const custom = (
  validator: (value: any) => boolean,
  errorMessage: string,
  value: any
): ValidationResult => {
  const isValid = validator(value);

  return {
    isValid,
    error: isValid ? undefined : errorMessage,
  };
};

/**
 * Combine multiple validations
 * Returns the first error encountered
 */
export const validate = (...validations: ValidationResult[]): ValidationResult => {
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation;
    }
  }

  return { isValid: true };
};

/**
 * Validation builder for creating reusable validators
 */
export class ValidatorBuilder {
  private validations: ((value: any) => ValidationResult)[] = [];

  required(fieldName?: string) {
    this.validations.push((value) => required(value, fieldName));
    return this;
  }

  email() {
    this.validations.push((value) => email(value));
    return this;
  }

  url() {
    this.validations.push((value) => url(value));
    return this;
  }

  minLength(min: number, fieldName?: string) {
    this.validations.push((value) => minLength(min, value, fieldName));
    return this;
  }

  maxLength(max: number, fieldName?: string) {
    this.validations.push((value) => maxLength(max, value, fieldName));
    return this;
  }

  password() {
    this.validations.push((value) => password(value));
    return this;
  }

  matches(matchValue: string, fieldName?: string) {
    this.validations.push((value) => matches(value, matchValue, fieldName));
    return this;
  }

  numeric() {
    this.validations.push((value) => numeric(value));
    return this;
  }

  minValue(min: number) {
    this.validations.push((value) => minValue(min, value));
    return this;
  }

  maxValue(max: number) {
    this.validations.push((value) => maxValue(max, value));
    return this;
  }

  pattern(regex: RegExp, errorMessage: string) {
    this.validations.push((value) => pattern(regex, errorMessage, value));
    return this;
  }

  custom(validator: (value: any) => boolean, errorMessage: string) {
    this.validations.push((value) => custom(validator, errorMessage, value));
    return this;
  }

  build() {
    return (value: any): ValidationResult => {
      return validate(...this.validations.map((v) => v(value)));
    };
  }
}

/**
 * Common validators for reuse
 */
export const validators = {
  email: () => new ValidatorBuilder().required('Email').email().build(),
  password: () => new ValidatorBuilder().required('Password').password().build(),
  url: () => new ValidatorBuilder().required('URL').url().build(),
  username: () => new ValidatorBuilder()
    .required('Username')
    .minLength(3, 'Username')
    .maxLength(20, 'Username')
    .build(),
  claimTitle: () => new ValidatorBuilder()
    .required('Claim title')
    .minLength(10, 'Claim title')
    .maxLength(200, 'Claim title')
    .build(),
};
