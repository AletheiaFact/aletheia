import { Module } from "@nestjs/common";
import { CopilotChatService } from "./copilot-chat.service";
import { CopilotChatController } from "./copilot-chat.controller";

@Module({
    controllers: [CopilotChatController],
    providers: [CopilotChatService],
})
export class CopilotChatModule {}
