import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
    Scope,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model, Types } from "mongoose";
import { REQUEST } from "@nestjs/core";
import { TransactionHelper } from "./transaction.helper";
import {
    DiffValidatorService,
    PreviousSentenceSnapshot,
} from "./diff-validator.service";
import {
    CascadeService,
    SentenceHashRemap,
    SentenceTargetRemap,
} from "./cascade.service";
import { SentenceHashService } from "./sentence-hash.service";
import { Claim, ClaimDocument } from "../schemas/claim.schema";
import {
    ClaimRevision,
    ClaimRevisionDocument,
} from "../claim-revision/schema/claim-revision.schema";
import {
    Sentence,
    SentenceDocument,
} from "../types/sentence/schemas/sentence.schema";
import {
    Paragraph,
    ParagraphDocument,
} from "../types/paragraph/schemas/paragraph.schema";
import { Speech, SpeechDocument } from "../types/speech/schemas/speech.schema";
import { HistoryService } from "../../history/history.service";
import { HistoryType, TargetModel } from "../../history/schema/history.schema";
import type { BaseRequest } from "../../types";
import { ContentModelEnum } from "../../types/enums";
import slugify from "slugify";
import { ClaimEditCommitRequestDto } from "./dto/claim-edit-commit-request.dto";
import {
    ClaimEditableViewDto,
    ClaimEditCommitResponseDto,
    MetadataChangeEntry,
    SentenceViewDto,
} from "./dto/claim-edit-response.dto";

interface LoadedStructure {
    claim: ClaimDocument;
    revision: ClaimRevisionDocument;
    speech: SpeechDocument | null;
    paragraphs: ParagraphDocument[];
    sentences: PreviousSentenceSnapshot[];
}

@Injectable({ scope: Scope.REQUEST })
export class AdminEditorService {
    private readonly logger = new Logger(AdminEditorService.name);

    constructor(
        @Inject(REQUEST) private readonly req: BaseRequest,
        @InjectModel(Claim.name)
        private readonly ClaimModel: Model<ClaimDocument>,
        @InjectModel(ClaimRevision.name)
        private readonly ClaimRevisionModel: Model<ClaimRevisionDocument>,
        @InjectModel(Sentence.name)
        private readonly SentenceModel: Model<SentenceDocument>,
        @InjectModel(Paragraph.name)
        private readonly ParagraphModel: Model<ParagraphDocument>,
        @InjectModel(Speech.name)
        private readonly SpeechModel: Model<SpeechDocument>,
        private readonly txn: TransactionHelper,
        private readonly diffValidator: DiffValidatorService,
        private readonly cascade: CascadeService,
        private readonly hash: SentenceHashService,
        private readonly historyService: HistoryService
    ) {}

    async view(claimId: string): Promise<ClaimEditableViewDto> {
        const loaded = await this.loadStructure(claimId);
        const personalities = (loaded.claim.personalities ??
            []) as unknown as Array<{
            _id: any;
            name?: string;
            slug?: string;
        }>;
        const firstPersonalitySlug = personalities[0]?.slug;
        return {
            claimId: loaded.claim._id.toString(),
            claimSlug: loaded.claim.slug,
            nameSpace: loaded.claim.nameSpace,
            personalitySlug: firstPersonalitySlug,
            baseRevisionId: loaded.revision._id.toString(),
            metadata: {
                title: loaded.revision.title,
                date:
                    loaded.revision.date instanceof Date
                        ? loaded.revision.date.toISOString()
                        : String(loaded.revision.date),
                sources: [],
                personalities: personalities.map((p) => ({
                    _id: p._id?.toString?.() ?? String(p._id),
                    name: p.name ?? "",
                    slug: p.slug,
                })),
            },
            sentences: loaded.sentences.map<SentenceViewDto>((s) => ({
                sentenceId: s.sentenceId,
                dataHash: s.dataHash,
                text: s.text,
                position: s.position,
            })),
        };
    }

