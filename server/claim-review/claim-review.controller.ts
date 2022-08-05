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

@Controller()
export class ClaimReviewController {
    constructor(private claimReviewService: ClaimReviewService) {}

    @Post("api/review/:sentence_hash")
    async create(
        @Body() createClaimReview: CreateClaimReview,
        @Req() req,
        @Param("sentence_hash") sentence_hash
    ) {
        return this.claimReviewService.create(
            {
                ...createClaimReview,
                usersId: req?.user?._id,
            },
            sentence_hash
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
}
