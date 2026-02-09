import { Module } from "@nestjs/common";
import { TrackingController } from "./tracking.controller";
import { TrackingService } from "./tracking.service";
import { HistoryModule } from "../history/history.module";
import { AbilityModule } from "../auth/ability/ability.module";

@Module({
  imports: [
    HistoryModule,
    AbilityModule,
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule { }
