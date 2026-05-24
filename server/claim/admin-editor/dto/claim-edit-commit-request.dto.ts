import { z } from "zod";
import { ClaimEditMetadataSchema } from "./claim-edit-metadata.dto";
import { SentenceOpSchema } from "./sentence-op.dto";

const objectIdRegex = /^[a-f\d]{24}$/i;

// Resolution decisions for ambiguous ops (split/merge w/ active refs).
// Reserved for future intents; currently always empty / absent in MVP.
export const ResolutionDecisionSchema = z.object({
    sentenceChangeIndex: z.number().int().nonnegative(),
    perRef: z.array(
        z.object({
            refType: z.enum([
                "reviewTask",
                "claimReview",
                "verificationRequest",
                "comment",
            ]),
            refId: z.string().min(1),
            action: z.string().min(1),
            childIndex: z.number().int().nonnegative().optional(),
            childIndexes: z.array(z.number().int().nonnegative()).optional(),
        })
    ),
});

export const ClaimEditCommitRequestSchema = z.object({
    baseRevisionId: z.string().regex(objectIdRegex, "Invalid baseRevisionId"),
    metadata: ClaimEditMetadataSchema.optional(),
    sentenceOps: z.array(SentenceOpSchema),
    resolutions: z.array(ResolutionDecisionSchema).optional(),
});

export type ResolutionDecisionDto = z.infer<typeof ResolutionDecisionSchema>;
export type ClaimEditCommitRequestDto = z.infer<
    typeof ClaimEditCommitRequestSchema
>;
