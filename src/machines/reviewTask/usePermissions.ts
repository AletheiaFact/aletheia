import { useMemo, useContext } from "react";
import { useSelector } from "@xstate/react";
import { useAtom } from "jotai";
import { currentUserId, currentUserRole } from "../../atoms/currentUser";
import { Roles } from "../../types/enums";
import { ReviewTaskMachineContext } from "./ReviewTaskMachineProvider";
import { reviewDataSelector } from "./selectors";
import { resolvePermissions, PermissionContext, UserAssignments, PermissionInput } from "./permissions";

/**
 * Custom hook that provides centralized permission resolution for review tasks
 * This replaces the scattered permission logic across components
 */
export function useReviewTaskPermissions(): PermissionContext {
    const { machineService, events, reportModel } = useContext(ReviewTaskMachineContext);
    const [userId] = useAtom(currentUserId);
    const [role] = useAtom(currentUserRole);
    
    // Get current state and review data
    const currentState = useSelector(machineService, (state) => state.value as string);
    const reviewData = useSelector(machineService, reviewDataSelector);
    
    // Determine user assignments
    const userAssignments: UserAssignments = useMemo(() => {
        return {
            isAssignee: reviewData?.usersId?.includes(userId) || false,
            isReviewer: reviewData?.reviewerId === userId,
            isCrossChecker: reviewData?.crossCheckerId === userId,
            isAdmin: role === Roles.Admin || role === Roles.SuperAdmin
        };
    }, [userId, role, reviewData]);
    
    // Resolve permissions using centralized system
    const permissions = useMemo(() => {
        const input: PermissionInput = {
            state: currentState as any,
            userRole: role,
            userAssignments,
            reportModel,
            availableEvents: events || []
        };
        
        return resolvePermissions(input);
    }, [currentState, role, userAssignments, reportModel, events]);
    
    return permissions;
}

/**
 * Legacy compatibility hook for components that still need the old boolean flags
 * TODO: Gradually migrate components to use useReviewTaskPermissions directly
 */
export function useLegacyPermissions() {
    const permissions = useReviewTaskPermissions();
    
    return {
        // Editor permissions (legacy VisualEditorProvider compatibility)
        canShowEditor: permissions.canViewEditor,
        readonly: permissions.editorReadonly,
        
        // Form permissions (legacy DynamicReviewTaskForm compatibility)
        canSubmit: permissions.canSubmitActions.length > 0,
        allowedEvents: permissions.canSubmitActions,
        
        // UI flags
        showSaveDraft: permissions.showSaveDraftButton,
        showForm: permissions.showForm
    };
}