import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type ChatBotStateDocument = ChatBotState & mongoose.Document;

export interface ChatBotMachineSnapshot {
    value: any;
    context: {
        verificationRequest?: string;
        responseMessage?: string;
        additionalInfo?: string;
        email?: string;
        sourceChannel?: string;
    };
}

@Schema({ timestamps: true })
export class ChatBotState {
    @Prop({ required: true })
    _id: string;

    @Prop({ required: true, type: Object })
    machine: ChatBotMachineSnapshot;
}

const ChatBotStateSchemaRaw = SchemaFactory.createForClass(ChatBotState);

export const ChatBotStateSchema = ChatBotStateSchemaRaw;
