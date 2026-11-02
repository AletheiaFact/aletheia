import {
    admin,
    connect,
    factChecker,
    firstTransition,
    HASH_A,
    OTHER_USER_ID,
    reviewer,
    storedTask,
    USER_ID,
    validArgs,
} from "./harness";
import type { Session } from "./harness";

describe("MCP adversarial: work queue hand-out", () => {
    let session: Session;
    afterEach(async () => session?.close());

    it("next_review_task only takes unassigned fact-checking tasks in the caller's namespace and assigns only the caller", async () => {
        session = await connect(factChecker);
        const res = await session.call("next_review_task", {
            usersId: [OTHER_USER_ID],
            machine: { value: "published" },
        });
        expect(res.isError).toBe(false);
        const [filter, update] = firstTransition(session);
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
            const [filter, update] = firstTransition(session);
            expect(filter["machine.value"]).toBe("selectReviewer");
            expect(filter["machine.context.reviewData.reviewerId"]).toBeNull();
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
        const [filter, update] = firstTransition(session);
        expect(filter).toHaveProperty("machine.context.reviewData.usersId.9", {
            $exists: false,
        });
        expect(
            String(update.$addToSet["machine.context.reviewData.usersId"])
        ).toBe(USER_ID);
    });

    it("create_claim enqueues one unassigned task per sentence, never for paragraphs", async () => {
        session = await connect(factChecker);
        session.mocks.claimService.create.mockResolvedValue({
            _id: "claim-1",
        });
        const res = await session.call("create_claim", validArgs.create_claim);
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
