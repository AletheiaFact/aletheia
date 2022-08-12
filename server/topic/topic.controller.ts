import {
    Body,
    Controller,
    Get,
    Logger,
    Param,
    Post,
    Query,
} from "@nestjs/common";
import { TopicService } from "./topic.service";

@Controller()
export class TopicController {
    private readonly logger = new Logger("");
    constructor(private topicService: TopicService) {}

    @Post("api/topics")
    async create(@Body() topics) {
        console.log("first");
        return this.topicService.create(topics);
    }
}
