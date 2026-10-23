import { connect, factChecker, validArgs } from "./harness";
import type { Session } from "./harness";

describe("MCP adversarial: error hygiene", () => {
    let session: Session;
    afterEach(async () => session?.close());

    it("does not leak stack traces or internals when a service throws", async () => {
        session = await connect(factChecker);
        session.mocks.claimService.getById.mockRejectedValue(new Error("boom"));
        const res = await session.call(
            "start_review_task",
            validArgs.start_review_task
        );
        expect(res.isError).toBe(true);
        expect(res.text).toBe("start_review_task failed: boom");
        expect(res.text).not.toMatch(/\bat .*\(.*:\d+:\d+\)/);
    });
});
