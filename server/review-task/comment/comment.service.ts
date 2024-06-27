import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument } from "./schema/comment.schema";
import { UsersService } from "../../users/users.service";

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name)
        private CommentModel: Model<CommentDocument>,
        private usersService: UsersService
    ) {}

    async create(comment) {
        comment.user = Types.ObjectId(comment.user);
        const [user, newComment] = await Promise.all([
            this.usersService.getById(comment.user),
            new this.CommentModel(comment).save(),
        ]);

        return {
            ...newComment.toObject(),
            user,
        };
    }

    async updateManyComments(comments) {
        return await comments.forEach((comment) =>
            this.update(comment?._id, comment)
        );
    }

    async update(id, comment) {
        const existingComment = await this.CommentModel.findById(id);
        const user = await this.usersService.getById(
            comment.user || existingComment.user
        );
        const replies = comment.replies
            ? comment?.replies?.map((reply) => Types.ObjectId(reply?._id))
            : existingComment.replies;

        const updatedComment = await this.CommentModel.findByIdAndUpdate(
            id,
            {
                ...existingComment.toObject(),
                ...comment,
                replies,
                user: user._id,
            },
            { new: true }
        );

        return {
            ...updatedComment,
            user,
        };
    }

    async createReplyComment(id, commentBody) {
        const existingComment = await this.CommentModel.findById(id);
        const newComment = await this.create({
            ...commentBody,
            targetId: existingComment._id,
        });

        existingComment.replies.push(newComment._id);

        await this.CommentModel.updateOne(
            { _id: existingComment._id },
            existingComment
        );

        return newComment;
    }

    async deleteReplyComment(id, replyId) {
        const comment = await this.CommentModel.findById(id);

        const replies = comment.replies.filter((reply) => {
            //@ts-ignore
            return !Types.ObjectId(reply?._id).equals(replyId);
        });

        await this.CommentModel.updateOne(
            { _id: comment._id },
            { $set: { replies } }
        );

        return { ...comment.toObject(), replies };
    }
}
