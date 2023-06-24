import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { TopicService } from "./topic.service";
import { IsPublic } from "../auth/decorators/is-public.decorator";

@Controller()
export class TopicController {
    constructor(private topicService: TopicService) {}

    @IsPublic()
    @Get("api/topics")
    public async getAll(@Query() getTopics) {
        return this.topicService.findAll(getTopics);
    }

    @Post("api/topics")
    create(@Body() topicBody, @Req() req) {
        return this.topicService.create(
            topicBody,
            req.cookies.default_language
        );
    }
}
