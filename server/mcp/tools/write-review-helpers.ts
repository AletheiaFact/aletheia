import {
    assertCanWrite,
    assertNamespaceAccess,
    assertUserSession,
} from "./tool-helpers";
import { describeTask } from "./review-task-view";
import type { McpToolDeps } from "../mcp.service";

/**
 * Loads the task by data_hash and authorizes the caller against the task's
 * stored namespace (never a caller-supplied one).
 */
export async function authorizeStoredTask(deps: McpToolDeps, dataHash: string) {
    assertUserSession(deps.request.user);
    const task = await deps.reviewTaskService.getReviewTaskByDataHash(dataHash);
    if (!task) {
        throw new Error(`Review task not found for data_hash ${dataHash}`);
    }
    await assertNamespaceAccess(
        deps.nameSpaceService,
        deps.request.user,
        task.nameSpace
    );
    assertCanWrite(deps.abilityFactory, deps.request.user, task.nameSpace);
    return task;
}

export async function authorizeNamespaceWrite(
    deps: McpToolDeps,
    nameSpace: string
) {
    assertUserSession(deps.request.user);
    await assertNamespaceAccess(
        deps.nameSpaceService,
        deps.request.user,
        nameSpace
    );
    assertCanWrite(deps.abilityFactory, deps.request.user, nameSpace);
}

/** The task view plus its review form, as the writer tools return it. */
export async function describeWithLog(deps: McpToolDeps, task: any) {
    return {
        task: await describeTask(deps, task),
        reviewLog: deps.reviewWorkflowService.reviewLog(task),
    };
}
