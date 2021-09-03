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
} from "@nestjs/common";
import { PersonalityService } from "./personality.service";
import { SessionGuard } from "../auth/session.guard";

@Controller("api/personality")
export class PersonalityController {
    private readonly logger = new Logger("PersonalityController");
    constructor(private personalityService: PersonalityService) {}

    @Get()
    async listAll(@Query() query) {
        return this.personalityService.combinedListAll(query);
    }

    @UseGuards(SessionGuard)
    @Post()
    async create(@Body() body) {
        try {
            return this.personalityService.create(body);
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

    @Get(":id")
    async get(@Param() params, @Query() query) {
        return this.personalityService
            .getById(params.id, query.language)
            .catch((err) => {
                this.logger.error(err);
            });
    }

    @UseGuards(SessionGuard)
    @Put(":id")
    async update(@Param() params, @Body() body) {
        return this.personalityService.update(params.id, body).catch((err) => {
            this.logger.error(err);
        });
    }

    @UseGuards(SessionGuard)
    @Delete(":id")
    async delete(@Param() params) {
        try {
            await this.personalityService.delete(params.id);
            return { message: "Personality successfully deleted" };
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Get(":id/reviews")
    getReviewStats(@Param() params) {
        return this.personalityService
            .getReviewStats(params.id)
            .catch((err) => {
                this.logger.error(err);
            });
    }
}
