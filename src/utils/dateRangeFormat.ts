import { format, isSameDay, isSameMonth, lastDayOfMonth } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { TFunction } from "next-i18next";

// Day order follows the UI language; the full year is shown for a single
// day, while a full range uses two-digit years so it fits a sidebar field
const DATE_FORMATS = {
    pt: { locale: ptBR, day: "dd/MM/yyyy", rangeDay: "dd/MM/yy" },
    en: { locale: enUS, day: "MM/dd/yyyy", rangeDay: "MM/dd/yy" },
};

export const getDateFormat = (language?: string) =>
    language?.startsWith("pt") ? DATE_FORMATS.pt : DATE_FORMATS.en;

const isWholeMonth = (start: Date, end: Date) =>
    start.getDate() === 1 &&
    isSameMonth(start, end) &&
    isSameDay(end, lastDayOfMonth(end));

/**
 * Text of a period: "01/10/26 – 15/10/26", "A partir de 01/10/2026",
 * "Até 15/10/2026". With `compactMonth`, a whole calendar month is shown as
 * "out/2026" (pt) or "Oct 2026" (en).
 */
export const formatDateRange = (
    startDate: Date | null,
    endDate: Date | null,
    language: string | undefined,
    t: TFunction,
    { compactMonth = false } = {}
): string => {
    const { locale, day, rangeDay } = getDateFormat(language);
    if (startDate && endDate) {
        if (compactMonth && isWholeMonth(startDate, endDate)) {
            return locale === ptBR
                ? format(startDate, "MMM/yyyy", { locale })
                : format(startDate, "MMM yyyy", { locale });
        }
        return `${format(startDate, rangeDay)} – ${format(endDate, rangeDay)}`;
    }
    if (startDate) {
        return t("common:dateRangeFrom", { date: format(startDate, day) });
    }
    if (endDate) {
        return t("common:dateRangeUntil", { date: format(endDate, day) });
    }
    return "";
};
