import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
    ChatBotState,
    ChatBotStateDocument,
    ChatBotMachineSnapshot,
} from "./chat-bot-state.schema";

@Injectable()
export class ChatBotStateService {
    constructor(
        @InjectModel(ChatBotState.name)
        private ChatBotStateModel: Model<ChatBotStateDocument>
    ) {}

    async create(snapshot: ChatBotMachineSnapshot, id: string) {
        const newChatBotState = new this.ChatBotStateModel({
            _id: id,
            machine: snapshot,
        });
        return await newChatBotState.save();
    }

    async updateSnapshot(
        id: string,
        snapshot: ChatBotMachineSnapshot
    ): Promise<ChatBotStateDocument | null> {
        return await this.ChatBotStateModel.findByIdAndUpdate(
            id,
            { machine: snapshot },
            { new: true, useFindAndModify: false }
        ).exec();
    }

    async getById(id: string) {
        const chatBotState = this.ChatBotStateModel.findById(id);
        return chatBotState;
    }
}
