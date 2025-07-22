import {
    Controller,
    Post,
    Get,
    Patch,
    Param,
    Query,
    Body,
} from "@nestjs/common";
import { AiTaskService } from "./ai-task.service";
import { CreateAiTaskDto } from "./dto/create-ai-task.dto";
import { UpdateAiTaskDto } from "./dto/update-ai-task.dto";
import { AiTask } from "./schemas/ai-task.schema";

@Controller("ai-tasks")
export class AiTaskController {
    constructor(private readonly aiTaskService: AiTaskService) {}

    @Post()
    create(@Body() createDto: CreateAiTaskDto) {
        return this.aiTaskService.create(createDto);
    }

    @Get("pending")
    getPending() {
        return this.aiTaskService.findAll("pending");
    }

    @Get()
    findAll(@Query("state") state?: string) {
        const typedState = state as AiTask["state"];
        return this.aiTaskService.findAll(typedState);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateDto: UpdateAiTaskDto & { result?: any }
    ) {
        return this.aiTaskService.updateState(id, updateDto);
    }
}
