import { Module } from "@nestjs/common";
import { YjsGateway } from "../yjs/yjs.gateway";

@Module({
    providers: [YjsGateway],
})
export class EventsModule {}
