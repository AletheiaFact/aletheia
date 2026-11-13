import { TFunction } from "i18next";

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    totalPages: number;
    // Sent by the repository list endpoints when a filter is applied
    contentModelCounts?: Record<string, number>;
}

export interface ClaimCreateResponse {
    _id?: string;
    title: string;
    path: string;
}

export interface PasswordChangeResponse {
    success: boolean;
    message: string;
}

export type TranslationFn = TFunction;
