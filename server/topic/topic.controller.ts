import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { TopicService } from "./topic.service";
import { IsPublic } from "../auth/decorators/is-public.decorator";
import { ApiTags } from "@nestjs/swagger";

@Controller()
export class TopicController {
  constructor(private topicService: TopicService) {}

  @IsPublic()
  @ApiTags("topics")
  @Get("api/topics")
  public async getAll(@Query() getTopics) {
    return this.topicService.findAll(getTopics);
  }

  @ApiTags("topics")
  @Get("api/topics/search")
  async searchTopics(
    @Query("query") query: string,
    @Query("limit") limit: number = 10,
    @Query("language") language: string = "pt"
  ) {
    return this.topicService.searchTopics(query, language, limit);
  }

  @ApiTags("topics")
  @Post("api/topics")
  create(@Body() topicBody, @Req() req) {
    return this.topicService.create(
        topicBody,
        req.cookies.default_language
    );
  }
}
