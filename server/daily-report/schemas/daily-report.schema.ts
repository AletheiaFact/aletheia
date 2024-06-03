import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Report } from "../../report/schemas/report.schema";

export type DailyReportDocument = DailyReport & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class DailyReport {
    @Prop({
        type: [
            {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Report",
            },
        ],
    })
    reports: Report[];

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    nameSpace: string;
}

export const DailyReportSchema = SchemaFactory.createForClass(DailyReport);
