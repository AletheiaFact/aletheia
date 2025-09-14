import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Group } from "../../group/schemas/group.schema";
import { Topic } from "../../topic/schemas/topic.schema";
import { ContentModelEnum, ReceptionChannelEnum } from "../../types/enums";

export type VerificationRequestDocument = VerificationRequest &
    mongoose.Document;

@Schema()
export class VerificationRequest {
    @Prop({ required: true, unique: true })
    data_hash: string;

    @Prop({ required: true, type: String })
    content: string;

    @Prop({ required: true, type: String })
    receptionChannel: ReceptionChannelEnum;

    @Prop({ required: true, type: String })
    reportType: ContentModelEnum;

    @Prop({ required: false, type: String })
    impactArea: string;

    @Prop({ required: false, type: String })
    publicationDate: string;

    @Prop({ required: false, type: String })
    email: string;

    @Prop({ required: false, type: String })
    heardFrom: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "Source",
    })
    source: mongoose.Types.ObjectId;

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

    @Prop({ type: Array, required: false })
    topics: Topic[];
}

const VerificationRequestSchema =
    SchemaFactory.createForClass(VerificationRequest);

VerificationRequestSchema.pre("find", function () {
    this.populate("source");
});

export { VerificationRequestSchema };
