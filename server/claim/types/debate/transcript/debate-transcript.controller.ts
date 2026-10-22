import {
    Controller,
    ForbiddenException,
    Get,
    Patch,
    Post,
    Req,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { entityId, objectId } from "../../../../../lib/schemas";
import { ZodBody, ZodParam, ZodQuery } from "../../../../common/validation";
import {
    Auth,
    FactCheckerOnly,
} from "../../../../auth/decorators/auth.decorator";
import { FactCheckerUserAbility } from "../../../../auth/ability/ability.decorator";
import type { BaseRequest } from "../../../../types";
import { TranscriptTurnStatus } from "../schemas/debate.schema";
import { DebateTranscriptService } from "./debate-transcript.service";
import {
    AppendDebateTranscriptSchema,
    EditTranscriptTurnSchema,
    ListTranscriptTurnsQuerySchema,
    ReviewTranscriptTurnsSchema,
} from "./debate-transcript.dto";
import type {
    AppendDebateTranscriptDto,
    EditTranscriptTurnDto,
    ListTranscriptTurnsQueryDto,
    ReviewTranscriptTurnsDto,
} from "./debate-transcript.dto";

/**
 * Transcript drafts of a debate. `:debateId` is the debate content id,
 * the same id that `PUT /api/claim/debate/:debateId` uses.
 */
@Controller(":namespace?")
export class DebateTranscriptController {
    constructor(private debateTranscriptService: DebateTranscriptService) {}

    /**
     * Adds transcript turns as drafts. Each turn is parsed into a draft
     * speech that is hidden from public reads until a reviewer approves
     * it. Turns whose externalId is already on the debate are skipped, so
     * a caller can resend a chunk safely.
     */
    @Auth({ abilities: [new FactCheckerUserAbility()], allowM2M: true })
    @ApiTags("claim")
    @Post("api/claim/debate/:debateId/append")
    appendTranscript(
        @ZodParam("debateId", entityId) debateId: string,
        @ZodBody(AppendDebateTranscriptSchema) body: AppendDebateTranscriptDto
    ) {
        return this.debateTranscriptService.append(debateId, body);
    }

    @FactCheckerOnly()
    @ApiTags("claim")
    @Get("api/claim/debate/:debateId/transcript-turns")
    listTranscriptTurns(
        @ZodParam("debateId", entityId) debateId: string,
        @ZodQuery(ListTranscriptTurnsQuerySchema)
        query: ListTranscriptTurnsQueryDto,
        @Req() req: BaseRequest
    ) {
        assertPersonReviewer(req);
        return this.debateTranscriptService.list(debateId, query.status);
    }

    @FactCheckerOnly()
    @ApiTags("claim")
    @Post("api/claim/debate/:debateId/transcript-turns/approve")
    approveTranscriptTurns(
        @ZodParam("debateId", entityId) debateId: string,
        @ZodBody(ReviewTranscriptTurnsSchema) body: ReviewTranscriptTurnsDto,
        @Req() req: BaseRequest
    ) {
        assertPersonReviewer(req);
        return this.debateTranscriptService.review(
            debateId,
            body.turnIds,
            TranscriptTurnStatus.Approved
        );
    }

    @FactCheckerOnly()
    @ApiTags("claim")
    @Post("api/claim/debate/:debateId/transcript-turns/reject")
    rejectTranscriptTurns(
        @ZodParam("debateId", entityId) debateId: string,
        @ZodBody(ReviewTranscriptTurnsSchema) body: ReviewTranscriptTurnsDto,
        @Req() req: BaseRequest
    ) {
        assertPersonReviewer(req);
        return this.debateTranscriptService.review(
            debateId,
            body.turnIds,
            TranscriptTurnStatus.Rejected
        );
    }

    @FactCheckerOnly()
    @ApiTags("claim")
    @Patch("api/claim/debate/:debateId/transcript-turns/:turnId")
    editTranscriptTurn(
        @ZodParam("debateId", entityId) debateId: string,
        @ZodParam("turnId", objectId) turnId: string,
        @ZodBody(EditTranscriptTurnSchema) body: EditTranscriptTurnDto,
        @Req() req: BaseRequest
    ) {
        assertPersonReviewer(req);
        return this.debateTranscriptService.edit(debateId, turnId, body);
    }
}

// An M2M client may submit drafts, but only a person may review them.
function assertPersonReviewer(req: BaseRequest) {
    if ((req.user as { isM2M?: boolean } | undefined)?.isM2M) {
        throw new ForbiddenException(
            "Transcript turns must be reviewed by a signed-in user"
        );
    }
}
