import { Module } from "@nestjs/common";
import {
    ClaimReviewTask,
    ClaimReviewTaskSchema,
} from "./schemas/claim-review-task.schema";
import { ClaimReviewTaskService } from "./claim-review-task.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ClaimReviewController } from "./claim-review-task.controller";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { ReportModule } from "../report/report.module";
import { CaptchaModule } from "../captcha/captcha.module";
import { ViewModule } from "../view/view.module";

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
        CaptchaModule,
        ViewModule
    ],
    providers: [ClaimReviewTaskService],
    exports: [ClaimReviewTaskService],
    controllers: [ClaimReviewController],
})
export class ClaimReviewTaskModule { }
