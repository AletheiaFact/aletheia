/**
 * Stub for `@jest/globals` when running under Vitest.
 *
 * The real `@jest/globals` package throws if loaded outside a Jest environment.
 * Mock files in `server/mocks/` import `jest` from this package for type safety
 * under Jest. Under Vitest, we redirect imports here via `resolve.alias` so
 * the same `import { jest } from "@jest/globals"` returns Vitest's `vi`,
 * which exposes a Jest-compatible runtime API.
 *
 * TODO(vitest-phase2): Delete this file after Phase 2 (Jest removal). The mock
 * files in server/mocks/ should drop their `import { jest } from "@jest/globals"`
 * lines and rely on Vitest's globals (vi). Also remove the resolve.alias from
 * vitest.config.ts that points here.
 */
import { vi } from "vitest";

export const jest = vi;
export const expect: any = (globalThis as any).expect;
export const describe: any = (globalThis as any).describe;
export const it: any = (globalThis as any).it;
export const test: any = (globalThis as any).test;
export const beforeAll: any = (globalThis as any).beforeAll;
export const afterAll: any = (globalThis as any).afterAll;
export const beforeEach: any = (globalThis as any).beforeEach;
export const afterEach: any = (globalThis as any).afterEach;
