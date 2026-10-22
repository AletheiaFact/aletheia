import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { McpToolDeps } from "../mcp.service";
import { registerWriteContentTools } from "./write-content-tools";
import { registerWriteReviewTools } from "./write-review-tools";
import { registerWriteVerificationTools } from "./write-verification-tools";

export function registerWriteTools(server: McpServer, deps: McpToolDeps) {
    registerWriteContentTools(server, deps);
    registerWriteReviewTools(server, deps);
    registerWriteVerificationTools(server, deps);
}
