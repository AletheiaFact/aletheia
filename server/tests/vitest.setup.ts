/**
 * Vitest setup file: aliases `jest` to `vi` so existing test files
 * and mock utilities using jest.fn(), jest.mock(), jest.spyOn(), etc.
 * work without modification under Vitest.
 *
 * Adds a `setTimeout` method to the jest alias since vi does not have a
 * direct equivalent (Vitest uses vi.setConfig({ testTimeout }) instead).
 *
 * TODO(vitest-phase2): This entire setup file is a Jest-compat shim. After
 * Phase 2 (Jest removal), migrate test files and mock utilities to use `vi`
 * directly (e.g., `vi.fn()`, `vi.spyOn()`, `vi.setConfig({ testTimeout })`)
 * and delete this file. The Proxy + jest alias adds a small but real runtime
 * overhead and obscures the actual mock library being used.
 */
import { vi } from "vitest";

const jestAlias: any = new Proxy(vi, {
    get(target, prop) {
        if (prop === "setTimeout") {
            return (timeout: number) => {
                vi.setConfig({ testTimeout: timeout });
            };
        }
        return (target as any)[prop];
    },
});

(globalThis as any).jest = jestAlias;
