import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Claim } from "../../claim/schemas/claim.schema";
import { Source } from "../../source/schemas/source.schema";

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

    @Prop({ required: true })
    claim: Claim;

    @Prop({ required: true })
    revisionId: number;
}

const ClaimRevisionSchemaRaw = SchemaFactory.createForClass(ClaimRevision);;

ClaimRevisionSchemaRaw.virtual('claims', {
  ref: 'Claim',
  localField: '_id',
  foreignField: 'claimRevision'
})

ClaimRevisionSchemaRaw.virtual('sources', {
    ref: 'Source',
    localField: '_id',
    foreignField: 'targetId'
});

export const ClaimRevisionSchema = ClaimRevisionSchemaRaw;
