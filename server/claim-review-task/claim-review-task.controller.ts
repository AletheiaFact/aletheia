import { Body, Controller, Post } from "@nestjs/common";
import { ClaimReviewTaskService } from "./claim-review-task.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { IsPublic } from "../decorators/is-public.decorator";
import { CreateClaimReviewTask } from "./dto/create-claim-review-task.dto"

@Controller()
export class ClaimReviewController {
    constructor(
        private claimReviewTaskService: ClaimReviewTaskService,
        private configService: ConfigService,
        private httpService: HttpService
    ) {}

    @IsPublic()
    @Post("api/claimreviewtask")
    async create(@Body() createClaimReviewTask: CreateClaimReviewTask) {
        console.log(createClaimReviewTask)
        return this.claimReviewTaskService.create(createClaimReviewTask)
    }
}