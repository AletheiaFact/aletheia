/// <reference types="cypress" />
/// <reference types="@percy/cypress" />

import locators from "../../../support/locators";
import user from "../../../fixtures/user";

const login = (username: string, password: any): void => {
    cy.get(locators.login.BTN_LOGIN).should("be.visible");
    cy.get(locators.login.USER).should("be.empty").type(username);
    cy.get(locators.login.PASSWORD).type(password);
    cy.get(locators.login.BTN_LOGIN).click();
};

describe("Snapshot personality page", () => {
    // ATTENTION: Make sure to run the tests on the branch that corresponds to the URL of the environment being tested.
    // This ensures that snapshots are captured correctly and reflect the expected state of the application.
    // Example: Use the 'stage' branch for testing in the staging environment and 'main' for production.

    it("Environment personality page", () => {
        const environment = "Test";

        if (cy.isPercyEnabled()) {
            cy.log(`Percy está ativado? ${Cypress.env("PERCY_ENABLED")}`);

            cy.visit("https://test.aletheiafact.org");
            cy.title().should("contain", "AletheiaFact.org");
            cy.url().should("contains", "login");

            login("knascimento+qatest@aletheiafact.org", user.password);
            cy.title().should("contain", "AletheiaFact.org");
            cy.get(`${locators.claim.BTN_OK_TUTORIAL}`)
                .should("be.visible")
                .click();

            cy.get(locators.personality.BTN_SEE_MORE_PERSONALITY)
                .should("be.visible")
                .click();
            cy.url().should("contains", "personality");
            cy.percySnapshot(`${environment} - Personality page`, {
                widths: [768, 1024, 1028],
            });
        }
    });

    it("Production personality page", () => {
        const environment = "Production";

        if (cy.isPercyEnabled()) {
            cy.log(`Percy está ativado? ${Cypress.env("PERCY_ENABLED")}`);

            cy.visit("https://aletheiafact.org/login");
            cy.title().should("contain", "AletheiaFact.org");

            login("keikonichimoto@aletheiafact.org", user.password);
            cy.title().should("contain", "AletheiaFact.org");
            cy.get(`${locators.claim.BTN_OK_TUTORIAL}`)
                .should("be.visible")
                .click();

            cy.get(locators.personality.BTN_SEE_MORE_PERSONALITY)
                .should("be.visible")
                .click();
            cy.url().should("contains", "personality");
            cy.percySnapshot(`${environment} - Personality page`, {
                widths: [768, 1024, 1028],
            });
        }
    });
});
