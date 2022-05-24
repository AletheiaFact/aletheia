import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res
} from "@nestjs/common";
import { parse } from "url";
import { Request, Response } from "express";
import { ViewService } from "../view/view.service";
import { PersonalityService } from "./personality.service";
import { GetPersonalities } from "./dto/get-personalities.dto";
import { CreatePersonality } from "./dto/create-personality.dto";
import {IsPublic} from "../decorators/is-public.decorator";

@Controller()
export class PersonalityController {
    private readonly logger = new Logger("PersonalityController");
    constructor(
        private personalityService: PersonalityService,
        private viewService: ViewService
    ) {}

    @IsPublic()
    @Get("api/personality")
    async listAll(@Query() getPersonalities: GetPersonalities) {
        return this.personalityService.combinedListAll(getPersonalities);
    }

    @Post("api/personality")
    async create(@Body() createPersonality: CreatePersonality) {
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
    @Get("api/personality/:id")
    async get(@Param("id") personalityId, @Query() query) {
        return this.personalityService
            .getById(personalityId, query.language) // TODO: get language from request object in the future
            .catch((err) => {
                this.logger.error(err);
            });
    }

    @Put("api/personality/:id")
    async update(@Param("id") personalityId, @Body() body) {
        return this.personalityService.update(personalityId, body)
    }

    @Delete("api/personality/:id")
    async delete(@Param("id") personalityId) {
        try {
            await this.personalityService.delete(personalityId);
            return { message: "Personality successfully deleted" };
        } catch (error) {
            this.logger.error(error);
        }
    }

    @IsPublic()
    @Get("api/personality/:id/reviews")
    getReviewStats(@Param("id") personalityId) {
        return this.personalityService
            .getReviewStats(personalityId)
            .catch((err) => {
                this.logger.error(err);
            });
    }

    @Get("personality/search")
    public async personalityCreateSearch(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/personality-create-search",
                Object.assign(parsedUrl.query)
            );
    }

    @IsPublic()
    @Get("personality/:slug")
    public async personalityPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore

        const personality = await this.personalityService.getBySlug(
            req.params.slug,
            // @ts-ignore
            req.language
        );
        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/personality-page",
                Object.assign(parsedUrl.query, { personality })
            );
    }

    @IsPublic()
    @Get("personality")
    public async personalityList(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/personality-list",
                Object.assign(parsedUrl.query, {})
            );
    }

    @Get("personality/:slug/history")
    public async personalityHistoryPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        const personality = await this.personalityService.getBySlug(
            req.params.slug
        );
        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/history-page",
                Object.assign(parsedUrl.query, { targetId: personality._id, targetModel: "personality" })
            );
    }

}
