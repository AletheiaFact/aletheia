import { Module } from "@nestjs/common";
import { CallbackDispatcherService } from "./callback-dispatcher.service";

@Module({
    providers: [CallbackDispatcherService],
    exports: [CallbackDispatcherService],
})
export class CallbackDispatcherModule {}
