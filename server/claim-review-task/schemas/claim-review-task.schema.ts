import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ReviewTaskMachineContext } from "../dto/create-claim-review-task.dto";

export type ClaimReviewTaskDocument = ClaimReviewTask & mongoose.Document;

@Schema({ toObject: {virtuals: true}, toJSON: {virtuals: true} })
export class ClaimReviewTask {
    @Prop({ required: true })
    state: string

    @Prop({ unique: true, required: true })
    sentence_hash: string;

    @Prop({ type: Object, required: true })
    context: ReviewTaskMachineContext;
}

export const ClaimReviewTaskSchema = SchemaFactory.createForClass(ClaimReviewTask);
