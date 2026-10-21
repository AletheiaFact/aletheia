/** Rows in the order of `ids`, skipping ids with no row. */
export function orderedBy<T extends { id: string }>(
    rows: T[],
    ids: string[]
): T[] {
    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids.map((id) => byId.get(id)).filter((r): r is T => !!r);
}
