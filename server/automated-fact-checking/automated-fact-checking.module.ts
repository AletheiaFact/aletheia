import { Module } from "@nestjs/common";
import { ReviewTaskModule } from "../review-task/review-task.module";
import { AutomatedFactCheckingService } from "./automated-fact-checking.service";
import { AutomatedFactCheckingController } from "./automated-fact-checking.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ReviewTaskModule, ConfigModule],
    providers: [AutomatedFactCheckingService],
    exports: [AutomatedFactCheckingService],
    controllers: [AutomatedFactCheckingController],
})
export class AutomatedFactCheckingModule {}
