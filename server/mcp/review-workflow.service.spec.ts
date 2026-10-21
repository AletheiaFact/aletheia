import { getInitialContext } from "../../src/machines/reviewTask/context";
import { ReviewTaskTypeEnum } from "../../src/machines/reviewTask/enums";
import { buildClaimContext } from "./review-workflow.service";

describe("buildClaimContext", () => {
    it("matches the frontend initial context for a Claim task", () => {
        const front = getInitialContext(ReviewTaskTypeEnum.Claim, {
            usersId: ["user-1"],
        });

        const server = buildClaimContext("user-1", "claim-1");

        expect(server.reviewData).toEqual(front.reviewData);
        // The server additionally pins the task to its claim; every other
        // review field must still equal the frontend default.
        expect(server.review).toEqual({
            ...front.review,
            target: "claim-1",
            targetId: "claim-1",
        });
    });
});
