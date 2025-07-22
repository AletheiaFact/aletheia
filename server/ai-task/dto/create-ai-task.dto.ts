import { AiTaskZodSchema } from "../schemas/ai-task.schema";
import { z } from "zod";

export const CreateAiTaskDtoZ = AiTaskZodSchema.pick({
    type: true,
    content: true,
    callbackRoute: true,
    callbackParams: true,
});
export type CreateAiTaskDto = z.infer<typeof CreateAiTaskDtoZ>;
