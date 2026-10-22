import {
    connect,
    factChecker,
    firstTransition,
    HASH_B,
    storedTask,
    USER_ID,
    validArgs,
} from "./harness";
import type { Session } from "./harness";

describe("MCP adversarial: workflow forgery via start_review_task", () => {
    let session: Session;
    afterEach(async () => session?.close());

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
        const created = session.mocks.reviewTaskService.create.mock.calls[0][0];
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
        expect(session.mocks.reviewTaskService.create).not.toHaveBeenCalled();
    });

    it("rejects a hash that does not belong to the claim", async () => {
        session = await connect(factChecker);
        const res = await session.call("start_review_task", {
            ...validArgs.start_review_task,
            dataHash: "c".repeat(32),
        });
        expect(res.isError).toBe(true);
        expect(session.mocks.reviewTaskService.create).not.toHaveBeenCalled();
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
        expect(session.mocks.reviewTaskService.create).not.toHaveBeenCalled();
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
        const [filter, update] = firstTransition(session);
        expect(filter["machine.value"]).toBe("unassigned");
        expect(
            update.$set["machine.context.reviewData.usersId"].map(String)
        ).toEqual([USER_ID]);
        expect(session.mocks.reviewTaskService.create).not.toHaveBeenCalled();
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
                session.call("start_review_task", validArgs.start_review_task),
                session.call("start_review_task", validArgs.start_review_task),
            ]);
            expect(results.filter((r) => !r.isError)).toHaveLength(1);
            expect(
                session.mocks.reviewTaskService.create
            ).toHaveBeenCalledTimes(1);
        }
    );
});
