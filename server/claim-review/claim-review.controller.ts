import { Body, Controller, Param, Put, Get, UseGuards } from "@nestjs/common";
import { IsPublic } from "../decorators/is-public.decorator";
import { CaptchaService } from "../captcha/captcha.service";
import { ClaimReviewService } from "./claim-review.service";
import { AbilitiesGuard } from "../ability/abilities.guard";
import { AdminUserAbility, CheckAbilities } from "../ability/ability.decorator";

@Controller()
export class ClaimReviewController {
    constructor(
        private claimReviewService: ClaimReviewService,
        private captchaService: CaptchaService
    ) {}

    @Put("api/review/:sentence_hash")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
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
    @Get("api/latest-reviews")
    getLatestReviews() {
        return this.claimReviewService.getLatestReviews();
    }
}
