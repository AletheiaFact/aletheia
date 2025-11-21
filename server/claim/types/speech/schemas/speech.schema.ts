import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Personality } from "../../../../personality/mongo/schemas/personality.schema";
import { Paragraph } from "../../paragraph/schemas/paragraph.schema";
import { ClaimRevision } from "../../../../claim/claim-revision/schema/claim-revision.schema";

export type SpeechDocument = Speech & mongoose.Document;
@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true }, timestamps: true })
export class Speech {
    @Prop({
        default: "speech",
        required: true,
    })
    type: string;

    @Prop({
        type: [
            {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Paragraph",
            },
        ],
    })
    content: Paragraph[];

    @Prop({
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "personality",
    })
    personality: Personality;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "ClaimRevision",
    })
    claimRevisionId: ClaimRevision;
}

const SpeechSchemaRaw = SchemaFactory.createForClass(Speech);
SpeechSchemaRaw.pre("find", function () {
    this.populate("content");
});
SpeechSchemaRaw.pre("findOne", function () {
    this.populate("content");
});

export const SpeechSchema = SpeechSchemaRaw;
