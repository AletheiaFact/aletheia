import { LeanDocument } from "mongoose";
import {
    ICombinedListResult,
    IFindAllOptions,
    IFindAllResult,
    IPersonality,
} from "./personality.interface";

//TODO: Create right types for all the functions
export interface IPersonalityService {
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
    getDeletedPersonalityByWikidata(wikidata: string);
    getById(
        personalityId: string | LeanDocument<IPersonality>,
        language?: string
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
    delete(personalityId: string): Promise<IPersonality>;
    count(query?: any);
    extractClaimWithTextSummary(claims: any): any;
    verifyInputsQuery(query: any): any;
    combinedListAll(query: any): Promise<ICombinedListResult>;
    findAll(options: IFindAllOptions): Promise<IFindAllResult>;
}
