import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatBotState, ChatBotStateSchema } from "./chat-bot-state.schema";
import { ChatBotStateService } from "./chat-bot-state.service";

const ChatBotStateModel = MongooseModule.forFeature([
    {
        name: ChatBotState.name,
        schema: ChatBotStateSchema,
    },
]);

@Module({
    imports: [ChatBotStateModel],
    exports: [ChatBotStateService],
    providers: [ChatBotStateService],
})
export class ChatBotStateModule {}
