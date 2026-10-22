import { ForbiddenException } from "@nestjs/common";
import { DebateTranscriptController } from "./debate-transcript.controller";
import { TranscriptTurnStatus } from "../schemas/debate.schema";

const debateId = "64b7f0c2e1a2b3c4d5e6f700";
const turnId = "64b7f0c2e1a2b3c4d5e6f710";

describe("DebateTranscriptController", () => {
    let controller: DebateTranscriptController;
    let service: Record<string, ReturnType<typeof vi.fn>>;
    const m2m = { user: { isM2M: true } } as any;
    const person = { user: { isM2M: false } } as any;

    beforeEach(() => {
        service = {
            append: vi.fn().mockResolvedValue({}),
            list: vi.fn().mockResolvedValue([]),
            edit: vi.fn().mockResolvedValue({}),
            review: vi.fn().mockResolvedValue({ turns: [] }),
        };
        controller = new DebateTranscriptController(service as any);
    });

    it("lets a signed-in reviewer approve and reject", async () => {
        await controller.approveTranscriptTurns(
            debateId,
            { turnIds: [turnId] },
            person
        );
        await controller.rejectTranscriptTurns(
            debateId,
            { turnIds: [turnId] },
            person
        );

        expect(service.review.mock.calls).toEqual([
            [debateId, [turnId], TranscriptTurnStatus.Approved],
            [debateId, [turnId], TranscriptTurnStatus.Rejected],
        ]);
    });

    it("does not let an M2M client review its own drafts", () => {
        expect(() => controller.listTranscriptTurns(debateId, {}, m2m)).toThrow(
            ForbiddenException
        );
        expect(() =>
            controller.approveTranscriptTurns(
                debateId,
                { turnIds: [turnId] },
                m2m
            )
        ).toThrow(ForbiddenException);
        expect(() =>
            controller.rejectTranscriptTurns(
                debateId,
                { turnIds: [turnId] },
                m2m
            )
        ).toThrow(ForbiddenException);
        expect(() =>
            controller.editTranscriptTurn(
                debateId,
                turnId,
                { text: "Edited." },
                m2m
            )
        ).toThrow(ForbiddenException);
        expect(service.review).not.toHaveBeenCalled();
        expect(service.edit).not.toHaveBeenCalled();
    });
});
