import { z } from "zod";
import { queryInt } from "../../../lib/schemas";

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
    // Free-form on purpose: the review UI forwards the target's contentModel
    // verbatim, including non-claim targets ("VerificationRequest"), and the
    // service only switches on Image / truthy / falsy.
    contentModel: z.string().nullish(),
    topics: z.array(TopicInputSchema),
    data_hash: z.string().optional(),
});
export type CreateTopicsDto = z.output<typeof CreateTopicsSchema>;
