import { Test, TestingModule } from "@nestjs/testing";
import { ClaimController } from "./claim.controller";
import { ImageService } from "./types/image/image.service";
import { BadRequestException } from "@nestjs/common";
import {
    mockClaimService,
    mockImageService,
    mockPersonalityService,
} from "../mocks/ClaimMock";
import { ClaimService } from "./claim.service";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ReviewTaskService } from "../review-task/review-task.service";
import { SentenceService } from "./types/sentence/sentence.service";
import { ConfigService } from "aws-sdk";
import { ViewService } from "../view/view.service";
import { CaptchaService } from "../captcha/captcha.service";
import { DebateService } from "./types/debate/debate.service";
import { EditorService } from "../editor/editor.service";
import { ParserService } from "./parser/parser.service";
import { HistoryService } from "../history/history.service";
import { ClaimRevisionService } from "./claim-revision/claim-revision.service";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
import { GroupService } from "../group/group.service";
import { AbilityFactory } from "../auth/ability/ability.factory";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";

describe("ClaimController (Unit)", () => {
    let controller: ClaimController;
    let testingModule: TestingModule;
    let imageService: ReturnType<typeof mockImageService>;
    let claimService: ReturnType<typeof mockClaimService>;

    beforeEach(async () => {
        (imageService = mockImageService()),
            (claimService = mockClaimService());

        const AuthGuardMock = {
            canActivate: jest.fn(() => true),
        };

        testingModule = await Test.createTestingModule({
            controllers: [ClaimController],
            providers: [
                { provide: ImageService, useValue: imageService },
                { provide: ClaimService, useValue: claimService },

                { provide: ClaimReviewService, useValue: {} },
                { provide: ReviewTaskService, useValue: {} },
                { provide: SentenceService, useValue: {} },
                { provide: ConfigService, useValue: {} },
                { provide: ViewService, useValue: {} },
                { provide: CaptchaService, useValue: {} },
                { provide: DebateService, useValue: {} },
                { provide: EditorService, useValue: {} },
                { provide: ParserService, useValue: {} },
                { provide: HistoryService, useValue: {} },
                { provide: ClaimRevisionService, useValue: {} },
                { provide: FeatureFlagService, useValue: {} },
                { provide: GroupService, useValue: {} },

                { provide: "REQUEST", useValue: {} },

                { provide: AbilityFactory, useValue: {} },
            ],
        }).compile();

        controller = testingModule.get<ClaimController>(ClaimController);

        jest.spyOn(
            controller as any,
            "returnClaimReviewPage"
        ).mockResolvedValue(undefined);
    });

    it("should throw error when data_hash is invalid", async () => {
        const mockReq = {
            params: {
                data_hash: "",
            },
        } as any;

        const mockRes = {} as any;

        await expect(
            controller.getImageClaimReviewPage(mockReq, mockRes)
        ).rejects.toThrow();
    });
});
