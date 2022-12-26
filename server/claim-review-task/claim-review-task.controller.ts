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

    @Get("api/claimreviewtask")
    @Header("Cache-Control", "no-cache")
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
    @Header("Cache-Control", "no-cache")
    async getById(@Param("id") id: string) {
        return this.claimReviewTaskService.getById(id);
    }

    @Post("api/claimreviewtask")
    @Header("Cache-Control", "no-cache")
    async create(@Body() createClaimReviewTask: CreateClaimReviewTaskDTO) {
        const validateCaptcha = await this.captchaService.validate(
            createClaimReviewTask.recaptcha
        );
        if (!validateCaptcha) {
            throw new Error("Error validating captcha");
        }
        return this.claimReviewTaskService.create(createClaimReviewTask);
    }

    @Put("api/claimreviewtask/:data_hash")
    @Header("Cache-Control", "no-cache")
    async autoSaveDraft(
        @Param("data_hash") data_hash,
        @Body() claimReviewTaskBody: UpdateClaimReviewTaskDTO
    ) {
        const history = false;
        return this.claimReviewTaskService
            .getClaimReviewTaskByDataHash(data_hash)
            .then((review) => {
                if (review) {
                    return this.claimReviewTaskService.update(
                        data_hash,
                        claimReviewTaskBody,
                        history
                    );
                }
            });
    }

    @Get("api/claimreviewtask/hash/:data_hash")
    @Header("Cache-Control", "no-cache")
    async getByDataHash(@Param("data_hash") data_hash: string) {
        return this.claimReviewTaskService.getClaimReviewTaskByDataHash(
            data_hash
        );
    }

    @Get("kanban")
    @Header("Cache-Control", "no-cache")
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
