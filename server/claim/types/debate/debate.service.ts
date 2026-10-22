import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
    Scope,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EditorService } from "../../../editor/editor.service";
import { Model, Types } from "mongoose";
import {
    Debate,
    DebateDocument,
    DebateTranscriptTurn,
    TranscriptTurnStatus,
} from "./schemas/debate.schema";
import { Speech, SpeechDocument } from "../speech/mongo/schemas/speech.schema";
import {
    Paragraph,
    ParagraphDocument,
} from "../paragraph/mongo/schemas/paragraph.schema";
import {
    Sentence,
    SentenceDocument,
} from "../sentence/mongo/schemas/sentence.schema";
import { HistoryService } from "../../../history/history.service";
import {
    HistoryType,
    TargetModel,
} from "../../../history/schema/history.schema";
import { REQUEST } from "@nestjs/core";
import type { BaseRequest } from "../../../types";
const md5 = require("md5");

@Injectable({ scope: Scope.REQUEST })
export class DebateService {
    constructor(
        @InjectModel(Debate.name)
        private DebateModel: Model<DebateDocument>,
        @InjectModel(Speech.name)
        private SpeechModel: Model<SpeechDocument>,
        @InjectModel(Paragraph.name)
        private ParagraphModel: Model<ParagraphDocument>,
        @InjectModel(Sentence.name)
        private SentenceModel: Model<SentenceDocument>,
        private editorService: EditorService,
        private historyService: HistoryService,
        @Inject(REQUEST) private req: BaseRequest
    ) {}

