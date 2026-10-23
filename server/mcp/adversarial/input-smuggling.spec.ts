import { connect, factChecker, HASH_A, validArgs } from "./harness";
import type { Session } from "./harness";

describe("MCP adversarial: input smuggling", () => {
    let session: Session;
    afterEach(async () => session?.close());

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
        expect(m.reviewTaskService.transitionAtomically).not.toHaveBeenCalled();
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
        expect(session.mocks.reviewTaskService.listAll).not.toHaveBeenCalled();
    });

    it("list_review_tasks never lets the caller widen the user filter", async () => {
        session = await connect(factChecker);
        await session.call("list_review_tasks", {
            reviewTaskType: "Claim",
            filterUser: { assigned: true },
            nameSpace: "main",
        });
        const arg = session.mocks.reviewTaskService.listAll.mock.calls[0]?.[0];
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
