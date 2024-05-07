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

import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { LangchainChatService } from "./langchain-chat.service";
import { ContextAwareMessagesDto } from "./dtos/context-aware-messages.dto";

@Controller()
export class LangchainChatController {
    constructor(private readonly langchainChatService: LangchainChatService) {}

    @Post("api/agent-chat")
    @HttpCode(200)
    async agentChat(@Body() contextAwareMessagesDto: ContextAwareMessagesDto) {
        return await this.langchainChatService.agentChat(
            contextAwareMessagesDto
        );
    }
}