    async commit(
        claimId: string,
        payload: ClaimEditCommitRequestDto
    ): Promise<ClaimEditCommitResponseDto> {
        this.guardPersonalityNotEdited(payload);

        const userId = this.req.user?._id ?? "anonymous";
        this.logger.log(
            `Commit start — claimId=${claimId} user=${userId} ` +
                `sentenceOps=${(payload.sentenceOps ?? []).length}`
        );

        try {
            return await this.txn.runInTransaction(async (session) => {
                const loaded = await this.loadStructure(claimId, session);
                this.assertBaseRevision(loaded.claim, payload.baseRevisionId);

                const metadataChanges = this.diffMetadata(
                    loaded.revision,
                    payload
                );
                const classified = this.diffValidator.classifyForEditOnly(
                    loaded.sentences,
                    payload.sentenceOps ?? []
                );
                const hasSentenceChange = classified.some(
                    (c) => c.intent !== "noop"
                );

                if (metadataChanges.length === 0 && !hasSentenceChange) {
                    throw new BadRequestException({
                        statusCode: 400,
                        message: "No changes detected",
                        errorCode: "no-op",
                    });
                }

                const newRevisionId = new Types.ObjectId();

                const {
                    newContentId,
                    hashRemaps,
                    sentenceTargetRemaps,
                    sentenceDiff,
                } = hasSentenceChange
                    ? await this.buildNewContent(
                          loaded,
                          classified,
                          newRevisionId,
                          session
                      )
                    : {
                          newContentId: loaded.revision.contentId,
                          hashRemaps: [] as SentenceHashRemap[],
                          sentenceTargetRemaps: [] as SentenceTargetRemap[],
                          sentenceDiff: [] as Array<Record<string, unknown>>,
                      };

                const newRevision = await this.cloneRevisionWithMetadata(
                    loaded.revision,
                    loaded.claim._id as Types.ObjectId,
                    newRevisionId,
                    newContentId,
                    payload,
                    session
                );

                loaded.claim.latestRevision = newRevision._id;
                loaded.claim.slug = newRevision.slug;
                await loaded.claim.save({ session });

                const cascadeCounts = await this.cascade.applyOneToOneRemaps(
                    hashRemaps,
                    sentenceTargetRemaps,
                    session
                );

                const historyEntry = await this.writeHistory(
                    loaded.claim._id.toString(),
                    loaded.revision,
                    newRevision,
                    metadataChanges,
                    sentenceDiff,
                    session
                );

                const response = {
                    newRevisionId: newRevision._id.toString(),
                    newSlug: newRevision.slug,
                    historyEntryId: historyEntry._id.toString(),
                    sentenceHashMap: hashRemaps,
                    cascadeSummary: {
                        reviewTasksUpdated: cascadeCounts.reviewTasksUpdated,
                        claimReviewsUpdated: cascadeCounts.claimReviewsUpdated,
                        verificationRequestsUpdated:
                            cascadeCounts.verificationRequestsUpdated,
                        commentsUpdated: cascadeCounts.commentsUpdated,
                    },
                };

                this.logger.log(
                    `Commit success — claimId=${claimId} user=${userId} ` +
                        `newRevisionId=${response.newRevisionId} ` +
                        `metadataChanges=${metadataChanges.length} ` +
                        `sentenceHashRemaps=${hashRemaps.length} ` +
                        `reviewTasksUpdated=${cascadeCounts.reviewTasksUpdated} ` +
                        `claimReviewsUpdated=${cascadeCounts.claimReviewsUpdated} ` +
                        `vrUpdated=${cascadeCounts.verificationRequestsUpdated} ` +
                        `commentsUpdated=${cascadeCounts.commentsUpdated}`
                );
                return response;
            });
        } catch (err: any) {
            this.logger.error(
                `Commit failed — claimId=${claimId} user=${userId} ` +
                    `errorCode=${err?.response?.errorCode ?? "unknown"} ` +
                    `message=${err?.message ?? "unknown"}`,
                err?.stack
            );
            throw err;
        }
    }

