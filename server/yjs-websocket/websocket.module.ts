import { EventsModule } from "./events/events.module";
import { Module } from "@nestjs/common";

@Module({
    imports: [EventsModule],
    controllers: [],
    providers: [],
})
export class WebsocketModule {}
