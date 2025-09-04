import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, isValidObjectId } from "mongoose";
import { AiTaskDocument, AiTaskName } from "./schemas/ai-task.schema";
import type { CreateAiTaskDto } from "./dto/create-ai-task.dto";
import type { UpdateAiTaskDto } from "./dto/update-ai-task.dto";
import { CallbackDispatcherService } from "../callback-dispatcher/callback-dispatcher.service";
import { AiTaskState } from "./constants/ai-task.constants";

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

    async findAll(state?: AiTaskState): Promise<AiTaskDocument[]> {
        if (state) {
            if (!Object.values(AiTaskState).includes(state)) {
                throw new BadRequestException(
                    `Invalid state: ${state}. Must be one of ${Object.values(
                        AiTaskState
                    ).join(", ")}`
                );
            }
            return this.aiTaskModel.find({ state }).exec();
        }

        return this.aiTaskModel.find({}).exec();
    }

    async updateState(
        id: string,
        updateDto: UpdateAiTaskDto & { result?: any }
    ): Promise<AiTaskDocument> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`Invalid task id: ${id}`);
        }

        if (!Object.values(AiTaskState).includes(updateDto.state)) {
            throw new BadRequestException(
                `Invalid state: ${
                    updateDto.state
                }. Must be one of ${Object.values(AiTaskState).join(", ")}`
            );
        }

        const task = await this.aiTaskModel
            .findByIdAndUpdate(
                id,
                { $set: { state: updateDto.state } },
                { new: true }
            )
            .exec();

        if (!task) {
            throw new NotFoundException(`AI Task with id ${id} not found`);
        }

        if (
            updateDto.state === AiTaskState.SUCCEEDED &&
            updateDto.result !== undefined
        ) {
            await this.dispatcher.dispatch(
                task.callbackRoute,
                task.callbackParams,
                updateDto.result
            );
        }

        return task;
    }
}
