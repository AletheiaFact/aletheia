import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
} from "@nestjs/common";
import { ClaimReviewService } from "./claim-review.service";
import { CreateClaimReview } from "./dto/create-claim-review.dto";
import { IsPublic } from "../decorators/is-public.decorator";

@Controller("api/claimreview")
export class ClaimReviewController {
    constructor(private claimReviewService: ClaimReviewService) {}

    @Post(":sentence_hash")
    async create(
        @Body() createClaimReview: CreateClaimReview,
        @Req() req,
        @Param("sentence_hash") sentence_hash
    ) {
        return this.claimReviewService.create(
            {
                ...createClaimReview,
                userId: req?.user?._id,
            },
            sentence_hash
        );
    }

    @IsPublic()
    @Get(":id")
    get(@Param() params) {
        return this.claimReviewService.getById(params.id);
    }

    @Delete(":id")
    delete(@Param() params) {
        return this.claimReviewService.delete(params.id);
    }
}
