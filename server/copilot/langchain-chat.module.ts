import { Module } from "@nestjs/common";
import { LangchainChatService } from "./langchain-chat.service";
import { LangchainChatController } from "./langchain-chat.controller";

@Module({
    controllers: [LangchainChatController],
    providers: [LangchainChatService],
})
export class LangchainChatModule {}
