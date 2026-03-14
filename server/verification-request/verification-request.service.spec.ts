import { Model } from "mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { VerificationRequestService } from "./verification-request.service";
import { VerificationRequestDocument } from "./schemas/verification-request.schema";
import { VerificationRequestStateMachineService } from "./state-machine/verification-request.state-machine.service";
import { SourceService } from "../source/source.service";
import { GroupService } from "../group/group.service";
import { HistoryService } from "../history/history.service";
import { AiTaskService } from "../ai-task/ai-task.service";
import { TopicService } from "../topic/topic.service";
import {
  createFakeVerificationRequest,
  mockQuery,
  mockVerificationRequestModel,
} from "../mocks/VerificationRequestMock";

const mockSourceService = {
  getSourceByHref: jest.fn(),
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
        { provide: VerificationRequestStateMachineService, useValue: {} },
        { provide: SourceService, useValue: mockSourceService },
        { provide: GroupService, useValue: {} },
        { provide: HistoryService, useValue: {} },
        { provide: AiTaskService, useValue: {} },
        { provide: TopicService, useValue: {} },
        { provide: "PersonalityService", useValue: {} },
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

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findBySourceUrl", () => {
    const fakeSourceId = "507f1f77bcf86cd799439011";
    const fakeSource = { _id: fakeSourceId, href: "https://example.com/article" };

    it("should return empty array when no matching source exists", async () => {
      mockSourceService.getSourceByHref.mockResolvedValue(null);

      const result = await service.findBySourceUrl("https://nonexistent.com");

      expect(result).toEqual([]);
      expect(mockSourceService.getSourceByHref).toHaveBeenCalledWith(
        "https://nonexistent.com"
      );
      expect(mockVerificationRequestModel.find).not.toHaveBeenCalled();
    });

    it("should return matching verification requests when source is found", async () => {
      const fakeVRs = [
        createFakeVerificationRequest({ source: [fakeSourceId] as any }),
      ];
      mockSourceService.getSourceByHref.mockResolvedValue(fakeSource);
      mockQuery.exec.mockResolvedValue(fakeVRs);

      const result = await service.findBySourceUrl("https://example.com/article");

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
});