import { z } from "zod";

export const ClaimEditSourceSchema = z.object({
    url: z.string().url(),
    description: z.string().optional(),
});

export const ClaimEditMetadataSchema = z.object({
    title: z.string().trim().min(1).optional(),
    date: z.string().datetime({ offset: true }).optional(),
    sources: z.array(ClaimEditSourceSchema).optional(),
});

export type ClaimEditSourceDto = z.infer<typeof ClaimEditSourceSchema>;
export type ClaimEditMetadataDto = z.infer<typeof ClaimEditMetadataSchema>;
