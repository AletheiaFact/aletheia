import { Controller, Post, Req, Res } from "@nestjs/common";
import { ChatbotService } from "./chat-bot.service";
import type { Request, Response } from "express";

@Controller()
export class ChatbotController {
    constructor(private readonly chatBotService: ChatbotService) {}

    @Post("api/chat-bot/hook")
    handleHook(@Req() req: Request, @Res() res: Response) {
        const response = this.chatBotService.sendMessage(req.body.message);

        res.status(200).json({ message: response });
        return response;
    }
}
