import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

/**
 * ReassignButton Atom Component
 * 
 * A pure, reusable reassign user button following atomic design principles.
 * This component is focused solely on rendering and user interaction,
 * with no business logic or side effects.
 * 
 * Features:
 * - Tooltip support for accessibility
 * - Disabled state handling
 * - Consistent styling
 * - Test automation support
 * - Accessibility compliant
 */

interface ReassignButtonProps {
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

export const ReassignButton: React.FC<ReassignButtonProps> = ({
    onClick,
    disabled = false,
    tooltip,
    className,
    "data-cy": dataCy = "testReassignUserButton",
    "aria-label": ariaLabel = "Reassign user",
    ...props
}) => {
    const button = (
        <IconButton
            onClick={onClick}
            disabled={disabled}
            className={className}
            data-cy={dataCy}
            aria-label={ariaLabel}
            {...props}
        >
            <ManageAccountsIcon />
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