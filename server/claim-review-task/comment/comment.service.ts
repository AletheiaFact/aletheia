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

    async create(body) {
        body.user = Types.ObjectId(body.user);
        return await new this.CommentModel(body).save();
    }

    async updateManyComments(comments) {
        await comments.forEach((comment) => this.update(comment));
        return comments;
    }

    async update(newComment) {
        const comment = await this.CommentModel.findById(newComment._id);
        newComment.user = Types.ObjectId(newComment.user);
        return this.CommentModel.updateOne({ _id: comment._id }, newComment);
    }
}
