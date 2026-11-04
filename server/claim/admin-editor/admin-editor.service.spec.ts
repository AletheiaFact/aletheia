import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { REQUEST } from "@nestjs/core";
import {
    BadRequestException,
    ConflictException,
    NotFoundException,
} from "@nestjs/common";
import { Types } from "mongoose";
import { AdminEditorService } from "./admin-editor.service";
import { TransactionHelper } from "./transaction.helper";
import { DiffValidatorService } from "./diff-validator.service";
import { CascadeService } from "./cascade.service";
import { SentenceHashService } from "./sentence-hash.service";
import { Claim } from "../mongo/schemas/claim.schema";
import { ClaimRevision } from "../claim-revision/mongo/schemas/claim-revision.schema";
import { Sentence } from "../types/sentence/mongo/schemas/sentence.schema";
import { Paragraph } from "../types/paragraph/mongo/schemas/paragraph.schema";
import { Speech } from "../types/speech/mongo/schemas/speech.schema";
import { Debate } from "../types/debate/schemas/debate.schema";
import { HistoryService } from "../../history/history.service";

describe("AdminEditorService (Unit)", () => {
    let service: AdminEditorService;

    const mockRequest = { user: { _id: "user-1" } };

    const validClaimId = new Types.ObjectId().toString();
    const revisionId = new Types.ObjectId();

    const buildClaimDoc = (overrides: Partial<any> = {}) => ({
        _id: new Types.ObjectId(validClaimId),
        slug: "old-slug",
        nameSpace: "main",
        latestRevision: {
            _id: revisionId,
            title: "Original title",
            date: new Date("2024-01-01T00:00:00Z"),
            slug: "old-slug",
            contentModel: "Unattributed",
            contentId: new Types.ObjectId(),
            personalities: [],
            toObject: vi.fn().mockReturnValue({
                title: "Original title",
                date: new Date("2024-01-01T00:00:00Z"),
                slug: "old-slug",
                contentModel: "Unattributed",
                personalities: [],
            }),
        },
        personalities: [
            {
                _id: new Types.ObjectId(),
                name: "Jane Doe",
                slug: "jane-doe",
            },
        ],
        save: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    let claimDoc: any;

    const buildFindByIdChain = (doc: any) => ({
        populate: vi.fn().mockReturnThis(),
        session: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(doc),
    });

    const ClaimModel: any = { findById: vi.fn() };
    const SpeechModel: any = vi.fn(function (data: any) {
        return {
            ...data,
            _id: new Types.ObjectId(),
            save: vi.fn().mockResolvedValue(undefined),
        };
    });
    SpeechModel.findById = vi.fn();
    SpeechModel.find = vi.fn();
    SpeechModel.updateOne = vi.fn();
    const ParagraphModel: any = {
        find: vi.fn(),
        updateOne: vi.fn(),
        insertMany: vi.fn(),
    };
    const SentenceModel: any = { find: vi.fn(), insertMany: vi.fn() };
    const DebateModel: any = { findById: vi.fn(), updateOne: vi.fn() };
    const ClaimRevisionModel: any = vi.fn();

    const transactionHelper = {
        runInTransaction: vi.fn((fn: any) => fn({ id: "session" })),
    };
    const diffValidator = { classifyForEditOnly: vi.fn().mockReturnValue([]) };
    const cascade = {
        findPublishedHashes: vi.fn().mockResolvedValue([]),
        findReviewTaskHashes: vi.fn().mockResolvedValue([]),
        applyOneToOneRemaps: vi.fn().mockResolvedValue({
            reviewTasksUpdated: 0,
            claimReviewsUpdated: 0,
            reportsUpdated: 0,
            verificationRequestsUpdated: 0,
            commentsUpdated: 0,
        }),
    };
    const sentenceHash = {
        computeSentenceHash: vi.fn().mockReturnValue("new-hash"),
    };
    const historyService = {
        getHistoryParams: vi.fn().mockReturnValue({}),
        createHistory: vi.fn().mockResolvedValue({ _id: new Types.ObjectId() }),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminEditorService,
                { provide: REQUEST, useValue: mockRequest },
                { provide: getModelToken(Claim.name), useValue: ClaimModel },
                {
                    provide: getModelToken(ClaimRevision.name),
                    useValue: ClaimRevisionModel,
                },
                {
                    provide: getModelToken(Sentence.name),
                    useValue: SentenceModel,
                },
                {
                    provide: getModelToken(Paragraph.name),
                    useValue: ParagraphModel,
                },
                { provide: getModelToken(Speech.name), useValue: SpeechModel },
                { provide: getModelToken(Debate.name), useValue: DebateModel },
                { provide: TransactionHelper, useValue: transactionHelper },
                { provide: DiffValidatorService, useValue: diffValidator },
                { provide: CascadeService, useValue: cascade },
                { provide: SentenceHashService, useValue: sentenceHash },
                { provide: HistoryService, useValue: historyService },
            ],
        }).compile();

        service = await module.resolve<AdminEditorService>(AdminEditorService);
    });

    beforeEach(() => {
        vi.clearAllMocks();
        claimDoc = buildClaimDoc();
        ClaimModel.findById.mockReturnValue(buildFindByIdChain(claimDoc));
        transactionHelper.runInTransaction.mockImplementation((fn: any) =>
            fn({ id: "session" })
        );
        diffValidator.classifyForEditOnly.mockReturnValue([]);
        cascade.findPublishedHashes.mockResolvedValue([]);
        cascade.findReviewTaskHashes.mockResolvedValue([]);
        cascade.applyOneToOneRemaps.mockResolvedValue({
            reviewTasksUpdated: 0,
            claimReviewsUpdated: 0,
            reportsUpdated: 0,
            verificationRequestsUpdated: 0,
            commentsUpdated: 0,
        });
        historyService.createHistory.mockResolvedValue({
            _id: new Types.ObjectId(),
        });
        ClaimRevisionModel.mockImplementation(function (data: any) {
            return {
                ...data,
                save: vi.fn().mockResolvedValue(undefined),
            };
        });
    });

    describe("view", () => {
        it("rejects invalid claim id", async () => {
            await expect(service.view("not-a-real-id")).rejects.toThrow(
                BadRequestException
            );
        });

        it("throws NotFound when claim missing", async () => {
            ClaimModel.findById.mockReturnValue(buildFindByIdChain(null));
            await expect(service.view(validClaimId)).rejects.toThrow(
                NotFoundException
            );
        });

        it("returns mapped DTO with personality refs (_id, name, slug)", async () => {
            const result = await service.view(validClaimId);
            expect(result.claimId).toBe(validClaimId);
            expect(result.claimSlug).toBe("old-slug");
            expect(result.baseRevisionId).toBe(revisionId.toString());
            expect(result.personalitySlug).toBe("jane-doe");
            expect(result.metadata.title).toBe("Original title");
            expect(result.metadata.personalities).toHaveLength(1);
            expect(result.metadata.personalities[0]).toMatchObject({
                name: "Jane Doe",
                slug: "jane-doe",
            });
            expect(result.metadata.personalities[0]._id).toBeTruthy();
            expect(result.sentences).toEqual([]);
        });
    });

    describe("commit — guards", () => {
        it("rejects payload with personalities edit at the Zod boundary", async () => {
            const { ClaimEditCommitRequestSchema } = await import(
                "./dto/claim-edit-commit-request.dto"
            );
            const result = ClaimEditCommitRequestSchema.safeParse({
                baseRevisionId: revisionId.toString(),
                metadata: { personalities: ["x"] },
                sentenceOps: [],
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                const paths = result.error.issues.map((i) => i.path.join("."));
                expect(paths.some((p) => p.startsWith("metadata"))).toBe(true);
            }
        });

        it("throws Conflict when baseRevisionId is stale", async () => {
            await expect(
                service.commit(validClaimId, {
                    baseRevisionId: "stale-revision-id",
                    metadata: { title: "Whatever" },
                    sentenceOps: [],
                })
            ).rejects.toThrow(ConflictException);
        });

        it("throws BadRequest when no changes detected", async () => {
            await expect(
                service.commit(validClaimId, {
                    baseRevisionId: revisionId.toString(),
                    metadata: { title: "Original title" },
                    sentenceOps: [],
                })
            ).rejects.toMatchObject({
                response: { errorCode: "no-op" },
            });
        });
    });

    describe("commit — metadata-only happy path", () => {
        it("regenerates slug on title change and writes history", async () => {
            const result = await service.commit(validClaimId, {
                baseRevisionId: revisionId.toString(),
                metadata: { title: "Brand new title" },
                sentenceOps: [],
            });

            expect(ClaimRevisionModel).toHaveBeenCalledTimes(1);
            const newRevArgs = ClaimRevisionModel.mock.calls[0][0];
            expect(newRevArgs.title).toBe("Brand new title");
            expect(newRevArgs.slug).toBe("brand-new-title");

            expect(claimDoc.save).toHaveBeenCalled();
            expect(claimDoc.slug).toBe("brand-new-title");

            expect(cascade.applyOneToOneRemaps).toHaveBeenCalledWith(
                [],
                [],
                expect.anything(), // claimId (ObjectId)
                expect.anything() // session
            );
            const claimIdArg = cascade.applyOneToOneRemaps.mock.calls[0][2];
            expect(claimIdArg.toString()).toBe(validClaimId);
            expect(historyService.createHistory).toHaveBeenCalled();
            expect(result.newSlug).toBe("brand-new-title");
            expect(result.sentenceHashMap).toEqual([]);
            expect(result.cascadeSummary).toEqual({
                reviewTasksUpdated: 0,
                claimReviewsUpdated: 0,
                reportsUpdated: 0,
                verificationRequestsUpdated: 0,
                commentsUpdated: 0,
            });
        });

        it("preserves slug when only date changes", async () => {
            await service.commit(validClaimId, {
                baseRevisionId: revisionId.toString(),
                metadata: { date: "2025-06-15T00:00:00Z" },
                sentenceOps: [],
            });
            const newRevArgs = ClaimRevisionModel.mock.calls[0][0];
            expect(newRevArgs.slug).toBe("old-slug");
        });
    });

    describe("debate", () => {
        const debateId = new Types.ObjectId();
        const speechId = new Types.ObjectId();
        const paragraphId = new Types.ObjectId();
        const sentenceA = new Types.ObjectId();
        const sentenceB = new Types.ObjectId();
        const personalityId = new Types.ObjectId();
        const turnId = new Types.ObjectId();

        const queryOf = (result: any) => ({
            session: vi.fn().mockReturnThis(),
            exec: vi.fn().mockResolvedValue(result),
        });

        const setupDebate = (turnText: string) => {
            claimDoc = buildClaimDoc();
            claimDoc.latestRevision.contentModel = "Debate";
            claimDoc.latestRevision.contentId = debateId;
            ClaimModel.findById.mockReturnValue(buildFindByIdChain(claimDoc));
            DebateModel.findById.mockReturnValue(
                queryOf({
                    _id: debateId,
                    content: [speechId],
                    transcriptTurns: [
                        {
                            _id: turnId,
                            speech: speechId,
                            text: turnText,
                            status: "approved",
                        },
                    ],
                })
            );
            SpeechModel.find.mockReturnValue(
                queryOf([
                    {
                        _id: speechId,
                        personality: personalityId,
                        content: [paragraphId],
                    },
                ])
            );
            ParagraphModel.find.mockReturnValue(
                queryOf([
                    {
                        _id: paragraphId,
                        data_hash: "p-hash",
                        content: [sentenceA, sentenceB],
                    },
                ])
            );
            SentenceModel.find.mockReturnValue(
                queryOf([
                    {
                        _id: sentenceA,
                        data_hash: "hash-a",
                        content: "First sentence.",
                        props: { id: 1 },
                        topics: ["topic"],
                    },
                    {
                        _id: sentenceB,
                        data_hash: "hash-b",
                        content: "Second sentence.",
                        props: { id: 2 },
                    },
                ])
            );
            ParagraphModel.updateOne.mockResolvedValue({ matchedCount: 1 });
            SentenceModel.insertMany.mockResolvedValue([]);
            DebateModel.updateOne.mockResolvedValue({ matchedCount: 1 });
            diffValidator.classifyForEditOnly.mockReturnValue([
                {
                    intent: "edit",
                    sourceSentenceIds: [sentenceB.toString()],
                    sourceDataHashes: ["hash-b"],
                    newTexts: ["Edited sentence."],
                },
            ]);
        };

        const editPayload = () => ({
            baseRevisionId: revisionId.toString(),
            sentenceOps: [
                {
                    intent: "edit" as const,
                    sourceSentenceId: sentenceB.toString(),
                    newText: "Edited sentence.",
                },
            ],
        });

        it("returns the debate sentences with their speech and personality", async () => {
            setupDebate("First sentence. Second sentence.");
            const result = await service.view(validClaimId);
            expect(result.contentModel).toBe("Debate");
            expect(result.sentences).toEqual([
                expect.objectContaining({
                    sentenceId: sentenceA.toString(),
                    speechId: speechId.toString(),
                    personalityId: personalityId.toString(),
                    position: 0,
                }),
                expect.objectContaining({
                    sentenceId: sentenceB.toString(),
                    position: 1,
                }),
            ]);
        });

        it("flags sentences with a published or in-progress review", async () => {
            setupDebate("First sentence. Second sentence.");
            cascade.findPublishedHashes.mockResolvedValue(["hash-a"]);
            cascade.findReviewTaskHashes.mockResolvedValue(["hash-a", "hash-b"]);
            const result = await service.view(validClaimId);
            expect(result.sentences.map((s) => s.reviewStatus)).toEqual([
                "published",
                "in-progress",
            ]);
        });

        it("swaps the edited sentence in place and keeps the revision", async () => {
            setupDebate("First sentence. Second sentence.");
            const result = await service.commit(validClaimId, editPayload());

            const [inserted] = SentenceModel.insertMany.mock.calls[0][0];
            expect(inserted).toMatchObject({
                data_hash: "new-hash",
                content: "Edited sentence.",
                props: { id: 2 },
                claimRevisionId: revisionId,
            });
            expect(ParagraphModel.updateOne).toHaveBeenCalledWith(
                { _id: paragraphId, content: sentenceB },
                { $set: { "content.$": inserted._id } },
                expect.anything()
            );
            expect(DebateModel.updateOne).toHaveBeenCalledWith(
                { _id: debateId, "transcriptTurns._id": turnId },
                {
                    $set: {
                        "transcriptTurns.$.text":
                            "First sentence. Edited sentence.",
                    },
                },
                expect.anything()
            );
            expect(cascade.applyOneToOneRemaps).toHaveBeenCalledWith(
                [{ oldDataHash: "hash-b", newDataHash: "new-hash" }],
                [
                    {
                        oldSentenceId: sentenceB.toString(),
                        newSentenceId: inserted._id,
                    },
                ],
                claimDoc._id,
                expect.anything()
            );
            expect(ClaimRevisionModel).not.toHaveBeenCalled();
            expect(claimDoc.save).not.toHaveBeenCalled();
            expect(result.newRevisionId).toBe(revisionId.toString());
        });

        it("rebuilds the turn text when the sentence is not found verbatim", async () => {
            setupDebate("First  sentence.\nSecond   sentence.");
            await service.commit(validClaimId, editPayload());
            expect(DebateModel.updateOne).toHaveBeenCalledWith(
                expect.anything(),
                {
                    $set: {
                        "transcriptTurns.$.text":
                            "First sentence. Edited sentence.",
                    },
                },
                expect.anything()
            );
        });

        it("throws Conflict when the sentence was already replaced", async () => {
            setupDebate("First sentence. Second sentence.");
            ParagraphModel.updateOne.mockResolvedValue({ matchedCount: 0 });
            await expect(
                service.commit(validClaimId, editPayload())
            ).rejects.toThrow(ConflictException);
            expect(cascade.applyOneToOneRemaps).not.toHaveBeenCalled();
        });

        it("rejects metadata changes", async () => {
            setupDebate("First sentence. Second sentence.");
            await expect(
                service.commit(validClaimId, {
                    ...editPayload(),
                    metadata: { title: "New debate title" },
                })
            ).rejects.toMatchObject({
                response: { errorCode: "content-type-not-supported" },
            });
            expect(SentenceModel.insertMany).not.toHaveBeenCalled();
        });

        it("throws BadRequest when no sentence changed", async () => {
            setupDebate("First sentence. Second sentence.");
            diffValidator.classifyForEditOnly.mockReturnValue([]);
            await expect(
                service.commit(validClaimId, {
                    baseRevisionId: revisionId.toString(),
                    sentenceOps: [],
                })
            ).rejects.toMatchObject({ response: { errorCode: "no-op" } });
        });

        const deletePayload = (...ids: Types.ObjectId[]) => ({
            baseRevisionId: revisionId.toString(),
            sentenceOps: ids.map((id) => ({
                intent: "delete" as const,
                sourceSentenceId: id.toString(),
            })),
        });
        const classifyDeletes = (...ids: Types.ObjectId[]) =>
            diffValidator.classifyForEditOnly.mockReturnValue(
                ids.map((id) => ({
                    intent: "delete",
                    sourceSentenceIds: [id.toString()],
                    sourceDataHashes: [],
                    newTexts: [],
                }))
            );

        it("pulls a deleted sentence from its paragraph and its turn text", async () => {
            setupDebate("First sentence. Second sentence.");
            classifyDeletes(sentenceA);
            await service.commit(validClaimId, deletePayload(sentenceA));

            expect(SentenceModel.insertMany).not.toHaveBeenCalled();
            expect(ParagraphModel.updateOne).toHaveBeenCalledWith(
                { _id: paragraphId, content: sentenceA },
                { $pull: { content: sentenceA } },
                expect.anything()
            );
            expect(SpeechModel.updateOne).not.toHaveBeenCalled();
            expect(DebateModel.updateOne).toHaveBeenCalledWith(
                expect.anything(),
                { $set: { "transcriptTurns.$.text": "Second sentence." } },
                expect.anything()
            );
            expect(cascade.findPublishedHashes).toHaveBeenCalledWith(
                ["hash-a"],
                claimDoc._id,
                expect.anything()
            );
            expect(cascade.applyOneToOneRemaps).toHaveBeenCalledWith(
                [],
                [],
                claimDoc._id,
                expect.anything()
            );
        });

        it("refuses to delete a sentence that has a review", async () => {
            setupDebate("First sentence. Second sentence.");
            classifyDeletes(sentenceA);
            cascade.findPublishedHashes.mockResolvedValue(["hash-a"]);
            await expect(
                service.commit(validClaimId, deletePayload(sentenceA))
            ).rejects.toMatchObject({
                response: { errorCode: "sentence-has-review" },
            });
            expect(ParagraphModel.updateOne).not.toHaveBeenCalled();
        });

        it("refuses to delete every sentence of a speech", async () => {
            setupDebate("First sentence. Second sentence.");
            classifyDeletes(sentenceA, sentenceB);
            await expect(
                service.commit(
                    validClaimId,
                    deletePayload(sentenceA, sentenceB)
                )
            ).rejects.toMatchObject({
                response: { errorCode: "speech-would-be-empty" },
            });
            expect(ParagraphModel.updateOne).not.toHaveBeenCalled();
        });
    });

    describe("speech — delete", () => {
        const paragraph1 = new Types.ObjectId();
        const paragraph2 = new Types.ObjectId();
        const sentence1 = new Types.ObjectId();
        const sentence2 = new Types.ObjectId();
        const sentence3 = new Types.ObjectId();

        const queryOf = (result: any) => ({
            session: vi.fn().mockReturnThis(),
            exec: vi.fn().mockResolvedValue(result),
        });

        beforeEach(() => {
            claimDoc = buildClaimDoc();
            claimDoc.latestRevision.contentModel = "Speech";
            ClaimModel.findById.mockReturnValue(buildFindByIdChain(claimDoc));
            SpeechModel.findById.mockReturnValue(
                queryOf({
                    _id: new Types.ObjectId(),
                    content: [paragraph1, paragraph2],
                })
            );
            ParagraphModel.find.mockReturnValue(
                queryOf([
                    {
                        _id: paragraph1,
                        data_hash: "p1",
                        content: [sentence1, sentence2],
                    },
                    { _id: paragraph2, data_hash: "p2", content: [sentence3] },
                ])
            );
            SentenceModel.find.mockReturnValue(
                queryOf([
                    { _id: sentence1, data_hash: "h1", content: "One." },
                    { _id: sentence2, data_hash: "h2", content: "Two." },
                    { _id: sentence3, data_hash: "h3", content: "Three." },
                ])
            );
            ParagraphModel.insertMany.mockResolvedValue([]);
        });

        it("leaves deleted sentences and emptied paragraphs out of the new revision", async () => {
            diffValidator.classifyForEditOnly.mockReturnValue([
                {
                    intent: "delete",
                    sourceSentenceIds: [sentence2.toString()],
                    sourceDataHashes: ["h2"],
                    newTexts: [],
                },
                {
                    intent: "delete",
                    sourceSentenceIds: [sentence3.toString()],
                    sourceDataHashes: ["h3"],
                    newTexts: [],
                },
            ]);
            await service.commit(validClaimId, {
                baseRevisionId: revisionId.toString(),
                sentenceOps: [
                    {
                        intent: "delete",
                        sourceSentenceId: sentence2.toString(),
                    },
                    {
                        intent: "delete",
                        sourceSentenceId: sentence3.toString(),
                    },
                ],
            });

            const paragraphs = ParagraphModel.insertMany.mock.calls[0][0];
            expect(paragraphs).toHaveLength(1);
            expect(paragraphs[0].content.map(String)).toEqual([
                sentence1.toString(),
            ]);
            const speechArgs = SpeechModel.mock.calls[0][0];
            expect(speechArgs.content).toEqual([paragraphs[0]._id]);
            expect(SentenceModel.insertMany).not.toHaveBeenCalled();
        });

        it("refuses to delete every sentence of the speech", async () => {
            diffValidator.classifyForEditOnly.mockReturnValue(
                [sentence1, sentence2, sentence3].map((id) => ({
                    intent: "delete",
                    sourceSentenceIds: [id.toString()],
                    sourceDataHashes: [],
                    newTexts: [],
                }))
            );
            await expect(
                service.commit(validClaimId, {
                    baseRevisionId: revisionId.toString(),
                    sentenceOps: [],
                })
            ).rejects.toMatchObject({
                response: { errorCode: "speech-would-be-empty" },
            });
        });
    });
});
