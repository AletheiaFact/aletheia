import { NotFoundException } from "@nestjs/common";
import { resetTestDrizzle, getTestDrizzle } from "../tests/postgres-setup";
import {
    getTestPersonalityModel,
    resetTestPersonalities,
    stopTestMongo,
    missingMongoId,
} from "../tests/mongo-contract-setup";
import { PostgresPersonalityService } from "./postgres/personality.service";
import { MongoPersonalityService } from "./mongo/personality.service";
import { HistoryServiceMock } from "../tests/mocks/HistoryServiceMock";
import { UtilService } from "../util";
import { Roles } from "../auth/ability/ability.factory";
import type { IPersonalityService } from "../interfaces/personality.service.interface";

type Backend = "mongodb" | "postgres";

/**
 * Backend-parameterized contract suite (Decision D4.1): BOTH backends run in
 * every test run — Mongo via mongodb-memory-server, Postgres via pglite, both
 * in-process — with no DB_TYPE gate. These assertions define the shared
 * behavioral contract; behavior that intentionally differs per backend lives
 * in personality.postgres.spec.ts (and is listed under "Known divergences" in
 * docs/postgres-migration-foundation.md).
 */

/** Normalize Mongo ObjectId / PG uuid for identity comparison. */
const idOf = (x: any): string => String(x?._id ?? x?.id);

/**
 * The contract for "no usable entity for this reference": Postgres throws
 * NotFoundException (404); Mongo resolves null (documented divergence — the
 * Mongo behavior is prod-authoritative and stays untouched).
 */
async function expectNoUsableEntity(promise: Promise<any>): Promise<void> {
    let result: any;
    try {
        result = await promise;
    } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        return;
    }
    expect(result).toBeNull();
}

const wikidataStub = {
    queryWikibaseEntities: async () => [],
    // postProcess must receive an object WITHOUT isAllowedProp === false,
    // otherwise Mongo getById filters the row out and returns undefined.
    fetchProperties: async () => ({}),
} as any;

const backends: Array<{
    name: Backend;
    setup: () => Promise<IPersonalityService>;
    makeMissingId: () => string;
}> = [
    {
        name: "postgres",
        setup: async () => {
            await resetTestDrizzle();
            const db = await getTestDrizzle();
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
        makeMissingId: () => "00000000-0000-0000-0000-000000000000",
    },
    {
        name: "mongodb",
        setup: async () => {
            const model = await getTestPersonalityModel();
            await resetTestPersonalities();
            // Admin request: getParamsBasedOnUserRole would force
            // isHidden:false into every filter for non-admins, which would
            // break the hide/unhide read-back assertion.
            const reqStub = {
                user: { _id: missingMongoId(), role: { main: Roles.Admin } },
                params: {},
                query: {},
            } as any;
            const claimReviewStub = {
                agreggateClassification: async () => [],
            } as any;
            return new MongoPersonalityService(
                reqStub,
                model,
                claimReviewStub,
                HistoryServiceMock as any,
                wikidataStub,
                new UtilService()
            ) as unknown as IPersonalityService;
        },
        makeMissingId: missingMongoId,
    },
];

afterAll(async () => {
    await stopTestMongo();
});

describe.each(backends)(
    "personality contract: $name",
    ({ setup, makeMissingId }) => {
        let service: IPersonalityService;

        beforeEach(async () => {
            service = await setup();
        }, 60_000);

        it("create / getById round-trip", async () => {
            const created = await service.create({
                name: "Ada Lovelace",
                slug: "ada-lovelace",
                description: "Mathematician",
            });
            expect(created.name).toBe("Ada Lovelace");
            expect(idOf(created)).toBeTruthy();

            const fetched = await service.getById(idOf(created));
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
            expect(idOf(fetched)).toBe(idOf(created));
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
            const updated = await service.update(idOf(c), {
                name: "Ada L.",
            });
            expect(updated.name).toBe("Ada L.");
            expect(
                new Date((updated as any).updatedAt).getTime()
            ).toBeGreaterThan(new Date(before).getTime());
        });
        it("update re-derives the slug when the name changes", async () => {
            const c = await service.create({
                name: "Ada",
                slug: "ada",
                description: "x",
            });
            const updated = await service.update(idOf(c), {
                name: "Grace Hopper",
            });
            expect((updated as any).slug).toBe("grace-hopper");
        });
        it("delete soft-deletes; getById yields no usable entity", async () => {
            const c = await service.create({
                name: "X",
                slug: "x",
                description: "x",
            });
            await service.delete(idOf(c));
            await expectNoUsableEntity(service.getById(idOf(c)));
        });
        it("hideOrUnhidePersonality flips isHidden", async () => {
            const c = await service.create({
                name: "X",
                slug: "x",
                description: "x",
            });
            expect((c as any).isHidden).toBe(false);
            await service.hideOrUnhidePersonality(idOf(c), true, "spam");
            const after = await service.getById(idOf(c));
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
            expect(idOf(a)).toBe(idOf(b));
        });
        it("count reflects only non-deleted rows", async () => {
            const a = await service.create({
                name: "A",
                slug: "a",
                description: "x",
            });
            await service.create({ name: "B", slug: "b", description: "y" });
            expect(await service.count()).toBe(2);
            await service.delete(idOf(a));
            expect(await service.count()).toBe(1);
        });
        it("count never includes hidden rows unless asked", async () => {
            await service.create({ name: "A", slug: "a", description: "x" });
            const b = await service.create({
                name: "B",
                slug: "b",
                description: "y",
            });
            await service.hideOrUnhidePersonality(idOf(b), true, "spam");
            expect(await service.count()).toBe(1);
            expect(await service.count({ isHidden: true })).toBe(1);
        });
        it("getDeletedPersonalityByWikidata returns soft-deleted rows", async () => {
            const c = await service.create({
                name: "X",
                slug: "x",
                description: "x",
                wikidata: "Q1",
            });
            await service.delete(idOf(c));
            const found = await service.getDeletedPersonalityByWikidata("Q1");
            expect(idOf(found)).toBe(idOf(c));
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

            const fetched = await service.getById(idOf(created));
            expect(idOf(fetched)).toBe(idOf(created));
        });

        it("getById on a missing id yields no usable entity", async () => {
            await expectNoUsableEntity(service.getById(makeMissingId()));
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

        it("create restores a soft-deleted row with the same wikidata (does not duplicate)", async () => {
            const first = await service.create({
                name: "Ada",
                description: "x",
                wikidata: "Q7259",
            });
            await service.delete(idOf(first));

            const again = await service.create({
                name: "Ada",
                description: "x",
                wikidata: "Q7259",
            });
            // Same row, brought back to life — not a second insert.
            expect(idOf(again)).toBe(idOf(first));
            expect((again as any).isDeleted).toBe(false);
        });

        it("create without wikidata never restores an unrelated soft-deleted row", async () => {
            const deleted = await service.create({
                name: "Old",
                description: "x",
                wikidata: "Q99",
            });
            await service.delete(idOf(deleted));

            const fresh = await service.create({
                name: "Brand New",
                description: "y",
            });
            expect(idOf(fresh)).not.toBe(idOf(deleted));
            expect(fresh.name).toBe("Brand New");
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
            expect(idOf(result)).toBe(idOf(seeded));
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
    }
);
