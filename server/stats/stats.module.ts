import { Module } from "@nestjs/common";
import { StatsController } from "./stats.controller";
import { PersonalityModule } from "../personality/personality.module";
import { ClaimModule } from "../claim/claim.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";

@Module({
    imports: [PersonalityModule, ClaimModule, ClaimReviewModule],
    controllers: [StatsController],
})
export class StatsModule {}
