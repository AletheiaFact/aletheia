import { z } from "zod";

const PersonalitySchema = z.object({
    _id: z.any().optional(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    wikidata: z.string(),
    isHidden: z.boolean(),
});

type IPersonality = z.infer<typeof PersonalitySchema>;

const FindAllOptionsSchema = z.object({
    searchText: z.string(),
    pageSize: z.number(),
    language: z.string().optional(),
    skippedDocuments: z.number().optional(),
    nameSpace: z.string().optional(),
});

type IFindAllOptions = z.infer<typeof FindAllOptionsSchema>;

const CombinedListResultSchema = z.object({
    personalities: z.array(PersonalitySchema),
    totalPersonalities: z.number(),
    totalPages: z.number(),
    page: z.number(),
    pageSize: z.number(),
});

type ICombinedListResult = z.infer<typeof CombinedListResultSchema>;

const FindAllResultSchema = z.object({
    totalRows: z.number(),
    processedPersonalities: z.array(PersonalitySchema),
});

type IFindAllResult = z.infer<typeof FindAllResultSchema>;

export type {
    IPersonality,
    IFindAllOptions,
    ICombinedListResult,
    IFindAllResult,
};
