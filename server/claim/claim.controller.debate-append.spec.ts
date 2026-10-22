import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ClaimController } from "./claim.controller";
import { ImageService } from "./types/image/image.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ReviewTaskService } from "../review-task/review-task.service";
import { ConfigService } from "@nestjs/config";
import { ViewService } from "../view/view.service";
import { CaptchaService } from "../captcha/captcha.service";
import { DebateService } from "./types/debate/debate.service";
import { EditorService } from "../editor/editor.service";
import { ParserService } from "./parser/parser.service";
import { HistoryService } from "../history/history.service";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { M2MOrAbilitiesGuard } from "../auth/decorators/m2m-or-abilities.decorator";
import { ContentModelEnum } from "../types/enums";

const debateId = "64b7f0c2e1a2b3c4d5e6f700";
const revisionId = "64b7f0c2e1a2b3c4d5e6f701";
const speakerA = "64b7f0c2e1a2b3c4d5e6f702";
const speakerB = "64b7f0c2e1a2b3c4d5e6f703";
const outsider = "64b7f0c2e1a2b3c4d5e6f704";

describe("ClaimController.appendDebateTranscript (Unit)", () => {
    let controller: ClaimController;
    let claimRevisionService: { getByContentId: ReturnType<typeof vi.fn> };
    let debateService: {
        findAppendedExternalIds: ReturnType<typeof vi.fn>;
        appendTranscriptTurns: ReturnType<typeof vi.fn>;
    };
    let parserService: { parse: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        claimRevisionService = {
            getByContentId: vi.fn().mockResolvedValue({
                _id: revisionId,
                contentModel: ContentModelEnum.Debate,
                personalities: [speakerA, { _id: speakerB }],
            }),
        };
        debateService = {
            findAppendedExternalIds: vi.fn().mockResolvedValue(new Set()),
            appendTranscriptTurns: vi
                .fn()
                .mockImplementation((_id, _turns, isLive) =>
                    Promise.resolve({ isLive: isLive ?? true })
                ),
        };
        let speechCount = 0;
        parserService = {
            parse: vi
                .fn()
                .mockImplementation(() =>
                    Promise.resolve({ _id: `speech-${++speechCount}` })
                ),
        };

        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [ClaimController],
            providers: [
                { provide: ClaimReviewService, useValue: {} },
                { provide: ReviewTaskService, useValue: {} },
                { provide: "PersonalityService", useValue: {} },
                { provide: "ClaimService", useValue: {} },
                { provide: "SentenceService", useValue: {} },
                { provide: ConfigService, useValue: {} },
                { provide: ViewService, useValue: {} },
                { provide: CaptchaService, useValue: {} },
                { provide: ImageService, useValue: {} },
                { provide: DebateService, useValue: debateService },
                { provide: EditorService, useValue: {} },
                { provide: ParserService, useValue: parserService },
                { provide: HistoryService, useValue: {} },
                {
                    provide: "ClaimRevisionService",
                    useValue: claimRevisionService,
                },
                { provide: FeatureFlagService, useValue: {} },
                { provide: "GroupService", useValue: {} },
            ],
        })
            .overrideGuard(AbilitiesGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(M2MOrAbilitiesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = testingModule.get<ClaimController>(ClaimController);
    });

    it("parses each turn into a speech and appends them in request order", async () => {
        const result = await controller.appendDebateTranscript(debateId, {
            turns: [
                {
                    personality: speakerA,
                    text: "First.",
                    externalId: "t1",
                    startedAt: "2024-01-01T10:00:00.000Z",
                },
                { personality: speakerB, text: "Second." },
            ],
            isLive: true,
        });

        expect(parserService.parse.mock.calls).toEqual([
            ["First.", revisionId, speakerA],
            ["Second.", revisionId, speakerB],
        ]);
        expect(debateService.appendTranscriptTurns).toHaveBeenCalledWith(
            debateId,
            [
                {
                    speech: "speech-1",
                    externalId: "t1",
                    startedAt: new Date("2024-01-01T10:00:00.000Z"),
                },
                {
                    speech: "speech-2",
                    externalId: undefined,
                    startedAt: undefined,
                },
            ],
            true
        );
        expect(result).toEqual({
            appended: [
                { speechId: "speech-1", externalId: "t1" },
                { speechId: "speech-2", externalId: undefined },
            ],
            skipped: [],
            isLive: true,
        });
    });

    it("skips turns whose externalId is already on the debate", async () => {
        debateService.findAppendedExternalIds.mockResolvedValue(
            new Set(["t1"])
        );

        const result = await controller.appendDebateTranscript(debateId, {
            turns: [
                { personality: speakerA, text: "Old.", externalId: "t1" },
                { personality: speakerB, text: "New.", externalId: "t2" },
            ],
        });

        expect(debateService.findAppendedExternalIds).toHaveBeenCalledWith(
            debateId,
            ["t1", "t2"]
        );
        expect(parserService.parse).toHaveBeenCalledTimes(1);
        expect(parserService.parse).toHaveBeenCalledWith(
            "New.",
            revisionId,
            speakerB
        );
        expect(result.skipped).toEqual(["t1"]);
        expect(result.appended).toEqual([
            { speechId: "speech-1", externalId: "t2" },
        ]);
    });

    it("does not write when every turn is a repeat and isLive is absent", async () => {
        debateService.findAppendedExternalIds.mockResolvedValue(
            new Set(["t1"])
        );

        const result = await controller.appendDebateTranscript(debateId, {
            turns: [{ personality: speakerA, text: "Old.", externalId: "t1" }],
        });

        expect(parserService.parse).not.toHaveBeenCalled();
        expect(debateService.appendTranscriptTurns).not.toHaveBeenCalled();
        expect(result).toEqual({
            appended: [],
            skipped: ["t1"],
            isLive: undefined,
        });
    });

    it("rejects a speaker who is not one of the debate's personalities", async () => {
        await expect(
            controller.appendDebateTranscript(debateId, {
                turns: [
                    { personality: speakerA, text: "Ok." },
                    { personality: outsider, text: "Who am I?" },
                ],
            })
        ).rejects.toThrow(BadRequestException);
        expect(parserService.parse).not.toHaveBeenCalled();
    });

    it("rejects a content id that is not a debate", async () => {
        claimRevisionService.getByContentId.mockResolvedValue({
            _id: revisionId,
            contentModel: ContentModelEnum.Speech,
            personalities: [speakerA],
        });

        await expect(
            controller.appendDebateTranscript(debateId, {
                turns: [{ personality: speakerA, text: "Hi." }],
            })
        ).rejects.toThrow(BadRequestException);
    });

    it("returns 404 when no claim revision owns the debate id", async () => {
        claimRevisionService.getByContentId.mockResolvedValue(null);

        await expect(
            controller.appendDebateTranscript(debateId, {
                turns: [{ personality: speakerA, text: "Hi." }],
            })
        ).rejects.toThrow(NotFoundException);
    });
});
