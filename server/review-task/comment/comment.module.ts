import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "./schema/comment.schema";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { UsersModule } from "../../users/users.module";

export const CommentModel = MongooseModule.forFeature([
    {
        name: Comment.name,
        schema: CommentSchema,
    },
]);

@Module({
    imports: [CommentModel, UsersModule],
    providers: [CommentService],
    exports: [CommentService],
    controllers: [CommentController],
})
export class CommentModule {}
