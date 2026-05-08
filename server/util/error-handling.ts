export interface AppError extends Error {
    code?: number | string;
    keyPattern?: Record<string, unknown>;
    keyValue?: Record<string, unknown>;
    errors?: Record<string, unknown>;
    path?: string;
    status?: number;
    response?: unknown;
}

export function toError(maybeError: unknown): AppError {
    if (maybeError instanceof Error) return maybeError as AppError;

    let message: string;
    try {
        message = JSON.stringify(maybeError);
    } catch {
        message = String(maybeError);
    }

    const normalizedError = new Error(message) as AppError;

    if (maybeError && typeof maybeError === "object") {
        Object.assign(normalizedError, maybeError);
    }

    return normalizedError;
}
