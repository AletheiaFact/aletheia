import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { McpToolDeps } from "../mcp.service";
import { registerReadContentTools } from "./read-content-tools";
import { registerReadReviewTools } from "./read-review-tools";
import { registerReadSearchTools } from "./read-search-tools";
import { registerReadVerificationTools } from "./read-verification-tools";

// `inputSchema` is cast to `any` in the read tool modules: the installed
// @modelcontextprotocol/sdk types `AnySchema` as a union that includes Zod
// v4's `$ZodType`, and structurally comparing our Zod v3 raw shapes against
// that union across ~12 `registerTool` calls makes `tsc` blow through its
// heap (confirmed by bisection — casting sidesteps the check without
// changing runtime behavior; the SDK still treats these as plain raw
// shapes at runtime via its own `isZodRawShapeCompat` check).
export function registerReadTools(server: McpServer, deps: McpToolDeps) {
    registerReadSearchTools(server, deps);
    registerReadContentTools(server, deps);
    registerReadReviewTools(server, deps);
    registerReadVerificationTools(server, deps);
}
