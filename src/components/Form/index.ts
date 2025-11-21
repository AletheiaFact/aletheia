/**
 * Form Components
 * Export all form-related components for easy importing
 */

// Re-export original FormField types and utilities
export { createFormField, fieldValidation } from './FormField';
export type { FormField } from './FormField';

// New form components
export { default as FormGroup } from './FormGroup';
export { default as Input } from './Input';
export { default as Textarea } from './Textarea';

export type { InputSize, InputState } from './Input';
export type { TextareaState } from './Textarea';
