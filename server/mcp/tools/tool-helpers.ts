import { Logger } from "@nestjs/common";

const logger = new Logger("McpTools");

export interface ToolResult {
    [key: string]: unknown;
    content: { type: "text"; text: string }[];
    isError?: boolean;
}

export function jsonResult(data: unknown): ToolResult {
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
}

/** Wraps a tool handler so failures become readable MCP errors, not crashes. */
export function safeTool<Args>(
    name: string,
    handler: (args: Args) => Promise<ToolResult>
): (args: Args) => Promise<ToolResult> {
    return async (args: Args) => {
        try {
            return await handler(args);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            logger.error(`Tool ${name} failed: ${message}`);
            return {
                isError: true,
                content: [{ type: "text", text: `${name} failed: ${message}` }],
            };
        }
    };
}
