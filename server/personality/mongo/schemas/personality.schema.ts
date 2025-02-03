import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { softDeletePlugin } from "mongoose-softdelete-typescript";
import mongoose from "mongoose";

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

    @Prop({ type: Boolean, default: false, required: true })
    isHidden: boolean;
}

const PersonalitySchemaRaw = SchemaFactory.createForClass(Personality);

PersonalitySchemaRaw.virtual("claims", {
    ref: "Claim",
    localField: "_id",
    foreignField: "personalities",
});

PersonalitySchemaRaw.plugin(softDeletePlugin);

export const PersonalitySchema = PersonalitySchemaRaw;
