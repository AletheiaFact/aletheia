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
// Queue tools store user ids as ObjectIds, so fixtures use valid hex ids.
const USER_ID = "6ad9aa000000000000000011";
const MEMBER_ID = "6ad9aa000000000000000012";
const OTHER_USER_ID = "6ad9aa000000000000000013";

const mainUser = (role: string, extra: Record<string, unknown> = {}) => ({
    isM2M: false,
    _id: USER_ID,
    id: USER_ID,
    role: { main: role },
    status: "active",
    ...extra,
});

const regular = mainUser("regular");
const factChecker = mainUser("fact-checker");
const reviewer = mainUser("reviewer");
const admin = mainUser("admin");

// A stored review task as getReviewTaskByDataHash returns it.
const storedTask = (
    value: unknown,
    reviewData: Record<string, unknown> = {},
    extra: Record<string, unknown> = {}
) => ({
    _id: "6ad9aa0000000000000000aa",
    data_hash: HASH_A,
    nameSpace: "main",
    target: "claim-1",
    machine: {
        value,
        context: { reviewData: { usersId: [USER_ID], ...reviewData } },
    },
    ...extra,
});

const publishableReport = {
    reviewerId: USER_ID,
    classification: "false",
    summary: "s",
    report: "r",
    verification: "v",
    questions: ["q"],
    sources: [{ href: "https://example.org" }],
};
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
            transitionAtomically: vi
                .fn()
                .mockResolvedValue(storedTask({ assigned: "undraft" })),
            findOldest: vi.fn().mockResolvedValue([]),
            countMatching: vi.fn().mockResolvedValue(0),
            publishSubmitted: vi
                .fn()
                .mockResolvedValue(storedTask("published", publishableReport)),
            enqueueUnassigned: vi.fn().mockResolvedValue(true),
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
                slug === OTHER_NS ? { slug, users: [MEMBER_ID] } : null
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
    next_review_task: {},
    join_review_task: { dataHash: HASH_A },
    send_to_review: { dataHash: HASH_A },
    claim_review_task: {},
    publish_review_task: { dataHash: HASH_A },
};

// Stored task each data_hash tool needs for its happy path, and the role
// that is allowed to call it (positive control).
const happyPath: Record<string, { task?: unknown; user: unknown }> = {
    add_review_comment: { task: { nameSpace: "main" }, user: factChecker },
    join_review_task: {
        task: storedTask({ assigned: "draft" }, { usersId: [OTHER_USER_ID] }),
        user: factChecker,
    },
    send_to_review: { task: storedTask("reported"), user: factChecker },
    publish_review_task: {
        task: storedTask("submitted", publishableReport),
        user: factChecker,
    },
    claim_review_task: { user: reviewer },
};

