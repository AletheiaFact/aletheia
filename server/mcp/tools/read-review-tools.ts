import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
    assertNamespaceAccess,
    assertUserSession,
    jsonResult,
    safeTool,
} from "./tool-helpers";
import {
    GetClaimReviewSchema,
    GetReviewTaskSchema,
    ListMyReviewTasksSchema,
    ListReviewTasksSchema,
    NamespaceOnlySchema,
} from "./schemas";
import { describeTask } from "./review-task-view";
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
            // "mine" filters match on the session user's _id, which M2M
            // tokens don't have.
            if (args.mine) assertUserSession(deps.request.user);
            return jsonResult(
                await deps.reviewTaskService.listAll({
                    value: args.value,
                    filterUser: {
                        assigned: args.mine === "assigned",
                        crossChecked: args.mine === "crossChecked",
                        reviewed: args.mine === "reviewed",
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
        "next_cross_checking",
        {
            description:
                "Get your oldest cross-checking task (where you are the cross-checker) and how many are waiting",
            inputSchema: NamespaceOnlySchema.shape as any,
        },
        safeTool("next_cross_checking", async (args) => {
            assertUserSession(deps.request.user);
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            const { task, waiting } =
                await deps.reviewWorkflowService.nextCrossChecking(
                    deps.request.user as any,
                    args.nameSpace
                );
            return jsonResult({
                task: await describeTask(deps, task),
                waiting,
            });
        })
    );

    server.registerTool(
        "list_my_review_tasks",
        {
            description:
                "List tasks in review (submitted) where you are the reviewer, oldest first: the reports you need to review to publish",
            inputSchema: ListMyReviewTasksSchema.shape as any,
        },
        safeTool("list_my_review_tasks", async (args) => {
            assertUserSession(deps.request.user);
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            const result = await deps.reviewWorkflowService.listMyReviewTasks(
                deps.request.user as any,
                args.nameSpace,
                args.page,
                args.pageSize
            );
            return jsonResult({
                ...result,
                tasks: await Promise.all(
                    result.tasks.map((task) => describeTask(deps, task))
                ),
            });
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
