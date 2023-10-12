import { Body, Controller, Param, Patch, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comment.service";

@Controller()
export class CommentController {
    constructor(private commentService: CommentService) {}

    @ApiTags("comment")
    @Post("api/comment")
    create(@Body() body) {
        return this.commentService.create(body);
    }

    @ApiTags("comment")
    @Patch("api/comment/bulk-update")
    updateMany(@Body() body) {
        return this.commentService.updateManyComments(body);
    }

    //TODO: Add check ability for reviewers
    @ApiTags("comment")
    @Put("api/comment/:id")
    update(@Param("id") id, @Body() body) {
        return this.commentService.update(id, body);
    }
}
