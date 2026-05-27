import { Test, TestingModule } from "@nestjs/testing";
import { CascadeService } from "./cascade.service";
import { ReviewTaskService } from "../../review-task/review-task.service";
import { ClaimReviewService } from "../../claim-review/claim-review.service";
import { VerificationRequestService } from "../../verification-request/verification-request.service";
import { CommentService } from "../../review-task/comment/comment.service";

describe("CascadeService (Unit)", () => {
    let service: CascadeService;

    const reviewTask = { cascadeUpdateDataHash: vi.fn() };
    const claimReview = { cascadeUpdateDataHash: vi.fn() };
    const verificationRequest = { cascadeUpdateDataHash: vi.fn() };
    const comment = { cascadeUpdateSentenceTarget: vi.fn() };

    const fakeSession: any = { id: "session-1" };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CascadeService,
                { provide: ReviewTaskService, useValue: reviewTask },
                { provide: ClaimReviewService, useValue: claimReview },
                {
                    provide: VerificationRequestService,
                    useValue: verificationRequest,
                },
                { provide: CommentService, useValue: comment },
            ],
        }).compile();

        service = module.get<CascadeService>(CascadeService);
    });

    beforeEach(() => {
        vi.clearAllMocks();
        reviewTask.cascadeUpdateDataHash.mockResolvedValue(1);
        claimReview.cascadeUpdateDataHash.mockResolvedValue(2);
        verificationRequest.cascadeUpdateDataHash.mockResolvedValue(3);
        comment.cascadeUpdateSentenceTarget.mockResolvedValue(4);
    });

    it("returns all-zero counts when no remaps", async () => {
        const result = await service.applyOneToOneRemaps([], [], fakeSession);
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
            fakeSession
        );
        expect(result.reviewTasksUpdated).toBe(0);
        expect(reviewTask.cascadeUpdateDataHash).not.toHaveBeenCalled();
    });

    it("applies hash remaps to RT/CR/VR and sums counts", async () => {
        const result = await service.applyOneToOneRemaps(
            [
                { oldDataHash: "h1", newDataHash: "h2" },
                { oldDataHash: "h3", newDataHash: "h4" },
            ],
            [],
            fakeSession
        );
        expect(reviewTask.cascadeUpdateDataHash).toHaveBeenCalledTimes(2);
        expect(reviewTask.cascadeUpdateDataHash).toHaveBeenCalledWith(
            "h1",
            "h2",
            fakeSession
        );
        expect(result).toEqual({
            reviewTasksUpdated: 2,
            claimReviewsUpdated: 4,
            verificationRequestsUpdated: 6,
            commentsUpdated: 0,
        });
    });

    it("applies sentence target remaps to comments", async () => {
        const result = await service.applyOneToOneRemaps(
            [],
            [{ oldSentenceId: "s-old", newSentenceId: "s-new" }],
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
