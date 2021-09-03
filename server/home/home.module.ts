import { Module } from "@nestjs/common";
import { HomeController } from "./home.controller";
import {PersonalityModule} from "../personality/personality.module";
import {StatsModule} from "../stats/stats.module";
import {ViewModule} from "../view/view.module";

@Module({
    imports: [PersonalityModule, StatsModule, ViewModule],
    providers: [],
    controllers: [HomeController],
})
export class HomeModule {}
