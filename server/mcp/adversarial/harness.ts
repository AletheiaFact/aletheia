import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AbilityFactory } from "../../auth/ability/ability.factory";
import type { McpToolDeps } from "../mcp.service";
import { ReviewQueueService } from "../review-workflow/review-queue.service";
import { ReviewWorkflowService } from "../review-workflow/review-workflow.service";
import { registerReadTools } from "../tools/read-tools";
import { registerWriteTools } from "../tools/write-tools";

/**
 * Shared harness for the adversarial suite (the *.spec.ts files next to this
 * one): an agent (or a compromised token) drives the real tool registry
 * through a real MCP client/server pair and tries to bypass authorization,
 * impersonate another user, escape its namespace, forge workflow state and
 * smuggle operators through arguments. Only the data services are mocked;
 * AbilityFactory, the authz helpers, the Zod schemas and
 * ReviewWorkflowService are the production code.
 */

export const HASH_A = "a".repeat(32);
export const HASH_B = "b".repeat(32);
export const OTHER_NS = "secret-ns";
// Queue tools store user ids as ObjectIds, so fixtures use valid hex ids.
export const USER_ID = "6ad9aa000000000000000011";
export const MEMBER_ID = "6ad9aa000000000000000012";
export const OTHER_USER_ID = "6ad9aa000000000000000013";

const mainUser = (role: string, extra: Record<string, unknown> = {}) => ({
    isM2M: false,
    _id: USER_ID,
    id: USER_ID,
    role: { main: role },
    status: "active",
    ...extra,
});

export const regular = mainUser("regular");
export const factChecker = mainUser("fact-checker");
export const reviewer = mainUser("reviewer");
export const admin = mainUser("admin");

export const m2m = {
    isM2M: true,
    clientId: "client-1",
    role: { main: "integration" },
};

// A stored review task as getReviewTaskByDataHash returns it.
export const storedTask = (
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

export const publishableReport = {
    reviewerId: USER_ID,
    classification: "false",
    summary: "s",
    report: "r",
    verification: "v",
    questions: ["q"],
    sources: [{ href: "https://example.org" }],
};

// A report whose cross-check agreed with its label: ready for review.
export const agreedCrossCheck = {
    classification: "false",
    crossCheckingClassification: "false",
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
            resolveMethodologyForNewTask: vi.fn(
                (requested?: string) => requested || "aletheia"
            ),
            createAssigned: vi
                .fn()
                .mockResolvedValue(storedTask({ assigned: "undraft" })),
            updateAtomically: vi
                .fn()
                .mockResolvedValue(storedTask({ assigned: "draft" })),
            _createCrossCheckingComment: vi
                .fn()
                .mockResolvedValue({ _id: "6ad9aa0000000000000000cc" }),
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
    // One mock stands in for both ReviewTaskService and ReviewTaskQueueService
    // so specs assert on a single `mocks.reviewTaskService`.
    const reviewWorkflowService = new ReviewWorkflowService(
        mocks.claimService as any,
        mocks.reviewTaskService as any,
        mocks.reviewTaskService as any
    );
    const reviewQueueService = new ReviewQueueService(
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
        reviewQueueService,
    } as unknown as McpToolDeps;
    return { deps, mocks };
}

export async function connect(user: any) {
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

export type Session = Awaited<ReturnType<typeof connect>>;

/** The [filter, update] the first transitionAtomically call received. */
export const firstTransition = (session: Session) =>
    session.mocks.reviewTaskService.transitionAtomically.mock.calls[0] as [
        Record<string, any>,
        Record<string, any>
    ];

export const validArgs: Record<string, Record<string, unknown>> = {
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
    save_review_log: { dataHash: HASH_A, summary: "Resumo." },
    submit_report: { dataHash: HASH_A },
    release_review_task: { dataHash: HASH_A, reason: "not-checkable" },
    send_to_cross_check: { dataHash: HASH_A },
    claim_cross_check: {},
    submit_cross_check: {
        dataHash: HASH_A,
        classification: "false",
        comment: "Conferi as fontes.",
    },
    reject_review_task: { dataHash: HASH_A, rejectionComment: "Falta fonte." },
};

// Stored task each data_hash tool needs for its happy path, and the role
// that is allowed to call it (positive control).
export const happyPath: Record<string, { task?: unknown; user: unknown }> = {
    add_review_comment: { task: { nameSpace: "main" }, user: factChecker },
    join_review_task: {
        task: storedTask({ assigned: "draft" }, { usersId: [OTHER_USER_ID] }),
        user: factChecker,
    },
    send_to_review: {
        task: storedTask("reported", agreedCrossCheck),
        user: factChecker,
    },
    publish_review_task: {
        task: storedTask("submitted", publishableReport),
        user: factChecker,
    },
    claim_review_task: { user: reviewer },
    save_review_log: {
        task: storedTask({ assigned: "draft" }),
        user: factChecker,
    },
    submit_report: {
        task: storedTask({ assigned: "draft" }, publishableReport),
        user: factChecker,
    },
    release_review_task: {
        task: storedTask({ assigned: "draft" }),
        user: factChecker,
    },
    send_to_cross_check: { task: storedTask("reported"), user: factChecker },
    claim_cross_check: { user: factChecker },
    submit_cross_check: {
        task: storedTask("cross-checking", {
            ...publishableReport,
            usersId: [OTHER_USER_ID],
            crossCheckerId: USER_ID,
        }),
        user: factChecker,
    },
    reject_review_task: {
        task: storedTask("submitted", publishableReport),
        user: reviewer,
    },
};

export const READ_TOOLS = [
    "get_review_log",
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
    // Static registry only: no namespace, user or database access
    "list_classification_methodologies",
    "list_verification_requests",
    "get_verification_request",
    "search_topics",
];
