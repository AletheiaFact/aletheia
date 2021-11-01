import { DynamicModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { WikidataModule } from "./wikidata/wikidata.module";
import { PersonalityModule } from "./personality/personality.module";
import { ClaimModule } from "./claim/claim.module";
import { ClaimReviewModule } from "./claim-review/claim-review.module";
import { SourceModule } from "./source/source.module";
import { StatsModule } from "./stats/stats.module";
import { RootController } from "./root/root.controller";
import { ConfigModule } from "@nestjs/config";
import { ViewModule } from "./view/view.module";
import { HomeModule } from "./home/home.module";

@Module({})
export class AppModule {
    static register(options): DynamicModule {
        // TODO: interface app with service-runner metrics interface
        return {
            module: AppModule,
            imports: [
                MongooseModule.forRoot(
                    options.db.connection_uri,
                    options.db.options
                ),
                ConfigModule.forRoot({
                    load: [() => options.config || {}],
                }),
                UsersModule,
                AuthModule,
                WikidataModule,
                PersonalityModule,
                ClaimModule,
                ClaimReviewModule,
                SourceModule,
                StatsModule,
                ViewModule,
                HomeModule,
            ],
            controllers: [RootController],
        };
    }
}
