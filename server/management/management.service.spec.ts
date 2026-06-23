import { Test, TestingModule } from "@nestjs/testing";
import { ManagementService } from "./management.service";
import { ClaimService } from "../claim/claim.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { personalityServiceMock, claimServiceMock, claimReviewServiceMock } from "../mocks/managementMock";

describe("ManagementService (Unit)", () => {
    let service: ManagementService;
    let personalityService: typeof personalityServiceMock;
    let claimService: typeof claimServiceMock;
    let claimReviewService: typeof claimReviewServiceMock;

    beforeAll(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            providers: [
                ManagementService,
                { provide: "PersonalityService", useValue: personalityServiceMock, },
                { provide: ClaimService, useValue: claimServiceMock, },
                { provide: ClaimReviewService, useValue: claimReviewServiceMock, },
            ],
        }).compile();

        service = testingModule.get<ManagementService>(ManagementService);
        personalityService = testingModule.get("PersonalityService");
        claimService = testingModule.get(ClaimService);
        claimReviewService = testingModule.get(ClaimReviewService);
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("deletePersonalityHierarchy", () => {
        const personalityId = "personality-123";
        const mockClaims = [{ _id: "claim-1" }, { _id: "claim-2" }];
        const mockReviews = [{ _id: "review-1" }];

        it("should successfully delete the entire hierarchy (happy path)", async () => {
            claimService.getByPersonalityId.mockResolvedValue(mockClaims);
            claimReviewService.findAllReviewsForCascadeDelete.mockResolvedValue(mockReviews);
            claimReviewService.delete.mockResolvedValue(true);
            claimService.delete.mockResolvedValue({ _id: "claim-1", isDeleted: true });
            personalityService.delete.mockResolvedValue(true);

            const result = await service.deletePersonalityHierarchy(personalityId);

            expect(claimService.getByPersonalityId).toHaveBeenCalledWith(personalityId);
            expect(claimReviewService.findAllReviewsForCascadeDelete).toHaveBeenCalledTimes(2);
            expect(claimService.delete).toHaveBeenCalledTimes(2);
            expect(personalityService.delete).toHaveBeenCalledWith(personalityId);
            expect(result).toBe(true);
        });

        it("should throw NotFoundException and log warning if personality does not exist", async () => {
            personalityService.delete.mockRejectedValue(new NotFoundException());
            const loggerWarnSpy = vi.spyOn(service['logger'], 'warn');

            await expect(service.deletePersonalityHierarchy(personalityId)).rejects.toThrow(
                NotFoundException
            );
            expect(loggerWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining(`Resource for deletion not found: [personality] ID ${personalityId}`)
            );
        });

        it("should handle error and log it when unexpected failure occurs", async () => {
            const unexpectedError = new Error("Database error");
            personalityService.delete.mockRejectedValue(unexpectedError);
            const loggerErrorSpy = vi.spyOn(service['logger'], 'error');

            await expect(service.deletePersonalityHierarchy(personalityId)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(loggerErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining(`Failed to execute cascade delete for [personality] ID: ${personalityId}`),
                unexpectedError.stack
            );
        });
    });

    describe("deleteClaimHierarchy", () => {
        const claimId = "claim-123";
        const mockReviews = [{ _id: "review-1" }, { _id: "review-2" }];

        it("should delete claim and its reviews successfully", async () => {
            claimReviewService.findAllReviewsForCascadeDelete.mockResolvedValue(mockReviews);
            claimReviewService.delete.mockResolvedValue(true);
            claimService.delete.mockResolvedValue({ _id: claimId, isDeleted: true });

            await service.deleteClaimHierarchy(claimId);

            expect(claimReviewService.findAllReviewsForCascadeDelete).toHaveBeenCalledWith(claimId);
            expect(claimReviewService.delete).toHaveBeenCalledTimes(2);
            expect(claimService.delete).toHaveBeenCalledWith(claimId);
        });

        it("should throw NotFoundException and log warning if claim does not exist", async () => {
            claimReviewService.findAllReviewsForCascadeDelete.mockResolvedValue([]);
            claimService.delete.mockRejectedValue(new NotFoundException());

            const loggerWarnSpy = vi.spyOn(service['logger'], 'warn');

            await expect(service.deleteClaimHierarchy(claimId)).rejects.toThrow(
                NotFoundException
            );
            expect(loggerWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining(`Resource for deletion not found: [claim] ID ${claimId}`)
            );
        });

        it("should handle error and log it when unexpected failure occurs in claim hierarchy", async () => {
            const unexpectedError = new Error("Database connection lost");
            claimReviewService.findAllReviewsForCascadeDelete.mockRejectedValue(unexpectedError);

            const loggerErrorSpy = vi.spyOn(service['logger'], 'error');

            await expect(service.deleteClaimHierarchy(claimId)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(loggerErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining(`Failed to execute cascade delete for [claim] ID: ${claimId}`),
                unexpectedError.stack
            );
        });
    });
});
