import { Body, Controller, Param, Put } from "@nestjs/common";
import { ClaimReviewService } from "./claim-review.service";

@Controller()
export class ClaimReviewController {
    constructor(private claimReviewService: ClaimReviewService) {}

    @Put("api/review/:sentence_hash")
    async update(@Param("sentence_hash") sentence_hash, @Body() body) {
        return this.claimReviewService.hideOrUnhideReview(
            sentence_hash,
            body.hide
        );
    }

    @IsPublic()
    @Get("api/review/:id")
    get(@Param() params) {
        return this.claimReviewService.getById(params.id);
    }

    @Delete("api/review/:id")
    delete(@Param() params) {
        return this.claimReviewService.delete(params.id);
    }

    @IsPublic()
    @Get("api/latest-reviews")
    getLatestReviews() {
        return this.claimReviewService.getLatestReviews();
    }
}
