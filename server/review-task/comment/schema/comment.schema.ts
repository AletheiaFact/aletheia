import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../../../users/schemas/user.schema";

export type CommentDocument = Comment & mongoose.Document;

export enum CommentEnum {
    crossChecking = "cross-checking",
    review = "review",
}

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true }, timestamps: true })
export class Comment {
    @Prop({ type: Number })
    from: number;

    @Prop({ type: Number })
    to: number;

    @Prop({ required: true })
    comment: string;

    @Prop({ required: true })
    text: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    })
    user: User;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: "onModel",
    })
    targetId: mongoose.Types.ObjectId;

    @Prop({ required: true, default: false })
    resolved: boolean;

    @Prop({ required: true, default: [] })
    replies: Comment[];

    @Prop({ required: true, default: false })
    isReply: boolean;

    @Prop({ required: true, default: CommentEnum.review })
    type: CommentEnum;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
