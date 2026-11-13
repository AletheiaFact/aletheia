import { z } from "zod";
import { objectId } from "../../../../lib/schemas";
import { CommentEnum } from "../schema/comment.schema";

/**
 * Fields a comment update may change. Both update paths (PUT
 * api/comment/:id and the bulk update, which also runs when a review task
 * saves its comments) pass full comment objects, so unknown keys such as
 * `_id`, `replies` or `targetId` are stripped instead of rejected. Each
 * value must be a primitive, so a payload like `{ "text": { "$gt": "" } }`
 * can't reach the `$set` update as a query operator.
 */
export const UpdateCommentFieldsSchema = z.object({
    comment: z.string().optional(),
    text: z.string().optional(),
    from: z.number().nullish(),
    to: z.number().nullish(),
    resolved: z.boolean().optional(),
    type: z.enum(CommentEnum).optional(),
    user: z.union([objectId, z.object({ _id: objectId })]).optional(),
});

export type UpdateCommentFields = z.output<typeof UpdateCommentFieldsSchema>;