    async listAll(
        page: number,
        pageSize: number,
        order: string,
        query: Record<string, any>
    ) {
        return this.DebateModel.find({
            ...query,
        })
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order as any })
            .lean();
    }

    async create(claim: Record<string, any>, claimRevisionId: any) {
        let hashString = claim.personalities.join(" ");
        hashString += ` ${claim.title} ${claim.date.toString()}`;
        const data_hash = md5(hashString);
        const debate = {
            content: [] as any[],
            isLive: false,
            data_hash,
            claimRevisionId: claimRevisionId,
        };
        const debateCreated = await this.DebateModel.create(debate);
        await this.editorService.create(debateCreated._id);
        return debateCreated;
    }

    async addSpeechToDebate(debateId: string, speechId: any) {
        const debate = await this.DebateModel.findById(debateId);
        if (!debate) {
            throw new NotFoundException();
        }
        const previousDebate = debate.toObject();
        debate.content.push(speechId);
        debate.updatedAt = new Date();
        const newDebate = await debate.save();

        await this.saveHistory(newDebate, previousDebate);

        return newDebate;
    }

    /**
     * Returns the externalIds from `externalIds` that are already on the
     * debate's transcript turns, whatever their status. Throws
     * NotFoundException if the debate does not exist.
     */
    async findAppendedExternalIds(
        debateId: string,
        externalIds: string[]
    ): Promise<Set<string>> {
        const debate = await this.DebateModel.findById(debateId, {
            transcriptTurns: 1,
        }).lean();
        if (!debate) {
            throw new NotFoundException();
        }
        const requested = new Set(externalIds);
        return new Set(
            (debate.transcriptTurns ?? [])
                .map((turn) => turn.externalId)
                .filter(
                    (id): id is string => id !== undefined && requested.has(id)
                )
        );
    }

    /**
     * Adds draft transcript turns to the debate. Their speeches stay out of
     * the debate `content` until approved. The update is a single atomic
     * write that only matches when none of the turns' externalIds is on the
     * debate yet, so two concurrent requests cannot both add the same
     * externalId: the losing request gets a ConflictException.
     */
    async addDraftTurns(
        debateId: string,
        turns: Omit<DebateTranscriptTurn, "status" | "createdAt">[],
        isLive?: boolean
    ) {
        const previousDebate = await this.DebateModel.findById(debateId).lean();
        if (!previousDebate) {
            throw new NotFoundException();
        }

        const externalIds = turns
            .map((turn) => turn.externalId)
            .filter((id) => id !== undefined);
        const filter: Record<string, unknown> = { _id: debateId };
        if (externalIds.length) {
            filter["transcriptTurns.externalId"] = { $nin: externalIds };
        }

        const set: Record<string, unknown> = { updatedAt: new Date() };
        if (isLive !== undefined) {
            set.isLive = isLive;
        }
        const update: Record<string, unknown> = { $set: set };
        if (turns.length) {
            const createdAt = new Date();
            update.$push = {
                transcriptTurns: {
                    $each: turns.map((turn) => ({
                        ...turn,
                        status: TranscriptTurnStatus.Draft,
                        createdAt,
                    })),
                },
            };
        }

        const newDebate = await this.DebateModel.findOneAndUpdate(
            filter,
            update,
            { new: true }
        );
        if (!newDebate) {
            throw new ConflictException(
                "A turn with the same externalId was appended by another request. Retry to skip it."
            );
        }

        await this.saveHistory(newDebate, previousDebate);

        return newDebate;
    }

    /**
     * Lists the debate's transcript turns in transcript order, optionally
     * filtered by status, each with its speech (paragraphs and sentences).
     */
    async listTranscriptTurns(debateId: string, status?: TranscriptTurnStatus) {
        const turns = (await this.getTranscriptTurns(debateId)).filter(
            (turn) => !status || turn.status === status
        );
        const speeches = await this.SpeechModel.find({
            _id: { $in: turns.map((turn) => turn.speech) },
        }).lean();
        const speechById = new Map(
            speeches.map((speech) => [String(speech._id), speech])
        );
        return turns.map((turn) => ({
            ...turn,
            speech: speechById.get(String(turn.speech)) ?? null,
        }));
    }

    async getTranscriptTurns(
        debateId: string
    ): Promise<DebateTranscriptTurn[]> {
        const debate = await this.DebateModel.findById(debateId, {
            transcriptTurns: 1,
        }).lean();
        if (!debate) {
            throw new NotFoundException();
        }
        return debate.transcriptTurns ?? [];
    }

    /**
     * Replaces the speech, text and personality of a draft turn after an
     * edit. Only matches while the turn is still a draft that points at
     * `previousSpeechId`, so a concurrent review or edit gets a
     * ConflictException instead of being overwritten.
     */
    async replaceDraftTurn(
        debateId: string,
        turnId: string,
        previousSpeechId: Types.ObjectId,
        replacement: {
            speech: Types.ObjectId;
            text: string;
            personality: Types.ObjectId;
        }
    ) {
        const previousDebate = await this.DebateModel.findById(debateId).lean();
        if (!previousDebate) {
            throw new NotFoundException();
        }
        const newDebate = await this.DebateModel.findOneAndUpdate(
            {
                _id: debateId,
                transcriptTurns: {
                    $elemMatch: {
                        _id: new Types.ObjectId(turnId),
                        status: TranscriptTurnStatus.Draft,
                        speech: previousSpeechId,
                    },
                },
            },
            {
                $set: {
                    "transcriptTurns.$.speech": replacement.speech,
                    "transcriptTurns.$.text": replacement.text,
                    "transcriptTurns.$.personality": replacement.personality,
                    updatedAt: new Date(),
                },
            },
            { new: true }
        );
        if (!newDebate) {
            throw new ConflictException(
                "The turn was reviewed or edited by another request."
            );
        }
        await this.saveHistory(newDebate, previousDebate);
        return newDebate.transcriptTurns.find(
            (turn) => String(turn._id) === turnId
        );
    }

    /**
     * Approves or rejects draft turns. Approved speeches are appended to the
     * debate `content` in transcript order (not request order) and their
     * draft flags are cleared so they become public. The status change is
     * one atomic write that only matches while every turn is still a draft.
     */
    async reviewDraftTurns(
        debateId: string,
        turnIds: string[],
        status: TranscriptTurnStatus.Approved | TranscriptTurnStatus.Rejected
    ) {
        const previousDebate = await this.DebateModel.findById(debateId).lean();
        if (!previousDebate) {
            throw new NotFoundException();
        }

        const requested = new Set(turnIds);
        const turns = (previousDebate.transcriptTurns ?? []).filter((turn) =>
            requested.has(String(turn._id))
        );
        if (turns.length !== requested.size) {
            const found = new Set(turns.map((turn) => String(turn._id)));
            throw new NotFoundException(
                `Transcript turns not found: ${turnIds
                    .filter((id) => !found.has(id))
                    .join(", ")}`
            );
        }
        const notDraft = turns.filter(
            (turn) => turn.status !== TranscriptTurnStatus.Draft
        );
        if (notDraft.length) {
            throw new ConflictException(
                `Transcript turns already reviewed: ${notDraft
                    .map((turn) => String(turn._id))
                    .join(", ")}`
            );
        }

        const objectIds = turns.map((turn) => turn._id);
        const speechIds = turns.map((turn) => turn.speech);
        const update: Record<string, unknown> = {
            $set: {
                "transcriptTurns.$[turn].status": status,
                "transcriptTurns.$[turn].reviewedAt": new Date(),
                "transcriptTurns.$[turn].reviewedBy": this.req.user?._id,
                updatedAt: new Date(),
            },
        };
        if (status === TranscriptTurnStatus.Approved) {
            update.$push = { content: { $each: speechIds } };
        }

        const newDebate = await this.DebateModel.findOneAndUpdate(
            {
                _id: debateId,
                $and: objectIds.map((id) => ({
                    transcriptTurns: {
                        $elemMatch: {
                            _id: id,
                            status: TranscriptTurnStatus.Draft,
                        },
                    },
                })),
            },
            update,
            {
                new: true,
                arrayFilters: [{ "turn._id": { $in: objectIds } }],
            }
        );
        if (!newDebate) {
            throw new ConflictException(
                "The turns were reviewed or edited by another request."
            );
        }

        if (status === TranscriptTurnStatus.Approved) {
            await this.publishSpeeches(speechIds);
        }

        await this.saveHistory(newDebate, previousDebate);

        return turns.map((turn) => ({
            turnId: String(turn._id),
            speechId: String(turn.speech),
            status,
        }));
    }

    // Clears the draft flag on the speeches and on their sentences.
    private async publishSpeeches(speechIds: Types.ObjectId[]) {
        // The Speech find hook populates `content`, so ids can be objects.
        const speeches = await this.SpeechModel.find(
            { _id: { $in: speechIds } },
            { content: 1 }
        ).lean();
        const paragraphIds = speeches.flatMap((speech) =>
            (speech.content ?? []).map((paragraph: any) =>
                paragraph?._id ? paragraph._id : paragraph
            )
        );
        const paragraphs = await this.ParagraphModel.find(
            { _id: { $in: paragraphIds } },
            { content: 1 }
        ).lean();
        const sentenceIds = paragraphs.flatMap((paragraph) =>
            (paragraph.content ?? []).map((sentence: any) =>
                sentence?._id ? sentence._id : sentence
            )
        );

        await this.SentenceModel.updateMany(
            { _id: { $in: sentenceIds } },
            { $unset: { isDraft: 1 } }
        );
        await this.SpeechModel.updateMany(
            { _id: { $in: speechIds } },
            { $unset: { isDraft: 1 } }
        );
    }

    async updateDebateStatus(debateId: string, isLive: boolean) {
        const debate = await this.DebateModel.findById(debateId);
        if (!debate) {
            throw new NotFoundException();
        }
        const previousDebate = debate.toObject();
        debate.updatedAt = new Date();
        debate.isLive = isLive;
        const newDebate = await debate.save();

        await this.saveHistory(newDebate, previousDebate);

        return newDebate;
    }

    private async saveHistory(
        newDebate: DebateDocument,
        previousDebate: Record<string, any>
    ) {
        const history = this.historyService.getHistoryParams(
            newDebate._id,
            TargetModel.Debate,
            this.req.user?._id,
            HistoryType.Update,
            newDebate,
            previousDebate
        );

        await this.historyService.createHistory(history as any);
    }
}
