import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Claim } from "../../claim/schemas/claim.schema";

export type PersonalityDocument = Personality & mongoose.Document;

@Schema()
export class Personality {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ required: true })
    description: string;

    @Prop({ unique: true, sparse: true })
    wikidata: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Claim" })
    claims: Claim[];
}

export const PersonalitySchema = SchemaFactory.createForClass(Personality);
