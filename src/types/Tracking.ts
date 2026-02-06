import { VerificationRequestStatus } from "./enums";
interface TrackingCardProps {
  verificationRequestId: string;
}

interface TrackingResponseDTO {
  currentStatus: VerificationRequestStatus;
  historyEvents: HistoryItem[];
}

interface HistoryItem {
  id: string;
  status: VerificationRequestStatus;
  date: Date;
}

interface TrackingStepProps {
  stepKey: string;
  stepDate: Date | null;
  isCompleted: boolean;
  isDeclined: boolean;
}

interface StepLabelStyledProps {
  backgroundStatusColor: string;
  iconColor: string;
}

export type { TrackingResponseDTO, TrackingCardProps, TrackingStepProps, StepLabelStyledProps };