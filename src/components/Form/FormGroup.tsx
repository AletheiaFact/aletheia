/**
 * FormGroup Component
 * Based on GitLab Pajamas form patterns
 *
 * Provides a consistent form field with label, input, helper text,
 * validation, and error messaging.
 *
 * Note: This is different from FormField.ts which contains type definitions
 * and factory functions for the form system.
 */

import { ReactNode } from 'react';
import { Box, FormControl, FormHelperText, FormLabel, styled } from '@mui/material';
import { semanticColors, spacing, typography } from '../../styles';

interface FormGroupProps {
  /**
   * Field label text
   */
  label: string;

  /**
   * Input element (child component)
   */
  children: ReactNode;

  /**
   * Field name/id
   */
  name?: string;

  /**
   * Error message (if validation fails)
   */
  error?: string;

  /**
   * Success message (if validation succeeds)
   */
  success?: string;

  /**
   * Helper text (additional context)
   */
  helperText?: string;

  /**
   * Required field indicator
   */
  required?: boolean;

  /**
   * Disable the field
   */
  disabled?: boolean;

  /**
   * Show validation state
   */
  showValidation?: boolean;

  /**
   * Custom CSS
   */
  className?: string;

  /**
   * Full width
   */
  fullWidth?: boolean;
}

const StyledFormLabel = styled(FormLabel)`
  ${typography.uiText.label}
  color: ${semanticColors.text.primary};
  margin-bottom: ${spacing.xs};
  display: block;

  .required-indicator {
    color: ${semanticColors.feedback.error};
    margin-left: ${spacing.xxs};
  }

  &.Mui-disabled {
    color: ${semanticColors.text.disabled};
  }
`;

const StyledFormHelperText = styled(FormHelperText)`
  ${typography.uiText.helper}
  margin-top: ${spacing.xs};
  margin-left: 0;

  &.error {
    ${typography.uiText.error}
    color: ${semanticColors.feedback.error};
  }

  &.success {
    color: ${semanticColors.feedback.success};
  }

  &.helper {
    color: ${semanticColors.text.tertiary};
  }
`;

const FieldContainer = styled(Box)`
  margin-bottom: ${spacing.md};

  &.has-error {
    .input-wrapper {
      input,
      textarea,
      select {
        border-color: ${semanticColors.border.error};

        &:focus {
          border-color: ${semanticColors.border.error};
          box-shadow: 0 0 0 1px ${semanticColors.feedback.errorLight};
        }
      }
    }
  }

  &.has-success {
    .input-wrapper {
      input,
      textarea,
      select {
        border-color: ${semanticColors.border.success};

        &:focus {
          border-color: ${semanticColors.border.success};
          box-shadow: 0 0 0 1px ${semanticColors.feedback.successLight};
        }
      }
    }
  }
`;

/**
 * FormGroup - Consistent form field with validation
 *
 * @example
 * <FormGroup
 *   label="Email address"
 *   name="email"
 *   required
 *   error={errors.email}
 *   helperText="We'll never share your email"
 * >
 *   <input type="email" {...register('email')} />
 * </FormGroup>
 */
const FormGroup: React.FC<FormGroupProps> = ({
  label,
  children,
  name,
  error,
  success,
  helperText,
  required,
  disabled,
  showValidation = true,
  className,
  fullWidth = true,
}) => {
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;

  return (
    <FieldContainer
      className={`
        ${className || ''}
        ${hasError ? 'has-error' : ''}
        ${hasSuccess ? 'has-success' : ''}
      `}
    >
      <FormControl
        fullWidth={fullWidth}
        error={hasError}
        disabled={disabled}
      >
        <StyledFormLabel htmlFor={name}>
          {label}
          {required && <span className="required-indicator">*</span>}
        </StyledFormLabel>

        <div className="input-wrapper">
          {children}
        </div>

        {showValidation && (hasError || hasSuccess || helperText) && (
          <StyledFormHelperText
            className={hasError ? 'error' : hasSuccess ? 'success' : 'helper'}
          >
            {error || success || helperText}
          </StyledFormHelperText>
        )}
      </FormControl>
    </FieldContainer>
  );
};

export default FormGroup;
