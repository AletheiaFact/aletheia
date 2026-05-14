import { Injectable, NotFoundException } from "@nestjs/common";
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

    async create(comment: any) {
        comment.user = new Types.ObjectId(comment.user);
        const [user, newComment] = await Promise.all([
            this.usersService.getById(comment.user),
            new this.CommentModel(comment).save(),
        ]);

        return {
            ...newComment.toObject(),
            user,
        };
    }

    async updateManyComments(comments: any[]) {
        await Promise.all(
            comments.map((comment) => this.update(comment?._id, comment))
        );
    }

    async update(id: string, body: any) {
        const { comment, text, resolved, type, user } = body;
        const update = {
            comment,
            text,
            resolved,
            type,
            ...(user && {
                user: new Types.ObjectId(
                    typeof user === "string" ? user : user._id
                ),
            }),
        };

        const updated = await this.CommentModel
            .findByIdAndUpdate(id, update, { new: true })
            .populate("user", "name");

        if (!updated) {
            throw new NotFoundException(`Comment not found: ${id}`);
        }

        return updated.toObject();
    }

    async createReplyComment(id: string, commentBody: any) {
        const existingComment = await this.CommentModel.findById(id);
        if (!existingComment) {
            throw new NotFoundException(`Comment not found: ${id}`);
        }
        const newComment = await this.create({
            ...commentBody,
            targetId: existingComment._id,
            isReply: true,
        });

        existingComment.replies.push(newComment._id as Types.ObjectId);
        await existingComment.save();

        return newComment;
    }

    async deleteReplyComment(id: string, replyId: string) {
        const comment = await this.CommentModel.findById(id);
        if (!comment) {
            throw new NotFoundException(`Comment not found: ${id}`);
        }

        const replies = comment.replies.filter((reply: any) => {
            return !new Types.ObjectId(reply?._id).equals(replyId);
        });

        await this.CommentModel.updateOne(
            { _id: comment._id },
            { $set: { replies } }
        );

        return { ...comment.toObject(), replies };
    }
}
