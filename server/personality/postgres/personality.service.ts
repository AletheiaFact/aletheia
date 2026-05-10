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
    async create(_personality: any): Promise<IPersonality> {
        throw new NotImplementedError("postgres", "create");
    }
    async getDeletedPersonalityByWikidata(_wikidata: string) {
        throw new NotImplementedError(
            "postgres",
            "getDeletedPersonalityByWikidata"
        );
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
        _id: string | LeanDocument<IPersonality>,
        _options?: { language?: string; nameSpace?: string }
    ): Promise<IPersonality> {
        throw new NotImplementedError("postgres", "getById");
    }
    async getPersonalityBySlug(
        _query: any,
        _language?: string
    ): Promise<IPersonality> {
        throw new NotImplementedError("postgres", "getPersonalityBySlug");
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
    async update(_id: string, _body: any): Promise<IPersonality> {
        throw new NotImplementedError("postgres", "update");
    }
    async hideOrUnhidePersonality(
        _id: string,
        _isHidden: boolean,
        _description: string
    ): Promise<any> {
        throw new NotImplementedError("postgres", "hideOrUnhidePersonality");
    }
    async delete(_id: string): Promise<void> {
        throw new NotImplementedError("postgres", "delete");
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
