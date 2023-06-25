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
import { HistoryModule } from "../history/history.module";
import { StateEventModule } from "../state-event/state-event.module";
import { SentenceModule } from "../claim/types/sentence/sentence.module";
import { ConfigModule } from "@nestjs/config";
import { ImageModule } from "../claim/types/image/image.module";

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
        HistoryModule,
        StateEventModule,
        CaptchaModule,
        ViewModule,
        SentenceModule,
        ConfigModule,
        ImageModule,
    ],
    providers: [ClaimReviewTaskService],
    exports: [ClaimReviewTaskService],
    controllers: [ClaimReviewController],
})
export class ClaimReviewTaskModule {}
