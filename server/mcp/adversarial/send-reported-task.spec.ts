import {
    agreedCrossCheck,
    connect,
    factChecker,
    firstTransition,
    HASH_A,
    OTHER_USER_ID,
    publishableReport,
    regular,
    storedTask,
} from "./harness";
import type { Session } from "./harness";

const PERMISSION = "(not allowed for this account)";
const STATE = "not a permission problem";

/**
 * Issue #2708: a fact-checker who wrote a report could not move it on
 * through MCP, and the agent reported the state refusals as a missing
 * permission. The writer can send the task on from every state the web
 * allows; a send it already made is a no-op; a refusal says whether it is
 * about the account or about the task's state; non-assignees stay out.
 */
describe("MCP adversarial: a writer sends a reported task on (#2708)", () => {
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

    describe("send_to_cross_check", () => {
        it("sends a reported task for its assignee fact-checker", async () => {
            await as(factChecker, storedTask("reported", publishableReport));
            const res = await session.call("send_to_cross_check", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(false);
            const [filter, update] = firstTransition(session);
            expect(filter.$or).toContainEqual({ "machine.value": "reported" });
            expect(update.$set["machine.value"]).toBe("selectCrossChecker");
        });

        it("is a no-op when the task already waits for a cross-checker", async () => {
            await as(
                factChecker,
                storedTask("selectCrossChecker", {
                    ...publishableReport,
                    crossCheckerId: null,
                })
            );
            const res = await session.call("send_to_cross_check", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(false);
            expect(JSON.parse(res.text).state).toBe("selectCrossChecker");
            expect(transitions()).toHaveLength(0);
        });

        it("moves a task from a review backlog nobody took", async () => {
            await as(
                factChecker,
                storedTask("selectReviewer", {
                    ...publishableReport,
                    reviewerId: null,
                })
            );
            const res = await session.call("send_to_cross_check", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(false);
            const [filter] = firstTransition(session);
            expect(filter.$or).toContainEqual({
                "machine.value": "selectReviewer",
                "machine.context.reviewData.reviewerId": null,
            });
        });

        it("refuses a task a cross-checker took, as a state conflict", async () => {
            await as(
                factChecker,
                storedTask("cross-checking", {
                    ...publishableReport,
                    crossCheckerId: OTHER_USER_ID,
                })
            );
            session.mocks.reviewTaskService.transitionAtomically.mockResolvedValue(
                null
            );
            const res = await session.call("send_to_cross_check", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toContain(STATE);
            expect(res.text).toMatch(/A cross-checker is on it/);
            expect(res.text).not.toContain(PERMISSION);
        });
    });

    describe("send_to_review", () => {
        it("refuses a report without a cross-check and names both ways forward", async () => {
            await as(factChecker, storedTask("reported", publishableReport));
            const res = await session.call("send_to_review", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toContain(STATE);
            expect(res.text).toMatch(/send_to_cross_check/);
            expect(res.text).toMatch(/submit_report_to_review/);
            expect(transitions()).toHaveLength(0);
        });

        it("tells a writer whose task waits for a cross-checker how to skip it", async () => {
            await as(
                factChecker,
                storedTask("selectCrossChecker", {
                    ...publishableReport,
                    crossCheckerId: null,
                })
            );
            const res = await session.call("send_to_review", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toContain(STATE);
            expect(res.text).toMatch(/task is "selectCrossChecker"/);
            expect(res.text).toMatch(/submit_report_to_review/);
            expect(transitions()).toHaveLength(0);
        });

        it("is a no-op when the task already waits for a reviewer", async () => {
            await as(
                factChecker,
                storedTask("selectReviewer", {
                    ...publishableReport,
                    ...agreedCrossCheck,
                    reviewerId: null,
                })
            );
            const res = await session.call("send_to_review", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(false);
            expect(JSON.parse(res.text).state).toBe("selectReviewer");
            expect(transitions()).toHaveLength(0);
        });
    });

    describe("submit_report_to_review", () => {
        it("drops a requested cross-check nobody took and sends to review", async () => {
            await as(
                factChecker,
                storedTask("selectCrossChecker", {
                    ...publishableReport,
                    crossCheckerId: null,
                })
            );
            const res = await session.call("submit_report_to_review", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(false);
            expect(transitions()).toHaveLength(1);
            const [filter, update] = firstTransition(session);
            expect(filter.$or).toContainEqual({
                "machine.value": "selectCrossChecker",
                "machine.context.reviewData.crossCheckerId": null,
            });
            expect(update.$set["machine.value"]).toBe("selectReviewer");
        });

        it("refuses a task a cross-checker already took", async () => {
            await as(
                factChecker,
                storedTask("cross-checking", {
                    ...publishableReport,
                    crossCheckerId: OTHER_USER_ID,
                })
            );
            session.mocks.reviewTaskService.transitionAtomically.mockResolvedValue(
                null
            );
            const res = await session.call("submit_report_to_review", {
                dataHash: HASH_A,
            });
            expect(res.isError).toBe(true);
            expect(res.text).toContain(STATE);
        });
    });

    describe("guard rails", () => {
        const backlogs = [
            storedTask("reported", {
                ...publishableReport,
                ...agreedCrossCheck,
                usersId: [OTHER_USER_ID],
            }),
            storedTask("selectCrossChecker", {
                ...publishableReport,
                usersId: [OTHER_USER_ID],
                crossCheckerId: null,
            }),
            storedTask("selectReviewer", {
                ...publishableReport,
                usersId: [OTHER_USER_ID],
                reviewerId: null,
            }),
        ];
        for (const tool of [
            "send_to_cross_check",
            "send_to_review",
            "submit_report_to_review",
        ]) {
            for (const task of backlogs) {
                it(`${tool} refuses a non-assignee fact-checker (task ${task.machine.value})`, async () => {
                    await as(factChecker, task);
                    const res = await session.call(tool, { dataHash: HASH_A });
                    expect(res.isError).toBe(true);
                    expect(res.text).toContain(PERMISSION);
                    expect(transitions()).toHaveLength(0);
                });
            }

            it(`${tool} refuses a regular user even listed as assignee`, async () => {
                await as(regular, storedTask("reported", publishableReport));
                const res = await session.call(tool, { dataHash: HASH_A });
                expect(res.isError).toBe(true);
                expect(res.text).toContain(PERMISSION);
                expect(transitions()).toHaveLength(0);
            });
        }
    });
});
