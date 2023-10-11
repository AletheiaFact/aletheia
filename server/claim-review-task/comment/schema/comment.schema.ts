import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../../../users/schemas/user.schema";

export type CommentDocument = Comment & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class Comment {
    @Prop({ type: Number, required: true })
    from: number;

    @Prop({ type: Number, required: true })
    to: number;

    @Prop({ required: true })
    comment: string;

    @Prop({ required: true })
    text: string;

    @Prop({ required: true, default: Date.now() })
    createdAt: number;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    })
    user: User;

    //TODO: targetId
    //TODO: Resolved ?
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
