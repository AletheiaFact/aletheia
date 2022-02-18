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
    UseGuards,
    Req,
    Res
} from "@nestjs/common";
import { parse } from "url";
import { Request, Response } from "express";
import { ViewService } from "../view/view.service";
import { PersonalityService } from "./personality.service";
import { SessionGuard } from "../auth/session.guard";
import { GetPersonalities } from "./dto/get-personalities.dto";
import { CreatePersonality } from "./dto/create-personality.dto";

@Controller()
export class PersonalityController {
    private readonly logger = new Logger("PersonalityController");
    constructor(
        private personalityService: PersonalityService,
        private viewService: ViewService
    ) {}

    @Get("api/personality")
    async listAll(@Query() getPersonalities: GetPersonalities) {
        return this.personalityService.combinedListAll(getPersonalities);
    }

    @UseGuards(SessionGuard)
    @Post("api/personality")
    async create(@Body() createPersonality: CreatePersonality) {
        try {
            return this.personalityService.create(createPersonality);
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

    @Get("api/personality/:id")
    async get(@Param() params, @Query() query) {
        return this.personalityService
            .getById(params.id, query.language) // TODO: get language for request object in the future
            .catch((err) => {
                this.logger.error(err);
            });
    }

    @UseGuards(SessionGuard)
    @Put("api/personality/:id")
    async update(@Param() params, @Body() body) {
        return this.personalityService.update(params.id, body).catch((err) => {
            this.logger.error(err);
        });
    }

    @UseGuards(SessionGuard)
    @Delete("api/personality/:id")
    async delete(@Param() params) {
        try {
            await this.personalityService.delete(params.id);
            return { message: "Personality successfully deleted" };
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Get("api/personality/:id/reviews")
    getReviewStats(@Param() params) {
        return this.personalityService
            .getReviewStats(params.id)
            .catch((err) => {
                this.logger.error(err);
            });
    }

    @UseGuards(SessionGuard)
    @Get("personality/search")
    public async personalityCreateSearch(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/personality-create-search",
                Object.assign(parsedUrl.query)
            );
    }

    @Get("personality/:slug")
    public async personalityPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

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

    @Get("personality")
    public async personalityList(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/personality-list",
                Object.assign(parsedUrl.query, {})
            );
    }
}
