import { useMemo } from "react";
import { useAtom } from "jotai";
import { useSelector } from "@xstate/react";
import { currentUserId, currentUserRole } from "../atoms/currentUser";
import { ReviewTaskMachineContext } from "../machines/reviewTask/ReviewTaskMachineProvider";
import { reviewDataSelector } from "../machines/reviewTask/selectors";
import { Roles } from "../types/enums";
import { useContext } from "react";

/**
 * Custom hook for managing review task permissions
 * 
 * Encapsulates the business logic for determining what actions
 * a user can perform on review tasks based on their role and assignment.
 * 
 * Business Rules:
 * - Admins and SuperAdmins can perform all actions on any task
 * - FactCheckers and Reviewers can only perform actions on assigned tasks
 * - Regular users have limited permissions
 */
export const useReviewTaskPermissions = () => {
    const [role] = useAtom(currentUserRole);
    const [userId] = useAtom(currentUserId);
    const { machineService } = useContext(ReviewTaskMachineContext);
    const reviewData = useSelector(machineService, reviewDataSelector);

    const permissions = useMemo(() => {
        // Check if user is admin/super-admin
        const isAdmin = role === Roles.Admin || role === Roles.SuperAdmin;
        
        // Check if user is assigned to the current task
        const isAssignedUser = reviewData?.usersId?.includes(userId);
        
        // Check if user is a fact-checker or reviewer
        const isFactChecker = role === Roles.FactChecker;
        const isReviewer = role === Roles.Reviewer;
        
        return {
            // Reset permissions: Admin can reset any task, others only assigned tasks
            canReset: isAdmin || (isAssignedUser && (isFactChecker || isReviewer)),
            
            // Reassign permissions: Generally admin-only action
            canReassign: isAdmin,
            
            // Edit permissions: Admin or assigned users
            canEdit: isAdmin || isAssignedUser,
            
            // View permissions: Most users can view
            canView: true,
            
            // Meta information
            isAdmin,
            isAssignedUser,
            isFactChecker,
            isReviewer,
            userRole: role,
            userId
        };
    }, [role, reviewData, userId]);

    return permissions;
};