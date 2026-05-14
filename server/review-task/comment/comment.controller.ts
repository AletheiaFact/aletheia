import { Body, Controller, Param, Patch, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comment.service";
import { FactCheckerOnly } from "../../auth/decorators/auth.decorator";
import {
    CreateCommentDTO,
    CreateReplyCommentDTO,
    UpdateCommentDTO,
    DeleteReplyDTO,
} from "./dto/create-comment.dto";

@Controller()
export class CommentController {
    constructor(private commentService: CommentService) {}

    @FactCheckerOnly()
    @ApiTags("comment")
    @Post("api/comment")
    create(@Body() body: CreateCommentDTO) {
        return this.commentService.create(body);
    }

    @FactCheckerOnly()
    @ApiTags("comment")
    @Patch("api/comment/bulk-update")
    updateMany(@Body() body: UpdateCommentDTO[]) {
        return this.commentService.updateManyComments(body);
    }

    @FactCheckerOnly()
    @ApiTags("comment")
    @Put("api/comment/:id")
    update(@Param("id") id: string, @Body() body: UpdateCommentDTO) {
        return this.commentService.update(id, body);
    }

    @FactCheckerOnly()
    @ApiTags("comment")
    @Put("api/comment/:id/create-reply")
    createReplyComment(
        @Param("id") id: string,
        @Body() body: CreateReplyCommentDTO
    ) {
        return this.commentService.createReplyComment(id, body);
    }

    @FactCheckerOnly()
    @ApiTags("comment")
    @Put("api/comment/:id/delete-reply")
    deleteReplyComment(@Param("id") id: string, @Body() body: DeleteReplyDTO) {
        return this.commentService.deleteReplyComment(id, body.replyCommentId);
    }
}
