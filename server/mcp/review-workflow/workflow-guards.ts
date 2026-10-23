import { ConflictException, ForbiddenException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { isAdmin, isAssignee, toObjectId, WorkflowUser } from "./access";
import { stateName } from "./machine";

export const REVIEW_DATA = "machine.context.reviewData";

const DEFAULT_MAX_ASSIGNEES = 10;

export function assertWriter(user: WorkflowUser, task: any, action: string) {
    if (!isAssignee(task, user) && !isAdmin(user, task.nameSpace)) {
        throw new ForbiddenException(
            `Only an assignee of the task or an admin can ${action}`
        );
    }
}

export function assertAssigned(task: any, action: string) {
    const state = stateName(task.machine?.value);
    if (state !== "assigned") {
        throw new ConflictException(
            `Only tasks being written (assigned) can be ${action} (task is "${state}")`
        );
    }
}

/** Matches the task while it is being written by `user` (any assignee for admins). */
export function writerFilter(user: WorkflowUser, task: any) {
    return {
        _id: task._id,
        "machine.value.assigned": { $exists: true },
        ...(isAdmin(user, task.nameSpace)
            ? {}
            : { [`${REVIEW_DATA}.usersId`]: toObjectId(user._id) }),
    };
}

/** The `mcp.task_queue.*` switches the workflow reads. */
export class WorkflowConfig {
    constructor(private readonly configService?: ConfigService) {}

    requireCrossCheck(): boolean {
        return (
            this.configService?.get("mcp.task_queue.require_cross_check") !==
            false
        );
    }

    autoSendToReview(): boolean {
        return (
            this.configService?.get("mcp.task_queue.auto_send_to_review") !==
            false
        );
    }

    maxAssignees(): number {
        const configured = Number(
            this.configService?.get("mcp.task_queue.max_assignees")
        );
        return Number.isInteger(configured) && configured > 0
            ? configured
            : DEFAULT_MAX_ASSIGNEES;
    }
}
