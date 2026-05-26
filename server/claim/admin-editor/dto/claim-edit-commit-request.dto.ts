import { z } from "zod";
import { ClaimEditMetadataSchema } from "./claim-edit-metadata.dto";
import { SentenceOpSchema } from "./sentence-op.dto";

const objectIdRegex = /^[a-f\d]{24}$/i;

export const ClaimEditCommitRequestSchema = z.object({
    baseRevisionId: z.string().regex(objectIdRegex, "Invalid baseRevisionId"),
    metadata: ClaimEditMetadataSchema.optional(),
    sentenceOps: z.array(SentenceOpSchema),
});

export type ClaimEditCommitRequestDto = z.infer<
    typeof ClaimEditCommitRequestSchema
>;
