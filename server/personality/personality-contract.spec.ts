import { NotFoundException } from "@nestjs/common";
import { resetTestDrizzle, getTestDrizzle } from "../tests/postgres-setup";
import {
    getTestPersonalityModel,
    resetTestPersonalities,
    stopTestMongo,
    missingMongoId,
} from "../tests/mongo-contract-setup";
import {
    PostgresPersonalityService,
    toPersonalityEntity,
} from "./postgres/personality.service";
import { personality as personalityTable } from "./postgres/schema/personality.schema";
import { deriveSlug } from "./shared/personality.rules";
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

/**
 * Normalize Mongo ObjectId / PG uuid for identity comparison. Asserts the id
 * exists so two id-less objects can never satisfy an identity comparison
 * ("undefined" === "undefined").
 */
const idOf = (x: any): string => {
    const value = x?._id ?? x?.id;
    expect(value).toBeDefined();
    return String(value);
};

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
    checkItem: async (id: string) =>
        id === "Q404"
            ? { status: "deleted", props: {} }
            : {
                  status: "ok",
                  props: { name: `Person ${id}`, description: `About ${id}` },
              },
    clearCache: async () => undefined,
} as any;

const backends: Array<{
    name: Backend;
    setup: () => Promise<IPersonalityService>;
    makeMissingId: () => string;
    // Creation without a Wikidata id is no longer possible through the
    // service, so a pre-existing legacy row is inserted straight into the DB.
    seedWithoutWikidata: (name: string) => Promise<any>;
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
        seedWithoutWikidata: async (name: string) => {
            const db = await getTestDrizzle();
            const [row] = await db
                .insert(personalityTable)
                .values({ name, slug: deriveSlug(name), description: "x" })
                .returning();
            return toPersonalityEntity(row);
        },
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
        seedWithoutWikidata: async (name: string) => {
            const model = await getTestPersonalityModel();
            return model.create({
                name,
                slug: deriveSlug(name),
                description: "x",
                isHidden: false,
            });
        },
    },
];

afterAll(async () => {
    await stopTestMongo();
});

