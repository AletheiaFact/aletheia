import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { IPersonalityService } from "../../interfaces/personality.service.interface";
import {
    IPersonality,
    ICombinedListResult,
    IFindAllOptions,
    IFindAllResult,
} from "../../interfaces/personality.interface";
import type { LeanDocument } from "mongoose";
import { DRIZZLE } from "../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../database/postgres/connection";
import { NotImplementedError } from "../../database/errors";
import { eq, and, sql, desc, asc } from "drizzle-orm";
import { deriveSlug, defaultDescription } from "../shared/personality.rules";
import { personality } from "./schema/personality.schema";
import type {
    PersonalityInsert,
    PersonalityRow,
} from "./schema/personality.schema";
import { escapeRegex } from "../../util/regex.util";
import { WikidataService } from "../../wikidata/wikidata.service";

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
        return { ...row, _id: row.id } as unknown as IPersonality;
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
    async create(data: any): Promise<IPersonality> {
        // Parity with the Mongo impl: if a soft-deleted personality already
        // holds this wikidata id, restore it instead of inserting a duplicate
        // (Mongo does `getDeletedPersonalityByWikidata(...).restore()`).
        if (data.wikidata) {
            const [deleted] = await this.db
                .select()
                .from(personality)
                .where(
                    and(
                        eq(personality.wikidata, data.wikidata),
                        eq(personality.isDeleted, true)
                    )
                )
                .limit(1);
            if (deleted) {
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
        }

        // Mongo always derives the slug from the name (it overwrites any passed
        // slug), so mirror that rather than honoring a caller-supplied slug.
        const values: PersonalityInsert = {
            name: data.name,
            slug: deriveSlug(data.name),
            description: data.description ?? "",
            wikidata: data.wikidata ?? null,
            isHidden: data.isHidden ?? false,
        };
        const [row] = await this.db
            .insert(personality)
            .values(values)
            .returning();
        return this.toEntity(row);
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
    async findOrCreatePersonality(data: {
        name: string;
        wikidata?: { id?: string; label?: string; description?: string };
    }): Promise<IPersonality> {
        const wikidataId = data.wikidata?.id ?? null;
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
        // non-deleted personality already owns this slug, reuse it — and if it
        // has no wikidata yet but we now have one, backfill it.
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
                const [updated] = await this.db
                    .update(personality)
                    .set({ wikidata: wikidataId, updatedAt: new Date() })
                    .where(eq(personality.id, existingBySlug.id))
                    .returning();
                return this.toEntity(updated);
            }
            return this.toEntity(existingBySlug);
        }

        const values: PersonalityInsert = {
            name: data.name,
            slug,
            description: defaultDescription(
                data.name,
                data.wikidata?.description
            ),
            wikidata: wikidataId,
        };
        const [created] = await this.db
            .insert(personality)
            .values(values)
            .returning();
        return this.toEntity(created);
    }
    async getById(
        id: string | LeanDocument<IPersonality>,
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
    async getClaimsByPersonalitySlug(
        _query: any,
        _language?: string
    ): Promise<any> {
        throw new NotImplementedError("postgres", "getClaimsByPersonalitySlug");
    }
    async postProcess(_personality: any, _language?: string): Promise<any> {
        // Not DB-agnostic: the Mongo impl calls `this.getReviewStats(...)`
        // (which queries claim-review) and `this.extractClaimWithTextSummary`
        // (which expects claim shapes). Both are cross-collection methods that
        // throw on the postgres backend until claim/claim-review are ported.
        // Re-enable this once those dependencies are available.
        throw new NotImplementedError("postgres", "postProcess");
    }
    async getReviewStats(_id: string): Promise<any> {
        throw new NotImplementedError("postgres", "getReviewStats");
    }
    async update(id: string, body: any): Promise<IPersonality> {
        const patch: Record<string, any> = { updatedAt: new Date() };
        for (const key of [
            "name",
            "slug",
            "description",
            "wikidata",
            "isHidden",
        ] as const) {
            if (body[key] !== undefined) patch[key] = body[key];
        }
        // Mongo parity: a name change re-derives the slug (caller-supplied
        // slugs are overridden by the derived one).
        if (body.name) {
            patch.slug = deriveSlug(body.name);
        }
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
    async hideOrUnhidePersonality(
        id: string,
        isHidden: boolean,
        _description: string
    ) {
        // History writes are deferred until HistoryService is ported (see
        // docs/superpowers/specs/2026-05-10-postgres-completion-checklist.md
        // — added back in the phase that ports HistoryService).
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
    extractClaimWithTextSummary(_claims: any): any {
        throw new NotImplementedError(
            "postgres",
            "extractClaimWithTextSummary"
        );
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
    async combinedListAll(_query: any): Promise<ICombinedListResult> {
        throw new NotImplementedError("postgres", "combinedListAll");
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

        const where = searchText
            ? and(
                  eq(personality.isDeleted, false),
                  sql`${personality.name} % ${searchText}`
              )
            : eq(personality.isDeleted, false);

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
