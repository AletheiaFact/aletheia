import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Speech } from "../../speech/mongo/schemas/speech.schema";
import * as mongoose from "mongoose";
import { ClaimRevision } from "../../../../claim/claim-revision/mongo/schemas/claim-revision.schema";

export type DebateDocument = Debate & mongoose.Document;

export enum TranscriptTurnStatus {
    Draft = "draft",
    Approved = "approved",
    Rejected = "rejected",
}

// A turn sent through the transcript append endpoint. Its speech is
// created as a draft (hidden from public reads) and only joins the debate
// `content` when a reviewer approves it. `externalId` is the caller's id
// of the turn and is used to skip repeats, also after a rejection.
export interface DebateTranscriptTurn {
    _id: mongoose.Types.ObjectId;
    speech: mongoose.Types.ObjectId;
    personality: mongoose.Types.ObjectId;
    text: string;
    status: TranscriptTurnStatus;
    externalId?: string;
    startedAt?: Date;
    createdAt: Date;
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
}

const DebateTranscriptTurnSchema = new mongoose.Schema<DebateTranscriptTurn>({
    speech: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Speech",
    },
    personality: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Personality",
    },
    text: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(TranscriptTurnStatus),
        required: true,
        default: TranscriptTurnStatus.Draft,
    },
    externalId: { type: String },
    startedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
});

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
