import { ReviewTaskStates, ReviewTaskEvents, ReportModelEnum } from "./enums";
import { Roles } from "../../types/enums";

export interface UserAssignments {
    isAssignee: boolean;
    isReviewer: boolean;
    isCrossChecker: boolean;
    isAdmin: boolean;
}

export interface PermissionContext {
    // State access
    canAccessState: boolean;

    // Editor permissions
    canViewEditor: boolean;
    canEditEditor: boolean;
    canSaveDraft: boolean;

    // Form permissions
    canSubmitActions: ReviewTaskEvents[];
    canSelectUsers: boolean;

    // UI control
    editorReadonly: boolean;
    showForm: boolean;
    showSaveDraftButton: boolean;
    formType: "editor" | "selection" | "comment" | "readonly" | "none";
}

export interface PermissionInput {
    state: ReviewTaskStates;
    userRole: Roles;
    isLoggedIn: boolean;
    userAssignments: UserAssignments;
    reportModel: ReportModelEnum;
    availableEvents: ReviewTaskEvents[];
}

// Read-only view permissions for non-assigned users
// They can see the editor content but cannot interact with the form
// showForm is true so the form component renders (displaying the read-only editor),
// but canSubmitActions is empty so no action buttons appear
const READONLY_VIEW_PERMISSIONS: PermissionContext = {
    canAccessState: true,
    canViewEditor: true,
    canEditEditor: false,
    canSaveDraft: false,
    canSubmitActions: [],
    canSelectUsers: false,
    editorReadonly: true,
    showForm: true,
    showSaveDraftButton: false,
    formType: "readonly",
};

/**
 * Centralized permission resolver
 * Single source of truth for all permission logic
 */
export function resolvePermissions(input: PermissionInput): PermissionContext {
    const {
        state,
        userRole,
        isLoggedIn,
        userAssignments,
        reportModel,
        availableEvents,
    } = input;
    const { isAssignee, isReviewer, isCrossChecker, isAdmin } = userAssignments;

    // Non-logged-in users can only see published reports
    if (!isLoggedIn && state !== ReviewTaskStates.published) {
        return {
            canAccessState: false,
            canViewEditor: false,
            canEditEditor: false,
            canSaveDraft: false,
            canSubmitActions: [],
            canSelectUsers: false,
            editorReadonly: true,
            showForm: false,
            showSaveDraftButton: false,
            formType: "none",
        };
    }

    // Base permissions - start with most restrictive
    let permissions: PermissionContext = {
        canAccessState: false,
        canViewEditor: false,
        canEditEditor: false,
        canSaveDraft: false,
        canSubmitActions: [],
        canSelectUsers: false,
        editorReadonly: true,
        showForm: false,
        showSaveDraftButton: false,
        formType: "none",
    };

    // State-specific permission logic
    switch (state) {
        case ReviewTaskStates.unassigned:
            permissions = resolveUnassignedPermissions(
                userRole,
                userAssignments,
                availableEvents
            );
            break;

        case ReviewTaskStates.assigned:
            permissions = resolveAssignedPermissions(
                userAssignments,
                availableEvents
            );
            break;

        case ReviewTaskStates.reported:
            permissions = resolveReportedPermissions(
                userAssignments,
                availableEvents
            );
            break;

        case ReviewTaskStates.selectReviewer:
            permissions = resolveSelectReviewerPermissions(
                userAssignments,
                availableEvents
            );
            break;

        case ReviewTaskStates.selectCrossChecker:
            permissions = resolveSelectCrossCheckerPermissions(
                userAssignments,
                availableEvents
            );
            break;

        case ReviewTaskStates.crossChecking:
            permissions = resolveCrossCheckingPermissions(
                userAssignments,
                availableEvents
            );
            break;

        case ReviewTaskStates.addCommentCrossChecking:
            permissions = resolveAddCommentCrossCheckingPermissions(
                userAssignments,
                availableEvents
            );
            break;

        case ReviewTaskStates.submitted:
            permissions = resolveSubmittedPermissions(
                userAssignments,
                availableEvents
            );
            break;

        case ReviewTaskStates.rejected:
            permissions = resolveRejectedPermissions(
                userAssignments,
                availableEvents
            );
            break;

        case ReviewTaskStates.published:
            permissions = resolvePublishedPermissions(
                userAssignments,
                availableEvents
            );
            break;

        default:
            // Keep default restrictive permissions
            break;
    }

    // Apply admin override (admins can access most things)
    if (isAdmin) {
        permissions = applyAdminOverride(permissions, state, availableEvents);
    }

    // Cross-validation: ensure consistent permission state
    permissions = validatePermissionConsistency(permissions);

    return permissions;
}

