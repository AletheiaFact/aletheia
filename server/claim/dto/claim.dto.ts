import { z } from "zod";
import {
    captchaToken,
    entityId,
    isoDateTime,
    legacyQueryFlag,
    nonEmptyText,
    pageQuery,
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

export const DEBATE_APPEND_MAX_TURNS = 50;

const DebateTranscriptTurnSchema = z.strictObject({
    personality: entityId.meta({
        description: "Speaker. Must be one of the debate's personalities.",
    }),
    text: nonEmptyText(20_000).meta({
        description: "Transcript text of the turn. Parsed into sentences.",
    }),
    externalId: nonEmptyText(200).optional().meta({
        description:
            "Caller-side id of the turn. A turn whose externalId is already on the debate is skipped.",
    }),
    startedAt: isoDateTime.optional().meta({
        description: "When the turn started in the source recording.",
    }),
});

export const AppendDebateTranscriptSchema = z.strictObject({
    turns: z
        .array(DebateTranscriptTurnSchema)
        .min(1)
        .max(DEBATE_APPEND_MAX_TURNS)
        .refine(
            (turns) => {
                const ids = turns
                    .map((turn) => turn.externalId)
                    .filter((id) => id !== undefined);
                return new Set(ids).size === ids.length;
            },
            { error: "externalId must be unique within a request" }
        )
        .meta({ description: "Turns appended to the debate in array order." }),
    isLive: z.boolean().optional(),
});
export type AppendDebateTranscriptDto = z.output<
    typeof AppendDebateTranscriptSchema
>;

export const UpdateHiddenStatusSchema = z.strictObject({
    isHidden: z.boolean(),
    recaptcha: captchaToken,
    description: z.string().optional(),
});
export type UpdateHiddenStatusDto = z.output<typeof UpdateHiddenStatusSchema>;

export const ListClaimsQuerySchema = z.strictObject({
    page: pageQuery,
    pageSize: z.coerce.number().min(0),
    order: z.string(),
    language: z.string().regex(/^[a-zA-Z]+$/),
    personality: z.string().optional(),
    isHidden: legacyQueryFlag,
    nameSpace: z.string().optional(),
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
