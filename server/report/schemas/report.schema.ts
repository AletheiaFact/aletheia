import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ClassificationEnum } from "../../claim-review/dto/create-claim-review.dto";
import * as mongoose from "mongoose";
import { User } from "../../users/schemas/user.schema";

export type ReportDocument = Report & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class Report {
    @Prop({ required: true })
    data_hash: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    })
    usersId: User[];

    @Prop({ required: true })
    summary: string;

    @Prop({ required: false })
    questions: string[];

    @Prop({ required: false })
    report: string;

    @Prop({ required: false })
    verification: string;

    @Prop({ required: true })
    sources: string[];

    @Prop({
        required: true,
        enum: ClassificationEnum,
    })
    classification: string;
}

const ReportSchemaRaw = SchemaFactory.createForClass(Report);

ReportSchemaRaw.virtual("reviews", {
    ref: "ClaimReview",
    localField: "_id",
    foreignField: "report",
});

export const ReportSchema = ReportSchemaRaw;
