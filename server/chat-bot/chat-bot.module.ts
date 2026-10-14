import { Module } from "@nestjs/common";
import { ChatbotService } from "./chat-bot.service";
import { ChatbotController } from "./chat-bot.controller";
import { HttpModule } from "@nestjs/axios";
import { VerificationRequestModule } from "../verification-request/verification-request.module";
import { ConfigModule } from "@nestjs/config";
import { ChatBotStateModule } from "../chat-bot-state/chat-bot-state.module";
import { VerificationRequestStateMachineService } from "../verification-request/state-machine/verification-request.state-machine.service";
import { AbilityModule } from "../auth/ability/ability.module";
import { FeatureFlagModule } from "../feature-flag/feature-flag.module";

@Module({
    imports: [
        HttpModule,
        VerificationRequestModule.register(),
        ConfigModule,
        ChatBotStateModule,
        AbilityModule,
        FeatureFlagModule,
    ],
    providers: [ChatbotService, VerificationRequestStateMachineService],
    controllers: [ChatbotController],
})
export class ChatbotModule {}
