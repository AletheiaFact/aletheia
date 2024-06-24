import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { VerificationRequest } from "../../verification-request/schemas/verification-request.schema";

export type GroupDocument = Group & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
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

export const GroupSchema = SchemaFactory.createForClass(Group);
