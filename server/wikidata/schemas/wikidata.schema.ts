import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type WikidataCacheDocument = WikidataCache & Document;

@Schema({ timestamps: true })
export class WikidataCache {
    @Prop({ required: true })
    wikidataId: string;

    @Prop({ required: true })
    language: string;

    @Prop({ type: Object, required: true })
    props: object;
}

export const WikidataCacheSchema = SchemaFactory.createForClass(WikidataCache);
