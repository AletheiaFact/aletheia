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
    ListClassificationMethodologiesSchema,
    ListMyReviewTasksSchema,
    ListReviewTasksSchema,
    NamespaceOnlySchema,
    ReviewTaskByHashSchema,
} from "./schemas";
import {
    describeReviewLog,
    describeTask,
    describeTaskBlind,
} from "./review-task-view";
import type { McpToolDeps } from "../mcp.service";
import {
    DEFAULT_METHODOLOGY,
    METHODOLOGY_IDS,
    classificationMethodologies,
} from "../../../lib/classification-methodology";
import {
    CLASSIFICATION_LABELS_NOTE as LABELS_NOTE,
    withClassificationLabels,
} from "./classification-labels";

export function registerReadReviewTools(server: McpServer, deps: McpToolDeps) {
    // Registered with `.shape` (plain object schema) so tools/list advertises
    // claimReviewId/dataHash; the "at least one" rule is enforced here (I1).
    server.registerTool(
        "get_claim_review",
        {
            description:
                "Get a published fact-check review by id or data_hash." +
                LABELS_NOTE,
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
            return jsonResult(withClassificationLabels(review));
        })
    );

    server.registerTool(
        "list_review_tasks",
        {
            description:
                "List fact-checking review tasks by workflow state (unassigned, assigned, reported, published)." +
                LABELS_NOTE,
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
                withClassificationLabels(
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
                )
            );
        })
    );

    server.registerTool(
        "next_cross_checking",
        {
            description:
                "Get your oldest cross-checking task (where you are the cross-checker) and how many are waiting." +
                LABELS_NOTE,
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
                await deps.reviewQueueService.nextCrossChecking(
                    deps.request.user as any,
                    args.nameSpace
                );
            return jsonResult({
                task: await describeTaskBlind(deps, task),
                waiting,
            });
        })
    );

    server.registerTool(
        "list_my_review_tasks",
        {
            description:
                "List tasks in review (submitted) where you are the reviewer, oldest first: the reports you need to review to publish." +
                LABELS_NOTE,
            inputSchema: ListMyReviewTasksSchema.shape as any,
        },
        safeTool("list_my_review_tasks", async (args) => {
            assertUserSession(deps.request.user);
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            const result = await deps.reviewQueueService.listMyReviewTasks(
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
        "get_review_log",
        {
            description:
                "Get a task's review form in plain text (summary, questions, report, verification, sources, classification), what submit_report still needs (`missing`), and why the task came back if it did (crossCheck, rejectionComment). The form carries the task's classificationMethodology: the label is one of its options." +
                LABELS_NOTE,
            inputSchema: ReviewTaskByHashSchema.shape as any,
        },
        safeTool("get_review_log", async (args) => {
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
            return jsonResult({
                task: await describeTask(deps, task),
                reviewLog: describeReviewLog(deps, task),
            });
        })
    );

    server.registerTool(
        "get_review_task",
        {
            description: "Get a review task by id." + LABELS_NOTE,
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
            return jsonResult(withClassificationLabels(task));
        })
    );

    server.registerTool(
        "list_classification_methodologies",
        {
            description:
                "List the classification methodologies a review can use, with each option's stored value and pt/en label. A classification label only has meaning within its methodology: always report both.",
            inputSchema: ListClassificationMethodologiesSchema.shape as any,
        },
        safeTool("list_classification_methodologies", () =>
            Promise.resolve(
                jsonResult(
                    METHODOLOGY_IDS.map((id) => ({
                        id,
                        default: id === DEFAULT_METHODOLOGY,
                        ...classificationMethodologies[id],
                    }))
                )
            )
        )
    );
}
