import { NotFoundException } from "@nestjs/common";
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
            const wikidataStub = {
                queryWikibaseEntities: async () => [],
            } as any;
            const configStub = {
                get: (key: string) =>
                    key === "db.postgres.fuzzy_threshold" ? 0.3 : undefined,
            } as any;
            return new PostgresPersonalityService(
                db,
                wikidataStub,
                configStub
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
        it("hideOrUnhidePersonality flips isHidden", async () => {
            const c = await service.create({
                name: "X",
                slug: "x",
                description: "x",
            });
            expect((c as any).isHidden).toBe(false);
            await service.hideOrUnhidePersonality((c as any).id, true, "spam");
            const after = await service.getById((c as any).id);
            expect((after as any).isHidden).toBe(true);
        });
        it("findOrCreatePersonality is idempotent on wikidata", async () => {
            const a = await service.findOrCreatePersonality({
                name: "Ada",
                wikidata: { id: "Q7259" },
            });
            const b = await service.findOrCreatePersonality({
                name: "Ada Lovelace",
                wikidata: { id: "Q7259" },
            });
            expect((a as any).id).toBe((b as any).id);
        });
        it("count reflects only non-deleted rows", async () => {
            const a = await service.create({
                name: "A",
                slug: "a",
                description: "x",
            });
            await service.create({ name: "B", slug: "b", description: "y" });
            expect(await service.count()).toBe(2);
            await service.delete((a as any).id);
            expect(await service.count()).toBe(1);
        });
        it("getDeletedPersonalityByWikidata returns soft-deleted rows", async () => {
            const c = await service.create({
                name: "X",
                slug: "x",
                description: "x",
                wikidata: "Q1",
            });
            await service.delete((c as any).id);
            const found = await service.getDeletedPersonalityByWikidata("Q1");
            expect((found as any)._id).toBe((c as any)._id);
            expect((found as any).isDeleted).toBe(true);
        });

        // ---- parity assertions (contract-break regressions) ----

        it("returned entities expose `_id` (Mongo-parity id field)", async () => {
            const created = await service.create({
                name: "Ada",
                slug: "ada",
                description: "x",
            });
            expect((created as any)._id).toBeDefined();

            const fetched = await service.getById((created as any)._id);
            expect((fetched as any)._id).toBe((created as any)._id);
        });

        it("getById on a missing id throws NotFoundException (404), not a generic error", async () => {
            await expect(
                service.getById("00000000-0000-0000-0000-000000000000")
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("getPersonalityBySlug on a missing slug throws NotFoundException (404)", async () => {
            await expect(
                service.getPersonalityBySlug({ slug: "does-not-exist" })
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("create auto-generates a slug when none is supplied", async () => {
            const created = await service.create({
                name: "Ada Lovelace",
                description: "x",
            });
            expect((created as any).slug).toBe("ada-lovelace");
        });

        it("create defaults description to empty string when omitted", async () => {
            const created = await service.create({
                name: "No Desc",
                slug: "no-desc",
            });
            expect((created as any).description).toBe("");
        });

        it("a soft-deleted wikidata value does not block creating a live one", async () => {
            const first = await service.create({
                name: "Ada",
                slug: "ada",
                description: "x",
                wikidata: "Q42",
            });
            await service.delete((first as any)._id);

            // Must NOT throw a unique-violation — the partial index excludes
            // soft-deleted rows.
            const second = await service.findOrCreatePersonality({
                name: "Ada Again",
                wikidata: { id: "Q42" },
            });
            expect((second as any)._id).toBeDefined();
            expect((second as any)._id).not.toBe((first as any)._id);
        });

        it("create restores a soft-deleted row with the same wikidata (does not duplicate)", async () => {
            const first = await service.create({
                name: "Ada",
                description: "x",
                wikidata: "Q7259",
            });
            await service.delete((first as any)._id);

            const again = await service.create({
                name: "Ada",
                description: "x",
                wikidata: "Q7259",
            });
            // Same row, brought back to life — not a second insert.
            expect((again as any)._id).toBe((first as any)._id);
            expect((again as any).isDeleted).toBe(false);
        });

        it("create derives slug from name, ignoring any caller-supplied slug", async () => {
            const created = await service.create({
                name: "Ada Lovelace",
                slug: "totally-different",
                description: "x",
            });
            expect((created as any).slug).toBe("ada-lovelace");
        });

        it("findOrCreatePersonality dedups on slug and backfills missing wikidata", async () => {
            // Seed a row that shares the slug but has no wikidata yet.
            const seeded = await service.create({
                name: "Ada Lovelace",
                description: "x",
            });
            expect((seeded as any).wikidata ?? null).toBeNull();

            const result = await service.findOrCreatePersonality({
                name: "Ada Lovelace",
                wikidata: { id: "Q7259" },
            });
            // Same row (slug-dedup), now backfilled with the wikidata id.
            expect((result as any)._id).toBe((seeded as any)._id);
            expect((result as any).wikidata).toBe("Q7259");
        });

        it("findOrCreatePersonality defaults description when none is provided", async () => {
            const created = await service.findOrCreatePersonality({
                name: "Grace Hopper",
                wikidata: { id: "Q11641" },
            });
            expect((created as any).description).toBe(
                "Personality: Grace Hopper"
            );
        });
    });
}
