import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ReviewTaskMachineContext } from "../machines/reviewTask/ReviewTaskMachineProvider";
import { ReviewTaskEvents } from "../machines/reviewTask/enums";
import ReviewTaskApi from "../api/reviewTaskApi";
import { useResetDialog } from "./useResetDialog";
import { useReviewTaskPermissions } from "./useReviewTaskPermissions";

/**
 * Custom hook for managing review task actions
 * 
 * Orchestrates all review task actions including reassignment,
 * reset functionality, and integrates with the state machine.
 * 
 * Features:
 * - Handles reassign user action
 * - Manages reset to initial state workflow
 * - Integrates with XState machine
 * - Provides localized messages
 * - Manages dialog state
 * - Handles API calls and error states
 */
export const useReviewTaskActions = () => {
    const { t } = useTranslation();
    const { machineService, setFormAndEvents, reviewTask } = useContext(ReviewTaskMachineContext);
    const permissions = useReviewTaskPermissions();
    const resetDialog = useResetDialog();

    /**
     * Handles user reassignment action
     * Triggers the state machine event to reassign the user
     */
    const handleReassignUser = useCallback(() => {
        machineService.send(ReviewTaskEvents.reAssignUser, {
            type: ReviewTaskEvents.reAssignUser,
            setFormAndEvents,
        });
    }, [machineService, setFormAndEvents]);

    /**
     * Initiates the reset process by opening the confirmation dialog
     */
    const handleResetClick = useCallback(() => {
        resetDialog.open();
    }, [resetDialog]);

    /**
     * Executes the actual reset operation
     * Makes API call and updates state machine
     */
    const executeReset = useCallback(async () => {
        if (!reviewTask?.data_hash) {
            throw new Error("No review task data hash available");
        }

        // Make API call to reset the task
        await ReviewTaskApi.resetToInitialState(
            reviewTask.data_hash,
            { reason: "Reset by administrator" },
            t
        );

        // Update state machine
        machineService.send(ReviewTaskEvents.reset);
    }, [reviewTask, machineService, t]);

    /**
     * Handles the reset confirmation
     * Uses the reset dialog's confirm method with our execute function
     */
    const handleConfirmReset = useCallback(() => {
        resetDialog.confirm(executeReset);
    }, [resetDialog, executeReset]);

    /**
     * Handles reset cancellation
     */
    const handleCancelReset = useCallback(() => {
        resetDialog.close();
    }, [resetDialog]);

    return {
        // Permissions
        permissions,
        
        // Action handlers
        handleReassignUser,
        handleResetClick,
        handleConfirmReset,
        handleCancelReset,
        
        // Dialog state
        resetDialog: {
            isOpen: resetDialog.isOpen,
            isLoading: resetDialog.isLoading,
            error: resetDialog.error,
            hasError: resetDialog.hasError,
        },
        
        // Localization
        t,
        
        // Computed values
        canReset: permissions.canReset,
        canReassign: permissions.canReassign,
        
        // Labels and messages
        labels: {
            resetTooltip: t("reviewTask:RESET_TOOLTIP"),
            resetDialogTitle: t("reviewTask:RESET_DIALOG_TITLE"),
            resetWarningMessage: t("reviewTask:RESET_WARNING_MESSAGE"),
            cancel: t("common:CANCEL"),
            confirmReset: t("reviewTask:CONFIRM_RESET"),
            resetting: t("reviewTask:RESETTING"),
        }
    };
};