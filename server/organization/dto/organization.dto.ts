import { z } from "zod";
import {
    dataHash,
    nonEmptyText,
    objectId,
    queryInt,
} from "../../../lib/schemas";

// deriveOrganizationSlug needs at least one letter or digit to build a slug.
const organizationName = nonEmptyText(120).regex(/[\p{L}\p{N}]/u, {
    error: "Name must contain a letter or a digit",
});

const website = z.url({ protocol: /^https?$/, error: "Invalid website URL" });

// An Image document the client already has (e.g. returned by POST api/image
// when the same file was uploaded before).
const ExistingImageSchema = z.looseObject({ _id: objectId });

// A fresh POST api/image upload result, persisted via ImageService.create.
const UploadedImageSchema = z.strictObject({
    FileURL: z.url({ protocol: /^https?$/ }),
    Key: z.string().min(1),
    Extension: z.string().min(1),
    DataHash: dataHash,
});

export const OrganizationLogoSchema = z.union([
    ExistingImageSchema,
    UploadedImageSchema,
]);
export type OrganizationLogoDto = z.output<typeof OrganizationLogoSchema>;

export const CreateOrganizationSchema = z.strictObject({
    name: organizationName,
    website: website.optional(),
    logo: OrganizationLogoSchema,
});
export type CreateOrganizationDto = z.output<typeof CreateOrganizationSchema>;

// "" clears the website, the only field that can be removed once set.
export const UpdateOrganizationSchema =
    CreateOrganizationSchema.partial().extend({
        website: website.or(z.literal("")).optional(),
    });
export type UpdateOrganizationDto = z.output<typeof UpdateOrganizationSchema>;

export const SearchOrganizationsQuerySchema = z.object({
    name: nonEmptyText(120),
    limit: queryInt.min(1).max(20).default(10),
});
export type SearchOrganizationsQueryDto = z.output<
    typeof SearchOrganizationsQuerySchema
>;
