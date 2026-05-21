import { resetTestDrizzle, getTestDrizzle } from "../tests/postgres-setup";
import { PostgresPersonalityService } from "./postgres/personality.service";
import type { IPersonalityService } from "../interfaces/personality.service.interface";

type Backend = "mongodb" | "postgres";

/**
 * Each backend exposes a factory that produces a fresh-state IPersonalityService
 * for one test. The contract suite below runs the same assertions against every
 * registered backend.
 */
const backends: Array<{
    name: Backend;
    setup: () => Promise<IPersonalityService>;
}> = [];

if ((process.env.DB_TYPE ?? "mongodb") === "postgres") {
    backends.push({
        name: "postgres",
        setup: async () => {
            await resetTestDrizzle();
            const db = await getTestDrizzle();
            return new PostgresPersonalityService(
                db
            ) as unknown as IPersonalityService;
        },
    });
}

// MongoDB factory is added in Task 24 once the env-driven test setup branches.
// For now, when DB_TYPE=mongodb (default), this suite is skipped — the existing
// Mongo personality e2e tests continue to provide coverage.

if (backends.length === 0) {
    describe.skip("personality contract — no backends registered", () => {
        it("noop", () => undefined);
    });
} else {
    describe.each(backends)("personality contract: $name", ({ setup }) => {
        let service: IPersonalityService;

        beforeEach(async () => {
            service = await setup();
        });

        // Tasks 11–18 add concrete `it()` blocks here.
        it("create / getById round-trip", async () => {
            const created = await service.create({
                name: "Ada Lovelace",
                slug: "ada-lovelace",
                description: "Mathematician",
            });
            expect(created.name).toBe("Ada Lovelace");
            expect((created as any).id).toBeDefined();

            const fetched = await service.getById((created as any).id);
            expect(fetched.name).toBe("Ada Lovelace");
            expect(fetched.slug).toBe("ada-lovelace");
        });
        it.todo("getPersonalityBySlug returns the right record");
        it.todo("update modifies fields and bumps updatedAt");
        it.todo("delete soft-deletes; getById then 404s");
        it.todo("hideOrUnhidePersonality flips isHidden");
        it.todo("findOrCreatePersonality is idempotent on wikidata");
        it.todo("count reflects only non-deleted rows");
        it.todo("getDeletedPersonalityByWikidata returns soft-deleted rows");
    });
}
