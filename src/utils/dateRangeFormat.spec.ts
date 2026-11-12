import { TFunction } from "next-i18next";
import { formatDateRange } from "./dateRangeFormat";

const t = ((key: string, options?: { date: string }) =>
    `${key}(${options?.date})`) as unknown as TFunction;

const day = (year: number, month: number, date: number) =>
    new Date(year, month - 1, date);

describe("formatDateRange", () => {
    it("orders day and month by the UI language", () => {
        const start = day(2026, 10, 3);
        const end = day(2026, 10, 15);
        expect(formatDateRange(start, end, "pt", t)).toBe("03/10/26 – 15/10/26");
        expect(formatDateRange(start, end, "en", t)).toBe("10/03/26 – 10/15/26");
    });

    it("shows a single end with the full year", () => {
        expect(formatDateRange(day(2026, 10, 3), null, "pt", t)).toBe(
            "common:dateRangeFrom(03/10/2026)"
        );
        expect(formatDateRange(null, day(2026, 10, 15), "en", t)).toBe(
            "common:dateRangeUntil(10/15/2026)"
        );
    });

    it("shortens a whole month only when asked", () => {
        const start = day(2026, 10, 1);
        const end = day(2026, 10, 31);
        expect(
            formatDateRange(start, end, "pt", t, { compactMonth: true })
        ).toBe("out/2026");
        expect(
            formatDateRange(start, end, "en", t, { compactMonth: true })
        ).toBe("Oct 2026");
        expect(formatDateRange(start, end, "pt", t)).toBe("01/10/26 – 31/10/26");
    });

    it("keeps a partial month as a range", () => {
        expect(
            formatDateRange(day(2026, 10, 1), day(2026, 10, 30), "pt", t, {
                compactMonth: true,
            })
        ).toBe("01/10/26 – 30/10/26");
    });

    it("is empty without dates", () => {
        expect(formatDateRange(null, null, "pt", t)).toBe("");
    });
});
