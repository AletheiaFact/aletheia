import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Claim } from "../../claim/schemas/claim.schema";
import { ReviewTask } from "../../review-task/schemas/review-task.schema";

export type StateEventDocument = StateEvent & mongoose.Document;

export enum TypeModel {
    Claim = "claim",
    Assigned = "assigned",
    Reported = "reported",
    Published = "published",
}

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class StateEvent {
    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: "Claim",
    })
    claimId: Claim;

    @Prop({
        required: true,
    })
    type: TypeModel;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "ReviewTask",
    })
    taskId: ReviewTask;

    @Prop({
        type: Boolean,
        required: true,
    })
    draft: boolean;

    @Prop({
        type: Date,
        required: true,
    })
    date: mongoose.Date;
}

export const StateEventSchema = SchemaFactory.createForClass(StateEvent);
