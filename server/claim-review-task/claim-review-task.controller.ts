import { Body, Controller, Post } from "@nestjs/common";
import { ClaimReviewTaskService } from "./claim-review-task.service";
import { CreateClaimReviewTask } from "./dto/create-claim-review-task.dto"

@Controller()
export class ClaimReviewController {
    constructor(
        private claimReviewTaskService: ClaimReviewTaskService,
    ) {}

    @Post("api/claimreviewtask")
    async create(@Body() createClaimReviewTask: CreateClaimReviewTask) {
        return this.claimReviewTaskService.create(createClaimReviewTask)
    }
}
