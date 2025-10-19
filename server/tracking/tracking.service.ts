import { Injectable, Logger } from "@nestjs/common";
import { HistoryService } from "../history/history.service";
import { TargetModel } from "../history/schema/history.schema";

@Injectable()
export class TrackingService {
  private readonly logger = new Logger("TrackingService");
  
  constructor(
    private readonly historyService: HistoryService
  ) {}

  /**
   * Returns the history of status changes (tracking) for a specific target.
   * Searches for "create" and "update" type histories and extracts only status transitions.
   * @param targetId The id of the target.
   * @returns Array of objects { status: string, date: Date }.
  */
  async getTrackingStatus(targetId) {
    const histories = await this.historyService.getByTargetIdModelAndType(
      targetId,
      TargetModel.VerificationRequest,
      0,
      1000,
      "asc",
      ["create", "update"]
    );

    const tracking = histories
      .filter(h => h.details?.after?.status && h.details?.before?.status !== h.details?.after?.status)
      .map(h => ({
        status: h.details.after.status,
        date: h.date,
      }));
    return tracking;
  }
}
