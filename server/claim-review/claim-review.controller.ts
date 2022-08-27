import { Body, Controller, Param, Put } from "@nestjs/common";
import { CaptchaService } from "../captcha/captcha.service";
import { ClaimReviewService } from "./claim-review.service";

@Controller()
export class ClaimReviewController {
    constructor(
        private claimReviewService: ClaimReviewService,
        private captchaService: CaptchaService
    ) {}

    @Put("api/review/:sentence_hash")
    async update(@Param("sentence_hash") sentence_hash, @Body() body) {
        if (body.hide === true) {
            const validateCaptcha = await this.captchaService.validate(
                body.recaptcha
            );
            if (!validateCaptcha) {
                throw new Error("Error validating captcha");
            }
        }
        return this.claimReviewService.hideOrUnhideReview(
            sentence_hash,
            body.hide,
            body.description
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
