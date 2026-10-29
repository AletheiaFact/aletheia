import { Test, TestingModule } from "@nestjs/testing";
import { ClaimReviewPageController } from "./claim-review-page.controller";
import { ImageService } from "./types/image/image.service";
import {
    mockClaimService,
    mockImageService,
    mockPersonalityService,
} from "../mocks/ClaimMock";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ReviewTaskService } from "../review-task/review-task.service";
import { ConfigService } from "@nestjs/config";
import { ViewService } from "../view/view.service";
import { CaptchaService } from "../captcha/captcha.service";
import { EditorService } from "../editor/editor.service";
import { HistoryService } from "../history/history.service";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";

import { AbilitiesGuard } from "../auth/ability/abilities.guard";

describe("ClaimReviewPageController (Unit)", () => {
    let controller: ClaimReviewPageController;
    let testingModule: TestingModule;
    let imageService: ReturnType<typeof mockImageService>;
    let claimService: ReturnType<typeof mockClaimService>;
    let personalityService: ReturnType<typeof mockPersonalityService>;

    beforeEach(async () => {
        imageService = mockImageService();
        claimService = mockClaimService();
        personalityService = mockPersonalityService();

        testingModule = await Test.createTestingModule({
            controllers: [ClaimReviewPageController],
            providers: [
                { provide: ClaimReviewService, useValue: {} },
                { provide: ReviewTaskService, useValue: {} },
                { provide: "PersonalityService", useValue: personalityService },
                { provide: "ClaimService", useValue: claimService },
                { provide: "SentenceService", useValue: {} },
                { provide: ConfigService, useValue: {} },
                { provide: ViewService, useValue: {} },
                { provide: CaptchaService, useValue: {} },
                { provide: ImageService, useValue: imageService },
                { provide: EditorService, useValue: {} },
                { provide: HistoryService, useValue: {} },
                { provide: FeatureFlagService, useValue: {} },

                { provide: "REQUEST", useValue: {} },
            ],
        })
            .overrideGuard(AbilitiesGuard)
            .useValue({})
            .compile();

        controller = testingModule.get<ClaimReviewPageController>(
            ClaimReviewPageController
        );
    });

    it("should accept data_hash when it is a string", async () => {
        const req = {
            params: { data_hash: "96cffa6efb4c5732c46dfed98be707a5" },
        } as any;
        const res = {} as any;

        personalityService.getPersonalityBySlug!.mockResolvedValue({
            _id: "507f1f77bcf86cd799439011",
            name: "Test Personality",
            slug: "test-personality",
            description: "Test description",
            isHidden: false,
        } as any);

        claimService.getByPersonalityIdAndClaimSlug.mockResolvedValue({
            _id: "507f1f77bcf86cd799439012",
            slug: "test-claim",
            personalities: ["507f1f77bcf86cd799439011"],
            isHidden: false,
            nameSpace: "main",
        } as any);

        imageService.getByDataHash.mockResolvedValue({
            _id: "507f1f77bcf86cd799439013",
            type: "Image",
            data_hash: "96cffa6efb4c5732c46dfed98be707a5",
            content: "https://example.com/image.jpg",
            props: {
                key: "test-image-key",
                extension: "jpg",
            },
        } as any);

        vi.spyOn(controller as any, "returnClaimReviewPage").mockResolvedValue(
            undefined
        );

        await expect(
            controller.getImageClaimReviewPage(req, res)
        ).resolves.not.toThrow();
    });
});
