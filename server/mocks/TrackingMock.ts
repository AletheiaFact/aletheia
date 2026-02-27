import { TrackingResponseDTO } from "../tracking/types/tracking.interfaces";
import { VerificationRequestStatus } from "../verification-request/dto/types";

export const mockTrackingService = {
  getTrackingStatus: jest.fn(),
};

export const mockResponse: TrackingResponseDTO = {
        currentStatus: VerificationRequestStatus.IN_TRIAGE,
        historyEvents: [
          {
            id: "history-1",
            status: VerificationRequestStatus.PRE_TRIAGE,
            date: new Date("2024-01-01T10:00:00Z"),
          },
          {
            id: "history-2",
            status: VerificationRequestStatus.IN_TRIAGE,
            date: new Date("2024-01-01T11:00:00Z"),
          },
        ],
      };