import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type ParagraphDocument = Paragraph & mongoose.Document;

@Schema()
export class Paragraph {
    @Prop({
        type: String,
        default: "paragraph",
        required: true,
    })
    type: string;

    @Prop({ required: true })
    data_hash: string;

    @Prop({ type: Object, required: true })
    props: object;

    @Prop({ required: true })
    content: object[];
}

const ParagraphSchemaRaw = SchemaFactory.createForClass(Paragraph);

ParagraphSchemaRaw.virtual('sentence', {
    ref: 'Sentence',
    localField: 'content',
    foreignField: '_id'
})

export const ParagraphSchema = ParagraphSchemaRaw;
