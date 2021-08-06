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
        const { page = 0, pageSize = 10, order = "asc" } = query;
        const queryInputs = await this.verifyInputsQuery(query);

        return Promise.all([
            this.personalityService.listAll(
                page,
                parseInt(pageSize, 10),
                order,
                queryInputs,
                query.language,
                query.withSuggestions
            ),
            this.personalityService.count(queryInputs),
        ])
            .then(([personalities, totalPersonalities]) => {
                const totalPages = Math.ceil(
                    totalPersonalities / parseInt(pageSize, 10)
                );

                this.logger.log(
                    `Found ${totalPersonalities} personalities. Page ${page} of ${totalPages}`
                );

                return {
                    personalities,
                    totalPersonalities,
                    totalPages,
                    page,
                    pageSize,
                };
            })
            .catch((error) => this.logger.error(error));
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

    verifyInputsQuery(query) {
        const queryInputs = {};
        if (query.name) {
            // @ts-ignore
            queryInputs.name = { $regex: query.name, $options: "i" };
        }
        return queryInputs;
    }
}
