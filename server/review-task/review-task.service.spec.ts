import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Types } from "mongoose";
import { REQUEST } from "@nestjs/core";
import { ForbiddenException } from "@nestjs/common";
import { ReviewTaskService } from "./review-task.service";
import {
    mockReviewTaskModel,
    mockReviewTaskWithComments,
    mockCommentA,
    mockCommentB,
    mockCommentC,
    mockCommentD,
} from "../mocks/ReviewTaskMock";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ReportService } from "../report/report.service";
import { HistoryService } from "../history/history.service";
import { StateEventService } from "../state-event/state-event.service";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import { ImageService } from "../claim/types/image/image.service";
import { EditorParseService } from "../editor-parse/editor-parse.service";
import { CommentService } from "./comment/comment.service";
import { Roles } from "../auth/ability/ability.factory";

describe("ReviewTaskService (Unit)", () => {
    let service: ReviewTaskService;
    let testingModule: TestingModule;
    const mockUserId = new Types.ObjectId().toString();

    const mockRequest = {
        user: {
            _id: mockUserId,
            role: {
                main: Roles.Regular,
            },
        },
    };

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            providers: [
                ReviewTaskService,
                {
                    provide: getModelToken("ReviewTask"),
                    useValue: mockReviewTaskModel,
                },
                { provide: REQUEST, useValue: mockRequest },
                {
                    provide: ClaimReviewService,
                    useValue: { create: jest.fn() },
                },
                {
                    provide: ReportService,
                    useValue: { create: jest.fn() },
                },
                {
                    provide: HistoryService,
                    useValue: {
                        createHistory: jest.fn(),
                        getHistoryParams: jest.fn(),
                    },
                },
                {
                    provide: StateEventService,
                    useValue: { createStateEvent: jest.fn() },
                },
                {
                    provide: SentenceService,
                    useValue: { getById: jest.fn() },
                },
                {
                    provide: ImageService,
                    useValue: { getById: jest.fn() },
                },
                {
                    provide: EditorParseService,
                    useValue: { schema2html: jest.fn() },
                },
                {
                    provide: CommentService,
                    useValue: { create: jest.fn() },
                },
            ],
        }).compile();

        service = await testingModule.resolve<ReviewTaskService>(
            ReviewTaskService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("deleteComment", () => {
        const createMockReviewTaskWithComments = () => {
            // Spread copies — ObjectId refs are immutable so sharing is safe.
            // Each call creates fresh arrays to prevent cross-test mutation.
            return {
                _id: new Types.ObjectId(),
                data_hash: "hash-with-comments",
                machine: {
                    value: "assigned",
                    context: {
                        reviewData: {
                            reviewComments: [
                                { ...mockCommentA },
                                { ...mockCommentB },
                            ],
                            crossCheckingComments: [
                                { ...mockCommentC },
                                { ...mockCommentD },
                            ],
                        },
                    },
                },
            };
        };

        // REGRESSION TEST: Fixed bug where crossCheckingComments filtering
        // overwrote reviewComments due to copy-paste error on line 815
        it("removes comment from reviewComments without affecting crossCheckingComments", async () => {
            const mockTask = createMockReviewTaskWithComments();
            mockReviewTaskModel.findOne.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockTask),
                }),
            });
            mockReviewTaskModel.findByIdAndUpdate.mockResolvedValue(mockTask);

            await service.deleteComment(
                "hash-with-comments",
                mockCommentA._id.toString()
            );

            const updateCall =
                mockReviewTaskModel.findByIdAndUpdate.mock.calls[0];
            const updatedReviewData =
                updateCall[1]["machine.context.reviewData"];

            // reviewComments should have only commentB (commentA removed)
            expect(updatedReviewData.reviewComments).toHaveLength(1);
            expect(
                updatedReviewData.reviewComments[0]._id.equals(mockCommentB._id)
            ).toBe(true);

            // crossCheckingComments should be unchanged (both C and D present)
            expect(updatedReviewData.crossCheckingComments).toHaveLength(2);
        });

        it("removes comment from crossCheckingComments without affecting reviewComments", async () => {
            const mockTask = createMockReviewTaskWithComments();
            mockReviewTaskModel.findOne.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockTask),
                }),
            });
            mockReviewTaskModel.findByIdAndUpdate.mockResolvedValue(mockTask);

            await service.deleteComment(
                "hash-with-comments",
                mockCommentC._id.toString()
            );

            const updateCall =
                mockReviewTaskModel.findByIdAndUpdate.mock.calls[0];
            const updatedReviewData =
                updateCall[1]["machine.context.reviewData"];

            // reviewComments should be unchanged (both A and B present)
            expect(updatedReviewData.reviewComments).toHaveLength(2);

            // crossCheckingComments should have only commentD (commentC removed)
            expect(updatedReviewData.crossCheckingComments).toHaveLength(1);
            expect(
                updatedReviewData.crossCheckingComments[0]._id.equals(
                    mockCommentD._id
                )
            ).toBe(true);
        });

        it("does not remove any comment when ID does not match", async () => {
            const mockTask = createMockReviewTaskWithComments();
            mockReviewTaskModel.findOne.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockTask),
                }),
            });
            mockReviewTaskModel.findByIdAndUpdate.mockResolvedValue(mockTask);

            const nonExistentId = new Types.ObjectId().toString();
            await service.deleteComment("hash-with-comments", nonExistentId);

            const updateCall =
                mockReviewTaskModel.findByIdAndUpdate.mock.calls[0];
            const updatedReviewData =
                updateCall[1]["machine.context.reviewData"];

            // Both arrays should be unchanged
            expect(updatedReviewData.reviewComments).toHaveLength(2);
            expect(updatedReviewData.crossCheckingComments).toHaveLength(2);
        });
    });

    describe("_publishReviewTask (authorization)", () => {
        // Spy on _createReportAndClaimReview to prevent it from executing
        // after auth check passes — we only test authorization logic here
        let createReportSpy: jest.SpyInstance;

        beforeEach(() => {
            createReportSpy = jest
                .spyOn(service as any, "_createReportAndClaimReview")
                .mockImplementation(() => undefined);
        });

        afterEach(() => {
            createReportSpy.mockRestore();
        });

        it("throws ForbiddenException when non-authorized user tries to publish", () => {
            const reviewerId = new Types.ObjectId().toString();
            const reviewTaskMachine = {
                machine: { value: "published" },
            };
            const machine = {
                context: {
                    reviewData: {
                        reviewerId: { toString: () => reviewerId },
                    },
                },
            };

            // User is Regular role and not the reviewer
            mockRequest.user.role.main = Roles.Regular;
            mockRequest.user._id = new Types.ObjectId().toString();

            expect(() => {
                (service as any)._publishReviewTask(
                    reviewTaskMachine,
                    "main",
                    machine,
                    "test-hash",
                    "Fact-checking"
                );
            }).toThrow(ForbiddenException);
        });

        it("does not throw when Admin publishes", () => {
            const reviewerId = new Types.ObjectId().toString();
            const reviewTaskMachine = {
                machine: { value: "published" },
            };
            const machine = {
                context: {
                    reviewData: {
                        reviewerId: { toString: () => reviewerId },
                    },
                },
            };

            mockRequest.user.role.main = Roles.Admin;

            expect(() => {
                (service as any)._publishReviewTask(
                    reviewTaskMachine,
                    "main",
                    machine,
                    "test-hash",
                    "Fact-checking"
                );
            }).not.toThrow();
        });

        it("does not throw when SuperAdmin publishes", () => {
            const reviewerId = new Types.ObjectId().toString();
            const reviewTaskMachine = {
                machine: { value: "published" },
            };
            const machine = {
                context: {
                    reviewData: {
                        reviewerId: { toString: () => reviewerId },
                    },
                },
            };

            mockRequest.user.role.main = Roles.SuperAdmin;

            expect(() => {
                (service as any)._publishReviewTask(
                    reviewTaskMachine,
                    "main",
                    machine,
                    "test-hash",
                    "Fact-checking"
                );
            }).not.toThrow();
        });

        it("does not throw when reviewer matches logged-in user", () => {
            const reviewTaskMachine = {
                machine: { value: "published" },
            };
            const machine = {
                context: {
                    reviewData: {
                        reviewerId: { toString: () => mockUserId },
                    },
                },
            };

            mockRequest.user.role.main = Roles.Regular;
            mockRequest.user._id = mockUserId;

            expect(() => {
                (service as any)._publishReviewTask(
                    reviewTaskMachine,
                    "main",
                    machine,
                    "test-hash",
                    "Fact-checking"
                );
            }).not.toThrow();
        });

        it("skips authorization check for Request reportModel", () => {
            const reviewTaskMachine = {
                machine: { value: "published" },
            };
            const machine = {
                context: {
                    reviewData: {
                        reviewerId: {
                            toString: () =>
                                new Types.ObjectId().toString(),
                        },
                    },
                },
            };

            mockRequest.user.role.main = Roles.Regular;
            mockRequest.user._id = new Types.ObjectId().toString();

            // Request model bypasses the authorization check entirely
            expect(() => {
                (service as any)._publishReviewTask(
                    reviewTaskMachine,
                    "main",
                    machine,
                    "test-hash",
                    "Request"
                );
            }).not.toThrow();
        });

        it("does not throw when machine value is not published", () => {
            const reviewTaskMachine = {
                machine: { value: "submitted" },
            };
            const machine = {
                context: {
                    reviewData: {
                        reviewerId: {
                            toString: () =>
                                new Types.ObjectId().toString(),
                        },
                    },
                },
            };

            mockRequest.user.role.main = Roles.Regular;

            // Non-published state skips the entire block
            expect(() => {
                (service as any)._publishReviewTask(
                    reviewTaskMachine,
                    "main",
                    machine,
                    "test-hash",
                    "Fact-checking"
                );
            }).not.toThrow();
        });
    });
});
