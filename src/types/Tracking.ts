interface TrackingViewProps {
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

export type { TrackingResponseDTO, TrackingViewProps };