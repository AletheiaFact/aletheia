import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TrackingService } from "./tracking.service";
import { HEX24_REGEX } from "../util/regex.util";
import { RegularUserOnly } from "../auth/decorators/auth.decorator";

@ApiTags("tracking")
@Controller("api/tracking")
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) { }

  @RegularUserOnly()
  @Get(":verificationRequestId")
  async getTracking(
    @Param("verificationRequestId") verificationRequestId: string
  ) {
    if (!HEX24_REGEX.test(verificationRequestId)) {
      throw new BadRequestException("Invalid verificationRequestId format");
    }

    return this.trackingService.getTrackingStatus(verificationRequestId);
  }
}
