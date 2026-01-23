import { z } from "zod";

export const GetByDataHashDto = z.object({
    data_hash: z.string().min(1).max(255),
});

export type GetByDataHashDto = z.infer<typeof GetByDataHashDto>;
