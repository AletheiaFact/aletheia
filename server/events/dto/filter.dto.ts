import { z } from "zod";
import { pageQuery, pageSizeQuery, sortOrder } from "../../../lib/schemas";
import { EventsStatus } from "../../types/enums";

// Strict to keep parity with the legacy class DTO (forbidNonWhitelisted).
export const FilterEventsQuerySchema = z.strictObject({
    page: pageQuery.default(0),
    pageSize: pageSizeQuery(100).default(10),
    order: sortOrder.default("asc"),
    status: z.enum(EventsStatus).optional(),
});
export type FilterEventsQueryDto = z.output<typeof FilterEventsQuerySchema>;
