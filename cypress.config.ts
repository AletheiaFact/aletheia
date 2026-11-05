import { defineConfig } from "cypress";

export default defineConfig({
    chromeWebSecurity: false,
    video: false,
    screenshotOnRunFailure: true,
    // Fail fast: a missing element used to wait 65s per assertion, so one
    // broken spec could add 10+ minutes. Raise per command when needed.
    pageLoadTimeout: 60000,
    defaultCommandTimeout: 20000,
    retries: { runMode: 1, openMode: 0 },

    e2e: {
        baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        specPattern: [
            "cypress/e2e/tests/**/!(event).cy.ts",
            "cypress/e2e/tests/event.cy.ts"
        ],
        setupNodeEvents(on, config) {
            return require("./cypress/plugins/index.ts").default(on, config);
        },
    },

    component: {
        devServer: {
            framework: "next",
            bundler: "webpack",
        },
    },
});
