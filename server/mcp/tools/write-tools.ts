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
    AddReviewCommentSchema,
    CreateClaimSchema,
    CreatePersonalitySchema,
    CreateSourceSchema,
    CreateVerificationRequestSchema,
    StartReviewTaskSchema,
} from "./schemas";
import type { McpToolDeps } from "../mcp.service";

export function registerWriteTools(server: McpServer, deps: McpToolDeps) {
    server.registerTool(
        "create_verification_request",
        {
            description:
                "Submit content for fact-checking (enters the triage pipeline)",
            inputSchema: CreateVerificationRequestSchema.shape as any,
        },
        safeTool("create_verification_request", async (args) => {
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
                await deps.verificationRequestStateMachineService.request(
                    {
                        content: args.content,
                        sourceChannel: args.sourceChannel,
                        source: args.source,
                        publicationDate: args.publicationDate,
                        heardFrom: args.heardFrom,
                        nameSpace: args.nameSpace,
                    },
                    deps.request.user
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
            return jsonResult(
                await deps.claimService.create({
                    title: args.title,
                    content: args.content,
                    date: args.date,
                    contentModel: ContentModelEnum.Speech,
                    personalities: [args.personalityId],
                    sources: args.sources,
                    nameSpace: args.nameSpace,
                })
            );
        })
    );

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
