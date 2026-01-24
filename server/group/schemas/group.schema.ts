import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { VerificationRequest } from "../../verification-request/schemas/verification-request.schema";

export type GroupDocument = Group & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true }, timestamps: true })
export class Group {
    @Prop({
        type: [
            {
                type: mongoose.Types.ObjectId,
                required: false,
                ref: "VerificationRequest",
            },
        ],
    })
    content: VerificationRequest[];

    @Prop({
        type: mongoose.Types.ObjectId,
        required: false,
        refPath: "onModel",
    })
    targetId: mongoose.Types.ObjectId;
}

const GroupSchemaRaw = SchemaFactory.createForClass(Group);

GroupSchemaRaw.pre("find", function () {
    this.populate("content");
    this.populate({
        path: "targetId",
        model: "Claim",
    });
});

export const GroupSchema = GroupSchemaRaw;
