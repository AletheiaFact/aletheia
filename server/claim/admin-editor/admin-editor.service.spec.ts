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
import { Claim } from "../schemas/claim.schema";
import { ClaimRevision } from "../claim-revision/schema/claim-revision.schema";
import { Sentence } from "../types/sentence/schemas/sentence.schema";
import { Paragraph } from "../types/paragraph/schemas/paragraph.schema";
import { Speech } from "../types/speech/schemas/speech.schema";
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
    const SpeechModel: any = { findById: vi.fn() };
    const ParagraphModel: any = { find: vi.fn() };
    const SentenceModel: any = { find: vi.fn() };
    const ClaimRevisionModel: any = vi.fn();

    const transactionHelper = {
        runInTransaction: vi.fn((fn: any) => fn({ id: "session" })),
    };
    const diffValidator = { classifyForEditOnly: vi.fn().mockReturnValue([]) };
    const cascade = {
        applyOneToOneRemaps: vi.fn().mockResolvedValue({
            reviewTasksUpdated: 0,
            claimReviewsUpdated: 0,
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
        cascade.applyOneToOneRemaps.mockResolvedValue({
            reviewTasksUpdated: 0,
            claimReviewsUpdated: 0,
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
});
