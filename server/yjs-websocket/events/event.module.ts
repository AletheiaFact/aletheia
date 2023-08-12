import { EventsGateway } from "./events.gateway";
import { Module } from "@nestjs/common";

@Module({
    providers: [EventsGateway],
})
export class EventsModule {}
