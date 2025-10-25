export interface TrackingResponseDTO {
  currentStatus: string;
  historyEvents: HistoryItem[];
}
interface HistoryItem {
  id: string;
  status: string;
  date: Date;
}
