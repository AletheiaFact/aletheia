import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Claim } from "../../claim/schemas/claim.schema";
import { Personality } from "../../personality/schemas/personality.schema"

export type ClaimRevisionDocument = ClaimRevision & mongoose.Document;

@Schema({ toObject: {virtuals: true}, toJSON: {virtuals: true} })
export class ClaimRevision {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    slug: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Speech",
    })
    contentId: mongoose.Types.ObjectId;

    @Prop({
        required: true,
    })
    contentModel: string;

    @Prop({ required: true })
    date: Date;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Claim",
    })
    claimId: Claim;

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

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Personality",
    })
    personality: Personality;

    // TODO: Let's not use the auto-increment yet
    // mongodb will create a default _id field and we can use it for the first version
    // @Prop({ required: true })
    // revisionId: number;
}

const ClaimRevisionSchemaRaw = SchemaFactory.createForClass(ClaimRevision);

ClaimRevisionSchemaRaw.virtual('reviews', {
    ref: 'ClaimReview',
    localField: '_id',
    foreignField: 'claim'
});

ClaimRevisionSchemaRaw.virtual('content', {
    ref: 'Speech',
    localField: 'contentId',
    foreignField: '_id'
})

export const ClaimRevisionSchema = ClaimRevisionSchemaRaw;
