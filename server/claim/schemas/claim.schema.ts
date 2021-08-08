import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Personality } from "../../personality/schemas/personality.schema";
import { ClaimReview } from "../../claim-review/schemas/claim-review.schema";
import { Source } from "../../source/schemas/source.schema";

export type ClaimDocument = Claim & mongoose.Document;

@Schema()
export class Claim {
    @Prop({ required: true })
    title: string;

    @Prop({ type: Object, required: true })
    content: object;

    @Prop({
        required: true,
        validate: {
            validator: (v) => {
                return ["speech", "twitter"].indexOf(v) !== -1;
            },
        },
        message: (tag) => `${tag} is not a valid claim type.`,
    })
    type: string;

    @Prop({ required: true })
    date: Date;

    @Prop({
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Personality",
    })
    personality: Personality;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "ClaimReview" })
    claimReviews: ClaimReview;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "Source" })
    sources: Source[];
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);
