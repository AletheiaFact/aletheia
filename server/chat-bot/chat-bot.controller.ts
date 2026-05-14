import { Controller, Post, Req, Res, Logger } from "@nestjs/common";
import { ChatbotService } from "./chat-bot.service";
import type { Request, Response } from "express";
import { AdminOnly } from "../auth/decorators/auth.decorator";
import { toError } from "../util/error-handling";

@Controller()
export class ChatbotController {
    private readonly logger = new Logger(ChatbotController.name);

    constructor(private readonly chatBotService: ChatbotService) {}

    @AdminOnly({ allowM2M: true })
    @Post("api/chatbot/hook")
    async handleHook(@Req() req: Request, @Res() res: Response) {
        const { channel, from } = req.body.message || {};

        try {
            await this.chatBotService.sendMessage(req.body.message);
            this.logger.log(
                `Webhook processed successfully [channel=${channel}, from=${from}]`
            );
            res.status(200).json({ message: "ok" });
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Webhook processing failed [channel=${channel}, from=${from}]: ${err.message}`,
                err.stack
            );
            res.status(500).json({ error: "Failed to process webhook" });
        }
    }
}
