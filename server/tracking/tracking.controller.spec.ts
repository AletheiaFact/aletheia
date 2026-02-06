import { Test } from "@nestjs/testing";
import { TrackingController } from "./tracking.controller";
import { TrackingService } from "./tracking.service";
import { BadRequestException } from "@nestjs/common";
import { mockResponse, mockTrackingService } from "../mocks/TrackingMock";
import { VerificationRequestStatus } from "../verification-request/dto/types";

describe("TrackingController (Unit)", () => {
  let controller: TrackingController;
  let trackingService: any;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [TrackingController],
      providers: [
        { provide: TrackingService, useValue: mockTrackingService },
      ],
    }).compile();

    controller = testingModule.get(TrackingController);
    trackingService = testingModule.get(TrackingService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTracking", () => {
    const validId = "507f1f77bcf86cd799439011";
    const invalidId = "123-id-invalido";

    it("should return tracking status correctly (happy path)", async () => {
      trackingService.getTrackingStatus.mockResolvedValue(mockResponse);

      const response = await controller.getTracking(validId);

      expect(response).toEqual(mockResponse);
      expect(response.currentStatus).toBe(VerificationRequestStatus.IN_TRIAGE);
      expect(trackingService.getTrackingStatus).toHaveBeenCalledWith(validId);
    });

    it("should throw BadRequestException if ID format is invalid", async () => {
      await expect(controller.getTracking(invalidId)).rejects.toThrow(
        BadRequestException
      );
      
      expect(trackingService.getTrackingStatus).not.toHaveBeenCalled();
    });

    it("should propagate service errors", async () => {
      trackingService.getTrackingStatus.mockRejectedValue(new Error("Database connection error"));

      await expect(controller.getTracking(validId)).rejects.toThrow("Database connection error");
    });
  });
});