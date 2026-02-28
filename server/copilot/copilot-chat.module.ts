import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CopilotChatService } from "./copilot-chat.service";
import { CopilotChatController } from "./copilot-chat.controller";
import { AutomatedFactCheckingModule } from "../automated-fact-checking/automated-fact-checking.module";
import { EditorParseModule } from "../editor-parse/editor-parse.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { ConfigModule } from "@nestjs/config";
import { CopilotSessionService } from "./copilot-session.service";
import {
    CopilotSession,
    CopilotSessionSchema,
} from "./schemas/copilot-session.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CopilotSession.name, schema: CopilotSessionSchema },
        ]),
        AutomatedFactCheckingModule,
        EditorParseModule,
        AbilityModule,
        ConfigModule,
    ],
    controllers: [CopilotChatController],
    providers: [CopilotChatService, CopilotSessionService],
})
export class CopilotChatModule {}
