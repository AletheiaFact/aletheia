import {
    assertCanWrite,
    assertNamespaceAccess,
    assertUserSession,
} from "./tool-helpers";
import { describeReviewLog, describeTask } from "./review-task-view";
import type { McpToolDeps } from "../mcp.service";
import { idsEqual } from "../review-workflow/access";
import { assertWriter } from "../review-workflow/workflow-guards";
import {
    AssignmentRefused,
    AssignmentStep,
    assertAssignable,
    EXCLUDED_ROLES,
    usersOnTask,
} from "../review-workflow/assignable-users";

const MAX_LISTED_USERS = 50;

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
        reviewLog: describeReviewLog(deps, task),
    };
}

/**
 * Who the writer can pick for `step` on the task: the web picker's search
 * (namespace members whose role it does not leave out), minus the users
 * already on the task. The task's writers or an admin only.
 */
export async function listAssignableUsers(
    deps: McpToolDeps,
    task: any,
    step: AssignmentStep,
    name?: string
) {
    assertWriter(deps.request.user as any, task, "list who can take it on");
    const found = await deps.usersService.findAll({
        searchName: name ?? "",
        filterOutRoles: EXCLUDED_ROLES[step],
        nameSpaceSlug: task.nameSpace,
        project: { _id: 1, name: 1, role: 1 },
    });
    const onTask = usersOnTask(task, step);
    const users = found
        .filter((user: any) => !onTask.some((id) => idsEqual(id, user._id)))
        .map((user: any) => ({
            id: String(user._id),
            name: user.name,
            role: user.role?.[task.nameSpace],
        }));
    return {
        users: users.slice(0, MAX_LISTED_USERS),
        total: users.length,
        ...(users.length > MAX_LISTED_USERS
            ? { note: "More users match; narrow the list with name" }
            : {}),
    };
}

/**
 * Loads the user picked for `step` and refuses one who cannot take it on
 * the task: unknown, outside the task's namespace, a role the web picker
 * leaves out, or already on the task.
 */
export async function assertPickedUser(
    deps: McpToolDeps,
    task: any,
    userId: string,
    step: AssignmentStep
) {
    // The writer check runs first, so a non-writer learns nothing about users
    assertWriter(deps.request.user as any, task, "pick who takes it on");
    const candidate: any = await deps.usersService
        .getById(userId)
        .catch(() => null);
    if (!candidate) {
        throw new AssignmentRefused(`No user with id ${userId}`);
    }
    try {
        await assertNamespaceAccess(
            deps.nameSpaceService,
            candidate,
            task.nameSpace
        );
    } catch {
        throw new AssignmentRefused(
            `${candidate.name} is not a member of namespace "${task.nameSpace}"`
        );
    }
    assertAssignable(task, candidate, step);
}
