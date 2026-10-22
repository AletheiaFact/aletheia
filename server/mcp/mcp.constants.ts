export const MCP_ENDPOINT_PATH = "api/mcp";
export const MCP_RESOURCE_METADATA_PATH = `.well-known/oauth-protected-resource/${MCP_ENDPOINT_PATH}`;
export const MCP_AUTH_SERVER_METADATA_PATH =
    ".well-known/oauth-authorization-server";
export const MCP_REGISTER_PATH = `${MCP_ENDPOINT_PATH}/register`;

// Hydra login/consent provider (local Kratos has no Hydra integration).
export const MCP_OAUTH_LOGIN_PATH = `${MCP_ENDPOINT_PATH}/oauth/login`;
export const MCP_OAUTH_CONSENT_API_PATH = `${MCP_ENDPOINT_PATH}/oauth/consent`;
export const MCP_OAUTH_CONSENT_PAGE_PATH = "mcp/consent";
