/** SQLSTATE 22P02 on a uuid column: the id can never match, so reads treat it as missing. */
export function isInvalidUuidError(error: unknown): boolean {
    const e = error as any;
    return [e, e?.cause].some(
        (c) =>
            c &&
            (c.code === "22P02" ||
                /invalid input syntax for type uuid/.test(
                    String(c.message ?? "")
                ))
    );
}
