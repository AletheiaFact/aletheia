import {
    DynamicModule,
    MiddlewareConsumer,
    Module,
    NestModule,
} from "@nestjs/common";
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
import { ClaimRevisionModule } from "./claim-revision/claim-revision.module";
import { HistoryModule } from "./history/history.module";
import { ClaimReviewTaskModule } from "./claim-review-task/claim-review-task.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { ReportModule } from "./report/report.module";
import OryModule from "./ory/ory.module";
import { SessionGuard } from "./auth/session.guard";
import { GetLanguageMiddleware } from "./middleware/language.middleware";
import { DisableBodyParserMiddleware } from "./middleware/disable-body-parser.middleware";
import OryController from "./ory/ory.controller";
import { JsonBodyMiddleware } from "./middleware/json-body.middleware";
import { CaptchaModule } from "./captcha/captcha.module";
import { SpeechModule } from "./speech/speech.module";
import { ParagraphModule } from "./paragraph/paragraph.module";

@Module({})
export class AppModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(DisableBodyParserMiddleware)
            .forRoutes(OryController)
            .apply(JsonBodyMiddleware, LoggerMiddleware, GetLanguageMiddleware)
            .forRoutes("*");
    }

    static register(options): DynamicModule {
        // TODO: interface app with service-runner metrics interface
        return {
            module: AppModule,
            global: true,
            imports: [
                MongooseModule.forRoot(
                    options.config.db.connection_uri,
                    options.config.db.options
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
                ClaimReviewTaskModule,
                ClaimRevisionModule,
                HistoryModule,
                SourceModule,
                SpeechModule,
                ParagraphModule,
                StatsModule,
                ViewModule,
                HomeModule,
                EmailModule,
                SitemapModule,
                OryModule,
                ReportModule,
                CaptchaModule,
            ],
            controllers: [RootController],
            providers: [
                {
                    provide: APP_FILTER,
                    useClass: NotFoundFilter,
                },
                {
                    provide: APP_GUARD,
                    useClass: ThrottlerGuard,
                },
                {
                    provide: APP_GUARD,
                    useExisting: SessionGuard,
                },
                SessionGuard
            ],
        };
    }
}
