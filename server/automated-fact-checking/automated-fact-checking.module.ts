import { Module } from "@nestjs/common";
import { ClaimReviewTaskModule } from "../claim-review-task/claim-review-task.module";
import { AutomatedFactCheckingService } from "./automated-fact-checking.service";
import { AutomatedFactCheckingController } from "./automated-fact-checking.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ClaimReviewTaskModule, ConfigModule],
    providers: [AutomatedFactCheckingService],
    exports: [AutomatedFactCheckingService],
    controllers: [AutomatedFactCheckingController],
})
export class AutomatedFactCheckingModule {}
