import { z } from "zod";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";
import { ReviewTaskTypeEnum } from "../../types/enums";

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

export const GetClaimReviewSchema = z
    .object({
        claimReviewId: z.string().optional(),
        dataHash: z
            .string()
            .optional()
            .describe("The review's data_hash (sentence/content hash)"),
    })
    .refine((value) => value.claimReviewId || value.dataHash, {
        message: "Provide claimReviewId or dataHash",
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

export const CreateVerificationRequestSchema = z.object({
    content: z.string().min(10).describe("The content to be verified"),
    sourceChannel: z.string().default("mcp"),
    source: z
        .array(z.object({ href: z.string().url() }))
        .optional()
        .describe("URLs where the content circulates"),
    publicationDate: z.string().optional(),
    heardFrom: z.string().optional(),
    nameSpace,
});

export const AddReviewCommentSchema = z.object({
    dataHash: z.string().describe("The review task's data_hash"),
    comment: z.string().min(1).describe("Comment rich-text/plain content"),
    text: z.string().min(1).describe("Plain-text version of the comment"),
});

export const CreateClaimSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(10).describe("The speech/claim text"),
    date: z.string().describe("ISO date the claim was made"),
    personalityId: z
        .string()
        .describe("Personality (author) Mongo ObjectId"),
    sources: z.array(z.string().url()).min(1),
    nameSpace,
});

export const CreatePersonalitySchema = z.object({
    name: z.string().min(2),
    description: z.string(),
    wikidata: z.string().describe("Wikidata entity id, e.g. Q123"),
});

export const CreateSourceSchema = z.object({
    href: z.string().url(),
    targetId: z.string().optional().describe("Claim/target ObjectId"),
    nameSpace,
});
