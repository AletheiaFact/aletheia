import { Test, TestingModule } from "@nestjs/testing";
import { ClaimController } from "./claim.controller";
import { ImageService } from "./types/image/image.service";
import {
    mockClaimService,
    mockImageService,
    mockPersonalityService,
} from "../mocks/ClaimMock";
import { ClaimService } from "./claim.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ReviewTaskService } from "../review-task/review-task.service";
import { SentenceService } from "./types/sentence/sentence.service";
import { ConfigService } from "@nestjs/config";
import { ViewService } from "../view/view.service";
import { CaptchaService } from "../captcha/captcha.service";
import { DebateService } from "./types/debate/debate.service";
import { EditorService } from "../editor/editor.service";
import { ParserService } from "./parser/parser.service";
import { HistoryService } from "../history/history.service";
import { ClaimRevisionService } from "./claim-revision/claim-revision.service";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
import { GroupService } from "../group/group.service";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { GetByDataHashDto } from "./dto/get-by-datahash.dto";

describe("ClaimController (Unit)", () => {
    let controller: ClaimController;
    let testingModule: TestingModule;
    let imageService: ReturnType<typeof mockImageService>;
    let claimService: ReturnType<typeof mockClaimService>;
    let personalityService: ReturnType<typeof mockPersonalityService>;

    beforeEach(async () => {
        imageService = mockImageService();
        claimService = mockClaimService();
        personalityService = mockPersonalityService();

        testingModule = await Test.createTestingModule({
            controllers: [ClaimController],
            providers: [
                { provide: ClaimReviewService, useValue: {} },
                { provide: ReviewTaskService, useValue: {} },
                { provide: "PersonalityService", useValue: personalityService },
                { provide: ClaimService, useValue: claimService },
                { provide: SentenceService, useValue: {} },
                { provide: ConfigService, useValue: {} },
                { provide: ViewService, useValue: {} },
                { provide: CaptchaService, useValue: {} },
                { provide: ImageService, useValue: imageService },
                { provide: DebateService, useValue: {} },
                { provide: EditorService, useValue: {} },
                { provide: ParserService, useValue: {} },
                { provide: HistoryService, useValue: {} },
                { provide: ClaimRevisionService, useValue: {} },
                { provide: FeatureFlagService, useValue: {} },
                { provide: GroupService, useValue: {} },

                { provide: "REQUEST", useValue: {} },
            ],
        })
            .overrideGuard(AbilitiesGuard)
            .useValue({})
            .compile();

        controller = testingModule.get<ClaimController>(ClaimController);
    });

    describe("GetByDataHashDto", () => {
        it("should accept valid data_hash", () => {
            expect(() =>
                GetByDataHashDto.parse({
                    data_hash: "96cffa6efb4c5732c46dfed98be707a5",
                })
            ).not.toThrow();
        });

        it("should throw when data_hash is invalid", () => {
            expect(() =>
                GetByDataHashDto.parse({
                    data_hash: 123,
                })
            ).toThrow();
        });

        it("should throw when data_hash is empty", () => {
            expect(() =>
                GetByDataHashDto.parse({
                    data_hash: "",
                })
            ).toThrow();
        });
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

        jest.spyOn(
            controller as any,
            "returnClaimReviewPage"
        ).mockResolvedValue(undefined);

        await expect(
            controller.getImageClaimReviewPage(req, res)
        ).resolves.not.toThrow();
    });
});
