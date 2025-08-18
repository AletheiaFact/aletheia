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

@ApiTags("ai-tasks")
@Controller("api/ai-tasks")
export class AiTaskController {
    constructor(private readonly aiTaskService: AiTaskService) {}

    @ApiOperation({ summary: "Enqueue a new AI task" })
    @Post()
    create(@Body() createDto: CreateAiTaskDto) {
        return this.aiTaskService.create(createDto);
    }

    @ApiOperation({ summary: "Get all pending AI tasks" })
    @Get("pending")
    getPending() {
        return this.aiTaskService.findAll(AiTaskState.PENDING);
    }

    @ApiOperation({ summary: "Get AI tasks by state" })
    @Get()
    findAll(@Query("state") state?: string) {
        const typedState = state as AiTask["state"];
        return this.aiTaskService.findAll(typedState);
    }

    @ApiOperation({
        summary: "Update AI task state and optionally dispatch result",
    })
    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateDto: UpdateAiTaskDto & { result?: any }
    ) {
        return this.aiTaskService.updateState(id, updateDto);
    }
}
