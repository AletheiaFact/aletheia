export function buildDateQuery(startDate?: string, endDate?: string) {
    if (startDate && endDate)
        return { $gte: new Date(startDate), $lte: new Date(endDate) };

    if (startDate) return { $gte: new Date(startDate) };

    if (endDate) return { $lte: new Date(endDate) };

    return undefined;
}
