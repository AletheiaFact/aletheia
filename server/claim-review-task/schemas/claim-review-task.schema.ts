import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { Machine } from "../dto/create-claim-review-task.dto";
import { ReportModelEnum } from "../../types/enums";

export type ClaimReviewTaskDocument = ClaimReviewTask & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class ClaimReviewTask {
    @Prop({ type: Object, required: true })
    machine: Machine;

    @Prop({ unique: true, required: true })
    data_hash: string;

    @Prop({
        required: true,
        validate: {
            validator: (v) => {
                return Object.values(ReportModelEnum).includes(v);
            },
        },
        message: (tag) => `${tag} is not a valid report type.`,
    })
    reportModel: ReportModelEnum;
}

export const ClaimReviewTaskSchema =
    SchemaFactory.createForClass(ClaimReviewTask);
