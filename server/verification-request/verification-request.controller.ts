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
import { IsPublic } from "../auth/decorators/is-public.decorator";
import { CaptchaService } from "../captcha/captcha.service";

@Controller(":namespace?")
export class VerificationRequestController {
    constructor(
        private verificationRequestService: VerificationRequestService,
        private configService: ConfigService,
        private viewService: ViewService,
        private reviewTaskService: ReviewTaskService,
        private captchaService: CaptchaService
    ) {}

    @ApiTags("verification-request")
    @Get("api/verification-request")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async listAll(@Query() getVerificationRequest) {
        const {
            pageSize,
            page,
            contentFilters = [],
            topics = [],
            order,
        } = getVerificationRequest;

        const [verificationRequests, totalVerificationRequests] =
            await Promise.all([
                this.verificationRequestService.listAll({
                    contentFilters,
                    topics,
                    page,
                    pageSize,
                    order,
                }),
                this.verificationRequestService.count({
                    contentFilters,
                    topics,
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
        @Body() verificationRequestBody: CreateVerificationRequestDTO
    ) {
        const validateCaptcha = await this.captchaService.validate(
            verificationRequestBody.recaptcha
        );
        if (!validateCaptcha) {
            throw new Error("Error validating captcha");
        }
        return this.verificationRequestService.create(verificationRequestBody);
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

    @IsPublic()
    @ApiTags("pages")
    @Get("verification-request")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async verificationRequestPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);
        const queryObject = Object.assign(parsedUrl.query, {
            nameSpace: req.params.namespace,
        });

        await this.viewService.render(
            req,
            res,
            "/verification-request-page",
            queryObject
        );
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("verification-request/:dataHash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async verificationRequestReviewPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
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
                verificationRequest.content,
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
}
