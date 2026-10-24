import {
    connect,
    factChecker,
    firstTransition,
    HASH_A,
    OTHER_USER_ID,
    publishableReport,
    storedTask,
    USER_ID,
} from "./harness";
import type { Session } from "./harness";

const firstUpdate = (session: Session) =>
    session.mocks.reviewTaskService.updateAtomically.mock.calls[0] as [
        Record<string, any>,
        Record<string, any>
    ];

describe("MCP adversarial: writing a review log", () => {
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
});
