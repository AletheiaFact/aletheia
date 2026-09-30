import { z } from "zod";
import { objectId } from "../../../../lib/schemas";
import { ClaimEditMetadataSchema } from "./claim-edit-metadata.dto";
import { SentenceOpSchema } from "./sentence-op.dto";

export const ClaimEditCommitRequestSchema = z.strictObject({
    baseRevisionId: objectId,
    metadata: ClaimEditMetadataSchema.optional(),
    sentenceOps: z.array(SentenceOpSchema),
});

export type ClaimEditCommitRequestDto = z.infer<
    typeof ClaimEditCommitRequestSchema
>;
