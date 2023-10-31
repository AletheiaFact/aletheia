import {
    Body,
    Controller,
    Delete,
    Get,
    Header,
    Logger,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { parse } from "url";
import type { Request, Response } from "express";
import { ViewService } from "../view/view.service";
import { PersonalityService } from "./personality.service";
import { GetPersonalities } from "./dto/get-personalities.dto";
import { CreatePersonalityDTO } from "./dto/create-personality.dto";
import { IsPublic } from "../auth/decorators/is-public.decorator";
import { TargetModel } from "../history/schema/history.schema";
import type { BaseRequest } from "../types";
import { ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { CaptchaService } from "../captcha/captcha.service";
import { HistoryService } from "../history/history.service";
import {
    AdminUserAbility,
    CheckAbilities,
} from "../auth/ability/ability.decorator";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";

@Controller(":namespace?")
export class PersonalityController {
    private readonly logger = new Logger("PersonalityController");
    constructor(
        private personalityService: PersonalityService,
        private viewService: ViewService,
        private configService: ConfigService,
        private captchaService: CaptchaService,
        private historyService: HistoryService
    ) {}

    @IsPublic()
    @ApiTags("personality")
    @Get("api/personality")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    async listAll(@Query() getPersonalities: GetPersonalities) {
        return this.personalityService.combinedListAll(getPersonalities);
    }

    @ApiTags("personality")
    @Post("api/personality")
    async create(@Body() createPersonality: CreatePersonalityDTO) {
        try {
            return await this.personalityService.create(createPersonality);
        } catch (error) {
            if (
                error.name === "MongoError" &&
                error.keyPattern &&
                error.keyPattern.wikidata
            ) {
                error.message = `Personality with wikidata id ${error.keyValue.wikidata} already exists`;
            }
            this.logger.error(error);
        }
    }

    @IsPublic()
    @ApiTags("personality")
    @Get("api/personality/:id")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    async get(@Param("id") personalityId, @Query() query) {
        return this.personalityService
            .getById(personalityId, query.language) // TODO: get language from request object in the future
            .catch((err) => {
                this.logger.error(err);
            });
    }

    @ApiTags("personality")
    @Put("api/personality/:id")
    async update(@Param("id") personalityId, @Body() body) {
        return this.personalityService.update(personalityId, body);
    }

    @ApiTags("personality")
    @Put("api/personality/hidden/:id")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async updateHiddenStatus(@Param("id") personalityId, @Body() body) {
        const validateCaptcha = await this.captchaService.validate(
            body.recaptcha
        );
        if (!validateCaptcha) {
            throw new Error("Error validating captcha");
        }

        return this.personalityService.hideOrUnhidePersonality(
            personalityId,
            body.isHidden,
            body.description
        );
    }

    @ApiTags("personality")
    @Delete("api/personality/:id")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async delete(@Param("id") personalityId) {
        return this.personalityService.delete(personalityId).catch((err) => {
            this.logger.error(err);
        });
    }

    @IsPublic()
    @ApiTags("personality")
    @Get("api/personality/:id/reviews")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    getReviewStats(@Param("id") personalityId) {
        return this.personalityService
            .getReviewStats(personalityId)
            .catch((err) => {
                this.logger.error(err);
            });
    }

    @ApiTags("pages")
    @Get("personality/search")
    public async personalityCreateSearch(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore

        await this.viewService.getNextServer().render(
            req,
            res,
            "/personality-create-search",
            Object.assign(parsedUrl.query, {
                nameSpace: req.params.namespace,
            })
        );
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("personality/:slug")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async personalityPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const hideDescriptions: any = {};
        const parsedUrl = parse(req.url, true);

        const personality =
            await this.personalityService.getClaimsByPersonalitySlug(
                {
                    slug: req.params.slug,
                    isDeleted: false,
                },
                req.language
            );

        const { personalities } = await this.personalityService.combinedListAll(
            {
                language: req.language,
                order: "random",
                pageSize: 6,
                fetchOnly: true,
                filter: personality._id,
            }
        );

        hideDescriptions[TargetModel.Personality] =
            await this.historyService.getDescriptionForHide(
                personality,
                TargetModel.Personality
            );

        await this.viewService.getNextServer().render(
            req,
            res,
            "/personality-page",
            Object.assign(parsedUrl.query, {
                personality,
                personalities,
                hideDescriptions,
                nameSpace: req.params.namespace,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
            })
        );
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("personality")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async personalityList(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        await this.viewService.getNextServer().render(
            req,
            res,
            "/personality-list",
            Object.assign(parsedUrl.query, {
                nameSpace: req.params.namespace,
            })
        );
    }

    @ApiTags("pages")
    @Get("personality/:slug/history")
    public async personalityHistoryPage(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);

        const personality =
            await this.personalityService.getClaimsByPersonalitySlug({
                slug: req.params.slug,
                isDeleted: false,
            });

        await this.viewService.getNextServer().render(
            req,
            res,
            "/history-page",
            Object.assign(parsedUrl.query, {
                targetId: personality._id,
                targetModel: TargetModel.Personality,
                nameSpace: req.params.namespace,
            })
        );
    }
}
