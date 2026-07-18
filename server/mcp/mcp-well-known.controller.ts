import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Public } from "../auth/decorators/auth.decorator";
import { MCP_RESOURCE_METADATA_PATH } from "./mcp.constants";

/**
 * OAuth 2.0 Protected Resource Metadata (RFC 9728) for the MCP endpoint.
 * MCP clients discover the authorization server (Ory) from this document
 * after receiving a 401 challenge from /server/mcp.
 */
@Controller()
export class McpWellKnownController {
    constructor(private readonly configService: ConfigService) {}

    @Public()
    @Get(MCP_RESOURCE_METADATA_PATH)
    getProtectedResourceMetadata() {
        const publicUrl = this.configService.get<string>("mcp.public_url");
        const authorizationServer =
            this.configService.get<string>("mcp.authorization_server") ||
            this.configService.get<string>("ory.url");
        return {
            resource: `${publicUrl}/server/mcp`,
            authorization_servers: [authorizationServer],
            bearer_methods_supported: ["header"],
        };
    }
}
