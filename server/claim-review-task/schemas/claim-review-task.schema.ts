import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Machine } from "../dto/create-claim-review-task.dto";

export type ClaimReviewTaskDocument = ClaimReviewTask & mongoose.Document;

@Schema({ toObject: {virtuals: true}, toJSON: {virtuals: true} })
export class ClaimReviewTask {
    @Prop({ type: Object, required: true })
    machine: Machine;

    @Prop({ unique: true, required: true })
    sentence_hash: string;
}

export const ClaimReviewTaskSchema = SchemaFactory.createForClass(ClaimReviewTask);
