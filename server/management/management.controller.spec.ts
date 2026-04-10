import { Test } from "@nestjs/testing";
import { ManagementController } from "./management.controller";
import { ManagementService } from "./management.service";
import { BadRequestException } from "@nestjs/common";
import { mockManagementService } from "../mocks/managementMock";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";

describe("ManagementController (Unit)", () => {
    let controller: ManagementController;
    let managementService: any;

    beforeEach(async () => {
        const testingModule = await Test.createTestingModule({
            controllers: [ManagementController],
            providers: [
                { provide: ManagementService, useValue: mockManagementService },
            ],
        })
            .overrideGuard(AbilitiesGuard)
            .useValue({})
            .compile();

        controller = testingModule.get(ManagementController);
        managementService = testingModule.get(ManagementService);
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("deletePersonality", () => {
        const validId = "507f1f77bcf86cd799439011";
        const invalidId = "123-id-invalido";

        it("should successfully trigger personality deletion (happy path)", async () => {
            managementService.deletePersonalityHierarchy.mockResolvedValue(undefined);

            await controller.deletePersonality(validId);

            expect(managementService.deletePersonalityHierarchy).toHaveBeenCalledWith(validId);
        });

        it("should throw BadRequestException if personality ID format is invalid", async () => {
            await expect(controller.deletePersonality(invalidId)).rejects.toThrow(
                BadRequestException
            );

            expect(managementService.deletePersonalityHierarchy).not.toHaveBeenCalled();
        });

        it("should propagate service errors during personality deletion", async () => {
            managementService.deletePersonalityHierarchy.mockRejectedValue(new Error("Service error"));

            await expect(controller.deletePersonality(validId)).rejects.toThrow("Service error");
        });
    });

    describe("deleteClaim", () => {
        const validId = "507f1f77bcf86cd799439011";
        const invalidId = "123-id-invalido";

        it("should successfully trigger claim deletion (happy path)", async () => {
            managementService.deleteClaimHierarchy.mockResolvedValue(undefined);

            await controller.deleteClaim(validId);

            expect(managementService.deleteClaimHierarchy).toHaveBeenCalledWith(validId);
        });

        it("should throw BadRequestException if claim ID format is invalid", async () => {
            await expect(controller.deleteClaim(invalidId)).rejects.toThrow(
                BadRequestException
            );

            expect(managementService.deleteClaimHierarchy).not.toHaveBeenCalled();
        });

        it("should propagate service errors during claim deletion", async () => {
            managementService.deleteClaimHierarchy.mockRejectedValue(new Error("Service error"));

            await expect(controller.deleteClaim(validId)).rejects.toThrow("Service error");
        });
    });
});
