import { Logger } from "@nestjs/common";

export const DB_METRICS_ENV = "DB_METRICS";

export type DbMetricsSink = (sample: {
    token: string;
    backend: string;
    method: string;
    ms: number;
    error?: string;
}) => void;

const errorName = (error: unknown): string => {
    if (error instanceof Error) return error.name;
    if (typeof error === "string") return error;
    return typeof error;
};

const defaultSink: DbMetricsSink = (sample) => {
    new Logger("DbMetrics").log(JSON.stringify(sample));
};

/**
 * Wraps a backend service so every async method call reports its latency and
 * failure (DB_METRICS=1). Feeds the per-method p50/p95 comparison between
 * backends the ship gate asks for from Phase 1 on.
 */
export function withDbMetrics<T extends object>(
    token: string,
    backend: string,
    service: T,
    sink: DbMetricsSink = defaultSink
): T {
    return new Proxy(service, {
        get(target, property, receiver) {
            const value = Reflect.get(target, property, receiver);
            if (typeof value !== "function" || typeof property !== "string") {
                return value;
            }
            return (...args: unknown[]) => {
                const started = performance.now();
                const report = (error?: unknown) =>
                    sink({
                        token,
                        backend,
                        method: property,
                        ms:
                            Math.round((performance.now() - started) * 1000) /
                            1000,
                        ...(error !== undefined
                            ? {
                                  error: errorName(error),
                              }
                            : {}),
                    });
                let result: unknown;
                try {
                    result = value.apply(target, args);
                } catch (error) {
                    report(error);
                    throw error;
                }
                if (result instanceof Promise) {
                    return result.then(
                        (resolved) => {
                            report();
                            return resolved;
                        },
                        (error) => {
                            report(error);
                            throw error;
                        }
                    );
                }
                report();
                return result;
            };
        },
    });
}
