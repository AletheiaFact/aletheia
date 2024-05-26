/**
 * Controller for Langchain Chat operations.
 *
 * Handles HTTP requests for context-aware chat interactions
 * in the Langchain application. This controller is responsible for
 * validating incoming request data and orchestrating chat interactions through the LangchainChatService.
 * It supports endpoints for initiating context-aware chat
 * and ensuring a versatile chat service experience.
 *
 * @class LangchainChatController
 *
 * @method contextAwareChat - Initiates a context-aware chat interaction. Accepts POST requests with a ContextAwareMessagesDto to manage chat context.
 *                            Leverages LangchainChatService for processing.
 * @param {ContextAwareMessagesDto} contextAwareMessagesDto - DTO for managing chat context.
 * @returns Contextual chat response from the LangchainChatService.
 *
 * This controller uses decorators to define routes and their configurations, ensuring proper request handling and response formatting. It also integrates file upload handling for PDF documents, enabling document-context chat functionalities.
 */

import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { CopilotChatService } from "./copilot-chat.service";
import { ContextAwareMessagesDto } from "./dtos/context-aware-messages.dto";
import {
    CheckAbilities,
    FactCheckerUserAbility,
} from "../auth/ability/ability.decorator";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";

@Controller()
export class CopilotChatController {
    constructor(private readonly copilotChatService: CopilotChatService) {}

    @Post("api/agent-chat")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new FactCheckerUserAbility())
    async agentChat(
        @Body() contextAwareMessagesDto: ContextAwareMessagesDto,
        @Req() req
    ) {
        try {
            return await this.copilotChatService.agentChat(
                contextAwareMessagesDto,
                req.language
            );
        } catch (e) {
            throw new Error(e);
        }
    }
}
