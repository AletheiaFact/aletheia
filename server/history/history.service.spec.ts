import { Mock } from "vitest";
import { getModelToken } from "@nestjs/mongoose";
import { HistoryService } from "./history.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import {
  mockHistoryResponse,
  mockAggregateMongoResult,
  mockHistoryItem,
  mockHistoryModel,
} from "../mocks/HistoryMock";
import { TargetModel, HistoryType } from "./schema/history.schema";
import { HistoryDocument } from "./schema/history.schema";

describe("HistoryService (Unit)", () => {
  let service: HistoryService;
  let testingModule: TestingModule;
  let model: Model<HistoryDocument>;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        { provide: getModelToken("History"), useValue: mockHistoryModel },
      ],
    }).compile();

    model = testingModule.get(getModelToken("History"));
    service = testingModule.get<HistoryService>(HistoryService);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe("HistoryService.createHistory", () => {
    it("should create a new history document and call save", async () => {
      const result = await service.createHistory(mockHistoryItem);

      const instance = (mockHistoryModel as Mock).mock.instances[0];

      expect(instance.save).toHaveBeenCalled();
      expect(result._id).toBe("abc");
    });

    it("should throw if save fails", async () => {
      const error = new Error("Database error");

      (mockHistoryModel as Mock).mockImplementationOnce(function () {
        return {
          save: vi.fn().mockRejectedValue(error),
        };
      });

      await expect(service.createHistory(mockHistoryItem)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("HistoryService.getHistoryParams", () => {
    it("should throw for invalid dataId", () => {
      const invalidId = "not-a-valid-id";
      expect(() =>
        service.getHistoryParams(
          invalidId,
          TargetModel.Claim,
          null,
          HistoryType.Create,
          { some: "value" }
        )
      ).toThrow(`Invalid dataId received: ${invalidId}`);
    });

    it("should return correct params for valid dataId", () => {
      const validId = mockHistoryItem.targetId.toString();
      const params = service.getHistoryParams(
        validId,
        TargetModel.Claim,
        null,
        HistoryType.Update,
        { some: "latest" },
        { some: "previous" }
      );

      expect(params).toHaveProperty("targetId");
      expect(params.targetModel).toBe(TargetModel.Claim);
      expect(params.details.after).toEqual({ some: "latest" });
      expect(params.details.before).toEqual({ some: "previous" });
    });
  });

  describe("HistoryService.getDescriptionForHide", () => {
    it("should return empty string when content missing or not hidden", async () => {
      const responseWithoutContent = await service.getDescriptionForHide(
        {},
        TargetModel.Claim
      );
      expect(responseWithoutContent).toBe("");

      const responseHidden = await service.getDescriptionForHide(
        { content: mockHistoryItem._id, isHidden: false },
        TargetModel.Claim
      );
      expect(responseHidden).toBe("");
    });

    it("should return description from history when hidden", async () => {
      vi
        .spyOn(service, "getHistoryForTarget")
        .mockResolvedValue(mockHistoryResponse);

      const response = await service.getDescriptionForHide(
        { _id: mockHistoryItem._id, isHidden: true },
        TargetModel.Claim
      );
      expect(response).toBe(
        mockHistoryResponse.history[0].details.after.description
      );
    });
  });

  describe("HistoryService.getHistoryForTarget", () => {
    it("should return paginated history and counts", async () => {
      mockHistoryModel.aggregate.mockResolvedValueOnce(
        mockAggregateMongoResult
      );

      const res = await service.getHistoryForTarget(
        mockHistoryItem.targetId.toString(),
        TargetModel.Claim,
        { page: 0, pageSize: 10, order: "asc" }
      );

      expect(res.history).toEqual([mockHistoryItem]);
      expect(res.totalChanges).toBe(1);
      expect(res.totalPages).toBe(1);
      expect(res.page).toBe(0);
      expect(res.pageSize).toBe(10);
    });

    it("should handle empty aggregate result", async () => {
      (mockHistoryModel.aggregate as Mock).mockResolvedValue(
        [{ data: [], totalCount: [] }]
      );

      const res = await service.getHistoryForTarget(
        mockHistoryItem.targetId.toString(),
        TargetModel.Claim,
        { page: 0, pageSize: 10, order: "asc" }
      );

      expect(res.history).toEqual([]);
      expect(res.totalChanges).toBe(0);
      expect(res.totalPages).toBe(0);
    });
  });
});
