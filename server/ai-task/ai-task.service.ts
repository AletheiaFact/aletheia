import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, FilterQuery } from "mongoose";
import { AiTaskDocument, AiTaskName, AiTask } from "./schemas/ai-task.schema";
import type { CreateAiTaskDto } from "./dto/create-ai-task.dto";
import type { UpdateAiTaskDto } from "./dto/update-ai-task.dto";
import { CallbackDispatcherService } from "../callback-dispatcher/callback-dispatcher.service";

@Injectable()
export class AiTaskService {
    constructor(
        @InjectModel(AiTaskName)
        private readonly aiTaskModel: Model<AiTaskDocument>,
        private readonly dispatcher: CallbackDispatcherService
    ) {}

    async create(createDto: CreateAiTaskDto): Promise<AiTaskDocument> {
        return this.aiTaskModel.create(createDto);
    }

    async findAll(state?: AiTask["state"]): Promise<AiTaskDocument[]> {
        const filter: FilterQuery<AiTaskDocument> = state ? { state } : {};
        return this.aiTaskModel.find(filter).exec();
    }

    async updateState(
        id: string,
        updateDto: UpdateAiTaskDto & { result?: any }
    ): Promise<AiTaskDocument> {
        const task = await this.aiTaskModel
            .findByIdAndUpdate(id, { state: updateDto.state }, { new: true })
            .exec();

        if (!task) {
            throw new NotFoundException(`AI Task with id ${id} not found`);
        }

        if (updateDto.state === "succeeded" && updateDto.result !== undefined) {
            await this.dispatcher.dispatch(
                task.callbackRoute,
                task.callbackParams,
                updateDto.result
            );
        }

        return task;
    }
}
