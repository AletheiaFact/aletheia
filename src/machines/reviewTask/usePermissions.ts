import { useMemo, useContext } from "react";
import { useSelector } from "@xstate/react";
import { useAtom } from "jotai";
import {
    currentUserId,
    currentUserRole,
    isUserLoggedIn,
} from "../../atoms/currentUser";
import { Roles } from "../../types/enums";
import { ReviewTaskMachineContext } from "./ReviewTaskMachineProvider";
import { currentStateSelector, reviewDataSelector } from "./selectors";
import {
    resolvePermissions,
    PermissionContext,
    UserAssignments,
    PermissionInput,
} from "./permissions";
import { ReviewTaskStates, ReportModelEnum } from "./enums";

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
    const [loggedIn] = useAtom(isUserLoggedIn);

    // Get current state and review data (flatten compound sub-states)
    const currentState = useSelector(machineService, currentStateSelector);
    const reviewData = useSelector(machineService, reviewDataSelector);

    // Determine user assignments
    const userAssignments: UserAssignments = useMemo(() => {
        const uid = userId?.toString();
        return {
            isAssignee:
                reviewData?.usersId?.some((id) => id?.toString() === uid) ||
                false,
            isReviewer: reviewData?.reviewerId?.toString() === uid,
            isCrossChecker: reviewData?.crossCheckerId?.toString() === uid,
            isAdmin: role === Roles.Admin || role === Roles.SuperAdmin,
        };
    }, [userId, role, reviewData]);

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
            userRole: role,
            isLoggedIn: loggedIn,
            userAssignments,
            reportModel: reportModel as ReportModelEnum,
            availableEvents: events || [],
        };

        return resolvePermissions(input);
    }, [validState, role, loggedIn, userAssignments, reportModel, events]);

    return {
        ...permissions,
        ...userAssignments,
    };
}
