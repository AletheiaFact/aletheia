import {
    admin,
    connect,
    factChecker,
    firstTransition,
    HASH_A,
    OTHER_USER_ID,
    publishableReport,
    reviewer,
    storedTask,
    USER_ID,
} from "./harness";
import type { Session } from "./harness";

describe("MCP adversarial: cross-checking and rejecting", () => {
    let session: Session;
    afterEach(async () => session?.close());

    describe("cross-check", () => {
        it("claim_cross_check never hands a writer their own task", async () => {
            session = await connect(factChecker);
            await session.call("claim_cross_check", {});
            const [filter, update] = firstTransition(session);
            expect(filter["machine.value"]).toBe("selectCrossChecker");
            expect(
                String(filter["machine.context.reviewData.usersId"].$ne)
            ).toBe(USER_ID);
            expect(update.$set["machine.value"]).toBe("cross-checking");
        });

        it("submit_cross_check is refused to anyone but the cross-checker", async () => {
            session = await connect(admin);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("cross-checking", {
                    ...publishableReport,
                    crossCheckerId: OTHER_USER_ID,
                })
            );
            const res = await session.call("submit_cross_check", {
                dataHash: HASH_A,
                classification: "false",
                comment: "Conferi.",
            });
            expect(res.isError).toBe(true);
            expect(
                session.mocks.reviewTaskService.transitionAtomically
            ).not.toHaveBeenCalled();
        });

        it.each([
            ["false", "selectReviewer"],
            ["misleading", { assigned: "draft" }],
        ])(
            "a cross-check labelled %s sends the task to %j",
            async (label, target) => {
                session = await connect(factChecker);
                session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                    storedTask("cross-checking", {
                        ...publishableReport,
                        usersId: [OTHER_USER_ID],
                        crossCheckerId: USER_ID,
                    })
                );
                const res = await session.call("submit_cross_check", {
                    dataHash: HASH_A,
                    classification: label,
                    comment: "Conferi as fontes.",
                });
                expect(res.isError).toBe(false);
                const [filter, update] = firstTransition(session);
                expect(
                    String(filter["machine.context.reviewData.crossCheckerId"])
                ).toBe(USER_ID);
                expect(update.$set["machine.value"]).toEqual(target);
                expect(
                    update.$set[
                        "machine.context.reviewData.crossCheckingClassification"
                    ]
                ).toBe(label);
                // an agreeing cross-check enters the review backlog with no reviewer
                expect(
                    "machine.context.reviewData.reviewerId" in update.$set
                ).toBe(target === "selectReviewer");
            }
        );
    });

    describe("review", () => {
        it("claim_review_task never hands a reviewer a task they cross-checked", async () => {
            session = await connect(reviewer);
            await session.call("claim_review_task", {});
            const [filter] = firstTransition(session);
            expect(
                String(filter["machine.context.reviewData.crossCheckerId"].$ne)
            ).toBe(USER_ID);
        });

        it("reject_review_task is refused to anyone but the reviewer or an admin", async () => {
            session = await connect(reviewer);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("submitted", {
                    ...publishableReport,
                    reviewerId: OTHER_USER_ID,
                })
            );
            const res = await session.call("reject_review_task", {
                dataHash: HASH_A,
                rejectionComment: "Falta fonte primária.",
            });
            expect(res.isError).toBe(true);
            expect(
                session.mocks.reviewTaskService.transitionAtomically
            ).not.toHaveBeenCalled();
        });

        it("reject_review_task sends the task back to its writers with the comment", async () => {
            session = await connect(reviewer);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("submitted", publishableReport)
            );
            const res = await session.call("reject_review_task", {
                dataHash: HASH_A,
                rejectionComment: "Falta fonte primária.",
            });
            expect(res.isError).toBe(false);
            const [filter, update] = firstTransition(session);
            expect(filter["machine.value"]).toBe("submitted");
            expect(update.$set).toEqual({
                "machine.value": { assigned: "draft" },
                "machine.context.reviewData.rejectionComment":
                    "Falta fonte primária.",
            });
        });
    });
});
