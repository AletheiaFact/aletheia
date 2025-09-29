import React from "react";
import { ResetButton } from "../atoms/ResetButton";
import { ReassignButton } from "../atoms/ReassignButton";

/**
 * AdminActionButtons Molecule Component
 * 
 * Combines admin action atoms (reset and reassign buttons) into a cohesive group.
 * This molecule handles the composition and conditional rendering of admin actions
 * based on permissions.
 * 
 * Features:
 * - Composes ResetButton and ReassignButton atoms
 * - Handles conditional rendering based on permissions
 * - Maintains consistent spacing and layout
 * - Provides group-level styling hooks
 */

interface AdminActionButtonsProps {
    /** Handler for reassign action */
    onReassign: () => void;
    
    /** Handler for reset action */
    onReset: () => void;
    
    /** Whether user can reset tasks */
    canReset: boolean;
    
    /** Whether user can reassign users */
    canReassign: boolean;
    
    /** Tooltip for reset button */
    resetTooltip?: string;
    
    /** Tooltip for reassign button */
    reassignTooltip?: string;
    
    /** Loading state for reset action */
    isResetLoading?: boolean;
    
    /** Loading state for reassign action */
    isReassignLoading?: boolean;
    
    /** Additional CSS class names */
    className?: string;
}

export const AdminActionButtons: React.FC<AdminActionButtonsProps> = ({
    onReassign,
    onReset,
    canReset,
    canReassign = true, // Most users can trigger reassign dialog
    resetTooltip,
    reassignTooltip,
    isResetLoading = false,
    isReassignLoading = false,
    className,
}) => {
    return (
        <div className={`admin-action-buttons ${className || ''}`}>
            {/* Reassign User Button */}
            {canReassign && (
                <div className="toolbar-item">
                    <ReassignButton
                        onClick={onReassign}
                        disabled={isReassignLoading}
                        tooltip={reassignTooltip}
                    />
                </div>
            )}
            
            {/* Reset Button */}
            {canReset && (
                <div className="toolbar-item">
                    <ResetButton
                        onClick={onReset}
                        disabled={isResetLoading}
                        tooltip={resetTooltip}
                    />
                </div>
            )}
        </div>
    );
};