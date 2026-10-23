import { getInitialContext } from "../../../src/machines/reviewTask/context";
import { ReviewTaskTypeEnum } from "../../../src/machines/reviewTask/enums";
import { buildClaimContext, claimPersonalityId } from "./machine";

describe("buildClaimContext", () => {
    it("matches the frontend initial context for a Claim task", () => {
        const front = getInitialContext(ReviewTaskTypeEnum.Claim, {
            usersId: ["user-1"],
        });

        const server = buildClaimContext(["user-1"], "claim-1");

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

describe("claimPersonalityId", () => {
    it("returns the first personality id, populated or not", () => {
        expect(claimPersonalityId({ personalities: [{ _id: "p-1" }] })).toBe(
            "p-1"
        );
        expect(claimPersonalityId({ personalities: ["p-2", "p-3"] })).toBe(
            "p-2"
        );
    });

    it("returns an empty string for a claim without personalities", () => {
        expect(claimPersonalityId({ personalities: [] })).toBe("");
        expect(claimPersonalityId({})).toBe("");
    });

    it("is copied into the task's review context", () => {
        expect(buildClaimContext([], "claim-1", "p-1").review.personality).toBe(
            "p-1"
        );
    });
});
