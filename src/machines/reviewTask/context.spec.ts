import { getInitialContext } from "./context";
import { ReviewTaskTypeEnum } from "./enums";

describe("getInitialContext", () => {
    describe("Claim type (default)", () => {
        it("returns full context with baseReviewData and claimReviewData", () => {
            const context = getInitialContext(ReviewTaskTypeEnum.Claim);
            expect(context.reviewData).toBeDefined();
            expect(context.review).toBeDefined();
        });

        it("includes base review data fields", () => {
            const { reviewData } = getInitialContext(ReviewTaskTypeEnum.Claim);
            expect(reviewData.usersId).toEqual([]);
            expect(reviewData.summary).toBe("");
            expect(reviewData.classification).toBe("");
            expect(reviewData.reviewerId).toBeNull();
            expect(reviewData.crossCheckerId).toBeNull();
            expect(reviewData.crossCheckingComments).toEqual([]);
            expect(reviewData.crossCheckingComment).toBe("");
            expect(reviewData.crossCheckingClassification).toBe("");
        });

        it("includes claim-specific review data fields", () => {
            const { reviewData } = getInitialContext(ReviewTaskTypeEnum.Claim);
            expect(reviewData.questions).toEqual([]);
            expect(reviewData.report).toBe("");
            expect(reviewData.verification).toBe("");
            expect(reviewData.sources).toEqual([]);
        });

        it("includes review object with correct defaults", () => {
            const { review } = getInitialContext(ReviewTaskTypeEnum.Claim);
            expect(review.personality).toBe("");
            expect(review.usersId).toBe("");
            expect(review.targetId).toBe("");
            expect(review.isPartialReview).toBe(false);
        });
    });

    describe("Source type", () => {
        it("returns base review data without claim-specific fields", () => {
            const { reviewData } = getInitialContext(
                ReviewTaskTypeEnum.Source
            );
            expect(reviewData.usersId).toEqual([]);
            expect(reviewData.summary).toBe("");
            expect(reviewData.classification).toBe("");
            expect(reviewData.reviewerId).toBeNull();
            expect(reviewData.crossCheckerId).toBeNull();
        });

        it("does not include claim-specific fields", () => {
            const { reviewData } = getInitialContext(
                ReviewTaskTypeEnum.Source
            );
            expect(reviewData.questions).toBeUndefined();
            expect(reviewData.report).toBeUndefined();
            expect(reviewData.verification).toBeUndefined();
            expect(reviewData.sources).toBeUndefined();
        });

        it("includes review object", () => {
            const { review } = getInitialContext(ReviewTaskTypeEnum.Source);
            expect(review.personality).toBe("");
            expect(review.isPartialReview).toBe(false);
        });
    });

    describe("VerificationRequest type", () => {
        it("returns minimal reviewData with usersId, isSensitive, rejected", () => {
            const { reviewData } = getInitialContext(
                ReviewTaskTypeEnum.VerificationRequest
            );
            expect(reviewData.usersId).toEqual([]);
            expect(reviewData.isSensitive).toBe(false);
            expect(reviewData.rejected).toBe(false);
        });

        it("does not include base review data fields", () => {
            const { reviewData } = getInitialContext(
                ReviewTaskTypeEnum.VerificationRequest
            );
            expect(reviewData.summary).toBeUndefined();
            expect(reviewData.classification).toBeUndefined();
            expect(reviewData.reviewerId).toBeUndefined();
        });

        it("includes review object", () => {
            const { review } = getInitialContext(
                ReviewTaskTypeEnum.VerificationRequest
            );
            expect(review).toBeDefined();
            expect(review.isPartialReview).toBe(false);
        });
    });

    describe("override via reviewData parameter", () => {
        it("merges override data into Claim context", () => {
            const override = {
                summary: "Test summary",
                classification: "true",
            };
            const { reviewData } = getInitialContext(
                ReviewTaskTypeEnum.Claim,
                override
            );
            expect(reviewData.summary).toBe("Test summary");
            expect(reviewData.classification).toBe("true");
            // Other fields remain default
            expect(reviewData.reviewerId).toBeNull();
            expect(reviewData.questions).toEqual([]);
        });

        it("merges override data into Source context", () => {
            const override = { summary: "Source summary" };
            const { reviewData } = getInitialContext(
                ReviewTaskTypeEnum.Source,
                override
            );
            expect(reviewData.summary).toBe("Source summary");
        });

        it("does not merge override into VerificationRequest context", () => {
            const override = { summary: "Should not appear" };
            const { reviewData } = getInitialContext(
                ReviewTaskTypeEnum.VerificationRequest,
                override
            );
            // VerificationRequest ignores reviewData parameter
            expect(reviewData.summary).toBeUndefined();
        });
    });
});
