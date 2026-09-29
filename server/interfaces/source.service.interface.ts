import { ISource } from "./source.interface";

/**
 * Backend-neutral reference to a target entity (claim / claim-review): its id
 * as a string, or an id-shaped object (Mongo ObjectId instances qualify).
 * Interfaces must stay free of mongoose/drizzle types
 * (docs/postgres-migration-foundation.md §4.1).
 */
export type SourceTargetRef = string | object;

export type ISourceService = {
    listAll(options: {
        page: number;
        pageSize: string;
        order: string;
        nameSpace: string;
    }): Promise<ISource[]>;
    listAllDailySourceReviews(query: Record<string, any>): Promise<ISource[]>;
    create(data: any): Promise<ISource>;
    updateTargetId(
        sourceId: string,
        newTargetId: SourceTargetRef
    ): Promise<ISource>;
    getByTargetId(
        targetId: string,
        page: number,
        pageSize: number,
        order: string
    ): Promise<ISource[]>;
    find(match: Record<string, any>): any;
    getSourceByHref(href: string): Promise<ISource | null>;
    getById(sourceId: string): Promise<ISource | null>;
    getByDataHash(dataHash: string): Promise<ISource>;
    update(dataHash: string, sourceBodyUpdate: any): Promise<ISource>;
    count(query: Record<string, any>): Promise<number> | number;
};
