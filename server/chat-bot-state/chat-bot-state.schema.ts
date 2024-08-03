import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type ChatBotStateDocument = ChatBotState & mongoose.Document;

@Schema()
export class ChatBotState {
    @Prop({ required: true })
    _id: string;

    @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
    state: any;
}

const ChatBotStateSchemaRaw = SchemaFactory.createForClass(ChatBotState);

export const ChatBotStateSchema = ChatBotStateSchemaRaw;
