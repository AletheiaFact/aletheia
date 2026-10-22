import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
    assertCanWrite,
    assertNamespaceAccess,
    assertUserSession,
    jsonResult,
    safeTool,
} from "./tool-helpers";
import { AddReviewCommentSchema, StartReviewTaskSchema } from "./schemas";
import type { McpToolDeps } from "../mcp.service";

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
