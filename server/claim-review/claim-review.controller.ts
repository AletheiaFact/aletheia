import {
    Body,
    Controller,
    Param,
    Put,
    Get,
    UseGuards,
    Header,
    Delete,
    Query,
} from "@nestjs/common";
import { IsPublic } from "../auth/decorators/is-public.decorator";
import { CaptchaService } from "../captcha/captcha.service";
import { ClaimReviewService } from "./claim-review.service";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import {
    AdminUserAbility,
    CheckAbilities,
} from "../auth/ability/ability.decorator";
import { ApiTags } from "@nestjs/swagger";
import { HistoryService } from "../history/history.service";
import { TargetModel } from "../history/schema/history.schema";
import { GetClaimReviewsDTO } from "./dto/get-claim-reviews.dto";

@Controller("api/:namespace?")
export class ClaimReviewController {
    constructor(
        private claimReviewService: ClaimReviewService,
        private captchaService: CaptchaService,
        private historyService: HistoryService
    ) {}

    @IsPublic()
    @ApiTags("claim-review")
    @Get("/review")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    listAll(@Query() getClaimReviewsDto: GetClaimReviewsDTO) {
        const {
            page = 0,
            pageSize = 10,
            order = "asc",
            isHidden = false,
            latest = false,
        } = getClaimReviewsDto;

        return Promise.all([
            this.claimReviewService.listAll(
                page,
                pageSize,
                order,
                { isHidden, isDeleted: false },
                latest
            ),
            this.claimReviewService.count({ isHidden, isDeleted: false }),
        ]).then(([reviews, totalReviews]) => {
            const totalPages = Math.ceil(totalReviews / pageSize);

            return {
                reviews,
                totalReviews,
                totalPages,
                page,
                pageSize,
            };
        });
    }

    @ApiTags("claim-review")
    @Put("/review/:id")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async update(@Param("id") reviewId, @Body() body) {
        const validateCaptcha = await this.captchaService.validate(
            body.recaptcha
        );
        if (!validateCaptcha) {
            throw new Error("Error validating captcha");
        }
        return this.claimReviewService.hideOrUnhideReview(
            reviewId,
            body.isHidden,
            body.description
        );
    }

    @ApiTags("claim-review")
    @Delete("/review/:id")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async delete(@Param("id") reviewId) {
        return this.claimReviewService.delete(reviewId);
    }

    @IsPublic()
    @ApiTags("claim-review")
    @Get("/review/:data_hash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    async getReviewByDataHash(@Param("data_hash") data_hash) {
        const review = await this.claimReviewService.getReviewByDataHash(
            data_hash
        );
        const descriptionForHide =
            await this.historyService.getDescriptionForHide(
                review,
                TargetModel.ClaimReview
            );
        return { review, descriptionForHide };
    }
}
