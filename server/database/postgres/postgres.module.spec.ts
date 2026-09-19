import { Test } from "@nestjs/testing";
import { PostgresModule } from "./postgres.module";
import { DRIZZLE } from "./postgres.provider";

describe("PostgresModule", () => {
    it("forRoot exposes a DRIZZLE provider", async () => {
        // Use a non-routable URI; the pool is lazy so no connection is attempted.
        const moduleRef = await Test.createTestingModule({
            imports: [
                PostgresModule.forRoot({
                    connection_uri: "postgres://u:p@127.0.0.1:1/test",
                    pool_size: 1,
                    fuzzy_threshold: 0.3,
                }),
            ],
        }).compile();

        const drizzle = moduleRef.get(DRIZZLE);
        expect(drizzle).toBeDefined();
        expect(typeof drizzle.execute).toBe("function");

        await moduleRef.close();
    });

    it("closes the pool on module destroy", async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                PostgresModule.forRoot({
                    connection_uri: "postgres://u:p@127.0.0.1:1/test",
                    pool_size: 1,
                }),
            ],
        }).compile();

        const moduleInstance = moduleRef.get(PostgresModule);
        const endSpy = vi.spyOn(
            (
                moduleInstance as unknown as {
                    pool: { end: () => Promise<void> };
                }
            ).pool,
            "end"
        );

        await moduleRef.close();
        expect(endSpy).toHaveBeenCalledTimes(1);
    });
});
