import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FeatureFlagService } from "./feature-flag.service";

@Module({
    imports: [ConfigModule],
    exports: [FeatureFlagService],
    providers: [FeatureFlagService],
})
export class FeatureFlagModule {}
