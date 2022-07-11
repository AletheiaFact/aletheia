import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type SentenceDocument = Sentence & mongoose.Document;

@Schema()
export class Sentence {
    @Prop({
        type: String,
        required: true,
        default: "sentence"
    })
    type: string;

    @Prop({ required: true })
    data_hash: string;

    @Prop({ type: Object, required: true })
    props: object;

    @Prop({ required: true })
    content: string;
}

const SentenceSchemaRaw = SchemaFactory.createForClass(Sentence);

export const SentenceSchema = SentenceSchemaRaw;
