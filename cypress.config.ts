import { defineConfig } from "cypress";

export default defineConfig({
    chromeWebSecurity: false,
    video: false,
    screenshotOnRunFailure: false,
    pageLoadTimeout: 480000,
    defaultCommandTimeout: 100000,
    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents(on, config) {
            return require("./cypress/plugins/index.ts").default(on, config);
        },
    },
});
