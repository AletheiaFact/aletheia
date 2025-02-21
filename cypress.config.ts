import { defineConfig } from "cypress";

export default defineConfig({
    chromeWebSecurity: false,
    video: false,
    screenshotOnRunFailure: false,
    pageLoadTimeout: 480000,
    defaultCommandTimeout: 65000,

    e2e: {
        baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
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
