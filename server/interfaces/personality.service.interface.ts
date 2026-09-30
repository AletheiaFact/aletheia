import {
    ICombinedListResult,
    IFindAllOptions,
    IFindAllResult,
    IPersonality,
} from "./personality.interface";

/**
 * Backend-neutral reference to a personality: either its id as a string or
 * an entity-shaped object carrying `_id`/`id` (implementations read those
 * keys). Interfaces must stay free of mongoose/drizzle types
 * (docs/postgres-migration-foundation.md §4.1).
 */
export type PersonalityRef = string | object;

export type IPersonalityService = {
    getWikidataEntities(regex: string, language: string): Promise<any>;
    getWikidataList(regex: string, language: string): Promise<string[]>;
    listAll(
        page: number,
        pageSize: number,
        order: string,
        query: any,
        language: string,
        withSuggestions: boolean,
        filter?: any
    ): Promise<IPersonality[]>;
    create(personality: any): Promise<IPersonality>;
    getDeletedPersonalityByWikidata(wikidata: string): Promise<any>;
    findOrCreatePersonality(personalityData: {
        name: string;
        wikidata?: {
            id?: string;
            label?: string;
            description?: string;
        };
    }): Promise<IPersonality>;
    getById(
        personalityId: PersonalityRef,
        options?: { language?: string; nameSpace?: string }
    ): Promise<IPersonality>;
    getPersonalityBySlug(query: any, language?: string): Promise<IPersonality>;
    getClaimsByPersonalitySlug(query: any, language?: string): Promise<any>;
    postProcess(personality: any, language?: string): Promise<any>;
    getReviewStats(_id: string): Promise<any>;
    update(
        personalityId: string,
        newPersonalityBody: any
    ): Promise<IPersonality>;
    hideOrUnhidePersonality(
        personalityId: string,
        isHidden: boolean,
        description: string
    ): Promise<any>;
    delete(personalityId: string): Promise<void>;
    count(query?: any): Promise<number> | number;
    extractClaimWithTextSummary(claims: any): any;
    verifyInputsQuery(query: any): any;
    combinedListAll(query: any): Promise<ICombinedListResult>;
    findAll(options: IFindAllOptions): Promise<IFindAllResult>;
};
