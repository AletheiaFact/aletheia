/**
 * Input Component
 * Based on GitLab Pajamas input patterns
 *
 * Enhanced input component with consistent styling and validation states
 */

import { forwardRef } from 'react';
import styled from 'styled-components';
import { semanticColors, spacing, borderRadius, heights, typography } from '../../styles';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'error' | 'success';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input size
   */
  size?: InputSize;

  /**
   * Validation state
   */
  state?: InputState;

  /**
   * Prefix icon or element
   */
  prefix?: React.ReactNode;

  /**
   * Suffix icon or element
   */
  suffix?: React.ReactNode;

  /**
   * Full width
   */
  fullWidth?: boolean;
}

const getSizeStyles = (size: InputSize) => {
  switch (size) {
    case 'sm':
      return `
        height: ${heights.inputSmall};
        padding: ${spacing.xs} ${spacing.sm};
        font-size: ${typography.fontSize.sm};
      `;
    case 'lg':
      return `
        height: ${heights.inputLarge};
        padding: ${spacing.sm} ${spacing.md};
        font-size: ${typography.fontSize.lg};
      `;
    case 'md':
    default:
      return `
        height: ${heights.input};
        padding: ${spacing.sm} ${spacing.button};
        font-size: ${typography.fontSize.md};
      `;
  }
};

const getStateStyles = (state: InputState) => {
  switch (state) {
    case 'error':
      return `
        border-color: ${semanticColors.border.error};

        &:focus {
          border-color: ${semanticColors.border.error};
          box-shadow: 0 0 0 1px ${semanticColors.feedback.errorLight};
        }
      `;
    case 'success':
      return `
        border-color: ${semanticColors.border.success};

        &:focus {
          border-color: ${semanticColors.border.success};
          box-shadow: 0 0 0 1px ${semanticColors.feedback.successLight};
        }
      `;
    case 'default':
    default:
      return `
        border-color: ${semanticColors.border.default};

        &:hover {
          border-color: ${semanticColors.border.hover};
        }

        &:focus {
          border-color: ${semanticColors.border.focus};
          box-shadow: 0 0 0 1px ${semanticColors.action.primary}33;
        }
      `;
  }
};

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  .input-prefix,
  .input-suffix {
    position: absolute;
    display: flex;
    align-items: center;
    color: ${semanticColors.text.tertiary};
    pointer-events: none;
  }

  .input-prefix {
    left: ${spacing.sm};
  }

  .input-suffix {
    right: ${spacing.sm};
  }
`;

const StyledInput = styled.input<{
  size: InputSize;
  state: InputState;
  hasPrefix?: boolean;
  hasSuffix?: boolean;
  fullWidth?: boolean;
}>`
  ${typography.uiText.input}
  ${props => getSizeStyles(props.size)}
  ${props => getStateStyles(props.state)}

  width: ${props => props.fullWidth ? '100%' : 'auto'};
  border: 1px solid;
  border-radius: ${borderRadius.sm};
  background-color: ${semanticColors.surface.primary};
  color: ${semanticColors.text.primary};
  font-family: ${typography.fontFamily.body};
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  box-sizing: border-box;

  ${props => props.hasPrefix && `padding-left: ${spacing['2xl']};`}
  ${props => props.hasSuffix && `padding-right: ${spacing['2xl']};`}

  &::placeholder {
    color: ${semanticColors.text.tertiary};
  }

  &:disabled {
    background-color: ${semanticColors.surface.disabled};
    color: ${semanticColors.text.disabled};
    cursor: not-allowed;
  }

  &:read-only {
    background-color: ${semanticColors.surface.secondary};
    cursor: default;
  }

  /* Remove default browser styles */
  &:focus {
    outline: none;
  }

  /* Remove autofill yellow background */
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px ${semanticColors.surface.primary} inset;
    -webkit-text-fill-color: ${semanticColors.text.primary};
  }
`;

/**
 * Input - Enhanced input component with validation states
 *
 * @example
 * // Basic usage
 * <Input
 *   type="email"
 *   placeholder="name@example.com"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 *
 * @example
 * // With validation state
 * <Input
 *   type="text"
 *   state="error"
 *   value={value}
 *   onChange={handleChange}
 * />
 *
 * @example
 * // With prefix icon
 * <Input
 *   type="search"
 *   prefix={<SearchIcon />}
 *   placeholder="Search..."
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      state = 'default',
      prefix,
      suffix,
      fullWidth = true,
      ...restProps
    },
    ref
  ) => {
    return (
      <InputWrapper fullWidth={fullWidth}>
        {prefix && <span className="input-prefix">{prefix}</span>}

        <StyledInput
          ref={ref}
          size={size}
          state={state}
          hasPrefix={Boolean(prefix)}
          hasSuffix={Boolean(suffix)}
          fullWidth={fullWidth}
          {...restProps}
        />

        {suffix && <span className="input-suffix">{suffix}</span>}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';

export default Input;
