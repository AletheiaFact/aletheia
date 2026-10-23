import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Types } from "mongoose";
import type { IClaimRevisionService } from "../../../../interfaces/claim-revision.service.interface";
import type { IClaimRevision } from "../../../../interfaces/claim-revision.interface";
import { ParserService } from "../../../parser/parser.service";
import { ContentModelEnum } from "../../../../types/enums";
import { DebateService } from "../debate.service";
import { TranscriptTurnStatus } from "../schemas/debate.schema";
import type {
    AppendDebateTranscriptDto,
    EditTranscriptTurnDto,
} from "./debate-transcript.dto";

/**
 * Debate transcript drafts. Turns sent by a transcriber or an editor are
 * parsed into draft speeches that public reads do not show. A reviewer
 * edits, approves or rejects them; approved speeches join the debate.
 */
@Injectable()
export class DebateTranscriptService {
    constructor(
        @Inject("ClaimRevisionService")
        private readonly claimRevisionService: IClaimRevisionService,
        private readonly debateService: DebateService,
        private readonly parserService: ParserService
    ) {}

    async append(debateId: string, body: AppendDebateTranscriptDto) {
        const revision = await this.getDebateRevision(debateId);
        this.assertDebatePersonalities(
            revision,
            body.turns.map((turn) => turn.personality)
        );

        const appended = await this.debateService.findAppendedExternalIds(
            debateId,
            body.turns
                .map((turn) => turn.externalId)
                .filter((id) => id !== undefined)
        );
        const newTurns = body.turns.filter(
            (turn) => !turn.externalId || !appended.has(turn.externalId)
        );

        // Sequential on purpose: speeches are created in transcript order.
        const draftTurns = [];
        for (const turn of newTurns) {
            const speech = await this.parseDraft(
                turn.text,
                revision,
                turn.personality
            );
            draftTurns.push({
                _id: new Types.ObjectId(),
                speech: speech._id,
                personality: new Types.ObjectId(turn.personality),
                text: turn.text,
                externalId: turn.externalId,
                startedAt: turn.startedAt
                    ? new Date(turn.startedAt)
                    : undefined,
                checkability: turn.checkability,
            });
        }

        let isLive = body.isLive;
        if (draftTurns.length || isLive !== undefined) {
            const debate = await this.debateService.addDraftTurns(
                debateId,
                draftTurns,
                isLive
            );
            isLive = debate.isLive;
        }

        return {
            drafts: draftTurns.map((turn) => ({
                turnId: String(turn._id),
                speechId: String(turn.speech),
                externalId: turn.externalId,
            })),
            skipped: body.turns
                .map((turn) => turn.externalId)
                .filter((id) => id !== undefined && appended.has(id)),
            isLive,
        };
    }

    async list(debateId: string, status?: TranscriptTurnStatus) {
        await this.getDebateRevision(debateId);
        return this.debateService.listTranscriptTurns(debateId, status);
    }

    /**
     * Edits a draft turn. The text is parsed again into a new draft
     * speech; the old draft speech is left unreferenced and stays hidden.
     */
    async edit(debateId: string, turnId: string, body: EditTranscriptTurnDto) {
        const revision = await this.getDebateRevision(debateId);
        const turn = (
            await this.debateService.getTranscriptTurns(debateId)
        ).find((candidate) => String(candidate._id) === turnId);
        if (!turn) {
            throw new NotFoundException("Transcript turn not found");
        }
        if (turn.status !== TranscriptTurnStatus.Draft) {
            throw new ConflictException("Transcript turn already reviewed");
        }

        const text = body.text ?? turn.text;
        const personality = body.personality ?? String(turn.personality);
        this.assertDebatePersonalities(revision, [personality]);

        const speech = await this.parseDraft(text, revision, personality);
        await this.debateService.replaceDraftTurn(
            debateId,
            turnId,
            turn.speech,
            {
                speech: speech._id,
                text,
                personality: new Types.ObjectId(personality),
            }
        );

        return {
            turnId,
            speechId: String(speech._id),
            personality,
            text,
            status: TranscriptTurnStatus.Draft,
        };
    }

    async review(
        debateId: string,
        turnIds: string[],
        status: TranscriptTurnStatus.Approved | TranscriptTurnStatus.Rejected
    ) {
        await this.getDebateRevision(debateId);
        const turns = await this.debateService.reviewDraftTurns(
            debateId,
            turnIds,
            status
        );
        return { turns };
    }

    private parseDraft(
        text: string,
        revision: IClaimRevision,
        personality: string
    ) {
        return this.parserService.parse(
            text,
            revision._id,
            personality,
            ContentModelEnum.Speech,
            { isDraft: true }
        );
    }

    private async getDebateRevision(debateId: string) {
        const revision = await this.claimRevisionService.getByContentId(
            debateId
        );
        if (!revision) {
            throw new NotFoundException();
        }
        if (revision.contentModel !== ContentModelEnum.Debate) {
            throw new BadRequestException("Claim is not a debate");
        }
        return revision;
    }

    private assertDebatePersonalities(
        revision: IClaimRevision,
        personalityIds: string[]
    ) {
        const debatePersonalities = new Set(
            (revision.personalities ?? []).map((personality) =>
                String(personality?._id ?? personality)
            )
        );
        const unknown = [
            ...new Set(
                personalityIds.filter((id) => !debatePersonalities.has(id))
            ),
        ];
        if (unknown.length) {
            throw new BadRequestException(
                `Personalities not in this debate: ${unknown.join(", ")}`
            );
        }
    }
}
