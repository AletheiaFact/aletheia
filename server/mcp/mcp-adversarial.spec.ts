import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AbilityFactory } from "../auth/ability/ability.factory";
import type { McpToolDeps } from "./mcp.service";
import { ReviewWorkflowService } from "./review-workflow.service";
import { registerReadTools } from "./tools/read-tools";
import { registerWriteTools } from "./tools/write-tools";

/**
 * Adversarial suite: an agent (or a compromised token) drives the real tool
 * registry through a real MCP client/server pair and tries to bypass
 * authorization, impersonate another user, escape its namespace, forge
 * workflow state and smuggle operators through arguments. Only the data
 * services are mocked; AbilityFactory, the authz helpers, the Zod schemas and
 * ReviewWorkflowService are the production code.
 */

const HASH_A = "a".repeat(32);
const HASH_B = "b".repeat(32);
const OTHER_NS = "secret-ns";

const mainUser = (role: string, extra: Record<string, unknown> = {}) => ({
    isM2M: false,
    _id: "user-1",
    id: "user-1",
    role: { main: role },
    status: "active",
    ...extra,
});

const regular = mainUser("regular");
const factChecker = mainUser("fact-checker");
const m2m = {
    isM2M: true,
    clientId: "client-1",
    role: { main: "integration" },
};

const claimTree = {
    _id: "claim-1",
    content: [
        {
            // paragraph: has a data_hash but array content, not reviewable
            data_hash: HASH_B,
            content: [{ data_hash: HASH_A, content: "a sentence" }],
        },
    ],
};

function buildDeps(user: any) {
    const mocks = {
        claimService: {
            create: vi.fn().mockResolvedValue({ ok: true }),
            getById: vi.fn().mockResolvedValue(claimTree),
            listAll: vi.fn().mockResolvedValue({ data: [], total: 0 }),
        },
        personalityService: { create: vi.fn().mockResolvedValue({ ok: true }) },
        sourceService: { create: vi.fn().mockResolvedValue({ ok: true }) },
        reviewTaskService: {
            create: vi.fn().mockResolvedValue({ ok: true }),
            addComment: vi.fn().mockResolvedValue({ ok: true }),
            getReviewTaskByDataHash: vi.fn().mockResolvedValue(null),
            getById: vi.fn().mockResolvedValue(null),
            listAll: vi.fn().mockResolvedValue([]),
        },
        claimReviewService: {
            getById: vi.fn().mockResolvedValue(null),
            getReviewByDataHash: vi.fn().mockResolvedValue(null),
        },
        verificationRequestStateMachineService: {
            request: vi.fn().mockResolvedValue({ ok: true }),
        },
        nameSpaceService: {
            // `secret-ns` exists but only `member-1` belongs to it
            findOne: vi.fn(async ({ slug }: { slug: string }) =>
                slug === OTHER_NS ? { slug, users: ["member-1"] } : null
            ),
        },
    };
    const reviewWorkflowService = new ReviewWorkflowService(
        mocks.claimService as any,
        mocks.reviewTaskService as any
    );
    const deps = {
        request: { user },
        configService: {},
        claimService: mocks.claimService,
        claimRevisionService: {},
        sentenceService: {},
        personalityService: mocks.personalityService,
        claimReviewService: mocks.claimReviewService,
        reviewTaskService: mocks.reviewTaskService,
        verificationRequestService: {},
        verificationRequestStateMachineService:
            mocks.verificationRequestStateMachineService,
        sourceService: mocks.sourceService,
        topicService: {},
        abilityFactory: new AbilityFactory(),
        nameSpaceService: mocks.nameSpaceService,
        reviewWorkflowService,
    } as unknown as McpToolDeps;
    return { deps, mocks };
}

async function connect(user: any) {
    const { deps, mocks } = buildDeps(user);
    const server = new McpServer({ name: "test", version: "0.0.0" });
    registerReadTools(server, deps);
    registerWriteTools(server, deps);
    const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "attacker", version: "0.0.0" });
    await Promise.all([
        server.connect(serverTransport),
        client.connect(clientTransport),
    ]);
    const call = async (name: string, args: Record<string, unknown> = {}) => {
        try {
            const res: any = await client.callTool({ name, arguments: args });
            return {
                isError: !!res.isError,
                text: res.content?.[0]?.text as string,
            };
        } catch (error) {
            // SDK-level argument validation surfaces as a protocol error
            return { isError: true, text: String(error) };
        }
    };
    return { client, call, mocks, close: () => client.close() };
}

