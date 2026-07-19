import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import mongoose from "mongoose";
import { assertNamespaceAccess, jsonResult, safeTool } from "./tool-helpers";
import {
    GetClaimReviewSchema,
    GetClaimSchema,
    GetPersonalitySchema,
    GetReviewTaskSchema,
    GetVerificationRequestSchema,
    ListClaimsSchema,
    ListPersonalitiesSchema,
    ListReviewTasksSchema,
    ListSourcesSchema,
    ListVerificationRequestsSchema,
    SearchSchema,
    SearchTopicsSchema,
} from "./schemas";
import type { McpToolDeps } from "../mcp.service";

// `inputSchema` is cast to `any` throughout this file: the installed
// @modelcontextprotocol/sdk types `AnySchema` as a union that includes Zod
// v4's `$ZodType`, and structurally comparing our Zod v3 raw shapes against
// that union across ~12 `registerTool` calls makes `tsc` blow through its
// heap (confirmed by bisection — casting sidesteps the check without
// changing runtime behavior; the SDK still treats these as plain raw
// shapes at runtime via its own `isZodRawShapeCompat` check).
export function registerReadTools(server: McpServer, deps: McpToolDeps) {
    server.registerTool(
        "search",
        {
            description:
                "Full-text search across personalities, claim sentences and claim revisions",
            inputSchema: SearchSchema.shape as any,
        },
        safeTool("search", async (args) => {
            const { searchText, pageSize, language, nameSpace } = args;
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                nameSpace
            );
            if (deps.configService.get("db.atlas")) {
                const [personalities, sentences, claims] = await Promise.all([
                    deps.personalityService.findAll({
                        searchText,
                        pageSize,
                        language,
                        nameSpace,
                    }),
                    deps.sentenceService.findAll({
                        searchText,
                        pageSize,
                        nameSpace,
                    }),
                    deps.claimRevisionService.findAll({
                        searchText,
                        pageSize,
                        nameSpace,
                    }),
                ]);
                return jsonResult({
                    personalities: personalities.processedPersonalities,
                    sentences: sentences.processedSentences,
                    claims: claims.processedRevisions,
                });
            }
            const fallback = await deps.personalityService.combinedListAll({
                name: searchText,
                pageSize,
                language,
            });
            return jsonResult(fallback);
        })
    );

    server.registerTool(
        "list_claims",
        {
            description: "List claims, optionally filtered by personality",
            inputSchema: ListClaimsSchema.shape as any,
        },
        safeTool("list_claims", async (args) => {
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            const query: Record<string, any> = {
                isHidden: false,
                nameSpace: args.nameSpace,
            };
            if (args.personalityId) {
                query.personalities = new mongoose.Types.ObjectId(
                    args.personalityId
                );
            }
            const { data, total } = await deps.claimService.listAll(
                args.page,
                args.pageSize,
                args.order,
                query
            );
            return jsonResult({
                totalClaims: total,
                totalPages: Math.ceil(total / args.pageSize),
                page: args.page,
                claims: data,
            });
        })
    );

    server.registerTool(
        "get_claim",
        {
            description: "Get a claim by id, including its latest revision",
            inputSchema: GetClaimSchema.shape as any,
        },
        safeTool("get_claim", async (args) => {
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            return jsonResult(
                await deps.claimService.getById(args.claimId, args.nameSpace)
            );
        })
    );

    server.registerTool(
        "list_personalities",
        {
            description: "List public figures (personalities)",
            inputSchema: ListPersonalitiesSchema.shape as any,
        },
        safeTool("list_personalities", async (args) => {
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            return jsonResult(
                await deps.personalityService.combinedListAll({
                    page: args.page,
                    pageSize: args.pageSize,
                    order: args.order,
                    language: args.language,
                    nameSpace: args.nameSpace,
                })
            );
        })
    );

    server.registerTool(
        "get_personality",
        {
            description: "Get a personality by id, with claims",
            inputSchema: GetPersonalitySchema.shape as any,
        },
        safeTool("get_personality", async (args) => {
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            return jsonResult(
                await deps.personalityService.getById(args.personalityId, {
                    language: args.language,
                    nameSpace: args.nameSpace,
                })
            );
        })
    );

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
        safeTool("get_review_task", async (args) =>
            jsonResult(await deps.reviewTaskService.getById(args.reviewTaskId))
        )
    );

    server.registerTool(
        "list_verification_requests",
        {
            description: "List verification requests (fact-check intake)",
            inputSchema: ListVerificationRequestsSchema.shape as any,
        },
        safeTool("list_verification_requests", async (args) =>
            jsonResult(
                await deps.verificationRequestService.listAll({
                    page: args.page,
                    pageSize: String(args.pageSize),
                    order: args.order,
                    topics: args.topics,
                    status: args.status,
                })
            )
        )
    );

    server.registerTool(
        "get_verification_request",
        {
            description: "Get a verification request by id",
            inputSchema: GetVerificationRequestSchema.shape as any,
        },
        safeTool("get_verification_request", async (args) =>
            jsonResult(
                await deps.verificationRequestService.getById(
                    args.verificationRequestId
                )
            )
        )
    );

    server.registerTool(
        "search_topics",
        {
            description: "Search topics by name or alias",
            inputSchema: SearchTopicsSchema.shape as any,
        },
        safeTool("search_topics", async (args) =>
            jsonResult(
                await deps.topicService.searchTopics(args.query, args.language)
            )
        )
    );

    server.registerTool(
        "list_sources",
        {
            description: "List classified sources (references)",
            inputSchema: ListSourcesSchema.shape as any,
        },
        safeTool("list_sources", async (args) => {
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            return jsonResult(
                await deps.sourceService.listAll({
                    page: args.page,
                    pageSize: String(args.pageSize),
                    order: args.order,
                    nameSpace: args.nameSpace,
                })
            );
        })
    );
}
