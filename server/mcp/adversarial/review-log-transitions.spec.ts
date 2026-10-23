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

const firstUpdate = (session: Session) =>
    session.mocks.reviewTaskService.updateAtomically.mock.calls[0] as [
        Record<string, any>,
        Record<string, any>
    ];

describe("MCP adversarial: writing, cross-checking and rejecting", () => {
    let session: Session;
    afterEach(async () => session?.close());

    describe("save_review_log", () => {
        it("is refused to a fact-checker who is not an assignee", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask({ assigned: "draft" }, { usersId: [OTHER_USER_ID] })
            );
            const res = await session.call("save_review_log", {
                dataHash: HASH_A,
                summary: "Resumo.",
            });
            expect(res.isError).toBe(true);
            expect(
                session.mocks.reviewTaskService.updateAtomically
            ).not.toHaveBeenCalled();
        });

        it("is refused once the report left the writing state", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask("reported")
            );
            const res = await session.call("save_review_log", {
                dataHash: HASH_A,
                summary: "Resumo.",
            });
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/Only tasks being written/);
        });

        it("guards on the writing state and the caller as assignee, and stores the editor document", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask({ assigned: "undraft" })
            );
            const res = await session.call("save_review_log", {
                dataHash: HASH_A,
                summary: "O dado está correto.",
                classification: "trustworthy",
                sources: [
                    {
                        href: "https://example.org/dado",
                        field: "summary",
                        quotedText: "dado",
                    },
                ],
            });
            expect(res.isError).toBe(false);
            const [filter, update] = firstUpdate(session);
            expect(filter["machine.value.assigned"]).toEqual({ $exists: true });
            expect(String(filter["machine.context.reviewData.usersId"])).toBe(
                USER_ID
            );
            const set = update.$set;
            expect(set["machine.value"]).toEqual({ assigned: "draft" });
            expect(set["machine.context.reviewData.summary"]).toMatch(
                /^O {{[^|]+\|dado}} está correto\.$/
            );
            expect(set["machine.context.reviewData.visualEditor"].type).toBe(
                "doc"
            );
            expect(
                set["machine.context.reviewData.reviewDataHtml"].summary
            ).toContain("<sup>1</sup>");
        });

        it.each([
            ["HTML", { summary: "<img src=x onerror=alert(1)>" }],
            ["source markup", { report: "texto {{id|x}}" }],
            [
                "a quote that is not in its field",
                {
                    report: "Texto.",
                    sources: [
                        {
                            href: "https://example.org",
                            field: "report",
                            quotedText: "ausente",
                        },
                    ],
                },
            ],
        ])("rejects %s", async (_label, input) => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask({ assigned: "draft" })
            );
            const res = await session.call("save_review_log", {
                dataHash: HASH_A,
                ...input,
            });
            expect(res.isError).toBe(true);
            expect(
                session.mocks.reviewTaskService.updateAtomically
            ).not.toHaveBeenCalled();
        });

        it("rejects a source URL that is not http(s)", async () => {
            session = await connect(factChecker);
            const res = await session.call("save_review_log", {
                dataHash: HASH_A,
                sources: [{ href: "javascript:alert(1)" }],
            });
            expect(res.isError).toBe(true);
        });

        it("rejects an unknown label", async () => {
            session = await connect(factChecker);
            const res = await session.call("save_review_log", {
                dataHash: HASH_A,
                classification: "in-progress",
            });
            expect(res.isError).toBe(true);
        });
    });

    describe("submit_report", () => {
        it("refuses an incomplete report and names every gap", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask({ assigned: "draft" }, { classification: "false" })
            );
            const res = await session.call("submit_report", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(
                /missing summary, report, verification, questions, sources/
            );
            expect(
                session.mocks.reviewTaskService.transitionAtomically
            ).not.toHaveBeenCalled();
        });

        it("moves a complete report to reported and clears the old cross-check", async () => {
            session = await connect(factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                storedTask({ assigned: "draft" }, publishableReport)
            );
            const res = await session.call("submit_report", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(false);
            const [filter, update] = firstTransition(session);
            expect(String(filter["machine.context.reviewData.usersId"])).toBe(
                USER_ID
            );
            expect(update.$set).toMatchObject({
                "machine.value": "reported",
                "machine.context.reviewData.crossCheckingClassification": "",
            });
        });
    });

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
