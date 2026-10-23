import { Types } from "mongoose";
import { Roles } from "../../auth/ability/ability.factory";

/** The authenticated MCP user, as McpAuthGuard puts it on the request. */
export interface WorkflowUser {
    _id: string;
    role?: Record<string, string>;
}

export const toObjectId = (id: string) => new Types.ObjectId(id);

export const idsEqual = (a: unknown, b: unknown) =>
    !!a && !!b && a.toString() === b.toString();

export function isAdmin(user: WorkflowUser, nameSpace: string) {
    const role = user.role?.[nameSpace];
    return role === Roles.Admin || role === Roles.SuperAdmin;
}

export function isReviewerOrAdmin(user: WorkflowUser, nameSpace: string) {
    return (
        user.role?.[nameSpace] === Roles.Reviewer || isAdmin(user, nameSpace)
    );
}

export function isAssignee(task: any, user: WorkflowUser) {
    const assignees = task.machine?.context?.reviewData?.usersId ?? [];
    return assignees.some((id: unknown) => idsEqual(id, user._id));
}
