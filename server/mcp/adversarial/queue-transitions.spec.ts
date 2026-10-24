import {
    admin,
    agreedCrossCheck,
    connect,
    factChecker,
    firstTransition,
    HASH_A,
    OTHER_USER_ID,
    publishableReport,
    reviewer,
    storedTask,
} from "./harness";
import type { Session } from "./harness";

describe("MCP adversarial: send to review and publish", () => {
    let session: Session;
    afterEach(async () => session?.close());

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

    it("send_to_review is refused until a cross-check agreed with the label", async () => {
        session = await connect(admin);
        session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
            storedTask("reported", {
                classification: "false",
                crossCheckingClassification: "misleading",
            })
        );
        const res = await session.call("send_to_review", {
            dataHash: HASH_A,
        });
        expect(res.isError).toBe(true);
        expect(res.text).toMatch(/needs a cross-check/);
        expect(
            session.mocks.reviewTaskService.transitionAtomically
        ).not.toHaveBeenCalled();
    });

    it("send_to_review guards the source state and clears the reviewer", async () => {
        session = await connect(admin);
        session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
            storedTask("reported", {
                usersId: [OTHER_USER_ID],
                ...agreedCrossCheck,
            })
        );
        const res = await session.call("send_to_review", {
            dataHash: HASH_A,
        });
        expect(res.isError).toBe(false);
        const [filter, update] = firstTransition(session);
        expect(filter["machine.value"]).toBe("reported");
        expect(update.$set).toEqual({
            "machine.value": "selectReviewer",
            "machine.context.reviewData.reviewerId": null,
        });
    });

    it("send_to_review fails cleanly when the task is no longer reported", async () => {
        session = await connect(factChecker);
        session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
            storedTask("submitted", agreedCrossCheck)
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

    describe("submit_report_to_review", () => {
        const transitions = (s: Session) =>
            s.mocks.reviewTaskService.transitionAtomically.mock.calls as [
                Record<string, any>,
                Record<string, any>
            ][];

        it("is refused to a fact-checker who is not an assignee", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask({ assigned: "draft" }, { usersId: [OTHER_USER_ID] })
            );
            const res = await session.call("submit_report_to_review", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(
                session.mocks.reviewTaskService.transitionAtomically
            ).not.toHaveBeenCalled();
        });

        it("refuses an incomplete report before sending anything to review", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask({ assigned: "draft" }, { classification: "false" })
            );
            const res = await session.call("submit_report_to_review", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/missing summary/);
            expect(
                session.mocks.reviewTaskService.transitionAtomically
            ).not.toHaveBeenCalled();
        });

        it("reports the task and sends it to review without a cross-check", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask({ assigned: "draft" }, publishableReport)
            );
            const res = await session.call("submit_report_to_review", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(false);
            const [submit, send] = transitions(session);
            expect(submit[1].$set).toMatchObject({
                "machine.value": "reported",
            });
            expect(send[0]["machine.value"]).toBe("reported");
            expect(send[1].$set).toEqual({
                "machine.value": "selectReviewer",
                "machine.context.reviewData.reviewerId": null,
            });
        });

        it("only sends a task that is already reported, so a retry works", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("reported", publishableReport)
            );
            const res = await session.call("submit_report_to_review", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(false);
            const calls = transitions(session);
            expect(calls).toHaveLength(1);
            expect(calls[0][1].$set["machine.value"]).toBe("selectReviewer");
        });

        it("still refuses the plain send_to_review without a cross-check", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("reported", publishableReport)
            );
            const res = await session.call("send_to_review", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/needs a cross-check/);
        });
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
});
