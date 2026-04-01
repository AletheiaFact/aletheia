import { Module } from "@nestjs/common";
import { HomeController } from "./home.controller";
import { PersonalityModule } from "../personality/personality.module";
import { StatsModule } from "../stats/stats.module";
import { ViewModule } from "../view/view.module";
import { DebateModule } from "../claim/types/debate/debate.module";
import { ClaimRevisionModule } from "../claim/claim-revision/claim-revision.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { EventsModule } from "../events/event.module";
import { FeatureFlagModule } from "../feature-flag/feature-flag.module";

@Module({
    imports: [
        PersonalityModule.register(),
        StatsModule,
        ViewModule,
        DebateModule,
        ClaimRevisionModule,
        ClaimReviewModule,
        EventsModule,
        FeatureFlagModule,
    ],
    providers: [],
    controllers: [HomeController],
})
export class HomeModule {}
