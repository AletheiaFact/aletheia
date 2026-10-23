import { connect, factChecker, happyPath, validArgs } from "./harness";
import type { Session } from "./harness";

describe("MCP adversarial: positive control", () => {
    let session: Session;
    afterEach(async () => session?.close());

    // Guards the denial tests in this directory: if a fixture stops
    // satisfying its schema, "denied" would pass for the wrong reason
    // (validation).
    it.each(Object.keys(validArgs))(
        "a fact-checker in main can call %s with the fixture args",
        async (tool) => {
            session = await connect(happyPath[tool]?.user ?? factChecker);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                happyPath[tool]?.task ?? null
            );
            const res = await session.call(tool, validArgs[tool]);
            expect(res.text).not.toMatch(/Input validation/);
            expect(res.isError).toBe(false);
        }
    );

    it("a fact-checker in main can start a review task (suite is not vacuous)", async () => {
        session = await connect(factChecker);
        const res = await session.call(
            "start_review_task",
            validArgs.start_review_task
        );
        expect(res.isError).toBe(false);
        expect(session.mocks.reviewTaskService.create).toHaveBeenCalledTimes(1);
    });
});
