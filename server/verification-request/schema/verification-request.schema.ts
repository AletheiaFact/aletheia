import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type VerificationRequestDocument = VerificationRequest &
    mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class VerificationRequest {
    @Prop({
        required: true,
    })
    content: string;

    @Prop({
        type: Date,
        required: true,
    })
    date: mongoose.Date;
}

export const VerificationRequestSchema =
    SchemaFactory.createForClass(VerificationRequest);
