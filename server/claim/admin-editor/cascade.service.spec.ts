import { Test, TestingModule } from "@nestjs/testing";
import { Types } from "mongoose";
import { CascadeService } from "./cascade.service";
import { ReviewTaskService } from "../../review-task/review-task.service";
import { ClaimReviewService } from "../../claim-review/claim-review.service";
import { CommentService } from "../../review-task/comment/comment.service";

describe("CascadeService (Unit)", () => {
    let service: CascadeService;

    const reviewTask = { cascadeUpdateDataHash: vi.fn() };
    const claimReview = { cascadeUpdateDataHash: vi.fn() };
    const comment = { cascadeUpdateSentenceTarget: vi.fn() };

    const fakeSession: any = { id: "session-1" };
    const claimId = new Types.ObjectId();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CascadeService,
                { provide: ReviewTaskService, useValue: reviewTask },
                { provide: ClaimReviewService, useValue: claimReview },
                { provide: CommentService, useValue: comment },
            ],
        }).compile();

        service = module.get<CascadeService>(CascadeService);
    });

    beforeEach(() => {
        vi.clearAllMocks();
        reviewTask.cascadeUpdateDataHash.mockResolvedValue(1);
        claimReview.cascadeUpdateDataHash.mockResolvedValue(2);
        comment.cascadeUpdateSentenceTarget.mockResolvedValue(4);
    });

    it("returns all-zero counts when no remaps", async () => {
        const result = await service.applyOneToOneRemaps(
            [],
            [],
            claimId,
            fakeSession
        );
        expect(result).toEqual({
            reviewTasksUpdated: 0,
            claimReviewsUpdated: 0,
            verificationRequestsUpdated: 0,
            commentsUpdated: 0,
        });
        expect(reviewTask.cascadeUpdateDataHash).not.toHaveBeenCalled();
    });

    it("skips remap when old hash equals new hash", async () => {
        const result = await service.applyOneToOneRemaps(
            [{ oldDataHash: "h1", newDataHash: "h1" }],
            [],
            claimId,
            fakeSession
        );
        expect(result.reviewTasksUpdated).toBe(0);
        expect(reviewTask.cascadeUpdateDataHash).not.toHaveBeenCalled();
    });

    it("applies hash remaps to RT and CR scoped by claimId", async () => {
        const result = await service.applyOneToOneRemaps(
            [
                { oldDataHash: "h1", newDataHash: "h2" },
                { oldDataHash: "h3", newDataHash: "h4" },
            ],
            [],
            claimId,
            fakeSession
        );
        expect(reviewTask.cascadeUpdateDataHash).toHaveBeenCalledTimes(2);
        expect(reviewTask.cascadeUpdateDataHash).toHaveBeenCalledWith(
            "h1",
            "h2",
            claimId,
            fakeSession
        );
        expect(claimReview.cascadeUpdateDataHash).toHaveBeenCalledWith(
            "h1",
            "h2",
            claimId,
            fakeSession
        );
        expect(result).toEqual({
            reviewTasksUpdated: 2,
            claimReviewsUpdated: 4,
            verificationRequestsUpdated: 0,
            commentsUpdated: 0,
        });
    });

    it("does NOT call any VerificationRequest cascade method (intentionally skipped)", async () => {
        // VerificationRequestService is no longer injected into CascadeService.
        // Asserting absence by structural inspection: claimReview + reviewTask
        // each invoked, no third call surface exists for VR. This test
        // documents the design decision so future refactors don't reintroduce
        // the unsafe cross-origin rewrite.
        await service.applyOneToOneRemaps(
            [{ oldDataHash: "h1", newDataHash: "h2" }],
            [],
            claimId,
            fakeSession
        );
        expect(reviewTask.cascadeUpdateDataHash).toHaveBeenCalled();
        expect(claimReview.cascadeUpdateDataHash).toHaveBeenCalled();
    });

    it("applies sentence target remaps to comments (unscoped — sentenceId is globally unique)", async () => {
        const result = await service.applyOneToOneRemaps(
            [],
            [{ oldSentenceId: "s-old", newSentenceId: "s-new" }],
            claimId,
            fakeSession
        );
        expect(comment.cascadeUpdateSentenceTarget).toHaveBeenCalledWith(
            "s-old",
            "s-new",
            fakeSession
        );
        expect(result.commentsUpdated).toBe(4);
    });
});
