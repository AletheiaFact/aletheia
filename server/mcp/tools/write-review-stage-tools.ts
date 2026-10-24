import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { jsonResult, safeTool } from "./tool-helpers";
import {
    AddReviewCommentSchema,
    NamespaceOnlySchema,
    RejectReviewTaskSchema,
    ReviewTaskByHashSchema,
} from "./schemas";
import {
    describeClaimContext,
    describeComment,
    describePublishedReview,
    describeTask,
} from "./review-task-view";
import {
    authorizeNamespaceWrite,
    authorizeStoredTask,
    describeWithLog,
} from "./write-review-helpers";
import { CLASSIFICATION_LABELS_NOTE as LABELS_NOTE } from "./classification-labels";
import type { McpToolDeps } from "../mcp.service";

/** The review stage: send, claim, reject, publish, plus task comments. */
export function registerWriteReviewStageTools(
    server: McpServer,
    deps: McpToolDeps
) {
    server.registerTool(
        "send_to_review",
        {
            description:
                "Send a reported task to the review backlog. Usually not needed: an agreeing submit_cross_check already does it. Needs a cross-check that agreed with the report's label (unless disabled in config). Assignees or admins only." +
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
                "Take the oldest task waiting in the review backlog and become its reviewer. Reviewers and admins only; never a task you wrote or cross-checked. Returns the task, the claim around the sentence and the full review form (no get_claim or get_review_log needed)" +
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
                    ? {
                          ...(await describeWithLog(deps, task)),
                          claim: await describeClaimContext(deps, task),
                      }
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
                "Publish a task in review: creates its fact-check (ClaimReview). Only the task's reviewer or an admin; classification, summary, report and sources must be filled, and the classification must be an option of the task's classification methodology. Returns the task and the published ClaimReview (stored HTML and footnoted sources), so no get_claim_review call is needed",
            inputSchema: ReviewTaskByHashSchema.shape as any,
        },
        safeTool("publish_review_task", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            const published =
                await deps.reviewWorkflowService.publishReviewTask(
                    deps.request.user as any,
                    task
                );
            return jsonResult({
                ...(await describeTask(deps, published)),
                claimReview: await describePublishedReview(deps, published),
            });
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
