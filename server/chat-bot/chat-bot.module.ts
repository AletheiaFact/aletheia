import { Module } from "@nestjs/common";
import { ChatbotService } from "./chat-bot.service";
import { ChatbotController } from "./chat-bot.controller";
import { HttpModule } from "@nestjs/axios";
import { VerificationRequestModule } from "../verification-request/verification-request.module";
import { ConfigModule } from "@nestjs/config";
import { ChatBotStateModule } from "../chat-bot-state/chat-bot-state.module";
import { VerificationRequestStateMachineService } from "../verification-request/state-machine/verification-request.state-machine.service";
import { AbilityModule } from "../auth/ability/ability.module";

@Module({
    imports: [
        HttpModule,
        VerificationRequestModule,
        ConfigModule,
        ChatBotStateModule,
        AbilityModule,
    ],
    providers: [ChatbotService, VerificationRequestStateMachineService],
    controllers: [ChatbotController],
})
export class ChatbotModule {}
