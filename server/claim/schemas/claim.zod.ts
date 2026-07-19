import { z } from "zod";
import { ContentModelEnum } from "../../types/enums";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";

export const ClaimCreateZodSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    date: z.string(),
    contentModel: z.nativeEnum(ContentModelEnum),
    personalities: z.array(z.string()).min(1),
    sources: z.array(z.string().url()).min(1),
    nameSpace: z.string().default(NameSpaceEnum.Main),
});
