import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Topic } from "../../../../topic/schemas/topic.schema";
import { ClaimRevision } from "../../../../claim/claim-revision/schema/claim-revision.schema";

export type SentenceDocument = Sentence & mongoose.Document;

@Schema({ timestamps: true })
export class Sentence {
    @Prop({
        type: String,
        default: "sentence",
        required: true,
    })
    type: string;

    @Prop({ required: true })
    data_hash: string;

    @Prop({ type: Object, required: true })
    props: object;

    @Prop({ required: true })
    content: string;

    @Prop({ required: false })
    topics: Topic[];

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "ClaimRevision",
    })
    claimRevisionId: ClaimRevision;
}

const SentenceSchemaRaw = SchemaFactory.createForClass(Sentence);

export const SentenceSchema = SentenceSchemaRaw;
