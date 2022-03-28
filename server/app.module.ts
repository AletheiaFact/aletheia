import { DynamicModule, MiddlewareConsumer, Module } from "@nestjs/common";
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
import { EmailModule } from "./email/email.module";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { NotFoundFilter } from "./filters/not-found.filter";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { SitemapModule } from "./sitemap/sitemap.module";
import { GetLanguageMiddleware } from "./middleware/language.middleware";
import { PersonalityController } from "./personality/personality.controller";
import { HomeController } from "./home/home.controller";
import { ClaimController } from "./claim/claim.controller";
import { UsersController } from "./users/users.controller";
import { ViewController } from "./view/view.controller";

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
                ThrottlerModule.forRoot({
                    ttl: options.config.throttle.ttl,
                    limit: options.config.throttle.limit,
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
                EmailModule,
                SitemapModule,
            ],
            controllers: [RootController],
            providers: [
                {
                    provide: APP_FILTER,
                    useClass: NotFoundFilter,
                },
                {
                    provide: APP_GUARD,
                    useClass: ThrottlerGuard
                }
            ],
        };
    }
}
