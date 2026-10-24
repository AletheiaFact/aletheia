import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { jsonResult, safeTool } from "./tool-helpers";
import {
    NamespaceOnlySchema,
    ReviewTaskByHashSchema,
    SubmitCrossCheckSchema,
} from "./schemas";
import {
    describeClaimContext,
    describeTask,
    describeTaskBlind,
} from "./review-task-view";
import {
    authorizeNamespaceWrite,
    authorizeStoredTask,
} from "./write-review-helpers";
import type { McpToolDeps } from "../mcp.service";

/** The cross-check stage: send, claim, submit. */
export function registerWriteReviewCrossCheckTools(
    server: McpServer,
    deps: McpToolDeps
) {
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
                "Take the oldest task waiting for a cross-check and become its cross-checker. Never a task you wrote. Returns the claim around the sentence (no get_claim needed). The writer's label and summary are left out so you check independently first; read them afterwards with get_review_log",
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
                "Submit your cross-check of a task where you are the cross-checker: your own label and a comment. Same label as the report → the task goes straight to the review backlog (selectReviewer; no send_to_review needed unless disabled in config); different label → it goes back to its writers to rework",
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
