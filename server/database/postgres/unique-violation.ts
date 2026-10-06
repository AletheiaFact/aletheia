import { DuplicateKeyError } from "../errors";

/**
 * Map a Postgres unique-violation (SQLSTATE 23505) to the backend-neutral
 * DuplicateKeyError; rethrow anything else untouched. Checks the error and
 * its `cause` (drivers/ORMs differ in wrapping), with a message-regex
 * fallback for pglite, and derives the violated field from the constraint
 * name (`<table>_<field>_uq`).
 */
/** The violated field of a 23505 error, or null when it is not one. */
export function uniqueViolationField(
    error: unknown,
    table: string
): string | null {
    const e = error as any;
    const candidates = [e, e?.cause];
    const hit = candidates.find(
        (c) =>
            c &&
            (c.code === "23505" ||
                /duplicate key value violates unique constraint/.test(
                    String(c.message ?? "")
                ))
    );
    if (hit) {
        const constraint: string =
            hit.constraint ??
            /unique constraint "([^"]+)"/.exec(
                String(hit.message ?? "")
            )?.[1] ??
            "";
        const field = constraint
            .replace(new RegExp(`^${table}_`), "")
            .replace(/_uq$/, "");
        return field || "unknown";
    }
    return null;
}

export function rethrowUniqueViolation(error: unknown, table: string): never {
    const field = uniqueViolationField(error, table);
    if (field) throw new DuplicateKeyError([field]);
    throw error;
}
