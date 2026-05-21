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
import { eq, and } from "drizzle-orm";
import { personality } from "./schema/personality.schema";
import type { PersonalityInsert } from "./schema/personality.schema";

@Injectable()
export class PostgresPersonalityService implements IPersonalityService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    async getWikidataEntities(_regex: string, _language: string): Promise<any> {
        throw new NotImplementedError("postgres", "getWikidataEntities");
    }
    async getWikidataList(
        _regex: string,
        _language: string
    ): Promise<string[]> {
        throw new NotImplementedError("postgres", "getWikidataList");
    }
    async listAll(
        _page: number,
        _pageSize: number,
        _order: string,
        _query: any,
        _language: string,
        _withSuggestions: boolean,
        _filter?: any
    ): Promise<IPersonality[]> {
        throw new NotImplementedError("postgres", "listAll");
    }
    async create(data: any): Promise<IPersonality> {
        const values: PersonalityInsert = {
            name: data.name,
            slug: data.slug,
            description: data.description,
            wikidata: data.wikidata ?? null,
            isHidden: data.isHidden ?? false,
        } as PersonalityInsert;
        const [row] = await this.db
            .insert(personality)
            .values(values)
            .returning();
        return row as unknown as IPersonality;
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
    async findOrCreatePersonality(_data: {
        name: string;
        wikidata?: {
            id?: string;
            label?: string;
            description?: string;
        };
    }): Promise<IPersonality> {
        throw new NotImplementedError("postgres", "findOrCreatePersonality");
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
        return row as unknown as IPersonality;
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
        return row as unknown as IPersonality;
    }
    async getClaimsByPersonalitySlug(
        _query: any,
        _language?: string
    ): Promise<any> {
        throw new NotImplementedError("postgres", "getClaimsByPersonalitySlug");
    }
    async postProcess(_personality: any, _language?: string): Promise<any> {
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
        return row as unknown as IPersonality;
    }
    async hideOrUnhidePersonality(
        _id: string,
        _isHidden: boolean,
        _description: string
    ): Promise<any> {
        throw new NotImplementedError("postgres", "hideOrUnhidePersonality");
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
    async count(_query?: any) {
        throw new NotImplementedError("postgres", "count");
    }
    extractClaimWithTextSummary(_claims: any): any {
        throw new NotImplementedError(
            "postgres",
            "extractClaimWithTextSummary"
        );
    }
    verifyInputsQuery(_query: any): any {
        throw new NotImplementedError("postgres", "verifyInputsQuery");
    }
    async combinedListAll(_query: any): Promise<ICombinedListResult> {
        throw new NotImplementedError("postgres", "combinedListAll");
    }
    async findAll(_options: IFindAllOptions): Promise<IFindAllResult> {
        throw new NotImplementedError("postgres", "findAll");
    }
}
