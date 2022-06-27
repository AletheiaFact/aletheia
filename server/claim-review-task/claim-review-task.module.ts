import { Module } from "@nestjs/common";
import {
    ClaimReviewTask,
    ClaimReviewTaskSchema,
} from "./schemas/claim-review-task.schema";
import { ClaimReviewTaskService } from "./claim-review-task.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ClaimReviewController } from "./claim-review-task.controller";
import { UtilService } from "../util";
import { SourceModule } from "../source/source.module";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { ReportModule } from "../report/report.module";
import { CaptchaModule } from "../captcha/captcha.module";

export const ClaimReviewTaskModel = MongooseModule.forFeature([
    {
        name: ClaimReviewTask.name,
        schema: ClaimReviewTaskSchema,
    },
]);

@Module({
    imports: [
        ClaimReviewTaskModel,
        ClaimReviewModule,
        ReportModule,
        SourceModule,
        HttpModule,
        ConfigModule,
        CaptchaModule,
    ],
    providers: [UtilService, ClaimReviewTaskService],
    exports: [ClaimReviewTaskService],
    controllers: [ClaimReviewController],
})
export class ClaimReviewTaskModule {}
