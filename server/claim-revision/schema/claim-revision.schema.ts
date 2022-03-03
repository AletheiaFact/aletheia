import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Claim } from "../../claim/schemas/claim.schema";
import { Source } from "../../source/schemas/source.schema";
import { ClaimReview } from "../../claim-review/schemas/claim-review.schema";

export type ClaimRevisionDocument = ClaimRevision & mongoose.Document;

@Schema({ toObject: {virtuals: true}, toJSON: {virtuals: true} })
export class ClaimRevision {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ type: Object, required: true })
    content: object;

    @Prop({ required: true })
    date: Date;

    @Prop({ 
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Claim",
    })
    claim: Claim;

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

    // TODO: Let's not use the auto-increment yet
    // mongodb will create a default _id field and 
    // we can use it for the first version
    @Prop({ required: true })
    revisionId: number;
}

const ClaimRevisionSchemaRaw = SchemaFactory.createForClass(ClaimRevision);;

ClaimRevisionSchemaRaw.virtual('reviews', {
    ref: 'ClaimReview',
    localField: '_id',
    foreignField: 'claim'
});

ClaimRevisionSchemaRaw.virtual('sources', {
    ref: 'Source',
    localField: '_id',
    foreignField: 'targetId'
});

export const ClaimRevisionSchema = ClaimRevisionSchemaRaw;
