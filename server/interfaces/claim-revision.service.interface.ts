import type { IClaimRevision } from "./claim-revision.interface";
import type { IFindAllOptions } from "./personality.interface";

export type ClaimContentRef = string | { toString(): string };

export type IClaimRevisionService = {
    getRevision(match: Record<string, any>): Promise<IClaimRevision | null>;
    getRevisionById(id: string): Promise<IClaimRevision | null>;
    create(claimId: any, claim: Record<string, any>): Promise<IClaimRevision>;
    findAll(
        options: IFindAllOptions
    ): Promise<{ totalRows: number; processedRevisions: any[] }>;
    getByContentId(contentId: ClaimContentRef): Promise<IClaimRevision | null>;
};
