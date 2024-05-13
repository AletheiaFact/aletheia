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
    Optional,
} from "@nestjs/common";
import { ClaimReviewTaskService } from "./claim-review-task.service";
import { CreateClaimReviewTaskDTO } from "./dto/create-claim-review-task.dto";
import { UpdateClaimReviewTaskDTO } from "./dto/update-claim-review-task.dto";
import { CaptchaService } from "../captcha/captcha.service";
import { parse } from "url";
import type { Request, Response } from "express";
import { ViewService } from "../view/view.service";
import { GetTasksDTO } from "./dto/get-tasks.dto";
import { getQueryMatchForMachineValue } from "./mongo-utils";
import { ConfigService } from "@nestjs/config";
import { UnleashService } from "nestjs-unleash";
import { ApiTags } from "@nestjs/swagger";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";

@Controller(":namespace?")
export class ClaimReviewController {
    constructor(
        private claimReviewTaskService: ClaimReviewTaskService,
        private captchaService: CaptchaService,
        private viewService: ViewService,
        private configService: ConfigService,
        @Optional() private readonly unleash: UnleashService
    ) {}

    @ApiTags("claim-review-task")
    @Get("api/claimreviewtask")
    @Header("Cache-Control", "no-cache")
    public async getByMachineValue(@Query() getTasksDTO: GetTasksDTO) {
        const {
            page = 0,
            pageSize = 10,
            order = 1,
            value,
            filterUser,
            nameSpace = NameSpaceEnum.Main,
        } = getTasksDTO;
        return Promise.all([
            this.claimReviewTaskService.listAll(
                page,
                pageSize,
                order,
                value,
                filterUser,
                nameSpace
            ),
            this.claimReviewTaskService.countReviewTasksNotDeleted(
                getQueryMatchForMachineValue(value),
                filterUser,
                nameSpace
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

    @ApiTags("claim-review-task")
    @Get("api/claimreviewtask/:id")
    @Header("Cache-Control", "no-cache")
    async getById(@Param("id") id: string) {
        return this.claimReviewTaskService.getById(id);
    }

    @ApiTags("claim-review-task")
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

    @ApiTags("claim-review-task")
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
                        claimReviewTaskBody.nameSpace,
                        history
                    );
                }
            });
    }

    // TODO: remove hash from the url
    @ApiTags("claim-review-task")
    @Get("api/claimreviewtask/hash/:data_hash")
    @Header("Cache-Control", "no-cache")
    async getByDataHash(@Param("data_hash") data_hash: string) {
        return this.claimReviewTaskService.getClaimReviewTaskByDataHash(
            data_hash
        );
    }

    @ApiTags("claim-review-task")
    @Get("api/claimreviewtask/editor-content/:data_hash")
    @Header("Cache-Control", "no-cache")
    async getEditorContentByDataHash(@Param("data_hash") data_hash: string) {
        const claimReviewTask =
            await this.claimReviewTaskService.getClaimReviewTaskByDataHash(
                data_hash
            );

        return this.claimReviewTaskService.getEditorContentObject(
            claimReviewTask?.machine?.context?.reviewData
        );
    }

    @ApiTags("claim-review-task")
    @Put("api/claimreviewtask/add-comment/:data_hash")
    @Header("Cache-Control", "no-cache")
    async addComment(@Param("data_hash") data_hash: string, @Body() body) {
        return this.claimReviewTaskService.addComment(data_hash, body.comment);
    }

    @ApiTags("claim-review-task")
    @Put("api/claimreviewtask/delete-comment/:data_hash")
    @Header("Cache-Control", "no-cache")
    async deleteComment(@Param("data_hash") data_hash: string, @Body() body) {
        return this.claimReviewTaskService.deleteComment(
            data_hash,
            body.commentId
        );
    }

    @ApiTags("pages")
    @Get("kanban")
    @Header("Cache-Control", "no-cache")
    public async personalityList(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const enableCollaborativeEditor = this.isEnableCollaborativeEditor();
        const enableCopilotChatBot = this.isEnableCopilotChatBot();
        const enableEditorAnnotations = this.isEnableEditorAnnotations();

        await this.viewService.getNextServer().render(
            req,
            res,
            "/kanban-page",
            Object.assign(parsedUrl.query, {
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
                enableCollaborativeEditor,
                enableEditorAnnotations,
                enableCopilotChatBot,
                websocketUrl: this.configService.get<string>("websocketUrl"),
                nameSpace: req.params.namespace,
            })
        );
    }

    private isEnableCollaborativeEditor() {
        const config = this.configService.get<string>("feature_flag");

        return config
            ? this.unleash.isEnabled("enable_collaborative_editor")
            : false;
    }

    private isEnableCopilotChatBot() {
        const config = this.configService.get<string>("feature_flag");

        return config ? this.unleash.isEnabled("copilot_chat_bot") : false;
    }

    private isEnableEditorAnnotations() {
        const config = this.configService.get<string>("feature_flag");

        return config
            ? this.unleash.isEnabled("enable_editor_annotations")
            : false;
    }
}
