interface TrackingCardProps {
  verificationRequestId: string;
}

interface TrackingResponseDTO {
  currentStatus: string;
  historyEvents: HistoryItem[];
}

interface HistoryItem {
  id: string;
  status: string;
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