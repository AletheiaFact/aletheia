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

    @Prop({ required: true })
    slug: string;

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
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Personality",
    })
    personality: Personality;

    @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: "ClaimReview" }] })
    claimReviews: ClaimReview[];

    @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: "Source" }] })
    sources: Source[];
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);
