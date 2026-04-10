import { resolve } from "path";
import swc from "unplugin-swc";
import { defineConfig, type Plugin } from "vitest/config";

/**
 * Custom Vite plugin that rewrites `import * as request from "supertest"`
 * to `import request from "supertest"`. The legacy E2E tests rely on the
 * TypeScript+esModuleInterop pattern of treating namespace imports of CJS
 * modules as default imports. Under Vitest's true ESM transform, namespace
 * imports yield non-callable Module objects. This plugin rewrites the
 * import statement before SWC sees it so that supertest's callable export
 * is bound to `request` directly.
 *
 * TODO(vitest-phase2): Remove this plugin once the 6 E2E spec files in
 * server/tests/*.e2e.spec.ts are migrated to use `import request from "supertest"`
 * (default import) instead of `import * as request from "supertest"`. This is
 * tech debt from the Vitest migration where we chose not to touch test files.
 * Tracked in specs/2200-vitest-testing-setup/MIGRATION_NOTES.md.
 */
function supertestNamespaceImportRewrite(): Plugin {
    return {
        name: "supertest-namespace-import-rewrite",
        enforce: "pre",
        transform(code, id) {
            if (!id.endsWith(".ts") && !id.endsWith(".tsx")) return null;
            if (!code.includes("supertest")) return null;
            const rewritten = code.replace(
                /import\s*\*\s*as\s+(\w+)\s+from\s+(['"])supertest\2/g,
                "import $1 from $2supertest$2"
            );
            if (rewritten === code) return null;
            return { code: rewritten, map: null };
        },
    };
}

export default defineConfig({
    resolve: {
        alias: {
            // Redirect @jest/globals to a Vitest-compatible stub so that
            // shared mock files can use `import { jest } from "@jest/globals"`
            // under both Jest and Vitest without modification.
            //
            // TODO(vitest-phase2): Remove this alias when Jest is fully removed.
            // The mock files in server/mocks/ should drop the `@jest/globals`
            // import and rely on Vitest's globals (vi) directly. The stub file
            // server/tests/jest-globals-stub.ts can also be deleted.
            "@jest/globals": resolve(
                __dirname,
                "./server/tests/jest-globals-stub.ts"
            ),
        },
    },
    test: {
        globals: true,
        environment: "node",
        // TODO(vitest-phase2): forceExit was carried over from Jest's --forceExit
        // flag. Investigate hanging processes (mongoose connections, novu SDK,
        // open Node handles) and remove this once tests exit cleanly on their own.
        forceExit: true,
        setupFiles: ["./server/tests/vitest.setup.ts"],
        coverage: {
            provider: "v8",
            reporter: ["lcov"],
            reportsDirectory: "./coverage",
            include: ["server/**/*.ts", "src/**/*.ts"],
            exclude: [
                "**/node_modules/**",
                "**/dist/**",
                "**/docs/**",
                "**/*.spec.ts",
                "**/tests/**",
            ],
        },
        projects: [
            {
                extends: true,
                test: {
                    name: "unit",
                    include: ["server/**/*.spec.ts"],
                    exclude: ["server/tests/**", "server/**/dist/**"],
                },
            },
            {
                extends: true,
                test: {
                    name: "e2e",
                    include: ["server/tests/**/*.e2e.spec.ts"],
                    exclude: ["server/**/dist/**"],
                    globalSetup: "./server/tests/globalSetup.ts",
                    teardownTimeout: 10000,
                    testTimeout: 30000,
                    // TODO(vitest-phase2): E2E tests run sequentially
                    // (fileParallelism: false + maxWorkers: 1) because the
                    // test files share mongo collections without isolating
                    // per-file state. This is slower than necessary. Improve
                    // test isolation by:
                    // 1) Using a unique DB name per worker, or
                    // 2) Adding stronger CleanupDatabase calls between suites,
                    // then re-enable parallel execution for ~3-5x speedup.
                    //
                    // Note: Vitest 4 removed `poolOptions.forks.singleFork`.
                    // The replacement is `fileParallelism: false` plus
                    // `maxWorkers: 1` (and `minWorkers: 1`) to force a single
                    // worker process running files sequentially.
                    pool: "forks",
                    fileParallelism: false,
                    maxWorkers: 1,
                    minWorkers: 1,
                },
            },
        ],
    },
    plugins: [supertestNamespaceImportRewrite(), swc.vite()],
    // unplugin-swc v1.5.x sets esbuild: false, but Vitest 4 uses Oxc instead.
    // TODO(vitest-phase2): Remove this workaround when unplugin-swc publishes a
    // version that sets `oxc: false` itself. Track upstream:
    // https://github.com/unplugin/unplugin-swc/issues/210
    oxc: false,
});
