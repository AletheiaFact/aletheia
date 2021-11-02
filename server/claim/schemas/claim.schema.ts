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
}
const ClaimSchemaRaw = SchemaFactory.createForClass(Claim);

ClaimSchemaRaw.virtual('reviews', {
    ref: 'ClaimReview',
    localField: '_id',
    foreignField: 'claim'
});

ClaimSchemaRaw.virtual('sources', {
    ref: 'Source',
    localField: '_id',
    foreignField: 'targetId'
});

export const ClaimSchema = ClaimSchemaRaw;
