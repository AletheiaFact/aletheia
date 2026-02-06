import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TrackingService } from "./tracking.service";
import { HEX24 } from "../history/types/history.interfaces";

@ApiTags("tracking")
@Controller("api/tracking")
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) { }

  @Get(":verificationRequestId")
  async getTracking(
    @Param("verificationRequestId") verificationRequestId: string
  ) {
    if (!HEX24.test(verificationRequestId)) {
      throw new BadRequestException("Invalid verificationRequestId format");
    }
    
    return this.trackingService.getTrackingStatus(verificationRequestId);
  }
}
