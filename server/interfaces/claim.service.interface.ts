import type { IClaim } from "./claim.interface";

export type ClaimListQuery = {
    isHidden?: boolean;
    nameSpace?: string;
    personalities?: any;
    isDeleted?: boolean;
    [key: string]: any;
};

export type IClaimService = {
    listAll(
        page: number,
        pageSize: number,
        order: string,
        query: ClaimListQuery
    ): Promise<{ data: any[]; total: number }>;
    count(query?: ClaimListQuery): Promise<number>;
    create(claim: Record<string, any>): Promise<any>;
    update(
        claimId: string,
        claimRevisionUpdate: Record<string, any>
    ): Promise<any>;
    delete(claimId: string): Promise<any>;
    hideOrUnhideClaim(
        claimId: string,
        isHidden: boolean,
        description?: string
    ): Promise<any>;
    getById(claimId: string, nameSpace?: string): Promise<any>;
    getByClaimSlug(
        claimSlug: string,
        revisionId?: string,
        population?: boolean
    ): Promise<any>;
    getByPersonalityId(
        personalityId: string,
        nameSpace?: string
    ): Promise<Array<Pick<IClaim, "_id">>>;
    getByPersonalityIdAndClaimSlug(
        personalityId: string,
        claimSlug: string,
        revisionId?: string,
        population?: boolean
    ): Promise<any>;
};
