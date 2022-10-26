import { Module } from "@nestjs/common";
import { HomeController } from "./home.controller";
import { PersonalityModule } from "../personality/personality.module";
import { StatsModule } from "../stats/stats.module";
import { ViewModule } from "../view/view.module";
import { ClaimCollectionModule } from "../claim-collection/claim-collection.module";

@Module({
    imports: [
        PersonalityModule,
        StatsModule,
        ViewModule,
        ClaimCollectionModule,
    ],
    providers: [],
    controllers: [HomeController],
})
export class HomeModule {}
