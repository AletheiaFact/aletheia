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
        find: vi.fn(),
        findById: vi.fn(),
        findOne: vi.fn(),
        countDocuments: vi.fn(),
        softDelete: vi.fn(),
        aggregate: vi.fn(),
    };

    // Make mockClaimModel callable as constructor while keeping same reference
    const ClaimModelConstructor: any = vi.fn().mockImplementation((data) => ({
        ...data,
        _id: new Types.ObjectId(),
        save: vi.fn().mockResolvedValue(data),
        toObject: vi.fn().mockReturnValue(data),
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
        getReviewClassificationCountsByClaimId: vi.fn().mockResolvedValue([]),
        getReviewStatsByClaimId: vi.fn().mockResolvedValue({}),
    };

    const mockClaimRevisionService = {
        create: vi.fn().mockResolvedValue({
            _id: "revision-123",
            slug: "test-claim",
            toObject: vi.fn().mockReturnValue({
                _id: "revision-123",
                slug: "test-claim",
            }),
        }),
    };

    const mockHistoryService = {
        getHistoryParams: vi.fn().mockReturnValue({}),
        createHistory: vi.fn().mockResolvedValue({}),
    };

    const mockStateEventService = {
        getStateEventParams: vi.fn().mockReturnValue({}),
        createStateEvent: vi.fn(),
    };

    const mockReviewTaskService = {
        getReviewTasksByClaimId: vi.fn().mockResolvedValue([]),
    };

    const mockUtilService = {
        formatStats: vi.fn().mockImplementation((stats) => stats),
        getParamsBasedOnUserRole: vi.fn().mockImplementation((params) => params),
    };

    const mockGroupService = {
        updateWithTargetId: vi.fn(),
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
        vi.clearAllMocks();
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

            const lean = vi.fn().mockResolvedValue(mockClaims);
            const sort = vi.fn().mockReturnValue({ lean });
            const limit = vi.fn().mockReturnValue({ sort });
            const skip = vi.fn().mockReturnValue({ limit });
            const populate = vi.fn().mockReturnValue({ skip });

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
                populate: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue(result),
                select: vi.fn().mockReturnThis(),
            };
            chain.populate.mockReturnValue(chain);
            mockClaimModel.findOne = vi.fn().mockReturnValue(chain);
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
