import {
    Controller,
    Post,
    Get,
    Patch,
    Param,
    Query,
    Body,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AiTaskService } from "./ai-task.service";
import type { CreateAiTaskDto } from "./dto/create-ai-task.dto";
import type { UpdateAiTaskDto } from "./dto/update-ai-task.dto";
import { AiTask } from "./schemas/ai-task.schema";
import { AiTaskState } from "./constants/ai-task.constants";
import { ObjectIdValidationPipe } from "./pipes/objectid-validation.pipe";
import { M2MOrAbilities } from "../auth/decorators/m2m-or-abilities.decorator";
import { ADMIN_USER_ABILITY } from "../auth/ability/abilities.constants";

@ApiTags("ai-tasks")
@Controller("api/ai-tasks")
export class AiTaskController {
    constructor(private readonly aiTaskService: AiTaskService) {}

    // @M2MOrAbilities(ADMIN_USER_ABILITY)
    @ApiOperation({ summary: "Enqueue a new AI task" })
    @Post()
    create(@Body() createDto: CreateAiTaskDto) {
        return this.aiTaskService.create(createDto);
    }

    // @M2MOrAbilities(ADMIN_USER_ABILITY)
    @ApiOperation({ summary: "Get all pending AI tasks" })
    @Get("pending")
    getPending() {
        return this.aiTaskService.findAll(AiTaskState.PENDING);
    }

    // @M2MOrAbilities(ADMIN_USER_ABILITY)
    @ApiOperation({ summary: "Get AI tasks by state" })
    @Get()
    findAll(@Query("state") state?: string) {
        const typedState = state as AiTask["state"];
        return this.aiTaskService.findAll(typedState);
    }

    // @M2MOrAbilities(ADMIN_USER_ABILITY)
    @ApiOperation({
        summary: "Update AI task state and optionally dispatch result",
    })
    @Patch(":id")
    update(
        @Param("id", ObjectIdValidationPipe) id: string,
        @Body() updateDto: UpdateAiTaskDto & { result?: any }
    ) {
        return this.aiTaskService.updateState(id, updateDto);
    }
}
