import { Controller, Get, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { z } from "zod";
import { Public } from "../auth/decorators/auth.decorator";
import { ZodBody } from "../common/validation";
import { McpOAuthProxyService } from "./mcp-oauth-proxy.service";
import {
    MCP_AUTH_SERVER_METADATA_PATH,
    MCP_REGISTER_PATH,
} from "./mcp.constants";

// RFC 7591 client metadata is open-ended; Hydra validates the fields.
const ClientRegistrationSchema = z.record(z.string(), z.unknown());

/**
 * OAuth 2.0 Authorization Server Metadata (RFC 8414) and dynamic client
 * registration (RFC 7591) for MCP clients, backed by the upstream Ory/Hydra
 * server. See McpOAuthProxyService for why this fronts Hydra.
 */
@Controller()
export class McpOAuthController {
    constructor(private readonly oauthProxy: McpOAuthProxyService) {}

    @Public()
    @Get(MCP_AUTH_SERVER_METADATA_PATH)
    getAuthorizationServerMetadata() {
        return this.oauthProxy.getAuthorizationServerMetadata();
    }

    @Public()
    @Post(MCP_REGISTER_PATH)
    async registerClient(
        @ZodBody(ClientRegistrationSchema)
        registration: Record<string, unknown>,
        @Res() res: Response
    ) {
        const { status, body } = await this.oauthProxy.register(registration);
        res.status(status).json(body);
    }
}
