import { Module } from "@nestjs/common";
import { YjsGateway } from "./yjs/yjs.gateway";

@Module({
    imports: [],
    controllers: [],
    providers: [YjsGateway],
})
export class WebsocketModule {}
