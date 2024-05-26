import { Module } from "@nestjs/common";
import { CopilotChatService } from "./copilot-chat.service";
import { CopilotChatController } from "./copilot-chat.controller";
import { AutomatedFactCheckingModule } from "../automated-fact-checking/automated-fact-checking.module";
import { EditorParseModule } from "../editor-parse/editor-parse.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        AutomatedFactCheckingModule,
        EditorParseModule,
        AbilityModule,
        ConfigModule,
    ],
    controllers: [CopilotChatController],
    providers: [CopilotChatService],
})
export class CopilotChatModule {}
