import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdminOnly } from "../../auth/decorators/auth.decorator";
import { ZodValidationPipe } from "../../ai-task/pipes/zod-validation.pipe";
import { AdminEditorService } from "./admin-editor.service";
import {
    ClaimEditPreviewRequestDto,
    ClaimEditPreviewRequestSchema,
} from "./dto/claim-edit-preview-request.dto";
import {
    ClaimEditCommitRequestDto,
    ClaimEditCommitRequestSchema,
} from "./dto/claim-edit-commit-request.dto";

@ApiTags("admin-claim-editor")
@Controller(":namespace?/api/claim/:id/admin-edit")
export class AdminEditorController {
    private readonly logger = new Logger(AdminEditorController.name);

    constructor(private readonly service: AdminEditorService) {}

    @AdminOnly()
    @Get("view")
    @ApiOperation({
        summary: "Load editable view of a claim",
    })
    @ApiResponse({ status: 200, description: "Editable view" })
    @ApiResponse({ status: 403, description: "Not an admin" })
    @ApiResponse({ status: 404, description: "Claim not found" })
    view(@Param("id") id: string) {
        return this.service.view(id);
    }

    @AdminOnly()
    @Post("preview")
    @ApiOperation({
        summary: "Validate a proposed edit and classify changes",
    })
    @ApiBody({ description: "ClaimEditPreviewRequest" })
    @ApiResponse({ status: 200, description: "Preview result" })
    @ApiResponse({ status: 400, description: "Validation failure" })
    @ApiResponse({ status: 409, description: "Concurrency conflict" })
    preview(
        @Param("id") id: string,
        @Body(new ZodValidationPipe(ClaimEditPreviewRequestSchema))
        payload: ClaimEditPreviewRequestDto
    ) {
        return this.service.preview(id, payload);
    }

    @AdminOnly()
    @Post("commit")
    @ApiOperation({
        summary: "Apply the edit and cascade updates atomically",
    })
    @ApiBody({ description: "ClaimEditCommitRequest" })
    @ApiResponse({ status: 200, description: "Commit succeeded" })
    @ApiResponse({ status: 400, description: "Validation failure" })
    @ApiResponse({ status: 409, description: "Concurrency conflict" })
    commit(
        @Param("id") id: string,
        @Body(new ZodValidationPipe(ClaimEditCommitRequestSchema))
        payload: ClaimEditCommitRequestDto
    ) {
        return this.service.commit(id, payload);
    }
}
