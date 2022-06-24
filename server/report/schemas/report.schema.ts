import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "../../users/schemas/user.schema";

export type ReportDocument = Report & mongoose.Document;

export enum ClassificationEnum {
    "not-fact",
    "true",
    "true-but",
    "arguable",
    "misleading",
    "false",
    "unsustainable",
    "exaggerated",
    "unverifiable",
};

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class Report {
    @Prop({ required: true })
    sentence_hash: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    })
    userId: User;

    @Prop({ required: true })
    summary: string;
    
    @Prop({ required: true })
    questions: string[];

    @Prop({ required: true })
    report: string;

    @Prop({ required: true })
    verification: string;

    @Prop({ required: true })
    sources: string[];

    @Prop({
        required: true,
        validate: {
            validator: (v) => {
                return (
                    [
                        "not-fact",
                        "true",
                        "true-but",
                        "arguable",
                        "misleading",
                        "false",
                        "unsustainable",
                        "exaggerated",
                        "unverifiable",
                    ].indexOf(v) !== -1
                );
            },
        },
        message: (tag) => `${tag} is not a valid classification.`,
    })
    classification: string;
}

const ReportSchemaRaw = SchemaFactory.createForClass(Report);

ReportSchemaRaw.virtual('reviews', {
    ref: 'ClaimReview',
    localField: '_id',
    foreignField: 'report'
})

export const ReportSchema = ReportSchemaRaw;