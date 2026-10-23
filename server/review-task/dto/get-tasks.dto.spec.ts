import { GetTasksQuerySchema } from "./get-tasks.dto";
import { ReviewTaskService } from "../review-task.service";

// What axios + qs deliver for the kanban column request.
const kanbanQuery = {
    page: "0",
    pageSize: "10",
    order: "asc",
    value: "assigned",
    filterUser: { assigned: "false", crossChecked: "false", reviewed: "true" },
    reviewTaskType: "Claim",
    nameSpace: "main",
};

describe("GetTasksQuerySchema", () => {
    it("accepts the kanban column query and coerces numbers and flags", () => {
        const result = GetTasksQuerySchema.safeParse(kanbanQuery);
        expect(result.success).toBe(true);
        expect(result.data).toMatchObject({
            page: 0,
            pageSize: 10,
            filterUser: { assigned: false, crossChecked: false, reviewed: true },
        });
    });

    it("accepts an ISO date range and either bound alone", () => {
        for (const range of [
            {
                startDate: "2026-10-01T03:00:00.000Z",
                endDate: "2026-10-15T03:00:00.000Z",
            },
            { startDate: "2026-10-01T03:00:00.000Z" },
            { endDate: "2026-10-15T03:00:00-03:00" },
        ]) {
            expect(
                GetTasksQuerySchema.safeParse({ ...kanbanQuery, ...range })
                    .success
            ).toBe(true);
        }
    });

    it("rejects malformed dates, operator objects and unknown keys", () => {
        for (const bad of [
            { startDate: "not-a-date" },
            { endDate: "2026-10-15" },
            { startDate: { $gt: "" } },
            { filterUser: { assigned: "maybe" } },
            { filterUser: { $where: "true" } },
            { reviewTaskType: "Personality" },
            { pageSize: "1000" },
            { cacheBuster: "1" },
        ]) {
            expect(
                GetTasksQuerySchema.safeParse({ ...kanbanQuery, ...bad })
                    .success
            ).toBe(false);
        }
    });
});

describe("ReviewTaskService.getQueryObject date range", () => {
    const service = Object.create(ReviewTaskService.prototype);
    const noUserFilter = { assigned: false };

    it("adds no createdAt clause without dates", () => {
        expect(
            service.getQueryObject("published", noUserFilter)
        ).not.toHaveProperty("createdAt");
    });

    it("bounds createdAt from the start of the first day to the end of the last", () => {
        const query = service.getQueryObject(
            "published",
            noUserFilter,
            "2026-10-01T12:00:00.000Z",
            "2026-10-15T12:00:00.000Z"
        );
        const { $gte, $lte } = query.createdAt;

        expect(query["machine.value"]).toBe("published");
        expect([$gte.getHours(), $gte.getMinutes()]).toEqual([0, 0]);
        expect([$lte.getHours(), $lte.getMinutes()]).toEqual([23, 59]);
        expect($gte < $lte).toBe(true);
    });

    it("leaves the range open-ended when only one bound is given", () => {
        expect(
            service.getQueryObject(
                "published",
                noUserFilter,
                "2026-10-01T12:00:00.000Z"
            ).createdAt
        ).not.toHaveProperty("$lte");
        expect(
            service.getQueryObject(
                "published",
                noUserFilter,
                undefined,
                "2026-10-15T12:00:00.000Z"
            ).createdAt
        ).not.toHaveProperty("$gte");
    });
});
