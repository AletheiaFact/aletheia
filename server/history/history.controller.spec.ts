import { Test } from "@nestjs/testing";
import { HistoryController } from "./history.controller";
import { HistoryService } from "./history.service";
import { historyServiceMock, mockHistoryItem } from "../mocks/HistoryMock";
import { TargetModel } from "./schema/history.schema";

describe("HistoryController (Unit)", () => {
  let controller: HistoryController;
  let historyService: typeof historyServiceMock;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [HistoryController],
      providers: [{ provide: HistoryService, useValue: historyServiceMock }],
    }).compile();

    controller = testingModule.get(HistoryController);
    historyService = testingModule.get(HistoryService);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getHistory", () => {
    it("should return history correctly (happy path)", async () => {
      historyService.getHistoryForTarget.mockResolvedValue({
        history: [mockHistoryItem],
        totalChanges: 1,
        totalPages: 1,
        page: 1,
        pageSize: 10,
      });

      const response = await controller.getHistory(
        { targetId: "id", targetModel: TargetModel.Claim },
        {}
      );
      expect(response.history.length).toBeGreaterThan(0);
      expect(response.totalChanges).toBeGreaterThanOrEqual(1);
    });

    it("should throw error if targetId is empty", async () => {
      await expect(
        controller.getHistory({ targetId: "", targetModel: TargetModel.Claim }, {})
      ).rejects.toThrow();
    });

    it("should throw error if service fails", async () => {
      historyService.getHistoryForTarget.mockRejectedValue(new Error("fail"));
      await expect(
        controller.getHistory({ targetId: "id", targetModel: TargetModel.Claim  }, {})
      ).rejects.toThrow("fail");
    });
  });
});
