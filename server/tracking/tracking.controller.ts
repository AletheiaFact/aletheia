import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TrackingService } from "./tracking.service";

@ApiTags("tracking")
@Controller("api/tracking")
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) { }

  @Get(":verificationRequestId")
  async getTracking(
    @Param("verificationRequestId") verificationRequestId: string
  ) {
    return this.trackingService.getTrackingStatus(verificationRequestId);
  }
}
