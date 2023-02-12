import {
    Body,
    Controller,
    Param,
    Put,
    Get,
    UseGuards,
    Header,
} from "@nestjs/common";
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

    @Put("api/review/:data_hash")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async update(@Param("data_hash") data_hash, @Body() body) {
        const validateCaptcha = await this.captchaService.validate(
            body.recaptcha
        );
        if (!validateCaptcha) {
            throw new Error("Error validating captcha");
        }
        return this.claimReviewService.hideOrUnhideReview(
            data_hash,
            body.hide,
            body.description
        );
    }

    @IsPublic()
    @Get("api/latest-reviews")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    getLatestReviews() {
        return this.claimReviewService.getLatestReviews();
    }

    @IsPublic()
    @Get("api/review/:data_hash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    async getReviewByDataHash(@Param("data_hash") data_hash) {
        const review = await this.claimReviewService.getReviewByDataHash(
            data_hash
        );
        const descriptionForHide =
            await this.claimReviewService.getDescriptionForHide(review);
        return { review, descriptionForHide };
    }
}
