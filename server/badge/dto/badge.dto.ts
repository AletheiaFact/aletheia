import { z } from "zod";
import { isoDateTime } from "../../../lib/schemas";

const BadgeImageSchema = z.looseObject({ _id: z.string().optional() });

const BadgeUserSchema = z.looseObject({
    _id: z.string(),
    name: z.string().optional(),
    role: z.record(z.string(), z.unknown()).optional(),
    badges: z.array(z.looseObject({ _id: z.unknown() })),
});

export const CreateBadgeSchema = z.strictObject({
    name: z.string().min(1),
    description: z.string().min(1),
    image: BadgeImageSchema,
    created_at: isoDateTime,
    users: z.array(BadgeUserSchema).optional(),
});
export type CreateBadgeDto = z.output<typeof CreateBadgeSchema>;

export const UpdateBadgeSchema = z.strictObject({
    _id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    image: BadgeImageSchema,
    users: z.array(BadgeUserSchema),
});
export type UpdateBadgeDto = z.output<typeof UpdateBadgeSchema>;
