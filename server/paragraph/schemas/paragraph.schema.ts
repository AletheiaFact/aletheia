import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Sentence } from "../../sentence/schemas/sentence.schema";

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

    @Prop({
        type: [{
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Sentence"
        }]
    })
    content: Sentence[];
}

const ParagraphSchemaRaw = SchemaFactory.createForClass(Paragraph);

export const ParagraphSchema = ParagraphSchemaRaw;
