import { z } from "zod";
import { dataHash } from "../../../lib/schemas";

export const GetByDataHashDto = z.object({
    data_hash: dataHash,
});

export type GetByDataHashDto = z.infer<typeof GetByDataHashDto>;
