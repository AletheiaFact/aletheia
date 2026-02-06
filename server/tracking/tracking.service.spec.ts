import { Test, TestingModule } from "@nestjs/testing";
import { TrackingService } from "./tracking.service";
import { HistoryService } from "../history/history.service";
import { NotFoundException } from "@nestjs/common";
import { TargetModel } from "../history/schema/history.schema";
import { 
  historyServiceMock, 
  mockHistoryItem, 
  mockHistoryResponse 
} from "../mocks/HistoryMock";
import { VerificationRequestStatus } from "../verification-request/dto/types";

describe("TrackingService (Unit)", () => {
  let service: TrackingService;
  let historyService: typeof historyServiceMock;

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingService,
        {
          provide: HistoryService,
          useValue: historyServiceMock,
        },
      ],
    }).compile();

    service = testingModule.get<TrackingService>(TrackingService);
    historyService = testingModule.get(HistoryService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTrackingStatus", () => {
    const targetIdStr = String(mockHistoryItem.targetId);

    it("should return tracking events correctly (happy path)", async () => {
      historyService.getHistoryForTarget.mockResolvedValue(mockHistoryResponse);

      const result = await service.getTrackingStatus(targetIdStr);

      expect(result.historyEvents).toHaveLength(1);
      expect(result.currentStatus).toBe(VerificationRequestStatus.PRE_TRIAGE);
      expect(result.historyEvents[0].date).toBeInstanceOf(Date);
      expect(historyService.getHistoryForTarget).toHaveBeenCalledWith(
        targetIdStr,
        TargetModel.VerificationRequest,
        expect.objectContaining({ pageSize: 50 })
      );
    });

    it("should filter out events where status did not change", async () => {
      const historyWithNoChange = {
        ...mockHistoryResponse,
        history: [
          mockHistoryItem,
          {
            ...mockHistoryItem,
            _id: "another-id",
            details: {
              before: { status: VerificationRequestStatus.POSTED },
              after: { status: VerificationRequestStatus.POSTED },
            },
          },
        ],
      };
      historyService.getHistoryForTarget.mockResolvedValue(historyWithNoChange);

      const result = await service.getTrackingStatus(targetIdStr);

      expect(result.historyEvents).toHaveLength(1);
      expect(result.historyEvents[0].id).toBe(mockHistoryItem._id);
    });

    it("should throw NotFoundException and log warning when no history exists", async () => {
      historyService.getHistoryForTarget.mockResolvedValue({ history: [] });
      
      const loggerWarnSpy = jest.spyOn(service['logger'], 'warn');

      await expect(service.getTrackingStatus(targetIdStr)).rejects.toThrow(
        NotFoundException
      );
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Tracking not found for ID: ${targetIdStr}`)
      );
    });

    it("should throw a generic error and log error when an unexpected failure occurs", async () => {
      const unexpectedError = new Error("Database connection lost");
      historyService.getHistoryForTarget.mockRejectedValue(unexpectedError);
      
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');

      await expect(service.getTrackingStatus(targetIdStr)).rejects.toThrow(
        "Internal server error while fetching tracking status."
      );
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Failed to fetch tracking for ID: ${targetIdStr}`),
        unexpectedError.stack
      );
    });

    it("should correctly identify the latestStatus as the last item in the array", async () => {
      const multipleHistory = {
        ...mockHistoryResponse,
        history: [
          {
            ...mockHistoryItem,
            details: { after: { status: VerificationRequestStatus.PRE_TRIAGE } }
          },
          {
            ...mockHistoryItem,
            _id: "latest-id",
            details: { 
              before: { status: VerificationRequestStatus.PRE_TRIAGE },
              after: { status: VerificationRequestStatus.IN_TRIAGE } 
            }
          }
        ],
      };
      historyService.getHistoryForTarget.mockResolvedValue(multipleHistory);

      const result = await service.getTrackingStatus(targetIdStr);

      expect(result.currentStatus).toBe(VerificationRequestStatus.IN_TRIAGE);
      expect(result.historyEvents.at(-1)?.status).toBe(VerificationRequestStatus.IN_TRIAGE);
    });
  });
});