const READ_TOOLS = [
    "next_cross_checking",
    "list_my_review_tasks",
    "search",
    "list_claims",
    "get_claim",
    "list_personalities",
    "get_personality",
    "list_sources",
    "get_claim_review",
    "list_review_tasks",
    "get_review_task",
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

        it("offers no delete/publish/role/admin tool beyond the audited publish", async () => {
            session = await connect(factChecker);
            const { tools } = await session.client.listTools();
            const forbidden = /delete|remove|publish|role|admin|user|assign/i;
            // publish_review_task is in scope by decision (task queue spec)
            // and covered by the "work queue" block below.
            const audited = ["publish_review_task"];
            expect(
                tools
                    .map((t) => t.name)
                    .filter((n) => forbidden.test(n) && !audited.includes(n))
            ).toEqual([]);
        });
    });

    describe("privilege escalation: read-only role", () => {
        it.each(Object.keys(validArgs))(
            "regular user cannot call %s",
            async (tool) => {
                session = await connect(regular);
                // the stored task exists, so a denial is about the role
                session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                    happyPath[tool]?.task ?? null
                );
                const res = await session.call(tool, validArgs[tool]);
                expect(res.isError).toBe(true);
                // no data service may be touched on a denied write
                const m = session.mocks;
                expect(
                    m.reviewTaskService.transitionAtomically
                ).not.toHaveBeenCalled();
                expect(
                    m.reviewTaskService.publishSubmitted
                ).not.toHaveBeenCalled();
                expect(
                    m.reviewTaskService.enqueueUnassigned
                ).not.toHaveBeenCalled();
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
                user: { _id: USER_ID, role: { main: "admin" } },
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
            "next_review_task",
            "claim_review_task",
            "next_cross_checking",
            "list_my_review_tasks",
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
            session = await connect({ ...factChecker, _id: MEMBER_ID });
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
            "next_review_task",
            "join_review_task",
            "send_to_review",
            "claim_review_task",
            "publish_review_task",
            "next_cross_checking",
            "list_my_review_tasks",
        ])(
            "M2M token cannot call %s (attributes writes to a user)",
            async (tool) => {
                session = await connect(m2m);
                session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                    happyPath[tool]?.task ?? { nameSpace: "main" }
                );
                const res = await session.call(tool, validArgs[tool] ?? {});
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
                USER_ID,
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
                expect.objectContaining({ user: USER_ID })
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
                reviewerId: USER_ID,
                crossCheckerId: USER_ID,
            });
            expect(res.isError).toBe(false);
            const created =
                session.mocks.reviewTaskService.create.mock.calls[0][0];
            // the web app's persisted shape for the compound `assigned` state
            expect(created.machine.value).toEqual({ assigned: "undraft" });
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

        it("takes a queued (unassigned) task atomically instead of refusing it", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("unassigned", { usersId: [] })
            );
            const res = await session.call(
                "start_review_task",
                validArgs.start_review_task
            );
            expect(res.isError).toBe(false);
            const [filter, update] =
                session.mocks.reviewTaskService.transitionAtomically.mock
                    .calls[0];
            expect(filter["machine.value"]).toBe("unassigned");
            expect(
                update.$set["machine.context.reviewData.usersId"].map(String)
            ).toEqual([USER_ID]);
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

    describe("work queue: hand-out and transitions", () => {
        const lastTransition = () =>
            session.mocks.reviewTaskService.transitionAtomically.mock
                .calls[0] as [Record<string, any>, Record<string, any>];

        it("next_review_task only takes unassigned fact-checking tasks in the caller's namespace and assigns only the caller", async () => {
            session = await connect(factChecker);
            const res = await session.call("next_review_task", {
                usersId: [OTHER_USER_ID],
                machine: { value: "published" },
            });
            expect(res.isError).toBe(false);
            const [filter, update] = lastTransition();
            expect(filter).toMatchObject({
                "machine.value": "unassigned",
                nameSpace: "main",
                reviewTaskType: "Claim",
                reportModel: "Fact-checking",
            });
            expect(update.$set["machine.value"]).toEqual({
                assigned: "undraft",
            });
            expect(
                update.$set["machine.context.reviewData.usersId"].map(String)
            ).toEqual([USER_ID]);
        });

        it("next_review_task reports an empty queue without erroring", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.transitionAtomically.mockResolvedValue(
                null
            );
            const res = await session.call("next_review_task", {});
            expect(res.isError).toBe(false);
            expect(JSON.parse(res.text)).toMatchObject({ task: null });
        });

        it("claim_review_task is reviewer/admin only", async () => {
            session = await connect(factChecker);
            const res = await session.call("claim_review_task", {});
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/reviewers or admins/);
            expect(
                session.mocks.reviewTaskService.transitionAtomically
            ).not.toHaveBeenCalled();
        });

        it.each([reviewer, admin])(
            "claim_review_task takes only backlog tasks with no reviewer that the caller did not write (%j)",
            async (user) => {
                session = await connect(user);
                await session.call("claim_review_task", {});
                const [filter, update] = lastTransition();
                expect(filter["machine.value"]).toBe("selectReviewer");
                expect(
                    filter["machine.context.reviewData.reviewerId"]
                ).toBeNull();
                expect(
                    String(filter["machine.context.reviewData.usersId"].$ne)
                ).toBe(USER_ID);
                expect(update.$set["machine.value"]).toBe("submitted");
                expect(
                    String(update.$set["machine.context.reviewData.reviewerId"])
                ).toBe(USER_ID);
            }
        );

        it.each(["submitted", "published", "selectReviewer", "cross-checking"])(
            "join_review_task refuses a task in %s",
            async (value) => {
                session = await connect(factChecker);
                session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                    storedTask(value, { usersId: [OTHER_USER_ID] })
                );
                const res = await session.call("join_review_task", {
                    dataHash: HASH_A,
                });
                expect(res.isError).toBe(true);
                expect(
                    session.mocks.reviewTaskService.transitionAtomically
                ).not.toHaveBeenCalled();
            }
        );

        it("join_review_task is a no-op for an existing assignee", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("reported")
            );
            const res = await session.call("join_review_task", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(false);
            expect(
                session.mocks.reviewTaskService.transitionAtomically
            ).not.toHaveBeenCalled();
        });

        it("join_review_task enforces the assignee cap, also atomically", async () => {
            session = await connect(factChecker);
            const full = Array.from(
                { length: 10 },
                (_, i) => `6ad9aa0000000000000001${String(i).padStart(2, "0")}`
            );
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("reported", { usersId: full })
            );
            const res = await session.call("join_review_task", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/maximum of 10/);

            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("reported", { usersId: [OTHER_USER_ID] })
            );
            await session.call("join_review_task", { dataHash: HASH_A });
            const [filter, update] = lastTransition();
            expect(filter).toHaveProperty(
                "machine.context.reviewData.usersId.9",
                { $exists: false }
            );
            expect(
                String(update.$addToSet["machine.context.reviewData.usersId"])
            ).toBe(USER_ID);
        });

        it("send_to_review is refused to a fact-checker who is not an assignee", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("reported", { usersId: [OTHER_USER_ID] })
            );
            const res = await session.call("send_to_review", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(
                session.mocks.reviewTaskService.transitionAtomically
            ).not.toHaveBeenCalled();
        });

        it("send_to_review guards the source state and clears the reviewer", async () => {
            session = await connect(admin);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("reported", { usersId: [OTHER_USER_ID] })
            );
            const res = await session.call("send_to_review", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(false);
            const [filter, update] = lastTransition();
            expect(filter["machine.value"]).toBe("reported");
            expect(update.$set).toEqual({
                "machine.value": "selectReviewer",
                "machine.context.reviewData.reviewerId": null,
            });
        });

        it("send_to_review fails cleanly when the task is no longer reported", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("submitted")
            );
            session.mocks.reviewTaskService.transitionAtomically.mockResolvedValue(
                null
            );
            const res = await session.call("send_to_review", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/Only reported tasks/);
        });

        it("publish_review_task is refused to anyone but the reviewer or an admin", async () => {
            session = await connect(reviewer);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("submitted", {
                    ...publishableReport,
                    reviewerId: OTHER_USER_ID,
                })
            );
            const res = await session.call("publish_review_task", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(
                session.mocks.reviewTaskService.publishSubmitted
            ).not.toHaveBeenCalled();
        });

        it("an admin may publish a task reviewed by someone else", async () => {
            session = await connect(admin);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("submitted", {
                    ...publishableReport,
                    reviewerId: OTHER_USER_ID,
                })
            );
            const res = await session.call("publish_review_task", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(false);
            expect(
                session.mocks.reviewTaskService.publishSubmitted
            ).toHaveBeenCalledTimes(1);
        });

        it.each(["reported", "selectReviewer", "published"])(
            "publish_review_task refuses a task in %s",
            async (value) => {
                session = await connect(factChecker);
                session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                    storedTask(value, publishableReport)
                );
                const res = await session.call("publish_review_task", {
                    dataHash: HASH_A,
                });
                expect(res.isError).toBe(true);
                expect(
                    session.mocks.reviewTaskService.publishSubmitted
                ).not.toHaveBeenCalled();
            }
        );

        it("publish_review_task refuses an incomplete report and names the gaps", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("submitted", {
                    ...publishableReport,
                    summary: "  ",
                    sources: [],
                })
            );
            const res = await session.call("publish_review_task", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/missing summary, sources/);
            expect(
                session.mocks.reviewTaskService.publishSubmitted
            ).not.toHaveBeenCalled();
        });

        it("publish_review_task reports a lost race instead of publishing twice", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("submitted", publishableReport)
            );
            session.mocks.reviewTaskService.publishSubmitted.mockResolvedValue(
                null
            );
            const res = await session.call("publish_review_task", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/published or moved by someone else/);
        });

        it.each([
            ["next_cross_checking", "crossCheckerId"],
            ["list_my_review_tasks", "reviewerId"],
        ])("%s only returns the caller's own tasks", async (tool, field) => {
            session = await connect(factChecker);
            await session.call(tool, { [field]: OTHER_USER_ID });
            const [filter] =
                session.mocks.reviewTaskService.findOldest.mock.calls[0];
            expect(String(filter[`machine.context.reviewData.${field}`])).toBe(
                USER_ID
            );
            expect(filter.nameSpace).toBe("main");
        });

        it.each([
            [
                "assigned",
                { assigned: true, crossChecked: false, reviewed: false },
            ],
            [
                "reviewed",
                { assigned: false, crossChecked: false, reviewed: true },
            ],
        ])(
            "list_review_tasks mine=%s narrows to the caller",
            async (mine, filterUser) => {
                session = await connect(factChecker);
                await session.call("list_review_tasks", {
                    reviewTaskType: "Claim",
                    mine,
                });
                expect(
                    session.mocks.reviewTaskService.listAll.mock.calls[0][0]
                        .filterUser
                ).toEqual(filterUser);
            }
        );

        it("list_review_tasks mine needs a user session", async () => {
            session = await connect(m2m);
            const res = await session.call("list_review_tasks", {
                reviewTaskType: "Claim",
                mine: "assigned",
            });
            expect(res.isError).toBe(true);
            expect(
                session.mocks.reviewTaskService.listAll
            ).not.toHaveBeenCalled();
        });

        it("create_claim enqueues one unassigned task per sentence, never for paragraphs", async () => {
            session = await connect(factChecker);
            session.mocks.claimService.create.mockResolvedValue({
                _id: "claim-1",
            });
            const res = await session.call(
                "create_claim",
                validArgs.create_claim
            );
            expect(res.isError).toBe(false);
            expect(JSON.parse(res.text).queuedReviewTasks).toBe(1);
            const calls =
                session.mocks.reviewTaskService.enqueueUnassigned.mock.calls;
            expect(calls).toHaveLength(1);
            expect(calls[0][0]).toMatchObject({
                data_hash: HASH_A,
                nameSpace: "main",
                target: "claim-1",
                machine: {
                    value: "unassigned",
                    context: { reviewData: { usersId: [] } },
                },
            });
        });
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
            ["join_review_task", { dataHash: { $ne: null } }],
            ["send_to_review", { dataHash: { $regex: "." } }],
            ["publish_review_task", { dataHash: { $ne: null } }],
            ["next_review_task", { nameSpace: { $ne: "main" } }],
            ["claim_review_task", { nameSpace: { $ne: "main" } }],
        ])("%s rejects operator/shape payload %j", async (tool, bad) => {
            session = await connect(factChecker);
            const base =
                validArgs[tool] ??
                ({ reviewTaskId: "t1", claimId: "claim-1" } as any);
            const res = await session.call(tool, { ...base, ...bad });
            expect(res.isError).toBe(true);
            const m = session.mocks;
            expect(m.reviewTaskService.create).not.toHaveBeenCalled();
            expect(
                m.reviewTaskService.transitionAtomically
            ).not.toHaveBeenCalled();
            expect(
                m.reviewTaskService.getReviewTaskByDataHash
            ).not.toHaveBeenCalled();
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
                session = await connect(happyPath[tool]?.user ?? factChecker);
                session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                    happyPath[tool]?.task ?? null
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
