import { Module } from "@nestjs/common";
import { ChatbotService } from "./chat-bot.service";
import { ChatbotController } from "./chat-bot.controller";
import { HttpModule } from "@nestjs/axios";
import { VerificationRequestModule } from "../verification-request/verification-request.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [HttpModule, VerificationRequestModule, ConfigModule],
    providers: [ChatbotService],
    controllers: [ChatbotController],
})
export class ChatbotModule {}
