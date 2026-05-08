import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { HistoryService } from "../history/history.service";
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { TrackingResponseDTO } from "./types/tracking.interfaces";
import { VerificationRequestService } from "../verification-request/verification-request.service";

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(
    private readonly historyService: HistoryService,
    private verificationRequestService: VerificationRequestService,
) { }

  /**
   * Returns the history of status changes (tracking) for a specific verification request.
   * Searches for "create" and "update" type histories and extracts only status transitions.
   * @param verificationRequestId The id of the verification request.
   * @returns Array of objects { id: string, status: string, date: Date }.
   */
  async getTrackingStatus(verificationRequestId: string): Promise<TrackingResponseDTO> {
    try {
    // We only need to call verification requests here because we don't have histories for all verification request steps yet, so it's safer to use the latestStatus from the verification request instead of the history.
    const verificationRequest = await this.verificationRequestService.getById(verificationRequestId);

    const { history } = await this.historyService.getHistoryForTarget(verificationRequestId, TargetModel.VerificationRequest, {
      page: 0,
      pageSize: 50,
      order: "asc",
      type: [HistoryType.Create, HistoryType.Update],
    });

    if (!history || history.length === 0) {
      throw new NotFoundException(`Verification request history for ID "${verificationRequestId}" not found.`);
    }

    const tracking = history
      .filter((history) => history.details?.after?.status && history.details?.before?.status !== history.details?.after?.status)
      .map((history) => ({
        id: history._id,
        status: history.details?.after?.status,
        date: new Date(history.date as string | Date),
      }));

    const latestStatus = verificationRequest?.status ?? "unknown"

    return {
      currentStatus: latestStatus,
      historyEvents: tracking,
    };
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Tracking not found for ID: ${verificationRequestId}`);
        throw error;
      }
      this.logger.error(
        `Failed to fetch tracking for ID: ${verificationRequestId}`,
        error.stack,
      );
      throw new InternalServerErrorException("Internal server error while fetching tracking status.");
    }
  }
}