    private async loadStructure(
        claimId: string,
        session?: ClientSession
    ): Promise<LoadedStructure> {
        if (!Types.ObjectId.isValid(claimId)) {
            throw new BadRequestException("Invalid claim id");
        }
        const q = this.ClaimModel.findById(claimId)
            .populate("latestRevision")
            .populate("personalities", "name slug");
        if (session) q.session(session);
        const claim = await q.exec();
        if (!claim) {
            throw new NotFoundException("Claim not found");
        }
        const revision =
            claim.latestRevision as unknown as ClaimRevisionDocument;
        if (!revision) {
            throw new NotFoundException("Claim revision not found");
        }

        if (revision.contentModel !== ContentModelEnum.Speech) {
            return {
                claim,
                revision,
                speech: null,
                paragraphs: [],
                sentences: [],
            };
        }

        const speechQuery = this.SpeechModel.findById(revision.contentId);
        if (session) speechQuery.session(session);
        const speech = await speechQuery.exec();
        if (!speech) {
            return {
                claim,
                revision,
                speech: null,
                paragraphs: [],
                sentences: [],
            };
        }

        const paragraphIds = (speech.content ?? []).map(
            (p: any) => p?._id ?? p
        );
        const paragraphsQuery = this.ParagraphModel.find({
            _id: { $in: paragraphIds },
        });
        if (session) paragraphsQuery.session(session);
        const paragraphs = await paragraphsQuery.exec();
        const paragraphsById = new Map<string, ParagraphDocument>();
        for (const p of paragraphs) paragraphsById.set(p._id.toString(), p);
        const orderedParagraphs = paragraphIds
            .map((id: any) => paragraphsById.get(id.toString()))
            .filter((p): p is ParagraphDocument => !!p);

        const sentenceIds: Types.ObjectId[] = [];
        for (const p of orderedParagraphs) {
            for (const s of p.content as any[]) {
                sentenceIds.push(s?._id ?? s);
            }
        }
        const sentencesQuery = this.SentenceModel.find({
            _id: { $in: sentenceIds },
        });
        if (session) sentencesQuery.session(session);
        const sentenceDocs = await sentencesQuery.exec();
        const sentencesById = new Map<string, SentenceDocument>();
        for (const s of sentenceDocs) sentencesById.set(s._id.toString(), s);

        const snapshots: PreviousSentenceSnapshot[] = [];
        let position = 0;
        for (const p of orderedParagraphs) {
            let sequence = 0;
            for (const sRef of p.content as any[]) {
                const sId = (sRef?._id ?? sRef).toString();
                const sDoc = sentencesById.get(sId);
                if (!sDoc) continue;
                sequence += 1;
                snapshots.push({
                    sentenceId: sDoc._id.toString(),
                    dataHash: sDoc.data_hash,
                    text: sDoc.content,
                    position,
                    paragraphDataHash: p.data_hash,
                    sentenceSequence: sequence,
                });
                position += 1;
            }
        }

        return {
            claim,
            revision,
            speech,
            paragraphs: orderedParagraphs,
            sentences: snapshots,
        };
    }

    private async buildNewContent(
        loaded: LoadedStructure,
        classified: ReturnType<DiffValidatorService["classifyForEditOnly"]>,
        newRevisionId: Types.ObjectId,
        session: ClientSession
    ): Promise<{
        newContentId: Types.ObjectId;
        hashRemaps: SentenceHashRemap[];
        sentenceTargetRemaps: SentenceTargetRemap[];
        sentenceDiff: Array<Record<string, unknown>>;
    }> {
        if (!loaded.speech) {
            throw new BadRequestException({
                statusCode: 400,
                message:
                    "Sentence editing is only supported for Speech content claims in this release",
                errorCode: "content-type-not-supported",
            });
        }

        const editById = new Map<
            string,
            { newText: string; oldDataHash: string }
        >();
        for (const c of classified) {
            if (c.intent !== "edit") continue;
            editById.set(c.sourceSentenceIds[0], {
                newText: c.newTexts[0],
                oldDataHash: c.sourceDataHashes[0],
            });
        }

        const hashRemaps: SentenceHashRemap[] = [];
        const sentenceTargetRemaps: SentenceTargetRemap[] = [];
        const sentenceDiff: Array<Record<string, unknown>> = [];

        const sentenceIdToSnapshot = new Map<
            string,
            PreviousSentenceSnapshot
        >();
        for (const s of loaded.sentences) {
            sentenceIdToSnapshot.set(s.sentenceId, s);
        }

        const newParagraphIds: Types.ObjectId[] = [];

        for (const oldParagraph of loaded.paragraphs) {
            const oldSentenceRefs = (oldParagraph.content as any[]).map((s) =>
                (s?._id ?? s).toString()
            );
            const newSentenceIds: Types.ObjectId[] = [];

            for (const oldSentenceId of oldSentenceRefs) {
                const snapshot = sentenceIdToSnapshot.get(oldSentenceId);
                if (!snapshot) continue;
                const edit = editById.get(oldSentenceId);

                if (edit) {
                    const newHash = this.hash.computeSentenceHash(
                        snapshot.paragraphDataHash,
                        snapshot.sentenceSequence,
                        edit.newText
                    );
                    if (newHash === edit.oldDataHash) {
                        throw new BadRequestException({
                            statusCode: 400,
                            message: `Edit on sentence ${oldSentenceId} produced identical hash`,
                            errorCode: "intent-mismatch",
                        });
                    }
                    const newSentence = new this.SentenceModel({
                        type: "sentence",
                        data_hash: newHash,
                        props: { id: snapshot.sentenceSequence },
                        content: edit.newText,
                        claimRevisionId: newRevisionId,
                    });
                    await newSentence.save({ session });
                    newSentenceIds.push(newSentence._id);
                    hashRemaps.push({
                        oldDataHash: edit.oldDataHash,
                        newDataHash: newHash,
                    });
                    sentenceTargetRemaps.push({
                        oldSentenceId,
                        newSentenceId: newSentence._id,
                    });
                    sentenceDiff.push({
                        op: "edit",
                        oldDataHash: edit.oldDataHash,
                        newDataHash: newHash,
                        oldText: snapshot.text,
                        newText: edit.newText,
                    });
                } else {
                    newSentenceIds.push(new Types.ObjectId(oldSentenceId));
                }
            }

            const newParagraph = new this.ParagraphModel({
                type: "paragraph",
                data_hash: oldParagraph.data_hash,
                props: oldParagraph.props,
                content: newSentenceIds,
                claimRevisionId: newRevisionId,
            });
            await newParagraph.save({ session });
            newParagraphIds.push(newParagraph._id);
        }

        const newSpeech = new this.SpeechModel({
            type: "speech",
            content: newParagraphIds,
            personality: loaded.speech.personality,
            claimRevisionId: newRevisionId,
        });
        await newSpeech.save({ session });

        return {
            newContentId: newSpeech._id,
            hashRemaps,
            sentenceTargetRemaps,
            sentenceDiff,
        };
    }

