import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { assertNamespaceAccess, jsonResult, safeTool } from "./tool-helpers";
import {
    GetClaimReviewSchema,
    GetReviewTaskSchema,
    ListReviewTasksSchema,
} from "./schemas";
import type { McpToolDeps } from "../mcp.service";

export function registerReadReviewTools(server: McpServer, deps: McpToolDeps) {
    // Registered with `.shape` (plain object schema) so tools/list advertises
    // claimReviewId/dataHash; the "at least one" rule is enforced here (I1).
    server.registerTool(
        "get_claim_review",
        {
            description: "Get a published fact-check review by id or data_hash",
            inputSchema: GetClaimReviewSchema.shape as any,
        },
        safeTool("get_claim_review", async (args: any) => {
            if (!args.claimReviewId && !args.dataHash) {
                throw new Error("Provide claimReviewId or dataHash");
            }
            const review = args.claimReviewId
                ? await deps.claimReviewService.getById(args.claimReviewId)
                : await deps.claimReviewService.getReviewByDataHash(
                      args.dataHash
                  );
            if (review) {
                await assertNamespaceAccess(
                    deps.nameSpaceService,
                    deps.request.user,
                    review.nameSpace
                );
            }
            return jsonResult(review);
        })
    );

    server.registerTool(
        "list_review_tasks",
        {
            description:
                "List fact-checking review tasks by workflow state (unassigned, assigned, reported, published)",
            inputSchema: ListReviewTasksSchema.shape as any,
        },
        safeTool("list_review_tasks", async (args) => {
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            return jsonResult(
                await deps.reviewTaskService.listAll({
                    value: args.value,
                    filterUser: {
                        assigned: false,
                        crossChecked: false,
                        reviewed: false,
                    },
                    nameSpace: args.nameSpace,
                    reviewTaskType: args.reviewTaskType,
                    page: args.page,
                    pageSize: args.pageSize,
                    order: args.order,
                })
            );
        })
    );

    server.registerTool(
        "get_review_task",
        {
            description: "Get a review task by id",
            inputSchema: GetReviewTaskSchema.shape as any,
        },
        safeTool("get_review_task", async (args) => {
            const task = await deps.reviewTaskService.getById(
                args.reviewTaskId
            );
            if (task) {
                await assertNamespaceAccess(
                    deps.nameSpaceService,
                    deps.request.user,
                    task.nameSpace
                );
            }
            return jsonResult(task);
        })
    );
}
