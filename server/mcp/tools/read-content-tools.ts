import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import mongoose from "mongoose";
import { assertNamespaceAccess, jsonResult, safeTool } from "./tool-helpers";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";
import {
    GetClaimSchema,
    GetPersonalitySchema,
    ListClaimsSchema,
    ListPersonalitiesSchema,
    ListSourcesSchema,
} from "./schemas";
import type { McpToolDeps } from "../mcp.service";
import {
    CLASSIFICATION_LABELS_NOTE as LABELS_NOTE,
    withClassificationLabels,
} from "./classification-labels";

export function registerReadContentTools(server: McpServer, deps: McpToolDeps) {
    server.registerTool(
        "list_claims",
        {
            description:
                "List claims, optionally filtered by personality." +
                LABELS_NOTE,
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
                claims: withClassificationLabels(data),
            });
        })
    );

    server.registerTool(
        "get_claim",
        {
            description:
                "Get a claim by id, including its latest revision." +
                LABELS_NOTE,
            inputSchema: GetClaimSchema.shape as any,
        },
        safeTool("get_claim", async (args) => {
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            return jsonResult(
                withClassificationLabels(
                    await deps.claimService.getById(
                        args.claimId,
                        args.nameSpace
                    )
                )
            );
        })
    );

    server.registerTool(
        "list_personalities",
        {
            description: "List public figures (personalities)." + LABELS_NOTE,
            inputSchema: ListPersonalitiesSchema.shape as any,
        },
        safeTool("list_personalities", async (args) => {
            // Personalities have no nameSpace field: they are global, so a
            // namespace filter would silently be ignored. Fail closed instead.
            if (args.nameSpace !== NameSpaceEnum.Main) {
                throw new Error(
                    "Personalities are not namespaced; omit nameSpace"
                );
            }
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            return jsonResult(
                withClassificationLabels(
                    await deps.personalityService.combinedListAll({
                        page: args.page,
                        pageSize: args.pageSize,
                        order: args.order,
                        language: args.language,
                        nameSpace: args.nameSpace,
                    })
                )
            );
        })
    );

    server.registerTool(
        "get_personality",
        {
            description: "Get a personality by id, with claims." + LABELS_NOTE,
            inputSchema: GetPersonalitySchema.shape as any,
        },
        safeTool("get_personality", async (args) => {
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            return jsonResult(
                withClassificationLabels(
                    await deps.personalityService.getById(args.personalityId, {
                        language: args.language,
                        nameSpace: args.nameSpace,
                    })
                )
            );
        })
    );

    server.registerTool(
        "list_sources",
        {
            description: "List classified sources (references)." + LABELS_NOTE,
            inputSchema: ListSourcesSchema.shape as any,
        },
        safeTool("list_sources", async (args) => {
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                args.nameSpace
            );
            return jsonResult(
                withClassificationLabels(
                    await deps.sourceService.listAll({
                        page: args.page,
                        pageSize: String(args.pageSize),
                        order: args.order,
                        nameSpace: args.nameSpace,
                    })
                )
            );
        })
    );
}
