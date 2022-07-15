import { Body, Controller, Post, Param, Get, Put, Query } from "@nestjs/common";
import { ClaimReviewTaskService } from "./claim-review-task.service";
import { CreateClaimReviewTaskDTO } from "./dto/create-claim-review-task.dto";
import { UpdateClaimReviewTaskDTO } from "./dto/update-claim-review-task.dto";
import { CaptchaService } from "../captcha/captcha.service";
import { IsPublic } from "../decorators/is-public.decorator";
import { GetTasksDTO } from "./dto/get-tasks.dto";

@Controller()
export class ClaimReviewController {
    constructor(
        private claimReviewTaskService: ClaimReviewTaskService,
        private captchaService: CaptchaService
    ) { }

    @IsPublic()
    @Get("api/claimreviewtask")
    public async getByMachineValue(@Query() getTasksDTO: GetTasksDTO) {
        const { page = 0, pageSize = 10, order = 1, value, userId } = getTasksDTO;
        return this.claimReviewTaskService.listAll(page, pageSize, order, value, userId)
            .then(tasks => {
                const totalTasks = tasks.length
                const totalPages = Math.ceil(totalTasks / pageSize)

                return {
                    tasks,
                    totalTasks,
                    totalPages,
                    page,
                    pageSize,

                }
            })
    }

    @Get("api/claimreviewtask/:id")
    async getById(@Param("id") id: string) {
        return this.claimReviewTaskService.getById(id);
    }

    @Post("api/claimreviewtask")
    async create(@Body() createClaimReviewTask: CreateClaimReviewTaskDTO) {
        const validateCaptcha = await this.captchaService.validate(
            createClaimReviewTask.recaptcha
        );
        if (!validateCaptcha) {
            throw new Error("Error validating captcha");
        }
        return this.claimReviewTaskService.create(createClaimReviewTask);
    }

    @Put("api/claimreviewtask/:sentence_hash")
    async update(
        @Param("sentence_hash") sentence_hash,
        @Body() newClaimReviewTask: UpdateClaimReviewTaskDTO
    ) {
        const validateCaptcha = await this.captchaService.validate(
            newClaimReviewTask.recaptcha
        );
        if (!validateCaptcha) {
            throw new Error("Error validating captcha");
        }
        return this.claimReviewTaskService.update(
            sentence_hash,
            newClaimReviewTask
        );
    }

    @Get("api/claimreviewtask/sentence/:sentence_hash")
    async getBySentenceHash(@Param("sentence_hash") sentence_hash: string) {
        return this.claimReviewTaskService.getClaimReviewTaskBySentenceHash(
            sentence_hash
        );
    }
}
