import { useState, useCallback } from "react";

/**
 * Custom hook for managing reset confirmation dialog state
 * 
 * Provides a reusable interface for handling dialog open/close,
 * loading states, error handling, and confirmation logic.
 * 
 * Features:
 * - Dialog visibility management
 * - Loading state during async operations
 * - Error state management
 * - Confirmation callback handling
 * - Automatic cleanup on close
 */
export const useResetDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");

    /**
     * Opens the dialog and clears any previous errors
     */
    const open = useCallback(() => {
        setError("");
        setIsOpen(true);
    }, []);

    /**
     * Closes the dialog and clears error state
     */
    const close = useCallback(() => {
        setIsOpen(false);
        setError("");
    }, []);

    /**
     * Handles the confirmation action with async operation
     * @param confirmAction - Async function to execute on confirmation
     */
    const confirm = useCallback(async (confirmAction: () => Promise<void>) => {
        if (!confirmAction) return;
        
        setIsLoading(true);
        try {
            await confirmAction();
            close(); // Close dialog on success
        } catch (err) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : "An error occurred during the operation";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [close]);

    /**
     * Sets a custom error message
     * @param errorMessage - Error message to display
     */
    const setCustomError = useCallback((errorMessage: string) => {
        setError(errorMessage);
    }, []);

    /**
     * Clears the current error
     */
    const clearError = useCallback(() => {
        setError("");
    }, []);

    return {
        // State
        isOpen,
        isLoading,
        error,
        hasError: !!error,
        
        // Actions
        open,
        close,
        confirm,
        setCustomError,
        clearError,
    };
};