import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type DailyReportDocument = DailyReport & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class DailyReport {
    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: "onModel",
    })
    reports: mongoose.Types.ObjectId[];

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    nameSpace: string;
}

export const DailyReportSchema = SchemaFactory.createForClass(DailyReport);
