import { z } from "zod";
import {
    entityId,
    legacyQueryFlag,
    pageQuery,
    pageSizeQuery,
    queryArray,
    queryInt,
    sortOrder,
} from "../../../lib/schemas";
import { ContentModelEnum } from "../../types/enums";
import { VerificationRequestStatus } from "./types";

const ImpactAreaSchema = z.union([
    z.string(),
    z.looseObject({
        label: z.string().optional(),
        value: z.string().optional(),
    }),
]);

const SourceInputSchema = z.looseObject({ href: z.string().optional() });

export const CreateVerificationRequestSchema = z.strictObject({
    content: z.string(),
    sourceChannel: z.string(),
    reportType: z.enum(ContentModelEnum).optional(),
    impactArea: ImpactAreaSchema.optional(),
    source: z.array(SourceInputSchema).optional(),
    publicationDate: z.string().optional(),
    email: z.string().optional(),
    date: z.coerce.date().optional(),
    heardFrom: z.string().optional(),
    nameSpace: z.string().optional(),
    recaptcha: z.string().optional(),
    embedding: z.array(z.number()).optional(),
});
export type CreateVerificationRequestDto = z.output<
    typeof CreateVerificationRequestSchema
>;

export const UpdateVerificationRequestSchema =
    CreateVerificationRequestSchema.partial().extend({
        targetId: z.string().optional(),
        group: z.array(z.unknown()).nullable().optional(),
        usersId: z.array(z.string()).optional(),
        isSensitive: z.boolean().optional(),
        rejected: legacyQueryFlag,
        status: z.enum(VerificationRequestStatus).optional(),
    });
export type UpdateVerificationRequestDto = z.output<
    typeof UpdateVerificationRequestSchema
>;

export const ListVerificationRequestsQuerySchema = z.object({
    page: pageQuery.default(0),
    pageSize: pageSizeQuery(100).default(10),
    order: sortOrder.default("desc"),
    contentFilters: queryArray(z.string()).default([]),
    topics: queryArray(z.string()).default([]),
    status: queryArray(z.string()).optional(),
    impactArea: queryArray(z.string()).optional(),
    severity: z.string().optional(),
    sourceChannel: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});
export type ListVerificationRequestsQueryDto = z.output<
    typeof ListVerificationRequestsQuerySchema
>;

export const SearchVerificationRequestsQuerySchema = z.object({
    sourceUrl: z.string().optional(),
    searchContent: z.string().optional(),
    pageSize: queryInt.min(1).max(100).optional(),
});
export type SearchVerificationRequestsQueryDto = z.output<
    typeof SearchVerificationRequestsQuerySchema
>;

export const PersonalitiesQuerySchema = z.object({
    language: z.string().default("en"),
});

export { entityId as VerificationRequestIdParam };
export const DataHashParam = z.string().min(1);

// The topic drawer sends wikidata picks, persisted topic documents or bare
// strings in one array; the service only reads value / wikidataId.
export const VerificationRequestTopicsSchema = z.array(
    z.union([
        z.string(),
        z.looseObject({
            value: z.string().optional(),
            wikidataId: z.string().optional(),
        }),
    ])
);
export type VerificationRequestTopicsDto = z.output<
    typeof VerificationRequestTopicsSchema
>;

export const RemoveFromGroupSchema = z.strictObject({ group: entityId });
