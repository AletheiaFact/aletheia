import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { jsonResult, safeTool } from "./tool-helpers";
import {
    NamespaceOnlySchema,
    SendToCrossCheckSchema,
    SubmitCrossCheckSchema,
} from "./schemas";
import {
    describeClaimContext,
    describeTask,
    describeTaskBlind,
} from "./review-task-view";
import {
    assertPickedUser,
    authorizeNamespaceWrite,
    authorizeStoredTask,
} from "./write-review-helpers";
import type { McpToolDeps } from "../mcp.service";
import { CLASSIFICATION_LABELS_NOTE as LABELS_NOTE } from "./classification-labels";

/** The cross-check stage: send, claim, submit. */
export function registerWriteReviewCrossCheckTools(
    server: McpServer,
    deps: McpToolDeps
) {
    server.registerTool(
        "send_to_cross_check",
        {
            description:
                "Send a reported task to cross-checking. With crossCheckerId (from list_assignable_users, for: crossCheck) that user becomes its cross-checker right away (state cross-checking), as picking one on the web does; use it when the user names who cross-checks. Without it the task goes to the cross-check backlog, where another checker claims it with claim_cross_check. Also moves a task waiting in either backlog that nobody took yet. A task already where the call would put it is returned unchanged. Any assignee of the task (fact-checkers included) or an admin." +
                LABELS_NOTE,
            inputSchema: SendToCrossCheckSchema.shape as any,
        },
        safeTool("send_to_cross_check", async (args) => {
            const task = await authorizeStoredTask(deps, args.dataHash);
            if (args.crossCheckerId) {
                await assertPickedUser(
                    deps,
                    task,
                    args.crossCheckerId,
                    "crossCheck"
                );
            }
            return jsonResult(
                await describeTask(
                    deps,
                    await deps.reviewWorkflowService.sendToCrossCheck(
                        deps.request.user as any,
                        task,
                        args.crossCheckerId
                    )
                )
            );
        })
    );

    server.registerTool(
        "claim_cross_check",
        {
            description:
                "Take the oldest task waiting for a cross-check and become its cross-checker. Never a task you wrote. Returns the claim around the sentence (no get_claim needed). The writer's label and summary are left out so you check independently first; read them afterwards with get_review_log. The task's classificationMethodology is included: your label must be one of its options." +
                LABELS_NOTE,
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
                    ? {
                          task: await describeTaskBlind(deps, task),
                          claim: await describeClaimContext(deps, task),
                      }
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
                "Submit your cross-check of a task where you are the cross-checker: your own label and a comment. Same label as the report → the task goes straight to the review backlog (selectReviewer; no send_to_review needed unless disabled in config); different label → it goes back to its writers to rework. Your label must be an option of the task's classification methodology." +
                LABELS_NOTE,
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
}
