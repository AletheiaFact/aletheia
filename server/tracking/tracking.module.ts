import { Module } from "@nestjs/common";
import { TrackingController } from "./tracking.controller";
import { TrackingService } from "./tracking.service";
import { HistoryModule } from "../history/history.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { VerificationRequestModule } from "../verification-request/verification-request.module";

@Module({
    imports: [
        HistoryModule,
        AbilityModule,
        VerificationRequestModule
    ],
    controllers: [TrackingController],
    providers: [TrackingService],
    exports: [TrackingService],
})
export class TrackingModule { }
