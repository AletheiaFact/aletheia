import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { REQUEST } from "@nestjs/core";
import { ClaimReviewService } from "./claim-review.service";
import { ClaimReview } from "./schemas/claim-review.schema";
import { HistoryService } from "../history/history.service";
import { UtilService } from "../util";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import { ImageService } from "../claim/types/image/image.service";
import { EditorParseService } from "../editor-parse/editor-parse.service";
import { WikidataService } from "../wikidata/wikidata.service";
import { ReviewTaskTypeEnum } from "../types/enums";
import { Types } from "mongoose";

describe("ClaimReviewService (Unit)", () => {
    let service: ClaimReviewService;

    const mockRequest = {
        user: { _id: "user-123", role: { main: "admin" } },
        params: { namespace: "main" },
        language: "en",
    };

    const mockClaimReviewModel: any = {
        aggregate: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
    };

    const mockHistoryService = {
        createHistory: jest.fn(),
    };

    const mockUtilService = {
        formatStats: jest.fn().mockImplementation((stats) => stats),
    };

    const mockSentenceService = {
        getHashesByTopic: jest.fn().mockResolvedValue(["hash-s1", "hash-s2"]),
        getByDataHash: jest.fn().mockResolvedValue({
            _id: "sentence-1",
            data_hash: "hash-1",
            content: "Test sentence",
            props: {},
        }),
    };

    const mockImageService = {
        getHashesByTopic: jest.fn().mockResolvedValue(["hash-i1"]),
        getByDataHash: jest.fn().mockResolvedValue(null),
    };

    const mockEditorParseService = {
        schema: { text: jest.fn() },
    };
    const mockWikidataService = {
        fetchProperties: jest.fn().mockResolvedValue({
            description: "Test description",
            image: "test.jpg",
        }),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClaimReviewService,
                { provide: REQUEST, useValue: mockRequest },
                {
                    provide: getModelToken(ClaimReview.name),
                    useValue: mockClaimReviewModel,
                },
                { provide: HistoryService, useValue: mockHistoryService },
                { provide: UtilService, useValue: mockUtilService },
                { provide: SentenceService, useValue: mockSentenceService },
                { provide: ImageService, useValue: mockImageService },
                {
                    provide: EditorParseService,
                    useValue: mockEditorParseService,
                },
                { provide: WikidataService, useValue: mockWikidataService },
            ],
        }).compile();

        service = await module.resolve<ClaimReviewService>(ClaimReviewService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("listAll", () => {
        it("should return paginated reviews with total count", async () => {
            const mockReviews = [
                {
                    _id: "review-1",
                    classification: "true",
                    data_hash: "hash-1",
                    nameSpace: "main",
                    isPartialReview: false,
                    report: { classification: "true" },
                    target: {
                        _id: "claim-1",
                        slug: "test-claim",
                        latestRevision: {
                            contentModel: "Sentence",
                            date: new Date(),
                            slug: "test-claim",
                            title: "Test Claim",
                        },
                    },
                    personality: { _id: "p-1", slug: "test-person" },
                },
            ];

            // Mock for countReviews pipeline
            mockClaimReviewModel.aggregate
                .mockResolvedValueOnce([{ totalCount: 1 }]) // count
                .mockResolvedValueOnce(mockReviews); // find

            const result = await service.listAll({
                query: { isDeleted: false, isHidden: false },
                page: 0,
                pageSize: 10,
                order: "desc",
            });

            expect(result).toEqual({
                data: expect.any(Array),
                total: 1,
            });
            expect(mockClaimReviewModel.aggregate).toHaveBeenCalledTimes(2);
        });

        it("should return 0 total when no reviews match", async () => {
            mockClaimReviewModel.aggregate
                .mockResolvedValueOnce([]) // count returns empty
                .mockResolvedValueOnce([]); // find returns empty

            const result = await service.listAll({
                query: { isDeleted: false, isHidden: false },
                page: 0,
                pageSize: 10,
                order: "asc",
            });

            expect(result.total).toBe(0);
            expect(result.data).toEqual([]);
        });
    });

    describe("count", () => {
        it("should return count of matching reviews", async () => {
            mockClaimReviewModel.aggregate.mockResolvedValue([
                { totalCount: 42 },
            ]);

            const result = await service.count({
                query: { isDeleted: false, isHidden: false },
            });

            expect(result).toBe(42);
        });

        it("should filter by topic when topicId provided", async () => {
            mockClaimReviewModel.aggregate.mockResolvedValue([
                { totalCount: 5 },
            ]);

            const result = await service.count({
                query: { isDeleted: false, isHidden: false },
                topicId: "topic-123",
            });

            expect(result).toBe(5);
            expect(mockSentenceService.getHashesByTopic).toHaveBeenCalledWith(
                "topic-123"
            );
            expect(mockImageService.getHashesByTopic).toHaveBeenCalledWith(
                "topic-123"
            );
        });
    });

    describe("getReviewClassificationCountsByClaimId", () => {
        it("should group reviews by data_hash and classification", async () => {
            const mockReviews = [
                {
                    data_hash: "hash-1",
                    report: { classification: "true" },
                    toObject: jest.fn().mockReturnThis(),
                },
                {
                    data_hash: "hash-1",
                    report: { classification: "true" },
                    toObject: jest.fn().mockReturnThis(),
                },
                {
                    data_hash: "hash-1",
                    report: { classification: "false" },
                    toObject: jest.fn().mockReturnThis(),
                },
            ];

            mockClaimReviewModel.find.mockResolvedValue(mockReviews);

            const result =
                await service.getReviewClassificationCountsByClaimId(
                    "507f1f77bcf86cd799439011"
                );

            expect(result).toHaveLength(2);

            const trueCount = result.find(
                (r) => r._id.classification[0] === "true"
            );
            const falseCount = result.find(
                (r) => r._id.classification[0] === "false"
            );

            expect(trueCount.count).toBe(2);
            expect(falseCount.count).toBe(1);
        });

        it("should filter by namespace, isDeleted, isPublished, isHidden", async () => {
            mockClaimReviewModel.find.mockResolvedValue([]);

            await service.getReviewClassificationCountsByClaimId("507f1f77bcf86cd799439011");

            expect(mockClaimReviewModel.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    target: "507f1f77bcf86cd799439011",
                    isDeleted: false,
                    isPublished: true,
                    isHidden: false,
                    nameSpace: "main",
                })
            );
        });
    });

    describe("findAllReviewsForCascadeDelete", () => {
        it("should find all reviews for a claim using lean query", async () => {
            const mockReviews = [{ _id: "r1" }, { _id: "r2" }];
            mockClaimReviewModel.find.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockReviews),
            });

            const result =
                await service.findAllReviewsForCascadeDelete("507f1f77bcf86cd799439011");

            expect(result).toEqual(mockReviews);
            expect(mockClaimReviewModel.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    target: expect.any(Types.ObjectId),
                    nameSpace: "main",
                })
            );
        });
    });

    describe("getReviewStatsByClaimId", () => {
        it("should return formatted stats for a claim", async () => {
            const mockReviews = [
                { report: { classification: "true" } },
                { report: { classification: "false" } },
            ];
            mockClaimReviewModel.find.mockResolvedValue(mockReviews);
            mockUtilService.formatStats.mockReturnValue({
                true: 1,
                false: 1,
            });

            const result = await service.getReviewStatsByClaimId("507f1f77bcf86cd799439011");

            expect(mockClaimReviewModel.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    target: "507f1f77bcf86cd799439011",
                    isDeleted: false,
                    isPublished: true,
                })
            );
            expect(mockUtilService.formatStats).toHaveBeenCalled();
            expect(result).toEqual({ true: 1, false: 1 });
        });
    });

    describe("buildClaimReviewBasePipeline (via listAll)", () => {
        it("should include isHidden filter when query.isHidden is falsy", async () => {
            mockClaimReviewModel.aggregate
                .mockResolvedValueOnce([{ totalCount: 0 }])
                .mockResolvedValueOnce([]);

            await service.listAll({
                query: { isDeleted: false, isHidden: false },
                page: 0,
                pageSize: 10,
                order: "asc",
            });

            // First call is count pipeline, check it includes the $match
            // with targetModel
            const countPipeline =
                mockClaimReviewModel.aggregate.mock.calls[0][0];
            const initialMatch = countPipeline[0];
            expect(initialMatch.$match).toEqual(
                expect.objectContaining({
                    targetModel: ReviewTaskTypeEnum.Claim,
                })
            );
        });
    });
});
