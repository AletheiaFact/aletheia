export function buildDateQuery(startDate?: string, endDate?: string) {
    if (!startDate && !endDate) return undefined;

    const query: any = {};

    if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.$gte = start;
    }

    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.$lte = end;
    }

    return query;
}
