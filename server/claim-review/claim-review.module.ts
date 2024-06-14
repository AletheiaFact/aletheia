import { Module, forwardRef } from "@nestjs/common";
import { ClaimReview, ClaimReviewSchema } from "./schemas/claim-review.schema";
import { ClaimReviewService } from "./claim-review.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ClaimReviewController } from "./claim-review.controller";
import { UtilService } from "../util";
import { ConfigModule } from "@nestjs/config";
import { HistoryModule } from "../history/history.module";
import { SentenceModule } from "../claim/types/sentence/sentence.module";
import { CaptchaModule } from "../captcha/captcha.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { ImageModule } from "../claim/types/image/image.module";
import { EditorParseModule } from "../editor-parse/editor-parse.module";

export const ClaimReviewModel = MongooseModule.forFeature([
    {
        name: ClaimReview.name,
        schema: ClaimReviewSchema,
    },
]);

@Module({
    imports: [
        ClaimReviewModel,
        HistoryModule,
        ConfigModule,
        forwardRef(() => SentenceModule),
        CaptchaModule,
        AbilityModule,
        ImageModule,
        EditorParseModule,
    ],
    providers: [UtilService, ClaimReviewService],
    exports: [ClaimReviewService],
    controllers: [ClaimReviewController],
})
export class ClaimReviewModule {}
