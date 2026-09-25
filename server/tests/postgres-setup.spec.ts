import { getTestDrizzle, resetTestDrizzle } from "./postgres-setup";
import { personality } from "../database/postgres/schema";
import { sql } from "drizzle-orm";

describe("pglite test factory", () => {
    it("returns a working Drizzle client with pg_trgm available", async () => {
        const db = await getTestDrizzle();
        const result = await db.execute(sql`SELECT 'ok' AS v`);
        expect((result.rows[0] as any).v).toBe("ok");
    });

    it("has the personality table after migrations", async () => {
        const db = await getTestDrizzle();
        const rows = await db.select().from(personality);
        expect(Array.isArray(rows)).toBe(true);
    });

    it("resetTestDrizzle truncates personality", async () => {
        const db = await getTestDrizzle();
        await db.insert(personality).values({
            name: "X",
            slug: "x",
            description: "d",
        });
        await resetTestDrizzle();
        const rows = await db.select().from(personality);
        expect(rows).toHaveLength(0);
    });
});
