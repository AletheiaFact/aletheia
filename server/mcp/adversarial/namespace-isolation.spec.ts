import {
    connect,
    factChecker,
    MEMBER_ID,
    OTHER_NS,
    validArgs,
} from "./harness";
import type { Session } from "./harness";

describe("MCP adversarial: namespace isolation", () => {
    let session: Session;
    afterEach(async () => session?.close());

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
            session.mocks.reviewTaskService.getById.mockResolvedValue(record);
            session.mocks.claimReviewService.getById.mockResolvedValue(record);
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
        expect(session.mocks.reviewTaskService.create).not.toHaveBeenCalled();
    });
});
