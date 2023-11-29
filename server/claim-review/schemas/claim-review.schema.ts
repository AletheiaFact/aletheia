import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Personality } from "../../personality/schemas/personality.schema";
import * as mongoose from "mongoose";
import { Claim } from "../../claim/schemas/claim.schema";
import { softDeletePlugin } from "mongoose-softdelete-typescript";
import type { ReportDocument } from "../../report/schemas/report.schema";
import { User } from "../../users/schemas/user.schema";

export type ClaimReviewDocument = ClaimReview & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class ClaimReview {
    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Claim",
    })
    claim: Claim;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "Personality",
    })
    personality: Personality;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    })
    usersId: User[];

    @Prop({ required: true })
    data_hash: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Report",
    })
    report: ReportDocument;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    isPublished: boolean;

    @Prop({ type: Boolean, default: false, required: true })
    isHidden: boolean;

    @Prop({ type: Boolean, default: false, required: true })
    isPartialReview: boolean;
}

const ClaimReviewSchemaRaw = SchemaFactory.createForClass(ClaimReview);

ClaimReviewSchemaRaw.pre("find", function () {
    this.populate("report");
});

ClaimReviewSchemaRaw.virtual("sources", {
    ref: "Source",
    localField: "_id",
    foreignField: "targetId",
});

ClaimReviewSchemaRaw.plugin(softDeletePlugin);

export const ClaimReviewSchema = ClaimReviewSchemaRaw;
