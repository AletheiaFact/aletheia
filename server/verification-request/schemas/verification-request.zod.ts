import { z } from "zod";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";

export const VerificationRequestCreateZodSchema = z.object({
    content: z.string().min(10),
    sourceChannel: z.string().default("mcp"),
    source: z.array(z.object({ href: z.string().url() })).optional(),
    publicationDate: z.string().optional(),
    heardFrom: z.string().optional(),
    nameSpace: z.string().default(NameSpaceEnum.Main),
});
