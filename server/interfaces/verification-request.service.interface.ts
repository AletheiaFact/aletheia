import type { IVerificationRequest } from "./verification-request.interface";
import type {
    StatsCount,
    StatsRecentActivity,
    StatsSourceChannels,
} from "../verification-request/dto/stats-verification-request-dto";

export type VerificationRequestFilters = {
    contentFilters?: string[];
    topics?: string[];
    severity?: string;
    sourceChannel?: string | string[];
    status?: string[];
    impactArea?: string[];
    startDate?: string;
    endDate?: string;
};

export type VerificationRequestListOptions = VerificationRequestFilters & {
    page: number;
    pageSize: string;
    order: "asc" | "desc" | 1 | -1;
};

export type VerificationRequestCreateInput = {
    content: string;
    impactArea?: { label?: string; value?: string } | string | null;
    source?: Array<{ href?: string }> | null;
    data_hash?: string;
    [key: string]: any;
};

export type AiTaskFieldParams = { targetId: string; field: string };

export type IVerificationRequestService = {
    listAll(
        options: VerificationRequestListOptions
    ): Promise<IVerificationRequest[]>;
    findAll(query: { searchContent?: string }): Promise<IVerificationRequest[]>;
    findBySourceUrl(
        sourceUrl: string,
        options?: { page?: number; pageSize?: number }
    ): Promise<IVerificationRequest[]>;
    getById(id: string): Promise<IVerificationRequest | null>;
    getByIdWithPopulatedFields(
        id: string,
        fieldsToPopulate?: string[]
    ): Promise<IVerificationRequest | null>;
    create(
        data: VerificationRequestCreateInput,
        user?: any
    ): Promise<IVerificationRequest>;
    createAiTask(taskDto: any): Promise<any>;
    updateFieldByAiTask(
        params: AiTaskFieldParams,
        result: any
    ): Promise<IVerificationRequest>;
    revalidateAndRunMissingStates(vr: IVerificationRequest): Promise<void>;
    triggerStateMachineForMissingState(
        vr: IVerificationRequest,
        missingState: string
    ): Promise<void>;
    findByDataHash(
        dataHash: string,
        populate?: boolean
    ): Promise<IVerificationRequest | null>;
    findRemovedIds(
        initial: { content: any[] },
        updated: { content: string[] }
    ): string[];
    removeVerificationRequestFromGroup(
        id: string,
        groupId: string
    ): Promise<IVerificationRequest>;
    update(
        id: string,
        body: Record<string, any>,
        postProcess?: boolean
    ): Promise<IVerificationRequest>;
    count(filters: VerificationRequestFilters): Promise<number>;
    createEmbedContent(content: string): Promise<number[]>;
    findSimilarRequests(
        queryEmbedding: number[],
        filter: string[],
        pageSize: number | string
    ): Promise<IVerificationRequest[]>;
    updateVerificationRequestWithTopics(
        topics: Array<{ value?: string; wikidataId?: string } | string>,
        dataHash: string
    ): Promise<IVerificationRequest | null>;
    checkAndRetryStaleAiTasks(): Promise<void>;
    manualOverrideField(
        id: string,
        field: string,
        value: any,
        userId: string
    ): Promise<IVerificationRequest>;
    cascadeUpdateDataHash(
        oldHash: string,
        newHash: string,
        session?: unknown
    ): Promise<number>;
};

export type VerificationRequestStats = {
    statsCount: StatsCount;
    statsSourceChannels: StatsSourceChannels[];
    statsRecentActivity: StatsRecentActivity[];
};

export type IVerificationRequestStatsService = {
    getStats(): Promise<VerificationRequestStats>;
};
