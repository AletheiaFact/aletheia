import { Module } from "@nestjs/common";
import { TrackingController } from "./tracking.controller";
import { TrackingService } from "./tracking.service";
import { HistoryModule } from "../history/history.module";

@Module({
  imports: [
    HistoryModule,
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule { }
