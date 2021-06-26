import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClaimReview, ClaimReviewSchema } from "./schemas/claim-review.schema";

const ClaimReviewModel = MongooseModule.forFeatureAsync([
    {
        name: ClaimReview.name,
        useFactory: () => ClaimReviewSchema,
    },
]);

@Module({
    imports: [ClaimReviewModel],
})
export class ClaimReviewModule {}
