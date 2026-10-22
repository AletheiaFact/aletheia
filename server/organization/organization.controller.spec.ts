import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { ImageService } from "../claim/types/image/image.service";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
import { OrganizationController } from "./organization.controller";

describe("OrganizationController", () => {
    let controller: OrganizationController;

    const mockOrganizationService = {
        create: vi.fn(),
        update: vi.fn(),
        search: vi.fn(),
    };
    const mockImageService = { create: vi.fn() };
    const mockFeatureFlagService = { isEnableEventsFeature: vi.fn() };

    const uploadedLogo = {
        FileURL: "https://bucket.s3.amazonaws.com/logo.png",
        Key: "logo.png",
        Extension: "png",
        DataHash: "0123456789abcdef0123456789abcdef",
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrganizationController],
            providers: [
                {
                    provide: "OrganizationService",
                    useValue: mockOrganizationService,
                },
                { provide: ImageService, useValue: mockImageService },
                {
                    provide: FeatureFlagService,
                    useValue: mockFeatureFlagService,
                },
            ],
        })
            .overrideGuard(AbilitiesGuard)
            .useValue({})
            .compile();

        controller = module.get(OrganizationController);
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(true);
    });

    it("returns 404 on every endpoint when the events flag is off", async () => {
        mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(false);

        expect(() => controller.search({ name: "a", limit: 10 })).toThrow(
            NotFoundException
        );
        await expect(
            controller.create({ name: "Org", logo: uploadedLogo })
        ).rejects.toThrow(NotFoundException);
        await expect(
            controller.update("507f1f77bcf86cd799439011", { name: "Org" })
        ).rejects.toThrow(NotFoundException);
        expect(mockImageService.create).not.toHaveBeenCalled();
    });

    it("persists a fresh upload as an Image and stores its id", async () => {
        mockImageService.create.mockResolvedValue({ _id: "img1" });

        await controller.create({ name: "Org", logo: uploadedLogo });

        expect(mockImageService.create).toHaveBeenCalledWith(uploadedLogo);
        expect(mockOrganizationService.create).toHaveBeenCalledWith({
            name: "Org",
            logo: "img1",
        });
    });

    it("reuses an existing Image without creating a new one", async () => {
        await controller.create({
            name: "Org",
            logo: { _id: "507f1f77bcf86cd799439012" },
        });

        expect(mockImageService.create).not.toHaveBeenCalled();
        expect(mockOrganizationService.create).toHaveBeenCalledWith({
            name: "Org",
            logo: "507f1f77bcf86cd799439012",
        });
    });

    it("leaves the logo untouched when an update omits it", async () => {
        const id = "507f1f77bcf86cd799439011";

        await controller.update(id, { website: "https://example.org" });

        expect(mockImageService.create).not.toHaveBeenCalled();
        expect(mockOrganizationService.update).toHaveBeenCalledWith(id, {
            website: "https://example.org",
        });
    });
});
