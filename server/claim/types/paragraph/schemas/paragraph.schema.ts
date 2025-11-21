import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Sentence } from "../../sentence/schemas/sentence.schema";
import { ClaimRevision } from "../../../../claim/claim-revision/schema/claim-revision.schema";

export type ParagraphDocument = Paragraph & mongoose.Document;

@Schema({ timestamps: true })
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
        type: [
            {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Sentence",
            },
        ],
    })
    content: Sentence[];

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "ClaimRevision",
    })
    claimRevisionId: ClaimRevision;
}

const ParagraphSchemaRaw = SchemaFactory.createForClass(Paragraph);
ParagraphSchemaRaw.pre("find", function () {
    this.populate("content");
});

export const ParagraphSchema = ParagraphSchemaRaw;
