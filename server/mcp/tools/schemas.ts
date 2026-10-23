import { z } from "zod";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";
import { ReviewTaskTypeEnum } from "../../types/enums";
import { ClassificationEnum } from "../../claim-review/dto/create-claim-review.dto";
import { dataHash, nonEmptyText } from "../../../lib/schemas";
import { PersonalitySchema } from "../../interfaces/personality.interface";
import { SourceZodSchema } from "../../source/schemas/source.zod";
import { ClaimCreateZodSchema } from "../../claim/schemas/claim.zod";
import { VerificationRequestCreateZodSchema } from "../../verification-request/schemas/verification-request.zod";

// Entity-shaped create inputs below are derived (.pick/.extend) from the
// canonical Zod schema colocated with each module (personality, source,
// claim, verification-request) so entity fields are single-sourced and
// can't drift between the MCP tool layer and the rest of the app. Only
// tool-specific query/pagination/search shapes are declared locally here,
// since those aren't entities.

const pagination = {
    page: z.number().int().min(0).default(0),
    pageSize: z.number().int().min(1).max(50).default(10),
    order: z.enum(["asc", "desc"]).default("desc"),
};

const nameSpace = z.string().default(NameSpaceEnum.Main);

export const SearchSchema = z.object({
    searchText: z.string().min(1).describe("Free-text search query"),
    pageSize: pagination.pageSize,
    language: z.string().default("pt").describe("Result language (pt or en)"),
    nameSpace,
});

export const ListClaimsSchema = z.object({
    ...pagination,
    personalityId: z
        .string()
        .optional()
        .describe("Filter claims by personality id"),
    nameSpace,
});

export const GetClaimSchema = z.object({
    claimId: z.string().describe("Claim Mongo ObjectId"),
    nameSpace,
});

export const ListPersonalitiesSchema = z.object({
    ...pagination,
    language: z.string().default("pt"),
    nameSpace,
});

export const GetPersonalitySchema = z.object({
    personalityId: z.string().describe("Personality Mongo ObjectId"),
    language: z.string().default("pt"),
    nameSpace,
});

// Plain object (no .refine) so the SDK can emit the field list in
// tools/list — a ZodEffects wrapper has no `.shape`, which would advertise
// empty params (I1). The "at least one of" rule is enforced in the handler.
export const GetClaimReviewSchema = z.object({
    claimReviewId: z.string().optional(),
    dataHash: z
        .string()
        .optional()
        .describe("The review's data_hash (sentence/content hash)"),
});

export const ListReviewTasksSchema = z.object({
    ...pagination,
    value: z
        .string()
        .default("")
        .describe(
            "Workflow state filter, e.g. unassigned, assigned, reported, published"
        ),
    reviewTaskType: z.enum(ReviewTaskTypeEnum),
    mine: z
        .enum(["assigned", "crossChecked", "reviewed"])
        .optional()
        .describe(
            "Only tasks where you are an assignee, the cross-checker or the reviewer"
        ),
    nameSpace,
});

const reviewTaskDataHash = dataHash.describe(
    "data_hash of the review task (its claim sentence)"
);

export const NamespaceOnlySchema = z.object({ nameSpace });

export const ReviewTaskByHashSchema = z.object({
    dataHash: reviewTaskDataHash,
});

export const SubmitReportSchema = z.object({
    dataHash: reviewTaskDataHash,
    // Optional with the default applied in the handler: Zod 4 marks
    // .default() fields required in the JSON Schema sent to the model.
    sendToCrossCheck: z
        .boolean()
        .optional()
        .describe(
            "Also send the report to the cross-check backlog in the same call (default false)"
        ),
});

export const ListMyReviewTasksSchema = z.object({
    page: pagination.page,
    pageSize: pagination.pageSize,
    nameSpace,
});

export const GetReviewTaskSchema = z.object({
    reviewTaskId: z.string().describe("Review task Mongo ObjectId"),
});

export const ListVerificationRequestsSchema = z.object({
    ...pagination,
    topics: z.array(z.string()).optional(),
    status: z.array(z.string()).optional(),
});

