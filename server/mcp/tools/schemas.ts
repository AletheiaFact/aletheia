import { z } from "zod";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";
import { ReviewTaskTypeEnum } from "../../types/enums";
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
    reviewTaskType: z.nativeEnum(ReviewTaskTypeEnum),
    nameSpace,
});

export const GetReviewTaskSchema = z.object({
    reviewTaskId: z.string().describe("Review task Mongo ObjectId"),
});

export const ListVerificationRequestsSchema = z.object({
    ...pagination,
    topics: z.array(z.string()).optional(),
    status: z.string().optional(),
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
    dataHash: z.string().describe("The review task's data_hash"),
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
    personalityId: z
        .string()
        .describe("Personality (author) Mongo ObjectId"),
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
