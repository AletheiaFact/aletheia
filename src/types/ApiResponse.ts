export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    totalPages: number;
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

export type TranslationFn = (
    key: string,
    options?: Record<string, unknown>
) => string;