export const GetVerificationRequestSchema = z.object({
    verificationRequestId: z.string(),
});

export const SearchTopicsSchema = z.object({
    query: z.string().min(1),
    language: z.string().default("pt"),
});

export const ListSourcesSchema = z.object({
    ...pagination,
    nameSpace,
});

export const CreateVerificationRequestSchema =
    VerificationRequestCreateZodSchema;

export const AddReviewCommentSchema = z.object({
    dataHash: reviewTaskDataHash,
    comment: z.string().min(1).describe("Comment rich-text/plain content"),
    text: z.string().min(1).describe("Plain-text version of the comment"),
});

export const CreateClaimSchema = ClaimCreateZodSchema.pick({
    title: true,
    content: true,
    date: true,
    sources: true,
    nameSpace: true,
}).extend({
    personalityId: z.string().describe("Personality (author) Mongo ObjectId"),
});

export const StartReviewTaskSchema = z.object({
    claimId: z.string().describe("Claim Mongo ObjectId"),
    dataHash: dataHash.describe("data_hash of the claim sentence to review"),
    nameSpace,
});

export const CreatePersonalitySchema = PersonalitySchema.pick({
    name: true,
    description: true,
    wikidata: true,
}).extend({
    name: z.string().min(2),
});

export const CreateSourceSchema = SourceZodSchema.pick({
    href: true,
    targetId: true,
    nameSpace: true,
});

// ClassificationEnum is numeric; the stored label is its key ("false",
// "trustworthy-but", ...).
const classification = z.enum(
    Object.keys(ClassificationEnum).filter((key) =>
        Number.isNaN(Number(key))
    ) as [string, ...string[]]
);

// Review Log (the review form). Text fields map to the web form:
// summary = "Resumo da conclusão", questions = "Quais perguntas a verificação
// deverá responder?", report = "Relatório da verificação", verification =
// "Como verificamos?". Every field is optional so drafts can be saved in
// parts; submit_report checks completeness.
export const REVIEW_LOG_SOURCE_FIELDS = [
    "summary",
    "report",
    "verification",
] as const;

const reviewLogSource = z.object({
    href: z
        .url({ protocol: /^https?$/ })
        .describe("Source URL (http or https)"),
    field: z
        .enum(REVIEW_LOG_SOURCE_FIELDS)
        .optional()
        .describe("Form field the source supports; required with quotedText"),
    quotedText: nonEmptyText(300)
        .optional()
        .describe(
            "Exact words from that field that this source backs; they become the link. Omit to add the source at the end of the field"
        ),
});

export const SaveReviewLogSchema = z.object({
    dataHash: reviewTaskDataHash,
    classification: classification.optional().describe("Label (etiqueta)"),
    summary: nonEmptyText(3000)
        .optional()
        .describe("Resumo da conclusão: 2-3 sentences"),
    questions: z
        .array(nonEmptyText(500))
        .min(1)
        .max(10)
        .optional()
        .describe(
            "Guiding questions (perguntas norteadoras); replaces the list"
        ),
    report: nonEmptyText(20000)
        .optional()
        .describe("Relatório da verificação; paragraphs separated by \n"),
    verification: nonEmptyText(5000)
        .optional()
        .describe("Como verificamos? (method)"),
    sources: z
        .array(reviewLogSource)
        .max(30)
        .optional()
        .describe("Sources; replaces the whole list"),
});

export const ReleaseReviewTaskSchema = z.object({
    dataHash: reviewTaskDataHash,
    reason: z
        .enum(["not-checkable", "needs-human", "duplicate", "other"])
        .describe("Why the task is given back"),
    note: nonEmptyText(1000).optional().describe("Short explanation"),
});

export const SubmitCrossCheckSchema = z.object({
    dataHash: reviewTaskDataHash,
    classification: classification.describe("Your own label after re-checking"),
    comment: nonEmptyText(5000).describe(
        "What you verified; on disagreement, the exact problem and the source that shows it"
    ),
});

export const RejectReviewTaskSchema = z.object({
    dataHash: reviewTaskDataHash,
    rejectionComment: nonEmptyText(5000).describe(
        "What must change before the review can be published"
    ),
});
