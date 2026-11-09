import { CreateEventSchema, UpdateEventSchema } from "./event.dto";
import { FilterEventsQuerySchema } from "./filter.dto";

const validEvent = {
    badge: "COP30",
    name: "Climate Conference",
    description: "Description",
    location: "Belém",
    startDate: "2026-10-20T00:00:00.000Z",
    endDate: "2026-10-30T00:00:00.000Z",
    mainTopic: { label: "Climate", value: "Q125928" },
};

describe("event DTO schemas", () => {
    describe("CreateEventSchema", () => {
        it("accepts the event form payload and normalizes mainTopic.name", () => {
            const parsed = CreateEventSchema.parse({
                ...validEvent,
                nameSpace: "main",
                recaptcha: "token",
            });

            expect(parsed.startDate).toBeInstanceOf(Date);
            expect(parsed.mainTopic.name).toBe("Climate");
            expect(parsed.mainTopic.value).toBe("Q125928");
        });

        it("rejects missing required fields", () => {
            expect(
                CreateEventSchema.safeParse({ name: "Only a name" }).success
            ).toBe(false);
        });

        it("rejects an endDate that is not after startDate", () => {
            const result = CreateEventSchema.safeParse({
                ...validEvent,
                endDate: validEvent.startDate,
            });

            expect(result.success).toBe(false);
            expect(result.error?.issues[0].path).toEqual(["endDate"]);
        });

        it("rejects unknown keys", () => {
            expect(
                CreateEventSchema.safeParse({ ...validEvent, extra: true })
                    .success
            ).toBe(false);
        });

        it("rejects a mainTopic without label or name", () => {
            expect(
                CreateEventSchema.safeParse({
                    ...validEvent,
                    mainTopic: { value: "Q1" },
                }).success
            ).toBe(false);
        });
    });

    describe("UpdateEventSchema", () => {
        it("accepts a partial update", () => {
            expect(UpdateEventSchema.safeParse({ name: "New" }).success).toBe(
                true
            );
        });

        it("rejects an endDate sent without startDate, like @IsAfter did", () => {
            expect(
                UpdateEventSchema.safeParse({ endDate: validEvent.endDate })
                    .success
            ).toBe(false);
        });

        it("rejects filterTopics without a name", () => {
            expect(
                UpdateEventSchema.safeParse({ filterTopics: [{ label: "x" }] })
                    .success
            ).toBe(false);
        });
    });

    describe("FilterEventsQuerySchema", () => {
        it("coerces query strings and applies defaults", () => {
            expect(FilterEventsQuerySchema.parse({ page: "2" })).toEqual({
                page: 2,
                pageSize: 10,
                order: "asc",
            });
        });

        it("rejects an unknown status, a bad order and pageSize > 100", () => {
            expect(
                FilterEventsQuerySchema.safeParse({ status: "unknown" }).success
            ).toBe(false);
            expect(
                FilterEventsQuerySchema.safeParse({ order: "up" }).success
            ).toBe(false);
            expect(
                FilterEventsQuerySchema.safeParse({ pageSize: "101" }).success
            ).toBe(false);
        });
    });
});
