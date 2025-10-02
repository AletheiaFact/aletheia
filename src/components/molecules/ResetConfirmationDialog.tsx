import React from "react";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Alert 
} from "@mui/material";

/**
 * ResetConfirmationDialog Molecule Component
 * 
 * A reusable confirmation dialog specifically designed for reset operations.
 * This molecule combines dialog atoms with reset-specific content and behavior.
 * 
 * Features:
 * - Consistent dialog structure for reset operations
 * - Warning message display
 * - Error state handling
 * - Loading state management
 * - Accessibility compliance
 * - Test automation support
 */

interface ResetConfirmationDialogProps {
    /** Whether the dialog is open */
    open: boolean;
    
    /** Handler for dialog close */
    onClose: () => void;
    
    /** Handler for reset confirmation */
    onConfirm: () => void;
    
    /** Loading state during reset operation */
    isLoading?: boolean;
    
    /** Error message to display */
    error?: string;
    
    /** Dialog title */
    title: string;
    
    /** Warning message to display */
    warningMessage: string;
    
    /** Cancel button label */
    cancelLabel?: string;
    
    /** Confirm button label */
    confirmLabel?: string;
    
    /** Loading button label */
    loadingLabel?: string;
    
    /** Maximum dialog width */
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const ResetConfirmationDialog: React.FC<ResetConfirmationDialogProps> = ({
    open,
    onClose,
    onConfirm,
    isLoading = false,
    error,
    title,
    warningMessage,
    cancelLabel = "Cancel",
    confirmLabel = "Confirm Reset",
    loadingLabel = "Resetting...",
    maxWidth = "sm",
}) => {
    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm();
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth={maxWidth}
            fullWidth
            data-cy="testResetConfirmationDialog"
        >
            <DialogTitle data-cy="testResetDialogTitle">
                {title}
            </DialogTitle>
            
            <DialogContent>
                {/* Warning Message */}
                <Alert 
                    severity="warning" 
                    data-cy="testResetWarningMessage"
                    sx={{ mb: error ? 2 : 0 }}
                >
                    {warningMessage}
                </Alert>
                
                {/* Error Message */}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>
            
            <DialogActions>
                <Button 
                    onClick={handleClose}
                    disabled={isLoading}
                    data-cy="testResetCancelButton"
                >
                    {cancelLabel}
                </Button>
                
                <Button 
                    onClick={handleConfirm}
                    color="warning"
                    variant="contained"
                    disabled={isLoading}
                    data-cy="testResetConfirmButton"
                >
                    {isLoading ? loadingLabel : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
};