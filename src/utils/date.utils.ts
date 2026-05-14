export function formatCommentTime(
    createdAt: Date | string | number | null | undefined
): string {
    if (!createdAt) return "";
    return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
    }).format(new Date(createdAt));
}

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
