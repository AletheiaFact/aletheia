import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { CascadeService } from "./cascade.service";
import { ReviewTaskService } from "../../review-task/review-task.service";
import { ClaimReviewService } from "../../claim-review/claim-review.service";
import { CommentService } from "../../review-task/comment/comment.service";
import {
    ClaimReview,
    ClaimReviewSchema,
} from "../../claim-review/schemas/claim-review.schema";
import { Report } from "../../report/mongo/schemas/report.schema";
import {
    ReviewTask,
    ReviewTaskSchema,
} from "../../review-task/schemas/review-task.schema";

describe("CascadeService (Unit)", () => {
    let service: CascadeService;

    const reviewTask = { cascadeUpdateDataHash: vi.fn() };
    const claimReview = { cascadeUpdateDataHash: vi.fn() };
    const comment = { cascadeUpdateSentenceTarget: vi.fn() };
    const distinctQuery = { session: vi.fn() };
    const ClaimReviewModel = { distinct: vi.fn(() => distinctQuery) };
    const reviewTaskDistinctQuery = { session: vi.fn() };
    const ReviewTaskModel = { distinct: vi.fn(() => reviewTaskDistinctQuery) };
    const ReportModel = { updateMany: vi.fn() };
    const reportId = new Types.ObjectId();

    const fakeSession: any = { id: "session-1" };
    const claimId = new Types.ObjectId();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CascadeService,
                { provide: ReviewTaskService, useValue: reviewTask },
                { provide: ClaimReviewService, useValue: claimReview },
                { provide: CommentService, useValue: comment },
                {
                    provide: getModelToken(ClaimReview.name),
                    useValue: ClaimReviewModel,
                },
                { provide: getModelToken(Report.name), useValue: ReportModel },
                {
                    provide: getModelToken(ReviewTask.name),
                    useValue: ReviewTaskModel,
                },
            ],
        }).compile();

        service = module.get<CascadeService>(CascadeService);
    });

    beforeEach(() => {
        vi.clearAllMocks();
        reviewTask.cascadeUpdateDataHash.mockResolvedValue(1);
        claimReview.cascadeUpdateDataHash.mockResolvedValue(2);
        comment.cascadeUpdateSentenceTarget.mockResolvedValue(4);
        distinctQuery.session.mockResolvedValue([reportId]);
        ReportModel.updateMany.mockResolvedValue({ modifiedCount: 1 });
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
            reportsUpdated: 0,
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
            reportsUpdated: 2,
            verificationRequestsUpdated: 0,
            commentsUpdated: 0,
        });
    });

    it("remaps only the reports of this claim's reviews", async () => {
        await service.applyOneToOneRemaps(
            [{ oldDataHash: "h1", newDataHash: "h2" }],
            [],
            claimId,
            fakeSession
        );
        expect(ClaimReviewModel.distinct).toHaveBeenCalledWith("report", {
            data_hash: "h1",
            target: { $in: [claimId, claimId.toString()] },
            targetModel: "Claim",
        });
        expect(distinctQuery.session).toHaveBeenCalledWith(fakeSession);
        expect(ReportModel.updateMany).toHaveBeenCalledWith(
            { _id: { $in: [reportId] }, data_hash: "h1" },
            { $set: { data_hash: "h2" } },
            { session: fakeSession }
        );
    });

    it("skips the report update when the claim has no review for the hash", async () => {
        distinctQuery.session.mockResolvedValue([]);
        const result = await service.applyOneToOneRemaps(
            [{ oldDataHash: "h1", newDataHash: "h2" }],
            [],
            claimId,
            fakeSession
        );
        expect(ReportModel.updateMany).not.toHaveBeenCalled();
        expect(result.reportsUpdated).toBe(0);
    });

    describe("findPublishedHashes", () => {
        it("returns the hashes with a live claim review, whatever the target's stored form", async () => {
            distinctQuery.session.mockResolvedValue(["h1"]);
            const result = await service.findPublishedHashes(
                ["h1", "h2"],
                claimId,
                fakeSession
            );
            expect(result).toEqual(["h1"]);
            expect(ClaimReviewModel.distinct).toHaveBeenCalledWith(
                "data_hash",
                {
                    data_hash: { $in: ["h1", "h2"] },
                    target: { $in: [claimId, claimId.toString()] },
                    targetModel: "Claim",
                    isDeleted: { $ne: true },
                }
            );
        });

        // Mocks accept any filter, so a field missing from the schema (like
        // the `onModel` refPath name, never stored) would match nothing in
        // Mongo and still pass here. Pin the filter to real schema paths.
        it("filters only on fields stored by the ClaimReview schema", async () => {
            distinctQuery.session.mockResolvedValue([]);
            await service.findPublishedHashes(["h1"], claimId, fakeSession);
            const filter = ClaimReviewModel.distinct.mock.calls[0][1];
            for (const key of Object.keys(filter)) {
                expect(ClaimReviewSchema.path(key), key).toBeDefined();
            }
        });

        it("skips the query when there is nothing to check", async () => {
            expect(
                await service.findPublishedHashes([], claimId, fakeSession)
            ).toEqual([]);
            expect(ClaimReviewModel.distinct).not.toHaveBeenCalled();
        });
    });

    describe("findReviewTaskHashes", () => {
        it("returns the hashes with a review task, on fields the schema stores", async () => {
            reviewTaskDistinctQuery.session.mockResolvedValue(["h1"]);
            const result = await service.findReviewTaskHashes(
                ["h1", "h2"],
                claimId
            );
            expect(result).toEqual(["h1"]);
            const filter = ReviewTaskModel.distinct.mock.calls[0][1];
            expect(filter).toEqual({
                data_hash: { $in: ["h1", "h2"] },
                target: { $in: [claimId, claimId.toString()] },
                reviewTaskType: "Claim",
            });
            for (const key of Object.keys(filter)) {
                expect(ReviewTaskSchema.path(key), key).toBeDefined();
            }
            expect(reviewTaskDistinctQuery.session).toHaveBeenCalledWith(null);
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