// State-specific permission resolvers
function resolveUnassignedPermissions(
    userRole: Roles,
    userAssignments: UserAssignments,
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    const { isAdmin } = userAssignments;
    const canAssign =
        isAdmin ||
        userRole === Roles.Reviewer ||
        userRole === Roles.FactChecker;

    if (canAssign) {
        return {
            canAccessState: true,
            canViewEditor: true,
            canEditEditor: false, // Should not edit content during assignment
            canSaveDraft: false,
            canSubmitActions: availableEvents,
            canSelectUsers: true,
            editorReadonly: true,
            showForm: true,
            showSaveDraftButton: false,
            formType: "selection",
        };
    }

    return READONLY_VIEW_PERMISSIONS;
}

function resolveAssignedPermissions(
    userAssignments: UserAssignments,
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    const { isAssignee, isAdmin } = userAssignments;

    if (isAdmin || isAssignee) {
        return {
            canAccessState: true,
            canViewEditor: true,
            canEditEditor: true,
            canSaveDraft: true,
            canSubmitActions: availableEvents,
            canSelectUsers: false,
            editorReadonly: false,
            showForm: true,
            showSaveDraftButton: true,
            formType: "editor",
        };
    }

    return READONLY_VIEW_PERMISSIONS;
}

function resolveReportedPermissions(
    userAssignments: UserAssignments,
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    const { isAssignee, isAdmin } = userAssignments;

    if (isAdmin || isAssignee) {
        return {
            canAccessState: true,
            canViewEditor: true,
            canEditEditor: true,
            canSaveDraft: true,
            canSubmitActions: availableEvents,
            canSelectUsers: false,
            editorReadonly: false,
            showForm: true,
            showSaveDraftButton: true,
            formType: "editor",
        };
    }

    return READONLY_VIEW_PERMISSIONS;
}

function resolveSelectReviewerPermissions(
    userAssignments: UserAssignments,
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    const { isAssignee, isAdmin } = userAssignments;

    if (isAdmin || isAssignee) {
        return {
            canAccessState: true,
            canViewEditor: true,
            canEditEditor: false, // Should not edit content while selecting reviewer
            canSaveDraft: false,
            canSubmitActions: availableEvents,
            canSelectUsers: true,
            editorReadonly: true,
            showForm: true,
            showSaveDraftButton: false,
            formType: "selection",
        };
    }

    return READONLY_VIEW_PERMISSIONS;
}

function resolveSelectCrossCheckerPermissions(
    userAssignments: UserAssignments,
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    const { isAssignee, isAdmin } = userAssignments;

    if (isAdmin || isAssignee) {
        return {
            canAccessState: true,
            canViewEditor: true,
            canEditEditor: false, // Should not edit content while selecting cross-checker
            canSaveDraft: false,
            canSubmitActions: availableEvents,
            canSelectUsers: true,
            editorReadonly: true,
            showForm: true,
            showSaveDraftButton: false,
            formType: "selection",
        };
    }

    return READONLY_VIEW_PERMISSIONS;
}

function resolveCrossCheckingPermissions(
    userAssignments: UserAssignments,
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    const { isCrossChecker, isAdmin } = userAssignments;

    if (isAdmin || isCrossChecker) {
        // Only admins can go back from cross-checking state
        const filteredEvents = isAdmin
            ? availableEvents
            : availableEvents.filter((e) => e !== ReviewTaskEvents.goback);

        return {
            canAccessState: true,
            canViewEditor: true,
            canEditEditor: false, // Cross-checkers should never edit the report content
            canSaveDraft: false,
            canSubmitActions: filteredEvents,
            canSelectUsers: false,
            editorReadonly: true,
            showForm: true,
            showSaveDraftButton: false,
            formType: "readonly",
        };
    }

    return READONLY_VIEW_PERMISSIONS;
}

