import { AdminUserMock } from "./utils/AdminUserMock";
import {
    callTool,
    useMcpTestHelper,
    verificationRequestStateMachineMock,
} from "./utils/McpTestHelper";

describe("MCP tools (e2e)", () => {
    const mcp = useMcpTestHelper();

    it("calls list_claims and returns a JSON payload", async () => {
        const body = await callTool(mcp.app, "list_claims", {
            page: 0,
            pageSize: 5,
        });
        expect(body.result.isError).toBeFalsy();
        const payload = JSON.parse(body.result.content[0].text);
        expect(payload).toHaveProperty("totalClaims");
        expect(payload).toHaveProperty("claims");
    });

    it("creates a personality with a slug derived from its name", async () => {
        const body = await callTool(mcp.app, "create_personality", {
            name: `MCP Test Person ${Date.now()}`,
            description: "Created via MCP e2e",
            wikidata: `Q999999${Date.now()}`,
        });
        expect(body.result.isError).toBeFalsy();
        const created = JSON.parse(body.result.content[0].text);
        expect(created.slug).toMatch(/^mcp-test-person/);
    });

    it("creates a source attributed to the authenticated user", async () => {
        const body = await callTool(mcp.app, "create_source", {
            href: `https://example.org/mcp-e2e-source-${Date.now()}`,
        });
        expect(body.result.isError).toBeFalsy();
        const created = JSON.parse(body.result.content[0].text);
        expect(created.href).toContain("https://example.org/mcp-e2e-source-");
    });

    it("routes verification requests through the state machine with the MCP user", async () => {
        const content = "Is this viral message about vaccines true or false?";
        const body = await callTool(mcp.app, "create_verification_request", {
            content,
        });

        expect(body.result.isError).toBeFalsy();
        expect(
            verificationRequestStateMachineMock.request
        ).toHaveBeenCalledWith(
            expect.objectContaining({ content }),
            expect.objectContaining({ id: AdminUserMock._id.toString() })
        );
    });

    it("returns a readable tool error instead of crashing on bad input", async () => {
        const body = await callTool(mcp.app, "get_claim", {
            claimId: "not-an-objectid",
        });
        expect(body.result.isError).toBe(true);
        expect(body.result.content[0].text).toContain("get_claim failed");
    });
});
