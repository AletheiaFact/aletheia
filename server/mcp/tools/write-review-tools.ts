import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerWriteReviewCrossCheckTools } from "./write-review-cross-check-tools";
import { registerWriteReviewStageTools } from "./write-review-stage-tools";
import { registerWriteReviewWritingTools } from "./write-review-writing-tools";
import type { McpToolDeps } from "../mcp.service";

export function registerWriteReviewTools(server: McpServer, deps: McpToolDeps) {
    registerWriteReviewWritingTools(server, deps);
    registerWriteReviewCrossCheckTools(server, deps);
    registerWriteReviewStageTools(server, deps);
}
