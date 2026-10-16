import { Controller, Get, Inject, Post, Req } from "@nestjs/common";
import type { ITopicService } from "../interfaces/topic.service.interface";
import { Public } from "../auth/decorators/auth.decorator";
import { ApiTags } from "@nestjs/swagger";
import { ZodBody, ZodQuery } from "../common/validation";
import {
    CreateTopicsDto,
    CreateTopicsSchema,
    GetTopicsQueryDto,
    GetTopicsQuerySchema,
    SearchTopicsQueryDto,
    SearchTopicsQuerySchema,
} from "./dto/topic.dto";

@Controller()
export class TopicController {
    constructor(
        @Inject("TopicService") private readonly topicService: ITopicService
    ) {}

    @Public()
    @ApiTags("topics")
    @Get("api/topics")
    public async getAll(
        @ZodQuery(GetTopicsQuerySchema) getTopics: GetTopicsQueryDto
    ) {
        return this.topicService.findAll(getTopics);
    }

    @Public()
    @ApiTags("topics")
    @Get("api/topics/impact-areas")
    getImpactAreas() {
        return this.topicService.getImpactAreas();
    }

    @ApiTags("topics")
    @Get("api/topics/search")
    async searchTopics(
        @ZodQuery(SearchTopicsQuerySchema)
        { query, language, limit }: SearchTopicsQueryDto
    ) {
        return this.topicService.searchTopics(query, language, limit);
    }

    @ApiTags("topics")
    @Post("api/topics")
    create(
        @ZodBody(CreateTopicsSchema) topicBody: CreateTopicsDto,
        @Req() req: any
    ) {
        return this.topicService.create(
            topicBody,
            req.cookies.default_language
        );
    }
}
