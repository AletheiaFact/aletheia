import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../../users/schemas/user.schema";

export type ClaimReviewTaskDocument = ClaimReviewTask & mongoose.Document;

@Schema({ toObject: {virtuals: true}, toJSON: {virtuals: true} })
export class ClaimReviewTask {
    @Prop({ required: true })
    userId: User;

    @Prop({ required: true })
    sentence_hash: string;
}

const ClaimReviewTaskSchemaRaw = SchemaFactory.createForClass(ClaimReviewTask);

ClaimReviewTaskSchemaRaw.virtual('user', {
    ref: 'User',
    localField: '_id',
    foreignField: 'userId'
});

export const ClaimReviewTaskSchema = ClaimReviewTaskSchemaRaw;
