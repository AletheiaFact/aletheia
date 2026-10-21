import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { jsonResult, safeTool } from "./tool-helpers";
import {
    GetVerificationRequestSchema,
    ListVerificationRequestsSchema,
} from "./schemas";
import type { McpToolDeps } from "../mcp.service";

export function registerReadVerificationTools(
    server: McpServer,
    deps: McpToolDeps
) {
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
}
