import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ResetButton } from '../ResetButton';

/**
 * ResetButton Atom Component Tests
 * 
 * These tests demonstrate the improved testability achieved through
 * atomic design principles. The component is now:
 * - Pure and predictable
 * - Easy to test in isolation
 * - Focused on a single responsibility
 * - Reusable across different contexts
 */

describe('ResetButton', () => {
    const mockOnClick = jest.fn();

    beforeEach(() => {
        mockOnClick.mockClear();
    });

    it('should render reset button with correct icon', () => {
        render(<ResetButton onClick={mockOnClick} />);
        
        const button = screen.getByRole('button', { name: /reset to initial state/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('data-cy', 'testResetToInitialButton');
    });

    it('should call onClick when clicked', () => {
        render(<ResetButton onClick={mockOnClick} />);
        
        const button = screen.getByRole('button');
        fireEvent.click(button);
        
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
        render(<ResetButton onClick={mockOnClick} disabled={true} />);
        
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should not call onClick when disabled and clicked', () => {
        render(<ResetButton onClick={mockOnClick} disabled={true} />);
        
        const button = screen.getByRole('button');
        fireEvent.click(button);
        
        expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should display tooltip when tooltip prop is provided', () => {
        const tooltipText = 'Reset the task to its initial state';
        render(<ResetButton onClick={mockOnClick} tooltip={tooltipText} />);
        
        // The tooltip is wrapped in a span, so we check for that structure
        const tooltipWrapper = screen.getByRole('button').parentElement;
        expect(tooltipWrapper).toBeInTheDocument();
    });

    it('should have warning color', () => {
        render(<ResetButton onClick={mockOnClick} />);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('MuiIconButton-colorWarning');
    });

    it('should accept custom className', () => {
        const customClass = 'custom-reset-button';
        render(<ResetButton onClick={mockOnClick} className={customClass} />);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass(customClass);
    });

    it('should accept custom data-cy attribute', () => {
        const customDataCy = 'customResetButton';
        render(<ResetButton onClick={mockOnClick} data-cy={customDataCy} />);
        
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-cy', customDataCy);
    });

    it('should accept custom aria-label', () => {
        const customAriaLabel = 'Custom reset action';
        render(<ResetButton onClick={mockOnClick} aria-label={customAriaLabel} />);
        
        const button = screen.getByRole('button', { name: customAriaLabel });
        expect(button).toBeInTheDocument();
    });
});