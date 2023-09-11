import {
    DynamicModule,
    MiddlewareConsumer,
    Module,
    NestModule,
} from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { SessionGuard } from "../auth/session.guard";
import { NotFoundFilter } from "../filters/not-found.filter";
import { UnauthorizedExceptionFilter } from "../filters/unauthorized.filter";
import OryController from "../auth/ory/ory.controller";
import { DisableBodyParserMiddleware } from "../middleware/disable-body-parser.middleware";
import { JsonBodyMiddleware } from "../middleware/json-body.middleware";
import { GetLanguageMiddleware } from "../middleware/language.middleware";
import { LoggerMiddleware } from "../middleware/logger.middleware";
import { RootController } from "../root/root.controller";
import { YjsGateway } from "./yjs/yjs.gateway";
import { ConfigModule } from "@nestjs/config";
import { UnleashModule } from "nestjs-unleash";

@Module({})
export class WebsocketModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(DisableBodyParserMiddleware)
            .forRoutes(OryController)
            .apply(JsonBodyMiddleware, LoggerMiddleware, GetLanguageMiddleware)
            .forRoutes("*");
    }

    static register(options): DynamicModule {
        // TODO: interface app with service-runner metrics interface

        const imports = [
            ConfigModule.forRoot({
                load: [() => options.config || {}],
            }),
        ];
        if (options.config.feature_flag) {
            imports.push(
                UnleashModule.forRoot({
                    url: options.config.feature_flag.url,
                    appName: options.config.feature_flag.appName,
                    instanceId: options.config.feature_flag.instanceId,
                })
            );
        }
        return {
            module: WebsocketModule,
            global: true,
            imports,
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
                    useExisting: SessionGuard,
                },
                SessionGuard,
                YjsGateway,
            ],
        };
    }
}
