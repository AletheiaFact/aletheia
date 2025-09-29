import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

/**
 * ResetButton Atom Component
 * 
 * A pure, reusable reset button following atomic design principles.
 * This component is focused solely on rendering and user interaction,
 * with no business logic or side effects.
 * 
 * Features:
 * - Tooltip support for accessibility
 * - Disabled state handling
 * - Consistent styling with warning color
 * - Test automation support
 * - Accessibility compliant
 */

interface ResetButtonProps {
    /** Click handler function */
    onClick: () => void;
    
    /** Button disabled state */
    disabled?: boolean;
    
    /** Tooltip text to display on hover */
    tooltip?: string;
    
    /** Additional CSS class names */
    className?: string;
    
    /** Test ID for automation */
    "data-cy"?: string;
    
    /** ARIA label for accessibility */
    "aria-label"?: string;
}

export const ResetButton: React.FC<ResetButtonProps> = ({
    onClick,
    disabled = false,
    tooltip,
    className,
    "data-cy": dataCy = "testResetToInitialButton",
    "aria-label": ariaLabel = "Reset to initial state",
    ...props
}) => {
    const button = (
        <IconButton
            onClick={onClick}
            disabled={disabled}
            color="warning"
            className={className}
            data-cy={dataCy}
            aria-label={ariaLabel}
            {...props}
        >
            <RestartAltIcon />
        </IconButton>
    );

    // Wrap with tooltip if provided
    if (tooltip) {
        return (
            <Tooltip title={tooltip}>
                <span>
                    {button}
                </span>
            </Tooltip>
        );
    }

    return button;
};