/**
 * Textarea Component
 * Based on GitLab Pajamas textarea patterns
 *
 * Multi-line text input with consistent styling and validation states
 */

import { forwardRef } from 'react';
import styled from 'styled-components';
import { semanticColors, spacing, borderRadius, typography } from '../../styles';

export type TextareaState = 'default' | 'error' | 'success';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Validation state
   */
  state?: TextareaState;

  /**
   * Minimum rows
   */
  minRows?: number;

  /**
   * Maximum rows
   */
  maxRows?: number;

  /**
   * Full width
   */
  fullWidth?: boolean;
}

const getStateStyles = (state: TextareaState) => {
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

const StyledTextarea = styled.textarea<{
  state: TextareaState;
  fullWidth?: boolean;
}>`
  ${typography.uiText.input}
  ${props => getStateStyles(props.state)}

  width: ${props => props.fullWidth ? '100%' : 'auto'};
  min-height: 80px;
  padding: ${spacing.sm} ${spacing.button};
  border: 1px solid;
  border-radius: ${borderRadius.sm};
  background-color: ${semanticColors.surface.primary};
  color: ${semanticColors.text.primary};
  font-family: ${typography.fontFamily.body};
  line-height: ${typography.lineHeight.normal};
  resize: vertical;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  box-sizing: border-box;

  &::placeholder {
    color: ${semanticColors.text.tertiary};
  }

  &:disabled {
    background-color: ${semanticColors.surface.disabled};
    color: ${semanticColors.text.disabled};
    cursor: not-allowed;
    resize: none;
  }

  &:read-only {
    background-color: ${semanticColors.surface.secondary};
    cursor: default;
  }

  /* Remove default browser styles */
  &:focus {
    outline: none;
  }
`;

/**
 * Textarea - Multi-line text input component
 *
 * @example
 * <Textarea
 *   placeholder="Describe the claim..."
 *   value={description}
 *   onChange={(e) => setDescription(e.target.value)}
 *   rows={4}
 * />
 *
 * @example
 * // With validation state
 * <Textarea
 *   state="error"
 *   value={value}
 *   onChange={handleChange}
 * />
 */
const Textarea = forwardRef<HTMLTextareaElement, TextareaProps>(
  (
    {
      state = 'default',
      minRows = 3,
      maxRows,
      fullWidth = true,
      rows,
      ...restProps
    },
    ref
  ) => {
    return (
      <StyledTextarea
        ref={ref}
        state={state}
        fullWidth={fullWidth}
        rows={rows || minRows}
        {...restProps}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
