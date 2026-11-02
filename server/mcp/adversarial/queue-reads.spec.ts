import { connect, factChecker, m2m, OTHER_USER_ID, USER_ID } from "./harness";
import type { Session } from "./harness";

describe("MCP adversarial: caller-scoped queue reads", () => {
    let session: Session;
    afterEach(async () => session?.close());

    it.each([
        ["next_cross_checking", "crossCheckerId"],
        ["list_my_review_tasks", "reviewerId"],
    ])("%s only returns the caller's own tasks", async (tool, field) => {
        session = await connect(factChecker);
        await session.call(tool, { [field]: OTHER_USER_ID });
        const [filter] =
            session.mocks.reviewTaskService.findOldest.mock.calls[0];
        expect(String(filter[`machine.context.reviewData.${field}`])).toBe(
            USER_ID
        );
        expect(filter.nameSpace).toBe("main");
    });

    it.each([
        ["assigned", { assigned: true, crossChecked: false, reviewed: false }],
        ["reviewed", { assigned: false, crossChecked: false, reviewed: true }],
    ])(
        "list_review_tasks mine=%s narrows to the caller",
        async (mine, filterUser) => {
            session = await connect(factChecker);
            await session.call("list_review_tasks", {
                reviewTaskType: "Claim",
                mine,
            });
            expect(
                session.mocks.reviewTaskService.listAll.mock.calls[0][0]
                    .filterUser
            ).toEqual(filterUser);
        }
    );

    it("list_review_tasks mine needs a user session", async () => {
        session = await connect(m2m);
        const res = await session.call("list_review_tasks", {
            reviewTaskType: "Claim",
            mine: "assigned",
        });
        expect(res.isError).toBe(true);
        expect(session.mocks.reviewTaskService.listAll).not.toHaveBeenCalled();
    });
});
