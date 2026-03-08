import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
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
import { AutomatedFactCheckingService } from "../automated-fact-checking/automated-fact-checking.service";

@Controller()
export class CopilotChatController {
    constructor(
        private readonly copilotChatService: CopilotChatService,
        private readonly copilotSessionService: CopilotSessionService,
        private readonly automatedFactCheckingService: AutomatedFactCheckingService
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
    @Get("api/copilot-session/list")
    async listSessions(
        @Query("page") page: string = "1",
        @Query("pageSize") pageSize: string = "20",
        @Query("claimReviewDataHash") claimReviewDataHash: string,
        @Req() req
    ) {
        return this.copilotSessionService.listSessionsByUser(
            req.user._id,
            parseInt(page, 10),
            parseInt(pageSize, 10),
            claimReviewDataHash
        );
    }

    @FactCheckerOnly()
    @Get("api/copilot-session/:id/detail")
    async getSessionById(@Param("id") id: string) {
        const session = await this.copilotSessionService.getSessionById(id);
        return { session };
    }

    @FactCheckerOnly()
    @Patch("api/copilot-session/:id")
    async updateSession(
        @Param("id") id: string,
        @Body() updateData: { title?: string; status?: string }
    ) {
        const session = await this.copilotSessionService.updateSession(
            id,
            updateData
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
                req.language,
                req.user._id
            );
        } catch (e) {
            throw new Error(e);
        }
    }

    @FactCheckerOnly()
    @Get("api/copilot-session/:sessionId/executions")
    async getExecutions(@Param("sessionId") sessionId: string) {
        const executions =
            await this.automatedFactCheckingService.getExecutions(sessionId);
        return { executions };
    }

    @FactCheckerOnly()
    @Get("api/copilot-session/:sessionId/executions/:executionId")
    async getExecution(
        @Param("sessionId") sessionId: string,
        @Param("executionId") executionId: string
    ) {
        const execution =
            await this.automatedFactCheckingService.getExecution(
                sessionId,
                executionId
            );
        return { execution };
    }
}