function resolveAddCommentCrossCheckingPermissions(
    userAssignments: UserAssignments,
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    const { isCrossChecker, isAdmin } = userAssignments;

    if (isAdmin || isCrossChecker) {
        return {
            canAccessState: true,
            canViewEditor: true,
            canEditEditor: false,
            canSaveDraft: false,
            canSubmitActions: availableEvents,
            canSelectUsers: false,
            editorReadonly: true,
            showForm: true,
            showSaveDraftButton: false,
            formType: "comment",
        };
    }

    return READONLY_VIEW_PERMISSIONS;
}

function resolveSubmittedPermissions(
    userAssignments: UserAssignments,
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    const { isReviewer, isAdmin } = userAssignments;

    if (isAdmin || isReviewer) {
        // Only admins can go back from submitted state
        const filteredEvents = isAdmin
            ? availableEvents
            : availableEvents.filter((e) => e !== ReviewTaskEvents.goback);

        return {
            canAccessState: true,
            canViewEditor: true,
            canEditEditor: false, // Reviewers should not edit content, just review
            canSaveDraft: false,
            canSubmitActions: filteredEvents,
            canSelectUsers: false,
            editorReadonly: true,
            showForm: true,
            showSaveDraftButton: false,
            formType: "readonly",
        };
    }

    return READONLY_VIEW_PERMISSIONS;
}

function resolveRejectedPermissions(
    userAssignments: UserAssignments,
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    const { isReviewer, isAdmin } = userAssignments;

    if (isAdmin || isReviewer) {
        return {
            canAccessState: true,
            canViewEditor: true,
            canEditEditor: false,
            canSaveDraft: false,
            canSubmitActions: availableEvents,
            canSelectUsers: false,
            editorReadonly: true,
            showForm: true,
            showSaveDraftButton: false,
            formType: "comment",
        };
    }

    return READONLY_VIEW_PERMISSIONS;
}

function resolvePublishedPermissions(
    userAssignments: UserAssignments,
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    const { isAdmin } = userAssignments;

    return {
        canAccessState: true,
        canViewEditor: true,
        canEditEditor: false,
        canSaveDraft: false,
        canSubmitActions: isAdmin ? availableEvents : [],
        canSelectUsers: false,
        editorReadonly: true,
        showForm: isAdmin,
        showSaveDraftButton: false,
        formType: "readonly",
    };
}

function applyAdminOverride(
    permissions: PermissionContext,
    state: ReviewTaskStates,
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    // Admins can access most states and see content
    // But respect some restrictions (e.g., not editing during selection)
    const restrictedEditStates = [
        ReviewTaskStates.unassigned,
        ReviewTaskStates.selectReviewer,
        ReviewTaskStates.selectCrossChecker,
        ReviewTaskStates.published,
    ];

    return {
        ...permissions,
        canAccessState: true,
        canViewEditor: true,
        canEditEditor: !restrictedEditStates.includes(state),
        canSaveDraft: !restrictedEditStates.includes(state),
        canSubmitActions: availableEvents,
        canSelectUsers: true,
        showForm: true,
        showSaveDraftButton: !restrictedEditStates.includes(state),
        editorReadonly: restrictedEditStates.includes(state),
    };
}

function validatePermissionConsistency(
    permissions: PermissionContext
): PermissionContext {
    const result = { ...permissions };

    // Ensure logical consistency between permissions
    if (!result.canEditEditor) {
        result.canSaveDraft = false;
        result.showSaveDraftButton = false;
        result.editorReadonly = true;
    }

    if (!result.canViewEditor) {
        result.canEditEditor = false;
        result.canSaveDraft = false;
        result.showSaveDraftButton = false;
        result.editorReadonly = true;
    }

    if (!result.canAccessState) {
        result.canViewEditor = false;
        result.canEditEditor = false;
        result.canSaveDraft = false;
        result.canSubmitActions = [];
        result.canSelectUsers = false;
        result.showForm = false;
        result.showSaveDraftButton = false;
        result.formType = "none";
    }

    return result;
}
