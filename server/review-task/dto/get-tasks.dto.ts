import { z } from "zod";
import {
    isoDateTime,
    pageQuery,
    pageSizeQuery,
    queryBoolean,
} from "../../../lib/schemas";
import { ReviewTaskTypeEnum } from "../../types/enums";

export const GET_TASKS_MAX_PAGE_SIZE = 100;

export const GetTasksQuerySchema = z.strictObject({
    page: pageQuery,
    pageSize: pageSizeQuery(GET_TASKS_MAX_PAGE_SIZE),
    order: z.string(),
    value: z.string(),
    filterUser: z
        .strictObject({
            assigned: queryBoolean.default(false),
            crossChecked: queryBoolean.default(false),
            reviewed: queryBoolean.default(false),
        })
        .optional(),
    nameSpace: z.string().optional(),
    reviewTaskType: z.enum(ReviewTaskTypeEnum),
    startDate: isoDateTime
        .optional()
        .meta({ description: "Only tasks created on or after this day" }),
    endDate: isoDateTime
        .optional()
        .meta({ description: "Only tasks created on or before this day" }),
});
export type GetTasksQueryDto = z.output<typeof GetTasksQuerySchema>;
