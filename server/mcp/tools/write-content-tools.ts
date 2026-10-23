import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
    assertCanWrite,
    assertNamespaceAccess,
    assertUserSession,
    jsonResult,
    safeTool,
} from "./tool-helpers";
import { ContentModelEnum } from "../../types/enums";
import {
    CreateClaimSchema,
    CreatePersonalitySchema,
    CreateSourceSchema,
} from "./schemas";
import type { McpToolDeps } from "../mcp.service";

export function registerWriteContentTools(
    server: McpServer,
    deps: McpToolDeps
) {
    server.registerTool(
        "create_claim",
        {
            description: "Create a speech-type claim for a personality",
            inputSchema: CreateClaimSchema.shape as any,
        },
        safeTool("create_claim", async (args) => {
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
            const claim: any = await deps.claimService.create({
                title: args.title,
                content: args.content,
                date: args.date,
                contentModel: ContentModelEnum.Speech,
                personalities: [args.personalityId],
                sources: args.sources,
                nameSpace: args.nameSpace,
            });
            // Queue feed: each sentence gets an `unassigned` review task for
            // next_review_task. The claim stands even if enqueueing fails.
            let queuedReviewTasks: number | { error: string } = 0;
            if (claim?._id) {
                try {
                    queuedReviewTasks =
                        await deps.reviewQueueService.enqueueClaimSentences(
                            claim._id.toString(),
                            args.nameSpace
                        );
                } catch (error) {
                    queuedReviewTasks = {
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    };
                }
            }
            const body =
                typeof claim?.toObject === "function"
                    ? claim.toObject()
                    : claim;
            return jsonResult({ ...body, queuedReviewTasks });
        })
    );

    server.registerTool(
        "create_personality",
        {
            description: "Create a public figure (personality)",
            inputSchema: CreatePersonalitySchema.shape as any,
        },
        safeTool("create_personality", async (args) => {
            assertCanWrite(deps.abilityFactory, deps.request.user);
            return jsonResult(
                await deps.personalityService.create({
                    name: args.name,
                    description: args.description,
                    wikidata: args.wikidata,
                })
            );
        })
    );

    server.registerTool(
        "create_source",
        {
            description: "Register a source URL, optionally linked to a target",
            inputSchema: CreateSourceSchema.shape as any,
        },
        safeTool("create_source", async (args) => {
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
                await deps.sourceService.create({
                    href: args.href,
                    targetId: args.targetId,
                    user: deps.request.user._id,
                    nameSpace: args.nameSpace,
                })
            );
        })
    );
}
