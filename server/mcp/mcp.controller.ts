import {
    Controller,
    Delete,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Public } from "../auth/decorators/auth.decorator";
import { McpAuthGuard } from "./mcp-auth.guard";
import { McpService } from "./mcp.service";
import type { BaseRequest } from "../types";

@Controller("server/mcp")
export class McpController {
    constructor(private readonly mcpService: McpService) {}

    @Public()
    @UseGuards(McpAuthGuard)
    @Post()
    async handleMcpRequest(@Req() req: BaseRequest, @Res() res: Response) {
        const server = this.mcpService.buildServer();
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true,
        });
        res.on("close", () => {
            transport.close();
            server.close();
        });
        await server.connect(transport);
        await transport.handleRequest(req as any, res, req.body);
    }

    @Public()
    @Get()
    methodNotAllowedGet(@Res() res: Response) {
        this.methodNotAllowed(res);
    }

    @Public()
    @Delete()
    methodNotAllowedDelete(@Res() res: Response) {
        this.methodNotAllowed(res);
    }

    private methodNotAllowed(res: Response) {
        res.status(405).json({
            jsonrpc: "2.0",
            error: { code: -32000, message: "Method not allowed" },
            id: null,
        });
    }
}
