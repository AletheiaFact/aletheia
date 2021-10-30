import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Claim } from "../../claim/schemas/claim.schema";
import { Personality } from "../../personality/schemas/personality.schema";
import * as mongoose from "mongoose";
import { User } from "../../users/schemas/user.schema";
import { Source } from "../../source/schemas/source.schema";

export type ClaimReviewDocument = ClaimReview & mongoose.Document;

@Schema()
export class ClaimReview {
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

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Claim",
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

    @Prop({ required: true })
    sentence_content: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    })
    user: User;

    // TODO: revision_id
}

const ClaimReviewSchemaRaw = SchemaFactory.createForClass(ClaimReview);

ClaimReviewSchemaRaw.virtual('sources', {
    ref: 'Source',
    localField: '_id',
    foreignField: 'targetId'
});

export const ClaimReviewSchema = ClaimReviewSchemaRaw;
