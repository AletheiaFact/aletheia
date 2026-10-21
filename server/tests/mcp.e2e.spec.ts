import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "../app.module";
import { SessionGuard } from "../auth/session.guard";
import { SessionGuardMock } from "./mocks/SessionGuardMock";
import { SessionOrM2MGuard } from "../auth/m2m-or-session.guard";
import { SessionOrM2MGuardMock } from "./mocks/SessionOrM2MGuardMock";
import { M2MGuard } from "../auth/m2m.guard";
import { M2MGuardMock } from "./mocks/M2MGuardMock";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { AbilitiesGuardMock } from "./mocks/AbilitiesGuardMock";
import { HistoryService } from "../history/history.service";
import { HistoryServiceMock } from "./mocks/HistoryServiceMock";
import { McpAuthGuard } from "../mcp/mcp-auth.guard";
import { TestConfigOptions } from "./utils/TestConfigOptions";
import { SeedTestUser } from "./utils/SeedTestUser";
import { SeedTestNameSpace } from "./utils/SeedTestNameSpace";
import { AdminUserMock } from "./utils/AdminUserMock";
import { VerificationRequestStateMachineService } from "../verification-request/state-machine/verification-request.state-machine.service";

const MCP_ACCEPT = "application/json, text/event-stream";

const adminUser = () => ({
    isM2M: false,
    _id: AdminUserMock._id.toString(),
    id: AdminUserMock._id.toString(),
    role: { main: "admin" },
    status: "active",
});

// Mutable so individual tests can inject a different authenticated user
// shape (role, namespace membership, M2M) before issuing a tool call.
let mockUser: any = adminUser();

const McpAuthGuardMock = {
    canActivate: (context: any) => {
        const request = context.switchToHttp().getRequest();
        request.user = mockUser;
        return true;
    },
};

function rpc(method: string, params: any = {}, id = 1) {
    return { jsonrpc: "2.0", id, method, params };
}

async function callTool(app: any, name: string, args: any = {}) {
    const res = await request(app.getHttpServer())
        .post("/api/mcp")
        .set("Accept", MCP_ACCEPT)
        .send(rpc("tools/call", { name, arguments: args }))
        .expect(200);
    return res.body;
}

