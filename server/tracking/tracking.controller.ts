import { Controller, Get, Logger, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TrackingService } from "./tracking.service";

@Controller()
export class TrackingController {
  private readonly logger = new Logger("TrackingController");
  constructor(private readonly trackingService: TrackingService) { }

  @ApiTags("tracking")
  @Get("api/tracking/:verificationRequestId")
  async getTracking(
    @Param("verificationRequestId") verificationRequestId: string
  ) {
    return this.trackingService.getTrackingStatus(verificationRequestId);
  }
}
