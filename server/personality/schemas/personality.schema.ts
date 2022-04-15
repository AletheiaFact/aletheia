import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { softDeletePlugin } from 'mongoose-softdelete-typescript';
import * as mongoose from "mongoose";

export type PersonalityDocument = Personality & mongoose.Document;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Personality {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ required: true })
    description: string;

    @Prop({ unique: true, sparse: true })
    wikidata: string;

    @Prop({ required: false })
    P2013: string

    @Prop({ required: false })
    P2002: string
}


const PersonalitySchemaRaw = SchemaFactory.createForClass(Personality);

PersonalitySchemaRaw.virtual('claims', {
    ref: 'Claim',
    localField: '_id',
    foreignField: 'personality'
});

PersonalitySchemaRaw.plugin(softDeletePlugin)

export const PersonalitySchema = PersonalitySchemaRaw;