    private assertBaseRevision(claim: ClaimDocument, submittedBase: string) {
        const currentId = (claim.latestRevision as any)?._id?.toString();
        if (currentId !== submittedBase) {
            throw new ConflictException({
                statusCode: 409,
                message: "Claim has been modified by another user",
                currentRevisionId: currentId,
            });
        }
    }

    private guardPersonalityNotEdited(payload: ClaimEditCommitRequestDto) {
        if (
            payload.metadata &&
            "personalities" in (payload.metadata as any) &&
            (payload.metadata as any).personalities !== undefined
        ) {
            throw new BadRequestException({
                statusCode: 400,
                message: "Personality edits are not supported by this editor",
                errorCode: "personality-edit-rejected",
            });
        }
    }

    private diffMetadata(
        previous: ClaimRevisionDocument,
        payload: ClaimEditCommitRequestDto
    ): MetadataChangeEntry[] {
        const changes: MetadataChangeEntry[] = [];
        const md = payload.metadata;
        if (!md) return changes;

        if (md.title !== undefined && md.title.trim() !== previous.title) {
            changes.push({
                field: "title",
                from: previous.title,
                to: md.title.trim(),
            });
        }
        if (md.date !== undefined) {
            const newDate = new Date(md.date);
            const prevDate =
                previous.date instanceof Date
                    ? previous.date
                    : new Date(previous.date as any);
            if (newDate.getTime() !== prevDate.getTime()) {
                changes.push({
                    field: "date",
                    from: prevDate.toISOString(),
                    to: newDate.toISOString(),
                });
            }
        }
        return changes;
    }

    private async cloneRevisionWithMetadata(
        previous: ClaimRevisionDocument,
        claimId: Types.ObjectId,
        newRevisionId: Types.ObjectId,
        newContentId: Types.ObjectId | any,
        payload: ClaimEditCommitRequestDto,
        session: ClientSession
    ): Promise<ClaimRevisionDocument> {
        const prevObj = previous.toObject();
        const newTitle = payload.metadata?.title?.trim() ?? prevObj.title;
        const newDate = payload.metadata?.date
            ? new Date(payload.metadata.date)
            : prevObj.date;

        const titleChanged =
            payload.metadata?.title?.trim() !== undefined &&
            payload.metadata.title.trim() !== prevObj.title;
        const newSlug = titleChanged
            ? slugify(newTitle, { lower: true, strict: true })
            : prevObj.slug;

        const next = new this.ClaimRevisionModel({
            _id: newRevisionId,
            title: newTitle,
            slug: newSlug,
            contentId: newContentId,
            contentModel: prevObj.contentModel,
            date: newDate,
            claimId,
            personalities: prevObj.personalities,
        });
        await next.save({ session });
        return next;
    }

    private async writeHistory(
        claimId: string,
        previous: ClaimRevisionDocument,
        next: ClaimRevisionDocument,
        metadataChanges: MetadataChangeEntry[],
        sentenceDiff: Array<Record<string, unknown>>,
        session: ClientSession
    ) {
        const userId = this.req.user?._id;
        const params = this.historyService.getHistoryParams(
            claimId,
            TargetModel.Claim,
            userId,
            HistoryType.Update,
            {
                kind: "admin-claim-edit",
                title: next.title,
                metadataDiff: metadataChanges,
                sentenceDiff,
                previousRevisionId: previous._id.toString(),
                newRevisionId: next._id.toString(),
            } as any,
            { revisionId: previous._id.toString() } as any
        );

        return this.historyService.createHistory(params, session);
    }
}
