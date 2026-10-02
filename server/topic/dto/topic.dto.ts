import { z } from "zod";
import { queryInt } from "../../../lib/schemas";
import { ContentModelEnum } from "../../types/enums";

export const GetTopicsQuerySchema = z.object({
    topicName: z.string(),
});
export type GetTopicsQueryDto = z.output<typeof GetTopicsQuerySchema>;

export const SearchTopicsQuerySchema = z.object({
    query: z.string(),
    limit: queryInt.min(1).max(100).default(10),
    language: z.string().default("pt"),
});
export type SearchTopicsQueryDto = z.output<typeof SearchTopicsQuerySchema>;

// A wikidata pick ({ label, value }), a bare name, or a { slug } reference.
const TopicInputSchema = z.union([
    z.string(),
    z.object({
        label: z.string().optional(),
        value: z.string().optional(),
        aliases: z.array(z.string()).optional(),
        slug: z.string().optional(),
    }),
]);

export const CreateTopicsSchema = z.strictObject({
    contentModel: z.enum(ContentModelEnum).optional(),
    topics: z.array(TopicInputSchema),
    data_hash: z.string().optional(),
});
export type CreateTopicsDto = z.output<typeof CreateTopicsSchema>;
