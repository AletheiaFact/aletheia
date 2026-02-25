import { z } from "zod";

export const GetByDataHashDto = z.object({
    data_hash: z.string().regex(/^[a-f0-9]{32}$/i),
});

export type GetByDataHashDto = z.infer<typeof GetByDataHashDto>;
