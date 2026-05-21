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
        it("getPersonalityBySlug returns the right record", async () => {
            await service.create({ name: "A", slug: "a", description: "x" });
            const created = await service.create({
                name: "B",
                slug: "b",
                description: "y",
            });
            const fetched = await service.getPersonalityBySlug({ slug: "b" });
            expect((fetched as any).id).toBe((created as any).id);
        });
        it("update modifies fields and bumps updatedAt", async () => {
            const c = await service.create({
                name: "Ada",
                slug: "ada",
                description: "x",
            });
            const before = (c as any).updatedAt;
            // 5ms delay to ensure timestamp granularity
            await new Promise((r) => setTimeout(r, 5));
            const updated = await service.update((c as any).id, {
                name: "Ada L.",
            });
            expect(updated.name).toBe("Ada L.");
            expect(
                new Date((updated as any).updatedAt).getTime()
            ).toBeGreaterThan(new Date(before).getTime());
        });
        it("delete soft-deletes; getById then throws", async () => {
            const c = await service.create({
                name: "X",
                slug: "x",
                description: "x",
            });
            await service.delete((c as any).id);
            await expect(service.getById((c as any).id)).rejects.toThrow(
                /not found/i
            );
        });
        it.todo("hideOrUnhidePersonality flips isHidden");
        it.todo("findOrCreatePersonality is idempotent on wikidata");
        it.todo("count reflects only non-deleted rows");
        it("getDeletedPersonalityByWikidata returns soft-deleted rows", async () => {
            const c = await service.create({
                name: "X",
                slug: "x",
                description: "x",
                wikidata: "Q1",
            });
            await service.delete((c as any).id);
            const found = await service.getDeletedPersonalityByWikidata("Q1");
            expect((found as any).id).toBe((c as any).id);
            expect((found as any).isDeleted).toBe(true);
        });
    });
}
