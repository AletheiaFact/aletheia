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
} from "@nestjs/common";
import { ClaimCollectionService } from "./claim-collection.service";
import { CreateClaimCollectionDto } from "./dto/create-claim-collection.dto";
import { UpdateClaimCollectionDto } from "./dto/update-claim-collection.dto";
import { CaptchaService } from "../captcha/captcha.service";
import { IsPublic } from "../decorators/is-public.decorator";
import { parse } from "url";
import { Response } from "express";
import { ViewService } from "../view/view.service";
import { PersonalityService } from "../personality/personality.service";
import { BaseRequest } from "../types";

@Controller()
export class ClaimCollectionController {
    constructor(
        private claimCollectionService: ClaimCollectionService,
        private personalityService: PersonalityService,
        private captchaService: CaptchaService,
        private viewService: ViewService
    ) {}

    @IsPublic()
    @Get("api/claim-collection")
    public async getClaimCollectionList(
        @Query() getClaimCollectionListDTO: any
    ) {
        const {
            page = 0,
            pageSize = 10,
            order = 1,
            value,
        } = getClaimCollectionListDTO;
        return Promise.all([
            this.claimCollectionService.listAll(page, pageSize, order, value),
            this.claimCollectionService.count(),
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

    @Get("api/claim-collection/:id")
    async getById(@Param("id") id: string) {
        return this.claimCollectionService.getById(id);
    }

    @Post("api/claim-collection")
    async create(@Body() createClaimCollection: CreateClaimCollectionDto) {
        // const validateCaptcha = await this.captchaService.validate(
        //     createClaimCollection.recaptcha
        // );
        // if (!validateCaptcha) {
        //     throw new Error("Error validating captcha");
        // }
        return this.claimCollectionService.create(createClaimCollection);
    }

    @Put("api/claim-collection/:id")
    async autoSaveDraft(
        @Param("id") claimCollectionId,
        @Body() claimCollectionBody: UpdateClaimCollectionDto
    ) {
        // const history = false;
        return this.claimCollectionService.update(
            claimCollectionId,
            claimCollectionBody
            // history
        );
    }

    @Get("claim-collection/:id")
    public async claimCollection(
        @Param("id") claimCollectionId,
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);

        const claimCollection = (
            await this.claimCollectionService.getById(claimCollectionId)
        ).toObject();

        claimCollection.personalities = await Promise.all(
            claimCollection.personalities.map(async (p) => {
                console.log(p);
                return await this.personalityService.postProcess(
                    p,
                    req.language
                );
            })
        );

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/claim-collection-view",
                Object.assign(parsedUrl.query, { claimCollection })
            );
    }

    @Get("claim-collection/:id/edit")
    public async claimCollectionEdit(
        @Param("id") claimCollectionId,
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);

        const claimCollection: any = (
            await this.claimCollectionService.getById(claimCollectionId)
        ).toObject();

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/claim-collection-editor",
                Object.assign(parsedUrl.query, { claimCollection })
            );
    }
}
