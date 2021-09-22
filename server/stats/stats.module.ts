import { Module } from "@nestjs/common";
import { StatsController } from "./stats.controller";
import { PersonalityModule } from "../personality/personality.module";
import { ClaimModule } from "../claim/claim.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import {StatsService} from "./stats.service";

@Module({
    imports: [PersonalityModule, ClaimModule, ClaimReviewModule],
    controllers: [StatsController],
    providers: [StatsService],
    exports: [StatsService]
})
export class StatsModule {}
