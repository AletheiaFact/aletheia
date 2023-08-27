import { EventsModule } from "./events/events.module";
import { Module } from "@nestjs/common";
// import { YjsModule } from "./yjs/yjs.module";
// import { websocketController } from "./websocket.controller";
// import { websocketService } from "./websocket.service";

@Module({
    imports: [EventsModule],
    controllers: [],
    providers: [],
})
export class WebsocketModule {}

// @Module({})
// export class WebsocketModule implements NestModule {
//     public configure(consumer: MiddlewareConsumer): void {
//         consumer
//             .apply(DisableBodyParserMiddleware)
//             .forRoutes(OryController)
//     }

//     static register(options): DynamicModule {
//         const imports = [
//             ConfigModule.forRoot({
//                 load: [() => options.config || {}],
//             }),
//             ThrottlerModule.forRoot({
//                 ttl: options.config.throttle.ttl,
//                 limit: options.config.throttle.limit,
//             }),
//         ];
//         return {
//             module: WebsocketModule,
//             global: true,
//             imports,
//             controllers: [websocketController],
//             providers: [ YjsGateway, websocketService ],
//         };
//     }
// }
