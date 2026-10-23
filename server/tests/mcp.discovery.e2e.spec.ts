import request from "supertest";
import { MCP_ACCEPT, rpc, useMcpTestHelper } from "./utils/McpTestHelper";

describe("MCP discovery (e2e)", () => {
    const mcp = useMcpTestHelper();

    it("serves protected resource metadata", async () => {
        const res = await request(mcp.app.getHttpServer())
            .get("/.well-known/oauth-protected-resource/api/mcp")
            .expect(200);
        expect(res.body.resource).toBe("http://localhost:3000/api/mcp");
        expect(res.body.authorization_servers).toHaveLength(1);
    });

    it("answers the MCP initialize handshake", async () => {
        const res = await request(mcp.app.getHttpServer())
            .post("/api/mcp")
            .set("Accept", MCP_ACCEPT)
            .send(
                rpc("initialize", {
                    protocolVersion: "2025-03-26",
                    capabilities: {},
                    clientInfo: { name: "e2e", version: "1.0.0" },
                })
            )
            .expect(200);
        expect(res.body.result.serverInfo.name).toBe("aletheia");
    });

    it("rejects GET with 405 (stateless transport)", async () => {
        await request(mcp.app.getHttpServer())
            .get("/api/mcp")
            .set("Accept", MCP_ACCEPT)
            .expect(405);
    });

    it("lists the expected tool set", async () => {
        const res = await request(mcp.app.getHttpServer())
            .post("/api/mcp")
            .set("Accept", MCP_ACCEPT)
            .send(rpc("tools/list"))
            .expect(200);
        const names = res.body.result.tools.map((t: any) => t.name).sort();
        expect(names).toEqual(
            [
                "add_review_comment",
                "claim_review_task",
                "create_claim",
                "create_personality",
                "create_source",
                "create_verification_request",
                "get_claim",
                "get_claim_review",
                "get_personality",
                "get_review_task",
                "get_verification_request",
                "join_review_task",
                "list_classification_methodologies",
                "list_claims",
                "list_my_review_tasks",
                "list_personalities",
                "list_review_tasks",
                "list_sources",
                "list_verification_requests",
                "next_cross_checking",
                "next_review_task",
                "publish_review_task",
                "search",
                "search_topics",
                "send_to_review",
                "start_review_task",
            ].sort()
        );
    });

    it("advertises get_claim_review params in tools/list (I1)", async () => {
        const res = await request(mcp.app.getHttpServer())
            .post("/api/mcp")
            .set("Accept", MCP_ACCEPT)
            .send(rpc("tools/list"))
            .expect(200);
        const tool = res.body.result.tools.find(
            (t: any) => t.name === "get_claim_review"
        );
        expect(tool).toBeDefined();
        expect(tool.inputSchema.properties).toHaveProperty("claimReviewId");
        expect(tool.inputSchema.properties).toHaveProperty("dataHash");
    });
});
