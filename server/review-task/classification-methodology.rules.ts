import { BadRequestException, ForbiddenException } from "@nestjs/common";
import {
    DEFAULT_METHODOLOGY,
    MethodologyId,
    isAllowedClassification,
    isMethodologyId,
    resolveMethodologyId,
} from "../../lib/classification-methodology";

/**
 * Methodology for a task being created. The flag only gates choosing a
 * non-default methodology; aletheia is always allowed.
 */
export function resolveNewTaskMethodology(
    requested: string | undefined | null,
    enabled: boolean
): MethodologyId {
    if (requested === undefined || requested === null || requested === "") {
        return DEFAULT_METHODOLOGY;
    }
    if (!isMethodologyId(requested)) {
        throw new BadRequestException(
            `Unknown classification methodology "${requested}"`
        );
    }
    if (requested !== DEFAULT_METHODOLOGY && !enabled) {
        throw new BadRequestException(
            "Classification methodology selection is disabled"
        );
    }
    return requested;
}

/**
 * Rejects a classification the task's methodology does not offer. Empty
 * values are left to the existing required-field validation.
 */
export function assertAllowedClassification(
    methodology: string | undefined | null,
    classification: unknown,
    field: string
): void {
    if (
        classification === undefined ||
        classification === null ||
        classification === ""
    ) {
        return;
    }
    if (!isAllowedClassification(methodology, classification)) {
        // The value comes from the request body and may not be a string
        const shown =
            typeof classification === "string"
                ? classification
                : JSON.stringify(classification);
        throw new BadRequestException(
            `${field} "${shown}" is not an option of the "${resolveMethodologyId(
                methodology
            )}" methodology`
        );
    }
}

/**
 * Methodology an existing task moves to, or undefined when it keeps its
 * own. It can only change when the task is (re)assigned: anyone taking a
 * queued task, or an admin reassigning one already in progress. Any other
 * save keeps the stored methodology, whatever the request says.
 */
export function resolveMethodologySwitch({
    stored,
    requested,
    fromState,
    toState,
    isAdmin,
    enabled,
}: {
    stored: string | undefined | null;
    requested: string | undefined | null;
    fromState: string | undefined;
    toState: string | undefined;
    isAdmin: boolean;
    enabled: boolean;
}): MethodologyId | undefined {
    if (
        !requested ||
        toState !== "assigned" ||
        fromState === "published" ||
        requested === resolveMethodologyId(stored)
    ) {
        return undefined;
    }
    const next = resolveNewTaskMethodology(requested, enabled);
    if (next === resolveMethodologyId(stored)) {
        return undefined;
    }
    if (fromState !== "unassigned" && !isAdmin) {
        throw new ForbiddenException(
            "Only an admin can change the classification methodology when reassigning a task"
        );
    }
    return next;
}
