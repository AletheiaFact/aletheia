import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Source, SourceSchema } from "./schemas/source.schema";
import { SourceController } from "./source.controller";
import { SourceService } from "./source.service";
import { ViewModule } from "../view/view.module";
import { ConfigModule } from "@nestjs/config";
import { CaptchaModule } from "../captcha/captcha.module";
import { HistoryModule } from "../history/history.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { ClaimReviewTaskModule } from "../claim-review-task/claim-review-task.module";

const SourceModel = MongooseModule.forFeature([
    {
        name: Source.name,
        schema: SourceSchema,
    },
]);

@Module({
    imports: [
        SourceModel,
        ViewModule,
        ConfigModule,
        CaptchaModule,
        HistoryModule,
        forwardRef(() => ClaimReviewModule),
        ClaimReviewTaskModule,
    ],
    providers: [SourceService],
    exports: [SourceService],
    controllers: [SourceController],
})
export class SourceModule {}
