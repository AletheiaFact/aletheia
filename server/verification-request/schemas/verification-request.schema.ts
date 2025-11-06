import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Group } from "../../group/schemas/group.schema";
import { Topic } from "../../topic/schemas/topic.schema";
import { ContentModelEnum } from "../../types/enums";
import { SeverityEnum, VerificationRequestStatus } from "../dto/types";

export type VerificationRequestDocument = VerificationRequest &
    mongoose.Document;

@Schema()
export class VerificationRequest {
    @Prop({ required: true, unique: true })
    data_hash: string;

    @Prop({ required: true, type: String })
    content: string;

    @Prop({ required: true, type: String })
    sourceChannel: string;

    @Prop({ required: false, type: String })
    reportType: ContentModelEnum;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "Topic",
    })
    impactArea: mongoose.Types.ObjectId;

    @Prop({ required: false, type: String })
    additionalInfo: string;

    @Prop({ required: false, type: String })
    publicationDate: string;

    @Prop({ required: false, type: String })
    email: string;

    @Prop({ required: false, type: String })
    heardFrom: string;

    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: "Source",
    })
    source: mongoose.Types.ObjectId[];

    @Prop({ required: true, default: new Date() })
    date: Date;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "Group",
    })
    group: Group;

    @Prop({ required: false, type: Boolean })
    rejected: boolean;

    @Prop({ required: false, type: Boolean })
    isSensitive: boolean;

    @Prop({ required: false, type: [Number] })
    embedding: number[];

    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: "Topic",
    })
    topics: Topic[];

    @Prop({
        required: false,
        enum: SeverityEnum,
    })
    severity: string;

    @Prop({
        required: true,
        enum: VerificationRequestStatus,
    })
    status: string;

    @Prop({
        required: false,
        type: [String],
    })
    statesExecuted: string[];

    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: "Personality",
    })
    identifiedData: mongoose.Types.ObjectId[];

    @Prop({
        required: false,
        type: Map,
        of: Number,
    })
    stateRetries: Map<string, number>;

    @Prop({
        required: false,
        type: Array,
    })
    stateErrors: Array<{
        state: string;
        error: string;
        timestamp: Date;
    }>;

    @Prop({
        required: false,
        type: Array,
    })
    stateTransitions: Array<{
        from: string;
        to: string;
        timestamp: Date;
        duration: number;
    }>;

    @Prop({
        required: false,
        type: Object,
    })
    progress: {
        current: string;
        completed: number;
        total: number;
        percentage: number;
        estimatedCompletion?: Date;
    };

    @Prop({
        required: false,
        type: Map,
        of: String,
    })
    stateFingerprints: Map<string, string>;

    @Prop({
        required: false,
        type: Array,
    })
    auditLog: Array<{
        action: string;
        field?: string;
        userId?: string;
        timestamp: Date;
        details?: any;
    }>;

    @Prop({
        required: false,
        type: Map,
        of: String,
    })
    pendingAiTasks: Map<string, string>;
}

const VerificationRequestSchema =
    SchemaFactory.createForClass(VerificationRequest);

VerificationRequestSchema.pre("find", function () {
    this.populate("source");
});

export { VerificationRequestSchema };