const validArgs: Record<string, Record<string, unknown>> = {
    create_claim: {
        title: "A title",
        content: "A claim sentence long enough to pass",
        date: "2026-01-01T00:00:00.000Z",
        personalityId: "p1",
        sources: ["https://example.org/source"],
        nameSpace: "main",
    },
    create_personality: {
        name: "Someone",
        description: "A public figure",
        wikidata: "Q1",
    },
    create_source: { href: "https://example.org", targetId: "t1" },
    create_verification_request: {
        content: "content long enough to pass",
        sourceChannel: "web",
        nameSpace: "main",
    },
    start_review_task: { claimId: "claim-1", dataHash: HASH_A },
    add_review_comment: { dataHash: HASH_A, comment: "c", text: "t" },
};

const READ_TOOLS = [
    "search",
    "list_claims",
    "get_claim",
    "list_personalities",
    "get_personality",
    "list_sources",
    "get_claim_review",
    "list_review_tasks",
    "get_review_task",
    // Static registry only: no namespace, user or database access
    "list_classification_methodologies",
    "list_verification_requests",
    "get_verification_request",
    "search_topics",
];

describe("MCP adversarial suite", () => {
    let session: Awaited<ReturnType<typeof connect>>;
    afterEach(async () => session?.close());

    describe("tool surface", () => {
        it("exposes exactly the audited tools (new tools must be added to this suite)", async () => {
            session = await connect(factChecker);
            const { tools } = await session.client.listTools();
            expect(tools.map((t) => t.name).sort()).toEqual(
                [...READ_TOOLS, ...Object.keys(validArgs)].sort()
            );
        });

        it("offers no delete/publish/role/admin tool", async () => {
            session = await connect(factChecker);
            const { tools } = await session.client.listTools();
            const forbidden = /delete|remove|publish|role|admin|user|assign/i;
            expect(
                tools.map((t) => t.name).filter((n) => forbidden.test(n))
            ).toEqual([]);
        });
    });

    describe("privilege escalation: read-only role", () => {
        it.each(Object.keys(validArgs))(
            "regular user cannot call %s",
            async (tool) => {
                session = await connect(regular);
                const res = await session.call(tool, validArgs[tool]);
                expect(res.isError).toBe(true);
                // no data service may be touched on a denied write
                const m = session.mocks;
                expect(m.claimService.create).not.toHaveBeenCalled();
                expect(m.personalityService.create).not.toHaveBeenCalled();
                expect(m.sourceService.create).not.toHaveBeenCalled();
                expect(m.reviewTaskService.create).not.toHaveBeenCalled();
                expect(m.reviewTaskService.addComment).not.toHaveBeenCalled();
                expect(
                    m.verificationRequestStateMachineService.request
                ).not.toHaveBeenCalled();
            }
        );

        it("cannot self-promote by passing role/isM2M/user args", async () => {
            session = await connect(regular);
            const res = await session.call("start_review_task", {
                ...validArgs.start_review_task,
                role: { main: "admin" },
                isM2M: true,
                user: { _id: "user-1", role: { main: "admin" } },
            });
            expect(res.isError).toBe(true);
            expect(
                session.mocks.reviewTaskService.create
            ).not.toHaveBeenCalled();
        });
    });

    describe("namespace isolation", () => {
        it.each([
            "create_claim",
            "create_source",
            "create_verification_request",
            "start_review_task",
        ])("non-member cannot write via %s", async (tool) => {
            session = await connect(factChecker);
            const res = await session.call(tool, {
                ...validArgs[tool],
                nameSpace: OTHER_NS,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/Not authorized for namespace/);
        });

        it("member without a role in that namespace is still read-only there", async () => {
            // role map only grants fact-checker on `main`
            session = await connect({ ...factChecker, _id: "member-1" });
            const res = await session.call("create_claim", {
                ...validArgs.create_claim,
                nameSpace: OTHER_NS,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/Not authorized to write/);
            expect(session.mocks.claimService.create).not.toHaveBeenCalled();
        });

        it("unknown namespace fails closed", async () => {
            session = await connect(factChecker);
            const res = await session.call("list_claims", {
                nameSpace: "does-not-exist",
            });
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/not found/);
        });

        it.each([
            ["get_review_task", { reviewTaskId: "t1" }],
            ["get_claim_review", { claimReviewId: "r1" }],
        ])(
            "%s does not leak a record from another namespace",
            async (tool, args) => {
                session = await connect(factChecker);
                const record = {
                    _id: "x",
                    nameSpace: OTHER_NS,
                    secret: "LEAK",
                };
                session.mocks.reviewTaskService.getById.mockResolvedValue(
                    record
                );
                session.mocks.claimReviewService.getById.mockResolvedValue(
                    record
                );
                const res = await session.call(tool, args);
                expect(res.isError).toBe(true);
                expect(res.text).not.toContain("LEAK");
            }
        );

        it("add_review_comment resolves the namespace from the stored task, not from args", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                { nameSpace: OTHER_NS }
            );
            const res = await session.call("add_review_comment", {
                ...validArgs.add_review_comment,
                nameSpace: "main", // lie about the namespace
            });
            expect(res.isError).toBe(true);
            expect(
                session.mocks.reviewTaskService.addComment
            ).not.toHaveBeenCalled();
        });

        it("start_review_task scopes the claim lookup to the requested namespace", async () => {
            session = await connect(factChecker);
            session.mocks.claimService.getById.mockResolvedValue(null);
            const res = await session.call("start_review_task", {
                ...validArgs.start_review_task,
            });
            expect(res.isError).toBe(true);
            expect(session.mocks.claimService.getById).toHaveBeenCalledWith(
                "claim-1",
                "main"
            );
            expect(
                session.mocks.reviewTaskService.create
            ).not.toHaveBeenCalled();
        });
    });

    describe("identity: M2M tokens and impersonation", () => {
        it.each([
            "create_source",
            "create_verification_request",
            "start_review_task",
            "add_review_comment",
        ])(
            "M2M token cannot call %s (attributes writes to a user)",
            async (tool) => {
                session = await connect(m2m);
                session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                    { nameSpace: "main" }
                );
                const res = await session.call(tool, validArgs[tool]);
                expect(res.isError).toBe(true);
                expect(res.text).toMatch(/user session/);
            }
        );

        it("attributes the task to the authenticated user even if args name another user", async () => {
            session = await connect(factChecker);
            const res = await session.call("start_review_task", {
                ...validArgs.start_review_task,
                userId: "victim",
                usersId: ["victim"],
                user: { _id: "victim" },
            });
            expect(res.isError).toBe(false);
            const created =
                session.mocks.reviewTaskService.create.mock.calls[0][0];
            expect(created.machine.context.reviewData.usersId).toEqual([
                "user-1",
            ]);
        });

        it("add_review_comment attributes the comment to the caller, not to args", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                { nameSpace: "main" }
            );
            await session.call("add_review_comment", {
                ...validArgs.add_review_comment,
                user: "victim",
            });
            expect(
                session.mocks.reviewTaskService.addComment
            ).toHaveBeenCalledWith(
                HASH_A,
                expect.objectContaining({ user: "user-1" })
            );
        });
    });

    describe("workflow forgery: start_review_task", () => {
        it("always creates the task as `assigned` with no reviewer/classification", async () => {
            session = await connect(factChecker);
            const res = await session.call("start_review_task", {
                ...validArgs.start_review_task,
                machine: {
                    value: "published",
                    context: { reviewData: { classification: "true" } },
                },
                value: "published",
                reviewerId: "user-1",
                crossCheckerId: "user-1",
            });
            expect(res.isError).toBe(false);
            const created =
                session.mocks.reviewTaskService.create.mock.calls[0][0];
            expect(created.machine.value).toBe("assigned");
            expect(created.machine.context.reviewData).toMatchObject({
                classification: "",
                reviewerId: null,
                crossCheckerId: null,
                crossCheckingClassification: "",
            });
        });

        it("rejects a paragraph hash (only sentences are reviewable)", async () => {
            session = await connect(factChecker);
            const res = await session.call("start_review_task", {
                ...validArgs.start_review_task,
                dataHash: HASH_B,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/not a sentence/);
            expect(
                session.mocks.reviewTaskService.create
            ).not.toHaveBeenCalled();
        });

        it("rejects a hash that does not belong to the claim", async () => {
            session = await connect(factChecker);
            const res = await session.call("start_review_task", {
                ...validArgs.start_review_task,
                dataHash: "c".repeat(32),
            });
            expect(res.isError).toBe(true);
            expect(
                session.mocks.reviewTaskService.create
            ).not.toHaveBeenCalled();
        });

        it("rejects taking a sentence that already has a task", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                { _id: "existing" }
            );
            const res = await session.call(
                "start_review_task",
                validArgs.start_review_task
            );
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/already exists/);
            expect(
                session.mocks.reviewTaskService.create
            ).not.toHaveBeenCalled();
        });

        // KNOWN GAP: duplicate check is read-then-create and review_tasks has
        // no unique index on data_hash, so two concurrent calls both pass.
        // `it.fails` flips to a red test the day the gap is closed, so the
        // marker gets removed with the fix.
        it.fails(
            "two concurrent claims of the same sentence yield one task",
            async () => {
                session = await connect(factChecker);
                const results = await Promise.all([
                    session.call(
                        "start_review_task",
                        validArgs.start_review_task
                    ),
                    session.call(
                        "start_review_task",
                        validArgs.start_review_task
                    ),
                ]);
                expect(results.filter((r) => !r.isError)).toHaveLength(1);
                expect(
                    session.mocks.reviewTaskService.create
                ).toHaveBeenCalledTimes(1);
            }
        );
    });

    describe("input smuggling", () => {
        it.each([
            ["start_review_task", { claimId: { $ne: null } }],
            ["start_review_task", { dataHash: { $ne: null } }],
            ["start_review_task", { dataHash: "x".repeat(32) }],
            ["start_review_task", { dataHash: `${HASH_A}\n` }],
            ["start_review_task", { nameSpace: { $ne: "main" } }],
            ["get_review_task", { reviewTaskId: { $ne: null } }],
            ["get_claim", { claimId: { $gt: "" } }],
            ["list_claims", { personalityId: { $ne: null } }],
            ["add_review_comment", { dataHash: { $ne: null } }],
        ])("%s rejects operator/shape payload %j", async (tool, bad) => {
            session = await connect(factChecker);
            const base =
                validArgs[tool] ??
                ({ reviewTaskId: "t1", claimId: "claim-1" } as any);
            const res = await session.call(tool, { ...base, ...bad });
            expect(res.isError).toBe(true);
            const m = session.mocks;
            expect(m.reviewTaskService.create).not.toHaveBeenCalled();
            expect(m.reviewTaskService.getById).not.toHaveBeenCalled();
            expect(m.reviewTaskService.addComment).not.toHaveBeenCalled();
            expect(m.claimService.getById).not.toHaveBeenCalled();
            expect(m.claimService.listAll).not.toHaveBeenCalled();
        });

        it.each([
            { pageSize: 100000 },
            { pageSize: 0 },
            { page: -1 },
            { order: "asc; drop" },
            { reviewTaskType: "NotAType" },
        ])("list_review_tasks rejects %j", async (bad) => {
            session = await connect(factChecker);
            const res = await session.call("list_review_tasks", {
                reviewTaskType: "Claim",
                ...bad,
            });
            expect(res.isError).toBe(true);
            expect(
                session.mocks.reviewTaskService.listAll
            ).not.toHaveBeenCalled();
        });

        it("list_review_tasks never lets the caller widen the user filter", async () => {
            session = await connect(factChecker);
            await session.call("list_review_tasks", {
                reviewTaskType: "Claim",
                filterUser: { assigned: true },
                nameSpace: "main",
            });
            const arg =
                session.mocks.reviewTaskService.listAll.mock.calls[0]?.[0];
            expect(arg?.filterUser).toEqual({
                assigned: false,
                crossChecked: false,
                reviewed: false,
            });
        });

        it("rejects empty comment bodies", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                { nameSpace: "main" }
            );
            const res = await session.call("add_review_comment", {
                dataHash: HASH_A,
                comment: "",
                text: "",
            });
            expect(res.isError).toBe(true);
            expect(
                session.mocks.reviewTaskService.addComment
            ).not.toHaveBeenCalled();
        });
    });

    describe("error hygiene", () => {
        it("does not leak stack traces or internals when a service throws", async () => {
            session = await connect(factChecker);
            session.mocks.claimService.getById.mockRejectedValue(
                new Error("boom")
            );
            const res = await session.call(
                "start_review_task",
                validArgs.start_review_task
            );
            expect(res.isError).toBe(true);
            expect(res.text).toBe("start_review_task failed: boom");
            expect(res.text).not.toMatch(/\bat .*\(.*:\d+:\d+\)/);
        });
    });

    describe("positive control", () => {
        // Guards the denial tests above: if a fixture stops satisfying its
        // schema, "denied" would pass for the wrong reason (validation).
        it.each(Object.keys(validArgs))(
            "a fact-checker in main can call %s with the fixture args",
            async (tool) => {
                session = await connect(factChecker);
                session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                    tool === "add_review_comment" ? { nameSpace: "main" } : null
                );
                const res = await session.call(tool, validArgs[tool]);
                expect(res.text).not.toMatch(/Input validation/);
                expect(res.isError).toBe(false);
            }
        );

        it("a fact-checker in main can start a review task (suite is not vacuous)", async () => {
            session = await connect(factChecker);
            const res = await session.call(
                "start_review_task",
                validArgs.start_review_task
            );
            expect(res.isError).toBe(false);
            expect(
                session.mocks.reviewTaskService.create
            ).toHaveBeenCalledTimes(1);
        });
    });
});
