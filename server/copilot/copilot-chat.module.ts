import { Module } from "@nestjs/common";
import { CopilotChatService } from "./copilot-chat.service";
import { CopilotChatController } from "./copilot-chat.controller";
import { AutomatedFactCheckingModule } from "../automated-fact-checking/automated-fact-checking.module";
import { EditorParseModule } from "../editor-parse/editor-parse.module";

@Module({
    imports: [AutomatedFactCheckingModule, EditorParseModule],
    controllers: [CopilotChatController],
    providers: [CopilotChatService],
})
export class CopilotChatModule {}
