import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { Machine } from "../dto/create-review-task.dto";
import { ReportModelEnum, ReviewTaskTypeEnum } from "../../types/enums";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";

export type ReviewTaskDocument = ReviewTask &
    mongoose.Document & { content: any };

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class ReviewTask {
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

    @Prop({ default: NameSpaceEnum.Main, required: true })
    nameSpace: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: "onModel",
    })
    target: mongoose.Types.ObjectId;

    @Prop({
        required: true,
        validate: {
            validator: (v) => {
                return Object.values(ReviewTaskTypeEnum).includes(v);
            },
        },
        message: (tag) => `${tag} is not a valid review task type.`,
    })
    reviewTaskType: ReviewTaskTypeEnum;
}

const ReviewTaskSchemaRaw = SchemaFactory.createForClass(ReviewTask);

ReviewTaskSchemaRaw.virtual("content", {
    ref: () => ["Claim", "Source"],
    localField: "target",
    foreignField: "_id",
});

ReviewTaskSchemaRaw.virtual("reviews", {
    ref: "ClaimReview",
    localField: "data_hash",
    foreignField: "data_hash",
});

export const ReviewTaskSchema = ReviewTaskSchemaRaw;
