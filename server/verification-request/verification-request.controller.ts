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
import type { BaseRequest } from "types";
import { parse } from "url";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
import { ConfigService } from "@nestjs/config";
import { ViewService } from "../view/view.service";
import { Response } from "express";
import { ClaimReviewTaskService } from "../claim-review-task/claim-review-task.service";
import { CreateVerificationRequestDTO } from "./dto/create-verification-request-dto";
import { UpdateVerificationRequestDTO } from "./dto/update-verification-request.dto";

@Controller(":namespace?")
export class VerificationRequestController {
    constructor(
        private verificationRequestService: VerificationRequestService,
        private configService: ConfigService,
        private viewService: ViewService,
        private claimReviewTaskService: ClaimReviewTaskService
    ) {}

    @ApiTags("verification-request")
    @Get("api/verification-request")
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
    create(@Body() verificationRequestBody: CreateVerificationRequestDTO) {
        return this.verificationRequestService.create(verificationRequestBody);
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

    @ApiTags("verification-request")
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

        const claimReviewTask =
            await this.claimReviewTaskService.getClaimReviewTaskByDataHashWithUsernames(
                dataHash
            );

        await this.viewService.getNextServer().render(
            req,
            res,
            "/verification-request-page",
            Object.assign(parsedUrl.query, {
                claimReviewTask,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
                hideDescriptions: {},
                websocketUrl: this.configService.get<string>("websocketUrl"),
                nameSpace: req.params.namespace,
                verificationRequest,
            })
        );
    }
}
