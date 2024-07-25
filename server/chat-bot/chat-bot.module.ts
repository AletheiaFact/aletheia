import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from "@nestjs/common";
import { ChatbotService } from "./chat-bot.service";
import { ChatbotController } from "./chat-bot.controller";
import { HttpModule } from "@nestjs/axios";
import { VerificationRequestModule } from "../verification-request/verification-request.module";
import { ConfigModule } from "@nestjs/config";
import { AuthZenviaWebHookMiddleware } from "../middleware/auth-zenvia-webhook.middleware";
import { ChatBotStateModule } from "../chat-bot-state/chat-bot-state.module";

@Module({
    imports: [
        HttpModule,
        VerificationRequestModule,
        ConfigModule,
        ChatBotStateModule,
    ],
    providers: [ChatbotService],
    controllers: [ChatbotController],
})
export class ChatbotModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthZenviaWebHookMiddleware).forRoutes({
            path: "api/chatbot/hook",
            method: RequestMethod.POST,
        });
    }
}
