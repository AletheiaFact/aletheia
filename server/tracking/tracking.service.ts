import { Injectable, NotFoundException } from "@nestjs/common";
import { HistoryService } from "../history/history.service";
import { TargetModel } from "../history/schema/history.schema";
export interface TrackingItem {
    id: string; 
    status: string;
    date: Date; 
}

@Injectable()
export class TrackingService {
  constructor(
    private readonly historyService: HistoryService
  ) {}

  /**
   * Returns the history of status changes (tracking) for a specific verification request.
   * Searches for "create" and "update" type histories and extracts only status transitions.
   * @param verificationRequestId The id of the verification request.
   * @returns Array of objects { id: string, status: string, date: Date }.
  */
  async getTrackingStatus(
    verificationRequestId: string
  ): Promise<TrackingItem[]> {
    const histories = await this.historyService.getByTargetIdModelAndType(
      verificationRequestId,
      TargetModel.VerificationRequest,
      0,
      1000,
      "asc",
      ["create", "update"]
    );

    if (histories.length === 0) {
      throw new NotFoundException(`Verification request history for ID "${verificationRequestId}" not found.`);
    }

    const tracking = histories
      .filter(h => h.details?.after?.status && h.details?.before?.status !== h.details?.after?.status)
      .map(h => ({
        id: h._id,
        status: h.details.after.status,
        date: (h.date as unknown) as Date,
      }));
    return tracking;
  }
}
