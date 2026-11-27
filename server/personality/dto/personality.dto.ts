import { z } from "zod";
import { entityId, nonEmptyText, wikidataId } from "../../../lib/schemas";

// The name and description come from Wikidata at creation; the client only
// says which item.
export const CreatePersonalitySchema = z.strictObject({
    wikidata: wikidataId.meta({ description: "Wikidata item id, e.g. Q76" }),
});
export type CreatePersonalityDto = z.output<typeof CreatePersonalitySchema>;

// Admin edit of the stored fallback values. isHidden has its own endpoint.
export const UpdatePersonalitySchema = z
    .strictObject({
        name: nonEmptyText(200)
            .meta({ description: "Stored name, shown when Wikidata has none" })
            .optional(),
        description: nonEmptyText(1000)
            .meta({
                description: "Stored description, shown when Wikidata has none",
            })
            .optional(),
        wikidata: wikidataId
            .meta({ description: "Relink to another Wikidata item, e.g. Q76" })
            .optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
        error: "Send at least one of name, description, wikidata",
    })
    .meta({ description: "Send at least one of name, description, wikidata" });
export type UpdatePersonalityDto = z.output<typeof UpdatePersonalitySchema>;

// Mongo ObjectId today; uuid on Postgres.
export const PersonalityIdParam = entityId;
