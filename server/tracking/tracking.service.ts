import { Injectable, NotFoundException } from "@nestjs/common";
import { HistoryService } from "../history/history.service";
import { TargetModel } from "../history/schema/history.schema";
import { TrackingResponseDTO } from "./types/tracking.interfaces";

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
  ): Promise<TrackingResponseDTO> {
    const histories = await this.historyService.getByTargetIdModelAndType({
      targetId: verificationRequestId,
      targetModel: TargetModel.VerificationRequest,
      page: 0,
      pageSize: 1000,
      order: "asc",
      type: ["create", "update"]
    });

    if (histories.length === 0) {
      throw new NotFoundException(`Verification request history for ID "${verificationRequestId}" not found.`);
    }

    const tracking = histories
      .filter(history => history.details?.after?.status && history.details?.before?.status !== history.details?.after?.status)
      .map(history => ({
        id: history._id,
        status: history.details.after.status,
        date: (history.date as unknown) as Date,
      }));

    const latestStatus = tracking.length > 0
      ? tracking.at(-1)?.status
      : null;

    return {
      currentStatus: latestStatus,
      historyEvents: tracking,
    };
  }
}
