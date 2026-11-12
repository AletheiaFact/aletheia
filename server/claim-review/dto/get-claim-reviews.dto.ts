import { z } from "zod";
import {
    legacyQueryFlag,
    objectId,
    pageQuery,
    pageSizeQuery,
    queryArray,
    queryBoolean,
} from "../../../lib/schemas";
import { isClassificationKey } from "../../../lib/classification";
import { METHODOLOGY_IDS } from "../../../lib/classification-methodology";
import { repositoryFilterFields } from "../../claim/dto/claim.dto";

const classificationKey = z
    .string()
    .refine(isClassificationKey, { error: "Invalid classification" });

// Ported from the class-validator DTO, which was strict.
export const ListClaimReviewsQuerySchema = z.strictObject({
    page: pageQuery,
    pageSize: pageSizeQuery(100),
    order: z.string(),
    isHidden: legacyQueryFlag,
    latest: legacyQueryFlag,
    nameSpace: z.string(),
    mainTopicId: objectId.optional(),
    ...repositoryFilterFields,
    personality: objectId.optional(),
    classification: queryArray(classificationKey).optional(),
    classificationMethodology: z.enum(METHODOLOGY_IDS).optional(),
    withCounts: queryBoolean
        .optional()
        .meta({ description: "Also return contentModelCounts" }),
});
export type ListClaimReviewsQueryDto = z.output<
    typeof ListClaimReviewsQuerySchema
>;
