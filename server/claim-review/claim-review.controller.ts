import {
    BadRequestException,
    Body,
    Controller,
    Param,
    Put,
    Get,
    Header,
    Delete,
} from "@nestjs/common";
import { Public, AdminOnly } from "../auth/decorators/auth.decorator";
import { CaptchaService } from "../captcha/captcha.service";
import { ClaimReviewService } from "./claim-review.service";
import { ApiTags } from "@nestjs/swagger";
import { HistoryService } from "../history/history.service";
import { TargetModel } from "../history/schema/history.schema";
import {
    ListClaimReviewsQuerySchema,
    ListClaimReviewsQueryDto,
} from "./dto/get-claim-reviews.dto";
import { ZodQuery } from "../common/validation";
import { listAllResponse } from "./types/claim-review.interfaces";
import { UpdateClaimReviewDTO } from "./dto/update-claim-review.dto";
import { UpdateWriteOpResult } from "mongoose";

@Controller()
export class ClaimReviewController {
    constructor(
        private claimReviewService: ClaimReviewService,
        private captchaService: CaptchaService,
        private historyService: HistoryService
    ) {}

    @Public()
    @ApiTags("claim-review")
    @Get("api/review")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    async listAll(
        @ZodQuery(ListClaimReviewsQuerySchema)
        getClaimReviewsDto: ListClaimReviewsQueryDto
    ): Promise<listAllResponse> {
        const {
            page,
            pageSize,
            order,
            isHidden,
            latest,
            nameSpace,
            mainTopicId,
            q,
            personality,
            contentModel,
            classification,
            classificationMethodology,
            startDate,
            endDate,
            withCounts,
        } = getClaimReviewsDto;

        const reviews = await this.claimReviewService.listAll({
            page,
            pageSize,
            order: order === "asc" ? "asc" : "desc",
            query: {
                isHidden,
                nameSpace,
                isDeleted: false,
                isPublished: true,
            },
            latest,
            mainTopicId,
            filters: {
                q,
                personality,
                contentModel,
                classification,
                classificationMethodology,
                startDate,
                endDate,
            },
            withContentModelCounts: withCounts,
        });

        return {
            reviews: reviews.data,
            totalReviews: reviews.total,
            totalPages: Math.ceil(reviews.total / pageSize),
            page: page,
            pageSize: pageSize,
            ...(reviews.contentModelCounts && {
                contentModelCounts: reviews.contentModelCounts,
            }),
        };
    }

    @AdminOnly()
    @ApiTags("claim-review")
    @Put("api/review/:id")
    async update(
        @Param("id") reviewId: string,
        @Body() body: UpdateClaimReviewDTO
    ): Promise<UpdateWriteOpResult> {
        const validateCaptcha = await this.captchaService.validate(
            body.recaptcha ?? ""
        );
        if (!validateCaptcha) {
            throw new BadRequestException("Error validating captcha");
        }
        return this.claimReviewService.hideOrUnhideReview(
            reviewId,
            body.isHidden,
            body.description
        );
    }

    @AdminOnly()
    @ApiTags("claim-review")
    @Delete("api/review/:id")
    async delete(@Param("id") reviewId: string) {
        return this.claimReviewService.delete(reviewId);
    }

    @Public()
    @ApiTags("claim-review")
    @Get("api/review/:data_hash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    async getReviewByDataHash(@Param("data_hash") data_hash: string) {
        const review = await this.claimReviewService.getReviewByDataHash(
            data_hash
        );
        if (!review) {
            return { review: null, descriptionForHide: null };
        }

        const descriptionForHide =
            await this.historyService.getDescriptionForHide(
                review,
                TargetModel.ClaimReview
            );
        return { review, descriptionForHide };
    }
}
