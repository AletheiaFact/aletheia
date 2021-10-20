import { Module } from "@nestjs/common";
import { ClaimReview, ClaimReviewSchema } from "./schemas/claim-review.schema";
import { ClaimReviewService } from "./claim-review.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ClaimReviewController } from "./claim-review.controller";
import { UtilService } from "../util";
import { SourceModule } from "../source/source.module";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

export const ClaimReviewModel = MongooseModule.forFeature([
    {
        name: ClaimReview.name,
        schema: ClaimReviewSchema,
    },
]);

@Module({
    imports: [ClaimReviewModel, SourceModule, HttpModule, ConfigModule],
    providers: [UtilService, ClaimReviewService],
    exports: [ClaimReviewService],
    controllers: [ClaimReviewController],
})
export class ClaimReviewModule {}
