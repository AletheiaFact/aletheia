import { Module } from "@nestjs/common";
import { HomeController } from "./home.controller";
import { PersonalityModule } from "../personality/personality.module";
import { StatsModule } from "../stats/stats.module";
import { ViewModule } from "../view/view.module";
import { DebateModule } from "../claim/types/debate/debate.module";
import { ClaimRevisionModule } from "../claim/claim-revision/claim-revision.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";

@Module({
    imports: [
        PersonalityModule,
        StatsModule,
        ViewModule,
        DebateModule,
        ClaimRevisionModule,
        ClaimReviewModule,
    ],
    providers: [],
    controllers: [HomeController],
})
export class HomeModule {}
