import { Module, forwardRef } from "@nestjs/common";
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
import { EditorParseModule } from "../editor-parse/editor-parse.module";
import { CommentModule } from "./comment/comment.module";
import { FeatureFlagModule } from "../feature-flag/feature-flag.module";
import { GroupModule } from "../group/group.module";

export const ClaimReviewTaskModel = MongooseModule.forFeature([
    {
        name: ClaimReviewTask.name,
        schema: ClaimReviewTaskSchema,
    },
]);

@Module({
    imports: [
        ClaimReviewTaskModel,
        forwardRef(() => ClaimReviewModule),
        forwardRef(() => ReportModule),
        HistoryModule,
        StateEventModule,
        CaptchaModule,
        ViewModule,
        forwardRef(() => SentenceModule),
        ConfigModule,
        ImageModule,
        EditorParseModule,
        CommentModule,
        FeatureFlagModule,
        GroupModule,
    ],
    providers: [ClaimReviewTaskService],
    exports: [ClaimReviewTaskService],
    controllers: [ClaimReviewController],
})
export class ClaimReviewTaskModule {}
