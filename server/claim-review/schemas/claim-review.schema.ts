import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Personality } from "../../personality/schemas/personality.schema";
import * as mongoose from "mongoose";
import { User } from "../../users/schemas/user.schema";
import { Claim } from "../../claim/schemas/claim.schema";
import { softDeletePlugin } from 'mongoose-softdelete-typescript';

export type ClaimReviewDocument = ClaimReview & mongoose.Document;

export enum ClassificationEnum {
    "not-fact",
    "true",
    "true-but",
    "arguable",
    "misleading",
    "false",
    "unsustainable",
    "exaggerated",
    "unverifiable",
};
@Schema({ toObject: {virtuals: true}, toJSON: {virtuals: true} })
export class ClaimReview {
    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "ClaimRevision",
    })
    claim: Claim;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Personality",
    })
    personality: Personality;

    @Prop({ required: true })
    sentence_hash: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    })
    userId: User;

    @Prop({ required: true })
    summary: string;
    
    @Prop({ required: true })
    questions: string[];

    @Prop({ required: true })
    report: string;

    @Prop({ required: true })
    verification: string;

    @Prop({ required: true })
    source: string[];

    @Prop({
        required: true,
        validate: {
            validator: (v) => {
                return (
                    [
                        "not-fact",
                        "true",
                        "true-but",
                        "arguable",
                        "misleading",
                        "false",
                        "unsustainable",
                        "exaggerated",
                        "unverifiable",
                    ].indexOf(v) !== -1
                );
            },
        },
        message: (tag) => `${tag} is not a valid classification.`,
    })
    classification: string;

    @Prop({ required: true })
    isPublished: boolean;
}

const ClaimReviewSchemaRaw = SchemaFactory.createForClass(ClaimReview);

ClaimReviewSchemaRaw.virtual('sources', {
    ref: 'Source',
    localField: '_id',
    foreignField: 'targetId'
});

ClaimReviewSchemaRaw.plugin(softDeletePlugin)

export const ClaimReviewSchema = ClaimReviewSchemaRaw;
