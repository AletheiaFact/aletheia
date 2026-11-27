import {
    Injectable,
    Inject,
    NotFoundException,
    ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type {
    IPersonalityService,
    PersonalityRef,
} from "../../interfaces/personality.service.interface";
import {
    IPersonality,
    ICombinedListResult,
    IFindAllOptions,
    IFindAllResult,
} from "../../interfaces/personality.interface";
import { DRIZZLE } from "../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../database/postgres/connection";
import { NotImplementedError } from "../../database/errors";
import { rethrowUniqueViolation } from "../../database/postgres/unique-violation";
import { eq, and, sql, desc, asc } from "drizzle-orm";
import {
    deriveSlug,
    defaultDescription,
    extractClaimWithTextSummary,
    wikidataCreationError,
} from "../shared/personality.rules";
import type { WikidataCreationStatus } from "../shared/personality.rules";
import { personality } from "./schema/personality.schema";
import type {
    PersonalityInsert,
    PersonalityRow,
} from "./schema/personality.schema";
import { escapeRegex } from "../../util/regex.util";
import { WikidataService } from "../../wikidata/wikidata.service";

export function toPersonalityEntity(row: PersonalityRow): IPersonality {
    return { ...row, _id: row.id } as unknown as IPersonality;
}

@Injectable()
export class PostgresPersonalityService implements IPersonalityService {
    constructor(
        @Inject(DRIZZLE) private readonly db: DrizzleClient,
        private readonly wikidata: WikidataService,
        private readonly configService: ConfigService
    ) {}

    /**
     * Boundary mapper: converts a raw Postgres row into the IPersonality shape
     * every caller expects. Critically, it exposes `_id` (Mongo-parity id field
     * the frontend reads) while preserving the native row fields. Every return
     * path MUST go through this — never return a raw row cast `as IPersonality`,
     * because that hides the missing `_id`.
     */
    private toEntity(row: PersonalityRow): IPersonality {
        return toPersonalityEntity(row);
    }

    /** SQLSTATE 23505 → neutral DuplicateKeyError (shared infra). */
    private rethrowMapped(error: unknown): never {
        rethrowUniqueViolation(error, "personality");
    }

    /**
     * Checks that a Wikidata item can back a personality and returns its
     * data. Throws 400 (deleted / not an allowed type), 409 (used by another
     * personality) or 503 (Wikidata unavailable: never create unchecked). The
     * check bypasses the cache so a stale entry cannot let a deleted item
     * through.
     */
    private async loadCreatableItem(
        wikidataId: string,
        excludePersonalityId?: string
    ) {
        let checked;
        try {
            checked = await this.wikidata.checkItem(wikidataId, "pt", {
                fresh: true,
            });
        } catch {
            throw new ServiceUnavailableException(
                "Wikidata is unavailable, try again later"
            );
        }
        let status: WikidataCreationStatus = checked.status;
        if (status === "ok") {
            // Relink (excludePersonalityId set): a soft-deleted holder blocks
            // too, to match Mongo, whose unique index covers deleted rows
            // (the Postgres partial index does not). Creation: only active
            // holders block; a deleted holder is restored by create() on the
            // admin path.
            const relink = excludePersonalityId !== undefined;
            const [inUse] = await this.db
                .select({ id: personality.id })
                .from(personality)
                .where(
                    and(
                        eq(personality.wikidata, wikidataId),
                        relink ? undefined : eq(personality.isDeleted, false)
                    )
                )
                .limit(1);
            if (inUse && inUse.id !== excludePersonalityId) status = "in_use";
        }
        const error = wikidataCreationError(status);
        if (error) throw error;
        return checked.props;
    }

    async getWikidataEntities(regex: string, language: string): Promise<any> {
        return this.wikidata.queryWikibaseEntities(regex, language, false);
    }
    async getWikidataList(regex: string, language: string): Promise<string[]> {
        const entities = await this.getWikidataEntities(regex, language);
        return entities.map((e: any) => e.wikidata);
    }
    async listAll(
        page: number,
        pageSize: number,
        order: string,
        query: any,
        _language: string,
        withSuggestions: boolean,
        _filter?: any
    ): Promise<IPersonality[]> {
        // Guard unsupported surface loudly (no silent scope reduction):
        // random ordering ($sample), wikidata suggestions merging, and
        // Mongo-shaped query filters beyond isDeleted/isHidden all depend on
        // pieces that land in later phases. NOTE: rows are returned without
        // the Mongo impl's postProcess enrichment (claim/review stats) —
        // deferred until claim + claim-review are ported (Phases 2-3).
        if (order === "random") {
            throw new NotImplementedError("postgres", "listAll(order=random)");
        }
        if (withSuggestions) {
            throw new NotImplementedError(
                "postgres",
                "listAll(withSuggestions)"
            );
        }
        const unsupportedKeys = Object.keys(query ?? {}).filter(
            (k) => k !== "isDeleted" && k !== "isHidden"
        );
        if (unsupportedKeys.length > 0) {
            throw new NotImplementedError(
                "postgres",
                `listAll(query.${unsupportedKeys.join(",query.")})`
            );
        }

        const conditions = [eq(personality.isDeleted, false)];
        if (query?.isHidden !== undefined) {
            conditions.push(eq(personality.isHidden, Boolean(query.isHidden)));
        }
        const orderBy =
            order === "asc"
                ? asc(personality.createdAt)
                : desc(personality.createdAt);

        const base = this.db
            .select()
            .from(personality)
            .where(and(...conditions))
            .orderBy(orderBy)
            .offset(page * pageSize);
        // Mongo's limit(0) means "no limit" (live caller: sitemap passes
        // pageSize=0); Postgres LIMIT 0 would return zero rows, so only apply
        // a LIMIT for a positive pageSize.
        const rows = pageSize > 0 ? await base.limit(pageSize) : await base;
        return rows.map((r) => this.toEntity(r));
    }
    /**
     * Creates a personality from a Wikidata item. Name and description come
     * from Wikidata, never from the client. On the admin path a soft-deleted
     * personality with the same item is restored instead; the AI path passes
     * `restoreDeleted: false` and gets a 409 so it never undoes an admin
     * deletion. Writes no history, as for hide/unhide today.
     */
    async create(
        { wikidata }: { wikidata: string },
        { restoreDeleted = true }: { restoreDeleted?: boolean } = {}
    ): Promise<IPersonality> {
        const [deleted] = await this.db
            .select()
            .from(personality)
            .where(
                and(
                    eq(personality.wikidata, wikidata),
                    eq(personality.isDeleted, true)
                )
            )
            .limit(1);
        if (deleted) {
            if (!restoreDeleted) throw wikidataCreationError("in_use");
            // Intentionally restores without a Wikidata check: reads tolerate
            // a dead item and the stored data is kept.
            const [restored] = await this.db
                .update(personality)
                .set({
                    isDeleted: false,
                    deletedAt: null,
                    updatedAt: new Date(),
                })
                .where(eq(personality.id, deleted.id))
                .returning();
            return this.toEntity(restored);
        }

        const props = await this.loadCreatableItem(wikidata);
        const name = props.name as string;
        const values: PersonalityInsert = {
            name,
            slug: deriveSlug(name),
            description: defaultDescription(name, props.description),
            wikidata,
            isHidden: false,
        };
        try {
            const [row] = await this.db
                .insert(personality)
                .values(values)
                .returning();
            return this.toEntity(row);
        } catch (error) {
            this.rethrowMapped(error);
        }
    }
    async getDeletedPersonalityByWikidata(wikidata: string) {
        const [row] = await this.db
            .select()
            .from(personality)
            .where(
                and(
                    eq(personality.wikidata, wikidata),
                    eq(personality.isDeleted, true)
                )
            )
            .limit(1);
        return row ? this.toEntity(row) : null;
    }
    /**
     * Finds or creates a personality for an AI identification result.
     * Returns null, and creates nothing, when the AI gives no Wikidata id,
     * or the item is deleted, of another type, used elsewhere (a soft-deleted
     * holder counts: the AI path never restores an admin deletion), or
     * Wikidata is unavailable. The caller records the name as unmatched.
     */
    async findOrCreatePersonality(data: {
        name: string;
        wikidata?: { id?: string; label?: string; description?: string };
    }): Promise<IPersonality | null> {
        const wikidataId = data.wikidata?.id || null;
        if (wikidataId) {
            const [existing] = await this.db
                .select()
                .from(personality)
                .where(
                    and(
                        eq(personality.wikidata, wikidataId),
                        eq(personality.isDeleted, false)
                    )
                )
                .limit(1);
            if (existing) return this.toEntity(existing);
        }
        const slug = deriveSlug(data.name);

        // Slug-dedup + wikidata backfill (parity with the Mongo impl): if a
        // non-deleted personality already owns this slug, reuse it, and if it
        // has no wikidata yet but the item is usable, backfill it.
        const [existingBySlug] = await this.db
            .select()
            .from(personality)
            .where(
                and(
                    eq(personality.slug, slug),
                    eq(personality.isDeleted, false)
                )
            )
            .limit(1);
        if (existingBySlug) {
            if (wikidataId && !existingBySlug.wikidata) {
                const usable = await this.loadCreatableItem(wikidataId).then(
                    () => true,
                    () => false
                );
                if (usable) {
                    try {
                        const [updated] = await this.db
                            .update(personality)
                            .set({
                                wikidata: wikidataId,
                                updatedAt: new Date(),
                            })
                            .where(eq(personality.id, existingBySlug.id))
                            .returning();
                        return this.toEntity(updated);
                    } catch (error) {
                        this.rethrowMapped(error);
                    }
                }
            }
            return this.toEntity(existingBySlug);
        }

        if (!wikidataId) return null;
        try {
            return await this.create(
                { wikidata: wikidataId },
                { restoreDeleted: false }
            );
        } catch {
            return null;
        }
    }
    async getById(
        id: PersonalityRef,
        _options?: { language?: string; nameSpace?: string }
    ): Promise<IPersonality> {
        const idStr =
            typeof id === "string" ? id : (id as any)._id ?? (id as any).id;
        const [row] = await this.db
            .select()
            .from(personality)
            .where(
                and(eq(personality.id, idStr), eq(personality.isDeleted, false))
            )
            .limit(1);
        if (!row) {
            throw new NotFoundException(`Personality not found: ${idStr}`);
        }
        return this.toEntity(row);
    }
    async getPersonalityBySlug(
        query: any,
        _language?: string
    ): Promise<IPersonality> {
        const slug = typeof query === "string" ? query : query.slug;
        const [row] = await this.db
            .select()
            .from(personality)
            .where(
                and(
                    eq(personality.slug, slug),
                    eq(personality.isDeleted, false)
                )
            )
            .limit(1);
        if (!row) {
            throw new NotFoundException(
                `Personality not found by slug: ${slug}`
            );
        }
        return this.toEntity(row);
    }
    getClaimsByPersonalitySlug(_query: any, _language?: string): Promise<any> {
        return Promise.reject(
            new NotImplementedError("postgres", "getClaimsByPersonalitySlug")
        );
    }
    postProcess(_personality: any, _language?: string): Promise<any> {
        // Not DB-agnostic: the Mongo impl calls `this.getReviewStats(...)`
        // (which queries claim-review) and `this.extractClaimWithTextSummary`
        // (which expects claim shapes). Both are cross-collection methods that
        // throw on the postgres backend until claim/claim-review are ported.
        // Re-enable this once those dependencies are available.
        return Promise.reject(
            new NotImplementedError("postgres", "postProcess")
        );
    }
    getReviewStats(_id: string): Promise<any> {
        return Promise.reject(
            new NotImplementedError("postgres", "getReviewStats")
        );
    }
    /**
     * Admin edit of the stored fields. Never changes the slug (links to the
     * personality, its claims and reports keep working). A new Wikidata id
     * must pass the creation rule; both cache entries are cleared so the page
     * shows the new item at once. Writes no history, as for hide/unhide
     * today.
     */
    async update(
        id: string,
        body: { name?: string; description?: string; wikidata?: string }
    ): Promise<IPersonality> {
        const [stored] = await this.db
            .select()
            .from(personality)
            .where(
                and(eq(personality.id, id), eq(personality.isDeleted, false))
            )
            .limit(1);
        if (!stored)
            throw new NotFoundException(`Personality not found: ${id}`);

        const changes: Partial<
            Pick<PersonalityInsert, "name" | "description" | "wikidata">
        > = {};
        for (const key of ["name", "description", "wikidata"] as const) {
            if (body[key] !== undefined && body[key] !== stored[key]) {
                changes[key] = body[key];
            }
        }
        if (Object.keys(changes).length === 0) return this.toEntity(stored);

        if (changes.wikidata) {
            await this.loadCreatableItem(changes.wikidata, id);
        }

        let row: PersonalityRow | undefined;
        try {
            [row] = await this.db
                .update(personality)
                .set({ ...changes, updatedAt: new Date() })
                .where(
                    and(
                        eq(personality.id, id),
                        eq(personality.isDeleted, false)
                    )
                )
                .returning();
        } catch (error) {
            this.rethrowMapped(error);
        }
        if (!row) throw new NotFoundException(`Personality not found: ${id}`);

        if (changes.wikidata) {
            if (stored.wikidata) {
                await this.wikidata.clearCache(stored.wikidata);
            }
            await this.wikidata.clearCache(changes.wikidata);
        }
        return this.toEntity(row);
    }

    /**
     * Stored fields for the admin edit form, with what Wikidata currently
     * provides, so the form never shows the Wikidata-merged values.
     */
    async getStored(id: string) {
        const [stored] = await this.db
            .select()
            .from(personality)
            .where(
                and(eq(personality.id, id), eq(personality.isDeleted, false))
            )
            .limit(1);
        if (!stored)
            throw new NotFoundException(`Personality not found: ${id}`);

        let wikidataStatus:
            | "ok"
            | "deleted"
            | "not_allowed_type"
            | "unavailable"
            | "none" = "none";
        let props: { name?: string; description?: string } = {};
        if (stored.wikidata) {
            try {
                const checked = await this.wikidata.checkItem(
                    stored.wikidata,
                    "pt"
                );
                wikidataStatus = checked.status;
                props = checked.props;
            } catch {
                wikidataStatus = "unavailable";
            }
        }
        const provides = wikidataStatus === "ok";
        return {
            _id: stored.id,
            name: stored.name,
            description: stored.description,
            wikidata: stored.wikidata ?? null,
            wikidataStatus,
            wikidataProvides: {
                name: provides && !!props.name,
                description: provides && !!props.description,
            },
        };
    }
    async hideOrUnhidePersonality(
        id: string,
        isHidden: boolean,
        _description: string
    ) {
        // History writes are deferred until HistoryService is ported (see
        // docs/postgres-migration-foundation.md §7 — added back in the phase
        // that ports HistoryService).
        const patch: Record<string, any> = { isHidden, updatedAt: new Date() };
        const [row] = await this.db
            .update(personality)
            .set(patch)
            .where(
                and(eq(personality.id, id), eq(personality.isDeleted, false))
            )
            .returning();
        if (!row) throw new NotFoundException(`Personality not found: ${id}`);
        return this.toEntity(row);
    }
    async delete(id: string): Promise<void> {
        const patch: Record<string, any> = {
            isDeleted: true,
            deletedAt: new Date(),
            updatedAt: new Date(),
        };
        await this.db
            .update(personality)
            .set(patch)
            .where(
                and(eq(personality.id, id), eq(personality.isDeleted, false))
            );
    }
    async count(query?: any): Promise<number> {
        // Mongo parity: countDocuments().where({ ...query, isDeleted: false,
        // isHidden: query.isHidden || false }) — hidden rows are never counted
        // unless explicitly requested. Any other filter key (e.g. the
        // Mongo-shaped `name` regex from verifyInputsQuery) is unsupported
        // here until combinedListAll is ported — fail loud, not silently.
        const unsupportedKeys = Object.keys(query ?? {}).filter(
            (k) => k !== "isDeleted" && k !== "isHidden"
        );
        if (unsupportedKeys.length > 0) {
            throw new NotImplementedError(
                "postgres",
                `count(query.${unsupportedKeys.join(",query.")})`
            );
        }
        const [{ c }] = await this.db
            .select({ c: sql<number>`count(*)::int` })
            .from(personality)
            .where(
                and(
                    eq(personality.isDeleted, false),
                    eq(personality.isHidden, Boolean(query?.isHidden))
                )
            );
        return c;
    }
    extractClaimWithTextSummary(claims: any): any {
        return extractClaimWithTextSummary(claims);
    }
    verifyInputsQuery(query: any): any {
        // Ported verbatim from the Mongo impl. The returned shape is a Mongo
        // find filter (uses `$regex` / `$options`); consumers on the postgres
        // backend treat the regex form as opaque metadata until a postgres-
        // native query interpreter is wired up. Pure helper, no DB access.
        const queryInputs: any = {};
        if (query.name) {
            (queryInputs as Record<string, unknown>).name = {
                $regex: escapeRegex(query.name),
                $options: "i",
            };
        }
        queryInputs.isHidden = query?.isHidden || false;
        queryInputs.isDeleted = false;
        return queryInputs;
    }
    combinedListAll(_query: any): Promise<ICombinedListResult> {
        return Promise.reject(
            new NotImplementedError("postgres", "combinedListAll")
        );
    }
    async findAll(opts: IFindAllOptions): Promise<IFindAllResult> {
        const { searchText, pageSize, skippedDocuments } = opts;
        const skip = skippedDocuments ?? 0;
        const configured = Number(
            this.configService.get<number>("db.postgres.fuzzy_threshold")
        );
        // Coerced to a finite number so it can be safely inlined below —
        // Postgres `SET` does not accept bind parameters ($1), so the value
        // must be a literal, not a placeholder.
        const threshold = Number.isFinite(configured) ? configured : 0.3;

        // Mongo parity: findAll always excludes hidden AND deleted rows
        // ($match: { isHidden: false, isDeleted: false }) — it feeds public
        // search results.
        const visible = and(
            eq(personality.isDeleted, false),
            eq(personality.isHidden, false)
        );
        const where = searchText
            ? and(visible, sql`${personality.name} % ${searchText}`)
            : visible;

        const order = searchText
            ? sql`similarity(${personality.name}, ${searchText}) DESC`
            : desc(personality.createdAt);

        // Run inside a transaction so `SET LOCAL` and both queries share one
        // pooled connection (a plain `SET` could land on a different connection
        // than the query under a real pg.Pool). SET LOCAL is txn-scoped, so it
        // auto-resets and never leaks to the next user of the pooled connection.
        // The single transaction also gives rows + count a consistent snapshot.
        return this.db.transaction(async (tx) => {
            if (searchText) {
                await tx.execute(
                    sql.raw(
                        `SET LOCAL pg_trgm.similarity_threshold = ${threshold}`
                    )
                );
            }

            const rows = await tx
                .select()
                .from(personality)
                .where(where)
                .orderBy(order)
                .limit(pageSize)
                .offset(skip);

            const [{ c: totalRows }] = await tx
                .select({ c: sql<number>`count(*)::int` })
                .from(personality)
                .where(where);

            return {
                totalRows,
                processedPersonalities: rows.map((r) => this.toEntity(r)),
            };
        });
    }
}
