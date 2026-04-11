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
import { VerificationRequestService } from "../verification-request/verification-request.service";
import { mockVerificationRequestModel } from "../mocks/VerificationRequestMock";

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
        {
          provide: VerificationRequestService,
          useValue: mockVerificationRequestModel,
        },
      ],
    }).compile();

    service = testingModule.get<TrackingService>(TrackingService);
    historyService = testingModule.get(HistoryService);
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mockVerificationRequestModel.getById.mockResolvedValue({
      id: String(mockHistoryItem.targetId),
      status: VerificationRequestStatus.PRE_TRIAGE,
    });
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
      expect(mockVerificationRequestModel.getById).toHaveBeenCalledWith(targetIdStr);
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

      const loggerWarnSpy = vi.spyOn(service['logger'], 'warn');

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

      const loggerErrorSpy = vi.spyOn(service['logger'], 'error');

      await expect(service.getTrackingStatus(targetIdStr)).rejects.toThrow(
        "Internal server error while fetching tracking status."
      );
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Failed to fetch tracking for ID: ${targetIdStr}`),
        unexpectedError.stack
      );
    });

    it("should return currentStatus from the verification request regardless of history", async () => {
      historyService.getHistoryForTarget.mockResolvedValue(mockHistoryResponse);
      mockVerificationRequestModel.getById.mockResolvedValue({
        id: targetIdStr,
        status: VerificationRequestStatus.IN_TRIAGE,
      });

      const result = await service.getTrackingStatus(targetIdStr);

      expect(result.currentStatus).toBe(VerificationRequestStatus.IN_TRIAGE);
    });
  });
});
