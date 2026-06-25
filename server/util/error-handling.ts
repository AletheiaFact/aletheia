export interface AppError extends Error {
    code?: number | string;
    keyPattern?: Record<string, unknown>;
    keyValue?: Record<string, unknown>;
    errors?: Record<string, unknown>;
    path?: string;
    status?: number;
    response?: unknown;
}

export function toError(error: unknown): AppError {
    if (error instanceof Error) return error as AppError;

    let message: string;
    try {
        message = JSON.stringify(error);
    } catch {
        message = String(error);
    }

    const normalizedError = new Error(message) as AppError;

    if (error && typeof error === "object") {
        Object.assign(normalizedError, error);
    }

    return normalizedError;
}
