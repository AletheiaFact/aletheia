import {
    Body,
    Controller,
    Param,
    Patch,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comment.service";
import {
    CheckAbilities,
    FactCheckerUserAbility,
} from "../../auth/ability/ability.decorator";
import { AbilitiesGuard } from "../../auth/ability/abilities.guard";

@Controller()
export class CommentController {
    constructor(private commentService: CommentService) {}

    @ApiTags("comment")
    @Post("api/comment")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new FactCheckerUserAbility())
    create(@Body() body) {
        return this.commentService.create(body);
    }

    @ApiTags("comment")
    @Patch("api/comment/bulk-update")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new FactCheckerUserAbility())
    updateMany(@Body() body) {
        return this.commentService.updateManyComments(body);
    }

    @ApiTags("comment")
    @Put("api/comment/:id")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new FactCheckerUserAbility())
    update(@Param("id") id, @Body() body) {
        return this.commentService.update(id, body);
    }

    @ApiTags("comment")
    @Put("api/comment/:id/create-reply")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new FactCheckerUserAbility())
    createReplyComment(@Param("id") id, @Body() body) {
        return this.commentService.createReplyComment(id, body);
    }

    @ApiTags("comment")
    @Put("api/comment/:id/delete-reply")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new FactCheckerUserAbility())
    deleteReplyComment(@Param("id") id, @Body() body) {
        return this.commentService.deleteReplyComment(id, body.replyCommentId);
    }
}
