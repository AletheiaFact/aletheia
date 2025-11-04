import {
    DynamicModule,
    MiddlewareConsumer,
    Module,
    NestModule,
} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
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
import { ClaimRevisionModule } from "./claim/claim-revision/claim-revision.module";
import { HistoryModule } from "./history/history.module";
import { ReviewTaskModule } from "./review-task/review-task.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { ReportModule } from "./report/report.module";
import OryModule from "./auth/ory/ory.module";
import { SessionGuard } from "./auth/session.guard";
import { GetLanguageMiddleware } from "./middleware/language.middleware";
import { DisableBodyParserMiddleware } from "./middleware/disable-body-parser.middleware";
import OryController from "./auth/ory/ory.controller";
import { JsonBodyMiddleware } from "./middleware/json-body.middleware";
import { CaptchaModule } from "./captcha/captcha.module";
import { SpeechModule } from "./claim/types/speech/speech.module";
import { ParagraphModule } from "./claim/types/paragraph/paragraph.module";
import { SentenceModule } from "./claim/types/sentence/sentence.module";
import { StateEventModule } from "./state-event/state-event.module";
import { TopicModule } from "./topic/topic.module";
import { ImageModule } from "./claim/types/image/image.module";
import { SearchModule } from "./search/search.module";
import { FileManagementModule } from "./file-management/file-management.module";
import { UnleashModule } from "nestjs-unleash";
import { UnauthorizedExceptionFilter } from "./filters/unauthorized.filter";
import { DebateModule } from "./claim/types/debate/debate.module";
import { EditorModule } from "./editor/editor.module";
import { BadgeModule } from "./badge/badge.module";
import { EditorParseModule } from "./editor-parse/editor-parse.module";
import { NotificationModule } from "./notifications/notifications.module";
import { CommentModule } from "./review-task/comment/comment.module";
import { NameSpaceModule } from "./auth/name-space/name-space.module";
import { NameSpaceGuard } from "./auth/name-space/name-space.guard";
import { AutomatedFactCheckingModule } from "./automated-fact-checking/automated-fact-checking.module";
import { CopilotChatModule } from "./copilot/copilot-chat.module";
import { UnattributedModule } from "./claim/types/unattributed/unattributed.module";
import { DailyReportModule } from "./daily-report/daily-report.module";
import { SummarizationCrawlerModule } from "./summarization/summarization-crawler.module";
import { ChatbotModule } from "./chat-bot/chat-bot.module";
import { VerificationRequestModule } from "./verification-request/verification-request.module";
import { FeatureFlagModule } from "./feature-flag/feature-flag.module";
import { GroupModule } from "./group/group.module";
import { SessionOrM2MGuard } from "./auth/m2m-or-session.guard";
import { M2MGuard } from "./auth/m2m.guard";
import { CallbackDispatcherModule } from "./callback-dispatcher/callback-dispatcher.module";
import { AiTaskModule } from "./ai-task/ai-task.module";
import { ReleaseNotesModule } from "./release-notes/release-notes.module";

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
        const imports = [];
        if (options.db.type === "mongodb") {
            imports.push(
                MongooseModule.forRoot(
                    options.db.connection_uri,
                    options.db.options
                )
            );
        } else {
            throw new Error("Invalid DB_TYPE in configuration");
        }
        if (options.feature_flag) {
            imports.push(
                UnleashModule.forRoot({
                    url: options.feature_flag.url,
                    appName: options.feature_flag.appName,
                    instanceId: options.feature_flag.instanceId,
                })
            );
        }
        if (options.novu) {
            imports.push(NotificationModule);
        }
        return {
            module: AppModule,
            global: true,
            imports: [
                ...imports,
                ConfigModule.forRoot({
                    load: [() => options || {}],
                }),
                ThrottlerModule.forRoot({
                    ttl: options.throttle.ttl,
                    limit: options.throttle.limit,
                }),
                UsersModule,
                CallbackDispatcherModule,
                WikidataModule,
                PersonalityModule.register(),
                ClaimModule,
                ClaimReviewModule,
                ReviewTaskModule,
                ClaimRevisionModule,
                HistoryModule,
                StateEventModule,
                SourceModule,
                SpeechModule,
                ParagraphModule,
                SentenceModule,
                StatsModule,
                ViewModule,
                EmailModule,
                SitemapModule,
                OryModule,
                ReportModule,
                CaptchaModule,
                ImageModule,
                TopicModule,
                SearchModule,
                FileManagementModule,
                DebateModule,
                EditorModule,
                BadgeModule,
                EditorParseModule,
                NotificationModule,
                CommentModule,
                NameSpaceModule,
                AutomatedFactCheckingModule,
                CopilotChatModule,
                UnattributedModule,
                DailyReportModule,
                SummarizationCrawlerModule,
                ChatbotModule,
                VerificationRequestModule,
                FeatureFlagModule,
                GroupModule,
                AiTaskModule,
                ReleaseNotesModule,
                HomeModule, // Home module must be the last imported module because it contains the root endpoint, may causing some endpoints to be confused as namespace parameters
            ],
            controllers: [RootController],
            providers: [
                {
                    provide: APP_FILTER,
                    useClass: NotFoundFilter,
                },
                {
                    provide: APP_FILTER,
                    useClass: UnauthorizedExceptionFilter,
                },
                {
                    provide: APP_GUARD,
                    useClass: ThrottlerGuard,
                },
                {
                    provide: APP_GUARD,
                    useClass: SessionOrM2MGuard,
                },
                {
                    provide: APP_GUARD,
                    useClass: NameSpaceGuard,
                },
                NameSpaceGuard,
                SessionOrM2MGuard,
                SessionGuard,
                M2MGuard,
            ],
        };
    }
}
