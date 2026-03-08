import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "../../users/schemas/user.schema";

export type CopilotSessionDocument = CopilotSession & mongoose.Document;

@Schema({ timestamps: true })
export class CopilotSessionMessage {
    @Prop({ required: true })
    sender: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: false })
    type: string;

    @Prop({ type: Object, required: false })
    editorReport?: object;

    @Prop({ required: false })
    executionId?: string;
}

const CopilotSessionMessageSchema =
    SchemaFactory.createForClass(CopilotSessionMessage);

@Schema({ timestamps: true })
export class CopilotSession {
    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    })
    userId: User;

    @Prop({ required: true })
    claimReviewDataHash: string;

    @Prop({
        type: [CopilotSessionMessageSchema],
        default: [],
    })
    messages: CopilotSessionMessage[];

    @Prop({ type: Object, required: false })
    context: object;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ required: false })
    title: string;

    @Prop({ required: false, default: "active" })
    status: string;
}

export const CopilotSessionSchema =
    SchemaFactory.createForClass(CopilotSession);
