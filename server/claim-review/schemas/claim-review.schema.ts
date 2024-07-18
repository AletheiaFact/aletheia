import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Personality } from "../../personality/schemas/personality.schema";
import * as mongoose from "mongoose";
import { Claim } from "../../claim/schemas/claim.schema";
import { softDeletePlugin } from "mongoose-softdelete-typescript";
import type { ReportDocument } from "../../report/schemas/report.schema";
import { User } from "../../users/schemas/user.schema";
import { ReportModelEnum } from "../../types/enums";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";
import { Source } from "../../source/schemas/source.schema";

export type ClaimReviewDocument = ClaimReview & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class ClaimReview {
    @Prop({
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "Personality",
    })
    personality: Personality;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "Source",
    })
    target: mongoose.Types.ObjectId;

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

    @Prop({
        required: true,
        validate: {
            validator: (v) => {
                return Object.values(ReportModelEnum).includes(v);
            },
        },
        message: (tag) => `${tag} is not a valid report type.`,
    })
    reportModel: ReportModelEnum;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    isPublished: boolean;

    @Prop({ type: Boolean, default: false, required: true })
    isHidden: boolean;

    @Prop({ type: Boolean, default: false, required: true })
    isPartialReview: boolean;

    @Prop({ default: NameSpaceEnum.Main, required: true })
    nameSpace: string;

    @Prop({ required: true, type: String })
    targetModel: string;
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
