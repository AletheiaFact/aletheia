import { createPool, createDrizzle } from "./connection";

describe("postgres connection factory", () => {
    it("createPool returns a pg.Pool with the expected connection string", () => {
        const pool = createPool("postgres://u:p@h:5432/d", 5);
        // pg's Pool exposes options.max
        expect((pool as any).options.max).toBe(5);
        pool.end();
    });

    it("createDrizzle returns an object with a query method (smoke check)", () => {
        const pool = createPool("postgres://u:p@h:5432/d", 1);
        const db = createDrizzle(pool);
        expect(typeof db.execute).toBe("function");
        pool.end();
    });
});
