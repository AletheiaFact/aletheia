import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Speech } from "../../speech/mongo/schemas/speech.schema";
import * as mongoose from "mongoose";
import { ClaimRevision } from "../../../../claim/claim-revision/mongo/schemas/claim-revision.schema";

export type DebateDocument = Debate & mongoose.Document;

// Metadata of a speech appended through the transcript append endpoint.
// `externalId` is the caller's id of the turn and is used to skip repeats.
export interface DebateTranscriptTurn {
    speech: mongoose.Types.ObjectId;
    externalId?: string;
    startedAt?: Date;
}

const DebateTranscriptTurnSchema = new mongoose.Schema<DebateTranscriptTurn>(
    {
        speech: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Speech",
        },
        externalId: { type: String },
        startedAt: { type: Date },
    },
    { _id: false }
);

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class Debate {
    @Prop({
        default: "debate",
        required: true,
    })
    type: string;

    @Prop({ required: true })
    data_hash: string;

    @Prop({
        type: [
            {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Speech",
            },
        ],
    })
    content: Speech[];

    @Prop({ type: [DebateTranscriptTurnSchema], default: [] })
    transcriptTurns: DebateTranscriptTurn[];

    // TODO: move this to the prop object and formalize the claim specification
    @Prop({ type: Boolean, default: false, required: true })
    isLive: boolean;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date })
    updatedAt: Date;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "ClaimRevision",
    })
    claimRevisionId: ClaimRevision;
}

const DebateSchemaRaw = SchemaFactory.createForClass(Debate);
DebateSchemaRaw.pre("find", function () {
    this.populate("content");
});

export const DebateSchema = DebateSchemaRaw;
