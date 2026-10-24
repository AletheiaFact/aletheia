import {
    BadRequestException,
    ConflictException,
    NotFoundException,
} from "@nestjs/common";
import { Types } from "mongoose";
import { DebateTranscriptService } from "./debate-transcript.service";
import { TranscriptTurnStatus } from "../schemas/debate.schema";
import { ContentModelEnum } from "../../../../types/enums";

const debateId = "64b7f0c2e1a2b3c4d5e6f700";
const revisionId = "64b7f0c2e1a2b3c4d5e6f701";
const speakerA = "64b7f0c2e1a2b3c4d5e6f702";
const speakerB = "64b7f0c2e1a2b3c4d5e6f703";
const outsider = "64b7f0c2e1a2b3c4d5e6f704";

describe("DebateTranscriptService", () => {
    let service: DebateTranscriptService;
    let claimRevisionService: { getByContentId: ReturnType<typeof vi.fn> };
    let debateService: Record<string, ReturnType<typeof vi.fn>>;
    let parserService: { parse: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        claimRevisionService = {
            getByContentId: vi.fn().mockResolvedValue({
                _id: revisionId,
                contentModel: ContentModelEnum.Debate,
                personalities: [speakerA, { _id: speakerB }],
            }),
        };
        debateService = {
            findAppendedExternalIds: vi.fn().mockResolvedValue(new Set()),
            addDraftTurns: vi
                .fn()
                .mockImplementation((_id, _turns, isLive) =>
                    Promise.resolve({ isLive: isLive ?? true })
                ),
            getTranscriptTurns: vi.fn().mockResolvedValue([]),
            replaceDraftTurn: vi.fn().mockResolvedValue({}),
            reviewDraftTurns: vi.fn().mockResolvedValue([]),
            listTranscriptTurns: vi.fn().mockResolvedValue([]),
        };
        let speechCount = 0;
        parserService = {
            parse: vi.fn().mockImplementation(() =>
                Promise.resolve({
                    _id: new Types.ObjectId(
                        (++speechCount).toString(16).padStart(24, "0")
                    ),
                })
            ),
        };
        service = new DebateTranscriptService(
            claimRevisionService as any,
            debateService as any,
            parserService as any
        );
    });

    describe("append", () => {
        it("parses each turn as a draft speech, in request order", async () => {
            const result = await service.append(debateId, {
                turns: [
                    {
                        personality: speakerA,
                        text: "First.",
                        externalId: "t1",
                        startedAt: "2024-01-01T10:00:00.000Z",
                        checkability: 72,
                    },
                    { personality: speakerB, text: "Second." },
                ],
                isLive: true,
            });

            expect(parserService.parse.mock.calls).toEqual([
                [
                    "First.",
                    revisionId,
                    speakerA,
                    ContentModelEnum.Speech,
                    { isDraft: true },
                ],
                [
                    "Second.",
                    revisionId,
                    speakerB,
                    ContentModelEnum.Speech,
                    { isDraft: true },
                ],
            ]);

            const [, turns, isLive] = debateService.addDraftTurns.mock.calls[0];
            expect(isLive).toBe(true);
            expect(
                turns.map((turn) => ({
                    speech: String(turn.speech),
                    personality: String(turn.personality),
                    text: turn.text,
                    externalId: turn.externalId,
                    startedAt: turn.startedAt,
                    checkability: turn.checkability,
                }))
            ).toEqual([
                {
                    speech: "000000000000000000000001",
                    personality: speakerA,
                    text: "First.",
                    externalId: "t1",
                    startedAt: new Date("2024-01-01T10:00:00.000Z"),
                    checkability: 72,
                },
                {
                    speech: "000000000000000000000002",
                    personality: speakerB,
                    text: "Second.",
                    externalId: undefined,
                    startedAt: undefined,
                    checkability: undefined,
                },
            ]);

            expect(result.skipped).toEqual([]);
            expect(result.isLive).toBe(true);
            expect(result.drafts).toEqual([
                {
                    turnId: String(turns[0]._id),
                    speechId: "000000000000000000000001",
                    externalId: "t1",
                },
                {
                    turnId: String(turns[1]._id),
                    speechId: "000000000000000000000002",
                    externalId: undefined,
                },
            ]);
        });

        it("skips turns whose externalId is already on the debate", async () => {
            debateService.findAppendedExternalIds.mockResolvedValue(
                new Set(["t1"])
            );

            const result = await service.append(debateId, {
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
            expect(parserService.parse.mock.calls[0][0]).toBe("New.");
            expect(result.skipped).toEqual(["t1"]);
            expect(result.drafts.map((d) => d.externalId)).toEqual(["t2"]);
        });

        it("does not write when every turn is a repeat and isLive is absent", async () => {
            debateService.findAppendedExternalIds.mockResolvedValue(
                new Set(["t1"])
            );

            const result = await service.append(debateId, {
                turns: [
                    { personality: speakerA, text: "Old.", externalId: "t1" },
                ],
            });

            expect(parserService.parse).not.toHaveBeenCalled();
            expect(debateService.addDraftTurns).not.toHaveBeenCalled();
            expect(result).toEqual({
                drafts: [],
                skipped: ["t1"],
                isLive: undefined,
            });
        });

        it("rejects a speaker who is not one of the debate's personalities", async () => {
            await expect(
                service.append(debateId, {
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
                service.append(debateId, {
                    turns: [{ personality: speakerA, text: "Hi." }],
                })
            ).rejects.toThrow(BadRequestException);
        });

        it("returns 404 when no claim revision owns the debate id", async () => {
            claimRevisionService.getByContentId.mockResolvedValue(null);

            await expect(
                service.append(debateId, {
                    turns: [{ personality: speakerA, text: "Hi." }],
                })
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe("edit", () => {
        const turnId = "64b7f0c2e1a2b3c4d5e6f710";
        const oldSpeech = new Types.ObjectId("64b7f0c2e1a2b3c4d5e6f711");
        const draftTurn = {
            _id: new Types.ObjectId(turnId),
            speech: oldSpeech,
            personality: new Types.ObjectId(speakerA),
            text: "Teh original.",
            status: TranscriptTurnStatus.Draft,
        };

        it("parses the new text as a new draft speech and swaps it in", async () => {
            debateService.getTranscriptTurns.mockResolvedValue([draftTurn]);

            const result = await service.edit(debateId, turnId, {
                text: "The original.",
            });

            expect(parserService.parse).toHaveBeenCalledWith(
                "The original.",
                revisionId,
                speakerA,
                ContentModelEnum.Speech,
                { isDraft: true }
            );
            const [, editedTurnId, previousSpeech, replacement] =
                debateService.replaceDraftTurn.mock.calls[0];
            expect(editedTurnId).toBe(turnId);
            expect(previousSpeech).toBe(oldSpeech);
            expect(replacement.text).toBe("The original.");
            expect(String(replacement.personality)).toBe(speakerA);
            expect(result).toEqual({
                turnId,
                speechId: "000000000000000000000001",
                personality: speakerA,
                text: "The original.",
                status: TranscriptTurnStatus.Draft,
            });
        });

        it("keeps the text when only the speaker changes", async () => {
            debateService.getTranscriptTurns.mockResolvedValue([draftTurn]);

            await service.edit(debateId, turnId, { personality: speakerB });

            expect(parserService.parse.mock.calls[0].slice(0, 3)).toEqual([
                "Teh original.",
                revisionId,
                speakerB,
            ]);
        });

        it("rejects a turn that was already reviewed", async () => {
            debateService.getTranscriptTurns.mockResolvedValue([
                { ...draftTurn, status: TranscriptTurnStatus.Approved },
            ]);

            await expect(
                service.edit(debateId, turnId, { text: "Too late." })
            ).rejects.toThrow(ConflictException);
            expect(parserService.parse).not.toHaveBeenCalled();
        });

        it("returns 404 for an unknown turn", async () => {
            await expect(
                service.edit(debateId, turnId, { text: "Hi." })
            ).rejects.toThrow(NotFoundException);
        });

        it("rejects a speaker who is not in the debate", async () => {
            debateService.getTranscriptTurns.mockResolvedValue([draftTurn]);

            await expect(
                service.edit(debateId, turnId, { personality: outsider })
            ).rejects.toThrow(BadRequestException);
        });
    });

    it("review passes the decision to the debate service", async () => {
        debateService.reviewDraftTurns.mockResolvedValue([
            { turnId: "a", speechId: "b", status: "approved" },
        ]);

        const result = await service.review(
            debateId,
            ["a"],
            TranscriptTurnStatus.Approved
        );

        expect(debateService.reviewDraftTurns).toHaveBeenCalledWith(
            debateId,
            ["a"],
            TranscriptTurnStatus.Approved
        );
        expect(result).toEqual({
            turns: [{ turnId: "a", speechId: "b", status: "approved" }],
        });
    });
});
