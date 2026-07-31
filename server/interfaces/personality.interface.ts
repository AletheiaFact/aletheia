import { z } from "zod";

const PersonalitySchema = z.object({
    _id: z.any().optional(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    wikidata: z.string(),
    isHidden: z.boolean(),
});

export type IPersonality = z.infer<typeof PersonalitySchema>;

const FindAllOptionsSchema = z.object({
    searchText: z.string(),
    pageSize: z.number(),
    language: z.string().optional(),
    skippedDocuments: z.number().optional(),
    nameSpace: z.string().optional(),
});

export type IFindAllOptions = z.infer<typeof FindAllOptionsSchema>;

const CombinedListResultSchema = z.object({
    personalities: z.array(PersonalitySchema),
    totalPersonalities: z.number(),
    totalPages: z.number(),
    page: z.number(),
    pageSize: z.number(),
});

export type ICombinedListResult = z.infer<typeof CombinedListResultSchema>;

const FindAllResultSchema = z.object({
    totalRows: z.number(),
    processedPersonalities: z.array(PersonalitySchema),
});

export type IFindAllResult = z.infer<typeof FindAllResultSchema>;

const PersonalityCreateInputSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    wikidata: z.string().optional(),
    isHidden: z.boolean().optional(),
});

export type IPersonalityCreateInput = z.infer<
    typeof PersonalityCreateInputSchema
>;

const PersonalityUpdateInputSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    wikidata: z.string().optional(),
    isHidden: z.boolean().optional(),
});

export type IPersonalityUpdateInput = z.infer<
    typeof PersonalityUpdateInputSchema
>;

const PersonalityListQuerySchema = z.object({
    page: z.number().int().nonnegative().optional(),
    pageSize: z.number().int().positive().optional(),
    order: z.string().optional(),
    name: z.string().optional(),
    isHidden: z.boolean().optional(),
    language: z.string().optional(),
    withSuggestions: z.boolean().optional(),
    filter: z.string().optional(),
    fetchOnly: z.boolean().optional(),
    nameSpace: z.string().optional(),
});

export type IPersonalityListQuery = z.infer<typeof PersonalityListQuerySchema>;

const PersonalityGetByIdOptionsSchema = z.object({
    language: z.string().optional(),
    nameSpace: z.string().optional(),
});

export type IPersonalityGetByIdOptions = z.infer<
    typeof PersonalityGetByIdOptionsSchema
>;

const PersonalityFindOrCreateInputSchema = z.object({
    name: z.string(),
    wikidata: z
        .object({
            id: z.string().optional(),
            label: z.string().optional(),
            description: z.string().optional(),
        })
        .optional(),
});

export type IPersonalityFindOrCreateInput = z.infer<
    typeof PersonalityFindOrCreateInputSchema
>;

export type IPersonalityListResult = ICombinedListResult;
export type IPersonalityFindAllResult = IFindAllResult;
