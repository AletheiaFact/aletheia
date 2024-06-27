import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Group } from "../../group/schemas/group.schema";

export type VerificationRequestDocument = VerificationRequest &
    mongoose.Document;

@Schema()
export class VerificationRequest {
    @Prop({ required: true, unique: true })
    data_hash: string;

    @Prop({ required: true, type: String })
    content: string;

    @Prop({ required: false, default: new Date() })
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
}

export const VerificationRequestSchema =
    SchemaFactory.createForClass(VerificationRequest);
