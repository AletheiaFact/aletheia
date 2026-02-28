import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
} from "@nestjs/common";
import { CopilotChatService } from "./copilot-chat.service";
import {
    CreateSessionDto,
    SessionAgentChatDto,
} from "./dtos/context-aware-messages.dto";
import { FactCheckerOnly } from "../auth/decorators/auth.decorator";
import { CopilotSessionService } from "./copilot-session.service";

@Controller()
export class CopilotChatController {
    constructor(
        private readonly copilotChatService: CopilotChatService,
        private readonly copilotSessionService: CopilotSessionService
    ) {}

    @FactCheckerOnly()
    @Get("api/copilot-session")
    async getSession(
        @Query("claimReviewDataHash") claimReviewDataHash: string,
        @Req() req
    ) {
        const session = await this.copilotSessionService.getActiveSession(
            req.user._id,
            claimReviewDataHash
        );
        return { session };
    }

    @FactCheckerOnly()
    @Post("api/copilot-session")
    async createSession(
        @Body() createSessionDto: CreateSessionDto,
        @Req() req
    ) {
        const session = await this.copilotSessionService.createSession(
            req.user._id,
            createSessionDto.claimReviewDataHash,
            createSessionDto.context
        );
        return { session };
    }

    @FactCheckerOnly()
    @Post("api/copilot-session/:id/clear")
    async clearSession(@Param("id") id: string) {
        await this.copilotSessionService.deactivateSession(id);
        return { success: true };
    }

    @FactCheckerOnly()
    @Post("api/agent-chat")
    async agentChat(
        @Body() sessionAgentChatDto: SessionAgentChatDto,
        @Req() req
    ) {
        try {
            return await this.copilotChatService.agentChat(
                sessionAgentChatDto,
                req.language
            );
        } catch (e) {
            throw new Error(e);
        }
    }
}
