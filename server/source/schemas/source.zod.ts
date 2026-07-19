import { z } from "zod";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";

export const SourcePropsZodSchema = z.object({
    textRange: z.array(z.string()).optional(),
    summary: z.string(),
    classification: z.string(),
    field: z.string().optional(),
    targetText: z.string().optional(),
    sup: z.number().optional(),
    id: z.string().optional(),
    date: z.coerce.date().optional(),
});

export const SourceZodSchema = z.object({
    href: z.string().url(),
    props: SourcePropsZodSchema.optional(),
    targetId: z.string().optional(),
    user: z.string(),
    nameSpace: z.string().default(NameSpaceEnum.Main),
});
