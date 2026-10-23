import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { assertNamespaceAccess, jsonResult, safeTool } from "./tool-helpers";
import {
    GetClaimReviewSchema,
    GetReviewTaskSchema,
    ListClassificationMethodologiesSchema,
    ListReviewTasksSchema,
} from "./schemas";
import type { McpToolDeps } from "../mcp.service";
import {
    DEFAULT_METHODOLOGY,
    METHODOLOGY_IDS,
    classificationMethodologies,
} from "../../../lib/classification-methodology";
import { withClassificationLabels } from "./classification-labels";

const LABELS_NOTE =
    " Classified items include classificationMethodology, methodologyName and classificationLabel: report the label with its methodology.";

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
            return jsonResult(
                withClassificationLabels(
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
                )
            );
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
        safeTool("list_classification_methodologies", async () =>
            jsonResult(
                METHODOLOGY_IDS.map((id) => ({
                    id,
                    default: id === DEFAULT_METHODOLOGY,
                    ...classificationMethodologies[id],
                }))
            )
        )
    );
}
