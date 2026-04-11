import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
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
                    // Per-worker setup file: reads the shared MongoMemoryServer
                    // base URI from globalSetup's `provide("mongoBaseUri", ...)`
                    // and assigns each worker its own database name. This is
                    // what unblocks parallel e2e execution — without it, all
                    // workers would share the same DB and race on collections.
                    setupFiles: ["./server/tests/per-worker-setup.ts"],
                    teardownTimeout: 10000,
                    testTimeout: 30000,
                    pool: "forks",
                },
            },
        ],
    },
    plugins: [swc.vite()],
    // unplugin-swc v1.5.x sets `esbuild: false`, but Vitest 4 uses Oxc as the
    // default transformer. Setting `oxc: false` here disables Oxc so SWC is the
    // sole TypeScript transformer (required for NestJS decorator metadata).
    // Tracked upstream: https://github.com/unplugin/unplugin-swc/issues/210
    oxc: false,
});
