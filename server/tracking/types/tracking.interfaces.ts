import { VerificationRequestStatus } from "../../verification-request/dto/types";

export interface TrackingResponseDTO {
  currentStatus: VerificationRequestStatus;
  historyEvents: HistoryItem[];
}
interface HistoryItem {
  id: string;
  status: VerificationRequestStatus;
  date: Date;
}
