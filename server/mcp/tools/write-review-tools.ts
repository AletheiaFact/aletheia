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
    RejectReviewTaskSchema,
    ReleaseReviewTaskSchema,
    ReviewTaskByHashSchema,
    SaveReviewLogSchema,
    StartReviewTaskSchema,
    SubmitCrossCheckSchema,
} from "./schemas";
import {
    describeComment,
    describeTask,
    describeTaskBlind,
} from "./review-task-view";
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

/** The task view plus its review form, as the writer tools return it. */
async function describeWithLog(deps: McpToolDeps, task: any) {
    return {
        task: await describeTask(deps, task),
        reviewLog: deps.reviewWorkflowService.reviewLog(task),
    };
}

export function registerWriteReviewTools(server: McpServer, deps: McpToolDeps) {
    server.registerTool(
        "start_review_task",
        {
            description:
                "Claim a claim sentence for fact-checking: creates its review task already assigned to you",
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
                "Get the next fact-checking task: takes the oldest unassigned task in the queue and assigns it to you. Two callers never receive the same task. Refused while you still have a task being written",
            inputSchema: NamespaceOnlySchema.shape as any,
        },
        safeTool("next_review_task", async (args) => {
            await authorizeNamespaceWrite(deps, args.nameSpace);
            const task = await deps.reviewQueueService.nextReviewTask(
                deps.request.user as any,
                args.nameSpace
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
                "Join a task someone is already working on (assigned or reported) as an extra assignee. Joining twice is a no-op",
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
        "save_review_log",
        {
            description:
                "Save the review form of a task you are writing (partial saves allowed; only the fields you send change). summary = 'Resumo da conclusão', questions = guiding questions, report = 'Relatório da verificação' (paragraphs separated by \\n), verification = 'Como verificamos?', sources = links (quotedText must be copied exactly from its field), classification = label. Returns the saved form and `missing`: what submit_report still needs",
            inputSchema: SaveReviewLogSchema.shape as any,
        },
        safeTool("save_review_log", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            const { dataHash: _dataHash, ...input } = args;
            return jsonResult(
                await describeWithLog(
                    deps,
                    await deps.reviewWorkflowService.saveReviewLog(
                        deps.request.user as any,
                        task,
                        input
                    )
                )
            );
        })
    );

    server.registerTool(
        "submit_report",
        {
            description:
                "Finish the report of a task you are writing (assigned → reported). Refused, with the list of missing fields, unless classification, summary, sources and (except for not-fact) questions, report and verification are filled",
            inputSchema: ReviewTaskByHashSchema.shape as any,
        },
        safeTool("submit_report", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            return jsonResult(
                await describeTask(
                    deps,
                    await deps.reviewWorkflowService.submitReport(
                        deps.request.user as any,
                        task
                    )
                )
            );
        })
    );

    server.registerTool(
        "release_review_task",
        {
            description:
                "Give back a task you are writing: you leave it and, if nobody else is on it, it returns to the queue. The queue will not hand it to you again. Use for sentences that cannot be checked (bylines, fragments), duplicates, or checks that need a person",
            inputSchema: ReleaseReviewTaskSchema.shape as any,
        },
        safeTool("release_review_task", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            return jsonResult(
                await describeTask(
                    deps,
                    await deps.reviewWorkflowService.releaseTask(
                        deps.request.user as any,
                        task,
                        args.reason,
                        args.note
                    )
                )
            );
        })
    );

    server.registerTool(
        "send_to_cross_check",
        {
            description:
                "Send a reported task to the cross-check backlog, where another checker claims it with claim_cross_check. Assignees or admins only",
            inputSchema: ReviewTaskByHashSchema.shape as any,
        },
        safeTool("send_to_cross_check", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            return jsonResult(
                await describeTask(
                    deps,
                    await deps.reviewWorkflowService.sendToCrossCheck(
                        deps.request.user as any,
                        task
                    )
                )
            );
        })
    );

    server.registerTool(
        "claim_cross_check",
        {
            description:
                "Take the oldest task waiting for a cross-check and become its cross-checker. Never a task you wrote. The writer's label and summary are left out so you check independently first; read them afterwards with get_review_log",
            inputSchema: NamespaceOnlySchema.shape as any,
        },
        safeTool("claim_cross_check", async (args) => {
            await authorizeNamespaceWrite(deps, args.nameSpace);
            const task = await deps.reviewQueueService.claimCrossCheck(
                deps.request.user as any,
                args.nameSpace
            );
            return jsonResult(
                task
                    ? { task: await describeTaskBlind(deps, task) }
                    : {
                          task: null,
                          message: "No task waiting for a cross-check",
                      }
            );
        })
    );

    server.registerTool(
        "submit_cross_check",
        {
            description:
                "Submit your cross-check of a task where you are the cross-checker: your own label and a comment. Same label as the report → the task goes back to reported, ready for review; different label → it goes back to its writers to rework",
            inputSchema: SubmitCrossCheckSchema.shape as any,
        },
        safeTool("submit_cross_check", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            return jsonResult(
                await describeTask(
                    deps,
                    await deps.reviewWorkflowService.submitCrossCheck(
                        deps.request.user as any,
                        task,
                        args.classification,
                        args.comment
                    )
                )
            );
        })
    );

    server.registerTool(
        "send_to_review",
        {
            description:
                "Send a reported task to the review backlog. Needs a cross-check that agreed with the report's label (unless disabled in config). Assignees or admins only",
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
                "Take the oldest task waiting in the review backlog and become its reviewer. Reviewers and admins only; never a task you wrote or cross-checked",
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
        "reject_review_task",
        {
            description:
                "Send a task you are reviewing back to its writers with what must change. The task's reviewer or an admin only",
            inputSchema: RejectReviewTaskSchema.shape as any,
        },
        safeTool("reject_review_task", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            return jsonResult(
                await describeTask(
                    deps,
                    await deps.reviewWorkflowService.rejectReviewTask(
                        deps.request.user as any,
                        task,
                        args.rejectionComment
                    )
                )
            );
        })
    );

    server.registerTool(
        "publish_review_task",
        {
            description:
                "Publish a task in review: creates its fact-check (ClaimReview). Only the task's reviewer or an admin; classification, summary, report and sources must be filled",
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
            const task = await authorizeStoredTask(deps, args.dataHash);
            const { comment } = await deps.reviewTaskService.addComment(
                args.dataHash,
                {
                    comment: args.comment,
                    text: args.text,
                    user: deps.request.user._id,
                }
            );
            return jsonResult({
                task: await describeTask(
                    deps,
                    await deps.reviewTaskService.getReviewTaskByDataHash(
                        task.data_hash
                    )
                ),
                comment: describeComment(comment),
            });
        })
    );
}
