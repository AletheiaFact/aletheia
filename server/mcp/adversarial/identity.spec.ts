import {
    connect,
    factChecker,
    HASH_A,
    happyPath,
    m2m,
    USER_ID,
    validArgs,
} from "./harness";
import type { Session } from "./harness";

describe("MCP adversarial: M2M tokens and impersonation", () => {
    let session: Session;
    afterEach(async () => session?.close());

    it.each([
        "create_source",
        "create_verification_request",
        "start_review_task",
        "add_review_comment",
        "next_review_task",
        "join_review_task",
        "send_to_review",
        "claim_review_task",
        "publish_review_task",
        "next_cross_checking",
        "list_my_review_tasks",
    ])(
        "M2M token cannot call %s (attributes writes to a user)",
        async (tool) => {
            session = await connect(m2m);
            session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
                happyPath[tool]?.task ?? { nameSpace: "main" }
            );
            const res = await session.call(tool, validArgs[tool] ?? {});
            expect(res.isError).toBe(true);
            expect(res.text).toMatch(/user session/);
        }
    );

    it("attributes the task to the authenticated user even if args name another user", async () => {
        session = await connect(factChecker);
        const res = await session.call("start_review_task", {
            ...validArgs.start_review_task,
            userId: "victim",
            usersId: ["victim"],
            user: { _id: "victim" },
        });
        expect(res.isError).toBe(false);
        const created =
            session.mocks.reviewTaskService.createAssigned.mock.calls[0][0];
        expect(created.machine.context.reviewData.usersId.map(String)).toEqual([
            USER_ID,
        ]);
    });

    it("add_review_comment attributes the comment to the caller, not to args", async () => {
        session = await connect(factChecker);
        session.mocks.reviewTaskService.getReviewTaskByDataHash.mockResolvedValue(
            { nameSpace: "main" }
        );
        await session.call("add_review_comment", {
            ...validArgs.add_review_comment,
            user: "victim",
        });
        expect(session.mocks.reviewTaskService.addComment).toHaveBeenCalledWith(
            HASH_A,
            expect.objectContaining({ user: USER_ID })
        );
    });
});
