import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
    assertCanWrite,
    assertNamespaceAccess,
    assertUserSession,
    jsonResult,
    safeTool,
} from "./tool-helpers";
import { CreateVerificationRequestSchema } from "./schemas";
import type { McpToolDeps } from "../mcp.service";

export function registerWriteVerificationTools(
    server: McpServer,
    deps: McpToolDeps
) {
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
}
