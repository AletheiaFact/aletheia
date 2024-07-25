import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatBotState, ChatBotStateDocument } from "./chat-bot-state.schema";

@Injectable()
export class ChatBotStateService {
    constructor(
        @InjectModel(ChatBotState.name)
        private ChatBotStateModel: Model<ChatBotStateDocument>
    ) {}

    async create(state, id: string) {
        const newChatBotState = new this.ChatBotStateModel({
            _id: id,
            state: state,
        });
        return await newChatBotState.save();
    }

    async updateState(
        id: string,
        state: any
    ): Promise<ChatBotStateDocument | null> {
        return await this.ChatBotStateModel.findByIdAndUpdate(
            id,
            { state: state },
            { new: true, useFindAndModify: false }
        ).exec();
    }

    async getById(id: string) {
        const chatBotState = this.ChatBotStateModel.findById(id);
        return chatBotState;
    }
}
