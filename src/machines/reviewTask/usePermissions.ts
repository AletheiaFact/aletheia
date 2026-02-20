import { useMemo, useContext } from "react";
import { useSelector } from "@xstate/react";
import { useAtom } from "jotai";
import {
    currentUserId,
    currentUserRole,
    debugInfo,
    DebugAssignmentType,
} from "../../atoms/currentUser";
import { Roles } from "../../types/enums";
import { ReviewTaskMachineContext } from "./ReviewTaskMachineProvider";
import { reviewDataSelector } from "./selectors";
import {
    resolvePermissions,
    PermissionContext,
    UserAssignments,
    PermissionInput,
} from "./permissions";
import { ReviewTaskStates } from "./enums";

export type ReviewTaskPermissionsResult = PermissionContext & UserAssignments;

/**
 * Custom hook that provides centralized permission resolution for review tasks.
 * Returns both the resolved permissions and the user assignments.
 * This replaces scattered permission logic across components.
 */
export function useReviewTaskPermissions(): ReviewTaskPermissionsResult {
    const { machineService, events, reportModel } = useContext(
        ReviewTaskMachineContext
    );
    const [userId] = useAtom(currentUserId);
    const [role] = useAtom(currentUserRole);
    const [debug] = useAtom(debugInfo);

    // Get current state and review data (flatten compound sub-states)
    const currentState = useSelector(
        machineService,
        (state: { value: string | Record<string, unknown> }) => {
            const value = state.value;
            return typeof value === "string" ? value : Object.keys(value)[0];
        }
    );
    const reviewData = useSelector(machineService, reviewDataSelector);

    // Determine user assignments
    const userAssignments: UserAssignments = useMemo(() => {
        const baseAssignments = {
            isAssignee: reviewData?.usersId?.includes(userId) || false,
            isReviewer: reviewData?.reviewerId === userId,
            isCrossChecker: reviewData?.crossCheckerId === userId,
            isAdmin: role === Roles.Admin || role === Roles.SuperAdmin,
        };

        // Apply debug overrides if enabled
        if (
            debug?.DEBUG_ASSIGNMENT_TYPE &&
            debug.DEBUG_ASSIGNMENT_TYPE !== DebugAssignmentType.None
        ) {
            return {
                ...baseAssignments,
                isAssignee:
                    debug.DEBUG_ASSIGNMENT_TYPE ===
                    DebugAssignmentType.Assignee,
                isReviewer:
                    debug.DEBUG_ASSIGNMENT_TYPE ===
                    DebugAssignmentType.Reviewer,
                isCrossChecker:
                    debug.DEBUG_ASSIGNMENT_TYPE ===
                    DebugAssignmentType.CrossChecker,
            };
        }

        return baseAssignments;
    }, [userId, role, reviewData, debug]);

    // Apply debug role override if enabled
    const effectiveRole = debug?.DEBUG_ROLE || role;

    // Validate state against ReviewTaskStates enum for type safety
    const validState = Object.values(ReviewTaskStates).includes(
        currentState as ReviewTaskStates
    )
        ? (currentState as ReviewTaskStates)
        : ReviewTaskStates.unassigned;

    // Resolve permissions using centralized system
    const permissions = useMemo(() => {
        const input: PermissionInput = {
            state: validState,
            userRole: effectiveRole,
            userAssignments,
            reportModel,
            availableEvents: events || [],
        };

        return resolvePermissions(input);
    }, [validState, effectiveRole, userAssignments, reportModel, events]);

    return {
        ...permissions,
        ...userAssignments,
    };
}
