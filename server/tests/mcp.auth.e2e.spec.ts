import {
    adminUser,
    authState,
    callTool,
    m2mUser,
    regularUser,
    useMcpTestHelper,
} from "./utils/McpTestHelper";

describe("MCP auth and namespace access (e2e)", () => {
    const mcp = useMcpTestHelper();

    describe("namespace membership (C1)", () => {
        it("rejects cross-namespace access to a namespace with no members", async () => {
            // Admin is not a member of the seeded "forbidden" NameSpace
            // document; the check is DB membership (NameSpaceService), not the
            // role map, so it must fail closed.
            const body = await callTool(mcp.app, "list_review_tasks", {
                reviewTaskType: "Claim",
                nameSpace: "forbidden",
            });
            expect(body.result.isError).toBe(true);
            expect(body.result.content[0].text).toMatch(
                /Not authorized for namespace "forbidden"/
            );
        });

        it("rejects access to a namespace that doesn't exist", async () => {
            const body = await callTool(mcp.app, "list_review_tasks", {
                reviewTaskType: "Claim",
                nameSpace: "does-not-exist",
            });
            expect(body.result.isError).toBe(true);
            expect(body.result.content[0].text).toMatch(
                /Namespace "does-not-exist" not found/
            );
        });

        it("allows a namespace the user belongs to", async () => {
            // Admin (AdminUserMock._id) is seeded as a member of "secret".
            const body = await callTool(mcp.app, "list_review_tasks", {
                reviewTaskType: "Claim",
                nameSpace: "secret",
            });
            expect(body.result.isError).toBeFalsy();
        });
    });

    describe("write permissions", () => {
        it("blocks writes for a Regular (read-only) user (I3)", async () => {
            authState.user = regularUser();
            const body = await callTool(mcp.app, "create_personality", {
                name: "Read Only Person",
                description: "should not be created",
                wikidata: "Q-regular-block",
            });
            expect(body.result.isError).toBe(true);
            expect(body.result.content[0].text).toMatch(
                /Not authorized to write/i
            );
        });

        it("allows writes for an admin user (I3)", async () => {
            authState.user = adminUser();
            const body = await callTool(mcp.app, "create_personality", {
                name: `MCP Admin Person ${Date.now()}`,
                description: "created via MCP by admin",
                wikidata: `Q-admin-${Date.now()}`,
            });
            expect(body.result.isError).toBeFalsy();
        });

        it("rejects M2M tokens on user-attributed writes (I2)", async () => {
            authState.user = m2mUser();
            const body = await callTool(mcp.app, "create_source", {
                href: "https://example.com/m2m-source",
            });
            expect(body.result.isError).toBe(true);
            expect(body.result.content[0].text).toMatch(/user session/i);
        });
    });
});
