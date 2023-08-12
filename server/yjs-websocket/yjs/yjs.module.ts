import { Module } from "@nestjs/common";
import { YjsGateway } from "./yjs.gateway";

@Module({
    providers: [YjsGateway],
})
export class YjsModule {}
