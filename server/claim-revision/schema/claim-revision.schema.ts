import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Claim } from "../../claim/schemas/claim.schema";
import { Personality } from "../../personality/schemas/personality.schema";

export type ClaimRevisionDocument = ClaimRevision & mongoose.Document;

export enum ContentModelEnum {
    Speech = "Speech",
}

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class ClaimRevision {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    slug: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "onModel",
    })
    contentId: mongoose.Types.ObjectId;

    @Prop({
        required: true,
        validate: {
            validator: (v) => {
                return Object.values(ContentModelEnum).includes(v);
            },
        },
        message: (tag) => `${tag} is not a valid claim type.`,
    })
    contentModel: ContentModelEnum;

    @Prop({ required: true })
    date: Date;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Claim",
    })
    claimId: Claim;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Personality",
    })
    personality: Personality;
}

const ClaimRevisionSchemaRaw = SchemaFactory.createForClass(ClaimRevision);

ClaimRevisionSchemaRaw.virtual("reviews", {
    ref: "ClaimReview",
    localField: "_id",
    foreignField: "claim",
});

ClaimRevisionSchemaRaw.virtual("content", {
    ref: () => Object.values(ContentModelEnum),
    localField: "contentId",
    foreignField: "_id",
});

ClaimRevisionSchemaRaw.pre("find", function () {
    this.populate("content");
});

export const ClaimRevisionSchema = ClaimRevisionSchemaRaw;
