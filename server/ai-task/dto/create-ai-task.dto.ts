import { z } from "zod";
import { AiTaskType, CallbackRoute } from "../constants/ai-task.constants";
import { validateTaskContent } from "../schemas/ai-task.schema";

export const CreateAiTaskDtoZ = z
    .object({
        type: z.nativeEnum(AiTaskType),
        content: z.unknown(),
        callbackRoute: z.nativeEnum(CallbackRoute),
        callbackParams: z.object({
            targetId: z.string().min(1),
            field: z.string().min(1),
        }),
    })
    .refine(
        (data) => {
            try {
                validateTaskContent(data.type, data.content);
                return true;
            } catch {
                return false;
            }
        },
        { message: "Invalid content for the specified task type" }
    );

export type CreateAiTaskDto = z.infer<typeof CreateAiTaskDtoZ>;
