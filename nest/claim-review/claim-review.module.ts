import { Module } from "@nestjs/common";
import { ClaimReview, ClaimReviewSchema } from "./schemas/claim-review.schema";
import { ClaimReviewService } from "./claim-review.service";
import { MongooseModule } from "@nestjs/mongoose";

export const ClaimReviewModel = MongooseModule.forFeature([
    {
        name: ClaimReview.name,
        schema: ClaimReviewSchema,
    },
]);

@Module({
    imports: [ClaimReviewModel],
    providers: [ClaimReviewService],
    exports: [ClaimReviewService],
})
export class ClaimReviewModule {}
