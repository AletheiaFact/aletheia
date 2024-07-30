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
import { ReviewTaskService } from "./review-task.service";
import { CreateReviewTaskDTO } from "./dto/create-review-task.dto";
import { UpdateReviewTaskDTO } from "./dto/update-review-task.dto";
import { CaptchaService } from "../captcha/captcha.service";
import { parse } from "url";
import type { Request, Response } from "express";
import { ViewService } from "../view/view.service";
import { GetTasksDTO } from "./dto/get-tasks.dto";
import { ConfigService } from "@nestjs/config";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
import { ApiTags } from "@nestjs/swagger";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";

@Controller(":namespace?")
export class ReviewTaskController {
    constructor(
        private reviewTaskService: ReviewTaskService,
        private captchaService: CaptchaService,
        private viewService: ViewService,
        private configService: ConfigService,
        private featureFlagService: FeatureFlagService
    ) {}

    @ApiTags("review-task")
    @Get("api/reviewtask")
    @Header("Cache-Control", "no-cache")
    public async getByMachineValue(@Query() getTasksDTO: GetTasksDTO) {
        const {
            page = 0,
            pageSize = 10,
            order = 1,
            value,
            filterUser,
            reviewTaskType,
            nameSpace = NameSpaceEnum.Main,
        } = getTasksDTO;
        return Promise.all([
            this.reviewTaskService.listAll({
                page,
                pageSize,
                order,
                value,
                filterUser,
                nameSpace,
                reviewTaskType,
            }),
            this.reviewTaskService.countReviewTasksNotDeleted(
                value,
                filterUser,
                nameSpace,
                reviewTaskType
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

    @ApiTags("review-task")
    @Get("api/reviewtask/:id")
    @Header("Cache-Control", "no-cache")
    async getById(@Param("id") id: string) {
        return this.reviewTaskService.getById(id);
    }

    @ApiTags("review-task")
    @Post("api/reviewtask")
    @Header("Cache-Control", "no-cache")
    async create(@Body() createReviewTask: CreateReviewTaskDTO) {
        const validateCaptcha = await this.captchaService.validate(
            createReviewTask.recaptcha
        );
        if (!validateCaptcha) {
            throw new Error("Error validating captcha");
        }
        return this.reviewTaskService.create(createReviewTask);
    }

    @ApiTags("review-task")
    @Put("api/reviewtask/:data_hash")
    @Header("Cache-Control", "no-cache")
    async autoSaveDraft(
        @Param("data_hash") data_hash,
        @Body() reviewTaskBody: UpdateReviewTaskDTO
    ) {
        const history = false;
        return this.reviewTaskService
            .getReviewTaskByDataHash(data_hash)
            .then((review) => {
                if (review) {
                    return this.reviewTaskService.update(
                        data_hash,
                        reviewTaskBody,
                        reviewTaskBody.nameSpace,
                        reviewTaskBody.reportModel,
                        history
                    );
                }
            });
    }

    // TODO: remove hash from the url
    @ApiTags("review-task")
    @Get("api/reviewtask/hash/:data_hash")
    @Header("Cache-Control", "no-cache")
    async getByDataHash(@Param("data_hash") data_hash: string) {
        return this.reviewTaskService.getReviewTaskByDataHash(data_hash);
    }

    @ApiTags("review-task")
    @Get("api/reviewtask/editor-content/:data_hash")
    @Header("Cache-Control", "no-cache")
    async getEditorContentByDataHash(
        @Param("data_hash") data_hash: string,
        @Query() query: { reportModel: string; reviewTaskType: string }
    ) {
        const reviewTask = await this.reviewTaskService.getReviewTaskByDataHash(
            data_hash
        );

        return this.reviewTaskService.getEditorContentObject(
            reviewTask?.machine?.context?.reviewData,
            query.reportModel,
            query.reviewTaskType
        );
    }

    @ApiTags("review-task")
    @Put("api/reviewtask/add-comment/:data_hash")
    @Header("Cache-Control", "no-cache")
    async addComment(@Param("data_hash") data_hash: string, @Body() body) {
        return this.reviewTaskService.addComment(data_hash, body.comment);
    }

    @ApiTags("review-task")
    @Put("api/reviewtask/delete-comment/:data_hash")
    @Header("Cache-Control", "no-cache")
    async deleteComment(@Param("data_hash") data_hash: string, @Body() body) {
        return this.reviewTaskService.deleteComment(data_hash, body.commentId);
    }

    @ApiTags("pages")
    @Get("kanban")
    @Header("Cache-Control", "no-cache")
    public async kanbanList(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const enableCollaborativeEditor =
            this.featureFlagService.isEnableCollaborativeEditor();
        const enableCopilotChatBot =
            this.featureFlagService.isEnableCopilotChatBot();
        const enableEditorAnnotations =
            this.featureFlagService.isEnableEditorAnnotations();
        const enableAddEditorSourcesWithoutSelecting =
            this.featureFlagService.isEnableAddEditorSourcesWithoutSelecting();
        const enableReviewersUpdateReport =
            this.featureFlagService.isEnableReviewersUpdateReport();
        const enableViewReportPreview =
            this.featureFlagService.isEnableViewReportPreview();

        await this.viewService.getNextServer().render(
            req,
            res,
            "/kanban-page",
            Object.assign(parsedUrl.query, {
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
                enableCollaborativeEditor,
                enableEditorAnnotations,
                enableCopilotChatBot,
                enableAddEditorSourcesWithoutSelecting,
                enableReviewersUpdateReport,
                enableViewReportPreview,
                websocketUrl: this.configService.get<string>("websocketUrl"),
                nameSpace: req.params.namespace,
            })
        );
    }
}
