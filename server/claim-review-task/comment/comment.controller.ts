import { Body, Controller, Patch, Post } from "@nestjs/common";
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
}
