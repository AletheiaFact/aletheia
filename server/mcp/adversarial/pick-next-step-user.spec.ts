import {
    agreedCrossCheck,
    CHECKER_ID,
    connect,
    factChecker,
    firstTransition,
    HASH_A,
    MEMBER_ID,
    OTHER_NS,
    OTHER_USER_ID,
    publishableReport,
    REGULAR_ID,
    regular,
    REVIEWER_ID,
    storedTask,
    USER_ID,
} from "./harness";
import type { Session } from "./harness";

const PERMISSION = "(not allowed for this account)";
const STATE = "not a permission problem";
const PICK = "(the picked user cannot take this step";

// The report as the writer finished it; publishableReport also names the
// writer as reviewer, which a task waiting for a pick never has.
const report = { ...publishableReport, reviewerId: null };

/**
 * The writer of a report picks who cross-checks or reviews it, as on the
 * web: list_assignable_users offers the web picker's people, and the send
 * tools take the pick and move the task straight to that user. Picks the
 * web would not offer are refused without touching the task, and a
 * non-writer learns nothing about users.
 */
describe("MCP adversarial: the writer picks the cross-checker or reviewer", () => {
    let session: Session;
    afterEach(async () => session?.close());

    const as = async (
        user: Record<string, unknown>,
        task: ReturnType<typeof storedTask>
    ) => {
        session = await connect(user);
        session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
            task
        );
        return session;
    };
    const transitions = () =>
        session.mocks.reviewTaskService.transitionAtomically.mock.calls;
    const users = () => session.mocks.usersService;

    describe("list_assignable_users", () => {
        it("offers the web picker's cross-checkers, minus the writers", async () => {
            await as(factChecker, storedTask("reported", report));
            const res = await session.call("list_assignable_users", {
                dataHash: HASH_A,
                for: "crossCheck",
                name: "che",
            });
            expect(res.isError).toBe(false);
            expect(users().findAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    searchName: "che",
                    filterOutRoles: ["regular"],
                    nameSpaceSlug: "main",
                })
            );
            const ids = JSON.parse(res.text).users.map((u: any) => u.id);
            expect(ids).toContain(CHECKER_ID);
            expect(ids).not.toContain(USER_ID);
        });

        it("leaves fact-checkers and the cross-checker out of reviewers", async () => {
            await as(
                factChecker,
                storedTask("selectReviewer", {
                    ...report,
                    ...agreedCrossCheck,
                    crossCheckerId: REVIEWER_ID,
                })
            );
            const res = await session.call("list_assignable_users", {
                dataHash: HASH_A,
                for: "review",
            });
            expect(res.isError).toBe(false);
            expect(users().findAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    filterOutRoles: ["regular", "fact-checker"],
                })
            );
            const ids = JSON.parse(res.text).users.map((u: any) => u.id);
            expect(ids).not.toContain(REVIEWER_ID);
        });

        it("is refused to a non-writer, who learns nothing about users", async () => {
            await as(
                factChecker,
                storedTask("reported", { ...report, usersId: [OTHER_USER_ID] })
            );
            const res = await session.call("list_assignable_users", {
                dataHash: HASH_A,
                for: "crossCheck",
            });
            expect(res.isError).toBe(true);
            expect(res.text).toContain(PERMISSION);
            expect(users().findAll).not.toHaveBeenCalled();
        });

        it("rejects an unknown step (400)", async () => {
            await as(factChecker, storedTask("reported", report));
            const res = await session.call("list_assignable_users", {
                dataHash: HASH_A,
                for: "publish",
            });
            expect(res.isError).toBe(true);
            expect(users().findAll).not.toHaveBeenCalled();
        });
    });

    describe("send_to_cross_check with crossCheckerId", () => {
        it("makes the pick the cross-checker of a reported task", async () => {
            await as(factChecker, storedTask("reported", report));
            const res = await session.call("send_to_cross_check", {
                dataHash: HASH_A,
                crossCheckerId: CHECKER_ID,
            });
            expect(res.isError).toBe(false);
            const [filter, update] = firstTransition(session);
            expect(filter.$or).toContainEqual({ "machine.value": "reported" });
            expect(
                String(filter["machine.context.reviewData.usersId"].$ne)
            ).toBe(CHECKER_ID);
            expect(update.$set["machine.value"]).toBe("cross-checking");
            expect(
                String(update.$set["machine.context.reviewData.crossCheckerId"])
            ).toBe(CHECKER_ID);
        });

        it("takes a task out of the cross-check backlog (after sendToCrossCheck)", async () => {
            await as(
                factChecker,
                storedTask("selectCrossChecker", {
                    ...report,
                    crossCheckerId: null,
                })
            );
            const res = await session.call("send_to_cross_check", {
                dataHash: HASH_A,
                crossCheckerId: CHECKER_ID,
            });
            expect(res.isError).toBe(false);
            const [filter] = firstTransition(session);
            expect(filter.$or).toContainEqual({
                "machine.value": "selectCrossChecker",
                "machine.context.reviewData.crossCheckerId": null,
            });
        });

        it("is a no-op when the pick already cross-checks it", async () => {
            await as(
                factChecker,
                storedTask("cross-checking", {
                    ...report,
                    crossCheckerId: CHECKER_ID,
                })
            );
            const res = await session.call("send_to_cross_check", {
                dataHash: HASH_A,
                crossCheckerId: CHECKER_ID,
            });
            expect(res.isError).toBe(false);
            expect(transitions()).toHaveLength(0);
        });

        it("refuses, as a state conflict, a task another cross-checker took", async () => {
            await as(
                factChecker,
                storedTask("cross-checking", {
                    ...report,
                    crossCheckerId: OTHER_USER_ID,
                })
            );
            session.mocks.reviewTaskService.transitionAtomically.mockResolvedValue(
                null
            );
            const res = await session.call("send_to_cross_check", {
                dataHash: HASH_A,
                crossCheckerId: CHECKER_ID,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toContain(STATE);
        });

        const badPicks: [string, string][] = [
            ["a regular user", REGULAR_ID],
            ["the writer", USER_ID],
            ["an unknown user", "6ad9aa0000000000000000ff"],
        ];
        for (const [who, id] of badPicks) {
            it(`refuses ${who} without touching the task`, async () => {
                await as(factChecker, storedTask("reported", report));
                const res = await session.call("send_to_cross_check", {
                    dataHash: HASH_A,
                    crossCheckerId: id,
                });
                expect(res.isError).toBe(true);
                expect(res.text).toContain(PICK);
                expect(res.text).not.toContain(PERMISSION);
                expect(transitions()).toHaveLength(0);
            });
        }

        it("refuses a user outside the task's namespace", async () => {
            const member = {
                ...factChecker,
                _id: MEMBER_ID,
                id: MEMBER_ID,
                role: { [OTHER_NS]: "fact-checker" },
            };
            await as(
                member,
                storedTask(
                    "reported",
                    { ...report, usersId: [MEMBER_ID] },
                    { nameSpace: OTHER_NS }
                )
            );
            users().getById.mockResolvedValue({
                _id: CHECKER_ID,
                name: "Outsider",
                role: { [OTHER_NS]: "fact-checker" },
            });
            const res = await session.call("send_to_cross_check", {
                dataHash: HASH_A,
                crossCheckerId: CHECKER_ID,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toContain(PICK);
            expect(res.text).toMatch(/not a member/);
            expect(transitions()).toHaveLength(0);
        });

        it("refuses a non-writer before looking the pick up", async () => {
            await as(
                factChecker,
                storedTask("reported", { ...report, usersId: [OTHER_USER_ID] })
            );
            const res = await session.call("send_to_cross_check", {
                dataHash: HASH_A,
                crossCheckerId: CHECKER_ID,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toContain(PERMISSION);
            expect(users().getById).not.toHaveBeenCalled();
            expect(transitions()).toHaveLength(0);
        });

        it("refuses a regular user listed as writer", async () => {
            await as(regular, storedTask("reported", report));
            const res = await session.call("send_to_cross_check", {
                dataHash: HASH_A,
                crossCheckerId: CHECKER_ID,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toContain(PERMISSION);
            expect(transitions()).toHaveLength(0);
        });

        it("rejects an id that is not an ObjectId (400)", async () => {
            await as(factChecker, storedTask("reported", report));
            const res = await session.call("send_to_cross_check", {
                dataHash: HASH_A,
                crossCheckerId: { $ne: null },
            });
            expect(res.isError).toBe(true);
            expect(users().getById).not.toHaveBeenCalled();
            expect(transitions()).toHaveLength(0);
        });
    });

    describe("submit_report with crossCheckerId", () => {
        it("submits and sends to the pick's cross-check", async () => {
            await as(factChecker, storedTask({ assigned: "draft" }, report));
            session.mocks.reviewTaskService.transitionAtomically.mockResolvedValueOnce(
                storedTask("reported", report)
            );
            const res = await session.call("submit_report", {
                dataHash: HASH_A,
                crossCheckerId: CHECKER_ID,
            });
            expect(res.isError).toBe(false);
            expect(transitions()).toHaveLength(2);
            expect(transitions()[1][1].$set["machine.value"]).toBe(
                "cross-checking"
            );
        });

        it("refuses a bad pick before submitting", async () => {
            await as(factChecker, storedTask({ assigned: "draft" }, report));
            const res = await session.call("submit_report", {
                dataHash: HASH_A,
                crossCheckerId: REGULAR_ID,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toContain(PICK);
            expect(transitions()).toHaveLength(0);
        });
    });

    describe("submit_report_to_review with reviewerId", () => {
        it("submits and sends to the pick's review", async () => {
            await as(factChecker, storedTask({ assigned: "draft" }, report));
            session.mocks.reviewTaskService.transitionAtomically.mockResolvedValueOnce(
                storedTask("reported", report)
            );
            const res = await session.call("submit_report_to_review", {
                dataHash: HASH_A,
                reviewerId: REVIEWER_ID,
            });
            expect(res.isError).toBe(false);
            const [filter, update] = transitions()[1];
            expect(update.$set["machine.value"]).toBe("submitted");
            expect(
                String(update.$set["machine.context.reviewData.reviewerId"])
            ).toBe(REVIEWER_ID);
            expect(
                String(filter["machine.context.reviewData.usersId"].$ne)
            ).toBe(REVIEWER_ID);
            expect(
                String(filter["machine.context.reviewData.crossCheckerId"].$ne)
            ).toBe(REVIEWER_ID);
        });

        it("refuses a fact-checker as reviewer, as the web picker does", async () => {
            await as(factChecker, storedTask("reported", report));
            const res = await session.call("submit_report_to_review", {
                dataHash: HASH_A,
                reviewerId: CHECKER_ID,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toContain(PICK);
            expect(transitions()).toHaveLength(0);
        });
    });

    describe("send_to_review with reviewerId", () => {
        it("gives a task waiting in the review backlog to the pick", async () => {
            // In the backlog without a cross-check: it came through
            // submit_report_to_review, which already waived it
            await as(
                factChecker,
                storedTask("selectReviewer", { ...report, reviewerId: null })
            );
            const res = await session.call("send_to_review", {
                dataHash: HASH_A,
                reviewerId: REVIEWER_ID,
            });
            expect(res.isError).toBe(false);
            const [filter, update] = firstTransition(session);
            expect(filter.$or).toContainEqual({
                "machine.value": "selectReviewer",
                "machine.context.reviewData.reviewerId": null,
            });
            expect(update.$set["machine.value"]).toBe("submitted");
        });

        it("refuses the cross-checker as reviewer (four-eyes)", async () => {
            await as(
                factChecker,
                storedTask("selectReviewer", {
                    ...report,
                    ...agreedCrossCheck,
                    crossCheckerId: REVIEWER_ID,
                })
            );
            const res = await session.call("send_to_review", {
                dataHash: HASH_A,
                reviewerId: REVIEWER_ID,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toContain(PICK);
            expect(transitions()).toHaveLength(0);
        });

        it("still needs an agreeing cross-check for a reported task", async () => {
            await as(factChecker, storedTask("reported", report));
            const res = await session.call("send_to_review", {
                dataHash: HASH_A,
                reviewerId: REVIEWER_ID,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toContain(STATE);
            expect(res.text).toMatch(/submit_report_to_review/);
            expect(transitions()).toHaveLength(0);
        });

        it("is a no-op when the pick already reviews it", async () => {
            await as(
                factChecker,
                storedTask("submitted", { ...report, reviewerId: REVIEWER_ID })
            );
            const res = await session.call("send_to_review", {
                dataHash: HASH_A,
                reviewerId: REVIEWER_ID,
            });
            expect(res.isError).toBe(false);
            expect(transitions()).toHaveLength(0);
        });
    });
});
