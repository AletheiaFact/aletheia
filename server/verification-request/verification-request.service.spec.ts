import { Model } from "mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { VerificationRequestService } from "./verification-request.service";
import { VerificationRequestDocument } from "./schemas/verification-request.schema";
import { VerificationRequestStateMachineService } from "./state-machine/verification-request.state-machine.service";

import { HistoryService } from "../history/history.service";
import { AiTaskService } from "../ai-task/ai-task.service";
import { EMBEDDINGS_PROVIDER } from "../llm/llm.tokens";
import {
    createFakeVerificationRequest,
    mockQuery,
    mockVerificationRequestModel,
} from "../mocks/VerificationRequestMock";

const mockSourceService = {
    getSourceByHref: vi.fn(),
};

const mockTopicService = {
    findOrCreateTopic: vi.fn(),
};

describe("VerificationRequestService (Unit)", () => {
    let testingModule: TestingModule;
    let service: VerificationRequestService;
    let model: Model<VerificationRequestDocument>;

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            providers: [
                VerificationRequestService,
                {
                    provide: getModelToken("VerificationRequest"),
                    useValue: mockVerificationRequestModel,
                },
                {
                    provide: "REQUEST",
                    useValue: { user: { id: "test-user" } },
                },
                {
                    provide: VerificationRequestStateMachineService,
                    useValue: {},
                },
                { provide: "SourceService", useValue: mockSourceService },
                { provide: "GroupService", useValue: {} },
                { provide: HistoryService, useValue: {} },
                { provide: AiTaskService, useValue: {} },
                { provide: "TopicService", useValue: mockTopicService },
                { provide: "PersonalityService", useValue: {} },
                {
                    provide: EMBEDDINGS_PROVIDER,
                    useValue: {
                        getEmbeddings: () => ({ embedQuery: vi.fn() }),
                    },
                },
            ],
        }).compile();

        model = testingModule.get<Model<VerificationRequestDocument>>(
            getModelToken("VerificationRequest")
        );
    });

    beforeEach(async () => {
        service = await testingModule.resolve<VerificationRequestService>(
            VerificationRequestService
        );

        vi.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findBySourceUrl", () => {
        const fakeSourceId = "507f1f77bcf86cd799439011";
        const fakeSource = {
            _id: fakeSourceId,
            href: "https://example.com/article",
        };

        it("should return empty array when no matching source exists", async () => {
            mockSourceService.getSourceByHref.mockResolvedValue(null);

            const result = await service.findBySourceUrl(
                "https://nonexistent.com"
            );

            expect(result).toEqual([]);
            expect(mockSourceService.getSourceByHref).toHaveBeenCalledWith(
                "https://nonexistent.com"
            );
            expect(mockVerificationRequestModel.find).not.toHaveBeenCalled();
        });

        it("should return matching verification requests when source is found", async () => {
            const fakeVRs = [
                createFakeVerificationRequest({
                    source: [fakeSourceId] as any,
                }),
            ];
            mockSourceService.getSourceByHref.mockResolvedValue(fakeSource);
            mockQuery.exec.mockResolvedValue(fakeVRs);

            const result = await service.findBySourceUrl(
                "https://example.com/article"
            );

            expect(mockSourceService.getSourceByHref).toHaveBeenCalledWith(
                "https://example.com/article"
            );
            expect(mockVerificationRequestModel.find).toHaveBeenCalledWith(
                { source: fakeSourceId },
                { embedding: 0 }
            );
            expect(mockQuery.sort).toHaveBeenCalledWith({ date: -1 });
            expect(mockQuery.limit).toHaveBeenCalledWith(10);
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(result).toEqual(fakeVRs);
        });

        it("should use default pageSize of 10 when not provided", async () => {
            mockSourceService.getSourceByHref.mockResolvedValue(fakeSource);
            mockQuery.exec.mockResolvedValue([]);

            await service.findBySourceUrl("https://example.com/article");

            expect(mockQuery.limit).toHaveBeenCalledWith(10);
        });

        it("should respect custom pageSize option", async () => {
            mockSourceService.getSourceByHref.mockResolvedValue(fakeSource);
            mockQuery.exec.mockResolvedValue([]);

            await service.findBySourceUrl("https://example.com/article", {
                pageSize: 5,
            });

            expect(mockQuery.limit).toHaveBeenCalledWith(5);
        });
    });
    describe("updateFieldByAiTask (impactArea)", () => {
        const targetId = "507f1f77bcf86cd799439011";
        const params = { targetId, field: "impactArea" };
        let mockFindByIdAndUpdate: any;

        beforeEach(() => {
            (mockVerificationRequestModel as any).findById = vi
                .fn()
                .mockResolvedValue({
                    id: targetId,
                    stateFingerprints: new Map(),
                });
            mockFindByIdAndUpdate = vi.fn().mockReturnValue({
                exec: vi.fn().mockResolvedValue({ id: targetId }),
            });
            (mockVerificationRequestModel as any).findByIdAndUpdate =
                mockFindByIdAndUpdate;
            mockTopicService.findOrCreateTopic.mockImplementation(
                async (area) => ({ _id: `topic-${area.slug}` })
            );
            vi.spyOn(service as any, "trackStateTransition").mockResolvedValue(
                undefined
            );
            vi.spyOn(service as any, "updateProgress").mockResolvedValue(
                undefined
            );
            vi.spyOn(
                service as any,
                "revalidateAndRunMissingStatesWithParallel"
            ).mockResolvedValue(undefined);
        });

        it("stores the listed area the AI result refers to", async () => {
            await service.updateFieldByAiTask(params, {
                name: "Saúde e Bem-Estar",
            });

            expect(mockTopicService.findOrCreateTopic).toHaveBeenCalledWith(
                expect.objectContaining({ slug: "saude" })
            );
            expect(mockFindByIdAndUpdate.mock.calls[0][1].$set.impactArea).toBe(
                "topic-saude"
            );
        });

        it("falls back to the default area when the result is outside the list", async () => {
            await service.updateFieldByAiTask(params, {
                name: "Design de interiores",
            });

            expect(mockTopicService.findOrCreateTopic).toHaveBeenCalledWith(
                expect.objectContaining({ slug: "outros" })
            );
            expect(mockFindByIdAndUpdate.mock.calls[0][1].$set.impactArea).toBe(
                "topic-outros"
            );
        });
    });
});
