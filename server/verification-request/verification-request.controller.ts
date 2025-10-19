import {
    Controller,
    Post,
    Body,
    Get,
    Res,
    Req,
    Header,
    Query,
    Param,
    Put,
    UseGuards,
    Logger,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { VerificationRequestService } from "./verification-request.service";
import type { BaseRequest } from "../types";
import { parse } from "url";
import { ConfigService } from "@nestjs/config";
import { ViewService } from "../view/view.service";
import type { Response } from "express";
import { ReviewTaskService } from "../review-task/review-task.service";
import { CreateVerificationRequestDTO } from "./dto/create-verification-request-dto";
import { UpdateVerificationRequestDTO } from "./dto/update-verification-request.dto";
import { CaptchaService } from "../captcha/captcha.service";
import { TargetModel } from "../history/schema/history.schema";

import { VerificationRequestStateMachineService } from "./state-machine/verification-request.state-machine.service";
import { Public, AdminOnly } from "../auth/decorators/auth.decorator";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import {
    AdminUserAbility,
    CheckAbilities,
} from "../auth/ability/ability.decorator";
import { Roles } from "../auth/ability/ability.factory";

@Controller(":namespace?")
export class VerificationRequestController {
    private readonly logger = new Logger(VerificationRequestController.name);

    constructor(
        private verificationRequestService: VerificationRequestService,
        private configService: ConfigService,
        private viewService: ViewService,
        private reviewTaskService: ReviewTaskService,
        private captchaService: CaptchaService,
        private verificationRequestStateMachineService: VerificationRequestStateMachineService
    ) {}

    @ApiTags("verification-request")
    @Get("api/verification-request")
    @Public()
    public async listAll(@Query() getVerificationRequest) {
        const {
            pageSize,
            page,
            contentFilters = [],
            topics = [],
            order,
            startDate,
            endDate,
            severity,
            sourceChannel,
            status,
            impactArea,
        } = getVerificationRequest;

        const [verificationRequests, totalVerificationRequests] =
            await Promise.all([
                this.verificationRequestService.listAll({
                    contentFilters,
                    topics,
                    page,
                    pageSize,
                    order,
                    startDate,
                    endDate,
                    severity,
                    sourceChannel,
                    status,
                    impactArea,
                }),
                this.verificationRequestService.count({
                    contentFilters,
                    topics,
                    startDate,
                    endDate,
                    severity,
                    sourceChannel,
                    status,
                    impactArea,
                }),
            ]);

        const totalPages = Math.ceil(totalVerificationRequests / pageSize);

        return {
            verificationRequests,
            totalVerificationRequests,
            totalPages,
            page,
            pageSize,
        };
    }

    @ApiTags("verification-request")
    @Get("api/verification-request/search")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getAll(@Query() getVerificationRequest) {
        return this.verificationRequestService.findAll(getVerificationRequest);
    }

    @ApiTags("verification-request")
    @Get("api/verification-request/:id")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getById(@Param("id") verificationRequestId: string) {
        return this.verificationRequestService.getById(verificationRequestId);
    }

    @ApiTags("verification-request")
    @Post("api/verification-request")
    async create(
        @Req() req: BaseRequest,
        @Body() verificationRequestBody: CreateVerificationRequestDTO
    ) {
        const isM2MUser = req.user?.role?.main === Roles.Integration;

        if (!isM2MUser) {
            this.logger.log("Regular user request - validating CAPTCHA");
            const validateCaptcha = await this.captchaService.validate(
                verificationRequestBody.recaptcha
            );
            if (!validateCaptcha) {
                throw new Error("Error validating captcha");
            }
        } else {
            this.logger.log("M2M user request - skipping CAPTCHA validation");
        }

        return this.verificationRequestStateMachineService.request(
            verificationRequestBody,
            req.user
        );
    }

    @ApiTags("pages")
    @Get("verification-request/create")
    public async VerificationRequestCreatePage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);
        const queryObject = Object.assign(parsedUrl.query, {
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            nameSpace: req.params.namespace,
        });

        await this.viewService.render(
            req,
            res,

            "/verification-request-create",

            queryObject
        );
    }

    @ApiTags("verification-request")
    @Put("api/verification-request/:verificationRequestId")
    @AdminOnly()
    async updateVerificationRequest(
        @Param("verificationRequestId") verificationRequestId: string,
        @Body() updateVerificationRequestDto: UpdateVerificationRequestDTO
    ) {
        return this.verificationRequestService.update(
            verificationRequestId,
            updateVerificationRequestDto
        );
    }

    @ApiTags("verification-request")
    @Put("api/verification-request/:data_hash/topics")
    async updateVerificationRequestWithTopics(
        @Param("data_hash") data_hash: string,
        @Body() topics
    ) {
        return this.verificationRequestService.updateVerificationRequestWithTopics(
            topics,
            data_hash
        );
    }

    @ApiTags("verification-request")
    @Put("api/verification-request/:verificationRequestId/group")
    async removeVerificationRequestFromGroup(
        @Param("verificationRequestId") verificationRequestId: string,
        @Body() { group }: { group: string }
    ) {
        return this.verificationRequestService.removeVerificationRequestFromGroup(
            verificationRequestId,
            group
        );
    }

    @ApiTags("pages")
    @Get("verification-request")
    @Header("Cache-Control", "no-cache")
    @Public()
    public async verificationRequestPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);
        const queryObject = Object.assign(parsedUrl.query, {
            nameSpace: req.params.namespace,
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
        });

        await this.viewService.render(
            req,
            res,
            "/verification-request-page",
            queryObject
        );
    }

    @Public()
    @ApiTags("pages")
    @Get("verification-request/:dataHash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async verificationRequestReviewPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        // TODO: considering a different speech, we need improve the filter for recommendations
        // As example, if the personality is different, or if the topic could be similar or happenend in the same event

        const parsedUrl = parse(req.url, true);
        const { dataHash } = req.params;

        const verificationRequest =
            await this.verificationRequestService.findByDataHash(dataHash);

        const reviewTask =
            await this.reviewTaskService.getReviewTaskByDataHashWithUsernames(
                dataHash
            );
        const recommendationFilter = verificationRequest.group?.content?.map(
            (v: any) => v._id
        ) || [verificationRequest?._id];

        const recommendations =
            await this.verificationRequestService.findSimilarRequests(
                verificationRequest.embedding,
                recommendationFilter,
                5
            );

        const queryObject = Object.assign(parsedUrl.query, {
            reviewTask,
            recommendations,
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            hideDescriptions: {},
            websocketUrl: this.configService.get<string>("websocketUrl"),
            nameSpace: req.params.namespace,
            verificationRequest,
        });
        await this.viewService.render(
            req,
            res,
            "/verification-request-review-page",
            queryObject
        );
    }

    @ApiTags("pages")
    @Get("verification-request/:data_hash/history")
    public async verificationRequestHistoryPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);
        const { data_hash } = req.params;

        const verificationRequest =
            await this.verificationRequestService.findByDataHash(data_hash);

        const queryObject = Object.assign(parsedUrl.query, {
            targetId: verificationRequest._id,
            targetModel: TargetModel.VerificationRequest,
        });

        await this.viewService.render(req, res, "/history-page", queryObject);
    }

    @ApiTags("pages")
    //To DO: set decorator to public
    @Get("verification-request/:data_hash/tracking")
    public async verificationRequestTrackingPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);
        const { data_hash } = req.params;

        const verificationRequest =
            await this.verificationRequestService.findByDataHash(data_hash);

        const queryObject = Object.assign(parsedUrl.query, {
            targetId: verificationRequest._id,
        });

        await this.viewService.render(req, res, "/tracking-page", queryObject);
    }
}
