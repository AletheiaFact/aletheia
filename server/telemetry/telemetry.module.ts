import { Module, Global, OnModuleDestroy } from "@nestjs/common";
import { TelemetryService } from "./telemetry.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    providers: [TelemetryService],
    exports: [TelemetryService],
})
export class TelemetryModule implements OnModuleDestroy {
    constructor(private readonly telemetryService: TelemetryService) {}

    async onModuleDestroy() {
        await this.telemetryService.shutdown();
    }
}
