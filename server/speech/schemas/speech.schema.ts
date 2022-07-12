import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Paragraph } from "./paragraph.schema";

export type SpeechDocument = Speech & mongoose.Document;

@Schema({ toObject: {virtuals: true}, toJSON: {virtuals: true} })
export class Speech {
    @Prop({
        default: "speech",
        required: true,
    })
    type: string;

    @Prop({ type: Object, required: true })
    content: {
        object: Paragraph[],
        text: String,
    };
}

const SpeechSchemaRaw = SchemaFactory.createForClass(Speech);

export const SpeechSchema = SpeechSchemaRaw;
