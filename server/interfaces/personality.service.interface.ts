import type {
    IFindAllOptions,
    IPersonality,
    IPersonalityCreateInput,
    IPersonalityFindAllResult,
    IPersonalityFindOrCreateInput,
    IPersonalityGetByIdOptions,
    IPersonalityListQuery,
    IPersonalityListResult,
    IPersonalityUpdateInput,
} from "./personality.interface";

export const PERSONALITY_SERVICE = "PersonalityService" as const;

export type IPersonalityService = {
    listAll(query: IPersonalityListQuery): Promise<IPersonality[]>;
    combinedListAll(
        query: IPersonalityListQuery
    ): Promise<IPersonalityListResult>;
    findAll(query: IFindAllOptions): Promise<IPersonalityFindAllResult>;

    getById(
        personalityId: string,
        options?: IPersonalityGetByIdOptions
    ): Promise<IPersonality | null>;

    getPersonalityBySlug(
        query: { slug: string; isHidden?: boolean; isDeleted?: boolean },
        language?: string
    ): Promise<IPersonality>;

    getClaimsByPersonalitySlug(
        query: { slug: string; isDeleted?: boolean },
        language?: string
    ): Promise<IPersonality & { claims: unknown[] }>;

    create(input: IPersonalityCreateInput): Promise<IPersonality>;
    update(
        personalityId: string,
        input: IPersonalityUpdateInput
    ): Promise<IPersonality | null>;
    findOrCreatePersonality(
        input: IPersonalityFindOrCreateInput
    ): Promise<IPersonality>;
    hideOrUnhidePersonality(
        personalityId: string,
        isHidden: boolean,
        description: string
    ): Promise<IPersonality>;
    delete(personalityId: string): Promise<unknown>;

    count(
        query?: Partial<IPersonality> & { isDeleted?: boolean }
    ): Promise<number>;
    // Review stats payload is owned by ClaimReviewService.
    getReviewStats(personalityId: string): Promise<unknown>;
};
