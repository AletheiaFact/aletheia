import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
    assertCanWrite,
    assertNamespaceAccess,
    assertUserSession,
    jsonResult,
    safeTool,
} from "./tool-helpers";
import {
    AddReviewCommentSchema,
    NamespaceOnlySchema,
    NextReviewTaskSchema,
    ReviewTaskByHashSchema,
    StartReviewTaskSchema,
} from "./schemas";
import { describeTask } from "./review-task-view";
import { CLASSIFICATION_LABELS_NOTE as LABELS_NOTE } from "./classification-labels";
import type { McpToolDeps } from "../mcp.service";

/**
 * Loads the task by data_hash and authorizes the caller against the task's
 * stored namespace (never a caller-supplied one).
 */
async function authorizeStoredTask(deps: McpToolDeps, dataHash: string) {
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

async function authorizeNamespaceWrite(deps: McpToolDeps, nameSpace: string) {
    assertUserSession(deps.request.user);
    await assertNamespaceAccess(
        deps.nameSpaceService,
        deps.request.user,
        nameSpace
    );
    assertCanWrite(deps.abilityFactory, deps.request.user, nameSpace);
}

export function registerWriteReviewTools(server: McpServer, deps: McpToolDeps) {
    server.registerTool(
        "start_review_task",
        {
            description:
                "Claim a claim sentence for fact-checking: creates its review task already assigned to you (or takes its queued task). The task gets the requested classification methodology (default aletheia), fixed from then on; a task that already has another one is refused.",
            inputSchema: StartReviewTaskSchema.shape as any,
        },
        safeTool("start_review_task", async (args) => {
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            assertCanWrite(
                deps.abilityFactory,
                deps.request.user,
                args.nameSpace
            );
            assertUserSession(deps.request.user);
            return jsonResult(
                await deps.reviewWorkflowService.startReviewTask(
                    deps.request.user as { _id: string },
                    args
                )
            );
        })
    );

    server.registerTool(
        "next_review_task",
        {
            description:
                "Get the next fact-checking task: takes the oldest unassigned task in the queue and assigns it to you. Two callers never receive the same task. The task gets the requested classification methodology (default aletheia), fixed from then on; only tasks without one, or with the same one, are handed out." +
                LABELS_NOTE,
            inputSchema: NextReviewTaskSchema.shape as any,
        },
        safeTool("next_review_task", async (args) => {
            await authorizeNamespaceWrite(deps, args.nameSpace);
            // Default, flag and id check, as for a task created on the web
            const methodology =
                deps.reviewTaskService.resolveMethodologyForNewTask(
                    args.classificationMethodology
                );
            const task = await deps.reviewQueueService.nextReviewTask(
                deps.request.user as any,
                args.nameSpace,
                methodology
            );
            return jsonResult(
                task
                    ? { task: await describeTask(deps, task) }
                    : { task: null, message: "No task available in the queue" }
            );
        })
    );

    server.registerTool(
        "join_review_task",
        {
            description:
                "Join a task someone is already working on (assigned or reported) as an extra assignee. Joining twice is a no-op." +
                LABELS_NOTE,
            inputSchema: ReviewTaskByHashSchema.shape as any,
        },
        safeTool("join_review_task", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            return jsonResult(
                await describeTask(
                    deps,
                    await deps.reviewWorkflowService.joinReviewTask(
                        deps.request.user as any,
                        task
                    )
                )
            );
        })
    );

    server.registerTool(
        "send_to_review",
        {
            description:
                "Send a reported task to the review backlog (skips cross-checking). Assignees or admins only." +
                LABELS_NOTE,
            inputSchema: ReviewTaskByHashSchema.shape as any,
        },
        safeTool("send_to_review", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            return jsonResult(
                await describeTask(
                    deps,
                    await deps.reviewWorkflowService.sendToReview(
                        deps.request.user as any,
                        task
                    )
                )
            );
        })
    );

    server.registerTool(
        "claim_review_task",
        {
            description:
                "Take the oldest task waiting in the review backlog and become its reviewer. Reviewers and admins only; never a task you wrote." +
                LABELS_NOTE,
            inputSchema: NamespaceOnlySchema.shape as any,
        },
        safeTool("claim_review_task", async (args) => {
            await authorizeNamespaceWrite(deps, args.nameSpace);
            const task = await deps.reviewQueueService.claimReviewTask(
                deps.request.user as any,
                args.nameSpace
            );
            return jsonResult(
                task
                    ? { task: await describeTask(deps, task) }
                    : {
                          task: null,
                          message: "No task waiting for a reviewer",
                      }
            );
        })
    );

    server.registerTool(
        "publish_review_task",
        {
            description:
                "Publish a task in review: creates its fact-check (ClaimReview). Only the task's reviewer or an admin; classification, summary, report and sources must be filled, and the classification must be an option of the task's classification methodology." +
                LABELS_NOTE,
            inputSchema: ReviewTaskByHashSchema.shape as any,
        },
        safeTool("publish_review_task", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            return jsonResult(
                await describeTask(
                    deps,
                    await deps.reviewWorkflowService.publishReviewTask(
                        deps.request.user as any,
                        task
                    )
                )
            );
        })
    );

    server.registerTool(
        "add_review_comment",
        {
            description: "Add a comment to a review task (by data_hash)",
            inputSchema: AddReviewCommentSchema.shape as any,
        },
        safeTool("add_review_comment", async (args) => {
            assertUserSession(deps.request.user);
            const task = await deps.reviewTaskService.getReviewTaskByDataHash(
                args.dataHash
            );
            if (!task) {
                throw new Error(
                    `Review task not found for data_hash ${args.dataHash}`
                );
            }
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                task.nameSpace
            );
            assertCanWrite(
                deps.abilityFactory,
                deps.request.user,
                task.nameSpace
            );
            return jsonResult(
                await deps.reviewTaskService.addComment(args.dataHash, {
                    comment: args.comment,
                    text: args.text,
                    user: deps.request.user._id,
                })
            );
        })
    );
}
