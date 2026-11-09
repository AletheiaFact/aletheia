import { expect } from "vitest";
import {
    normalizeForParity,
    ParityOptions,
} from "../../scripts/parity/normalize";

export { normalizeForParity };

/**
 * Collects the same operation's result from each backend and asserts the
 * normalized shapes match once both are present (the contract suites run
 * backends in separate describe blocks, so the comparison is deferred).
 */
export class ParityRecorder {
    private readonly results = new Map<string, Map<string, unknown>>();

    constructor(private readonly options: ParityOptions = {}) {}

    record(key: string, backend: string, value: unknown) {
        if (!this.results.has(key)) this.results.set(key, new Map());
        this.results
            .get(key)!
            .set(backend, normalizeForParity(value, this.options));
    }

    /** Keys that were recorded by fewer than two backends. */
    incomplete(): string[] {
        return Array.from(this.results.entries())
            .filter(([, byBackend]) => byBackend.size < 2)
            .map(([key]) => key);
    }

    assertAll() {
        for (const [key, byBackend] of this.results) {
            const entries = Array.from(byBackend.entries());
            if (entries.length < 2) continue;
            const [[firstName, first], ...rest] = entries;
            for (const [name, value] of rest) {
                expect(
                    value,
                    `parity(${key}): ${name} vs ${firstName}`
                ).toEqual(first);
            }
        }
    }
}
