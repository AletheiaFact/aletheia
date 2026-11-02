import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Public } from "../auth/decorators/auth.decorator";
import {
    MCP_ENDPOINT_PATH,
    MCP_RESOURCE_METADATA_PATH,
} from "./mcp.constants";

/**
 * OAuth 2.0 Protected Resource Metadata (RFC 9728) for the MCP endpoint.
 * MCP clients discover the authorization server from this document after
 * receiving a 401 challenge from /api/mcp.
 */
@Controller()
export class McpWellKnownController {
    constructor(private readonly configService: ConfigService) {}

    @Public()
    @Get(MCP_RESOURCE_METADATA_PATH)
    getProtectedResourceMetadata() {
        const publicUrl = this.configService.get<string>("mcp.public_url");
        return {
            resource: `${publicUrl}/${MCP_ENDPOINT_PATH}`,
            // Our own origin: McpOAuthController serves the RFC 8414 metadata
            // that fronts Ory with a spec-compliant registration endpoint.
            authorization_servers: [publicUrl],
            bearer_methods_supported: ["header"],
        };
    }
}
