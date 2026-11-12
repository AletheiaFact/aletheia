import { z } from "zod";
import {
    captchaToken,
    isoDateTime,
    legacyQueryFlag,
    nonEmptyText,
    objectId,
    pageQuery,
    queryArray,
} from "../../../lib/schemas";
import { ContentModelEnum } from "../../types/enums";

const claimDate = z.union([
    z.iso.datetime({ offset: true, local: true }),
    z.iso.date(),
]);

const requiredContent = z
    .unknown()
    .refine((v) => v !== undefined && v !== null && v !== "", {
        error: "content should not be empty",
    });

const CreateClaimBase = z.strictObject({
    title: nonEmptyText(10_000),
    date: claimDate,
    contentModel: z.enum(ContentModelEnum),
    sources: z.array(z.string()).min(1),
    recaptcha: captchaToken,
    nameSpace: z.string(),
});

export const CreateClaimSchema = CreateClaimBase.extend({
    content: requiredContent,
    personalities: z.array(z.string()).min(1).optional(),
    group: z.string().optional(),
});
export type CreateClaimDto = z.output<typeof CreateClaimSchema>;

export const UpdateClaimSchema = CreateClaimSchema.partial();
export type UpdateClaimDto = z.output<typeof UpdateClaimSchema>;

export const CreateDebateClaimSchema = CreateClaimBase.extend({
    personalities: z.array(z.string()).min(2),
});
export type CreateDebateClaimDto = z.output<typeof CreateDebateClaimSchema>;

export const CreateImageClaimSchema = CreateClaimBase.extend({
    content: z.looseObject({
        DataHash: z.string().optional(),
        FileURL: z.string().optional(),
        Key: z.string().optional(),
        Extension: z.string().optional(),
    }),
    personalities: z.array(z.string()).optional(),
    group: z.string().optional(),
});
export type CreateImageClaimDto = z.output<typeof CreateImageClaimSchema>;

export const CreateUnattributedClaimSchema = CreateClaimBase.extend({
    content: requiredContent,
    recaptcha: captchaToken.optional(),
    personalities: z.array(z.string()).optional(),
    group: z.string().optional(),
});
export type CreateUnattributedClaimDto = z.output<
    typeof CreateUnattributedClaimSchema
>;

export const UpdateDebateSchema = z.strictObject({
    content: z.string(),
    personality: z.string(),
    isLive: z.boolean(),
});
export type UpdateDebateDto = z.output<typeof UpdateDebateSchema>;

export const UpdateHiddenStatusSchema = z.strictObject({
    isHidden: z.boolean(),
    recaptcha: captchaToken,
    description: z.string().optional(),
});
export type UpdateHiddenStatusDto = z.output<typeof UpdateHiddenStatusSchema>;

// Filters shared by the repository page's claim and review lists.
export const repositoryFilterFields = {
    q: z
        .string()
        .trim()
        .max(100)
        .optional()
        .transform((value) => value || undefined)
        .meta({ description: "Text search, case-insensitive" }),
    contentModel: queryArray(z.enum(ContentModelEnum)).optional(),
    startDate: isoDateTime.optional(),
    endDate: isoDateTime.optional(),
};

export const ListClaimsQuerySchema = z.strictObject({
    page: pageQuery,
    pageSize: z.coerce.number().min(0),
    order: z.string(),
    language: z.string().regex(/^[a-zA-Z]+$/),
    personality: z.string().optional(),
    isHidden: legacyQueryFlag,
    nameSpace: z.string().optional(),
    ...repositoryFilterFields,
    topic: objectId.optional(),
    reviewStatus: z.enum(["with", "without"]).optional(),
    sortBy: z
        .enum(["id", "date"])
        .optional()
        .meta({ description: "date sorts by the claim's own date" }),
});
export type ListClaimsQueryDto = z.output<typeof ListClaimsQuerySchema>;

export const GetClaimQuerySchema = z.object({
    nameSpace: z.string().optional(),
});
export type GetClaimQueryDto = z.output<typeof GetClaimQuerySchema>;

export const ClaimCreatePageQuerySchema = z.object({
    personality: z.string().optional(),
    verificationRequest: z.string().optional(),
});
export type ClaimCreatePageQueryDto = z.output<
    typeof ClaimCreatePageQuerySchema
>;

export const SentenceTopicsSchema = z.array(
    z.union([
        z.string(),
        z.looseObject({
            id: z.string().optional(),
            label: z.string().optional(),
            value: z.string().optional(),
        }),
    ])
);
export type SentenceTopicsDto = z.output<typeof SentenceTopicsSchema>;
