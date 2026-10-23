import {
    admin,
    connect,
    factChecker,
    firstTransition,
    HASH_A,
    OTHER_USER_ID,
    storedTask,
    USER_ID,
} from "./harness";
import type { Session } from "./harness";

describe("MCP adversarial: releasing and picking up writing tasks", () => {
    let session: Session;
    afterEach(async () => session?.close());

    describe("release_review_task", () => {
        it("returns a task to the queue and records who released it", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask({ assigned: "undraft" })
            );
            const res = await session.call("release_review_task", {
                dataHash: HASH_A,
                reason: "not-checkable",
                note: "É o crédito da matéria.",
            });
            expect(res.isError).toBe(false);
            const [, update] = firstTransition(session);
            expect(update.$set["machine.value"]).toBe("unassigned");
            const release = update.$push["machine.context.reviewData.releases"];
            expect(String(release.userId)).toBe(USER_ID);
            expect(release.reason).toBe("not-checkable");
        });

        it("keeps the task with the other assignees when one leaves", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask(
                    { assigned: "draft" },
                    { usersId: [USER_ID, OTHER_USER_ID] }
                )
            );
            await session.call("release_review_task", {
                dataHash: HASH_A,
                reason: "other",
            });
            const [, update] = firstTransition(session);
            expect(update.$set).toBeUndefined();
            expect(
                String(update.$pull["machine.context.reviewData.usersId"])
            ).toBe(USER_ID);
        });
    });

    describe("next_review_task", () => {
        it("refuses a fact-checker who already has a task being written", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.countMatching.mockResolvedValue(1);
            const res = await session.call("next_review_task", {});
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/submit or release/);
            expect(
                session.mocks.reviewTaskService.transitionAtomically
            ).not.toHaveBeenCalled();
        });

        it("skips tasks the caller released", async () => {
            session = await connect(admin);
            await session.call("next_review_task", {});
            const [filter] = firstTransition(session);
            expect(
                String(filter["machine.context.reviewData.releases.userId"].$ne)
            ).toBe(USER_ID);
        });
    });
});
