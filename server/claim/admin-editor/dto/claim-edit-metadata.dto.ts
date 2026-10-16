import { z } from "zod";
import { isoDateTime } from "../../../../lib/schemas";

export const ClaimEditSourceSchema = z.strictObject({
    url: z.url(),
    description: z.string().optional(),
});

export const ClaimEditMetadataSchema = z.strictObject({
    title: z.string().trim().min(1).optional(),
    date: isoDateTime.optional(),
    sources: z.array(ClaimEditSourceSchema).optional(),
});

export type ClaimEditSourceDto = z.infer<typeof ClaimEditSourceSchema>;
export type ClaimEditMetadataDto = z.infer<typeof ClaimEditMetadataSchema>;
