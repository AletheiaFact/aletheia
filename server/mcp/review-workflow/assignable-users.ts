import { BadRequestException } from "@nestjs/common";
import { Roles } from "../../auth/ability/ability.factory";
import { idsEqual } from "./access";

/** The step a writer picks a user for. */
export type AssignmentStep = "crossCheck" | "review";

/**
 * Roles the web's user picker leaves out for each step
 * (src/components/Form/SelectOptions.tsx), so MCP offers the same people.
 */
export const EXCLUDED_ROLES: Record<AssignmentStep, Roles[]> = {
    crossCheck: [Roles.Regular],
    review: [Roles.Regular, Roles.FactChecker],
};

/** A picked user cannot take the step; nothing to do with the caller's account. */
export class AssignmentRefused extends BadRequestException {}

const STEP_NAME: Record<AssignmentStep, string> = {
    crossCheck: "cross-check",
    review: "review",
};

/**
 * Users already on the task who cannot take `step` (four-eyes): its
 * writers, and for review also its cross-checker.
 */
export function usersOnTask(task: any, step: AssignmentStep): unknown[] {
    const reviewData = task.machine?.context?.reviewData ?? {};
    return [
        ...(reviewData.usersId ?? []),
        ...(step === "review" && reviewData.crossCheckerId
            ? [reviewData.crossCheckerId]
            : []),
    ];
}

/**
 * Refuses a picked user who cannot take `step` on the task: no role in
 * the task's namespace, a role the web picker leaves out, or already on
 * the task. The refusal is about the pick, not the caller's account.
 */
export function assertAssignable(
    task: any,
    candidate: { _id: unknown; name?: string; role?: Record<string, string> },
    step: AssignmentStep
) {
    const who = candidate.name ?? String(candidate._id);
    const role = candidate.role?.[task.nameSpace];
    if (!role || EXCLUDED_ROLES[step].includes(role as Roles)) {
        throw new AssignmentRefused(
            `${who} cannot ${STEP_NAME[step]} in namespace "${
                task.nameSpace
            }" (role: ${role ?? "none"})`
        );
    }
    if (usersOnTask(task, step).some((id) => idsEqual(id, candidate._id))) {
        throw new AssignmentRefused(
            `${who} already works on this task and cannot also ${STEP_NAME[step]} it`
        );
    }
}
