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
    formType: 'editor' | 'selection' | 'comment' | 'readonly' | 'none';
}

export interface PermissionInput {
    state: ReviewTaskStates;
    userRole: Roles;
    userAssignments: UserAssignments;
    reportModel: ReportModelEnum;
    availableEvents: ReviewTaskEvents[];
}

/**
 * Centralized permission resolver
 * Single source of truth for all permission logic
 */
export function resolvePermissions(input: PermissionInput): PermissionContext {
    const { state, userRole, userAssignments, reportModel, availableEvents } = input;
    const { isAssignee, isReviewer, isCrossChecker, isAdmin } = userAssignments;
    
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
        formType: 'none'
    };
    
    // State-specific permission logic
    switch (state) {
        case ReviewTaskStates.unassigned:
            permissions = resolveUnassignedPermissions(userRole, userAssignments, availableEvents);
            break;
            
        case ReviewTaskStates.assigned:
            permissions = resolveAssignedPermissions(userRole, userAssignments, availableEvents);
            break;
            
        case ReviewTaskStates.reported:
            permissions = resolveReportedPermissions(userRole, userAssignments, availableEvents);
            break;
            
        case ReviewTaskStates.selectReviewer:
            permissions = resolveSelectReviewerPermissions(userRole, userAssignments, availableEvents);
            break;
            
        case ReviewTaskStates.selectCrossChecker:
            permissions = resolveSelectCrossCheckerPermissions(userRole, userAssignments, availableEvents);
            break;
            
        case ReviewTaskStates.crossChecking:
            permissions = resolveCrossCheckingPermissions(userRole, userAssignments, availableEvents);
            break;
            
        case ReviewTaskStates.addCommentCrossChecking:
            permissions = resolveAddCommentCrossCheckingPermissions(userRole, userAssignments, availableEvents);
            break;
            
        case ReviewTaskStates.submitted:
            permissions = resolveSubmittedPermissions(userRole, userAssignments, availableEvents);
            break;
            
        case ReviewTaskStates.rejected:
            permissions = resolveRejectedPermissions(userRole, userAssignments, availableEvents);
            break;
            
        case ReviewTaskStates.published:
            permissions = resolvePublishedPermissions(userRole, userAssignments, availableEvents);
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
    
    if (isAdmin) {
        return {
            canAccessState: true,
            canViewEditor: true,
            canEditEditor: false, // Admin can see content but shouldn't edit during assignment
            canSaveDraft: false,
            canSubmitActions: availableEvents,
            canSelectUsers: true,
            editorReadonly: true,
            showForm: true,
            showSaveDraftButton: false,
            formType: 'selection'
        };
    }
    
    // Non-admins cannot access unassigned state
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
        formType: 'none'
    };
}

function resolveAssignedPermissions(
    userRole: Roles, 
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
            formType: 'editor'
        };
    }
    
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
        formType: 'none'
    };
}

function resolveReportedPermissions(
    userRole: Roles, 
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
            formType: 'editor'
        };
    }
    
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
        formType: 'none'
    };
}

function resolveSelectReviewerPermissions(
    userRole: Roles, 
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
            formType: 'selection'
        };
    }
    
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
        formType: 'none'
    };
}

function resolveSelectCrossCheckerPermissions(
    userRole: Roles, 
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
            formType: 'selection'
        };
    }
    
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
        formType: 'none'
    };
}

function resolveCrossCheckingPermissions(
    userRole: Roles, 
    userAssignments: UserAssignments, 
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    const { isCrossChecker, isAdmin } = userAssignments;
    
    if (isAdmin || isCrossChecker) {
        return {
            canAccessState: true,
            canViewEditor: true,
            canEditEditor: false, // Cross-checkers should never edit the report content
            canSaveDraft: false,
            canSubmitActions: availableEvents,
            canSelectUsers: false,
            editorReadonly: true,
            showForm: true,
            showSaveDraftButton: false,
            formType: 'readonly'
        };
    }
    
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
        formType: 'none'
    };
}

function resolveAddCommentCrossCheckingPermissions(
    userRole: Roles, 
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
            formType: 'comment'
        };
    }
    
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
        formType: 'none'
    };
}

function resolveSubmittedPermissions(
    userRole: Roles, 
    userAssignments: UserAssignments, 
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    const { isReviewer, isAdmin } = userAssignments;
    
    if (isAdmin || isReviewer) {
        return {
            canAccessState: true,
            canViewEditor: true,
            canEditEditor: false, // Reviewers should not edit content, just review
            canSaveDraft: false,
            canSubmitActions: availableEvents,
            canSelectUsers: false,
            editorReadonly: true,
            showForm: true,
            showSaveDraftButton: false,
            formType: 'readonly'
        };
    }
    
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
        formType: 'none'
    };
}

function resolveRejectedPermissions(
    userRole: Roles, 
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
            formType: 'comment'
        };
    }
    
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
        formType: 'none'
    };
}

function resolvePublishedPermissions(
    userRole: Roles, 
    userAssignments: UserAssignments, 
    availableEvents: ReviewTaskEvents[]
): PermissionContext {
    const { isAdmin } = userAssignments;
    
    // Published content is readonly for everyone, but visible to most
    const canView = isAdmin || userRole !== Roles.Regular;
    
    return {
        canAccessState: canView,
        canViewEditor: canView,
        canEditEditor: false,
        canSaveDraft: false,
        canSubmitActions: isAdmin ? availableEvents : [],
        canSelectUsers: false,
        editorReadonly: true,
        showForm: canView,
        showSaveDraftButton: false,
        formType: 'readonly'
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
        ReviewTaskStates.selectReviewer,
        ReviewTaskStates.selectCrossChecker,
        ReviewTaskStates.published
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
        editorReadonly: restrictedEditStates.includes(state)
    };
}

function validatePermissionConsistency(permissions: PermissionContext): PermissionContext {
    // Ensure logical consistency between permissions
    if (!permissions.canEditEditor) {
        permissions.canSaveDraft = false;
        permissions.showSaveDraftButton = false;
        permissions.editorReadonly = true;
    }
    
    if (!permissions.canViewEditor) {
        permissions.canEditEditor = false;
        permissions.canSaveDraft = false;
        permissions.showSaveDraftButton = false;
        permissions.editorReadonly = true;
    }
    
    if (!permissions.canAccessState) {
        permissions.canViewEditor = false;
        permissions.canEditEditor = false;
        permissions.canSaveDraft = false;
        permissions.canSubmitActions = [];
        permissions.canSelectUsers = false;
        permissions.showForm = false;
        permissions.showSaveDraftButton = false;
        permissions.formType = 'none';
    }
    
    return permissions;
}