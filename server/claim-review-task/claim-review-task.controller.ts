import {
    Body,
    Controller,
    Post,
    Param,
    Get,
    Put,
    Query,
    Req,
    Res,
    Header,
} from "@nestjs/common";
import { ClaimReviewTaskService } from "./claim-review-task.service";
import { CreateClaimReviewTaskDTO } from "./dto/create-claim-review-task.dto";
import { UpdateClaimReviewTaskDTO } from "./dto/update-claim-review-task.dto";
import { CaptchaService } from "../captcha/captcha.service";
import { IsPublic } from "../decorators/is-public.decorator";
import { parse } from "url";
import { Request, Response } from "express";
import { ViewService } from "../view/view.service";
import { GetTasksDTO } from "./dto/get-tasks.dto";
import { getQueryMatchForMachineValue } from "./mongo-utils";
import { ConfigService } from "@nestjs/config";

@Controller()
export class ClaimReviewController {
    constructor(
        private claimReviewTaskService: ClaimReviewTaskService,
        private captchaService: CaptchaService,
        private viewService: ViewService,
        private configService: ConfigService
    ) {}

    @IsPublic()
    @Get("api/claimreviewtask")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getByMachineValue(@Query() getTasksDTO: GetTasksDTO) {
        const { page = 0, pageSize = 10, order = 1, value } = getTasksDTO;
        return Promise.all([
            this.claimReviewTaskService.listAll(page, pageSize, order, value),
            this.claimReviewTaskService.count(
                getQueryMatchForMachineValue(value)
            ),
        ]).then(([tasks, totalTasks]) => {
            const totalPages = Math.ceil(totalTasks / pageSize);

            return {
                tasks,
                totalTasks,
                totalPages,
                page,
                pageSize,
            };
        });
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
    async autoSaveDraft(
        @Param("sentence_hash") sentence_hash,
        @Body() claimReviewTaskBody: UpdateClaimReviewTaskDTO
    ) {
        const history = false;
        return this.claimReviewTaskService
            .getClaimReviewTaskBySentenceHash(sentence_hash)
            .then((review) => {
                if (review) {
                    return this.claimReviewTaskService.update(
                        sentence_hash,
                        claimReviewTaskBody,
                        history
                    );
                }
            });
    }

    @Get("api/claimreviewtask/sentence/:sentence_hash")
    async getBySentenceHash(@Param("sentence_hash") sentence_hash: string) {
        return this.claimReviewTaskService.getClaimReviewTaskBySentenceHash(
            sentence_hash
        );
    }

    @Get("kanban")
    public async personalityList(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        await this.viewService.getNextServer().render(
            req,
            res,
            "/kanban-page",
            Object.assign(parsedUrl.query, {
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
            })
        );
    }
}
