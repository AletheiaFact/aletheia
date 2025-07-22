import { z } from "zod";

export const UpdateAiTaskDtoZ = z.object({
    state: z.enum(["pending", "in_progress", "succeeded", "failed"]),
});
export type UpdateAiTaskDto = z.infer<typeof UpdateAiTaskDtoZ>;
