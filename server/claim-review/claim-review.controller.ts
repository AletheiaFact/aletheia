import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    Res,
} from "@nestjs/common";
import { ClaimReviewService } from "./claim-review.service";
import { CreateClaimReview } from "./dto/create-claim-review.dto";
import { parse } from "url";
import { Request, Response } from "express";
import { IsPublic } from "../decorators/is-public.decorator";
import { ViewService } from "../view/view.service";

@Controller()
export class ClaimReviewController {
    constructor(
        private claimReviewService: ClaimReviewService,
        private viewService: ViewService,
    ) { }

    @Post("api/review/:sentence_hash")
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
    @Get("api/review/:id")
    get(@Param() params) {
        return this.claimReviewService.getById(params.id);
    }

    @Delete("api/review/:id")
    delete(@Param() params) {
        return this.claimReviewService.delete(params.id);
    }

    @IsPublic()
    @Get("kanban")
    public async personalityList(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/kanban-page",
                Object.assign(parsedUrl.query, {})
            );
    }
}