describe("MCP server (e2e)", () => {
    let app: any;

    beforeAll(async () => {
        const mongoUri = process.env.MONGO_URI!;
        await SeedTestUser(mongoUri);
        // Seeds the "secret" (admin is a member) and "forbidden" (no
        // members) NameSpace documents used by the DB-membership tests
        // below (C1), mirroring what NameSpaceGuard checks in production.
        await SeedTestNameSpace(mongoUri);

        const testConfig = {
            ...TestConfigOptions.config,
            db: {
                ...TestConfigOptions.config.db,
                connection_uri: mongoUri,
            },
            mcp: {
                enabled: true,
                public_url: "http://localhost:3000",
            },
        };

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule.register(testConfig)],
        })
            .overrideGuard(SessionGuard)
            .useValue(SessionGuardMock)
            .overrideGuard(SessionOrM2MGuard)
            .useValue(SessionOrM2MGuardMock)
            .overrideGuard(M2MGuard)
            .useValue(M2MGuardMock)
            .overrideGuard(AbilitiesGuard)
            .useValue(AbilitiesGuardMock)
            .overrideGuard(McpAuthGuard)
            .useValue(McpAuthGuardMock)
            .overrideProvider(HistoryService)
            .useValue(HistoryServiceMock)
            .overrideProvider(VerificationRequestStateMachineService)
            .useValue({
                request: vi
                    .fn()
                    .mockResolvedValue({ status: "pre-triage", ok: true }),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                whitelist: true,
                forbidNonWhitelisted: true,
            })
        );
        await app.init();
    });

    afterAll(async () => {
        await app?.close();
    });

    beforeEach(() => {
        mockUser = adminUser();
    });

    it("serves protected resource metadata", async () => {
        const res = await request(app.getHttpServer())
            .get("/.well-known/oauth-protected-resource/api/mcp")
            .expect(200);
        expect(res.body.resource).toBe("http://localhost:3000/api/mcp");
        expect(res.body.authorization_servers).toHaveLength(1);
    });

    it("answers the MCP initialize handshake", async () => {
        const res = await request(app.getHttpServer())
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
        await request(app.getHttpServer())
            .get("/api/mcp")
            .set("Accept", MCP_ACCEPT)
            .expect(405);
    });

    it("lists all v1 tools", async () => {
        const res = await request(app.getHttpServer())
            .post("/api/mcp")
            .set("Accept", MCP_ACCEPT)
            .send(rpc("tools/list"))
            .expect(200);
        const names = res.body.result.tools.map((t: any) => t.name).sort();
        expect(names).toEqual(
            [
                "add_review_comment",
                "create_claim",
                "create_personality",
                "create_source",
                "create_verification_request",
                "get_claim",
                "get_claim_review",
                "get_personality",
                "get_review_task",
                "get_verification_request",
                "list_claims",
                "list_personalities",
                "list_review_tasks",
                "list_sources",
                "list_verification_requests",
                "search",
                "search_topics",
                "start_review_task",
            ].sort()
        );
    });

    it("advertises get_claim_review params in tools/list (I1)", async () => {
        const res = await request(app.getHttpServer())
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

    it("calls list_claims and returns a JSON payload", async () => {
        const body = await callTool(app, "list_claims", {
            page: 0,
            pageSize: 5,
        });
        expect(body.result.isError).toBeFalsy();
        const payload = JSON.parse(body.result.content[0].text);
        expect(payload).toHaveProperty("totalClaims");
        expect(payload).toHaveProperty("claims");
    });

    it("rejects cross-namespace access (C1)", async () => {
        // Admin is not a member of the seeded "forbidden" NameSpace
        // document (no `users`); requesting it must fail closed, driven by
        // NameSpaceService (DB membership), not the role map.
        mockUser = adminUser();
        const body = await callTool(app, "list_review_tasks", {
            reviewTaskType: "Claim",
            nameSpace: "forbidden",
        });
        expect(body.result.isError).toBe(true);
        expect(body.result.content[0].text).toMatch(/namespace/i);
    });

    it("rejects access to a namespace that doesn't exist (C1)", async () => {
        mockUser = adminUser();
        const body = await callTool(app, "list_review_tasks", {
            reviewTaskType: "Claim",
            nameSpace: "does-not-exist",
        });
        expect(body.result.isError).toBe(true);
        expect(body.result.content[0].text).toMatch(/namespace/i);
    });

    it("allows a namespace the user belongs to (C1)", async () => {
        // Admin (AdminUserMock._id) is seeded as a member of the "secret"
        // NameSpace document (see SeedTestNameSpace); the role map no
        // longer drives this check.
        mockUser = adminUser();
        const body = await callTool(app, "list_review_tasks", {
            reviewTaskType: "Claim",
            nameSpace: "secret",
        });
        expect(body.result.isError).toBeFalsy();
    });

    it("blocks writes for a Regular (read-only) user (I3)", async () => {
        mockUser = { ...adminUser(), role: { main: "regular" } };
        const body = await callTool(app, "create_personality", {
            name: "Read Only Person",
            description: "should not be created",
            wikidata: "Q-regular-block",
        });
        expect(body.result.isError).toBe(true);
        expect(body.result.content[0].text).toMatch(/not authorized/i);
    });

    it("allows writes for an admin user (I3)", async () => {
        mockUser = adminUser();
        const body = await callTool(app, "create_personality", {
            name: `MCP Admin Person ${Date.now()}`,
            description: "created via MCP by admin",
            wikidata: `Q-admin-${Date.now()}`,
        });
        expect(body.result.isError).toBeFalsy();
    });

    it("rejects M2M tokens on user-attributed writes (I2)", async () => {
        mockUser = {
            isM2M: true,
            clientId: "mcp-client",
            subject: "mcp-client",
            role: { main: "integration" },
            namespace: "main",
        };
        const body = await callTool(app, "create_source", {
            href: "https://example.com/m2m-source",
        });
        expect(body.result.isError).toBe(true);
        expect(body.result.content[0].text).toMatch(/user session/i);
    });

    it("creates a personality", async () => {
        mockUser = adminUser();
        const body = await callTool(app, "create_personality", {
            name: `MCP Test Person ${Date.now()}`,
            description: "Created via MCP e2e",
            wikidata: `Q999999${Date.now()}`,
        });
        expect(body.result.isError).toBeFalsy();
        const created = JSON.parse(body.result.content[0].text);
        expect(created.slug).toMatch(/^mcp-test-person/);
    });

    it("creates a source attributed to the authenticated user", async () => {
        mockUser = adminUser();
        const body = await callTool(app, "create_source", {
            href: `https://example.org/mcp-e2e-source-${Date.now()}`,
        });
        expect(body.result.isError).toBeFalsy();
        const created = JSON.parse(body.result.content[0].text);
        expect(created.href).toContain("https://example.org/mcp-e2e-source-");
    });

    it("routes verification requests through the state machine with the MCP user", async () => {
        mockUser = adminUser();
        const body = await callTool(app, "create_verification_request", {
            content: "Is this viral message about vaccines true or false?",
        });
        expect(body.result.isError).toBeFalsy();
    });

    it("returns a readable tool error instead of crashing on bad input", async () => {
        mockUser = adminUser();
        const body = await callTool(app, "get_claim", {
            claimId: "not-an-objectid",
        });
        expect(body.result.isError).toBe(true);
        expect(body.result.content[0].text).toContain("get_claim failed");
    });

    describe("start_review_task", () => {
        // Sentences are the leaves of a claim's content tree: paragraphs also
        // carry a data_hash but their `content` is an array, not a string.
        const findSentenceHashes = (node: any, found: string[] = []) => {
            if (Array.isArray(node)) {
                node.forEach((child) => findSentenceHashes(child, found));
            } else if (node && typeof node === "object") {
                if (node.data_hash && typeof node.content === "string") {
                    found.push(node.data_hash);
                }
                Object.values(node).forEach((child) =>
                    findSentenceHashes(child, found)
                );
            }
            return found;
        };

        // Setup calls must succeed; surface the tool error instead of a
        // confusing JSON.parse failure when they don't.
        const callOk = async (name: string, args: any) => {
            const body = await callTool(app, name, args);
            const text = body.result?.content?.[0]?.text ?? JSON.stringify(body);
            if (body.result?.isError || body.error) {
                throw new Error(`${name} setup failed: ${text}`);
            }
            return JSON.parse(text);
        };

        const createClaim = async () => {
            const stamp = Date.now() + Math.floor(Math.random() * 1000);
            const personality = await callOk("create_personality", {
                name: `Workflow Person ${stamp}`,
                description: "Workflow e2e",
                wikidata: `Q-workflow-${stamp}`,
            });
            const claim = await callOk("create_claim", {
                title: `Workflow claim ${stamp}`,
                content: "Nós criamos o Pronetac.",
                date: new Date().toISOString(),
                sources: [`https://example.org/workflow-${stamp}`],
                personalityId: personality._id,
            });
            const [dataHash] = findSentenceHashes(
                await callOk("get_claim", { claimId: claim._id })
            );
            return { claimId: claim._id as string, dataHash };
        };

        it("creates an assigned fact-checking task for the caller", async () => {
            mockUser = adminUser();
            const { claimId, dataHash } = await createClaim();
            expect(dataHash).toBeDefined();

            const body = await callTool(app, "start_review_task", {
                claimId,
                dataHash,
            });

            expect(body.result.isError).toBeFalsy();
            const task = JSON.parse(body.result.content[0].text);
            expect(task.data_hash).toBe(dataHash);
            expect(task.target).toBe(claimId);
            expect(task.reviewTaskType).toBe("Claim");
            expect(task.reportModel).toBe("Fact-checking");
            expect(task.machine.value).toBe("assigned");
            expect(task.machine.context.reviewData.usersId).toEqual([
                AdminUserMock._id.toString(),
            ]);
        });

        it("refuses a sentence that already has a task", async () => {
            mockUser = adminUser();
            const { claimId, dataHash } = await createClaim();
            await callTool(app, "start_review_task", { claimId, dataHash });

            const body = await callTool(app, "start_review_task", {
                claimId,
                dataHash,
            });

            expect(body.result.isError).toBe(true);
            expect(body.result.content[0].text).toMatch(/already/i);
        });

        it("refuses a data_hash that is not a sentence of the claim", async () => {
            mockUser = adminUser();
            const { claimId } = await createClaim();

            const body = await callTool(app, "start_review_task", {
                claimId,
                dataHash: "0".repeat(32),
            });

            expect(body.result.isError).toBe(true);
            expect(body.result.content[0].text).toMatch(/sentence/i);
        });

        it("blocks a Regular (read-only) user", async () => {
            mockUser = adminUser();
            const { claimId, dataHash } = await createClaim();
            mockUser = { ...adminUser(), role: { main: "regular" } };

            const body = await callTool(app, "start_review_task", {
                claimId,
                dataHash,
            });

            expect(body.result.isError).toBe(true);
            expect(body.result.content[0].text).toMatch(/not authorized/i);
        });
    });
});