describe.each(backends)(
    "personality contract: $name",
    ({ setup, makeMissingId, seedWithoutWikidata }) => {
        let service: IPersonalityService;

        beforeEach(async () => {
            service = await setup();
        }, 60_000);

        it("create / getById round-trip", async () => {
            const created = await service.create({ wikidata: "Q7259" });
            expect(created.name).toBe("Person Q7259");
            expect(idOf(created)).toBeTruthy();

            const fetched = await service.getById(idOf(created));
            expect(fetched.name).toBe("Person Q7259");
            expect(fetched.slug).toBe("person-q7259");
        });
        it("getPersonalityBySlug returns the right record", async () => {
            await service.create({ wikidata: "Q1" });
            const created = await service.create({ wikidata: "Q2" });
            const fetched = await service.getPersonalityBySlug({
                slug: "person-q2",
            });
            expect(idOf(fetched)).toBe(idOf(created));
        });
        it("update modifies fields and bumps updatedAt", async () => {
            const c = await service.create({ wikidata: "Q3" });
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
        it("update keeps the slug when the name changes", async () => {
            const c: any = await service.create({ wikidata: "Q4" });
            const updated: any = await service.update(idOf(c), {
                name: "Grace Hopper",
            });
            expect(updated.slug).toBe(c.slug);
            expect(updated.name).toBe("Grace Hopper");
        });
        it("update keeps the slug and writes stored values", async () => {
            const created: any = await service.create({ wikidata: "Q11" });
            const updated: any = await service.update(idOf(created), {
                name: "Renamed",
            });
            expect(updated.slug).toBe(created.slug);
        });
        it("update with no changes returns the stored values without writing", async () => {
            const c: any = await service.create({ wikidata: "Q5" });
            const result: any = await service.update(idOf(c), {
                name: c.name,
                description: c.description,
            });
            expect(idOf(result)).toBe(idOf(c));
            expect(result.name).toBe(c.name);
            expect(result.slug).toBe(c.slug);
            expect(new Date(result.updatedAt).getTime()).toBe(
                new Date(c.updatedAt).getTime()
            );
        });
        it("update on a missing id throws NotFoundException", async () => {
            await expect(
                service.update(makeMissingId(), { name: "X" })
            ).rejects.toBeInstanceOf(NotFoundException);
        });
        it("update relinks to a valid free Wikidata item", async () => {
            const c: any = await service.create({ wikidata: "Q6" });
            const updated: any = await service.update(idOf(c), {
                wikidata: "Q66",
            });
            expect(updated.wikidata).toBe("Q66");
            expect(updated.slug).toBe(c.slug);
        });
        it("update relink to an item held by another personality answers 409", async () => {
            const a: any = await service.create({ wikidata: "Q7" });
            await service.create({ wikidata: "Q8" });
            await expect(
                service.update(idOf(a), { wikidata: "Q8" })
            ).rejects.toMatchObject({ status: 409 });
        });
        it("update relink to an item held by a deleted personality answers 409", async () => {
            const a: any = await service.create({ wikidata: "Q7" });
            const b: any = await service.create({ wikidata: "Q8" });
            await service.delete(idOf(b));
            await expect(
                service.update(idOf(a), { wikidata: "Q8" })
            ).rejects.toMatchObject({ status: 409 });
        });
        it("update relink to a deleted Wikidata item answers 400", async () => {
            const a: any = await service.create({ wikidata: "Q7" });
            await expect(
                service.update(idOf(a), { wikidata: "Q404" })
            ).rejects.toMatchObject({ status: 400 });
        });
        it("delete soft-deletes; getById yields no usable entity", async () => {
            const c = await service.create({ wikidata: "Q9" });
            await service.delete(idOf(c));
            await expectNoUsableEntity(service.getById(idOf(c)));
        });
        it("hideOrUnhidePersonality flips isHidden", async () => {
            const c = await service.create({ wikidata: "Q10" });
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
            const a = await service.create({ wikidata: "Q1" });
            await service.create({ wikidata: "Q2" });
            expect(await service.count()).toBe(2);
            await service.delete(idOf(a));
            expect(await service.count()).toBe(1);
        });
        it("count never includes hidden rows unless asked", async () => {
            await service.create({ wikidata: "Q1" });
            const b = await service.create({ wikidata: "Q2" });
            await service.hideOrUnhidePersonality(idOf(b), true, "spam");
            expect(await service.count()).toBe(1);
            expect(await service.count({ isHidden: true })).toBe(1);
        });
        it("getDeletedPersonalityByWikidata returns soft-deleted rows", async () => {
            const c = await service.create({ wikidata: "Q1" });
            await service.delete(idOf(c));
            const found = await service.getDeletedPersonalityByWikidata("Q1");
            expect(idOf(found)).toBe(idOf(c));
            expect((found as any).isDeleted).toBe(true);
        });

        // ---- parity assertions (contract-break regressions) ----

        it("returned entities expose `_id` (Mongo-parity id field)", async () => {
            const created = await service.create({ wikidata: "Q1" });
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

        it("create derives the slug from the Wikidata name", async () => {
            const created = await service.create({ wikidata: "Q7259" });
            expect((created as any).slug).toBe("person-q7259");
        });

        it("create restores a soft-deleted row with the same wikidata (does not duplicate)", async () => {
            const first = await service.create({ wikidata: "Q7259" });
            await service.delete(idOf(first));

            const again = await service.create({ wikidata: "Q7259" });
            // Same row, brought back to life, not a second insert.
            expect(idOf(again)).toBe(idOf(first));
            expect((again as any).isDeleted).toBe(false);
        });

        it("create restores a soft-deleted row when restoreDeleted is an empty options object", async () => {
            const first = await service.create({ wikidata: "Q7259" });
            await service.delete(idOf(first));

            const again = await (service as any).create(
                { wikidata: "Q7259" },
                {}
            );
            expect(idOf(again)).toBe(idOf(first));
        });

        it("create with restoreDeleted false answers 409 for a soft-deleted holder", async () => {
            const first = await service.create({ wikidata: "Q7259" });
            await service.delete(idOf(first));

            await expect(
                (service as any).create(
                    { wikidata: "Q7259" },
                    { restoreDeleted: false }
                )
            ).rejects.toMatchObject({ status: 409 });
        });

        it("create answers 409 when an active personality holds the item", async () => {
            await service.create({ wikidata: "Q7259" });
            await expect(
                service.create({ wikidata: "Q7259" })
            ).rejects.toMatchObject({ status: 409 });
        });

        it("create rejects a deleted Wikidata item", async () => {
            await expect(
                service.create({ wikidata: "Q404" })
            ).rejects.toMatchObject({ status: 400 });
        });

        it("create answers 503 when Wikidata is unavailable", async () => {
            const original = wikidataStub.checkItem;
            wikidataStub.checkItem = async () => {
                throw new Error("down");
            };
            try {
                await expect(
                    service.create({ wikidata: "Q12" })
                ).rejects.toMatchObject({ status: 503 });
            } finally {
                wikidataStub.checkItem = original;
            }
        });

        it("findOrCreatePersonality returns null without a Wikidata id", async () => {
            await expect(
                service.findOrCreatePersonality({ name: "Nobody Known" })
            ).resolves.toBeNull();
        });

        it("findOrCreatePersonality returns null, not a restore, when a soft-deleted personality holds the id", async () => {
            const first = await service.create({ wikidata: "Q7259" });
            await service.delete(idOf(first));

            await expect(
                service.findOrCreatePersonality({
                    name: "Ada",
                    wikidata: { id: "Q7259" },
                })
            ).resolves.toBeNull();
            await expectNoUsableEntity(service.getById(idOf(first)));
        });

        it("findOrCreatePersonality returns null for a deleted Wikidata item", async () => {
            await expect(
                service.findOrCreatePersonality({
                    name: "Gone",
                    wikidata: { id: "Q404" },
                })
            ).resolves.toBeNull();
        });

        it("findOrCreatePersonality creates from the Wikidata item, not the AI name", async () => {
            const created: any = await service.findOrCreatePersonality({
                name: "Some Other Spelling",
                wikidata: { id: "Q11641" },
            });
            expect(created.name).toBe("Person Q11641");
            expect(created.description).toBe("About Q11641");
            expect(created.wikidata).toBe("Q11641");
        });

        it("findOrCreatePersonality dedups on slug and backfills missing wikidata", async () => {
            // Seed a row that shares the slug but has no wikidata yet.
            const seeded = await seedWithoutWikidata("Ada Lovelace");
            expect((seeded as any).wikidata ?? null).toBeNull();

            const result = await service.findOrCreatePersonality({
                name: "Ada Lovelace",
                wikidata: { id: "Q7259" },
            });
            // Same row (slug-dedup), now backfilled with the wikidata id.
            expect(idOf(result)).toBe(idOf(seeded));
            expect((result as any).wikidata).toBe("Q7259");
        });

        it("getStored returns the stored values and what Wikidata provides", async () => {
            const c: any = await service.create({ wikidata: "Q13" });
            await service.update(idOf(c), { name: "Local Name" });
            const stored: any = await (service as any).getStored(idOf(c));
            expect(stored.name).toBe("Local Name");
            expect(stored.wikidata).toBe("Q13");
            expect(stored.wikidataStatus).toBe("ok");
            expect(stored.wikidataProvides).toEqual({
                name: true,
                description: true,
            });
        });

        it("getStored on a missing id throws NotFoundException", async () => {
            await expect(
                (service as any).getStored(makeMissingId())
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    }
);
