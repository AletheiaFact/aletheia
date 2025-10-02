import { Grid, Toolbar } from "@mui/material";
import React from "react";
import AdminToolBarStyle from "./AdminToolBar.style";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import colors from "../../styles/colors";
import { AdminActionButtons } from "../molecules/AdminActionButtons";
import { ResetConfirmationDialog } from "../molecules/ResetConfirmationDialog";
import { useReviewTaskActions } from "../../hooks/useReviewTaskActions";

/**
 * ReviewTaskAdminToolBar - Refactored with Atomic Design
 * 
 * This component now follows atomic design principles:
 * - Single responsibility: Only handles layout and composition
 * - No business logic: All logic extracted to custom hooks
 * - Composition over inheritance: Uses molecules and atoms
 * - Clean, testable, and maintainable
 * 
 * Business logic is handled by:
 * - useReviewTaskActions: Action handlers and state management
 * - useReviewTaskPermissions: Permission validation
 * - useResetDialog: Dialog state management
 */
const ReviewTaskAdminToolBar = () => {
    const [nameSpace] = useAtom(currentNameSpace);
    
    // All business logic is now encapsulated in this single hook
    const {
        handleReassignUser,
        handleResetClick,
        handleConfirmReset,
        handleCancelReset,
        canReset,
        canReassign,
        resetDialog,
        labels
    } = useReviewTaskActions();

    return (
        <>
            {/* Toolbar Layout */}
            <Grid container justifyContent="center" style={{ background: colors.lightNeutral }}>
                <Grid item xs={11} lg={9}>
                    <AdminToolBarStyle
                        namespace={nameSpace}
                        position="static"
                        style={{ boxShadow: "none", background: colors.lightNeutral }}
                    >
                        <Toolbar className="toolbar">
                            <AdminActionButtons
                                onReassign={handleReassignUser}
                                onReset={handleResetClick}
                                canReset={canReset}
                                canReassign={canReassign}
                                resetTooltip={labels.resetTooltip}
                                isResetLoading={resetDialog.isLoading}
                            />
                        </Toolbar>
                    </AdminToolBarStyle>
                </Grid>
            </Grid>

            {/* Reset Confirmation Dialog */}
            <ResetConfirmationDialog
                open={resetDialog.isOpen}
                onClose={handleCancelReset}
                onConfirm={handleConfirmReset}
                isLoading={resetDialog.isLoading}
                error={resetDialog.error}
                title={labels.resetDialogTitle}
                warningMessage={labels.resetWarningMessage}
                cancelLabel={labels.cancel}
                confirmLabel={labels.confirmReset}
                loadingLabel={labels.resetting}
            />
        </>
    );
};

export default ReviewTaskAdminToolBar;
