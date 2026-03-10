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

    async create(snapshot: ChatBotMachineSnapshot, data_hash: string) {
        const newChatBotState = new this.ChatBotStateModel({
            data_hash: data_hash,
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

    async getByDataHash(data_hash: string) {
        const chatBotState = this.ChatBotStateModel.findOne({
            data_hash: data_hash
        });
        return chatBotState;
    }
}
