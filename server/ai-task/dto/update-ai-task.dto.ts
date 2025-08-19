import { z } from "zod";
import { AiTaskState } from "../constants/ai-task.constants";

const MAX_RESULT_SIZE = 10 * 1024 * 1024;

export const UpdateAiTaskDtoZ = z.object({
    state: z.nativeEnum(AiTaskState),
    result: z
        .any()
        .optional()
        .refine(
            (value) => {
                if (value === undefined) return true;

                try {
                    const serialized = JSON.stringify(value);
                    return serialized.length <= MAX_RESULT_SIZE;
                } catch {
                    return false;
                }
            },
            {
                message: `Result data exceeds maximum size of ${
                    MAX_RESULT_SIZE / 1024 / 1024
                }MB`,
            }
        ),
});

export type UpdateAiTaskDto = z.infer<typeof UpdateAiTaskDtoZ>;
