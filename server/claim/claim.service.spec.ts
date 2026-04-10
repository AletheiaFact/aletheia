import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Types } from "mongoose";
import { ClaimService } from "./claim.service";
import { Claim } from "./schemas/claim.schema";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ClaimRevisionService } from "./claim-revision/claim-revision.service";
import { HistoryService } from "../history/history.service";
import { StateEventService } from "../state-event/state-event.service";
import { ReviewTaskService } from "../review-task/review-task.service";
import { UtilService } from "../util";
import { GroupService } from "../group/group.service";

describe("ClaimService (Unit)", () => {
    let service: ClaimService;

    const mockRequest = {
        user: { _id: "user-123", role: { main: "admin" } },
        params: { namespace: "main" },
    };

    const mockClaimModel: any = {
        find: jest.fn(),
        findById: jest.fn(),
        findOne: jest.fn(),
        countDocuments: jest.fn(),
        softDelete: jest.fn(),
        aggregate: jest.fn(),
    };

    // Make mockClaimModel callable as constructor while keeping same reference
    const ClaimModelConstructor: any = jest.fn().mockImplementation((data) => ({
        ...data,
        _id: new Types.ObjectId(),
        save: jest.fn().mockResolvedValue(data),
        toObject: jest.fn().mockReturnValue(data),
    }));
    // Assign model methods directly so mutations are shared
    Object.keys(mockClaimModel).forEach((key) => {
        Object.defineProperty(ClaimModelConstructor, key, {
            get: () => mockClaimModel[key],
            set: (val) => { mockClaimModel[key] = val; },
            configurable: true,
        });
    });

    const mockClaimReviewService = {
        getReviewClassificationCountsByClaimId: jest.fn().mockResolvedValue([]),
        getReviewStatsByClaimId: jest.fn().mockResolvedValue({}),
    };

    const mockClaimRevisionService = {
        create: jest.fn().mockResolvedValue({
            _id: "revision-123",
            slug: "test-claim",
            toObject: jest.fn().mockReturnValue({
                _id: "revision-123",
                slug: "test-claim",
            }),
        }),
    };

    const mockHistoryService = {
        getHistoryParams: jest.fn().mockReturnValue({}),
        createHistory: jest.fn().mockResolvedValue({}),
    };

    const mockStateEventService = {
        getStateEventParams: jest.fn().mockReturnValue({}),
        createStateEvent: jest.fn(),
    };

    const mockReviewTaskService = {
        getReviewTasksByClaimId: jest.fn().mockResolvedValue([]),
    };

    const mockUtilService = {
        formatStats: jest.fn().mockImplementation((stats) => stats),
        getParamsBasedOnUserRole: jest.fn().mockImplementation((params) => params),
    };

    const mockGroupService = {
        updateWithTargetId: jest.fn(),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClaimService,
                { provide: REQUEST, useValue: mockRequest },
                {
                    provide: getModelToken(Claim.name),
                    useValue: ClaimModelConstructor,
                },
                {
                    provide: ClaimReviewService,
                    useValue: mockClaimReviewService,
                },
                {
                    provide: ClaimRevisionService,
                    useValue: mockClaimRevisionService,
                },
                { provide: HistoryService, useValue: mockHistoryService },
                { provide: StateEventService, useValue: mockStateEventService },
                { provide: ReviewTaskService, useValue: mockReviewTaskService },
                { provide: UtilService, useValue: mockUtilService },
                { provide: GroupService, useValue: mockGroupService },
            ],
        }).compile();

        service = await module.resolve<ClaimService>(ClaimService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("count", () => {
        it("should return count of documents matching query", async () => {
            mockClaimModel.countDocuments.mockResolvedValue(42);

            const result = await service.count({ isDeleted: false });

            expect(mockClaimModel.countDocuments).toHaveBeenCalledWith({
                isDeleted: false,
            });
            expect(result).toBe(42);
        });

        it("should return count with empty query by default", async () => {
            mockClaimModel.countDocuments.mockResolvedValue(100);

            const result = await service.count();

            expect(mockClaimModel.countDocuments).toHaveBeenCalledWith({});
            expect(result).toBe(100);
        });
    });

    describe("listAll", () => {
        it("should return paginated claims with total", async () => {
            const mockClaims = [
                {
                    _id: "507f1f77bcf86cd799439011",
                    latestRevision: {
                        title: "Test Claim",
                        contentModel: "Sentence",
                        slug: "test-claim",
                    },
                    data_hash: "hash-1",
                    content: [{ props: {}, content: [] }],
                },
            ];

            const lean = jest.fn().mockResolvedValue(mockClaims);
            const sort = jest.fn().mockReturnValue({ lean });
            const limit = jest.fn().mockReturnValue({ sort });
            const skip = jest.fn().mockReturnValue({ limit });
            const populate = jest.fn().mockReturnValue({ skip });

            mockClaimModel.find.mockReturnValue({ populate });
            mockClaimModel.countDocuments.mockResolvedValue(1);

            const result = await service.listAll(0, 10, "desc", {
                isDeleted: false,
                isHidden: false,
            });

            expect(result).toEqual(
                expect.objectContaining({
                    total: 1,
                    data: expect.any(Array),
                })
            );
            expect(skip).toHaveBeenCalledWith(0);
            expect(limit).toHaveBeenCalledWith(10);
        });
    });

    describe("delete", () => {
        const setupFindOneMock = (result: any) => {
            const chain: any = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(result),
                select: jest.fn().mockReturnThis(),
            };
            chain.populate.mockReturnValue(chain);
            mockClaimModel.findOne = jest.fn().mockReturnValue(chain);
            return chain;
        };

        it("should soft delete a claim and create history", async () => {
            const mockClaim = {
                _id: "507f1f77bcf86cd799439011",
                data_hash: "hash-1",
                latestRevision: {
                    title: "Test",
                    contentModel: "Sentence",
                    slug: "test",
                },
                content: [{ props: {}, content: [] }],
            };
            setupFindOneMock(mockClaim);
            mockClaimReviewService.getReviewClassificationCountsByClaimId.mockResolvedValue(
                []
            );
            mockReviewTaskService.getReviewTasksByClaimId.mockResolvedValue([]);
            mockClaimModel.softDelete.mockResolvedValue({ deleted: 1 });

            await service.delete("507f1f77bcf86cd799439011");

            expect(mockHistoryService.createHistory).toHaveBeenCalled();
            expect(mockClaimModel.softDelete).toHaveBeenCalledWith({
                _id: "507f1f77bcf86cd799439011",
            });
        });

        it("should throw NotFoundException when claim does not exist", async () => {
            setupFindOneMock(null);

            await expect(
                service.delete("507f1f77bcf86cd799439099")
            ).rejects.toThrow(NotFoundException);
        });
    });
});
