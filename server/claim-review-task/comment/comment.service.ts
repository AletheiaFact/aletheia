import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument } from "./schema/comment.schema";

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name)
        private CommentModel: Model<CommentDocument>
    ) {}

    async create(comment) {
        comment.user = Types.ObjectId(comment.user);
        return await new this.CommentModel(comment).save();
    }

    async updateManyComments(comments) {
        await comments.forEach((comment) => this.update(comment?._id, comment));
        return comments;
    }

    async update(id, comment) {
        const existingComment = await this.CommentModel.findById(id);
        const newComment = {
            ...existingComment.toObject(),
            ...comment,
            user: Types.ObjectId(comment.user || existingComment.user),
        };
        return this.CommentModel.updateOne(
            { _id: existingComment._id },
            newComment
        );
    }
}
