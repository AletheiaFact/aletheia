import { Injectable, Inject } from "@nestjs/common";
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
import slugify from "slugify";
import { personality } from "./schema/personality.schema";
import type { PersonalityInsert } from "./schema/personality.schema";
import { escapeRegex } from "../../util/regex.util";
import { WikidataService } from "../../wikidata/wikidata.service";

@Injectable()
export class PostgresPersonalityService implements IPersonalityService {
    constructor(
        @Inject(DRIZZLE) private readonly db: DrizzleClient,
        private readonly wikidata: WikidataService
    ) {}

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
        _query: any,
        _language: string,
        _withSuggestions: boolean,
        _filter?: any
    ): Promise<IPersonality[]> {
        // NOTE: the `query` object is currently ignored on the postgres backend.
        // The Mongo impl interprets it as a Mongo find filter; porting that surface
        // is tracked in the completion checklist as a Phase 0 follow-up.
        const orderBy =
            order === "asc"
                ? asc(personality.createdAt)
                : desc(personality.createdAt);
        const rows = await this.db
            .select()
            .from(personality)
            .where(eq(personality.isDeleted, false))
            .orderBy(orderBy)
            .limit(pageSize)
            .offset(page * pageSize);
        return rows as IPersonality[];
    }
    async create(data: any): Promise<IPersonality> {
        const values: PersonalityInsert = {
            name: data.name,
            slug: data.slug,
            description: data.description,
            wikidata: data.wikidata ?? null,
            isHidden: data.isHidden ?? false,
        };
        const [row] = await this.db
            .insert(personality)
            .values(values)
            .returning();
        return row as IPersonality;
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
        return row ?? null;
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
            if (existing) return existing as IPersonality;
        }
        const slug = slugify(data.name, { lower: true, strict: true });
        const values: PersonalityInsert = {
            name: data.name,
            slug,
            description: data.wikidata?.description ?? "",
            wikidata: wikidataId,
        };
        const [created] = await this.db
            .insert(personality)
            .values(values)
            .returning();
        return created as IPersonality;
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
            throw new Error(`Personality not found: ${idStr}`);
        }
        return row as IPersonality;
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
            throw new Error(`Personality not found by slug: ${slug}`);
        }
        return row as IPersonality;
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
        const [row] = await this.db
            .update(personality)
            .set(patch)
            .where(
                and(eq(personality.id, id), eq(personality.isDeleted, false))
            )
            .returning();
        if (!row) throw new Error(`Personality not found: ${id}`);
        return row as IPersonality;
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
        if (!row) throw new Error(`Personality not found: ${id}`);
        return row;
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
    async count(_query?: any): Promise<number> {
        const [{ c }] = await this.db
            .select({ c: sql<number>`count(*)::int` })
            .from(personality)
            .where(eq(personality.isDeleted, false));
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

        // Set the trigram threshold once per session. pglite supports SET via
        // session-scoped state; the threshold isn't load-bearing for correctness,
        // only for ranking, so a session-level SET is fine here.
        await this.db.execute(sql`SET pg_trgm.similarity_threshold = 0.3`);

        const where = searchText
            ? and(
                  eq(personality.isDeleted, false),
                  sql`${personality.name} % ${searchText}`
              )
            : eq(personality.isDeleted, false);

        const order = searchText
            ? sql`similarity(${personality.name}, ${searchText}) DESC`
            : desc(personality.createdAt);

        const rows = await this.db
            .select()
            .from(personality)
            .where(where)
            .orderBy(order)
            .limit(pageSize)
            .offset(skip);

        const [{ c: totalRows }] = await this.db
            .select({ c: sql<number>`count(*)::int` })
            .from(personality)
            .where(where);

        return {
            totalRows,
            processedPersonalities: rows as IPersonality[],
        };
    }
}
