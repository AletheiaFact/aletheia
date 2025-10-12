import { atom } from "jotai";
import { Roles } from "../types/enums";

// Debug flags - set to true to override user data for testing
const DEBUG_MODE = false; // Set to false to disable all debug overrides

// Debug assignment types
export enum DebugAssignmentType {
    None = "none",
    Assignee = "assignee", 
    CrossChecker = "cross-checker",
    Reviewer = "reviewer"
}

// Debug state atoms (can be toggled at runtime)
const debugModeAtom = atom(false); // Start disabled
const debugOverrideRoleAtom = atom(false);
const debugRoleAtom = atom(Roles.FactChecker);
const debugAssignmentTypeAtom = atom(DebugAssignmentType.None);

// Base atoms
const baseUserLoggedIn = atom(false);
const baseUserRole = atom(Roles.Regular);
const baseUserId = atom("");
const baseAuthentication = atom("");

// Debug-aware derived atoms
const isUserLoggedIn = atom(
    (get) => {
        const debugMode = get(debugModeAtom);
        const assignmentType = get(debugAssignmentTypeAtom);
        
        if (DEBUG_MODE && debugMode && assignmentType !== DebugAssignmentType.None) {
            // Only force login when actually debugging assignments
            console.log('🛠️ [DEBUG] Forcing login for assignment debug');
            return true;
        }
        
        // When debug mode is on but assignment type is "None", use natural login state
        const naturalLoginState = get(baseUserLoggedIn);
        if (DEBUG_MODE && debugMode && assignmentType === DebugAssignmentType.None) {
            console.log('🛠️ [DEBUG] Using natural login state (no assignment override):', naturalLoginState);
        }
        
        return naturalLoginState;
    },
    (get, set, newValue) => {
        set(baseUserLoggedIn, newValue);
    }
);

const currentUserRole = atom(
    (get) => {
        if (DEBUG_MODE && get(debugModeAtom) && get(debugOverrideRoleAtom)) {
            const role = get(debugRoleAtom);
            console.log('🛠️ [DEBUG] Overriding user role to:', role);
            return role;
        }
        return get(baseUserRole);
    },
    (get, set, newValue) => {
        set(baseUserRole, newValue);
    }
);

const currentUserId = atom(
    (get) => {
        const debugMode = get(debugModeAtom);
        const assignmentType = get(debugAssignmentTypeAtom);
        
        if (DEBUG_MODE && debugMode && assignmentType !== DebugAssignmentType.None) {
            // Only provide debug user ID when actually debugging assignments
            const debugUserId = "debug-user-id-12345";
            console.log('🛠️ [DEBUG] Overriding user ID to:', debugUserId);
            return debugUserId;
        }
        
        // When debug mode is on but assignment type is "None", use natural user ID
        const naturalUserId = get(baseUserId);
        if (DEBUG_MODE && debugMode && assignmentType === DebugAssignmentType.None) {
            console.log('🛠️ [DEBUG] Using natural user ID (no assignment override):', naturalUserId);
        }
        
        return naturalUserId;
    },
    (get, set, newValue) => {
        set(baseUserId, newValue);
    }
);

const currentAuthentication = atom(
    (get) => get(baseAuthentication),
    (get, set, newValue) => {
        set(baseAuthentication, newValue);
    }
);

// Debug info atom (read-only)
const debugInfo = atom((get) => {
    if (!DEBUG_MODE || !get(debugModeAtom)) return null;
    
    return {
        DEBUG_MODE,
        DEBUG_ASSIGNMENT_TYPE: get(debugAssignmentTypeAtom),
        DEBUG_OVERRIDE_ROLE: get(debugOverrideRoleAtom),
        DEBUG_ROLE: get(debugRoleAtom),
        actualUserId: get(baseUserId),
        actualRole: get(baseUserRole),
        overriddenUserId: get(currentUserId),
        overriddenRole: get(currentUserRole),
    };
});

export {
    isUserLoggedIn,
    currentUserRole,
    currentUserId,
    currentAuthentication,
    debugInfo,
    // Debug control atoms
    debugModeAtom,
    debugOverrideRoleAtom,
    debugRoleAtom,
    debugAssignmentTypeAtom,
};
