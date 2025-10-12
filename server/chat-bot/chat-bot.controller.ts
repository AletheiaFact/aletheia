import { Controller, Post, Req, Res } from "@nestjs/common";
import { ChatbotService } from "./chat-bot.service";
import type { Request, Response } from "express";
import { M2MOrAbilities } from "../auth/decorators/m2m-or-abilities.decorator";
import { INTEGRATION_ABILITY } from "../auth/ability/abilities.constants";

@Controller()
export class ChatbotController {
    constructor(private readonly chatBotService: ChatbotService) {}

    @M2MOrAbilities(INTEGRATION_ABILITY)
    @Post("api/chatbot/hook")
    handleHook(@Req() req: Request, @Res() res: Response) {
        const response = this.chatBotService.sendMessage(req.body.message);

        res.status(200).json({ message: response });
        return response;
    }
}
