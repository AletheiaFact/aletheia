import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CopilotChatService } from "./copilot-chat.service";
import { CopilotChatController } from "./copilot-chat.controller";
import { AutomatedFactCheckingModule } from "../automated-fact-checking/automated-fact-checking.module";
import { EditorParseModule } from "../editor-parse/editor-parse.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { ConfigModule } from "@nestjs/config";
import { CopilotSessionService } from "./copilot-session.service";
import { CopilotSourceService } from "./copilot-source.service";
import {
    CopilotSession,
    CopilotSessionSchema,
} from "./schemas/copilot-session.schema";
import { SourceModule } from "../source/source.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CopilotSession.name, schema: CopilotSessionSchema },
        ]),
        AutomatedFactCheckingModule,
        EditorParseModule,
        AbilityModule,
        ConfigModule,
        SourceModule,
    ],
    controllers: [CopilotChatController],
    providers: [CopilotChatService, CopilotSessionService, CopilotSourceService],
})
export class CopilotChatModule {}
