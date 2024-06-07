import {
    Body,
    Controller,
    Get,
    Header,
    Logger,
    Param,
    Post,
    Query,
    Req,
    Res,
} from "@nestjs/common";
import { SourceService } from "./source.service";
import { ApiTags } from "@nestjs/swagger";
import type { BaseRequest } from "../types";
import { parse } from "url";
import { ViewService } from "../view/view.service";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";
import { IsPublic } from "../auth/decorators/is-public.decorator";
import { CreateSourceDTO } from "./dto/create-source.dto";
import { CaptchaService } from "../captcha/captcha.service";

@Controller(":namespace?")
export class SourceController {
    private readonly logger = new Logger("SourceController");
    constructor(
        private sourceService: SourceService,
        private viewService: ViewService,
        private configService: ConfigService,
        private captchaService: CaptchaService
    ) {}

    @ApiTags("source")
    @Get("api/source/:targetId")
    public async getSourcesClaim(@Param() params, @Query() getSources: any) {
        const { targetId } = params;
        const { page, order } = getSources;
        const pageSize = parseInt(getSources.pageSize, 10);
        return this.sourceService
            .getByTargetId(targetId, page, pageSize, order)
            .then((sources) => {
                const totalSources = sources.length;
                const totalPages = Math.ceil(totalSources / pageSize);
                this.logger.log(
                    `Found ${totalSources} sources for targetId ${targetId}. Page ${page} of ${totalPages}`
                );
                return { sources, totalSources, totalPages, page, pageSize };
            })
            .catch();
    }

    @ApiTags("source")
    @Post("api/source")
    async create(@Body() createSourceDTO: CreateSourceDTO) {
        const validateCaptcha = await this.captchaService.validate(
            createSourceDTO.recaptcha
        );
        if (!validateCaptcha) {
            throw new Error("Error validating captcha");
        }

        return this.sourceService.create(createSourceDTO);
    }

    @ApiTags("pages")
    @Get("sources/create")
    public async sourceCreatePage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);

        await this.viewService.getNextServer().render(
            req,
            res,
            "/sources-create",
            Object.assign(parsedUrl.query, {
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
                nameSpace: req.params.namespace,
            })
        );
    }

    @IsPublic()
    @ApiTags("source")
    @Get("api/source")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    async listAll(@Query() query) {
        return Promise.all([
            this.sourceService.listAll(query),
            this.sourceService.count({ nameSpace: query.nameSpace }),
        ]).then(([sources, totalSources]) => {
            const totalPages = Math.ceil(totalSources / query.pageSize);

            this.logger.log(
                `Found ${totalSources} sources. Page ${query.page} of ${totalPages}`
            );

            return {
                sources,
                totalSources,
                totalPages,
                page: query.page,
                pageSize: query.pageSize,
            };
        });
    }

    @ApiTags("pages")
    @Get("sources")
    public async sourcesPage(@Req() req: BaseRequest, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        await this.viewService.getNextServer().render(
            req,
            res,
            "/sources-page",
            Object.assign(parsedUrl.query, {
                nameSpace: req.params.namespace,
            })
        );
    }
}
