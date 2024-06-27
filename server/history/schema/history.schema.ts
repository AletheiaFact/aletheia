import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "../../users/schemas/user.schema";

export type HistoryDocument = History & mongoose.Document;

export enum TargetModel {
    Claim = "Claim",
    Debate = "Debate",
    Personality = "Personality",
    ClaimReview = "ClaimReview",
    ReviewTask = "ReviewTask",
    Image = "Image",
    Source = "Source",
}

export enum HistoryType {
    Create = "create",
    Update = "update",
    Delete = "delete",
    Hide = "hide",
    Unhide = "unhide",
    Draft = "draft",
    Reported = "reported",
    Assigned = "assigned",
    Published = "published",
}

export type Details = {
    after: any;
    before: any;
};

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class History {
    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: "onModel",
    })
    targetId: mongoose.Types.ObjectId;

    @Prop({
        required: true,
    })
    targetModel: TargetModel;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    })
    user: User;

    @Prop({
        required: true,
    })
    type: HistoryType; //TODO: Validate if details field(after, before) it's optional or required based on type

    @Prop({
        type: Object,
        required: true,
    })
    details: Details;

    @Prop({
        type: Date,
        required: true,
    })
    date: mongoose.Date;
}

export const HistorySchema = SchemaFactory.createForClass(History);
