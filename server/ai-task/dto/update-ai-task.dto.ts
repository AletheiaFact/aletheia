import { z } from "zod";
import { AiTaskState } from "../constants/ai-task.constants";

export const UpdateAiTaskDtoZ = z.object({
    state: z.nativeEnum(AiTaskState),
    result: z.any().optional(),
});

export type UpdateAiTaskDto = z.infer<typeof UpdateAiTaskDtoZ>;
